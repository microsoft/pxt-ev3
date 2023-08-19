#include "pxt.h"

#include <sys/types.h>
#include <unistd.h>
#include <sys/stat.h>
#include <fcntl.h>

namespace storage {

/** Will be moved. */
//%
Buffer __stringToBuffer(String s) {
    return mkBuffer((uint8_t *)PXT_STRING_DATA(s), PXT_STRING_DATA_LENGTH(s));
}

/** Will be moved. */
//%
String __bufferToString(Buffer s) {
    return mkString((char*)PXT_BUFFER_DATA(s), PXT_BUFFER_LENGTH(s));
}

//%
void __init() {
    // do nothing
}

//%
void __unlink(String filename) {
    ::unlink(PXT_STRING_DATA(filename));
}

//%
void __truncate(String filename) {
    int fd = open(PXT_STRING_DATA(filename), O_CREAT | O_TRUNC | O_WRONLY, 0777);
    close(fd);
}

/** Create named directory. */
//%
void __mkdir(String filename) {
    ::mkdir(PXT_STRING_DATA(filename), 0777);
}

} // namespace storage
