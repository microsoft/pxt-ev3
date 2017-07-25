#ifndef UF2FORMAT_H
#define UF2FORMAT_H 1

#include <stdint.h>
#include <stdbool.h>

// All entries are little endian.

// if you increase that, you will also need to update the linker script file
#define APP_START_ADDRESS 0x00002000

#define UF2_MAGIC_START0 0x0A324655UL // "UF2\n"
#define UF2_MAGIC_START1 0x9E5D5157UL // Randomly selected
#define UF2_MAGIC_END 0x0AB16F30UL    // Ditto

// If set, the block is "comment" and should not be flashed to the device
#define UF2_FLAG_NOFLASH 0x00000001
#define UF2_FLAG_FILE 0x00001000
#define UF2_FILENAME_MAX 150
#define UF2_MAX_PAYLOAD (476 - 10) // leaving some space for filename
// for this bootloader
#define UF2_MAX_FILESIZE (64 * 1024 * 1024)

typedef struct {
    // 32 byte header
    uint32_t magicStart0;
    uint32_t magicStart1;
    uint32_t flags;
    uint32_t targetAddr;
    uint32_t payloadSize;
    uint32_t blockNo;
    uint32_t numBlocks;
    uint32_t fileSize;

    // raw data, followed by filename (NUL-terminated) at payloadSize
    uint8_t data[476];

    // store magic also at the end to limit damage from partial block reads
    uint32_t magicEnd;
} UF2_Block;

static inline bool is_uf2_block(void *data) {
    UF2_Block *bl = (UF2_Block *)data;
    return bl->magicStart0 == UF2_MAGIC_START0 && bl->magicStart1 == UF2_MAGIC_START1 &&
           bl->magicEnd == UF2_MAGIC_END;
}

#endif
