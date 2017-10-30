import Foundation

public protocol RobotAPI {

    // MARK: - Ultrasonic Sensor

    /**
      Method for measuring the distance to an object, in centimeters, using the Ultrasonic Sensor on a specific input port.

      **Example**: Measure the distance in centimeters to the Ultrasonic Sensor on Port 1:

      `ev3.measureUltrasonicCentimeters(on: .one)`

      - Parameters:
        - on: takes an input conforming to enum `InputPort`, either `.one`, `.two`, `.three`, or `.four`

      - Returns: the distance, in centimeters, as a `Float`
      */
    func measureUltrasonicCentimeters(on: InputPort) -> Float

    /**
      Method for measuring the distance to an object, in inches, using the Ultrasonic Sensor on a specific input port.

      **Example**: Measure distance in inches to the Ultrasonic Sensor on Port 1:

      `ev3.measureUltrasonicInches(on: .one)`

      - Parameters:
        - on: takes an input conforming to enum `InputPort`, either `.one`, `.two`, `.three`, or `.four`

      - Returns: the distance, in inches, as a `Float`
      */
    func measureUltrasonicInches(on: InputPort) -> Float

    // MARK: - Gyro Sensor

    /**
     Method for measuring orientation, in degrees, using the Gyro Sensor on a specific input port.

     - Important: Measurement is relative to the last time the sensor was reset.

      **Example**: Measure change in orientation in degrees from the Gyro Sensor on Port 1:

      `ev3.measureGyroAngle(on: .one)`

      - Parameters:
        - on: takes an input conforming to enum `InputPort`, either `.one`, `.two`, `.three`, or `.four`

      - Returns: the orientation in degrees as a `Float`
      */
    func measureGyroAngle(on: InputPort) -> Float

    /**
      Method for measuring rotational motion, in degrees per second (rate), using the Gyro Sensor on a specific input port.

      **Example**: Measure rotational motion from the Gyro Sensor in degrees per second (rate) on Port 1:

      `ev3.measureGyroRate(on: .one)`

      - Parameters:
        - on: takes an input conforming to enum `InputPort`, either `.one`, `.two`, `.three`, or `.four`

      - Returns: the rate of orientation change in degrees per second as a `Float`
      */
    func measureGyroRate(on: InputPort) -> Float

    /**
      Method for resetting the the Gyro Sensor counter on a specific input port.

      **Example**: Reset the Gyro Sensor counter on Port 1:

      `ev3.resetGyro(on: .one)`

      - Parameters:
        - on: takes an input conforming to enum `InputPort`, either `.one`, `.two`, `.three`, or `.four`
      */
    func resetGyro(on port: InputPort)

    // MARK: - Touch Sensor

    /**
      Method for measuring the pressed or released state of the Touch Sensor on a specific input port.

      **Example**: Measure state of the Touch Sensor on Port 1:

      `ev3.measureTouch(on: .one)`

      - Parameters:
        - on: takes an input conforming to enum `InputPort`, either `.one`, `.two`, `.three`, or `.four`

      - Returns: the state of the Touch Sensor as a `Bool`, `true` for touched, otherwise `false`
      */
    func measureTouch(on: InputPort) -> Bool

    /**
      Method for counting the number of touches, using the Touch Sensor on a specific input port.

      - Important: Counter starts from the start of the program or since the Touch Sensor was last reset.

      **Example**: Measure state of the Touch Sensor on Port 1:

      `ev3.measureTouchCount(on: .one)`

      - Parameters:
        - on: takes an input conforming to enum `InputPort`, either `.one`, `.two`, `.three`, or `.four`

      - Returns: the number of touches of the Touch Sensor as a `Float`
      */
    func measureTouchCount(on: InputPort) -> Float

    /**
      Method for resetting the Touch Sensor counter on a specific input port.

      **Example**: Reset the Touch Sensor counter on Port 1:

      `ev3.resetTouchCount(on: .one)`

      - Parameters:
        - on: takes an input conforming to enum `InputPort`, either `.one`, `.two`, `.three`, or `.four`
      */
    func resetTouchCount(on: InputPort)

    // MARK: - Light Sensor

    /**
      Method for detecting a color using the Color Sensor on a specific input port.

      **Example**: Detect the color using the Color Sensor on Port 2:

      `ev3.measureLightColor(on: .two)`

      - Parameters:
        - on: takes an input conforming to enum `InputPort`, either `.one`, `.two`, `.three`, or `.four`

      - Returns: the color detected by the Color Sensor as an `enum` of type `ColorValue`

        - `.unavailable`
        - `.black`
        - `.blue`
        - `.green`
        - `.yellow`
        - `.red`
        - `.white`
        - `.brown`
      */
    func measureLightColor(on: InputPort) -> ColorValue

    /**
      Method for measuring reflected light intensity using the Color Sensor on a specific input port.

      **Example**: Measure the reflection using the Color Sensor on Port 2:

      `ev3.measureLightReflection(on: .two)`

      - Parameters:
        - on: takes an input conforming to enum `InputPort`, either `.one`, `.two`, `.three`, or `.four`

      - returns: the amount of light reflected by surface in front of sensor as a `Float`
      */
    func measureLightReflection(on: InputPort) -> Float

    /**
      Method for measuring ambient light intensity using the Color Sensor on a specific input port.

      **Example**: Measure the reflection using the Color Sensor on Port 2:

      `ev3.measureLightAmbient(on: .two)`

      - Parameters:
        - on: takes an input conforming to enum `InputPort`, either `.one`, `.two`, `.three`, or `.four`

      - Returns: the amount of amount of light in the sensor's surroundings as a `Float`
      */
    func measureLightAmbient(on: InputPort) -> Float

    // MARK: - IR Sensor

    /**
      Method for measuring the proximity to an object using the Infrared Sensor on a specific input port.

      **Example**: Measure the proximity to the Infrared Sensor on Port 3:

      `ev3.measureIRProximity(on: .three)`

      - Parameters:
        - on: takes an input conforming to enum `InputPort`, either `.one`, `.two`, `.three`, or `.four`

      - Returns: the proximity, an arbitrary value between `0.0` and `100.0` as a `Float`, where `0.0` is closest, `100.0` is farthest
      */
    func measureIRProximity(on: InputPort) -> Float

    /**
      Method for measuring the heading to the Beacon using the Infrared Sensor on a specific input port.

      **Example**: Measure the proximity to the Infrared Sensor on Port 3:

      `ev3.measureIRSeek(on: .three)`

      - Parameters:
        - on: takes an input conforming to enum `InputPort`, either `.one`, `.two`, `.three`, or `.four`

      - Returns: the beacon heading, an arbitrary value between `-25.0` and `25.0` as a `Float`, where `-25.0` is farthest to the left, `0.0` is directly in front, and `25.0` is farthest to the right
      */
    func measureIRSeek(on: InputPort) -> Float

    // MARK: - Motor Sensor

    /**
      Method for measuring the current value of rotation, in degrees, using a Medium or Large Motor on a specific input port.

      - Important: Measurement starts from the start of the program or since the Medium or Large Motor was last reset.

      **Example**: Measure rotations in degrees from the Medium or Large Motor on Port A:

      `ev3.measureMotorDegrees(on: .a)`

      - Parameters:
        - on: takes an input conforming to enum `OutputPort`, either `.a`, `.b`, `.c`, or `.d`

      - Returns: the number of rotations, in degrees, as a `Float`
      */
    func measureMotorDegrees(on: OutputPort) -> Float

    /**
      Method for measuring the current value of rotation, in revolutions, using a Medium or Large Motor on a specific input port.

      - Important: Measurement starts from the start of the program or since the Medium or Large Motor was last reset.

      **Example**: Measure rotations in revolutions of the Medium or Large Motor on Port A:

      `ev3.measureMotorRotations(on: .a)`

      - Parameters:
        - on: takes an input conforming to enum `OutputPort`, either `.a`, `.b`, `.c`, or `.d`

      - Returns: the number of rotations, in revolutions, as a `Float`
      */
    func measureMotorRotations(on: OutputPort) -> Float

    /**
      Method for measuring the current value of power using a Medium or Large Motor on a specific input port.

      - Important: The measured power output is not equal to the power used by the motor itself (*try manually rotating the wheel*).

      **Example**: Measure power of the Medium or Large Motor on Port A:

      `ev3.measureMotorPower(on: .a)`

      - Parameters:
        - on: takes an input conforming to enum `OutputPort`, either `.a`, `.b`, `.c`, or `.d`

      - Returns: the amount of power, an arbitrary value between `-100.0` and `100.0` as a `Float`, where `-100.0` is maximum power in counter-clockwise rotation, `0.0` is stopped, and `100.0` is maximum power in clockwise rotation
      */
    func measureMotorPower(on: OutputPort) -> Float

    // MARK: - Status Light

    /**
      Method for controlling the lights using an EV3 Brick.

      **Example**: Blink the lights green in flashing mode:

      `ev3.brickLightOn(withColor: .green, inMode: .flashing)`

      - Parameters:
        - withColor: takes an input conforming to enum `BrickLightColor`, either `.green`, `.orange`, or `.red`
        - inMode: takes an input conforming to enum `BrickLightMode`, either `.flashing`, `.on`, or `.pulsating`
      */
    func brickLightOn(withColor: BrickLightColor, inMode: BrickLightMode)

    /**
      Method for turning off the lights using an EV3 Brick.

      **Example**: Turn off the lights.

      `ev3.brickLightOff()`
      */
    func brickLightOff()

    // MARK: - Move

    /**
      Method for making a robot drive forward, backward, turn, or stop using two Large Motors, each with their respective power and input port.

      - Important: This method runs the motors indefinitely or until the program ends, refer to the [glossary](glossary://ev3.move) for more details.

      **Example**: Make a robot drive forward at full power, using Port A for the left motor and Port D for the right motor:

      `ev3.move(leftPort: .a, rightPort: .d, leftPower: 100.0, rightPower: 100.0)`

      - Parameters:
        - leftPort: takes an input conforming to enum `OutputPort`, either `.a`, `.b`, `.c`, or `.d`
        - rightPort: takes an input conforming to enum `OutputPort`, either `.a`, `.b`, `.c`, or `.d`
        - leftPower: takes an arbitrary value between `-100.0` and `100.0` as a `Float`, where `-100.0` is maximum power in counter-clockwise rotation, `0.0` is stopped, and `100.0` is maximum power in clockwise rotation
        - rightPower: takes an arbitrary value between `-100.0` and `100.0` as a `Float`, where `-100.0` is maximum power in counter-clockwise rotation, `0.0` is stopped, and `100.0` is maximum power in clockwise rotation
      */
    func move(leftPort: OutputPort, rightPort: OutputPort, leftPower: Float, rightPower: Float)

    /**
      Method for making a robot drive forward, backward, turn, or stop for a duration specified in seconds, using two Large Motors, each with their respective power and input port, possibly applying the motor brakes at the end.

      - Important: Refer to the [glossary](glossary://ev3.move) for more details.

      **Example**: Make a robot drive forward at full power for 2 seconds, using Port A for the left motor and Port D for the right motor, applying the motor brakes at the end:

      `ev3.move(forSeconds: 2.0, leftPort: .a, rightPort: .d, leftPower: 100.0, rightPower: 100.0, brakeAtEnd: true)`

      - Parameters:
        - forSeconds: takes a `Float` specifying the number of seconds both motors should run
        - leftPort: takes an input conforming to enum `OutputPort`, either `.a`, `.b`, `.c`, or `.d`
        - rightPort: takes an input conforming to enum `OutputPort`, either `.a`, `.b`, `.c`, or `.d`
        - leftPower: takes an arbitrary value between `-100.0` and `100.0` as a `Float`, where `-100.0` is maximum power in counter-clockwise rotation, `0.0` is stopped, and `100.0` is maximum power in clockwise rotation.
        - rightPower: takes an arbitrary value between `-100.0` and `100.0` as a `Float`, where `-100.0` is maximum power in counter-clockwise rotation, `0.0` is stopped and `100.0` is maximum power in clockwise rotation
        - brakeAtEnd: takes a `Bool` with value `true` if the motor brake should be applied, and `false` otherwise
      */
    func move(forSeconds: Float, leftPort: OutputPort, rightPort: OutputPort, leftPower: Float, rightPower: Float, brakeAtEnd: Bool)

    /**
      Method for making a robot drive forward, backward, turn, or stop for a duration specified in seconds, using two Large Motors, each with their respective power and input port, possibly applying the motor brakes at the end.

      - Important: Refer to the [glossary](glossary://ev3.move) for more details.

      **Example**: Make a robot drive forward at full power for 540 degrees, using Port A for the left motor and Port D for the right motor, applying the motor brakes at the end:

      `ev3.move(forDegrees: 540.0, leftPort: .a, rightPort: .d, leftPower: 100.0, rightPower: 100.0, brakeAtEnd: true)`

      - Parameters:
        - forSeconds: takes a `Float` specifying the number of seconds both motors should run
        - leftPort: takes an input conforming to enum `OutputPort`, either `.a`, `.b`, `.c`, or `.d`
        - rightPort: takes an input conforming to enum `OutputPort`, either `.a`, `.b`, `.c`, or `.d`
        - leftPower: takes an arbitrary value between `-100.0` and `100.0` as a `Float`, where `-100.0` is maximum power in counter-clockwise rotation, `0.0` is stopped, and `100.0` is maximum power in clockwise rotation
        - rightPower: takes an arbitrary value between `-100.0` and `100.0` as a `Float`, where `-100.0` is maximum power in counter-clockwise rotation, `0.0` is stopped, and `100.0` is maximum power in clockwise rotation
        - brakeAtEnd: takes a `Bool` with value `true` if the motor brake should be applied, and `false` otherwise
      */
    func move(forDegrees: Float, leftPort: OutputPort, rightPort: OutputPort, leftPower: Float, rightPower: Float, brakeAtEnd: Bool)

    /**
     Method for making a robot drive forward, backward, turn, or stop for a duration specified in revolutions, using two Large Motors, each with their respective power and input port, possibly applying the motor brakes at the end.

     - Important: Refer to the [glossary](glossary://ev3.move) for more details.

     **Example**: Make a robot drive forward at full power for 2 rotations, using Port A for the left Motor and Port D for the right Motor, applying the motor brakes at the end:

     `ev3.move(forRotations: 2.0, leftPort: .a, rightPort: .d, leftPower: 100.0, rightPower: 100.0, brakeAtEnd: true)`

     - Parameters:
        - forRotations: takes a `Float` specifying the amount of revolutions both motors should run
        - leftPort: takes an input conforming to enum `OutputPort`, either `.a`, `.b`, `.c`, or `.d`
        - rightPort: takes an input conforming to enum `OutputPort`, either `.a`, `.b`, `.c`, or `.d`
        - leftPower: takes an arbitrary value between `-100.0` and `100.0` as a `Float`, where `-100.0` is maximum power in counter-clockwise rotation, `0.0` is stopped, and `100.0` is maximum power in clockwise rotation
        - rightPower: takes an arbitrary value between `-100.0` and `100.0` as a `Float`, where `-100.0` is maximum power in counter-clockwise rotation, `0.0` is stopped, and `100.0` is maximum power in clockwise rotation
        - brakeAtEnd: takes a `Bool` with value `true` if the motor brake should be applied, and `false` otherwise
     */
    func move(forRotations: Float, leftPort: OutputPort, rightPort: OutputPort, leftPower: Float, rightPower: Float, brakeAtEnd: Bool)

    /**
     Method for stopping the motors on two ports, possibly applying the motor brake.

     **Example**: Stop the motors on Ports A and C, applying the motor brake:

     `ev3.stopMove(leftPort: .a, rightPort: .b, withBrake: true)`

     - Parameters:
        - leftPort: takes an input conforming to enum `OutputPort`, either `.a`, `.b`, `.c`, or `.d`
        - rightPort: takes an input conforming to enum `OutputPort`, either `.a`, `.b`, `.c`, or `.d`
        - brakeAtEnd: takes a `Bool` with value `true` if the motor brake should be applied, and `false` otherwise
    */
    func stopMove(leftPort: OutputPort, rightPort: OutputPort, withBrake: Bool)

    // MARK: - Single Motor

    /**
      Method for turning a motor off on a specific port, possibly applying the motor brake.

      **Example**: Turn off a motor on Port A, and brake:

      `ev3.motorOff(on: .a, brakeAtEnd: true)`

      - Parameters:
        - on: takes an input conforming to enum `OutputPort`, either `.a`, `.b`, `.c`, or `.d`
        - brakeAtEnd: takes a `Bool` with value `true` if the motor brake should be applied, and `false` otherwise
      */
    func motorOff(on: OutputPort, brakeAtEnd: Bool)

    /**
      Method for turning on a motor on a specific port, at a specific power.
     
      - Important: This method runs the motor indefinitely or until the program ends, refer to the [glossary](glossary://ev3.motorOn) for more details.

      **Example**: Turn on a motor on Port A at a power of 50:

      `ev3.motorOn(on: .a, withPower: 50.0)`

      - Parameters:
        - on: takes an input conforming to enum `OutputPort`, either `.a`, `.b`, `.c`, or `.d`
        - withPower: takes an arbitrary value between `-100.0` and `100.0` as a `Float`, where `-100.0` is maximum power in counter-clockwise rotation, `0.0` is stopped, and `100.0` is maximum power in clockwise rotation
      */
    func motorOn(on: OutputPort, withPower: Float)

    /**
     Method for turning on a motor on a specific port, at a specific power for a defined number of seconds, possibly applying the motor brake at the end.

     **Example**: Turn on a motor on Port A at a power of 50 for 2 seconds, and brake at end:

     `ev3.motorOn(forSeconds: 2, on: .a, withPower: 50.0, brakeAtEnd: true)`

     - Parameters:
        - forSeconds: takes a `Float` describing the number of seconds for which the motor should be *on*
        - on: takes an input conforming to enum `OutputPort`, either `.a`, `.b`, `.c`, or `.d`
        - withPower: takes an arbitrary value between `-100.0` and `100.0` as a `Float`, where `-100.0` is maximum power in counter-clockwise rotation, `0.0` is stopped, and `100.0` is maximum power in clockwise rotation
        - brakeAtEnd: takes a `Bool` with value `true` if the motor brake should be applied, and `false` otherwise
     */
    func motorOn(forSeconds: Float, on: OutputPort, withPower: Float, brakeAtEnd: Bool)


    /**
     Method for turning on a motor on a specific port, at a specific power for a specified number of degrees, possibly applying the motor brake at the end.

     **Example**: Turn on a motor on Port A at a power of 50 for 180 degrees, and brake at end:

     `ev3.motorOn(forDegrees: 180, on: .a, withPower: 50.0, brakeAtEnd: true)`

     - Parameters:
        - forDegrees: takes a `Float` describing the number of degrees for which the motor  should be *on*
        - on: takes an input conforming to enum `OutputPort`, either `.a`, `.b`, `.c`, or `.d`
        - withPower: takes an arbitrary value between `-100.0` and `100.0` as a `Float`, where `-100.0` is maximum power in counter-clockwise rotation, `0.0` is stopped, and `100.0` is maximum power in clockwise rotation
        - brakeAtEnd: takes a `Bool` with value `true` if the motor brake should be applied, and `false` otherwise
     */
    func motorOn(forDegrees: Float, on: OutputPort, withPower: Float, brakeAtEnd: Bool)

    /**
     Method for turning on a motor on a specific port, at a specific power for a specified number of rotations, possibly applying the motor brake at the end.

     **Example**: Turn on a motor on Port A at a power of 50 for 3 rotations, and brake at end:

     `ev3.motorOn(forRotations: 3, on: .a, withPower: 50.0, brakeAtEnd: true)`

     - Parameters:
        - forRotations: takes a `Float` describing the number of revolutions for which the   motor should be *on*
        - on: takes an input conforming to enum `OutputPort`, either `.a`, `.b`, `.c`, or `.d`
        - withPower: takes an arbitrary value between `-100.0` and `100.0` as a `Float`, where `-100.0` is maximum power in counter-clockwise rotation, `0.0` is stopped, and `100.0` is maximum power in clockwise rotation
        - brakeAtEnd: takes a `Bool` with value `true` if the motor brake should be applied, and `false` otherwise
     */
    func motorOn(forRotations: Float, on: OutputPort, withPower: Float, brakeAtEnd: Bool)

    /**
     Method for resetting all counters related to the motor on a specific port.

     **Example**: Reset motor on Port C:

     `ev3.resetMotor(on: .c)`

     - Parameters:
        - on: takes an input conforming to enum `OutputPort`, either `.a`, `.b`, `.c`, or `.d`
    */
    func resetMotor(on: OutputPort)

    // MARK: - Play Sound

    /**
     Method for playing an included sound file at a specific volume and with a specific sound style.

     The included sound files are members of the enum `SoundFile`:


     The sound style specifies whether the sound should be played once while the code continues running, repeated indefinitely while the code continues running, or played once while waiting for the sound to finish playing.

     **Example**: Play the fanfare sound at a volume of 80 and wait for the sound to finish playing:

     `ev3.playSound(file: .fanfare, atVolume: 80.0, withStyle: .waitForCompletion)`

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
     
        - atVolume: takes a `Float` specifying a volume between `0.0` and `100.0`
        - withStyle: takes an input conforming to enum `SoundStyle`, either `.waitForCompletion`, `.playOnce`, or `.playRepeat`
     */
    func playSound(file: SoundFile, atVolume: Float, withStyle: SoundStyle)

    /**
     Method for playing a sound at a specific frequency for a specific duration and at a specific volume, which optionally waits for the sound to finish playing.

     **Example**: Play a sound at a frequency of 440 Hz for 2 seconds at full volume; play it once, but do not wait for it to finish playing:

     `ev3.playSound(frequency: 440.0, forSeconds: 2.0, atVolume: 100.0, waitForCompletion: false)`

     - Parameters:
        - frequency: takes a `Float` between `250.0` and `10000.0` specifying the frequency of the sound to be played
        - forSeconds: takes a `Float` specifying the duration in seconds for which the sound will be played as a `Float`
        - atVolume: takes a `Float` specifying a volume between `0.0` and `100.0`
        - waitForCompletion: takes a `Bool` with a value of `true` if the code should wait for the sound to finish playing before continuing, and `false` otherwise
     */
    func playSound(frequency: Float, forSeconds: Float, atVolume: Float, waitForCompletion: Bool)

    /**
     Method for playing a note for a specific duration of time at a specific volume, which optionally waits for the sound to finish playing.

     A `Note` is an enum giving names to the notes between `.c4` and `.dSharp9`.

     **Example**: Play an A4 note for 3 seconds at volume of 50 and wait for the sound to complete before continuing:

     `ev3.playSound(note: .a4, forSeconds: 3.0, atVolume: 50.0, waitForCompletion: true)`

     - Parameters:
        - note: takes an input conforming to enum `Note`, such as `.c4`, `.b7`, `.dSharp9` or anything in between
        - forSeconds: takes a `Float` specifying in seconds the duration for which the sound will be played
        - atVolume: takes a `Float` specifying a volume between `0.0` and `100.0`
        - waitForCompletion: takes a `Bool` with a value of `true` if the code should wait for the sound to finish playing before continuing, and `false` otherwise
     */
    func playSound(note: Note, forSeconds: Float, atVolume: Float, waitForCompletion: Bool)

    /**
      Method for stopping any sounds currently playing. This can be repeating sound files or other sounds that have been played without waiting for their completion.

      **Example**: Stop sound:

      `ev3.stopSound()`

     */
    func stopSound()

    // MARK: - Wait For Sensor

    /**
      Method that uses the Ultrasonic Sensor on a specific input port, and waits for the distance to an object to be less than or equal to a value that is specified in centimeters.

      **Example**: Wait for the distance to the Ultrasonic Sensor on Port 1 to be less than or equal to 5 centimeters:

      `ev3.waitForUltrasonicCentimeters(on: .one, lessThanOrEqualTo: 5.0)`

      - Parameters:
        - on: takes an input conforming to enum `InputPort`, either `.one`, `.two`, `.three`, or `.four`
        - lessThanOrEqualTo: takes a `Float` specifying the distance to wait for in centimeters
     */
    func waitForUltrasonicCentimeters(on: InputPort, lessThanOrEqualTo: Float)

    /**
      Method that uses the Ultrasonic Sensor on a specific input port, and waits for the distance to an object to be greater than or equal to a value that is specified in centimeters.

      **Example**: Wait for the distance to the Ultrasonic Sensor on Port 1 to be greater than or equal to 10 centimeters:

      `ev3.waitForUltrasonicCentimeters(on: .one, greaterThanOrEqualTo: 10.0)`

      - Parameters:
        - on: takes an input conforming to enum `InputPort`, either `.one`, `.two`, `.three`, or `.four`
        - greaterThanOrEqualTo: takes a `Float` specifying the distance to wait for, in centimeters
     */
    func waitForUltrasonicCentimeters(on: InputPort, greaterThanOrEqualTo: Float)

    /**
      Method that uses the Ultrasonic Sensor on a specific input port, and waits for the distance to an object to be less than or equal to a value that is specified in inches.

      **Example**: Wait for the distance to the Ultrasonic Sensor on Port 1 to be less than or equal to 5 inches:

      `ev3.waitForUltrasonicInches(on: .one, lessThanOrEqualTo: 5.0)`

      - Parameters:
        - on: takes an input conforming to enum `InputPort`, either `.one`, `.two`, `.three`, or `.four`
        - lessThanOrEqualTo: takes a `Float` specifying the distance to wait for in inches
     */
    func waitForUltrasonicInches(on: InputPort, lessThanOrEqualTo: Float)

    /**
     Method that uses the Ultrasonic Sensor on a specific input port, and waits for the distance to an object to be greater than or equal to a value that is specified in inches. 

     **Example**: Wait for the distance to the Ultrasonic Sensor on Port 1 to be greater than or equal to 5 inches:

     `ev3.waitForUltrasonicInches(on: .one, greaterThanOrEqualTo: 5.0)`

     - Parameters:
        - on: takes an input conforming to enum `InputPort`, either `.one`, `.two`, `.three`, or `.four`
        - greaterThanOrEqualTo: takes a `Float` specifying the distance to wait for, in inches
     */
    func waitForUltrasonicInches(on: InputPort, greaterThanOrEqualTo: Float)

    /**
      Method that uses the Ultrasonic Sensor on a specific input port, and waits for the distance to an object to increase.

      **Example**: Wait for the distance to the Ultrasonic Sensor on Port 1 to increase:

      `ev3.waitForUltrasonicIncrease(on: .one)`

      - Parameters:
        - on: takes an input conforming to enum `InputPort`, either `.one`, `.two`, `.three`, or `.four`
     */
    func waitForUltrasonicIncrease(on: InputPort)

    /**
      Method that uses the Ultrasonic Sensor on a specific input port, and waits for the distance to an object to decrease.

      **Example**: Wait for the distance to the Ultrasonic Sensor on Port 1 to decrease:

      `ev3.waitForUltrasonicDecrease(on: .one)`

      - Parameters:
        - on: takes an input conforming to enum `InputPort`, either `.one`, `.two`, `.three`, or `.four`
     */
    func waitForUltrasonicDecrease(on: InputPort)

    /**
      Method that uses the Ultrasonic Sensor on a specific input port, and waits for the distance to an object to change.

      **Example**: Wait for the distance to the Ultrasonic Sensor on Port 1 to change:

      `ev3.waitForUltrasonicChange(on: .one)`

      - Parameters:
        - on: takes an input conforming to enum `InputPort`, either `.one`, `.two`, `.three`, or `.four`
     */
    func waitForUltrasonicChange(on: InputPort)

    /**
      Method that uses the Infrared Sensor on a specific port, and waits for the measured proximity to an object to be less than or equal to a specific value.

      **Example**: Wait for the proximity to the Infrared Sensor on Port 1 to be less than or equal to 5:

      `ev3.waitForIRProximity(on: .one, lessThanOrEqualTo: 5.0)`

      - Parameters:
        - on: takes an input conforming to enum `InputPort`, either `.one`, `.two`, `.three`, or `.four`
        - lessThanOrEqualTo: takes a `Float` specifying the proximity value to wait for
     */
    func waitForIRProximity(on: InputPort, lessThanOrEqualTo: Float)

    /**
      Method that uses the Infrared Sensor on a specific port, and waits for the measured proximity to an object to be greater than or equal to a specific value.

      **Example**: Wait for the proximity to the Infrared Sensor on Port 1 to be greater than or equal to 5:

      `ev3.waitForIRProximity(on: .one, greaterThanOrEqualTo: 5.0)`

      - Parameters:
        - on: takes an input conforming to enum `InputPort`, either `.one`, `.two`, `.three`, or `.four`
        - greaterThanOrEqualTo: takes a `Float` specifying the proximity value to wait for
     */
    func waitForIRProximity(on: InputPort, greaterThanOrEqualTo: Float)

    /**
      Method that uses the Infrared Sensor on a specific port, and waits for the measured proximity to an object to change.

      **Example**: Wait for the proximity to the Infrared Sensor on Port 1 to change:

      `ev3.waitForIRProximityChange(on: .one)`

      - Parameters:
        - on: takes an input conforming to enum `InputPort`, either `.one`, `.two`, `.three`, or `.four`
     */
    func waitForIRProximityChange(on: InputPort)

    /**
      Method that waits for the heading of the Infrared Sensor on a specific port to be less than or equal to a specific value.

      **Example**: Wait for the heading of the Infrared Sensor on Port 1 to be less than or equal to 5:

      `ev3.waitForIRSeek(on: .one, lessThanOrEqualTo: 5.0)`

      - Parameters:
        - on: takes an input conforming to enum `InputPort`, either `.one`, `.two`, `.three`, or `.four`
        - lessThanOrEqualTo: takes a `Float` specifying the heading value to wait for
     */
    func waitForIRSeek(on: InputPort, lessThanOrEqualTo: Float)

    /**
      Method that waits for the heading of the Infrared Sensor on a specific port to be greater than or equal to a specific value.

      **Example**: Wait for the heading of the Infrared Sensor on Port 1 to be greater than or equal to 5:

      `ev3.waitForIRSeek(on: .one, greaterThanOrEqualTo: 5.0)`

      - Parameters:
        - on: takes an input conforming to enum `InputPort`, either `.one`, `.two`, `.three`, or `.four`
        - greaterThanOrEqualTo: takes a `Float` specifying the heading value to wait for
     */
    func waitForIRSeek(on: InputPort, greaterThanOrEqualTo: Float)

    /**
      Method that waits for the heading of the Infrared Sensor on a specific port to change.

      **Example**: Wait for the heading of the Infrared Sensor on Port 1 to change:

      `ev3.waitForIRSeek(on: .one, greaterThanOrEqualTo: 5.0)`

      - Parameters:
        - on: takes an input conforming to enum `InputPort`, either `.one`, `.two`, `.three`, or `.four`
     */
    func waitForIRSeekChange(on: InputPort)

    /**
     	Method that uses the Gyro Sensor on a specific port to measure the orientation in degrees, and waits for the measurement to be less than or equal to a specific value.


      - Important: The orientation is relative to the last time the sensor was reset.

      **Example**: Wait for the orientation of the Gyro Sensor on Port 1 to be less than or equal to 10:

      `ev3.waitForGyroAngle(on: .one, lessThanOrEqualTo: 10.0)`

      - Parameters:
        - on: takes an input conforming to enum `InputPort`, either `.one`, `.two`, `.three`, or `.four`
        - lessThanOrEqualTo: takes a `Float` specifying the orientation to wait for
      */
    func waitForGyroAngle(on: InputPort, lessThanOrEqualTo: Float)

    /**
      Method that uses the Gyro Sensor on a specific port to measure the orientation in degrees, and waits for the measurement to be greater than or equal to a specific value.

      - Important: The orientation is relative to the last time the sensor was reset.

      **Example**: Wait for the orientation of the Gyro Sensor on Port 1 to be greater than or equal to 10:

      `ev3.waitForGyroAngle(on: .one, greaterThanOrEqualTo: 10.0)`

      - Parameters:
        - on: takes an input conforming to enum `InputPort`, either `.one`, `.two`, `.three`, or `.four`
        - greaterThanOrEqualTo: takes a `Float` specifying the orientation to wait for
     */
    func waitForGyroAngle(on: InputPort, greaterThanOrEqualTo: Float)

    /**
      Method that uses the Gyro Sensor on a specific port to measure the orientation in degrees, and waits for the measurement to change.

      **Example**: Wait for the orientation of the Gyro Sensor on Port 1 to change:

      `ev3.waitForGyroAngleChange(on: .one)`

      - Parameters:
        - on: takes an input conforming to enum `InputPort`, either `.one`, `.two`, `.three`, or `.four`
     */
    func waitForGyroAngleChange(on: InputPort)

    /**
 Method that uses the Gyro Sensor on a specific port to measure rotational motion in degrees per second (rate), and waits for the measurement to be less than or equal to a specific value.


      **Example**: Wait for the rotational motion from the Gyro Sensor in degrees per second (rate) on Port 1 to be less than 25:

      `ev3.waitForGyroRate(on: .one, lessThanOrEqualTo: 25.0)`

      - Parameters:
        - on: takes an input conforming to enum `InputPort`, either `.one`, `.two`, `.three`, or `.four`
        - lessThanOrEqualTo: Takes a `Float` specifying the rate to wait for
     */
    func waitForGyroRate(on: InputPort, lessThanOrEqualTo: Float)

    /**
       Method that uses the Gyro Sensor on a specific port to measure rotational motion in degrees per second (rate), and waits for the measurement to be greater than or equal to a specific value.

      **Example**: Wait for the rotational motion from the Gyro Sensor in degrees per second (rate) on Port 1 to be greater than 25:

      `ev3.waitForGyroRate(on: .one, greaterThanOrEqualTo: 25.0)`

      - Parameters:
        - on: takes an input conforming to enum `InputPort`, either `.one`, `.two`, `.three`, or `.four`
        - greaterThanOrEqualTo: takes a `Float` specifying the rate to wait for
     */
    func waitForGyroRate(on: InputPort, greaterThanOrEqualTo: Float)

    /**
      Method that uses the Gyro Sensor on a specific port to measure the rotational motion in degrees per second (rate), and waits for the measurement to change.


      **Example**: Wait for the rotational motion from the Gyro Sensor in degrees per second (rate) on Port 1 to change:

      `ev3.waitForGyroRateChange(on: .one)`

      - Parameters:
        - on: takes an input conforming to enum `InputPort`, either `.one`, `.two`, `.three`, or `.four`
     */
    func waitForGyroRateChange(on: InputPort)

    /**
      Method that uses the Color Sensor on a specific port and waits for a specific color to be detected.

      **Example**: Wait for the Color Sensor on Port 2 to detect the color yellow:

      `ev3.waitForLightColor(on: .two, color: .yellow)`

      - Parameters:
        - on: takes an input conforming to enum `InputPort`, either `.one`, `.two`, `.three`, or `.four`
        - color: takes an input conforming to enum `ColorValue`, either `.unavailable`, `.black`, `.blue`, `.green`, `.yellow`, `.red`, `.white`, or `.brown`
     */
    func waitForLightColor(on: InputPort, color: ColorValue)

    /**
      Method that uses the Color Sensor on a specific port and waits for the detected color to change.

      **Example**: Wait for the color measured by the Color Sensor on Port 3 to change:

      `ev3.waitForLightColorChange(on: .three)`

      - Parameters:
        - on: takes an input conforming to enum `InputPort`, either `.one`, `.two`, `.three`, or `.four`
     */
    func waitForLightColorChange(on: InputPort)

    /**
     Method that uses the Color Sensor on a specific port to measure the reflected light intensity, and waits for the measurement to be less than or equal to a specific value.

      **Example**: Wait for the reflection from the Color Sensor on Port 2 to be less than or equal to 22:

      `ev3.waitForLightReflection(on: .two, lessThanOrEqualTo: 22.0)`

      - Parameters:
        - on: takes an input conforming to enum `InputPort`, either `.one`, `.two`, `.three`, or `.four`
        - lessThanOrEqualTo: takes a `Float` specifying the reflection to wait for
     */
    func waitForLightReflection(on: InputPort, lessThanOrEqualTo: Float)

    /**
      Method that uses the Color Sensor on a specific port to measure the reflected light intensity, and waits for the measurement to be greater than or equal to a specific value.

      **Example**: Wait for the reflection from the Color Sensor on Port 2 to be greater than or equal to 22:

      `ev3.waitForLightReflection(on: .two, greaterThanOrEqualTo: 22.0)`

      - Parameters:
        - on: takes an input conforming to enum `InputPort`, either `.one`, `.two`, `.three`, or `.four`
        - greaterThanOrEqualTo: takes a `Float` specifying the reflection to wait for
     */
    func waitForLightReflection(on: InputPort, greaterThanOrEqualTo: Float)

    /**
      Method that uses the Color Sensor on a specific port to measure the reflected light intensity, and waits for the measurement to change.


      **Example**: Wait for the reflection from the Color Sensor on Port 2 to change:

      `ev3.waitForLightReflectionChange(on: .two)`

      - Parameters:
        - on: Takes an input conforming to enum `InputPort`, either `.one`, `.two`, `.three`, or `.four`
     */
    func waitForLightReflectionChange(on: InputPort)

    /**
      Method that uses the Color Sensor on a specific port to measure the ambient light intensity, and waits for the measurement to be less than or equal to a specific value.


      **Example**: Wait for the ambient light intensity measured by the Color Sensor on Port 2 to be less than or equal to 15:

      `ev3.waitForLightAmbient(on: .two, lessThanOrEqualTo: 15.0)`

      - Parameters:
        - on: takes an input conforming to enum `InputPort`, either `.one`, `.two`, `.three`, or `.four`
        - lessThanOrEqualTo: takes a `Float` specifying the ambient light intensity to wait for
     */
    func waitForLightAmbient(on: InputPort, lessThanOrEqualTo: Float)

    /**
       Method that uses the Color Sensor on a specific port to measure the ambient light intensity, and waits for the measurement to be greater than or equal to a specific value.

      **Example**: Wait for the ambient light intensity measured by the Color Sensor on Port 2 to be greater than or equal to 15:

      `ev3.waitForLightAmbient(on: .two, greaterThanOrEqualTo: 15.0)`

      - Parameters:
        - on: takes an input conforming to enum `InputPort`, either `.one`, `.two`, `.three`, or `.four`
        - greaterThanOrEqualTo: takes a `Float` specifying the ambient light intensity to wait for
     */
    func waitForLightAmbient(on: InputPort, greaterThanOrEqualTo: Float)

    /**
      Method that uses the Color Sensor on a specific port to measure the ambient light intensity, and waits for the measurement to change.


      **Example**: Wait for the ambient light intensity measured by the Color Sensor on Port 2 to change:

      `ev3.waitForLightAmbientChange(on: .two)`

      - Parameters:
        - on: takes an input conforming to enum `InputPort`, either `.one`, `.two`, `.three`, or `.four`
     */
    func waitForLightAmbientChange(on: InputPort)

    /**
      Wait for the Touch Sensor on a specific port to be touched.

      **Example**: Wait for the Touch Sensor on Port 4 to be touched:

      `ev3.waitForTouch(on: .four)`

      - Parameters:
        - on: takes an input conforming to enum `InputPort`, either `.one`, `.two`, `.three`, or `.four`
     */
    func waitForTouch(on: InputPort)

    /**
      Wait for the Touch Sensor on a specific port to be released.

      **Example**: Wait for the Touch Sensor on Port 4 to be released:

      `ev3.waitForTouchReleased(on: .four)`

      - Parameters:
        - on: takes an input conforming to enum `InputPort`, either `.one`, `.two`, `.three`, or `.four`
     */
    func waitForTouchReleased(on: InputPort)

    /**
      Wait for the number of touches measured by a Touch Sensor on a specific port to be greater than or equal to a specific value.

      **Example**: Wait for the Touch Sensor on Port 4 to be touched 11 times:

      `ev3.waitForTouchCount(on: .four, greaterThanOrEqualTo: 11.0)`

      - Parameters:
        - on: takes an input conforming to enum `InputPort`, either `.one`, `.two`, `.three`, or `.four`
        - greaterThanOrEqualTo: takes a `Float` specifying the number of touches to wait for
     */
    func waitForTouchCount(on: InputPort, greaterThanOrEqualTo: Float)

    /**
      Method that waits for the current value of rotation, in degrees, on a Medium or Large Motor on a specific output port to be less than or equal to a specific value.

      **Example**: Wait for the rotation, in degrees, of a Medium or Large Motor on Port B to be less than or equal to 270:

      `ev3.waitForMotorDegrees(on: .b, lessThanOrEqualTo: 270.0)`

      - Parameters:
        - on: takes an input conforming to enum `OutputPort`, either `.a`, `.b`, `.c`, or `.d`
        - lessThanOrEqualTo: takes a `Float` specifying the rotation in degrees to wait for
     */
    func waitForMotorDegrees(on: OutputPort, lessThanOrEqualTo: Float)

    /**
      Method that waits for the current value of rotation, in degrees, on a Medium or Large Motor on a specific output port to be greater than or equal to a specific value.

      **Example**: Wait for the rotation, in degrees, of a Medium or Large Motor on Port B to be greater than or equal to 270:

      `ev3.waitForMotorDegrees(on: .b, greaterThanOrEqualTo: 270.0)`

      - Parameters:
        - on: takes an input conforming to enum `OutputPort`, either `.a`, `.b`, `.c`, or `.d`
        - greaterThanOrEqualTo: takes a `Float` specifying the rotation in degrees to wait for
     */
    func waitForMotorDegrees(on: OutputPort, greaterThanOrEqualTo: Float)

    /**
      Method that waits for the current value of rotation, in degrees, on a Medium or Large Motor on a specific output port to change.

      **Example**: Wait for the rotation, in degrees, of a Medium or Large Motor on Port B to change:

      `ev3.waitForMotorDegreesChange(on: .b)`

      - Parameters:
        - on: takes an input conforming to enum `OutputPort`, either `.a`, `.b`, `.c`, or `.d`
     */
    func waitForMotorDegreesChange(on: OutputPort)

    /**
      Method that waits for the current number of rotations of a Medium or Large Motor on a specific output port to be less than or equal to a specific value.

      **Example**: Wait for the number of rotations of a Medium or Large Motor on Port B to be less than or equal to 4:

      `ev3.waitForMotorRotations(on: .b, lessThanOrEqualTo: 4.0)`

      - Parameters:
        - on: takes an input conforming to enum `OutputPort`, either `.a`, `.b`, `.c`, or `.d`
        - lessThanOrEqualTo: takes a `Float` specifying the number of rotations to wait for
     */
    func waitForMotorRotations(on: OutputPort, lessThanOrEqualTo: Float)

    /**
      Method that waits for current number of rotations of a Medium or Large Motor on a specific output port to be greater than or equal to a specific value.

      **Example**: Wait for the number of rotations of a Medium or Large Motor on Port B to be greater than or equal to 4:

      `ev3.waitForMotorRotations(on: .b, greaterThanOrEqualTo: 4.0)`

      - Parameters:
        - on: takes an input conforming to enum `OutputPort`, either `.a`, `.b`, `.c`, or `.d`
        - greaterThanOrEqualTo: takes a `Float` specifying the number of rotations to wait for
     */
    func waitForMotorRotations(on: OutputPort, greaterThanOrEqualTo: Float)

    /**
      Method that waits for the current number of rotations of a Medium or Large Motor on a specific output port to change.

      **Example**: Wait for the number of rotations of a Medium or Large Motor on Port B to change:

      `ev3.waitForMotorRotationsChange(on: .b)`

      - Parameters:
        - on: takes an input conforming to enum `OutputPort`, either `.a`, `.b`, `.c`, or `.d`
     */
    func waitForMotorRotationsChange(on: OutputPort)

    /**
      Method that waits for the current value of power on a Medium or Large Motor on a specific output port to be less than or equal to a specific value.

      **Example**: Wait for the power of a Medium or Large Motor on Port B to be less than or equal to 40:

      `ev3.waitForMotorPower(on: .b, lessThanOrEqualTo: 40.0)`

      - Parameters:
        - on: takes an input conforming to enum `OutputPort`, either `.a`, `.b`, `.c`, or `.d`
        - lessThanOrEqualTo: takes a `Float` specifying the power level to wait for
     */
    func waitForMotorPower(on: OutputPort, lessThanOrEqualTo: Float)

    /**
      Method that waits for the current value of power on a Medium or Large Motor on a specific output port to be greater than or equal to a specific value.

      **Example**: Wait for the power of a Medium or Large Motor on Port B to be greater than or equal to 40:

      `ev3.waitForMotorPower(on: .b, greaterThanOrEqualTo: 40.0)`

      - Parameters:
        - on: takes an input conforming to enum `OutputPort`, either `.a`, `.b`, `.c`, or `.d`
        - greaterThanOrEqualTo: takes a `Float` specifying the power level to wait for
     */
    func waitForMotorPower(on: OutputPort, greaterThanOrEqualTo: Float)

    /**
      Method for waiting for a specific time.

      **Example**: Wait for 3 seconds:

      `ev3.waitFor(seconds: 3.0)`

      - Parameters:
        - seconds: takes a `Float` specifying the time to wait for in seconds
     */
    func waitFor(seconds: Float)

    // MARK: - Display

    /**
     Method for displaying text in the top left corner of the Brick Display.

     **Example:** Show the text "Hello, human!" on the Brick Display:

     `ev3.display(text: "Hello, human!")`

     - Parameters:
        - text: takes a `String` to be displayed on the Display
    */
    func display(text: String)

    /**
     Method for displaying text in a specific position, color, and font on the Brick Display, possibly clearing the Display first.

     **Example:** Clear the screen, and display the text "Hello, human!" in bold black text in the middle of the Display:

     `ev3.display(text: "Hello, human!", atX: 40, atY: 60, withColor: .black, withFont: .bold, clearScreen: true)`

     - Parameters:
        - text: takes a `String` to be shown on the Display
        - atX: takes an `Int` in range 0 to 177 for the top *horizontal* position, starting from the left, of the *top left corner* of the text
        - atY: takes an `Int` 0 to 127 for the top *vertical* position, starting from the top, of the *top left corner* of the text
        - withColor: takes an input conforming to enum `DisplayColor`, either `.white` or `.black`
        - withFont: takes an input conforming to enum `DisplayFont`, either  `.normal`, `.bold`, or `.large`
        - clearScreen: takes a `Bool` with value `true` if the screen should be cleared beforehand, and `false` otherwise
     */
    func display(text: String, atX: Int, atY: Int, withColor: DisplayColor, withFont: DisplayFont, clearScreen: Bool)

    /**
     Method for displaying a straight line in a specific color between 2 points, possibly clearing the Display first.

     **Example:** Show a black line from the top left corner to the bottom right corner of the Display:

     `ev3.displayLine(fromX: 0, fromY: 0, toX: 177, toY: 127, withColor: .black, clearScreen: true`

     - Parameters:
        - fromX: takes an `Int` in range 0 to 177 for the *horizontal* starting point, counting from the left of the Display
        - fromY: takes an `Int` in range 0 to 127 for the *vertical* starting point, counting from the top of the Display
        - toX: takes an `Int` in range 0 to 177 for the *horizontal* ending point, counting from the left of the Display
        - toY: takes an `Int` in range 0 to 127 for the *vertical* ending point, counting from the top of the Display
        - withColor: takes an input conforming to enum `DisplayColor`, either `.white` or `.black`
        - clearScreen: takes a `Bool` with value `true` if the screen should be cleared beforehand, and `false` otherwise
    */
    func displayLine(fromX: Int, fromY: Int, toX: Int, toY: Int, withColor: DisplayColor, clearScreen: Bool)

    /**
     Method for displaying a circle at a specific point, with a specific radius, color, and fill, and possibly clearing the Display.

     **Example:** Show a filled, black circle in the center of the Display with a radius of 40:

     `ev3.displayCircle(centerX: 88, centerY: 63, withRadius: 40, withFill: true, withColor: .black, clearScreen: true)`

     - Parameters:
        - centerX: takes an `Int` in range 0 to 177 for the *horizontal* center point, counting from the left of the Display
        - centerY: takes an `Int` in range 0 to 127 for the *vertical* center point, counting from the top of the Display
        - withRadius: takes an `Int` describing the radius in number of pixels
        - withFill: takes a `Bool` with value `true` if the circle should be filled
        - withColor: takes an input conforming to enum `DisplayColor`, either `.white` or `.black`
        - clearScreen: takes a `Bool` with value `true` if the Display should be cleared beforehand, and `false` otherwise
    */
    func displayCircle(centerX: Int, centerY: Int, withRadius: Float, withFill: Bool, withColor: DisplayColor, clearScreen: Bool)

    /**
     Method for displaying a rectangle in a specific position, with a specific width, length, color, and fill, and possibly clearing the Display.

     **Example:** Clear the Display and show a long, filled, black rectangle in the top left of the Display:

     `ev3.displayRectangle(atX: 0, atY: 0, length: 80, height: 20, withFill: true, withColor: .black, clearSCreen: true`

     - Parameters:
        - atX: takes an `Int` in range 0 to 177 for the top *horizontal* position, starting from the left, of the *top left corner* of the rectangle
        - atY: takes an `Int` 0 to 127 for the top *vertical* position, starting from the top, of the *top left corner* of the rectangle
        - length: takes an `Int` describing the length in pixels of the rectangle
        - height: takes an `Int` describing the height in pixels of the rectangle
        - withFill: takes a `Bool` with vlaue `true` if the rectangle should be filled
        - withColor: takes an input conforming to enum `DisplayColor`, either `.white` or `.black`
        - clearScreen: takes a `Bool` with value `true` if the Display should be cleared beforehand, and `false` otherwise
     */
    func displayRectangle(atX: Int, atY: Int, length: Int, height: Int, withFill: Bool, withColor: DisplayColor, clearScreen: Bool)

    /**
     Method for displaying a point in a specified color and at a specific position, possibly clearing the Display first.

     **Example:** Clear the Display and show a point in the middle:

     `ev3.displayPoint(atX: 88, atY: 63, withColor: .black, clearScreen: true)`

     - Parameters:
        - atX: takes an `Int` in range 0 to 177 for the *horizontal* position, starting from the left
        - atY: takes an `Int` 0 to 127 for the *vertical* position, starting from the top
        - withColor: takes an input conforming to enum `DisplayColor`, either `.white` or `.black`
        - clearScreen: takes a `Bool` with value `true` if the Display should be cleared beforehand, and `false` otherwise
     */
    func displayPoint(atX: Int, atY: Int, withColor: DisplayColor, clearScreen: Bool)

    /**
     Method for clearing the Display and showing a specific image.

     **Example:** Display the EV3 icon:

     `ev3.displayImage(named: .ev3Icon)`

     - Parameters:
        - named: takes an input conforming to enum `ImageName`. One of the following:
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
    */
    func displayImage(named: ImageName)

    /**
     Method for displaying a specific image in a specific position, possibly clearing the Display.

     **Example:** Display the EV3 icon:

     `ev3.displayImage(named: .ev3Icon, atX: 0, atY: 0, clearScreen: true)`

     - Parameters:
        - named: takes an input conforming to enum `ImageName`, one of the following:
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
     
        - atX: takes an `Int` in range 0 to 177 for the top *horizontal* position, starting from the left, of the *top left corner* of the text
        - atY: takes an `Int` 0 to 127 for the top *vertical* position, starting from the top, of the *top left corner* of the text
        - clearScreen: takes a `Bool` with value `true` if the Display should be cleared beforehand, and `false` otherwise
     */
    func displayImage(named: ImageName, atX: Int, atY: Int, clearScreen: Bool)
}

// MARK: - Overloads With Default Arguments
public extension RobotAPI {

    // MARK: Sound

    /**
    Method for playing a sound at a specific frequency for a specific duration of time and at a specific volume, which waits for the sound to finish playing.

     **Example**: Play a sound with a frequency of 440 Hz for 2 seconds at full volume:

     `ev3.playSound(frequency: 440.0, forSeconds: 2.0, atVolume: 100.0)`

     - Parameters:
        - frequency: takes a `Float` between `250.0` and `10000.0` specifying the frequency of the sound to be played
        - forSeconds: takes a `Float` specifying the duration of the sound to be played in seconds as a `Float`
        - atVolume: takes a `Float` specifying a volume between `0.0` and `100.0`
     */
    public func playSound(frequency: Float, forSeconds seconds: Float, atVolume volume: Float) {
        playSound(frequency: frequency, forSeconds: seconds, atVolume: volume, waitForCompletion: true)
    }

    /**
     Method for playing a note for a specific duration of time and at a specific volume, which waits for the sound to finish playing.

     A `Note` is an enum giving names to the notes between `.c4` and `.dSharp9`.

     **Example**: Play an A4 note for 3 seconds at a volume of 50:

     `ev3.playSound(note: .a4, forSeconds: 3.0, atVolume: 50.0)`

     - Parameters:
        - note: takes an input conforming to enum `Note`, such as `.c4`, `.b7`, `.dSharp9` or anything in between
        - forSeconds: takes a `Float` specifying the duration of the sound to be played in seconds as a `Float`
        - atVolume: takes a `Float` specifying a volume between `0.0` and `100.0`
     */
    public func playSound(note: Note, forSeconds seconds: Float, atVolume volume: Float) {
        playSound(frequency: note.rawValue, forSeconds: seconds, atVolume: volume, waitForCompletion: true)
    }

    // MARK: Move

    /**
     Method for making a robot drive forward, backward, turn, or stop for a duration specified in seconds, using two Large Motors, each with their respective power and input port, applying the motor brakes at the end.

     - Important: Refer to the [glossary](glossary://ev3.move) for more details.

     **Example**: Make a robot drive forward at full power for 2 seconds, using Port A for the left motor and port D for the right motor:

     `ev3.move(forSeconds: 2.0, leftPort: .a, rightPort: .d, leftPower: 100.0, rightPower: 100.0)`

     - Parameters:
        - forSeconds: takes a `Float` specifying the amount of seconds both motors should run
        - leftPort: takes an input conforming to enum `OutputPort`, either `.a`, `.b`, `.c`, or `.d`
        - rightPort: takes an input conforming to enum `OutputPort`, either `.a`, `.b`, `.c`, or `.d`
        - leftPower: takes an arbitrary value between `-100.0` and `100.0` as a `Float`, where `-100.0` is maximum power in counter-clockwise rotation, `0.0` is stopped and `100.0` is maximum power in clockwise rotation
        - rightPower: takes an arbitrary value between `-100.0` and `100.0` as a `Float`, where `-100.0` is maximum power in counter-clockwise rotation, `0.0` is stopped and `100.0` is maximum power in clockwise rotation
     */
    func move(forSeconds: Float, leftPort: OutputPort, rightPort: OutputPort, leftPower: Float, rightPower: Float) {
        move(forSeconds: forSeconds, leftPort: leftPort, rightPort: rightPort, leftPower: leftPower, rightPower: rightPower, brakeAtEnd: true)
    }

    /**
     Method for making a robot drive forward, backward, turn, or stop for a duration specified in seconds, using two Large Motors, each with their respective power and input port, applying the motor brakes at the end.


     - Important: Refer to the [glossary](glossary://ev3.move) for more details.

     **Example**: Make a robot drive forward at full power for 540 degrees, using Port A for the left motor and Port D for the right motor:

     `ev3.move(forDegrees: 540.0, leftPort: .a, rightPort: .d, leftPower: 100.0, rightPower: 100.0)`

     - Parameters:
        - forSeconds: takes a `Float` specifying the amount of seconds both motors should run
        - leftPort: takes an input conforming to enum `OutputPort`, either `.a`, `.b`, `.c`, or `.d`
        - rightPort: takes an input conforming to enum `OutputPort`, either `.a`, `.b`, `.c`, or `.d`
        - leftPower: takes an arbitrary value between `-100.0` and `100.0` as a `Float`, where `-100.0` is maximum power in counter-clockwise rotation, `0.0` is stopped and `100.0` is maximum power in clockwise rotation
        - rightPower: takes an arbitrary value between `-100.0` and `100.0` as a `Float`, where `-100.0` is maximum power in counter-clockwise rotation, `0.0` is stopped and `100.0` is maximum power in clockwise rotation
     */
    func move(forDegrees: Float, leftPort: OutputPort, rightPort: OutputPort, leftPower: Float, rightPower: Float) {
        move(forDegrees: forDegrees, leftPort: leftPort, rightPort: rightPort, leftPower: leftPower, rightPower: rightPower, brakeAtEnd: true)
    }

    /**
     Method for making a robot drive forward, backward, turn, or stop for a duration specified in revolutions, using two Large Motors, each with their respective power and input port, applying the motor brakes at the end.

     - Important: Refer to the [glossary](glossary://ev3.move) for more details.

     **Example**: Make a robot drive forward at full power for 2 rotations, using Port A for the left motor and Port D for the right motor:

     `ev3.move(forRotations: 2.0, leftPort: .a, rightPort: .d, leftPower: 100.0, rightPower: 100.0)`

     - Parameters:
        - forRotations: takes a `Float` specifying the amount of revolutions both motors should run
        - leftPort: takes an input conforming to enum `OutputPort`, either `.a`, `.b`, `.c`, or `.d`
        - rightPort: takes an input conforming to enum `OutputPort`, either `.a`, `.b`, `.c`, or `.d`
        - leftPower: takes an arbitrary value between `-100.0` and `100.0` as a `Float`, where `-100.0` is maximum power in counter-clockwise rotation, `0.0` is stopped and `100.0` is maximum power in clockwise rotation
        - rightPower: takes an arbitrary value between `-100.0` and `100.0` as a `Float`, where `-100.0` is maximum power in counter-clockwise rotation, `0.0` is stopped and `100.0` is maximum power in clockwise rotation
     */
    func move(forRotations: Float, leftPort: OutputPort, rightPort: OutputPort, leftPower: Float, rightPower: Float) {
        move(forRotations: forRotations, leftPort: leftPort, rightPort: rightPort, leftPower: leftPower, rightPower: rightPower, brakeAtEnd: true)
    }

    /**
     Method for stopping the motors on two ports by applying the motor brake.

     **Example**: Stop the motors on Ports A and C, applying the motor brake:

     `ev3.stopMove(leftPort: .a, rightPort: .b)`

     - Parameters:
        - leftPort: takes an input conforming to enum `OutputPort`, either `.a`, `.b`, `.c`, or `.d`
        - rightPort: takes an input conforming to enum `OutputPort`, either `.a`, `.b`, `.c`, or `.d`
     */
    func stopMove(leftPort: OutputPort, rightPort: OutputPort) {
        stopMove(leftPort: leftPort, rightPort: rightPort, withBrake: true)
    }

    // MARK: Single motor

    /**
     Method for turning off a motor on a specific port by applying the motor brake.

     **Example**: Turn off a motor on Port A:

     `ev3.motorOff(on: .a)`

     - Parameters:
        - on: takes an input conforming to enum `OutputPort`, either `.a`, `.b`, `.c`, or `.d`
     */
    func motorOff(on port: OutputPort) {
        motorOff(on: port, brakeAtEnd: true)
    }

    /**
     Method for turning on a motor on a specific port, at a specific power for a defined number of seconds, applying the motor brake at the end.

     **Example**: Turn on a motor on Port A at power of 50 for 2 seconds:

     `ev3.motorOn(forSeconds: 2, on: .a, withPower: 50.0)`

     - Parameters:
        - forSeconds: takes a `Float` describing the number of seconds to have the motor *on* for
        - on: takes an input conforming to enum `OutputPort`, either `.a`, `.b`, `.c`, or `.d`
        - withPower: takes a `Float` specifying a value between `-100.0` and `100.0`
     */
    func motorOn(forSeconds: Float, on port: OutputPort, withPower: Float) {
        motorOn(forSeconds: forSeconds, on: port, withPower: withPower, brakeAtEnd: true)
    }

    /**
      Method for turning on a motor on a specific port, at a specific power for a specified number of degrees, applying the motor brake at the end.

     **Example**: Turn on a motor on Port A at power of 50 for 180 degrees:

     `ev3.motorOn(forDegrees: 180, on: .a, withPower: 50.0)`

     - Parameters:
        - forDegrees: takes a `Float` describing the number of degrees to have the motor *on* for
        - on: takes an input conforming to enum `OutputPort`, either `.a`, `.b`, `.c`, or `.d`
        - withPower: takes a `Float` specifying a value between `-100.0` and `100.0`
     */
    func motorOn(forDegrees: Float, on port: OutputPort, withPower: Float) {
        motorOn(forDegrees: forDegrees, on: port, withPower: withPower, brakeAtEnd: true)
    }

    /**
     Method for turning on a motor on a specific port, at a specific power for a specified number of rotations, applying the motor brake at the end.

     **Example**: Turn on a motor on Port A at a power of 50 for 3 rotations:

     `ev3.motorOn(forRotations: 3, on: .a, withPower: 50.0)`

     - Parameters:
        - forRotations: takes a `Float` describing the number of revolutions to have the motor *on* for
        - on: takes an input conforming to enum `OutputPort`, either `.a`, `.b`, `.c`, or `.d`
        - withPower: takes a `Float` specifying a value between `-100.0` and `100.0`
     */
    func motorOn(forRotations: Float, on port: OutputPort, withPower: Float) {
        motorOn(forRotations: forRotations, on: port, withPower: withPower, brakeAtEnd: true)
    }

}
