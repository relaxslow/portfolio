xs.init = function (module) {
    module.selectDiv("loadModel")
        .buildFrame(400, 400, "/client/views/content/webgl/iframes/loadGLTF.html");
    module.selectDiv("wireframeCode")
        .load("/code", xs.COMPONENT, { text: "JS", code: "/threeJs/objWireframe" });
}

