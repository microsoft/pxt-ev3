#include "pxt.h"

#include <sys/types.h>
#include <unistd.h>
#include <sys/stat.h>
#include <fcntl.h>

namespace storage {

/** Will be moved. */
//%
Buffer __stringToBuffer(String s) {
    return mkBuffer((uint8_t *)s->data, s->length);
}

/** Will be moved. */
//%
String __bufferToString(Buffer s) {
    return mkString((char*)s->data, s->length);
}

//%
void __init() {
    // do nothing
}

//%
void __unlink(String filename) {
    ::unlink(filename->data);
}

//%
void __truncate(String filename) {
    int fd = open(filename->data, O_CREAT | O_TRUNC | O_WRONLY, 0777);
    close(fd);
}

/** Create named directory. */
//%
void __mkdir(String filename) {
    ::mkdir(filename->data, 0777);
}

} // namespace storage
