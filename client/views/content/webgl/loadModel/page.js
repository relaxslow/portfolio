xs.init = function (module) {
    module.selectDiv("loadModel")
        .buildFrame(400, 400, "/iframes/loadGLTF/main.html");
    // module.selectDiv("wireframeCode")
    //     .load("/code", xs.COMPONENT, { text: "JS", code: "/threeJs/objWireframe" });
}

