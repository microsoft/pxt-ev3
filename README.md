# LEGO Mindstorms EV3 target for PXT

[![Build Status](https://ci2.dot.net/buildStatus/icon?job=Private/pxt_project_rainbow/master/pxt-ev3_Push)](https://ci2.dot.net/job/Private/job/pxt_project_rainbow/job/master/job/pxt-ev3_Push/)

This repo contains the editor target hosted at https://d541eec2-1e96-4b7b-a223-da9d01d0337a.pxt.io/

## Local Dev setup

These instructions assume familiarity with dev tools and languages.

* install Node.js 6+
* install Docker; make sure `docker` command is in your `PATH`
* (optional) install [Visual Studio Code](https://code.visualstudio.com/)

In a common folder,

* clone https://github.com/Microsoft/pxt to ``pxt`` folder
* clone https://github.com/Microsoft/pxt-common-packages to ``pxt-common-packages`` folder
* clone https://github.com/Microsoft/pxt-ev3 to ``pxt-ev3`` folder
* go to ``pxt`` and run

```
npm install
typings install
```

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

### Hosted editor

Currently hosted at:

https://d541eec2-1e96-4b7b-a223-da9d01d0337a.pxt.io/

### Jenkins build
https://ci2.dot.net/job/Private/job/pxt_project_rainbow/job/master/

## License
MIT

## Code of Conduct

This project has adopted the [Microsoft Open Source Code of Conduct](https://opensource.microsoft.com/codeofconduct/). For more information see the [Code of Conduct FAQ](https://opensource.microsoft.com/codeofconduct/faq/) or contact [opencode@microsoft.com](mailto:opencode@microsoft.com) with any additional questions or comments.
