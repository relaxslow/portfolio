xs.init = function (module) {
    let wid = 400;
    let hei = 300;
    module.selectDiv("threeJsTest")
    .buildFrame(400, 300, "/client/views/content/webgl/drawLine/displayFonts.html");

    module.selectDiv("threeJsBeginCode")
    .load("/code", xs.COMPONENT, { text: "JS", code: "/threeJs/howToDrawLine" });

}