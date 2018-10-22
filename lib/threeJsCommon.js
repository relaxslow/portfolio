window.initThree = function (backgroundColor) {
    let renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);
    var scene = new THREE.Scene();
    scene.background = new THREE.Color(backgroundColor);

    document.body.onunload = function () {
        // cancelAnimationFrame(window.animationID);
        scene.traverse(cleanMeshes);

        function cleanMeshes(obj) {
            if (obj instanceof THREE.Mesh) {
                obj.geometry.dispose();
                for (let i = 0; i < obj.material.length; i++) {
                    const mat = obj.material[i];
                    mat.dispose();
                }
            }
        }
    };
    


    return [renderer, scene];
}
