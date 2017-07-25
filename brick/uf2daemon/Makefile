CFLAGS =  -std=c99 -W -Wall 
SRC = main.c fat.c

all:
	gcc -DX86=1 -g $(CFLAGS) $(SRC) -o server86
	arm-none-linux-gnueabi-gcc -Os -s $(CFLAGS) $(SRC) -o server
