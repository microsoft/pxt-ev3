# MakeCode for _FIRST_ LEGO League

![FIRST LEGO League logo](/static/fll/fll-logo.png)

For teams participating in the Open Software Platform Pilot utilizing MakeCode, we’ve compiled a list of resources and information that we hope will be helpful for you.

* **Got a question? Post it on the forums** at https://forum.makecode.com/

## FAQ

### I found a bug what do I do?

If you found a bug, please try if it hasn't been fixed yet! Go to https://makecode.mindstorms.com/beta and try if the bug is corrected. Otherwise, please tell us at https://forum.makecode.com/.

### How do I use MakeCode with my EV3?

* You will need to install the latest EV3 firmware on your brick. Instructions on how to do that are located here: https://makecode.mindstorms.com/troubleshoot.
* You will need a computer with a USB port to connect to the EV3 in order to download your programs.
* You will need internet access and a browser on your computer to get to https://makecode.mindstorms.com.

### What’s the best way to get started with MakeCode?

Watch some of the videos at https://makecode.mindstorms.com (at the bottom of the page).
Try some of the provided tutorials:

* [Wake Up!](@homeurl@#tutorial:tutorials/wake-up) – show your EV3 brick waking up
* [Animation](@homeurl@#tutorial:tutorials/make-an-animation) – create a custom animation to show
* [Music Brick](@homeurl@#tutorial:tutorials/music-brick) – transform your EV3 into a musical instrument
* [Run Motors](@homeurl@#tutorial:tutorials/run-motors) – control the motors of your robot
* [Red Light, Green Light](@homeurl@#tutorial:tutorials/redlight-greenlight) – play red light, green light with the color sensor
* [Line Following](@homeurl@#tutorial:tutorials/line-following) – have your robot follow a line

### Can I load both LEGO MINDSTORMS EV3 Software and MakeCode programs onto my EV3?

Yes.

### How do I figure out what a block does?

You can right-click on any block and select “Help” in the context menu to open the documentation page describing what that block does.

![Select help in context menu for block](/static/fll/context-help.jpg)

### How do I program in JavaScript?

Click the **JavaScript** button at the top of the page to get to the JavaScript editor. Students can drag and drop code snippets from the Toolbox on the left, or type directly in the editor. You can switch back and forth between **Blocks** and **JavaScript** as you program.

![Coding in JavaScript](/static/fll/code-js.gif)

Also, watch the [Text-based Coding](https://legoeducation.videomarketingplatform.co/v.ihtml/player.html?token=3513a83b87fe536b2dc512237465fd1b&source=embed&photo%5fid=35719471) video for more about coding using the JavaScript editor.

### How do I use the Simulator?

The Simulator will show the physical representation of your code blocks. For example, based on this code snippet, the Simulator will show the touch sensor on Port 1, and a large motor on Port D.

```blocks
sensors.touch1.onEvent(ButtonEvent.Pressed, function () {
    motors.largeD.run(50)
})
```

![Simulator demonstration](/static/fll/simulator.gif)

Note that the Simulator is also interactive, so you can simulate inputs with any of the sensors.

See the video [Block-based Coding and Simulation](https://legoeducation.videomarketingplatform.co/v.ihtml/player.html?token=629730c938e452f0fd7653fbc4708166&source=embed&photo%5fid=35719470) for more about using the simulator.

### How do I save my programs?

MakeCode will automatically save your recent projects in the browser. However, you can also save a copy of your project as a file on your computer:

* From the **Settings** menu, select **Save Project**
* This will download your program from the browser as a _lego-myproject.uf2_ file

![Save project menu selection](/static/fll/save-project.jpg)

* You can import your saved projects by clicking the Import button on the Home Page
 
![Import button on home screen](/static/fll/import-button.jpg)

### How do I share my programs?

You can share your projects by clicking on the **share** button in the top left of the screen.  This will create a URL which you can send others to open and view your project.
 
![Share button in editor](/static/fll/share-button.jpg)

![Share button and dialogs demo](/static/fll/share-program.gif)

Sharing programs is also shown in the [Tips and Tricks](https://legoeducation.videomarketingplatform.co/v.ihtml/player.html?token=5c594c2373367f7870196f519f3bfc7a&source=embed&photo%5fid=35719472) video.

### Why can't I delete my program (*.uf2) files from the Brick?

There's a bug in the firmware which prevents you from deleting the programs (``*.uf2`` files) from your EV3 Brick. There isn't a firmware update to fix this yet. As a workaround, you can temporarily downgrade your firmware version, delete the files, and then upgrade back to the version that works with MakeCode.

Follow these steps to downgrade your firmware version, delete the files, and uprgade back again:

1. Go into **EV3 LabVIEW** - if it's not installed get it [here](https://education.lego.com/en-us/downloads/mindstorms-ev3/software)
2. Plug in your EV3 Brick and start a new project
3. Go to the **Tools** menu in the upper right corner, select **Firmware Update**
4. In the **Firmware Update** dialog box, click on the **Show Details** button
5. From the **Available Firmware Files** list, select **EV3 Firmware V1.09E**
6. Click the **Update Firmware** button and wait for the update to complete

Now the firmware version on the EV3 Brick will be **V1.09E**. Also, in the process, the downgrade deleted all of the saved programs from the EV3 Brick. To continue to use MakeCode, the firmware version must be at **V1.10E** or above. So, the Brick firmware needs to be upgraded again. If you don't know or do remember how to do this, see the **Upgrade your @drivename@** section in the [troubleshooting](/troubleshoot) page.

For other common questions, try the FAQ page https://makecode.mindstorms.com/faq.

## Workarounds

1. Deleting Programs from the EV3 brick

>* Description: Unable to delete program files from the EV3 brick after downloading them
>* Status: LEGO Education team is working on a fix, no estimated date yet
