xs.init = function (module) {
    module.selectDiv("threeJsBegin")
        .buildFrame(400, 300, "/client/views/content/webgl/iframes/begin.html");

    module.selectDiv("drawLineCode")
        .load("/code", xs.COMPONENT, { text: "JS", code: "/threeJs/howToDrawLine" });
    module.selectDiv("drawDotCode")
        .load("/code", xs.COMPONENT, { text: "JS", code: "/threeJs/howToDrawDot" });
    module.selectDiv("drawLine")
        .buildFrame(400, 300, "/client/views/content/webgl/iframes/line.html");
    module.selectDiv("displayText")
        .buildFrame(400, 300, "/client/views/content/webgl/iframes/displayFonts.html");
}