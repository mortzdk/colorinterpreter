<a name="module_ColorInterpreter"></a>

## ColorInterpreter
<p>A module to parse browser color strings as defined by: 
[Mozilla](https://developer.mozilla.org/en-US/docs/Web/CSS/color_value).
The module has two classes Color and ColorError.</p>
<p>The Color class is the class that interprets a color string. This is done
by constructing a new Color object instance with a color string as the 
argument. Once created, the Color object is able to parse the original color 
string as any browser color type, currently: HEX, HEXA, RGB, RGBA, HSL, HSLA, 
and color keywords.</p>
<p>The ColorError class is used whenever the parsing of a color goes wrong.</p>

**Version**: 1.0.4  
**Example**  
```js
// A typical usage of the Color object. Here the "gold" string could be
// any browser color string.
var gold = ColorInterpreter.Color("gold");
console.log(gold.toHEX());            // #FFD700
console.log(gold.toHEXA());           // #FFD700FF
console.log(gold.toPercentageRGB());  // rgb(100%,84.31%,0%)
console.log(gold.toPercentageRGBA()); // rgba(100%,84.31%,0%,1) 
console.log(gold.toRGB());            // rgb(255,215,0)
console.log(gold.toRGBA());           // rgba(255,215,0,1)
console.log(gold.toHSL());            // hsl(50.59,100%,50%)
console.log(gold.toHSLA());           // hsla(50.59,100%,50%,1) 
console.log(gold.toKeyword());        // gold 
```
**Example**  
```js
// If a color string could not be parsed, a ColorError is thrown.
try {
    ColorInterpreter.Color("mortz");
} catch (err) {
    console.log(err instanceof ColorInterpreter.ColorError); // true
}
```

* [ColorInterpreter](#module_ColorInterpreter)
    * _static_
        * [.Color](#module_ColorInterpreter.Color)
            * [new Color(_color, [_context])](#new_module_ColorInterpreter.Color_new)
            * _instance_
                * [.toRGB()](#module_ColorInterpreter.Color+toRGB) ⇒ <code>string</code>
                * [.toPercentageRGB()](#module_ColorInterpreter.Color+toPercentageRGB) ⇒ <code>string</code>
                * [.toRGBA()](#module_ColorInterpreter.Color+toRGBA) ⇒ <code>string</code>
                * [.toPercentageRGBA()](#module_ColorInterpreter.Color+toPercentageRGBA) ⇒ <code>string</code>
                * [.toHSL()](#module_ColorInterpreter.Color+toHSL) ⇒ <code>string</code>
                * [.toHSLA()](#module_ColorInterpreter.Color+toHSLA) ⇒ <code>string</code>
                * [.toKeyword()](#module_ColorInterpreter.Color+toKeyword) ⇒ <code>string</code>
                * [.toHEX()](#module_ColorInterpreter.Color+toHEX) ⇒ <code>string</code>
                * [.toHEXA()](#module_ColorInterpreter.Color+toHEXA) ⇒ <code>string</code>
                * [.toString(_scheme)](#module_ColorInterpreter.Color+toString) ⇒ <code>string</code>
                * [.setFixed(_number)](#module_ColorInterpreter.Color+setFixed) ⇒ <code>Color</code>
                * [.isValid()](#module_ColorInterpreter.Color+isValid) ⇒ <code>boolean</code>
                * [.equals(_color)](#module_ColorInterpreter.Color+equals) ⇒ <code>boolean</code>
                * [.clone()](#module_ColorInterpreter.Color+clone) ⇒ <code>Color</code>
                * [.red()](#module_ColorInterpreter.Color+red) ⇒ <code>number</code>
                * [.green()](#module_ColorInterpreter.Color+green) ⇒ <code>number</code>
                * [.blue()](#module_ColorInterpreter.Color+blue) ⇒ <code>number</code>
                * [.alpha()](#module_ColorInterpreter.Color+alpha) ⇒ <code>number</code>
                * [.brightness()](#module_ColorInterpreter.Color+brightness) ⇒ <code>number</code>
                * [.difference(_color)](#module_ColorInterpreter.Color+difference) ⇒ <code>number</code>
                * [.luminance()](#module_ColorInterpreter.Color+luminance) ⇒ <code>number</code>
            * _static_
                * [.RGB](#module_ColorInterpreter.Color.RGB) : <code>string</code>
                * [.RGBA](#module_ColorInterpreter.Color.RGBA) : <code>string</code>
                * [.HSL](#module_ColorInterpreter.Color.HSL) : <code>string</code>
                * [.HSLA](#module_ColorInterpreter.Color.HSLA) : <code>string</code>
                * [.HEX](#module_ColorInterpreter.Color.HEX) : <code>string</code>
                * [.HEXA](#module_ColorInterpreter.Color.HEXA) : <code>string</code>
                * [.KEYWORD](#module_ColorInterpreter.Color.KEYWORD) : <code>string</code>
                * [.hasBrowserSupport(_scheme)](#module_ColorInterpreter.Color.hasBrowserSupport) ⇒ <code>Boolean</code> \| <code>Object</code>
                * [.addKeyword(_name, _color)](#module_ColorInterpreter.Color.addKeyword)
            * _inner_
                * [~fixed](#module_ColorInterpreter.Color..fixed) : <code>number</code>
                * [~valid](#module_ColorInterpreter.Color..valid) : <code>boolean</code>
                * [~r](#module_ColorInterpreter.Color..r) : <code>number</code>
                * [~g](#module_ColorInterpreter.Color..g) : <code>number</code>
                * [~b](#module_ColorInterpreter.Color..b) : <code>number</code>
                * [~a](#module_ColorInterpreter.Color..a) : <code>number</code>
    * _inner_
        * [~ColorError](#module_ColorInterpreter..ColorError) ⇐ <code>Error</code>
            * [new ColorError(_message)](#new_module_ColorInterpreter..ColorError_new)

<a name="module_ColorInterpreter.Color"></a>

### ColorInterpreter.Color
<p>The Color class parses any browser color string and enable 
methods that converts to any other browser color string. It furthermore 
provides methods to generate brightness and luminance values of the given 
color. Finally it enables comparisons methods between other colors to compare
equalness and difference.</p>

**Kind**: static class of [<code>ColorInterpreter</code>](#module_ColorInterpreter)  
**Link**: https://developer.mozilla.org/en-US/docs/Web/CSS/color_value  

* [.Color](#module_ColorInterpreter.Color)
    * [new Color(_color, [_context])](#new_module_ColorInterpreter.Color_new)
    * _instance_
        * [.toRGB()](#module_ColorInterpreter.Color+toRGB) ⇒ <code>string</code>
        * [.toPercentageRGB()](#module_ColorInterpreter.Color+toPercentageRGB) ⇒ <code>string</code>
        * [.toRGBA()](#module_ColorInterpreter.Color+toRGBA) ⇒ <code>string</code>
        * [.toPercentageRGBA()](#module_ColorInterpreter.Color+toPercentageRGBA) ⇒ <code>string</code>
        * [.toHSL()](#module_ColorInterpreter.Color+toHSL) ⇒ <code>string</code>
        * [.toHSLA()](#module_ColorInterpreter.Color+toHSLA) ⇒ <code>string</code>
        * [.toKeyword()](#module_ColorInterpreter.Color+toKeyword) ⇒ <code>string</code>
        * [.toHEX()](#module_ColorInterpreter.Color+toHEX) ⇒ <code>string</code>
        * [.toHEXA()](#module_ColorInterpreter.Color+toHEXA) ⇒ <code>string</code>
        * [.toString(_scheme)](#module_ColorInterpreter.Color+toString) ⇒ <code>string</code>
        * [.setFixed(_number)](#module_ColorInterpreter.Color+setFixed) ⇒ <code>Color</code>
        * [.isValid()](#module_ColorInterpreter.Color+isValid) ⇒ <code>boolean</code>
        * [.equals(_color)](#module_ColorInterpreter.Color+equals) ⇒ <code>boolean</code>
        * [.clone()](#module_ColorInterpreter.Color+clone) ⇒ <code>Color</code>
        * [.red()](#module_ColorInterpreter.Color+red) ⇒ <code>number</code>
        * [.green()](#module_ColorInterpreter.Color+green) ⇒ <code>number</code>
        * [.blue()](#module_ColorInterpreter.Color+blue) ⇒ <code>number</code>
        * [.alpha()](#module_ColorInterpreter.Color+alpha) ⇒ <code>number</code>
        * [.brightness()](#module_ColorInterpreter.Color+brightness) ⇒ <code>number</code>
        * [.difference(_color)](#module_ColorInterpreter.Color+difference) ⇒ <code>number</code>
        * [.luminance()](#module_ColorInterpreter.Color+luminance) ⇒ <code>number</code>
    * _static_
        * [.RGB](#module_ColorInterpreter.Color.RGB) : <code>string</code>
        * [.RGBA](#module_ColorInterpreter.Color.RGBA) : <code>string</code>
        * [.HSL](#module_ColorInterpreter.Color.HSL) : <code>string</code>
        * [.HSLA](#module_ColorInterpreter.Color.HSLA) : <code>string</code>
        * [.HEX](#module_ColorInterpreter.Color.HEX) : <code>string</code>
        * [.HEXA](#module_ColorInterpreter.Color.HEXA) : <code>string</code>
        * [.KEYWORD](#module_ColorInterpreter.Color.KEYWORD) : <code>string</code>
        * [.hasBrowserSupport(_scheme)](#module_ColorInterpreter.Color.hasBrowserSupport) ⇒ <code>Boolean</code> \| <code>Object</code>
        * [.addKeyword(_name, _color)](#module_ColorInterpreter.Color.addKeyword)
    * _inner_
        * [~fixed](#module_ColorInterpreter.Color..fixed) : <code>number</code>
        * [~valid](#module_ColorInterpreter.Color..valid) : <code>boolean</code>
        * [~r](#module_ColorInterpreter.Color..r) : <code>number</code>
        * [~g](#module_ColorInterpreter.Color..g) : <code>number</code>
        * [~b](#module_ColorInterpreter.Color..b) : <code>number</code>
        * [~a](#module_ColorInterpreter.Color..a) : <code>number</code>

<a name="new_module_ColorInterpreter.Color_new"></a>

#### new Color(_color, [_context])
**Returns**: <code>Color</code> - <p>A new Color Object that can be checked for validity.</p>  
**Throws**:

- <code>ColorError</code> <p>A ColorError describing what went wrong.</p>


| Param | Type | Description |
| --- | --- | --- |
| _color | <code>string</code> | <p>A color string represented as a keyword, HEX, RGB(A), or HSL(A).</p> |
| [_context] | <code>Element</code> | <p>An element for which to calculate the currentColor keyword.</p> |

**Example**  
```js
// A typical usage of the Color object. Here the "gold" string could be
// any browser color string.
var gold = ColorInterpreter.Color("gold");
console.log(gold.toHEX());            // #FFD700
console.log(gold.toHEXA());           // #FFD700FF
console.log(gold.toPercentageRGB());  // rgb(100%,84.31%,0%)
console.log(gold.toPercentageRGBA()); // rgba(100%,84.31%,0%,1) 
console.log(gold.toRGB());            // rgb(255,215,0)
console.log(gold.toRGBA());           // rgb(255,215,0,1)
console.log(gold.toHSL());            // hsl(50.59,100%,50%)
console.log(gold.toHSLA());           // hsla(50.59,100%,50%,1) 
console.log(gold.toKeyword());        // gold 
```
<a name="module_ColorInterpreter.Color+toRGB"></a>

#### color.toRGB() ⇒ <code>string</code>
<p>Generates the parsed color as a RGB string.</p>

**Kind**: instance method of [<code>Color</code>](#module_ColorInterpreter.Color)  
**Returns**: <code>string</code> - <p>The generated RGB string</p>  
<a name="module_ColorInterpreter.Color+toPercentageRGB"></a>

#### color.toPercentageRGB() ⇒ <code>string</code>
<p>Generates the parsed color as a percentage RGB string.</p>

**Kind**: instance method of [<code>Color</code>](#module_ColorInterpreter.Color)  
**Returns**: <code>string</code> - <p>The generated RGB string</p>  
<a name="module_ColorInterpreter.Color+toRGBA"></a>

#### color.toRGBA() ⇒ <code>string</code>
<p>Generates the parsed color as a RGBA string.</p>

**Kind**: instance method of [<code>Color</code>](#module_ColorInterpreter.Color)  
**Returns**: <code>string</code> - <p>The generated RGBA string</p>  
<a name="module_ColorInterpreter.Color+toPercentageRGBA"></a>

#### color.toPercentageRGBA() ⇒ <code>string</code>
<p>Generates the parsed color as a percentage RGBA string.</p>

**Kind**: instance method of [<code>Color</code>](#module_ColorInterpreter.Color)  
**Returns**: <code>string</code> - <p>The generated RGBA string</p>  
<a name="module_ColorInterpreter.Color+toHSL"></a>

#### color.toHSL() ⇒ <code>string</code>
<p>Generates the parsed color as a HSL string.</p>

**Kind**: instance method of [<code>Color</code>](#module_ColorInterpreter.Color)  
**Returns**: <code>string</code> - <p>The generated HSL string</p>  
<a name="module_ColorInterpreter.Color+toHSLA"></a>

#### color.toHSLA() ⇒ <code>string</code>
<p>Generates the parsed color as a HSLA string.</p>

**Kind**: instance method of [<code>Color</code>](#module_ColorInterpreter.Color)  
**Returns**: <code>string</code> - <p>The generated HSLA string</p>  
<a name="module_ColorInterpreter.Color+toKeyword"></a>

#### color.toKeyword() ⇒ <code>string</code>
<p>Generates the parsed color as a keyword string or an empty string if the
keyword was not found.</p>

**Kind**: instance method of [<code>Color</code>](#module_ColorInterpreter.Color)  
**Returns**: <code>string</code> - <p>The generated keyword string or an empty string</p>  
<a name="module_ColorInterpreter.Color+toHEX"></a>

#### color.toHEX() ⇒ <code>string</code>
<p>Generates the parsed color as a HEX string.</p>

**Kind**: instance method of [<code>Color</code>](#module_ColorInterpreter.Color)  
**Returns**: <code>string</code> - <p>The generated HEX string</p>  
<a name="module_ColorInterpreter.Color+toHEXA"></a>

#### color.toHEXA() ⇒ <code>string</code>
<p>Generates the parsed color as a HEX string with an alpha value.</p>

**Kind**: instance method of [<code>Color</code>](#module_ColorInterpreter.Color)  
**Returns**: <code>string</code> - <p>The generated HEX string with an alpha value</p>  
<a name="module_ColorInterpreter.Color+toString"></a>

#### color.toString(_scheme) ⇒ <code>string</code>
<p>Returns a string representation of the color object</p>

**Kind**: instance method of [<code>Color</code>](#module_ColorInterpreter.Color)  
**Returns**: <code>string</code> - <p>A color string of the given scheme or a HEX color 
string.</p>  

| Param | Type | Description |
| --- | --- | --- |
| _scheme | <code>string</code> | <p>The color scheme to output.</p> |

**Example**  
```js
// The different ways to use the toString method.
var Color = ColorInterpreter.Color;
var gold  = Color("gold");
console.log(gold.toString());                 // #FFD700
console.log(gold.toString(Color.HEX));        // #FFD700
console.log(gold.toString(Color.HEXA));       // #FFD700FF
console.log(gold.toString("PercentageRGB"));  // rgb(100%,84.31%,0%)
console.log(gold.toString("PercentageRGBA")); // rgba(100%,84.31%,0%,1) 
console.log(gold.toString(Color.RGB));        // rgb(255,215,0)
console.log(gold.toString(Color.RGBA));       // rgb(255,215,0,1)
console.log(gold.toString(Color.HSL));        // hsl(50.59,100%,50%)
console.log(gold.toString(Color.HSLA));       // hsla(50.59,100%,50%,1) 
console.log(gold.toString(Color.Keyword));    // gold 
```
<a name="module_ColorInterpreter.Color+setFixed"></a>

#### color.setFixed(_number) ⇒ <code>Color</code>
<p>Sets a fixed value, representing the decimals accepted in output of 
toPercentageRGB, toPercentageRGBA, toHSL, and toHSLA.</p>

**Kind**: instance method of [<code>Color</code>](#module_ColorInterpreter.Color)  
**Returns**: <code>Color</code> - <p>A reference to itself.</p>  

| Param | Type | Description |
| --- | --- | --- |
| _number | <code>number</code> | <p>The number of decimals allowed.</p> |

<a name="module_ColorInterpreter.Color+isValid"></a>

#### color.isValid() ⇒ <code>boolean</code>
<p>Returns whether the Color object is valid, that is, the Color object was
constructed with a color that it was able to parse.</p>

**Kind**: instance method of [<code>Color</code>](#module_ColorInterpreter.Color)  
**Returns**: <code>boolean</code> - <p>Whether the Color object is valid.</p>  
<a name="module_ColorInterpreter.Color+equals"></a>

#### color.equals(_color) ⇒ <code>boolean</code>
<p>Checks if the current color object is equal to a given color.</p>

**Kind**: instance method of [<code>Color</code>](#module_ColorInterpreter.Color)  
**Returns**: <code>boolean</code> - <p>Whether the colors are equal.</p>  
**Throws**:

- <code>ColorError</code> <p>A ColorError describing what went wrong.</p>


| Param | Type | Description |
| --- | --- | --- |
| _color | <code>Color</code> \| <code>String</code> | <p>A Color object or color string.</p> |

<a name="module_ColorInterpreter.Color+clone"></a>

#### color.clone() ⇒ <code>Color</code>
<p>Creates a clone of the current Color object.</p>

**Kind**: instance method of [<code>Color</code>](#module_ColorInterpreter.Color)  
**Returns**: <code>Color</code> - <p>A clone of the current color.</p>  
**Throws**:

- <code>ColorError</code> <p>A ColorError describing what went wrong.</p>

<a name="module_ColorInterpreter.Color+red"></a>

#### color.red() ⇒ <code>number</code>
<p>Returns the red RGB value.</p>

**Kind**: instance method of [<code>Color</code>](#module_ColorInterpreter.Color)  
**Returns**: <code>number</code> - <p>The red value</p>  
<a name="module_ColorInterpreter.Color+green"></a>

#### color.green() ⇒ <code>number</code>
<p>Returns the green RGB value.</p>

**Kind**: instance method of [<code>Color</code>](#module_ColorInterpreter.Color)  
**Returns**: <code>number</code> - <p>The green value</p>  
<a name="module_ColorInterpreter.Color+blue"></a>

#### color.blue() ⇒ <code>number</code>
<p>Returns the blue RGB value.</p>

**Kind**: instance method of [<code>Color</code>](#module_ColorInterpreter.Color)  
**Returns**: <code>number</code> - <p>The blue value</p>  
<a name="module_ColorInterpreter.Color+alpha"></a>

#### color.alpha() ⇒ <code>number</code>
<p>Returns the alpha value.</p>

**Kind**: instance method of [<code>Color</code>](#module_ColorInterpreter.Color)  
**Returns**: <code>number</code> - <p>The alpha value</p>  
<a name="module_ColorInterpreter.Color+brightness"></a>

#### color.brightness() ⇒ <code>number</code>
<p>Returns the brightness value as defined by 
[href="http://www.w3.org/TR/AERT#color-contrast|w3](https://<a)">www.w3.org/TR/AERT#color-contrast|w3}</a>.</p>

**Kind**: instance method of [<code>Color</code>](#module_ColorInterpreter.Color)  
**Returns**: <code>number</code> - <p>The brightness value</p>  
<a name="module_ColorInterpreter.Color+difference"></a>

#### color.difference(_color) ⇒ <code>number</code>
<p>Returns the color difference value as defined by 
[href="http://www.w3.org/TR/AERT#color-contrast|w3](https://<a)">www.w3.org/TR/AERT#color-contrast|w3}</a>.</p>

**Kind**: instance method of [<code>Color</code>](#module_ColorInterpreter.Color)  
**Returns**: <code>number</code> - <p>The difference value or -1 if color parameter was not
a color.</p>  
**Throws**:

- <code>ColorError</code> <p>A ColorError describing what went wrong.</p>


| Param | Type | Description |
| --- | --- | --- |
| _color | <code>Color</code> \| <code>String</code> | <p>A Color object or color string.</p> |

<a name="module_ColorInterpreter.Color+luminance"></a>

#### color.luminance() ⇒ <code>number</code>
<p>Returns the luminance value as defined by
{@link 
http://<a href="http://www.w3.org/TR/2008/REC-WCAG20-20081211/#relativeluminancedef|w3}">www.w3.org/TR/2008/REC-WCAG20-20081211/#relativeluminancedef|w3}</a></p>

**Kind**: instance method of [<code>Color</code>](#module_ColorInterpreter.Color)  
**Returns**: <code>number</code> - <p>The luminance value</p>  
<a name="module_ColorInterpreter.Color.RGB"></a>

#### Color.RGB : <code>string</code>
**Kind**: static constant of [<code>Color</code>](#module_ColorInterpreter.Color)  
<a name="module_ColorInterpreter.Color.RGBA"></a>

#### Color.RGBA : <code>string</code>
**Kind**: static constant of [<code>Color</code>](#module_ColorInterpreter.Color)  
<a name="module_ColorInterpreter.Color.HSL"></a>

#### Color.HSL : <code>string</code>
**Kind**: static constant of [<code>Color</code>](#module_ColorInterpreter.Color)  
<a name="module_ColorInterpreter.Color.HSLA"></a>

#### Color.HSLA : <code>string</code>
**Kind**: static constant of [<code>Color</code>](#module_ColorInterpreter.Color)  
<a name="module_ColorInterpreter.Color.HEX"></a>

#### Color.HEX : <code>string</code>
**Kind**: static constant of [<code>Color</code>](#module_ColorInterpreter.Color)  
<a name="module_ColorInterpreter.Color.HEXA"></a>

#### Color.HEXA : <code>string</code>
**Kind**: static constant of [<code>Color</code>](#module_ColorInterpreter.Color)  
<a name="module_ColorInterpreter.Color.KEYWORD"></a>

#### Color.KEYWORD : <code>string</code>
**Kind**: static constant of [<code>Color</code>](#module_ColorInterpreter.Color)  
<a name="module_ColorInterpreter.Color.hasBrowserSupport"></a>

#### Color.hasBrowserSupport(_scheme) ⇒ <code>Boolean</code> \| <code>Object</code>
<p>Checks for support of the given browser-color-scheme. This feature is only 
available in javascript versions with a DOM model such as javascript in 
browsers.</p>

**Kind**: static method of [<code>Color</code>](#module_ColorInterpreter.Color)  
**Returns**: <code>Boolean</code> \| <code>Object</code> - <p>Whether there exists support for the scheme. 
The special case of keywords returns an object of booleans representing
the support of CSS1, CSS2, CSS3, and CSS4 keywords.</p>  

| Param | Type | Description |
| --- | --- | --- |
| _scheme | <code>string</code> | <p>The color scheme to test for support.</p> |

**Example**  
```js
// The different ways to use the toString method.
var Color = ColorInterpreter.Color;
console.log(Color.hasBrowserSupport(Color.HEX));        // true || false
console.log(Color.hasBrowserSupport(Color.HEXA));       // true || false
console.log(Color.hasBrowserSupport(Color.RGB));        // true || false
console.log(Color.hasBrowserSupport(Color.RGBA));       // true || false
console.log(Color.hasBrowserSupport(Color.HSL));        // true || false
console.log(Color.hasBrowserSupport(Color.HSLA));       // true || false
console.log(Color.hasBrowserSupport(Color.Keyword));    // {CSS1:true||false, CSS2:true||false, CSS3:true||false, CSS4:true||false}
```
<a name="module_ColorInterpreter.Color.addKeyword"></a>

#### Color.addKeyword(_name, _color)
<p>Adds keyword to the keyword table.</p>

**Kind**: static method of [<code>Color</code>](#module_ColorInterpreter.Color)  
**Throws**:

- <code>ColorError</code> <p>A ColorError describing what went wrong.</p>


| Param | Type | Description |
| --- | --- | --- |
| _name | <code>string</code> | <p>The name of the keyword</p> |
| _color | <code>String</code> \| <code>Color</code> | <p>A initialized color object or color string.</p> |

<a name="module_ColorInterpreter.Color..fixed"></a>

#### Color~fixed : <code>number</code>
<p>The fixed value</p>

**Kind**: inner property of [<code>Color</code>](#module_ColorInterpreter.Color)  
**Access**: protected  
<a name="module_ColorInterpreter.Color..valid"></a>

#### Color~valid : <code>boolean</code>
<p>The valid value</p>

**Kind**: inner property of [<code>Color</code>](#module_ColorInterpreter.Color)  
**Access**: protected  
<a name="module_ColorInterpreter.Color..r"></a>

#### Color~r : <code>number</code>
<p>The red value</p>

**Kind**: inner property of [<code>Color</code>](#module_ColorInterpreter.Color)  
<a name="module_ColorInterpreter.Color..g"></a>

#### Color~g : <code>number</code>
<p>The green value</p>

**Kind**: inner property of [<code>Color</code>](#module_ColorInterpreter.Color)  
<a name="module_ColorInterpreter.Color..b"></a>

#### Color~b : <code>number</code>
<p>The blue value</p>

**Kind**: inner property of [<code>Color</code>](#module_ColorInterpreter.Color)  
<a name="module_ColorInterpreter.Color..a"></a>

#### Color~a : <code>number</code>
<p>The alpha value</p>

**Kind**: inner property of [<code>Color</code>](#module_ColorInterpreter.Color)  
<a name="module_ColorInterpreter..ColorError"></a>

### ColorInterpreter~ColorError ⇐ <code>Error</code>
<p>The ColorError class is used to signal an error when parsing a 
browser color string.</p>

**Kind**: inner class of [<code>ColorInterpreter</code>](#module_ColorInterpreter)  
**Extends**: <code>Error</code>  
<a name="new_module_ColorInterpreter..ColorError_new"></a>

#### new ColorError(_message)
<p>An error object associated with parsing of browser color strings.</p>


| Param | Type | Description |
| --- | --- | --- |
| _message | <code>string</code> | <p>The message that should be assigned to the error.</p> |

**Example**  
```js
// If a color string could not be parsed, a ColorError is thrown.
try {
    ColorInterpreter.Color("mortz");
} catch (err) {
    console.log(err instanceof ColorInterpreter.ColorError); // true
}
```
