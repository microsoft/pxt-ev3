* [x] try unlink ELF file before uploading - didn't work
* [x] implement serialPoll
* [x] try some motors
* [x] add `control.interrupt(ms, () => { ... sync function ... })` - running outside regular JS thread
* [x] add `//% whenUsed` on global variable initializers in PXT
* [x] fix `@PXT@:` handling for ELF in PXT
* [x] parse Python field lists into offsets

## Further down
* [x] have some protocol for restarting user app if it's running (flag file somewhere?)
* [x] display panic code on the screen
* [ ] catch SIGSEGV and panic
