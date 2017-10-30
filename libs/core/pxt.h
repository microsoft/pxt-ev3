#ifndef __PXT_H
#define __PXT_H

#include "pxtbase.h"

namespace pxt {
void raiseEvent(int id, int event);
int allocateNotifyEvent();
void sleep_core_us(uint64_t us);

class Button;
typedef Button *Button_;

extern "C" void target_init();


class MMap : public RefObject {
  public:
    int length;
    int fd;
    uint8_t *data;

    MMap();
    void destroy();
    void print();
};

extern volatile bool paniced;

// Buffer and Image share representation.
typedef Buffer Image;

}

#define DEVICE_EVT_ANY 0
#define DEVICE_ID_NOTIFY 10000
#define DEVICE_ID_NOTIFY_ONE 10001

#endif
