# Motor motion - speed, distance, time

To run a motor, you tell it what speed you want it to turn at. Let's say we run the motor at half speed.

```block
motors.largeA.setSpeed(50)
```

The speed value is `50` which is have of the forward maximum of `100`. What we don't know is how much the motor turns in some amount of time. We can find out by checking the number of times the motor turns for a little while.

## Motor RPM

Let's try to find out how many times the motor turns, rotates, in a minute at full speed. As a test we can run the motor for `10` seconds and then read its tacho count.

```block
motors.largeA.clearCounts()
motors.largeA.setSpeed(100)
loops.pause(10000)
motors.largeA.stop()
brick.showString("Number of turns:", 1)
brick.showNumber(motors.largeA.tacho(), 2)
```

If the tacho count is `16`, then the motor turned 16 times in 10 seconds. The usual way to measure rotation speed is in _revolutions per minute_ (rpm). A turn of the motor is the same thing as a revolution. We can just multiply our turn count by 6 to see how many rpm's the motor turns at:

```
16 turns for 10 seconds = 60 seconds * (16 turns / 10 seconds) = 160 rpm's
```

It's simpler to run the motor for a full second and just use the tacho count by itself. We just change our test to wait for 60 seconds. This will also make our turn count a little more accurate, but you'll have to be patient! How about changing the code to make a function to test for motor rpm:

```block
let rpmLargeA = 0
function testRpmLargeA() {
    motors.largeA.clearCounts()
    motors.largeA.setSpeed(100)
    loops.pause(60000)
    motors.largeA.stop()
    rpmLargeA = motors.largeA.tacho()
}
testRpmLargeA()
```

You can see the standard RPM rating for the [large servo](https://education.lego.com/en-us/products/ev3-large-servo-motor/45502) motor and the [medium servo](https://education.lego.com/en-us/products/ev3-medium-servo-motor/45503) motor at the [LEGO Education](https://education.lego.com/en-us/shop/mindstorms%20ev3) store.

## Speed and RPM

You can probably guess that when your motor speed is not at 100% the number of RPMs is lower. If the tacho count for a minute at full speed, `100`, is `160`, then the tacho count at half speed `50` is `80`. We can be clever and run our motor based on rpm instead of a speed percentage. We'll use the ``rpmLargeA`` value found using **testRpmLargeA** function. What if we want to run the motor at `40` rpm? We do it like this:

```block
let rpmLargeA = 0
motors.largeA.setSpeed(100 * 40 / rpmLargeA)
```

## Distance and time

Having a value for rpm let's us know how much the motor turns during a certain amount of time. What if you want to drive your brick for a short distance and then stop? You need to know how long to run the motors so that the brick will drive for the correct amount of distance.

### Means of locomotion

You can move the brick using wheels and tracks. These are means of locomotion and have a size which determine how much turning is needed to go a distance. If wheels are attached to the large servo motors and they have a diameter of 3 cm (length top of a wheel to its bottom), they will travel 3 cm * _pi_ in one rotation. The number _pi_ is the distance around a circle divided by its diameter (it's ~3.14159).

```block
let wheelDistance = 3 * 3.14159;
```

### Go the distance

Maybe you want you brick to travel straight ahead for 5 meters and then stop. You can put on you 3 cm wheels and use the ``||motors:tank||`` block to drive it forward.

```block
motors.largeAB.tank(100, 100)
```

If you dont stop the motors at the right time, the brick will drive farther than 5 meters you wanted to go. You know that the wheels will take the brick one amount of ``wheelDistance`` for each rotation. How many rotations will get you across the 5 meter distance? It's 5 meters divided by the wheel distance travelled:

```block
let wheelDistance = 3 * 3.14159;
let rotations = 5 * 100 / wheelDistance
```

We had to use a factor of `100` to turn meters into centimeters for a correct rotation count.

Now, how do we make the motors run the right amount of time to turn the number of times in ``rotations``? Well, at a speed of `100` the large servo motors turn at 160 rpm. The 5 meter distance needs the motors to run for. For our example, the value in ``rotations`` is 53. So, for 53 rotations at 160 rpm:

```
53 rotations / 160 rpm = 0.33 minutes = 20 seconds
``` 

It takes 20 seconds for the brick to go 5 meters at full speed! Let's do it in code:

```block
let rpmLargeA = 0
let wheelDistance = 3 * 3.14159;
let rotations = 5 * 100 / wheelDistance
let travelTime = rotations / rpmLargeA * 1000
motors.largeAB.tank(100, 100)
loops.pause(travelTime)
motors.stopAllMotors()
```

If you want to make the brick travel only 2.5 meters, you can use the same code but set the ``||motors:tank||`` speeds to 50% or cut the travel time in half.

## See also

[set speed](/reference/motors/motor/set-speed), [tank](/reference/motors/motor/tank)

[large servo motor](https://education.lego.com/en-us/products/ev3-large-servo-motor/45502),
[medium servo motor](
https://education.lego.com/en-us/products/ev3-medium-servo-motor/45503)