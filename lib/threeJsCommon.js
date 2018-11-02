function initThree(backgroundColor) {
    let renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setClearColor(backgroundColor, 0);
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);
    var scene = new THREE.Scene();

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
let framerate = 12;
let frametime = 1000 / framerate;
function fixedUpdate() {
    let time = Data.now();
    let elapes = time - lastTime;
    while(elapes>=frametime){
        update(frametime);
        elapes-=frametime;
        lastTime+=frametime;
    }
}