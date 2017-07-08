* [x] try unlink ELF file before uploading - didn't work
* [x] implement serialPoll
* [x] try some motors
* [ ] add `control.interrupt(ms, () => { ... sync function ... })` - running outside regular JS thread
* [ ] add `//% onlyWhenUsed` on global variable initializers
* [ ] parse Python field lists into offsets

## Further down
* [ ] have some protocol for restarting user app if it's running (flag file somewhere?)
* [ ] display panic code on the screen
* [ ] catch SIGSEGV and panic