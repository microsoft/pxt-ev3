#include "pxt.h"
#include "ev3const.h"

namespace output {

/**
 * Create a new zero-initialized buffer.
 * @param size number of bytes in the buffer
 */
//%
Buffer createBuffer(int size) {
    return mkBuffer(NULL, size);
}

}

namespace pxt {

void target_init() {
}

}
