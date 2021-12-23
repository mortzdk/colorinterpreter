"use strict";

// Unit tests allow multiple answers due to precision errors.

var Color  = require("..").Color,
    t      = require("tape"),
    colors = {
        "red" : { // CSS1
            "hex3"    : ["#F00"],
            "hex4"    : ["#F000"],
            "hex"     : ["#FF0000"],
            "hexa"    : ["#FF000000"],
            "rgb"     : ["rgb(100%,0%,0%)"],
            "rgba"    : ["rgba(100%,0%,0%,0)"],
            "hsl"     : ["hsl(0,100%,50%)"],
            "hsla"    : ["hsla(0,100%,50%,0)"],
            "keyword" : ["transparent"],
            "alpha"   : 0
        },
    
        "gold" : { // CSS2
            "hex"     : ["#FFD700"],
            "hexa"    : ["#FFD700FF"],
            "rgb"     : ["rgb(100%,84.31%,0%)", "rgb(100%,84.32%,0%)"],
            "rgba"    : ["rgba(100%,84.31%,0%,1)", "rgba(100%,84.32%,0%,1)"],
            "hsl"     : ["hsl(50.59,100%,50%)"],
            "hsla"    : ["hsla(50.59,100%,50%,1)"],
            "keyword" : ["gold"],
            "alpha"   : 1
        },
    
        "tan" : { // CSS3
            "hex"     : ["#D2B48C"],
            "hexa"    : ["#D2B48C3D"],
            "rgb"     : ["rgb(82.35%,70.59%,54.9%)", "rgb(82.35%,70.6%,54.9%)", "rgb(82.35%,70.59%,54.91%)", "rgb(82.35%,70.6%,54.91%)"],
            "rgba"    : ["rgba(82.35%,70.59%,54.9%,0.2392)", "rgba(82.35%,70.6%,54.9%,0.2392)", "rgba(82.35%,70.59%,54.91%,0.2392)", "rgba(82.35%,70.6%,54.91%,0.2392)"],
            "hsl"     : ["hsl(34.29,43.75%,68.63%)", "hsl(34.3,43.75%,68.63%)"],
            "hsla"    : ["hsla(34.29,43.75%,68.63%,0.2392)", "hsla(34.3,43.75%,68.63%,0.2392)"],
            "keyword" : ["tan"],
            "alpha"   : 0.23921568627450981
        },
    
        "rebeccapurple" : { // CSS4
            "hex3"    : ["#639"],
            "hex4"    : ["#6398"],
            "hex"     : ["#663399"],
            "hexa"    : ["#66339988"],
            "rgb"     : ["rgb(40%,20%,60%)"],
            "rgba"    : ["rgba(40%,20%,60%,0.5333)"],
            "hsl"     : ["hsl(270,50%,40%)", "hsl(270deg,50%,40%)", "hsl(4.71238898rad,50%,40%)", "hsl(300grad,50%,40%)", "hsl(0.75turn,50%,40%)"],
            "hsla"    : ["hsla(270,50%,40%,0.5333)", "hsla(270deg,50%,40%,0.5333)", "hsl(4.71238898rad,50%,40%,0.5333)", "hsl(300grad,50%,40%,0.5333)", "hsl(0.75turn,50%,40%,0.5333)"],
            "keyword" : ["rebeccapurple"],
            "alpha"   : 0.5333333333333333
        }
    };

t("Should parse keywords without throwing ColorError", function (_t) {
    var c1, c2, c3, c4, c5, c6, c7;
    _t.plan(8);
    _t.doesNotThrow(function () {
        c1 = Color("red");
        c2 = Color("green");
        c3 = Color("rebeccapurple");
        c4 = new Color("darkmagenta");
        c5 = new Color("lightseagreen");
        c6 = new Color("hotpink");
        c7 = new Color("transparent");
    });
    _t.ok(c1.isValid());
    _t.ok(c2.isValid());
    _t.ok(c3.isValid());
    _t.ok(c4.isValid());
    _t.ok(c5.isValid());
    _t.ok(c6.isValid());
    _t.ok(c7.isValid());
    _t.end();
});

t("Should throw error due to wrong color formats", function (_t) {
    _t.plan(7);

    _t.throws(
        function () {
            Color("rgb(300, 0, 0)");
        },
        /Unable to parse the red value/
    );

    _t.throws(
        function () {
            Color("rgb(0, 300, 0)");
        },
        /Unable to parse the green value/
    );

    _t.throws(
        function () {
            Color("rgb(0, 0, 300)");
        },
        /Unable to parse the blue value/
    );

    _t.throws(
        function () {
            Color("rgba(0, 0, 0, 200%)");
        },
        /Unable to parse the alpha value/
    );

    _t.throws(
        function () {
            Color("#F3");
        },
        /Unable to parse HEX color/
    );

    _t.throws(
        function () {
            Color("currentColor");
        },
        /'currentColor' cannot be used without a context/
    );

    _t.throws(
        function () {
            Color("loodle");
        },
        /Unable to parse the given color string/
    );

    _t.end();
});

t("Should parse keyword to other formats", function (_t) {
    var color;

    _t.plan(Object.keys(colors).length*7);

    Object.keys(colors).forEach(function (_name) {
        color = new Color(_name);
        if ( color.alpha() === 1 ) {
            color.a = colors[_name].alpha;
        }

        _t.ok(
            colors[_name].hex.some(function(_s){return _s===color.toHEX();}),
            "Correct HEX value"
        );
        _t.ok(
            colors[_name].hexa.some(function(_s){return _s===color.toHEXA();}),
            "Correct HEXA value"
        );
        _t.ok(
            colors[_name].rgb.some(function(_s){return _s===color.toPercentageRGB();}),
            "Correct RGB value"
        );
        _t.ok(
            colors[_name].rgba.some(function(_s){return _s===color.toPercentageRGBA();}),
            "Correct RGBA value"
        );
        _t.ok(
            colors[_name].hsl.some(function(_s){return _s===color.toHSL();}),
            "Correct HSL value"
        );
        _t.ok(
            colors[_name].hsla.some(function(_s){return _s===color.toHSLA();}),
            "Correct HSLA value"
        );
        _t.ok(
            colors[_name].keyword.some(function(_s){return _s===color.toKeyword();}),
            "Correct Keyword value"
        );
    });
    _t.end();
});

t("Should parse 3-lengthed HEX to other formats", function (_t) {
    var color;

    _t.plan(2*7);

    Object.keys(colors).forEach(function (_name) {
        if ( colors[_name].hex3 ) {
            color = new Color(colors[_name].hex3[0]);
            if ( color.alpha() === 1 ) {
                color.a = colors[_name].alpha;
            }

            _t.ok(
                colors[_name].hex.some(function(_s){return _s===color.toHEX();}),
                "Correct HEX value"
            );
            _t.ok(
                colors[_name].hexa.some(function(_s){return _s===color.toHEXA();}),
                "Correct HEXA value"
            );
            _t.ok(
                colors[_name].rgb.some(function(_s){return _s===color.toPercentageRGB();}),
                "Correct RGB value"
            );
            _t.ok(
                colors[_name].rgba.some(function(_s){return _s===color.toPercentageRGBA();}),
                "Correct RGBA value"
            );
            _t.ok(
                colors[_name].hsl.some(function(_s){return _s===color.toHSL();}),
                "Correct HSL value"
            );
            _t.ok(
                colors[_name].hsla.some(function(_s){return _s===color.toHSLA();}),
                "Correct HSLA value"
            );
            _t.ok(
                colors[_name].keyword.some(
                    function(_s){return _s===color.toKeyword();}
                ),
                "Correct Keyword value"
            );
        }
    });
    _t.end();
});

t("Should parse 4-lengthed HEX to other formats", function (_t) {
    var color;

    _t.plan(2*7);

    Object.keys(colors).forEach(function (_name) {
        if ( colors[_name].hex4 ) {
            color = new Color(colors[_name].hex4[0]);
            if ( color.alpha() === 1 ) {
                color.a = colors[_name].alpha;
            }

            _t.ok(
                colors[_name].hex.some(function(_s){return _s===color.toHEX();}),
                "Correct HEX value"
            );
            _t.ok(
                colors[_name].hexa.some(function(_s){return _s===color.toHEXA();}),
                "Correct HEXA value"
            );
            _t.ok(
                colors[_name].rgb.some(function(_s){return _s===color.toPercentageRGB();}),
                "Correct RGB value"
            );
            _t.ok(
                colors[_name].rgba.some(function(_s){return _s===color.toPercentageRGBA();}),
                "Correct RGBA value"
            );
            _t.ok(
                colors[_name].hsl.some(function(_s){return _s===color.toHSL();}),
                "Correct HSL value"
            );
            _t.ok(
                colors[_name].hsla.some(function(_s){return _s===color.toHSLA();}),
                "Correct HSLA value"
            );
            _t.ok(
                colors[_name].keyword.some(
                    function(_s){return _s===color.toKeyword();}
                ),
                "Correct Keyword value"
            );
        }
    });
    _t.end();
});

t("Should parse 6-lengthed HEX to other formats", function (_t) {
    var color;

    _t.plan(Object.keys(colors).length*7);

    Object.keys(colors).forEach(function (_name) {
        color = new Color(colors[_name].hex[0]);
        if ( color.alpha() === 1 ) {
            color.a = colors[_name].alpha;
        }

        _t.ok(
            colors[_name].hex.some(function(_s){return _s===color.toHEX();}),
            "Correct HEX value"
        );
        _t.ok(
            colors[_name].hexa.some(function(_s){return _s===color.toHEXA();}),
            "Correct HEXA value"
        );
        _t.ok(
            colors[_name].rgb.some(function(_s){return _s===color.toPercentageRGB();}),
            "Correct RGB value"
        );
        _t.ok(
            colors[_name].rgba.some(function(_s){return _s===color.toPercentageRGBA();}),
            "Correct RGBA value"
        );
        _t.ok(
            colors[_name].hsl.some(function(_s){return _s===color.toHSL();}),
            "Correct HSL value"
        );
        _t.ok(
            colors[_name].hsla.some(function(_s){return _s===color.toHSLA();}),
            "Correct HSLA value"
        );
        _t.ok(
            colors[_name].keyword.some(function(_s){return _s===color.toKeyword();}),
            "Correct Keyword value"
        );
    });
    _t.end();
});

t("Should parse 8-lengthed HEX to other formats", function (_t) {
    var color;

    _t.plan(Object.keys(colors).length*7);

    Object.keys(colors).forEach(function (_name) {
        color = new Color(colors[_name].hexa[0]);

        _t.ok(
            colors[_name].hex.some(function(_s){return _s===color.toHEX();}),
            "Correct HEX value"
        );
        _t.ok(
            colors[_name].hexa.some(function(_s){return _s===color.toHEXA();}),
            "Correct HEXA value"
        );
        _t.ok(
            colors[_name].rgb.some(function(_s){return _s===color.toPercentageRGB();}),
            "Correct RGB value"
        );
        _t.ok(
            colors[_name].rgba.some(function(_s){return _s===color.toPercentageRGBA();}),
            "Correct RGBA value"
        );
        _t.ok(
            colors[_name].hsl.some(function(_s){return _s===color.toHSL();}),
            "Correct HSL value"
        );
        _t.ok(
            colors[_name].hsla.some(function(_s){return _s===color.toHSLA();}),
            "Correct HSLA value"
        );
        _t.ok(
            colors[_name].keyword.some(function(_s){return _s===color.toKeyword();}),
            "Correct Keyword value"
        );
    });
    _t.end();
});

t("Should parse RGB to other formats", function (_t) {
    var color;

    _t.plan(Object.keys(colors).length*7);

    Object.keys(colors).forEach(function (_name) {
        color = new Color(colors[_name].rgb[0]);
        if ( color.alpha() === 1 ) {
            color.a = colors[_name].alpha;
        }

        _t.ok(
            colors[_name].hex.some(function(_s){return _s===color.toHEX();}),
            "Correct HEX value"
        );
        _t.ok(
            colors[_name].hexa.some(function(_s){return _s===color.toHEXA();}),
            "Correct HEXA value"
        );
        _t.ok(
            colors[_name].rgb.some(function(_s){return _s===color.toPercentageRGB();}),
            "Correct RGB value"
        );
        _t.ok(
            colors[_name].rgba.some(function(_s){return _s===color.toPercentageRGBA();}),
            "Correct RGBA value"
        );
        _t.ok(
            colors[_name].hsl.some(function(_s){return _s===color.toHSL();}),
            "Correct HSL value"
        );
        _t.ok(
            colors[_name].hsla.some(function(_s){return _s===color.toHSLA();}),
            "Correct HSLA value"
        );
        _t.ok(
            colors[_name].keyword.some(function(_s){return _s===color.toKeyword();}),
            "Correct Keyword value"
        );
    });
    _t.end();
});

t("Should parse RGBA to other formats", function (_t) {
    var color;

    _t.plan(Object.keys(colors).length*7);

    Object.keys(colors).forEach(function (_name) {
        color = new Color(colors[_name].rgba[0]);

        _t.ok(
            colors[_name].hex.some(function(_s){return _s===color.toHEX();}),
            "Correct HEX value"
        );
        _t.ok(
            colors[_name].hexa.some(function(_s){return _s===color.toHEXA();}),
            "Correct HEXA value"
        );
        _t.ok(
            colors[_name].rgb.some(function(_s){return _s===color.toPercentageRGB();}),
            "Correct RGB value"
        );
        _t.ok(
            colors[_name].rgba.some(function(_s){return _s===color.toPercentageRGBA();}),
            "Correct RGBA value"
        );
        _t.ok(
            colors[_name].hsl.some(function(_s){return _s===color.toHSL();}),
            "Correct HSL value"
        );
        _t.ok(
            colors[_name].hsla.some(function(_s){return _s===color.toHSLA();}),
            "Correct HSLA value"
        );
        _t.ok(
            colors[_name].keyword.some(function(_s){return _s===color.toKeyword();}),
            "Correct Keyword value"
        );
    });
    _t.end();
});

t("Should parse HSL to other formats", function (_t) {
    var color;

    _t.plan(Object.keys(colors).length*7);

    Object.keys(colors).forEach(function (_name) {
        color = new Color(colors[_name].hsl[0]);
        if ( color.alpha() === 1 ) {
            color.a = colors[_name].alpha;
        }

        _t.ok(
            colors[_name].hex.some(function(_s){return _s===color.toHEX();}),
            "Correct HEX value"
        );
        _t.ok(
            colors[_name].hexa.some(function(_s){return _s===color.toHEXA();}),
            "Correct HEXA value"
        );
        _t.ok(
            colors[_name].rgb.some(function(_s){return _s===color.toPercentageRGB();}),
            "Correct RGB value"
        );
        _t.ok(
            colors[_name].rgba.some(function(_s){return _s===color.toPercentageRGBA();}),
            "Correct RGBA value"
        );
        _t.ok(
            colors[_name].hsl.some(function(_s){return _s===color.toHSL();}),
            "Correct HSL value"
        );
        _t.ok(
            colors[_name].hsla.some(function(_s){return _s===color.toHSLA();}),
            "Correct HSLA value"
        );
        _t.ok(
            colors[_name].keyword.some(function(_s){return _s===color.toKeyword();}),
            "Correct Keyword value"
        );
    });
    _t.end();
});

t("Should parse HSLA to other formats", function (_t) {
    var color;

    _t.plan(Object.keys(colors).length*7);

    Object.keys(colors).forEach(function (_name) {
        color = new Color(colors[_name].hsla[0]);

        _t.ok(
            colors[_name].hex.some(function(_s){return _s===color.toHEX();}),
            "Correct HEX value"
        );
        _t.ok(
            colors[_name].hexa.some(function(_s){return _s===color.toHEXA();}),
            "Correct HEXA value"
        );
        _t.ok(
            colors[_name].rgb.some(function(_s){return _s===color.toPercentageRGB();}),
            "Correct RGB value"
        );
        _t.ok(
            colors[_name].rgba.some(function(_s){return _s===color.toPercentageRGBA();}),
            "Correct RGBA value"
        );
        _t.ok(
            colors[_name].hsl.some(function(_s){return _s===color.toHSL();}),
            "Correct HSL value"
        );
        _t.ok(
            colors[_name].hsla.some(function(_s){return _s===color.toHSLA();}),
            "Correct HSLA value"
        );
        _t.ok(
            colors[_name].keyword.some(function(_s){return _s===color.toKeyword();}),
            "Correct Keyword value"
        );
    });
    _t.end();
});

t("Should parse HSL units to other formats", function (_t) {
    var color;

    _t.plan(colors["rebeccapurple"].hsl.length*7);

    colors["rebeccapurple"].hsl.forEach(function (_color) {
        color = new Color(_color);

        if ( color.alpha() === 1 ) {
            color.a = colors["rebeccapurple"].alpha;
        }

        _t.ok(
            colors["rebeccapurple"].hex.some(function(_s){return _s===color.toHEX();}),
            "Correct HEX value"
        );
        _t.ok(
            colors["rebeccapurple"].hexa.some(function(_s){return _s===color.toHEXA();}),
            "Correct HEXA value"
        );
        _t.ok(
            colors["rebeccapurple"].rgb.some(function(_s){return _s===color.toPercentageRGB();}),
            "Correct RGB value"
        );
        _t.ok(
            colors["rebeccapurple"].rgba.some(function(_s){return _s===color.toPercentageRGBA();}),
            "Correct RGBA value"
        );
        _t.ok(
            colors["rebeccapurple"].hsl.some(function(_s){return _s===color.toHSL();}),
            "Correct HSL value"
        );
        _t.ok(
            colors["rebeccapurple"].hsla.some(function(_s){return _s===color.toHSLA();}),
            "Correct HSLA value"
        );
        _t.ok(
            colors["rebeccapurple"].keyword.some(function(_s){return _s===color.toKeyword();}),
            "Correct Keyword value"
        );
    });
    _t.end();
});

t("Should parse HSLA units to other formats", function (_t) {
    var color;

    _t.plan(colors["rebeccapurple"].hsla.length*7);

    colors["rebeccapurple"].hsla.forEach(function (_color) {
        color = new Color(_color);

        if ( color.alpha() === 1 ) {
            color.a = colors["rebeccapurple"].alpha;
        }

        _t.ok(
            colors["rebeccapurple"].hex.some(function(_s){return _s===color.toHEX();}),
            "Correct HEX value"
        );
        _t.ok(
            colors["rebeccapurple"].hexa.some(function(_s){return _s===color.toHEXA();}),
            "Correct HEXA value"
        );
        _t.ok(
            colors["rebeccapurple"].rgb.some(function(_s){return _s===color.toPercentageRGB();}),
            "Correct RGB value"
        );
        _t.ok(
            colors["rebeccapurple"].rgba.some(function(_s){return _s===color.toPercentageRGBA();}),
            "Correct RGBA value"
        );
        _t.ok(
            colors["rebeccapurple"].hsl.some(function(_s){return _s===color.toHSL();}),
            "Correct HSL value"
        );
        _t.ok(
            colors["rebeccapurple"].hsla.some(function(_s){return _s===color.toHSLA();}),
            "Correct HSLA value"
        );
        _t.ok(
            colors["rebeccapurple"].keyword.some(function(_s){return _s===color.toKeyword();}),
            "Correct Keyword value"
        );
    });
    _t.end();
});

t("Should parse HSLA and RGBA with alpha percentage", function (_t) {
    var color1 = new Color("rgba(99.38%, 33.328%, 87.38749%, 46.239%)"),
        color2 = new Color("hsla(15.5334303rad, 33.328%, 87.38749%, 46.239%)");

    _t.plan(2);

    _t.equals(parseFloat(color1.alpha().toFixed(5)), 0.46239);
    _t.equals(parseFloat(color2.alpha().toFixed(5)), 0.46239);

    _t.end();
});

t("Should parse negative units for HSLA", function (_t) {
    var color1 = new Color("hsla(-15.5334303rad, 33.32%, 87.38%, 46.239%)"),
        color2 = new Color("hsla(190deg, 33.32%, 87.38%, 46.239%)");

    _t.plan(5);

    _t.equals(color1.toHEX(), "#D4E6EA");
    _t.equals(color1.toRGB(), "rgb(212,230,234)");
    _t.equals(color2.toHEX(), "#D4E6EA");
    _t.equals(color2.toRGB(), "rgb(212,230,234)");
    _t.ok(color1.equals(color2));

    _t.end();
});

t("Edge-cases of rgb2hsl and HSL scheme", function (_t) {
    var color1 = new Color("rgb(     255, 255 ,255   )"),
        color2 = new Color("rgb(     10, 255 ,10   )"),
        color3 = new Color("hsl(     10, 0% ,10%   )");

    _t.plan(3);

    _t.equals(color1.toHSL(), "hsl(0,0%,100%)");
    _t.equals(color2.toHSL(), "hsl(120,100%,51.96%)");
    _t.equals(color3.toRGB(), "rgb(26,26,26)");

    _t.end();
});

/*
t("Should return correct luminance values", function (_t) {
    _t.plan(0);

    // TODO

    _t.end();
});

t("Should return correct brightness values", function (_t) {
    _t.plan(0);

    // TODO

    _t.end();
});
*/

t("Should return correct alpha, red, green, and blue values", function (_t) {
    var color = new Color("hsl(     10, 0% ,10%   )");
    _t.plan(4);

    _t.equals(color.red(), 25.5);
    _t.equals(color.green(), 25.5);
    _t.equals(color.blue(), 25.5);
    _t.equals(color.alpha(), 1);

    _t.end();
});

t("Should test the equals method", function (_t) {
    var color = new Color("hsl(     10, 0% ,10%   )");
    _t.plan(3);

    _t.ok(color.equals("#1A1A1A"));
    _t.ok(!color.equals("#1A1A1B"));
    _t.ok(!color.equals(1234));

    _t.end();
});

t("Should clone a color and have same values", function (_t) {
    var color1 = new Color("hsl(     10, 0% ,10%   )"),
        color2 = color1.clone();
    _t.plan(1);

    _t.ok(color1.equals(color2));

    _t.end();
});

t("Should return more decimals", function (_t) {
    var color = new Color("gold");

    _t.plan(3);

    _t.equals(color.toPercentageRGBA(), "rgba(100%,84.31%,0%,1)");
    color.setFixed(6);
    _t.equals(color.toPercentageRGBA(), "rgba(100%,84.313725%,0%,1)");
    color.setFixed(3);
    _t.equals(color.toPercentageRGBA(), "rgba(100%,84.314%,0%,1)");

    _t.end();
});

t("Testing of add new keyword", function (_t) {
    _t.plan(5);

    _t.throws(
        function () {
            Color.addKeyword(1234, "rgba(42.424242%, 73.4%, 39.8%, 20.38%)");
        },
        /Keyword name must be of type String/
    );

    _t.throws(
        function () {
            Color.addKeyword("loodle", 1234);
        },
        /Could not parse the color for the keyword/
    );

    _t.throws(
        function () {
            Color("loodle");
        },
        /Unable to parse the given color string/
    );

    Color.addKeyword("loodle", "rgba(42.424242%, 73.4%, 39.8%, 20.38%)");

    _t.doesNotThrow(
        function () {
            Color("loodle");
        }
    );

    _t.equals(Color("loodle").toHEXA(), "#6CBB6534");

    _t.end();
});

t("Should return correct toString values", function (_t) {
    var color = new Color("gold");

    _t.plan(10);

    if ( color.alpha() === 1 ) {
        color.a = colors["gold"].alpha;
    }

    _t.equals(color.toString(),                 "#FFD700");
    _t.equals(color.toString(Color.HEX),        "#FFD700");
    _t.equals(color.toString(Color.HEXA),       "#FFD700FF");
    _t.equals(color.toString(Color.RGB),        "rgb(255,215,0)");
    _t.equals(color.toString("PercentageRGB"),  "rgb(100%,84.31%,0%)");
    _t.equals(color.toString(Color.RGBA),       "rgba(255,215,0,1)");
    _t.equals(color.toString("PercentageRGBA"), "rgba(100%,84.31%,0%,1)");
    _t.equals(color.toString(Color.HSL),        "hsl(50.59,100%,50%)");
    _t.equals(color.toString(Color.HSLA),       "hsla(50.59,100%,50%,1)");
    _t.equals(color.toString(Color.KEYWORD),    "gold");

    _t.end();
});

t("Should return correct brightness", function(_t) {
    _t.plan(2);

    _t.equals(Color("#000").brightness(), 0);
    _t.equals(Color("#fff").brightness(), 255);

    _t.end();
});

t("Should return correct luminance", function(_t) {
    _t.plan(2);

    _t.equals(Color("#000").luminance(), 0);
    _t.equals(Color("#fff").luminance(), 1);

    _t.end();
});

t("Should return correct difference", function(_t) {
    _t.plan(2);

    _t.equals(Color("#000").difference("#000000"), 0);
    _t.equals(Color("#000").difference(1234), -1);

    _t.end();
});
