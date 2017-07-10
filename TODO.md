* [x] try unlink ELF file before uploading - didn't work
* [x] implement serialPoll
* [x] try some motors
* [x] add `control.interrupt(ms, () => { ... sync function ... })` - running outside regular JS thread
* [ ] add `//% whenUsed` on global variable initializers in PXT
* [ ] fix `@PXT@:` handling for ELF in PXT
* [x] parse Python field lists into offsets

## Further down
* [x] have some protocol for restarting user app if it's running (flag file somewhere?)
* [ ] display panic code on the screen
* [ ] catch SIGSEGV and panic
