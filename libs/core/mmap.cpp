#include "pxt.h"

#include <unistd.h>
#include <sys/mman.h>
#include <sys/types.h>
#include <sys/stat.h>
#include <fcntl.h>
#include <sys/ioctl.h>

namespace pxt {
PXT_VTABLE_CTOR(MMap) {
    length = 0;
    fd = -1;
    data = 0;
}

void MMap::print() {
    DMESG("MMap %p r=%d len=%d fd=%d data=%p", this, refcnt, length, fd, data);
}

void MMap::destroy() {
    munmap(data, length);
    close(fd);
}
}

namespace control {

/** Create new file mapping in memory */
//%
MMap *mmap(String filename, int size, int offset) {
    DMESG("mmap %s len=%d off=%d", filename->data, size, offset);
    int fd = open(filename->data, O_RDWR, 0);
    if (fd < 0)
        return 0;

    void *data = ::mmap(NULL, size, PROT_READ | PROT_WRITE, MAP_SHARED, fd, offset);
    if (data == MAP_FAILED) {
        close(fd);
        return 0;
    }

    auto r = new MMap();
    r->fd = fd;
    r->length = size;
    r->data = (uint8_t *)data;
    return r;
}
}

namespace MMapMethods {

/**
 * Write a number in specified format in the buffer.
 */
//%
void setNumber(MMap *buf, NumberFormat format, int offset, TNumber value) {
    if (offset < 0)
        return;
    setNumberCore(buf->data + offset, buf->length - offset, format, value);
}

/**
 * Read a number in specified format from the buffer.
 */
//%
TNumber getNumber(MMap *buf, NumberFormat format, int offset) {
    if (offset < 0)
        return fromInt(0);
    return getNumberCore(buf->data + offset, buf->length - offset, format);
}

/** Returns the length of a Buffer object. */
//% property
int length(MMap *s) {
    return s->length;
}

/** Perform ioctl(2) on the underlaying file */
//%
void ioctl(MMap *mmap, uint32_t id, Buffer data) {
    ::ioctl(mmap->fd, id, data->data);
}

}