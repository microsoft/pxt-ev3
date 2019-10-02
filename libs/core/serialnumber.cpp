#include "pxt.h"

#include <sys/socket.h>
#include <sys/ioctl.h>
#include <unistd.h>

#define BTPROTO_HCI 1
#define HCIGETDEVLIST _IOR('H', 210, int)
#define HCIGETDEVINFO _IOR('H', 211, int)

struct hci_dev_info {
    uint16_t dev_id;
    char name[8];
    uint8_t bdaddr[6];
    uint32_t padding[32];
};

struct hci_dev_req {
    uint16_t dev_id;
    uint32_t dev_opt;
};

struct hci_dev_list_req {
    uint16_t dev_num;
    hci_dev_req dev_req[2];
};

static uint64_t bt_addr() {
    uint64_t res = -1;

    int fd = socket(AF_BLUETOOTH, SOCK_RAW, BTPROTO_HCI);
    if (fd < 0) {
        DMESG("BT_ADDR: can't open HCI socket");
        return res;
    }

    hci_dev_list_req dl;
    dl.dev_num = 1;

    if (ioctl(fd, HCIGETDEVLIST, (void *)&dl) < 0) {
        DMESG("BT_ADDR: can't get HCI device list");
        goto done;
    }

    hci_dev_info di;
    di.dev_id = dl.dev_req[0].dev_id;

    if (ioctl(fd, HCIGETDEVINFO, (void *)&di) < 0) {
        DMESG("BT_ADDR: can't get HCI device info");
        goto done;
    }

    res = 0;
    memcpy(&res, di.bdaddr, 6);

done:
    close(fd);
    return res;
}

namespace pxt {

uint64_t getLongSerialNumber() {
    static uint64_t serial;
    if (serial == 0)
        serial = bt_addr();
    return serial;
}

} // namespace pxt
