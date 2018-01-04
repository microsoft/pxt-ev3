const webfontsGenerator = require('webfonts-generator');

webfontsGenerator({
  files: [
    "./ultrasonic.svg",
    "./color.svg",
    "./touch.svg",
    "./gyro.svg",
    "./categories/addpackage.svg",
    "./categories/brick.svg",
    "./categories/controls.svg",
    "./categories/functions.svg",
    "./categories/list.svg",
    "./categories/logic.svg",
    "./categories/loops.svg",
    "./categories/math.svg",
    "./categories/motors.svg",
    "./categories/music.svg",
    "./categories/sensors.svg",
    "./categories/text.svg",
    "./categories/variables.svg",
    "./categories/advancedcollapsed.svg",
    "./categories/advancedexpanded.svg",
    "./icons/cancel.svg",
    "./icons/check.svg",
    "./icons/download.svg",
    "./icons/save.svg",
    "./icons/blocks.svg"
  ],
  dest: '../docs/static/fonts/icons/',
  round: 10
}, function(error) {
  if (error) {
    console.log('Fail!', error);
  } else {
    console.log('Done!');
  }
})