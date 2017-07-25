all: mod uf2

mod:
	$(MAKE) -C .. MOD=d_usbdev M=`pwd`/kernel ARCH=arm CROSS_COMPILE=arm-none-linux-gnueabi-
	@mkdir -p bin
	cp kernel/*.ko bin/

uf2:
	$(MAKE) -C uf2daemon
	@mkdir -p bin
	cp uf2daemon/server bin/uf2daemon

