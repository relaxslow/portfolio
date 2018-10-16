xs.init = function (module) {
    let wid = 400;
    let hei = 300;
    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(75, wid / hei, 0.1, 1000);


    xs.renderer.setSize(wid, hei);
    xs.renderer.domElement.classList.add("ThreeJsTest");
    module.div.appendChild(xs.renderer.domElement);


    var geometry = new THREE.BoxGeometry(1, 1, 1);
    var material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    var cube = new THREE.Mesh(geometry, material);
    scene.add(cube);

    camera.position.z = 5;

    var animate = function () {
        module.animationID =requestAnimationFrame(animate);
        cube.rotation.x += 0.01;
        cube.rotation.y += 0.01;

        xs.renderer.render(scene, camera);
    };

    animate();
}