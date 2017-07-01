include Makefile.inc

COMMON_FLAGS = -W -Wall -Wno-unused-parameter -Ipxtapp -fwrapv -fno-threadsafe-statics -Os -mthumb
CFLAGS = $(COMMON_FLAGS) -std=c99
CXXFLAGS = $(COMMON_FLAGS) -std=c++11 -fno-rtti -fno-exceptions -fno-unwind-tables
LDFLAGS = -Wl,--gc-sections -Wl,--sort-common -Wl,--sort-section=alignment
PREF = arm-linux-gnueabi-
CC = $(PREF)gcc
LD = $(PREF)gcc
LIBSTDCPP = /usr/lib/gcc/arm-linux-gnueabi/4.9/libstdc++.a

EXE = bld/pxt-app.elf
HEX = $(EXE:.elf=.hex)

DEPS = $(PXT_HEADERS) package.json Makefile Makefile.inc

all: $(EXE)

$(EXE): $(PXT_OBJS)
	$(LD) -o $(EXE) $(LDFLAGS) -Wl,-Map,$(EXE:.elf=.map) $(PXT_OBJS) $(LIBSTDCPP) -lm
	cp $(EXE) $(EXE:.elf=.full)
	$(PREF)strip $(EXE)
	node -p 'require("fs").readFileSync("$(EXE)").toString("hex")' > $(HEX)
	@ls -l $(EXE)

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
