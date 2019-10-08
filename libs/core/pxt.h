#ifndef __PXT_H
#define __PXT_H

#include "pxtbase.h"

void *xmalloc(size_t sz);

namespace pxt {
void raiseEvent(int id, int event);
int allocateNotifyEvent();
void sleep_core_us(uint64_t us);
void startUser();
void stopUser();
int tryLockUser();

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

    static void scan(MMap *);
    static unsigned gcsize(MMap *);
};

extern volatile bool paniced;
void target_exit();

// Buffer, Sound, and Image share representation.
typedef Buffer Sound;

}

#define DEVICE_EVT_ANY 0
#define DEVICE_ID_NOTIFY 10000
#define DEVICE_ID_NOTIFY_ONE 10001

#define IMAGE_BITS 1

#endif
