xs.init = function (module) {
    module.selectDiv("drawLine")
        .buildFrame(300, 300, "/iframes/begin/main.html");
    module.selectDiv("lineCode")
        .load("/code", xs.COMPONENT, { text: "JS", code: "/threeJs/howToDrawLine" });
    module.selectDiv("dotCode")
        .load("/code", xs.COMPONENT, { text: "JS", code: "/threeJs/howToDrawDot" });
    module.selectDiv("displayText")
        .buildFrame(300, 300, "/iframes/displayFonts/main.html");
}