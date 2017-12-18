const webfontsGenerator = require('webfonts-generator');

webfontsGenerator({
  files: [
    './ultrasonic.svg',
    "./color.svg",
    "./touch.svg",
    "./gyro.svg"
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