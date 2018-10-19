/** @param {xs.Div} module a wrapper of div */
xs.init = function (module) {

    module.selectDiv("drawLine")
        .buildFrame(300, 300, "/client/views/content/webgl/drawline/line.html");
    module.selectDiv("lineCode")
        .load("/code", xs.COMPONENT, { text: "JS", code: "/threeJs/howToDrawLine" });
    module.selectDiv("dotCode")
        .load("/code", xs.COMPONENT, { text: "JS", code: "/threeJs/howToDrawDot" });
    // module.selectDiv("displayText")
    //     .buildFrame(300, 300, "/client/views/content/webgl/drawline/displayfonts.html");
}