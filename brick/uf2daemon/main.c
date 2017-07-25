#define _GNU_SOURCE 1

#include <sys/types.h>
#include <linux/nbd.h>
#include <linux/types.h>
#include <linux/fs.h>
#include <assert.h>
#include <errno.h>
#include <fcntl.h>
#include <netinet/in.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <sys/ioctl.h>
#include <sys/socket.h>
#include <sys/stat.h>
#include <unistd.h>
#include <sys/wait.h>

#include "uf2.h"

#define NUM_BLOCKS NUM_FAT_BLOCKS

uint64_t ntohll(uint64_t a) {
    return ((uint64_t)ntohl(a & 0xffffffff) << 32) | ntohl(a >> 32);
}
#define htonll ntohll

void readAll(int fd, void *dst, uint32_t length) {
    while (length) {
        int curr = read(fd, dst, length);
        if (curr < 0)
            FAIL("read failed on fd:%d", fd);
        length -= curr;
        dst = (char *)dst + curr;
    }
}

void writeAll(int fd, void *dst, uint32_t length) {
    while (length) {
        int curr = write(fd, dst, length);
        if (curr < 0)
            FAIL("write failed on fd:%d", fd);
        length -= curr;
        dst = (char *)dst + curr;
    }
}

int nbd;
int sock;
int sockets[2];
struct nbd_request request;
struct nbd_reply reply;

void nbd_ioctl(unsigned id, int arg) {
    int err = ioctl(nbd, id, arg);
    if (err < 0)
        FAIL("ioctl(%ud) failed [%s]", id, strerror(errno));
}

void startclient() {
    close(sockets[0]);
    nbd_ioctl(NBD_SET_SOCK, sockets[1]);
    nbd_ioctl(NBD_DO_IT, 0);
    nbd_ioctl(NBD_CLEAR_QUE, 0);
    nbd_ioctl(NBD_CLEAR_SOCK, 0);
    exit(0);
}

#define dev_file "/dev/nbd0"

void handleread(int off, int len) {
    uint8_t buf[512];
    LOG("read @%d len=%d", off, len);
    reply.error = 0; //  htonl(EPERM);
    writeAll(sock, &reply, sizeof(struct nbd_reply));
    for (int i = 0; i < len; ++i) {
        read_block(off + i, buf);
        writeAll(sock, buf, 512);
    }
}

void handlewrite(int off, int len) {
    uint8_t buf[512];
    LOG("write @%d len=%d", off, len);
    for (int i = 0; i < len; ++i) {
        readAll(sock, buf, 512);
        write_block(off + i, buf);
    }
    reply.error = 0;
    writeAll(sock, &reply, sizeof(struct nbd_reply));
}

void setupFs();

void runNBD() {
    setupFs();

    int err = socketpair(AF_UNIX, SOCK_STREAM, 0, sockets);
    assert(err >= 0);

    nbd = open(dev_file, O_RDWR);
    assert(nbd >= 0);

    nbd_ioctl(BLKFLSBUF, 0);
    nbd_ioctl(NBD_SET_BLKSIZE, 512);
    nbd_ioctl(NBD_SET_SIZE_BLOCKS, NUM_BLOCKS);
    nbd_ioctl(NBD_CLEAR_SOCK, 0);

    if (!fork())
        startclient();

    int fd = open(dev_file, O_RDONLY);
    assert(fd != -1);
    close(fd);

    close(sockets[1]);
    sock = sockets[0];

    reply.magic = htonl(NBD_REPLY_MAGIC);
    reply.error = htonl(0);

    for (;;) {
        nbd_ioctl(BLKFLSBUF, 0); // flush buffers - we don't want the kernel to cache the writes
        int nread = read(sock, &request, sizeof(request));

        if (nread < 0) {
            FAIL("nbd read err %s", strerror(errno));
        }
        if (nread == 0)
            return;
        assert(nread == sizeof(request));
        memcpy(reply.handle, request.handle, sizeof(reply.handle));
        reply.error = htonl(0);

        assert(request.magic == htonl(NBD_REQUEST_MAGIC));

        uint32_t len = ntohl(request.len);
        assert((len & 511) == 0);
        len >>= 9;
        uint64_t from = ntohll(request.from);
        assert((from & 511) == 0);
        from >>= 9;

        switch (ntohl(request.type)) {
        case NBD_CMD_READ:
            handleread(from, len);
            break;
        case NBD_CMD_WRITE:
            handlewrite(from, len);
            break;
        case NBD_CMD_DISC:
            return;
        default:
            FAIL("invalid cmd: %d", ntohl(request.type));
        }
    }
}

void enableMSD(int enabled) {
#ifndef X86
    int fd = open("/sys/devices/platform/musb_hdrc/gadget/lun0/active", O_WRONLY);
    write(fd, enabled ? "1" : "0", 1);
    close(fd);
#else
    LOG("fake enable MSD: %d", enabled);
#endif
}

int main() {
#ifndef X86
    daemon(0, 1);
#endif

    for (;;) {
        pid_t child = fork();
        if (child == 0) {
            runNBD();
            return 0;
        }

        sleep(1);
        enableMSD(1);

        int wstatus = 0;
        waitpid(child, &wstatus, 0);
        enableMSD(0); // force "eject"

        if (!WIFEXITED(wstatus) || WEXITSTATUS(wstatus) != 0) {
            LOG("abnormal child return, %d", child);
            sleep(5);
        } else {
            sleep(2);
        }
    }

    return 0;
}