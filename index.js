"use strict";

/**
 * A module to parse browser color strings as defined by: 
 * {@link https://developer.mozilla.org/en-US/docs/Web/CSS/color_value}. The 
 * module has two classes Color and ColorError.
 *
 * The Color class is the class that interprets a color string. This is done
 * by constructing a new Color object instance with a color string as the 
 * argument. Once created, the Color object is able to parse the original color 
 * string as any browser color type, currently: HEX, HEXA, RGB, RGBA, HSL, HSLA, 
 * and color keywords.
 *
 * The ColorError class is used whenever the parsing of a color goes wrong.
 *
 * @module ColorInterpreter
 * @version 1.0.1
 *
 * @example
 * // A typical usage of the Color object. Here the "gold" string could be
 * // any browser color string.
 * var gold = ColorInterpreter.Color("gold");
 * console.log(gold.toHEX());            // #FFD700
 * console.log(gold.toHEXA());           // #FFD700FF
 * console.log(gold.toPercentageRGB());  // rgb(100%,84.31%,0%)
 * console.log(gold.toPercentageRGBA()); // rgba(100%,84.31%,0%,1) 
 * console.log(gold.toRGB());            // rgb(255,215,0)
 * console.log(gold.toRGBA());           // rgba(255,215,0,1)
 * console.log(gold.toHSL());            // hsl(50.59,100%,50%)
 * console.log(gold.toHSLA());           // hsla(50.59,100%,50%,1) 
 * console.log(gold.toKeyword());        // gold 
 *
 * @example 
 * // If a color string could not be parsed, a ColorError is thrown.
 * try {
 *     ColorInterpreter.Color("mortz");
 * } catch (err) {
 *     console.log(err instanceof ColorInterpreter.ColorError); // true
 * }
 */

var support,
    oProto  = Object.prototype,
    max     = Math.max,
    min     = Math.min,
    round   = Math.round,
    pow     = Math.pow,
    trim    = String.prototype.trim || function () {
        return this.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, "");
    },
    colors2keywords = {
        "f0f8ffff"        : "aliceblue",
        "faebd7ff"        : "antiquewhite",
        "00ffffff"        : "aqua",
        "7fffd4ff"        : "aquamarine",
        "f0ffffff"        : "azure",
        "f5f5dcff"        : "beige",
        "ffe4c4ff"        : "bisque",
        "000000ff"        : "black",
        "ffebcdff"        : "blanchedalmond",
        "0000ffff"        : "blue",
        "8a2be2ff"        : "blueviolet",
        "a52a2aff"        : "brown",
        "deb887ff"        : "burlywood",
        "5f9ea0ff"        : "cadetblue",
        "7fff00ff"        : "chartreuse",
        "d2691eff"        : "chocolate",
        "ff7f50ff"        : "coral",
        "6495edff"        : "cornflowerblue",
        "fff8dcff"        : "cornsilk",
        "dc143cff"        : "crimson",
        "00008bff"        : "darkblue",
        "008b8bff"        : "darkcyan",
        "b8860bff"        : "darkgoldenrod",
        "a9a9a9ff"        : "darkgray",
        "006400ff"        : "darkgreen",
        "bdb76bff"        : "darkkhaki",
        "8b008bff"        : "darkmagenta",
        "556b2fff"        : "darkolivegreen",
        "ff8c00ff"        : "darkorange",
        "9932ccff"        : "darkorchid",
        "8b0000ff"        : "darkred",
        "e9967aff"        : "darksalmon",
        "8fbc8fff"        : "darkseagreen",
        "483d8bff"        : "darkslateblue",
        "2f4f4fff"        : "darkslategray",
        "00ced1ff"        : "darkturquoise",
        "9400d3ff"        : "darkviolet",
        "ff1493ff"        : "deeppink",
        "00bfffff"        : "deepskyblue",
        "696969ff"        : "dimgray",
        "1e90ffff"        : "dodgerblue",
        "d19275ff"        : "feldspar",
        "b22222ff"        : "firebrick",
        "fffaf0ff"        : "floralwhite",
        "228b22ff"        : "forestgreen",
        "ff00ffff"        : "fuchsia",
        "dcdcdcff"        : "gainsboro",
        "f8f8ffff"        : "ghostwhite",
        "ffd700ff"        : "gold",
        "daa520ff"        : "goldenrod",
        "808080ff"        : "gray",
        "008000ff"        : "green",
        "adff2fff"        : "greenyellow",
        "f0fff0ff"        : "honeydew",
        "ff69b4ff"        : "hotpink",
        "cd5c5cff"        : "indianred ",
        "4b0082ff"        : "indigo ",
        "fffff0ff"        : "ivory",
        "f0e68cff"        : "khaki",
        "e6e6faff"        : "lavender",
        "fff0f5ff"        : "lavenderblush",
        "7cfc00ff"        : "lawngreen",
        "fffacdff"        : "lemonchiffon",
        "add8e6ff"        : "lightblue",
        "f08080ff"        : "lightcoral",
        "e0ffffff"        : "lightcyan",
        "fafad2ff"        : "lightgoldenrodyellow",
        "d3d3d3ff"        : "lightgray",
        "90ee90ff"        : "lightgreen",
        "ffb6c1ff"        : "lightpink",
        "ffa07aff"        : "lightsalmon",
        "20b2aaff"        : "lightseagreen",
        "87cefaff"        : "lightskyblue",
        "8470ffff"        : "lightslateblue",
        "778899ff"        : "lightslategray",
        "b0c4deff"        : "lightsteelblue",
        "ffffe0ff"        : "lightyellow",
        "00ff00ff"        : "lime",
        "32cd32ff"        : "limegreen",
        "faf0e6ff"        : "linen",
        "800000ff"        : "maroon",
        "66cdaaff"        : "mediumaquamarine",
        "0000cdff"        : "mediumblue",
        "ba55d3ff"        : "mediumorchid",
        "9370d8ff"        : "mediumpurple",
        "3cb371ff"        : "mediumseagreen",
        "7b68eeff"        : "mediumslateblue",
        "00fa9aff"        : "mediumspringgreen",
        "48d1ccff"        : "mediumturquoise",
        "c71585ff"        : "mediumvioletred",
        "191970ff"        : "midnightblue",
        "f5fffaff"        : "mintcream",
        "ffe4e1ff"        : "mistyrose",
        "ffe4b5ff"        : "moccasin",
        "ffdeadff"        : "navajowhite",
        "000080ff"        : "navy",
        "fdf5e6ff"        : "oldlace",
        "808000ff"        : "olive",
        "6b8e23ff"        : "olivedrab",
        "ffa500ff"        : "orange",
        "ff4500ff"        : "orangered",
        "da70d6ff"        : "orchid",
        "eee8aaff"        : "palegoldenrod",
        "98fb98ff"        : "palegreen",
        "afeeeeff"        : "paleturquoise",
        "d87093ff"        : "palevioletred",
        "ffefd5ff"        : "papayawhip",
        "ffdab9ff"        : "peachpuff",
        "cd853fff"        : "peru",
        "ffc0cbff"        : "pink",
        "dda0ddff"        : "plum",
        "b0e0e6ff"        : "powderblue",
        "800080ff"        : "purple",
        "ff0000ff"        : "red",
        "663399ff"        : "rebeccapurple",
        "bc8f8fff"        : "rosybrown",
        "4169e1ff"        : "royalblue",
        "8b4513ff"        : "saddlebrown",
        "fa8072ff"        : "salmon",
        "f4a460ff"        : "sandybrown",
        "2e8b57ff"        : "seagreen",
        "fff5eeff"        : "seashell",
        "a0522dff"        : "sienna",
        "c0c0c0ff"        : "silver",
        "87ceebff"        : "skyblue",
        "6a5acdff"        : "slateblue",
        "708090ff"        : "slategray",
        "fffafaff"        : "snow",
        "00ff7fff"        : "springgreen",
        "4682b4ff"        : "steelblue",
        "d2b48cff"        : "tan",
        "008080ff"        : "teal",
        "d8bfd8ff"        : "thistle",
        "ff6347ff"        : "tomato",
        "00000000"        : "transparent",
        "40e0d0ff"        : "turquoise",
        "ee82eeff"        : "violet",
        "d02090ff"        : "violetred",
        "f5deb3ff"        : "wheat",
        "ffffffff"        : "white",
        "f5f5f5ff"        : "whitesmoke",
        "ffff00ff"        : "yellow",
        "9acd32ff"        : "yellowgreen"
    },
    keywords2colors = {
        aliceblue:            "f0f8ffff",
        antiquewhite:         "faebd7ff",
        aqua:                 "00ffffff",
        aquamarine:           "7fffd4ff",
        azure:                "f0ffffff",
        beige:                "f5f5dcff",
        bisque:               "ffe4c4ff",
        black:                "000000ff",
        blanchedalmond:       "ffebcdff",
        blue:                 "0000ffff",
        blueviolet:           "8a2be2ff",
        brown:                "a52a2aff",
        burlywood:            "deb887ff",
        cadetblue:            "5f9ea0ff",
        chartreuse:           "7fff00ff",
        chocolate:            "d2691eff",
        coral:                "ff7f50ff",
        cornflowerblue:       "6495edff",
        cornsilk:             "fff8dcff",
        currentcolor: function (_context) {
            var color,
                view = (_context.ownerDocument || document).defaultView;

            if ( view && "getComputedStyle" in view ) { // W3C standard way
                color = view.getComputedStyle(_context, null)
                            .getPropertyValue("color");
            } else if ( "currentStyle" in _context ) { // IE
                color = _context.currentStyle["color"];
            } else {
                color = _context.style.color;
            }

            return isString(this[color]) ? this[color] : color;
        },
        crimson:              "dc143cff",
        darkblue:             "00008bff",
        darkcyan:             "008b8bff",
        darkgoldenrod:        "b8860bff",
        darkgray:             "a9a9a9ff",
        darkgreen:            "006400ff",
        darkgrey:             "a9a9a9ff",
        darkkhaki:            "bdb76bff",
        darkmagenta:          "8b008bff",
        darkolivegreen:       "556b2fff",
        darkorange:           "ff8c00ff",
        darkorchid:           "9932ccff",
        darkred:              "8b0000ff",
        darksalmon:           "e9967aff",
        darkseagreen:         "8fbc8fff",
        darkslateblue:        "483d8bff",
        darkslategray:        "2f4f4fff",
        darkslategrey:        "2f4f4fff",
        darkturquoise:        "00ced1ff",
        darkviolet:           "9400d3ff",
        deeppink:             "ff1493ff",
        deepskyblue:          "00bfffff",
        dimgray:              "696969ff",
        dimgrey:              "696969ff",
        dodgerblue:           "1e90ffff",
        feldspar:             "d19275ff",
        firebrick:            "b22222ff",
        floralwhite:          "fffaf0ff",
        forestgreen:          "228b22ff",
        fuchsia:              "ff00ffff",
        gainsboro:            "dcdcdcff",
        ghostwhite:           "f8f8ffff",
        gold:                 "ffd700ff",
        goldenrod:            "daa520ff",
        gray:                 "808080ff",
        green:                "008000ff",
        greenyellow:          "adff2fff",
        grey:                 "808080ff",
        honeydew:             "f0fff0ff",
        hotpink:              "ff69b4ff",
        indianred:            "cd5c5cff",
        indigo:               "4b0082ff",
        ivory:                "fffff0ff",
        khaki:                "f0e68cff",
        lavender:             "e6e6faff",
        lavenderblush:        "fff0f5ff",
        lawngreen:            "7cfc00ff",
        lemonchiffon:         "fffacdff",
        lightblue:            "add8e6ff",
        lightcoral:           "f08080ff",
        lightcyan:            "e0ffffff",
        lightgoldenrodyellow: "fafad2ff",
        lightgray:            "d3d3d3ff",
        lightgreen:           "90ee90ff",
        lightgrey:            "d3d3d3ff",
        lightpink:            "ffb6c1ff",
        lightsalmon:          "ffa07aff",
        lightseagreen:        "20b2aaff",
        lightskyblue:         "87cefaff",
        lightslateblue:       "8470ffff",
        lightslategray:       "778899ff",
        lightslategrey:       "778899ff",
        lightsteelblue:       "b0c4deff",
        lightyellow:          "ffffe0ff",
        lime:                 "00ff00ff",
        limegreen:            "32cd32ff",
        linen:                "faf0e6ff",
        maroon:               "800000ff",
        mediumaquamarine:     "66cdaaff",
        mediumblue:           "0000cdff",
        mediumorchid:         "ba55d3ff",
        mediumpurple:         "9370d8ff",
        mediumseagreen:       "3cb371ff",
        mediumslateblue:      "7b68eeff",
        mediumspringgreen:    "00fa9aff",
        mediumturquoise:      "48d1ccff",
        mediumvioletred:      "c71585ff",
        midnightblue:         "191970ff",
        mintcream:            "f5fffaff",
        mistyrose:            "ffe4e1ff",
        moccasin:             "ffe4b5ff",
        navajowhite:          "ffdeadff",
        navy:                 "000080ff",
        oldlace:              "fdf5e6ff",
        olive:                "808000ff",
        olivedrab:            "6b8e23ff",
        orange:               "ffa500ff",
        orangered:            "ff4500ff",
        orchid:               "da70d6ff",
        palegoldenrod:        "eee8aaff",
        palegreen:            "98fb98ff",
        paleturquoise:        "afeeeeff",
        palevioletred:        "d87093ff",
        papayawhip:           "ffefd5ff",
        peachpuff:            "ffdab9ff",
        peru:                 "cd853fff",
        pink:                 "ffc0cbff",
        plum:                 "dda0ddff",
        powderblue:           "b0e0e6ff",
        purple:               "800080ff",
        red:                  "ff0000ff",
        rebeccapurple:        "663399ff",
        rosybrown:            "bc8f8fff",
        royalblue:            "4169e1ff",
        saddlebrown:          "8b4513ff",
        salmon:               "fa8072ff",
        sandybrown:           "f4a460ff",
        seagreen:             "2e8b57ff",
        seashell:             "fff5eeff",
        sienna:               "a0522dff",
        silver:               "c0c0c0ff",
        skyblue:              "87ceebff",
        slateblue:            "6a5acdff",
        slategray:            "708090ff",
        slategrey:            "708090ff",
        snow:                 "fffafaff",
        springgreen:          "00ff7fff",
        steelblue:            "4682b4ff",
        tan:                  "d2b48cff",
        teal:                 "008080ff",
        thistle:              "d8bfd8ff",
        tomato:               "ff6347ff",
        transparent:          "00000000",
        turquoise:            "40e0d0ff",
        violet:               "ee82eeff",
        violetred:            "d02090ff",
        wheat:                "f5deb3ff",
        white:                "ffffffff",
        whitesmoke:           "f5f5f5ff",
        yellow:               "ffff00ff",
        yellowgreen:          "9acd32ff"
    },
    schemes = [
        // HSL(A)
        {
            regexp  : new RegExp(
                "^hsla?\\(\\s*([-|+]?\\d+(?:[\\/.]\\d+)?)(deg|rad|grad|turn)?" +
                "\\s*,?\\s*(\\d+(?:\\.\\d+)?)%\\s*,?\\s*(\\d+(?:\\.\\d+)?)%" + 
                "\\s*[,|\\/]?\\s*(\\d+(?:[\\/.]\\d+)?(%?))?\\s*\\)$"
            ),
            process : function (_bits) {
                var a, q, p, r, g, b,
                    h       = parseFloat(_bits[1]),
                    s       = parseFloat(_bits[3])/100, // Normalize to [0;1]
                    l       = parseFloat(_bits[4])/100, // Normalize to [0;1]
                    hue2rgb = function (_p, _q, _t) {
                        if ( _t < 0 ) {
                            _t += 1;
                        }

                        if ( _t > 1 ) {
                            _t -= 1;
                        }

                        if ( _t < 1/6 ) {
                            return _p + (_q - _p) * 6 * _t;
                        }

                        if ( _t < 1/2 ) {
                            return _q;
                        }

                        if ( _t < 2/3 ) {
                            return _p + (_q - _p) * (2/3 - _t) * 6;
                        }

                        return _p;
                    };
                
                if ( _bits[6] === "%" ) {
                    a = parseFloat(_bits[5])/100;
                } else {
                    a = parseFloat(_bits[5]);
                }

                if ( isNaN(a) ) {
                    a = 1;
                }

                // Convert hue to degrees [0;360]
                switch ( _bits[2] ) {
                case "rad":
                    h *= 180/Math.PI;
                    break;
                case "grad":
                    h *= 9/10;
                    break;
                case "turn":
                    h *= 360;
                    break;
                }
                h = to360Degrees(h)/360; // Normalize to [0;1]

                if ( s === 0 ) {
                    r = g = b = l; // achromatic
                } else {
                    q = l < 1/2 ? l * (1 + s) : l + s - l * s;
                    p = 2 * l - q;
                    r = hue2rgb(p, q, h + 1/3);
                    g = hue2rgb(p, q, h);
                    b = hue2rgb(p, q, h - 1/3);
                }
                return [
                    r * 255,
                    g * 255,
                    b * 255,
                    a
                ];
            }
        },
        // RGB(A)
        {
            regexp  : new RegExp(
                "^rgba?\\(\\s*(?:(\\d+(?:\\.\\d+)?(%))|(\\d+))\\s*," + 
                "?\\s*(?:(\\d+(?:\\.\\d+)?(%))|(\\d+))\\s*," + 
                "?\\s*(?:(\\d+(?:\\.\\d+)?(%))|(\\d+))\\s*[,|/]?" + 
                "\\s*(\\d+(?:[\\/.]\\d+)?(%?))?\\s*\\)$"
            ),
            process : function (_bits) {
                var p = [
                    _bits[2] === "%" ? (parseFloat(_bits[1])*255)/100
                                     : parseInt(_bits[3], 10),
                    _bits[5] === "%" ? (parseFloat(_bits[4])*255)/100
                                     : parseInt(_bits[6], 10),
                    _bits[8] === "%" ? (parseFloat(_bits[7])*255)/100
                                     : parseInt(_bits[9], 10),
                    _bits[11] === "%" ? parseFloat(_bits[10])/100
                                     : parseFloat(_bits[10])
                ];

                if ( isNaN(p[3]) ) {
                    p[3] = 1;
                }

                return p;
            }
        },
        // HEX
        {
            regexp  : new RegExp(
                "^([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$"
            ),
            process : function (_bits) {
                return [
                    parseInt(_bits[1], 16),
                    parseInt(_bits[2], 16),
                    parseInt(_bits[3], 16),
                    parseInt(_bits[4], 16)/255
                ];
            }
        }
    ];

/******************************************************************************
 *                                   MAIN                                     *
 ******************************************************************************/

/**
 * @class module:ColorInterpreter.Color
 * @classdesc The Color class parses any browser color string and enable 
 * methods that converts to any other browser color string. It furthermore 
 * provides methods to generate brightness and luminance values of the given 
 * color. Finally it enables comparisons methods between other colors to compare
 * equalness and difference.
 * @link https://developer.mozilla.org/en-US/docs/Web/CSS/color_value
 * @param {string} _color      - A color string represented as a keyword, HEX,
 * RGB(A), or HSL(A).
 * @param {Element} [_context] - An element for which to calculate the
 * currentColor keyword.
 * @throws {ColorError} A ColorError describing what went wrong.
 * @returns {Color} A new Color Object.
 *
 * @example
 * // A typical usage of the Color object. Here the "gold" string could be
 * // any browser color string.
 * var gold = ColorInterpreter.Color("gold");
 * console.log(gold.toHEX());            // #FFD700
 * console.log(gold.toHEXA());           // #FFD700FF
 * console.log(gold.toPercentageRGB());  // rgb(100%,84.31%,0%)
 * console.log(gold.toPercentageRGBA()); // rgba(100%,84.31%,0%,1) 
 * console.log(gold.toRGB());            // rgb(255,215,0)
 * console.log(gold.toRGBA());           // rgb(255,215,0,1)
 * console.log(gold.toHSL());            // hsl(50.59,100%,50%)
 * console.log(gold.toHSLA());           // hsla(50.59,100%,50%,1) 
 * console.log(gold.toKeyword());        // gold 
 */
function Color (_color, _context) {
    var i, values, bits, scheme, self = this;

    if ( !(self instanceof Color) ) {
        return new Color(_color, _context);
    }

    /**
     * The fixed value
     * @protected
     * @member module:ColorInterpreter.Color~fixed
     * @type {number}
     * @default 2
     */
    self.fixed = 2;

    /**
     * The valid value
     * @protected
     * @member module:ColorInterpreter.Color~valid
     * @type {boolean}
     * @default true 
     */
    self.valid = true;

    // Convert _color to string, trim it and make it lowercase
    _color = trim.call(_color.toString()).toLowerCase();

    // Try lookup table
    _color = keywords2colors[_color] || _color;

    // currentColor is calculated by a function
    if ( isFunction(_color) ) {
        if ( isElement(_context) ) {
            _color = _color.call(self, _context);
        } else {
            self.valid = false;
            throw new ColorError(
                "'currentColor' cannot be used without a context"
            );
        }
    }

    // check if HEX color
    if ( _color.charAt(0) === "#" ) {
        // Remove # from string
        _color = _color.substr(1, 8);
        switch (_color.length) {
        case 3:
            _color = _color.charAt(0) + _color.charAt(0) +
                     _color.charAt(1) + _color.charAt(1) +
                     _color.charAt(2) + _color.charAt(2) + "ff";
            break;
        case 4:
            _color = _color.charAt(0) + _color.charAt(0) +
                     _color.charAt(1) + _color.charAt(1) +
                     _color.charAt(2) + _color.charAt(2) +
                     _color.charAt(3) + _color.charAt(3);
            break;
        case 6:
            _color += "ff";
            break;
        case 8:
            break;
        default:
            self.valid = false;
            throw new ColorError("Unable to parse HEX color");
        }
    } 

    // Run through parsing schemes
    for ( i = schemes.length - 1; i > -1; i -= 1 ) {
        scheme = schemes[i];
        bits   = scheme.regexp.exec(_color);

        if ( bits ) {
            values = scheme.process(bits);

            /**
             * The red value
             * @member module:ColorInterpreter.Color~r
             * @type {number}
             */
            self.r = values[0];

            /**
             * The green value
             * @member module:ColorInterpreter.Color~g
             * @type {number}
             */
            self.g = values[1];

            /**
             * The blue value
             * @member module:ColorInterpreter.Color~b
             * @type {number}
             */
            self.b = values[2];

            /**
             * The alpha value
             * @member module:ColorInterpreter.Color~a
             * @type {number}
             */
            self.a = values[3];

            if ( !isNumber(self.r) || self.r < 0 || self.r > 255 ) {
                self.valid = false;
                throw new ColorError("Unable to parse the red value");
            }

            if ( !isNumber(self.g) || self.g < 0 || self.g > 255 ) {
                self.valid = false;
                throw new ColorError("Unable to parse the green value");
            }

            if ( !isNumber(self.b) || self.b < 0 || self.b > 255 ) {
                self.valid = false;
                throw new ColorError("Unable to parse the blue value");
            }

            if ( !isNumber(self.a) || self.a < 0 || self.a > 1 ) {
                self.valid = false;
                throw new ColorError("Unable to parse the alpha value");
            }

            break;
        }
    }

    if ( i === -1 ) {
        self.valid = false;
        throw new ColorError("Unable to parse the given color string");
    }
}

Color.prototype = {
    /**
     * Generates the parsed color as a RGB string.
     * @method module:ColorInterpreter.Color#toRGB
     * @returns {string} The generated RGB string
     */
    toRGB : function () {
        var self = this;
        return "rgb(" + round(self.r) + "," + round(self.g) + "," + 
            round(self.b) + ")";
    },

    /**
     * Generates the parsed color as a RGB string.
     * @method module:ColorInterpreter.Color#toPercentageRGB
     * @returns {string} The generated RGB string
     */
    toPercentageRGB : function () {
        var self = this;
        return "rgb(" + 
            toFixed(self.r/255*100, self.fixed) + "%," + 
            toFixed(self.g/255*100, self.fixed) + "%," + 
            toFixed(self.b/255*100, self.fixed) + "%)";
    },

    /**
     * Generates the parsed color as a RGBA string.
     * @method module:ColorInterpreter.Color#toRGBA
     * @returns {string} The generated RGBA string
     */
    toRGBA : function () {
        var self = this;
        return "rgba(" + round(self.r) + "," + round(self.g) + "," + 
            round(self.b) + "," + toFixed(self.a, self.fixed*2) + ")";
    },

    /**
     * Generates the parsed color as a RGBA string.
     * @method module:ColorInterpreter.Color#toPercentageRGBA
     * @returns {string} The generated RGBA string
     */
    toPercentageRGBA : function () {
        var self = this;
        return "rgba(" + 
            toFixed(self.r/255*100, self.fixed) + "%," + 
            toFixed(self.g/255*100, self.fixed) + "%," + 
            toFixed(self.b/255*100, self.fixed) + "%," + 
            toFixed(self.a, self.fixed*2) + ")";
    },

    /**
     * Generates the parsed color as a HSL string.
     * @method module:ColorInterpreter.Color#toHSL
     * @returns {string} The generated HSL string
     */
    toHSL : function () {
        var self = this,
            hsl  = rgb2hsl(self.r, self.g, self.b);

        return "hsl(" + 
            toFixed(hsl.h*360, self.fixed) + "," + 
            toFixed(hsl.s*100, self.fixed) + "%," + 
            toFixed(hsl.l*100, self.fixed) + "%)";
    },

    /**
     * Generates the parsed color as a HSLA string.
     * @method module:ColorInterpreter.Color#toHSLA
     * @returns {string} The generated HSLA string
     */
    toHSLA : function () {
        var self = this,
            hsl  = rgb2hsl(self.r, self.g, self.b);
        return "hsla(" + 
            toFixed(hsl.h*360, self.fixed) + "," + 
            toFixed(hsl.s*100, self.fixed) + "%," + 
            toFixed(hsl.l*100, self.fixed) + "%," + 
            toFixed(self.a, self.fixed*2) + ")";
    },

    /**
     * Generates the parsed color as a keyword string or an empty string if the
     * keyword was not found.
     * @method module:ColorInterpreter.Color#toKeyword
     * @returns {string} The generated keyword string or an empty string
     */
    toKeyword : function () {
        var self = this;
        return colors2keywords[
            self.a === 0 ? "00000000"
                         : self.toHEX().substr(1, 6).toLowerCase()+"ff"
        ] || "";
    },

    /**
     * Generates the parsed color as a HEX string.
     * @method module:ColorInterpreter.Color#toHEX
     * @returns {string} The generated HEX string
     */
    toHEX : function () {
        var self = this;

        return ("#" + zeroPad2(round(self.r).toString(16)) + 
                      zeroPad2(round(self.g).toString(16)) + 
                      zeroPad2(round(self.b).toString(16))).toUpperCase();
    },

    /**
     * Generates the parsed color as a HEX string with an alpha value.
     * @method module:ColorInterpreter.Color#toHEXA
     * @returns {string} The generated HEX string with an alpha value
     */
    toHEXA : function () {
        var self = this,
            a    = zeroPad2(round((self.a * 255)).toString(16));

        return (self.toHEX() + a).toUpperCase();
    },

    /**
     * Returns a string representation of the color object
     * @method module:ColorInterpreter.Color#toString
     * @param {string} _scheme - The color scheme to test for support. 
     * @returns {string} A color string of the given scheme or a HEX color 
     * string.
     * @example
     * // The different ways to use the toString method.
     * var Color = ColorInterpreter.Color;
     * var gold  = Color("gold");
     * console.log(gold.toString());                 // #FFD700
     * console.log(gold.toString(Color.HEX));        // #FFD700
     * console.log(gold.toString(Color.HEXA));       // #FFD700FF
     * console.log(gold.toString("PercentageRGB"));  // rgb(100%,84.31%,0%)
     * console.log(gold.toString("PercentageRGBA")); // rgba(100%,84.31%,0%,1) 
     * console.log(gold.toString(Color.RGB));        // rgb(255,215,0)
     * console.log(gold.toString(Color.RGBA));       // rgb(255,215,0,1)
     * console.log(gold.toString(Color.HSL));        // hsl(50.59,100%,50%)
     * console.log(gold.toString(Color.HSLA));       // hsla(50.59,100%,50%,1) 
     * console.log(gold.toString(Color.Keyword));    // gold 
     */
    toString : function (_scheme) {
        var func, self = this;

        if ( isString(_scheme) ) {
            switch ( _scheme.toLowerCase() ) {
            case "percentagergb":
                func = self.toPercentageRGB;
                break;
            case "percentagergba":
                func = self.toPercentageRGBA;
                break;
            case Color.KEYWORD:
                func = self.toKeyword;
                break;
            default:
                func = self["to" + _scheme.toUpperCase()];
            }

            if ( isFunction(func) ) {
                return func.call(self);
            }
        }

        return self.toHEX();
    },

    /**
     * Sets a fixed value, representing the decimals accepted in output of 
     * toPercentageRGB, toPercentageRGBA, toHSL, and toHSLA.
     * @method module:ColorInterpreter.Color#setFixed
     * @param {number} _number - The number of decimals allowed.
     * @returns {Color} A reference to itself.
     */
    setFixed : function (_number) {
        var self = this;
        if ( isNumber(_number) ) {
            self.fixed = parseInt(_number, 10);
        }
        return self;
    },

    /**
     * Returns whether the Color object is valid, that is, the Color object was
     * constructed with a color that it was able to parse.
     * @method module:ColorInterpreter.Color#isValid
     * @returns {boolean} Whether the Color object is valid.
     */
    isValid : function () {
        return this.valid;
    },

    /**
     * Checks if the current color object is equal to a given color.
     * @method module:ColorInterpreter.Color#equals
     * @param {Color|String} _color - A Color object or color string. 
     * @throws {ColorError} A ColorError describing what went wrong.
     * @returns {boolean} Whether the colors are equal.
     */
    equals : function (_color) {
        var color = _color;

        if ( isString(color) ) {
            color = new Color(color);
        }

        if ( color instanceof Color ) {
            return this.toRGBA() === color.toRGBA();
        }

        return false;
    },

    /**
     * Creates a clone of the current Color object.
     * @method module:ColorInterpreter.Color#clone
     * @throws {ColorError} A ColorError describing what went wrong.
     * @returns {Color} A clone of the current color.
     */
    clone : function () {
        return new Color(this.toPercentageRGBA());
    },

    /**
     * Returns the red RGB value.
     * @method module:ColorInterpreter.Color#red
     * @returns {number} The red value
     */
    red : function () {
        return this.r;
    },

    /**
     * Returns the green RGB value.
     * @method module:ColorInterpreter.Color#green
     * @returns {number} The green value
     */
    green : function () {
        return this.g;
    },

    /**
     * Returns the blue RGB value.
     * @method module:ColorInterpreter.Color#blue
     * @returns {number} The blue value
     */
    blue : function () {
        return this.b;
    },

    /**
     * Returns the alpha value.
     * @method module:ColorInterpreter.Color#alpha
     * @returns {number} The alpha value
     */
    alpha : function () {
        return this.a;
    },
    
    /**
     * Returns the brightness value as defined by 
     * {@link https://www.w3.org/TR/AERT#color-contrast}.
     * @method module:ColorInterpreter.Color#brightness
     * @returns {number} The brightness value
     */
    brightness : function () {
        var self = this;
        return (self.r * 299 + self.g * 587 + self.b * 114) / 1000;
    },

    /**
     * Returns the brightness value as defined by 
     * {@link https://www.w3.org/TR/AERT#color-contrast}.
     * @method module:ColorInterpreter.Color#difference
     * @param {Color|String} _color - A Color object or color string. 
     * @throws {ColorError} A ColorError describing what went wrong.
     * @returns {number} The difference value or -1 if color parameter was not
     * a color.
     */
    difference : function (_color) {
        var color = _color,
            self  = this;

        if ( isString(color) ) {
            color = new Color(color);
        }

        if ( color instanceof Color ) {
            return (max(self.r, color.r) - min(self.r, color.r)) +
                   (max(self.g, color.g) - min(self.g, color.g)) +
                   (max(self.b, color.b) - min(self.b, color.b));
        }

        return -1;
    },

    /**
     * Returns the luminance value as defined by
     * {@link http://www.w3.org/TR/2008/REC-WCAG20-20081211/#relativeluminancedef}
     * @method module:ColorInterpreter.Color#luminance
     * @returns {number} The luminance value
     */
    luminance : function () {
        var self = this,
            r    = self.r/255,
            g    = self.g/255,
            b    = self.b/255;

        if ( r <= 0.03928 ) {
            r = r / 12.92;
        } else {
            r = pow(((r + 0.055) / 1.055), 2.4);
        }

        if ( g <= 0.03928 ) {
            g = g / 12.92;
        } else {
            g = pow(((g + 0.055) / 1.055), 2.4);
        }

        if (b <= 0.03928) {
            b = b / 12.92;
        } else {
            b = pow(((b + 0.055) / 1.055), 2.4);
        }

        return (0.2126 * r) + (0.7152 * g) + (0.0722 * b);
    }
};
Color.prototype.constructor = Color;


/**
 * Checks for support of the given browser-color-scheme. This feature is only 
 * available in javascript versions with a DOM model such as javascript in 
 * browsers.
 * @function
 * @static
 * @name module:ColorInterpreter.Color.hasBrowserSupport
 * @param {string} _scheme - The color scheme to test for support. 
 * @returns {Boolean|{CSS1:boolean, CSS2:boolean, CSS3:boolean, CSS4:boolean}} 
 * Whether there exists support for the scheme. 
 * The special case of keywords returns an object of booleans representing
 * the support of CSS1, CSS2, CSS3, and CSS4 keywords.
 *
 * @example
 * // The different ways to use the toString method.
 * var Color = ColorInterpreter.Color;
 * console.log(Color.hasBrowserSupport(Color.HEX));        // true || false
 * console.log(Color.hasBrowserSupport(Color.HEXA));       // true || false
 * console.log(Color.hasBrowserSupport(Color.RGB));        // true || false
 * console.log(Color.hasBrowserSupport(Color.RGBA));       // true || false
 * console.log(Color.hasBrowserSupport(Color.HSL));        // true || false
 * console.log(Color.hasBrowserSupport(Color.HSLA));       // true || false
 * console.log(Color.hasBrowserSupport(Color.Keyword));    // {CSS1:true||false, CSS2:true||false, CSS3:true||false, CSS4:true||false}
 */
Color.hasBrowserSupport = function (_scheme) {
    var div, css1, css2, css3, css4, result;

    if ( !support ) {
        support           = {};
        div               = document.createElement("div");

        // Test RGB
        div.style.cssText = "color:rgb(9,9,9)";
        support.rgb       = div.style.color.indexOf("rgb") > -1;

        // Test RGBA
        div.style.cssText = "color:rgba(9,9,9,0)";
        support.rgba      = div.style.color.indexOf("rgba") > -1;

        // Test HSL
        div.style.cssText = "color:hsl(9,9%,9%)";
        support.hsl       = div.style.color.indexOf("hsl") > -1;

        // Test HSLA
        div.style.cssText = "color:hsla(9,9%,9%,0)";
        support.hsla      = div.style.color.indexOf("hsla") > -1;

        // Test HEXA
        div.style.cssText = "color:#FA38";
        try {
            support.hexa  = new Color(div.style.color).isValid();
        } catch (ignore) {
            div.style.cssText = "color:#FFAA3388";
            try {
                support.hexa  = new Color(div.style.color).isValid();
            } catch (ignore) {
                support.hexa  = false;
            }
        }

        // Test HEX
        div.style.cssText = "color:#ABABAB";
        try {
            support.hex  = new Color(div.style.color).equals("#ABABAB");
        } catch (ignore) {
            support.hex  = false;
        }

        // Keywords
        div.style.cssText = "color:red";
        css1              = div.style.color.indexOf("red") > -1;
        div.style.cssText = "color:gold";
        css2              = div.style.color.indexOf("gold") > -1;
        div.style.cssText = "color:tan";
        css3              = div.style.color.indexOf("tan") > -1;
        div.style.cssText = "color:rebeccapurple";
        css4              = div.style.color.indexOf("rebeccapurple") > -1;

        support.keyword   = {
            CSS1 : css1,
            CSS2 : css2,
            CSS3 : css3,
            CSS4 : css4
        };
    }

    result = support[_scheme.toLowerCase()];

    return isObject(result) ? result : !!result;
};

/**
 * Adds keyword to the keyword table.
 * @function
 * @static
 * @name module:ColorInterpreter.Color.addKeyword
 * @param {string} _name        - The name of the keyword
 * @param {String|Color} _color - A initialized color object or color
 * string.
 * @throws {ColorError} A ColorError describing what went wrong.
 */
Color.addKeyword = function (_name, _color) {
    var color = _color;

    if ( !isString(_name) ) {
        throw new ColorError("Keyword name must be of type String");
    }

    if ( isString(color) ) {
        color = new Color(color);
    }

    if ( !(color instanceof Color) ) {
        throw new ColorError("Could not parse the color for the keyword");
    }

    keywords2colors[_name] = color.toHEXA().toLowerCase();
    colors2keywords[color.toHEXA().toLowerCase()] = _name;

    return this;
};

/**
 * @static
 * @name module:ColorInterpreter.Color.RGB
 * @constant
 * @type string
 * @default "rgb"
 */
Color.RGB      = "rgb";

/**
 * @static
 * @name module:ColorInterpreter.Color.RGBA
 * @constant
 * @type string
 * @default "rgba"
 */
Color.RGBA     = "rgba";

/**
 * @static
 * @name module:ColorInterpreter.Color.HSL
 * @constant
 * @type string
 * @default "hsl"
 */
Color.HSL      = "hsl";

/**
 * @static
 * @name module:ColorInterpreter.Color.HSLA
 * @constant
 * @type string
 * @default "hsla"
 */
Color.HSLA     = "hsla";


/**
 * @static
 * @name module:ColorInterpreter.Color.HEX
 * @constant
 * @type string
 * @default "hex"
 */
Color.HEX      = "hex";

/**
 * @static
 * @name module:ColorInterpreter.Color.HEXA
 * @constant
 * @type string
 * @default "hexa"
 */
Color.HEXA     = "hexa";

/**
 * @static
 * @name module:ColorInterpreter.Color.KEYWORD
 * @constant
 * @type string
 * @default "keyword"
 */
Color.KEYWORD  = "keyword";

// Export to module
exports.Color = Color;

/******************************************************************************
 *                                 ERRORS                                     *
 ******************************************************************************/

/**
 * An error object associated with parsing of browser color strings.
 * @class ColorError
 * @classdesc The ColorError class is used to signal an error when parsing a 
 * browser color string.
 * @alias module:ColorInterpreter
 * @augments Error
 * @param {string} _message - The message that should be assigned to
 * the error.
 *
 * @example 
 * // If a color string could not be parsed, a ColorError is thrown.
 * try {
 *     ColorInterpreter.Color("mortz");
 * } catch (err) {
 *     console.log(err instanceof ColorInterpreter.ColorError); // true
 * }
 **/
function ColorError(_message) {
    var self = this,
        err  = new Error();

    if ( err.stack ) {
        self.stack = self.name + " at " + err.stack.match(/[^\s]+$/);
    }

    self.message = _message;
}

if ( "setPrototypeOf" in Object ) {
    Object.setPrototypeOf(ColorError, Error);
} else {
    ColorError.__proto__ = Error;
}

ColorError.prototype             = "create" in Object ?
    Object.create(Error.prototype) : new Error();
ColorError.prototype.name        = "ColorError";
ColorError.prototype.message     = "";
ColorError.prototype.constructor = ColorError;
exports.ColorError = ColorError;

/******************************************************************************
 *                             UTILITY FUNCTIONS                              *
 ******************************************************************************/

/**
 * Detects if argument is a Number
 * @function
 * @private
 * @param {Object} _obj - Object to check
 * @returns {boolean} whether the condition is true or false
 **/
function isString (_obj) {
    return oProto.toString.call(_obj) === "[object String]";
}

/**
 * Detects if argument is a Number
 * @function
 * @private
 * @param {Object} _obj - Object to check
 * @returns {boolean} whether the condition is true or false
 **/
function isNumber (_obj) {
    return oProto.toString.call(_obj) === "[object Number]" && !isNaN(_obj);
}

/**
 * Detects if argument is an Element
 * @function
 * @private
 * @param {Object} _obj - Object to check
 * @returns {boolean} whether the condition is true or false
 **/
function isElement (_obj) {
    return !!(_obj && _obj.nodeType === 1);
}

/**
 * Detects if argument is an Object
 * @function
 * @private
 * @param {Object} _obj - Object to check
 * @returns {boolean} whether the condition is true or false
 **/
function isObject (_obj) {
    var type = typeof _obj;
    return type === "function" || type === "object" && !!_obj;
}

/**
 * Detects if argument is a Function
 * @function
 * @private
 * @param {Object} _obj - Object to check
 * @returns {boolean} whether the condition is true or false
 **/
function isFunction (_obj) {
    if ( typeof /./ !== "function" && typeof Int8Array !== "object" ) {
        return typeof _obj === "function" || false;
    }
    return oProto.toString.call(_obj) === "[object Function]";
}

/**
 * Converts a Number representing a degree into a range between 0 and 360
 * @function
 * @private
 * @param {Object} _deg - A number representing a degree
 * @returns {number} The degree in range [0;360]
 **/
function to360Degrees(_deg) {
    if ( isNumber(_deg) ) {
        while ( _deg < 0 ) {
            _deg += 360;
        }

        while ( _deg > 360 ) {
            _deg -= 360;
        }

        return _deg;
    }

    return 0;
}

/**
 * Ensures that the string parameter has length 2 by zero padding it.
 * @function
 * @private
 * @param {string} _str - A string
 * @returns {string} A zeropadded string
 **/
function zeroPad2(_str) {
    return _str.length === 1 ? "0" + _str : _str;
}


/**
 * Converts number to fixed fractional.
 * @function
 * @private
 * @param {number} _number - The number to be fixed
 * @param {number} _fixed  - Amount of decimals
 * @returns {number} A fixed number
 **/
function toFixed(_number, _fixed) {
    return parseFloat((_number).toFixed(_fixed));
}

/**
 * Converts values of rgb to hsl values
 * @function
 * @private
 * @param {number} _r - A number representing the red value
 * @param {number} _g - A number representing the green value
 * @param {number} _b - A number representing the blue value 
 * @returns {{h:number, s:number, l:number}} An object with the h, s, and l 
 * values set.
 **/
function rgb2hsl (_r, _g, _b) {
    var h, s, d,
        r       = _r/255, 
        g       = _g/255,
        b       = _b/255,
        maximum = max(r, g, b), 
        minimum = min(r, g, b),
        l       = (maximum + minimum) / 2;

    if ( maximum === minimum ) {
        h = s = 0; // achromatic
    } else {
        d = maximum - minimum;
        s = l > 0.5 ? d / (2 - maximum - minimum) : d / (maximum + minimum);
        switch ( maximum ) {
        case r: 
            h = (g - b) / d + (g < b ? 6 : 0); 
            break;
        case g: 
            h = (b - r) / d + 2; 
            break;
        case b: 
            h = (r - g) / d + 4; 
            break;
        }
        h /= 6;
    }
    return {h:h, s:s, l:l};
}
