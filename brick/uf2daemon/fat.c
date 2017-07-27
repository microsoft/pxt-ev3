
#define VENDOR_NAME "The LEGO Group"
#define PRODUCT_NAME "Mindstorms EV3"
#define VOLUME_LABEL "EV3"
#define INDEX_URL "https://makecode.com/lego"

#define BOARD_ID "LEGO-EV3-v0"

#define _XOPEN_SOURCE 500

#include <sys/types.h>
#include <dirent.h>
#include <sys/stat.h>
#include <unistd.h>
#include <stdlib.h>
#include <ctype.h>
#include <assert.h>
#include <fcntl.h>
#include <time.h>
#include <signal.h>
#include <sys/wait.h>
#include <sys/ioctl.h>
#include <string.h>

#define max(a, b)                                                                                  \
    ({                                                                                             \
        __typeof__(a) _a = (a);                                                                    \
        __typeof__(b) _b = (b);                                                                    \
        _a > _b ? _a : _b;                                                                         \
    })

#define min(a, b)                                                                                  \
    ({                                                                                             \
        __typeof__(a) _a = (a);                                                                    \
        __typeof__(b) _b = (b);                                                                    \
        _a < _b ? _a : _b;                                                                         \
    })

#include "uf2.h"

#define DBG LOG

typedef struct {
    uint8_t JumpInstruction[3];
    uint8_t OEMInfo[8];
    uint16_t SectorSize;
    uint8_t SectorsPerCluster;
    uint16_t ReservedSectors;
    uint8_t FATCopies;
    uint16_t RootDirectoryEntries;
    uint16_t TotalSectors16;
    uint8_t MediaDescriptor;
    uint16_t SectorsPerFAT;
    uint16_t SectorsPerTrack;
    uint16_t Heads;
    uint32_t HiddenSectors;
    uint32_t TotalSectors32;
    uint8_t PhysicalDriveNum;
    uint8_t Reserved;
    uint8_t ExtendedBootSig;
    uint32_t VolumeSerialNumber;
    char VolumeLabel[11];
    uint8_t FilesystemIdentifier[8];
} __attribute__((packed)) FAT_BootBlock;

typedef struct {
    char name[8];
    char ext[3];
    uint8_t attrs;
    uint8_t reserved;
    uint8_t createTimeFine;
    uint16_t createTime;
    uint16_t createDate;
    uint16_t lastAccessDate;
    uint16_t highStartCluster;
    uint16_t updateTime;
    uint16_t updateDate;
    uint16_t startCluster;
    uint32_t size;
} __attribute__((packed)) DirEntry;

typedef struct {
    uint8_t seqno;
    uint16_t name0[5];
    uint8_t attrs;
    uint8_t type;
    uint8_t checksum;
    uint16_t name1[6];
    uint16_t startCluster;
    uint16_t name2[2];
} __attribute__((packed)) VFatEntry;

STATIC_ASSERT(sizeof(DirEntry) == 32);

#define STR0(x) #x
#define STR(x) STR0(x)
const char infoUf2File[] = //
    "UF2 Bootloader " UF2_VERSION "\r\n"
    "Model: " PRODUCT_NAME "\r\n"
    "Board-ID: " BOARD_ID "\r\n";

const char indexFile[] = //
    "<!doctype html>\n"
    "<html>"
    "<body>"
    "<script>\n"
    "location.replace(\"" INDEX_URL "\");\n"
    "</script>"
    "</body>"
    "</html>\n";

#define RESERVED_SECTORS 1
#define ROOT_DIR_SECTORS 4
#define SECTORS_PER_FAT ((NUM_FAT_BLOCKS * 2 + 511) / 512)

#define START_FAT0 RESERVED_SECTORS
#define START_FAT1 (START_FAT0 + SECTORS_PER_FAT)
#define START_ROOTDIR (START_FAT1 + SECTORS_PER_FAT)
#define START_CLUSTERS (START_ROOTDIR + ROOT_DIR_SECTORS)
#define ROOT_DIR_ENTRIES (ROOT_DIR_SECTORS * 512 / 32)

#define F_TEXT 1
#define F_UF2 2
#define F_DIR 4
#define F_CONT 8

static const FAT_BootBlock BootBlock = {
    .JumpInstruction = {0xeb, 0x3c, 0x90},
    .OEMInfo = "UF2 UF2 ",
    .SectorSize = 512,
    .SectorsPerCluster = 1,
    .ReservedSectors = RESERVED_SECTORS,
    .FATCopies = 2,
    .RootDirectoryEntries = ROOT_DIR_ENTRIES,
    .TotalSectors16 = NUM_FAT_BLOCKS - 2,
    .MediaDescriptor = 0xF8,
    .SectorsPerFAT = SECTORS_PER_FAT,
    .SectorsPerTrack = 1,
    .Heads = 1,
    .ExtendedBootSig = 0x29,
    .VolumeSerialNumber = 0x00420042,
    .VolumeLabel = VOLUME_LABEL,
    .FilesystemIdentifier = "FAT16   ",
};

int currCluster = 2;
struct FsEntry *rootDir;
struct ClusterData *firstCluster, *lastCluster;

typedef struct ClusterData {
    int flags;
    int numclusters;
    struct stat st;
    struct ClusterData *dnext;
    struct ClusterData *cnext;
    struct FsEntry *dirdata;
    struct FsEntry *myfile;
    char name[0];
} ClusterData;

typedef struct FsEntry {
    int startCluster;
    uint8_t attrs;
    int size;
    int numdirentries;
    time_t ctime, mtime;
    struct FsEntry *next;
    struct ClusterData *data;
    char fatname[12];
    char vfatname[0];
} FsEntry;

struct DirMap {
    const char *mapName;
    const char *fsName;
};

struct DirMap dirMaps[] = { //
#ifdef X86
    {"foo qux baz", "dirs/bar"}, //
    {"foo", "dirs/foo"},         //
    {"xyz", "dirs/bar2"},        //
#else
    {"Projects", "/mnt/ramdisk/prjs/BrkProg_SAVE"},
    {"SD Card", "/media/card/myapps"},
    {"USB Stick", "/media/usb/myapps"},
#endif
    {NULL, NULL}};

void timeToFat(time_t t, uint16_t *dateP, uint16_t *timeP) {
    struct tm tm;

    localtime_r(&t, &tm);

    if (timeP)
        *timeP = (tm.tm_hour << 11) | (tm.tm_min << 5) | (tm.tm_sec / 2);

    if (dateP)
        *dateP = (max(0, tm.tm_year - 80) << 9) | ((tm.tm_mon + 1) << 5) | tm.tm_mday;
}

void padded_memcpy(char *dst, const char *src, int len) {
    for (int i = 0; i < len; ++i) {
        if (*src)
            *dst = *src++;
        else
            *dst = ' ';
        dst++;
    }
}

char *expandMap(const char *mapName) {
    static char mapbuf[300];

    const char *rest = "";
    for (int i = 0; i < (int)sizeof(mapbuf); ++i) {
        char c = mapName[i];
        if (c == '/' || c == 0) {
            mapbuf[i] = 0;
            rest = mapName + i;
            break;
        }
        mapbuf[i] = c;
    }
    for (int i = 0; dirMaps[i].mapName; ++i) {
        if (strcmp(dirMaps[i].mapName, mapbuf) == 0) {
            strcpy(mapbuf, dirMaps[i].fsName);
            strcat(mapbuf, rest);
            return mapbuf;
        }
    }
    return NULL;
}

ClusterData *mkClusterData(int namelen) {
    ClusterData *c = malloc(sizeof(*c) + namelen + 1);
    memset(c, 0, sizeof(*c) + namelen + 1);
    return c;
}

ClusterData *readDir(const char *mapName) {
    DIR *d = opendir(expandMap(mapName));
    if (!d)
        return NULL;

    ClusterData *res = NULL;
    for (;;) {
        struct dirent *ent = readdir(d);
        if (!ent)
            break;

        ClusterData *c = mkClusterData(strlen(mapName) + 1 + strlen(ent->d_name));

        c->flags = F_UF2;
        c->dnext = res;
        sprintf(c->name, "%s/%s", mapName, ent->d_name);

        int err = stat(expandMap(c->name), &c->st);
        assert(err >= 0);

        if (S_ISREG(c->st.st_mode) && strlen(c->name) < UF2_FILENAME_MAX) {
            c->numclusters = (c->st.st_size + 255) / 256;
        } else {
            free(c);
            continue;
        }

        res = c;
    }

    closedir(d);
    return res;
}

int filechar(int c) {
    if (!c)
        return 0;
    return ('a' <= c && c <= 'z') || ('A' <= c && c <= 'Z') || ('0' <= c && c <= '9') ||
           strchr("_-", c);
}

void copyFsChars(char *dst, const char *src, int len) {
    for (int i = 0; i < len; ++i) {
        if (filechar(*src))
            dst[i] = toupper(*src++);
        else {
            if (*src == '.')
                src = "";
            if (*src == 0)
                dst[i] = ' ';
            else
                dst[i] = '_';
            while (*src && !filechar(*src))
                src++;
        }
    }
}

FsEntry *mkFsEntry(const char *name) {
    int sz = sizeof(FsEntry) + strlen(name) + 1;
    FsEntry *e = malloc(sz);
    memset(e, 0, sz);
    e->startCluster = currCluster;
    e->next = NULL;
    // +1 for final 0x0000, and +12 for alignment
    e->numdirentries = 1 + (strlen(name) + 1 + 12) / 13;
    strcpy(e->vfatname, name);

    const char *src = name;
    copyFsChars(e->fatname, src, 8);
    while (*src && *src != '.')
        src++;
    if (*src == '.')
        src++;
    else
        src = "";
    copyFsChars(e->fatname + 8, src, 3);
    return e;
}

void addClusterData(ClusterData *c, FsEntry *e) {
    currCluster += c->numclusters;

    if (firstCluster == NULL) {
        firstCluster = c;
    } else {
        lastCluster->cnext = c;
    }
    lastCluster = c;

    if (c->st.st_ctime)
        e->ctime = min(e->ctime, c->st.st_ctime);
    e->mtime = max(e->mtime, c->st.st_mtime);

    c->myfile = e;

    DBG("add cluster: flags=%d size=%d numcl=%d", c->flags, (int)c->st.st_size, c->numclusters);
}

FsEntry *addRootText(const char *filename, const char *contents) {
    FsEntry *e = mkFsEntry(filename);
    e->next = rootDir;
    rootDir = e;

    int sz = strlen(contents);
    e->size = sz;
    if (sz > 0) {
        assert(sz <= 512);
        ClusterData *c = mkClusterData(sz);
        c->st.st_mtime = c->st.st_ctime = time(NULL);

        c->flags = F_TEXT;
        strcpy(c->name, contents);
        c->st.st_size = sz;
        c->numclusters = 1;
        addClusterData(c, e);
    }
    return e;
}

int baseLen(const char *a) {
    int len = 0;
    while (*a && *a != '.') {
        a++;
        len++;
    }
    return len;
}

int nameMatches(const char *a, const char *b) {
    for (;;) {
        if ((*a == 0 || *a == '.') && (*b == 0 || *b == '.'))
            return 1;

        if (*a != *b)
            return 0;
        a++;
        b++;
    }
}

void setFatNames(FsEntry *dirent) {
    for (FsEntry *p = dirent; p; p = p->next) {
        // check for collisions
        int k = 1;
    retry:
        for (FsEntry *o = dirent; o && o != p; o = o->next) {
            if (strcmp(o->fatname, p->fatname) == 0) {
                char buf[20];
                sprintf(buf, "~%d", k++);
                int len = strlen(buf);
                memcpy(p->fatname + 8 - len, buf, len);
                goto retry;
            }
        }

        DBG("setname: %s [%s] cl=%s @ %d sz=%d dents=%d", p->vfatname, p->fatname,
            p->data ? p->data->name : "(no data)", p->startCluster, p->size, p->numdirentries);
    }
}

void addFullDir(const char *mapName) {
    int numEntries = 0;
    FsEntry *dirents = NULL;

    time_t mtime = 0, ctime = 0;

    for (ClusterData *cl = readDir(mapName); cl; cl = cl->dnext) {
        if (cl->cnext || cl == lastCluster)
            continue; // already done

        // vfat entries
        const char *filename = strchr(cl->name, '/') + 1;
        int len = baseLen(filename) + 4;
        char namebuf[len];
        memcpy(namebuf, filename, len - 4);
        strcpy(namebuf + len - 4, ".uf2");

        assert(cl->flags & F_UF2);

        FsEntry *fent = mkFsEntry(namebuf);
        numEntries += fent->numdirentries;
        fent->next = dirents;
        fent->data = cl;
        fent->size = cl->numclusters * 512;
        dirents = fent;
        addClusterData(cl, fent);
        for (ClusterData *other = cl->dnext; other; other = other->dnext) {
            if (nameMatches(cl->name, other->name)) {
                other->flags |= F_CONT;
                fent->size += other->numclusters * 512;
                addClusterData(other, fent);
            }
        }
        if (mtime == 0) {
            mtime = fent->mtime;
            ctime = fent->ctime;
        } else {
            mtime = max(mtime, fent->mtime);
            ctime = min(ctime, fent->ctime);
        }
    }

    setFatNames(dirents);

    FsEntry *dent = mkFsEntry(mapName);
    dent->data = mkClusterData(0);
    dent->data->dirdata = dirents;
    dent->data->numclusters = (numEntries + 16) / 16; // at least 1
    addClusterData(dent->data, dent);
    dent->mtime = mtime;
    dent->ctime = ctime;
    dent->next = rootDir;
    dent->attrs = 0x10;
    dent->data->flags = F_DIR;
    rootDir = dent;
}

void setupFs() {
    addRootText("info_uf2.txt", infoUf2File);
    addRootText("index.html", indexFile);
    for (int i = 0; dirMaps[i].mapName; ++i) {
        addFullDir(dirMaps[i].mapName);
    }

    setFatNames(rootDir); // make names unique

    FsEntry *e = addRootText(BootBlock.VolumeLabel, "");
    e->numdirentries = 1;
    e->attrs = 0x28;
}

#define WRITE_ENT(v)                                                                               \
    do {                                                                                           \
        if (skip++ >= 0)                                                                           \
            *dest++ = v;                                                                           \
        if (skip >= 256)                                                                           \
            return;                                                                                \
        cl++;                                                                                      \
    } while (0)

void readFat(uint16_t *dest, int skip) {
    int cl = 0;
    skip = -skip;
    WRITE_ENT(0xfff0);
    WRITE_ENT(0xffff);
    for (ClusterData *c = firstCluster; c; c = c->cnext) {
        for (int i = 0; i < c->numclusters - 1; i++)
            WRITE_ENT(cl + 1);
        if (c->cnext && c->cnext->flags & F_CONT)
            WRITE_ENT(cl + 1);
        else
            WRITE_ENT(0xffff);
    }
}

// note that ptr might be unaligned
const char *copyVFatName(const char *ptr, void *dest, int len) {
    uint8_t *dst = dest;

    for (int i = 0; i < len; ++i) {
        if (ptr == NULL) {
            *dst++ = 0xff;
            *dst++ = 0xff;
        } else {
            *dst++ = *ptr;
            *dst++ = 0;
            if (*ptr)
                ptr++;
            else
                ptr = NULL;
        }
    }

    return ptr;
}

uint8_t fatChecksum(const char *name) {
    uint8_t sum = 0;
    for (int i = 0; i < 11; ++i)
        sum = ((sum & 1) << 7) + (sum >> 1) + *name++;
    return sum;
}

void readDirData(uint8_t *dest, FsEntry *dirdata, int blkno) {
    DirEntry *d = (void *)dest;
    int idx = blkno * -16;
    for (FsEntry *e = dirdata; e; e = e->next) {
        if (idx >= 16)
            break;

        // DBG("dir idx=%d %s", idx, e->vfatname);

        for (int i = 0; i < e->numdirentries; ++i, ++idx) {
            if (0 <= idx && idx < 16) {
                if (i == e->numdirentries - 1) {
                    memcpy(d->name, e->fatname, 11);
                    d->attrs = e->attrs;
                    d->size = e->size;
                    d->startCluster = e->startCluster;
                    timeToFat(e->mtime, &d->updateDate, &d->updateTime);
                    timeToFat(e->ctime, &d->createDate, &d->createTime);
                } else {
                    VFatEntry *f = (void *)d;
                    int seq = e->numdirentries - i - 2;
                    f->seqno = seq + 1; // they start at 1
                    if (i == 0)
                        f->seqno |= 0x40;
                    f->attrs = 0x0F;
                    f->type = 0x00;
                    f->checksum = fatChecksum(e->fatname);
                    f->startCluster = 0;

                    const char *ptr = e->vfatname + (13 * seq);
                    ptr = copyVFatName(ptr, f->name0, 5);
                    ptr = copyVFatName(ptr, f->name1, 6);
                    ptr = copyVFatName(ptr, f->name2, 2);
                }
                d++;
            }
        }
    }
}

void readBlock(uint8_t *dest, int blkno) {
    // DBG("readbl %d", blkno);
    int blkno0 = blkno;
    for (ClusterData *c = firstCluster; c; c = c->cnext) {
        //  DBG("off=%d sz=%d", blkno, c->numclusters);
        if (blkno >= c->numclusters) {
            blkno -= c->numclusters;
            continue;
        }
        // DBG("readbl off=%d %p", blkno, c);
        if (c->dirdata) {
            readDirData(dest, c->dirdata, blkno);
        } else if (c->flags & F_TEXT) {
            strcpy((char *)dest, c->name);
        } else if (c->flags & F_UF2) {
            UF2_Block *bl = (void *)dest;

            bl->magicStart0 = UF2_MAGIC_START0;
            bl->magicStart1 = UF2_MAGIC_START1;
            bl->magicEnd = UF2_MAGIC_END;
            bl->flags = UF2_FLAG_FILE;
            bl->blockNo = blkno0 - (c->myfile->startCluster - 2);
            bl->numBlocks = c->myfile->size / 512;
            bl->targetAddr = blkno * 256;
            bl->payloadSize = 256;
            bl->fileSize = c->st.st_size;

            int fd = open(expandMap(c->name), O_RDONLY);
            if (fd >= 0) {
                lseek(fd, bl->targetAddr, SEEK_SET);
                bl->payloadSize = read(fd, bl->data, 256);
                close(fd);
            } else {
                bl->payloadSize = -1;
            }

            if (bl->payloadSize < 475 - strlen(c->name))
                strcpy((char *)bl->data + bl->payloadSize, c->name);
        }
        return;
    }
}

void read_block(uint32_t block_no, uint8_t *data) {
    memset(data, 0, 512);
    uint32_t sectionIdx = block_no;

    if (block_no == 0) {
        memcpy(data, &BootBlock, sizeof(BootBlock));
        data[510] = 0x55;
        data[511] = 0xaa;
        // logval("data[0]", data[0]);
    } else if (block_no < START_ROOTDIR) {
        sectionIdx -= START_FAT0;
        if (sectionIdx >= SECTORS_PER_FAT) // second copy of fat?
            sectionIdx -= SECTORS_PER_FAT;

        readFat((void *)data, sectionIdx * 256);
    } else if (block_no < START_CLUSTERS) {
        sectionIdx -= START_ROOTDIR;
        readDirData(data, rootDir, sectionIdx);
    } else {
        sectionIdx -= START_CLUSTERS;
        readBlock(data, sectionIdx);
    }
}

char rbfPath[300];

uint8_t stopApp[] = {
    0x05, 0x00, // size
    0x00, 0x00, // seq. no.
    0x3f, 0x3d, // usb magic,
    0x02,       // req. no.
};

uint8_t runStart[] = {0x00, 0x00,       // size
                      0x00, 0x00,       // seq. no.
                      0x00, 0x00, 0x08, // something
                      0xC0, 0x08, 0x82, 0x01, 0x00, 0x84};

uint8_t runEnd[] = {0x00, 0x60, 0x64, 0x03, 0x01, 0x60, 0x64, 0x00};

#define FEED_DATA _IOC(_IOC_WRITE, 't', 108, 1024)

void startRbf() {
    char buf[1024];
    memset(buf, 0, sizeof(buf));
    memcpy(buf, stopApp, sizeof(stopApp));

    int fd = open("/dev/lms_usbdev", O_RDWR);
    ioctl(fd, FEED_DATA, buf);
    usleep(500000);

    int off = 0;
    memcpy(buf + off, runStart, sizeof(runStart));
    off += sizeof(runStart);
    strcpy(buf + off, rbfPath);
    off += strlen(rbfPath);
    memcpy(buf + off, runEnd, sizeof(runEnd));
    off += sizeof(runEnd);
    off -= 2;
    buf[0] = off & 0xff;
    buf[1] = off >> 8;
    ioctl(fd, FEED_DATA, buf);

    close(fd);
}

#define MAX_BLOCKS 8000
typedef struct {
    uint32_t numBlocks;
    uint32_t numWritten;
    uint8_t writtenMask[MAX_BLOCKS / 8 + 1];
} WriteState;

void restartProgram() {
    if (!rbfPath[0])
        exit(0);
    startRbf();
    exit(0); // causes parent to eject MSD etc
}

int numWrites = 0;
static WriteState wrState;
void write_block(uint32_t block_no, uint8_t *data) {
    WriteState *state = &wrState;

    UF2_Block *bl = (void *)data;

    if (bl->magicStart0 == 0x20da6d81 && bl->magicStart1 == 0x747e09d4) {
        DBG("restart req, #wr=%d", numWrites);
        if (numWrites) {
            exit(0);
        }
        return;
    }

    numWrites++;

    if (!is_uf2_block(bl)) {
        return;
    }

    (void)block_no;

    bl->data[475] = 0; // make sure we have NUL terminator
    char *fn0 = (char *)bl->data + bl->payloadSize;
    int namelen = 0;
    if (bl->payloadSize <= UF2_MAX_PAYLOAD) {
        namelen = strlen(fn0);
    }

    if ((bl->flags & UF2_FLAG_FILE) && bl->fileSize <= UF2_MAX_FILESIZE &&
        bl->targetAddr < bl->fileSize && 1 <= namelen && namelen <= UF2_FILENAME_MAX) {

        char *firstSL = strchr(fn0, '/');
        char *lastSL = strrchr(fn0, '/');
        if (!lastSL)
            lastSL = fn0;
        else
            lastSL++;
        int baseLen = strlen(lastSL);
        char fallback[strlen(dirMaps[0].fsName) + 1 + baseLen + 1];
        sprintf(fallback, "%s/%s", dirMaps[0].fsName, lastSL);
        char *fn = NULL;

        if (firstSL && firstSL + 1 == lastSL)
            fn = expandMap(fn0);
        if (!fn)
            fn = fallback;

        char *p = strrchr(fn, '/');
        *p = 0;
        mkdir(fn, 0777);
        *p = '/';

        int fd = open(fn, O_WRONLY | O_CREAT, 0777);
        if (fd >= 0) {
            ftruncate(fd, bl->fileSize);
            lseek(fd, bl->targetAddr, SEEK_SET);
            // DBG("write %d bytes at %d to %s", bl->payloadSize, bl->targetAddr, fn);
            write(fd, bl->data, bl->payloadSize);
            close(fd);

            if (strlen(fn) > 4 && !strcmp(fn + strlen(fn) - 4, ".rbf")) {
                strcpy(rbfPath, fn);
            }
        }
    }

    if (state && bl->numBlocks) {
        if (state->numBlocks != bl->numBlocks) {
            if (bl->numBlocks >= MAX_BLOCKS || state->numBlocks)
                state->numBlocks = 0xffffffff;
            else
                state->numBlocks = bl->numBlocks;
        }
        if (bl->blockNo < MAX_BLOCKS) {
            uint8_t mask = 1 << (bl->blockNo % 8);
            uint32_t pos = bl->blockNo / 8;
            if (!(state->writtenMask[pos] & mask)) {
                // logval("incr", state->numWritten);
                state->writtenMask[pos] |= mask;
                state->numWritten++;
                DBG("write %d/%d #%d", state->numWritten, state->numBlocks, bl->blockNo);
            }
            if (state->numWritten >= state->numBlocks) {
                restartProgram();
            }
        }
    } else {
        // TODO timeout for restart?
    }
}
