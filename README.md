# LEGO® MINDSTORMS® Education EV3 for Microsoft MakeCode [![Build Status](https://travis-ci.org/microsoft/pxt-ev3.svg?branch=master)](https://travis-ci.org/microsoft/pxt-ev3)

This repo contains the editor target hosted at https://makecode.mindstorms.com

## Local setup

These instructions assume familiarity with dev tools and languages.

* install Node.js 8.9.4+
* install Docker; make sure `docker` command is in your `PATH`
* (optional) install [Visual Studio Code](https://code.visualstudio.com/)

* clone https://github.com/Microsoft/pxt-ev3 to ``pxt-ev3`` folder
* go to ``pxt`` and run

```
npm install
```

* to run the local server,
```
pxt serve --cloud
```

## Local Dev setup

In the common folder,

* clone https://github.com/Microsoft/pxt to ``pxt`` folder
* clone https://github.com/Microsoft/pxt-common-packages to ``pxt-common-packages`` folder

* go to ``pxt-common-packages`` and run

```
npm install
npm link ../pxt
```

* go to ``pxt-ev3`` and run

```
npm install
npm link ../pxt
npm link ../pxt-common-packages
```

## to run the local server

From root github folder,

```
cd pxt-ev3
pxt serve --cloud
```

## to build and deploy a single package via command line

```
cd libs/core
pxt deploy
```

## License
MIT

## Trademarks
MICROSOFT, the Microsoft Logo, and MAKECODE are registered trademarks of Microsoft Corporation. They can only be used for the purposes described in and in accordance with Microsoft’s Trademark and Brand guidelines published at https://www.microsoft.com/en-us/legal/intellectualproperty/trademarks/usage/general.aspx. If the use is not covered in Microsoft’s published guidelines or you are not sure, please consult your legal counsel or the MakeCode team (makecode@microsoft.com). 

## Code of Conduct

This project has adopted the [Microsoft Open Source Code of Conduct](https://opensource.microsoft.com/codeofconduct/). For more information see the [Code of Conduct FAQ](https://opensource.microsoft.com/codeofconduct/faq/) or contact [opencode@microsoft.com](mailto:opencode@microsoft.com) with any additional questions or comments.
