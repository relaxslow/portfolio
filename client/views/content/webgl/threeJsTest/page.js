xs.init = function (module) {
    module.selectDiv("threeJsBegin")
        .buildFrame(400, 300, "/iframes/begin/main.html");

    module.selectDiv("drawLineCode")
        .load("/code", xs.COMPONENT, { text: "JS", code: "/threeJs/howToDrawLine" });
    module.selectDiv("drawDotCode")
        .load("/code", xs.COMPONENT, { text: "JS", code: "/threeJs/howToDrawDot" });
    module.selectDiv("drawLine")
        .buildFrame(400, 300, "/iframes/line/main.html");
    module.selectDiv("displayText")
        .buildFrame(400, 300, "/iframes/displayFonts/main.html");
}