# ColorInterpreter
[![View on NPM](http://img.shields.io/npm/v/colorinterpreter.svg)](https://www.npmjs.org/package/colorinterpreter)
[![NPM Module Downloads](http://img.shields.io/npm/dt/colorinterpreter.svg)](https://www.npmjs.org/package/colorinterpreter)
[![Build Status](https://travis-ci.org/mortzdk/colorinterpreter.svg?branch=master)](https://travis-ci.org/mortzdk/colorinterpreter)
[![Coverage Status](https://coveralls.io/repos/github/mortzdk/colorinterpreter/badge.svg?branch=master)](https://coveralls.io/github/mortzdk/colorinterpreter?branch=master)
[![Dependency Status](https://david-dm.org/mortzdk/colorinterpreter.svg)](https://david-dm.org/mortzdk/colorinterpreter)

A javascript module to interpret and output browser color strings.

ColorInterpreter support the following browser color strings with inspiration from the [Mozilla Documentation](https://developer.mozilla.org/en-US/docs/Web/CSS/color_value):
* HEX
* HEXA (Hex with alpha value)
* RGB
* RGBA
* HSL
* HSLA
* Keywords

Furthermore the following values can be obtained from a Color object:
* Brightness
* Luminance
* Difference
* Red (RGBA)
* Green (RGBA)
* Blue (RGBA)
* Alpha (RGBA)

### Installation
##### Npm
To install using NPM simply type:
```
$ npm install colorinterpreter --save
```
##### Bower
```
$ bower install colorinterpreter --save

```

### Usage

##### Nodejs
```javascript
var ColorInterpreter = require("colorinterpreter");
var Color            = ColorInterpreter.Color;
var ColorError       = ColorInterpreter.ColorError;
var gold             = new Color("gold");

// Formats to output
gold.toHEX();            // #FFD700                 - The HEX color string                   
gold.toHEXA();           // #FFD700FF               - The HEXA color string
gold.toPercentageRGB();  // rgb(100%,84.31%,0%)     - The RGB in percent color string
gold.toPercentageRGBA(); // rgba(100%,84.31%,0%,1)  - The RGBA in percent color string
gold.toRGB();            // rgb(255,215,0)          - The RGB color string
gold.toRGBA();           // rgba(255,215,0,1)       - The RGBA color string
gold.toHSL();            // hsl(50.59,100%,50%)     - The HSL color string        
gold.toHSLA();           // hsla(50.59,100%,50%,1)  - The HSLA color string
gold.toKeyword();        // gold                    - The Keyword color string

// Additional information about color
gold.brightness();       // 202.45                  - The brightness value
gold.luminance();        // 0.6986087742815887      - The luminance value
gold.difference("#FFF"); // 295                     - The difference between gold and white

gold.red();              // 255                     - The RGBA red value
gold.green();            // 215                     - The RGBA green value
gold.blue();             // 0                       - The RGBA blue value
gold.alpha();            // 1                       - The RGBA alpha value
gold.isValid();          // true                    - States that the parsed color string is valid

// Mutators
gold.setFixed(6);        // Returns formats with up to 6 decimals

// Utility methods
gold.clone()             // Creates a clone of the gold object
gold.equals("#FFF")      // Checks if the color is equal to the argument
```

##### Browser
```HTML
<script src="dist/colorinterpreter.min.js" type="text/javascript">
</script>

<script type="text/javascript">
var Color      = window.ColorInterpreter.Color;
var ColorError = window.ColorInterpreter.ColorError;
var gold       = new Color("gold");

// Formats to output
gold.toHEX();            // #FFD700                 - The HEX color string                   
gold.toHEXA();           // #FFD700FF               - The HEXA color string
gold.toPercentageRGB();  // rgb(100%,84.31%,0%)     - The RGB in percent color string
gold.toPercentageRGBA(); // rgba(100%,84.31%,0%,1)  - The RGBA in percent color string
gold.toRGB();            // rgb(255,215,0)          - The RGB color string
gold.toRGBA();           // rgba(255,215,0,1)       - The RGBA color string
gold.toHSL();            // hsl(50.59,100%,50%)     - The HSL color string        
gold.toHSLA();           // hsla(50.59,100%,50%,1)  - The HSLA color string
gold.toKeyword();        // gold                    - The Keyword color string

// Additional information about color
gold.brightness();       // 202.45                  - The brightness value
gold.luminance();        // 0.6986087742815887      - The luminance value
gold.difference("#FFF"); // 295                     - The difference between gold and white

gold.red();              // 255                     - The RGBA red value
gold.green();            // 215                     - The RGBA green value
gold.blue();             // 0                       - The RGBA blue value
gold.alpha();            // 1                       - The RGBA alpha value
gold.isValid();          // true                    - States that the parsed color string is valid

// Mutators
gold.setFixed(6);        // Returns formats with up to 6 decimals

// Utility methods
gold.clone()             // Creates a clone of the gold object
gold.equals("#FFF")      // Checks if the color is equal to the argument
</script>
```

### Documentation
The full documentation of the module can be found [here](https://github.com/mortzdk/colorinterpreter/tree/master/docs).
