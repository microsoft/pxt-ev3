# MakeCode for FIRST LEGO League

![FIRST LEGO League logo](/static/fll/fll-logo.png)

For teams participating in the Open Software Platform Pilot utilizing MakeCode, we’ve compiled a list of resources and information that we hope will be helpful for you.

## Open Issues

1. Deleting Programs from the EV3 brick

>* Description: Unable to delete program files from the EV3 brick after downloading them
>* Status: LEGO Education team is working on a fix, no estimated date yet

## FAQ

### How do I use MakeCode with my EV3?

* You will need to install the latest EV3 firmware on your brick. Instructions on how to do that are located here: https://makecode.mindstorms.com/troubleshoot.
* You will need a computer with a USB port to connect to the EV3 in order to download your programs.
* You will need internet access and a browser on your computer to get to https://makecode.mindstorms.com.

### What’s the best way to get started with MakeCode?

Watch some of the videos at https://makecode.mindstorms.com (at the bottom of the page).
Try some of the provided tutorials:

* Wake Up! – show your EV3 brick waking up
* Animation – create a custom animation to show
* Music Brick – transform your EV3 into a musical instrument
* Run Motors – control the motors of your robot
* Red Light, Green Light – play red light, green light with the color sensor
* Line Following – have your robot follow a line

### Can I load both LEGO MINDSTORMS EV3 Software and MakeCode programs onto my EV3?

Yes.

### How do I figure out what a block does?

You can right-click on any block and select “Help” in the context menu to open the documentation page describing what that block does.

![Select help in context menu for block](/static/fll/context-help.jpg)

### How do I program in JavaScript?

Click the **JavaScript** button at the top of the page to get to the JavaScript editor.  Students can drag and drop code snippets from the Toolbox on the left, or type directly in the editor. You can switch back and forth between **Blocks** and **JavaScript** as you program.

### How do I use the Simulator?

The Simulator will show the physical representation of your code blocks. For example, based on this code snippet, the Simulator with show the touch sensor on Port 1, and a large motor on Port D.

```blocks
sensors.touch1.onEvent(ButtonEvent.Pressed, function () {
    motors.largeD.run(50)
})
```
 
```sim
sensors.touch1.onEvent(ButtonEvent.Pressed, function () {
    motors.largeD.run(50)
})
```

Note that the Simulator is also interactive, so you can simulate inputs with any of the sensors.

### How do I save my programs?

MakeCode will automatically save your recent projects in the browser. However, you can also save a copy of your project as a file on your computer:

* From the **Settings** menu, select **Save Project**
* This will download your program from the browser as a _lego-myproject.uf2_ file

![Save project menu selection](/static/fll/save-project.jpg)

* You can import your saved projects by clicking the Import button on the Home Page
 
![Import button on home screen](/static/fll/import-button.jpg)

### How do I share my programs?

You can share your projects by clicking on the Share button in the top left of the screen.  This will create a URL which you can send others to open and view your project.
 
![Share button in editor](/static/fll/share-program.jpg)

For other common questions, try the FAQ page https://makecode.mindstorms.com/faq. 

## Community connection

For questions, issues, feedback and community for the Open Software Platform Pilot:

We are using a messaging service called Slack. Slack can be accessed via an app you download to your computer or mobile device, and via a web interface. For more information about Slack, click [here](https://slack.com/). Anyone in the pilot can participate by signing up with Slack first, and then clicking this [FIRST LEGO League Robot SW](https://join.slack.com/t/fllrobotsw/shared_invite/enQtNDU1MjQ5MDU0ODQ5LTY0ZTgzMDk1MThjYjg4NmM5ZTlmMWJhMzg4OWI2ZGQ3ZjBlNjIyY2Q2MDM5NTAyYzIyZTU1NmM0MTdlOTBkMDk) link to join the Slack workspace.
