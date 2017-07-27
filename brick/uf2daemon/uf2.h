#ifndef UF2_H
#define UF2_H 1

#include "uf2format.h"
#include <stdio.h>
#include <string.h>

#ifndef INDEX_URL
#define INDEX_URL "https://www.pxt.io/"
#endif

#define UF2_VERSION_BASE "v0.1.0"

// needs to be more than ~4200 and less than ~65000 (to force FAT16)
#define NUM_FAT_BLOCKS 65000

#define UF2_VERSION UF2_VERSION_BASE " F"

//! Static block size for all memories
#define UDI_MSC_BLOCK_SIZE 512L

void read_block(uint32_t block_no, uint8_t *data);

void write_block(uint32_t block_no, uint8_t *data);

#define CONCAT_1(a, b) a##b
#define CONCAT_0(a, b) CONCAT_1(a, b)
#define STATIC_ASSERT(e) enum { CONCAT_0(_static_assert_, __LINE__) = 1 / ((e) ? 1 : 0) }

extern const char infoUf2File[];

void readAll(int fd, void *dst, uint32_t length);

STATIC_ASSERT(sizeof(UF2_Block) == 512);

void mylog(const char *fmt, ...);

#define FAIL(args...)                                                                              \
    do {                                                                                           \
        mylog("<4>" args);                                                                                 \
        exit(1);                                                                                   \
    } while (0)

#define LOG mylog

#endif
