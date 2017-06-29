include Makefile.inc

COMMON_FLAGS = -W -Wall -Ipxtapp -fwrapv -fno-threadsafe-statics 
CFLAGS = $(COMMON_FLAGS) -std=c99
CXXFLAGS = $(COMMON_FLAGS) -std=c++11 -fno-rtti -fno-exceptions -fno-unwind-tables
LDFLAGS = -Wl,--gc-sections -Wl,--sort-common -Wl,--sort-section=alignment
CC = arm-linux-gnueabi-gcc
LD = arm-linux-gnueabi-g++

EXE = bld/pxt-app.elf

DEPS = $(PXT_HEADERS) package.json Makefile Makefile.inc

all: $(EXE)

$(EXE): $(PXT_OBJS)
	$(LD) -o $(EXE) $(LDFLAGS) $(PXT_OBJS)

clean:
	rm -rf bld

bld/%.o: %.cpp $(DEPS)
	@mkdir -p $(dir $@)
	$(CC) $(CXXFLAGS) -c $< -o $@

bld/%.o: %.s $(DEPS)
	@mkdir -p $(dir $@)
	$(CC) $(CFLAGS) -c $< -o $@

bld/%.o: %.c $(DEPS)
	@mkdir -p $(dir $@)
	$(CC) $(CFLAGS) -c $< -o $@
