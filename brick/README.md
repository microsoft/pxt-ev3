# Support code to run on EV3 brick

## Kernel module

Kernel module is based on LEGO's `d_usbdev` module, with the addition of slightly modified `g_mass_storage`
module from the Linux kernel. The module and supporting sources are licensed under GPLv2 (since
they are derived from GPLv2 code).

### Modifications

* the `d_usbdev` uses the composite framework to register an additional mass storage function in addtion
  to the pre-existing custom USB HID function
* the `g_mass_storage` module has the following changes:
  * a bug fixed, where page-misaligned writes would hang
  * additional `/sys/.../lun0/active` entry is added, which allows for signaling drive eject to the host

### Kernel modifications

The kernel itself has modified FIFO queue sizes. The LEGO kernel uses `1024` for `ep1in` and `ep1out`,
and then `64` for `ep2` and `ep3`. Note that this is non-standard modification done with a kernel patch,
that I didn't manage to find.  The MSD requires `512` for `ep2` and `ep3`. I have binary edited the kernel
to do so.

Note that there's 4k of FIFO memory in the hardware. If you set the queue sizes with a sum of more than
4k, the kernel will hang, and you will not know why.

## UF2 Daemon

The [UF2](https://github.com/Microsoft/uf2) daemon is based on 
[UF2 ATSAMD21](https://github.com/Microsoft/uf2-samd21) bootloader code. It exposes a virtual
FAT16 file system over Linux Network Block Device interface (`/dev/nbd0` to be precise).
This device is then exposed via the `g_mass_storage` module to the host computer.

The Daemon is licensed under MIT.
