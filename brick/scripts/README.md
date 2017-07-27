# Patched EV3 image

The file `ev3-fs.patch` summarizes the changes done to the original V1.09D image.
You can see some text files are edited, the `d_usbdev.ko` is updated (sources in `../kernel`),
`uf2d` added (sources in `../uf2daemon`), and a stock `nbd.ko` module is added.

Additionally, the `edimax01.ko` is replaced by now much more popular `rtl8192cu.ko` (also stock).

The init script has a hook for running a shell script from `/mnt/ramdisk/`. This can be used
for testing different modules etc.

The kernel command line has been modified to:
* disable DMA for the MUSB driver - otherwise the mass storage device is very unstable
* increase the size of dmesg buffer to 128k
