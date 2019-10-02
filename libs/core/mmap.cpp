#include "pxt.h"

#include <unistd.h>
#include <sys/mman.h>
#include <sys/types.h>
#include <sys/stat.h>
#include <fcntl.h>
#include <sys/ioctl.h>

/**
* Mode for lseek()
*/
enum class SeekWhence {
    Set = 0,
    Current = 1,
    End = 2,
};


namespace pxt {
PXT_VTABLE_CTOR(MMap) {
    length = 0;
    fd = -1;
    data = 0;
}

void MMap::print() {
    DMESG("MMap %p len=%d fd=%d data=%p", this, length, fd, data);
}

void MMap::destroy() {
    munmap(data, length);
    close(fd);
}

void MMap::scan(MMap *) {}

unsigned MMap::gcsize(MMap *) {
    return TOWORDS(sizeof(MMap));
}

}

namespace control {

/** Create new file mapping in memory */
//%
MMap *mmap(String filename, int size, int offset) {
    DMESG("mmap %s len=%d off=%d", filename->getUTF8Data(), size, offset);
    int fd = open(filename->getUTF8Data(), O_RDWR, 0);
    if (fd < 0)
        return 0;
    
    void *data = NULL;
    if (size > 0) {
        data = ::mmap(NULL, size, PROT_READ | PROT_WRITE, MAP_SHARED, fd, offset);
        if (data == MAP_FAILED) {
            close(fd);
            return 0;
        }
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

/**
 * Read a range of bytes into a buffer.
 */
//%
Buffer slice(MMap *buf, int offset = 0, int length = -1) {
    offset = min((int)buf->length, offset);
    if (length < 0)
        length = buf->length;
    length = min(length, buf->length - offset);
    return mkBuffer(buf->data + offset, length);
}

/** Returns the length of a Buffer object. */
//% property
int length(MMap *s) {
    return s->length;
}

/** Perform ioctl(2) on the underlaying file */
//%
int ioctl(MMap *mmap, uint32_t id, Buffer data) {
    return ::ioctl(mmap->fd, id, data->data);
}


/** Perform write(2) on the underlaying file */
//%
int write(MMap *mmap, Buffer data) {
    return ::write(mmap->fd, data->data, data->length);
}


/** Perform read(2) on the underlaying file */
//%
int read(MMap *mmap, Buffer data) {
    return ::read(mmap->fd, data->data, data->length);
}

/** Set pointer on the underlaying file. */
//%
int lseek(MMap *mmap, int offset, SeekWhence whence) {
    return ::lseek(mmap->fd, offset, (int)whence);
}

}