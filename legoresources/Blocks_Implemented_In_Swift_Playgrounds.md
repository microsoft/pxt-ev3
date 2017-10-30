# Functions for measuring in Swift Playgrounds "EV3 Animal Rescue" (Miranda)

## Sensors

  * Ultrasonic (cm, inches)
  * Gyro (angle, rate)
  * Reset Gyro
  * Touch (count, on/off)
  * Light (color, reflection, ambience)
  * IR (proximity, seek)

## Motor Sensors

* Motor (degrees, rotations, power)

#### Wait for

All sensor methods have a `waitFor` version that waits for the sensor value to be >= or <=. We don't use '=' equality because it is non-sensical for floating point data.

All sensors also have a `waitForIncrease`, `waitForDecrease` version.

------------------------

# Output Functions

* Move tank ( for seconds, for degrees, for rotations, indefinitely )
* Stop Move (stops 2 motors)
* Motor off
* Motor on (for seconds, for degrees, for rotations, indefinitely)
* Reset motor (resets all counters related to the motor)


# Brick Functions

* Brick light on (color + mode: flashing, on, or pulsating)
* Brick light off
* Play sound (wait for completion, play once, play repeating)
        - Parameters:
        - file: Takes an input conforming to enum `SoundFile`. One of the following:
            - `.hello`
            - `.goodbye`
            - `.fanfare`
            - `.errorAlarm`
            - `.start`
            - `.stop`
            - `.object`
            - `.ouch`
            - `.blip`
            - `.arm`
            - `.snap`
            - `.laser`
* Play sound frequency (for seconds, can either wait for completion or continue while playing)
* Play sound note (in range `C4-D#9`) (for seconds, can either wait for completion or continue while playing)
* Stopsound (stops all sounds playing)
* Wait for seconds
* Display text
* Display text at `(x,y)` with color`(black, white)`, font`(bold, normal, large)` with option to clear screen
* Display line from `(x1,y1)` to `(x2,y2)` with color `(black, white)` option to clear screen
* Display rectangle at `(x,y)` with `(width, height)`, with fill or no fill, with color `(black, white)`, option to clear screen
* Display image at `(x,y)`, option to clear screen.
            takes an input conforming to enum `ImageName`. One of the following:
            - `.neutral`
            - `.pinchRight`
            - `.awake`
            - `.hurt`
            - `.accept`
            - `.decline`
            - `.questionMark`
            - `.warning`
            - `.stop`
            - `.pirate`
            - `.boom`
            - `.ev3Icon`
