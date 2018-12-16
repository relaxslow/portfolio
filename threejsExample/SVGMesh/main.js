var renderer, scene, camera;
init();
animate();
function init() {
    let bodyIndex = [];
    let paths = document.querySelectorAll("path");
    for (let i = 0; i < paths.length; i++) {
        const path = paths[i];
        if (path.classList.contains("body2"))
            bodyIndex.push(i);
    }

    var container = document.getElementById('container');
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xb0b0b0);

    camera = new THREE.PerspectiveCamera(50, container.clientWidth / container.clientHeight, 1, 1000);
    camera.position.set(0, 0, 200);

    var helper = new THREE.GridHelper(160, 10);
    helper.rotation.x = Math.PI / 2;
    scene.add(helper);

    var group = new THREE.Group();
    scene.add(group);
    var loader = new THREE.SVGLoader();
    loader.load('/assets/img/logos.svg', function (paths) {
        group.scale.multiplyScalar(0.5);
        // group.position.z=10;
        group.scale.y *= - 1;
        for (var i = 0; i < paths.length; i++) {
            var path = paths[i];
            var material = new THREE.MeshBasicMaterial({
                color: path.color,
                side: THREE.DoubleSide,
                depthWrite: false
            });
            var shapes = path.toShapes(true);
            for (var j = 0; j < shapes.length; j++) {
                var shape = shapes[j];
                var geometry = new THREE.ShapeBufferGeometry(shape);
                var mesh = new THREE.Mesh(geometry, material);
                group.add(mesh);
            }
        }

    });
    //
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);
    //
    var controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.screenSpacePanning = true;
    //

    //
    window.addEventListener('resize', onWindowResize, false);
    let button=document.querySelector(".wire");
    button.addEventListener('click', function (event) {
        event.stopPropagation();
        var group = scene.children[1];
        group.traverse(function (child) {
            if (child.material) child.material.wireframe = !child.material.wireframe;
        });
    });

    //changeColor
    document.body.addEventListener("click", clickBody)
    var colors = ["ff0000","F15A24", "EFEF26", "26EF26", "2669EF"];
    var c = 0;
    function clickBody() {
        changeSVGColor(colors[c]);
        changeMeshColor(colors[c]);
        c++;
        if (c == colors.length) {
            c = 0;
        }
    }
    function changeSVGColor(color) {
        for (let i = 0; i < bodyIndex.length; i++) {
            const body = paths[bodyIndex[i]];
            
            body.setAttribute("fill", "#"+color);
        }
    }
    function changeMeshColor(color) {
        for (let i = 0; i < bodyIndex.length; i++) {
            const path = group.children[bodyIndex[i]];
            path.material.color.setHex(parseInt(`0x${color}`));
        }
    }
}
function onWindowResize() {
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
}
function animate() {
    requestAnimationFrame(animate);
    render();
}
function render() {
    renderer.render(scene, camera);
}