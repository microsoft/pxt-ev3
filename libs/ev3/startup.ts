// This is the last thing executed before user code
console.addListener(function(msg: string) {
    control.dmesg(msg.substr(0, msg.length - 1))
})

brick.showBoot();