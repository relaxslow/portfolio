xs.init = function (module) {
    module.selectDiv("threeJsTest")
    .buildFrame(400, 300, "/client/views/content/webgl/drawLine/displayFonts.html");

    module.selectDiv("threeJsBeginCode")
    .load("/code", xs.COMPONENT, { text: "JS", code: "/threeJs/howToDrawLine" });
    module.selectDiv("testBox")
    .buildFrame(400, 300, "/client/views/content/webgl/drawLine/line.html");
}