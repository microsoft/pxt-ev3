#include "pxt.h"
#include "ev3.h"

namespace output {

/**
 * Create a new zero-initialized buffer.
 * @param size number of bytes in the buffer
 */
//%
Buffer createBuffer(int size) {
    return mkBuffer(NULL, size);
}

extern "C" int WriteToPWMDevice(char *bytes, int num_bytes);

//%
void writePWM(Buffer buf) {
    WriteToPWMDevice((char *)buf->data, buf->length);
}
}

namespace pxt {

void target_init() {
    OutputInit();
}

}
