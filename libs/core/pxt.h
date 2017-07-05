#ifndef __PXT_H
#define __PXT_H

#include "pxtbase.h"
#undef DMESG

#define ID_BUTTON_BASE 100

namespace pxt {
void raiseEvent(int id, int event);
void sleep_core_us(uint64_t us);

class Button;
typedef Button *Button_;

}

#endif
