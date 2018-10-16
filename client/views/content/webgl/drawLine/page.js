xs.init = function (module) {
    let wid = 200;
    let hei = 200;
    xs.resetThreeJs();
    xs.renderer.setSize(wid, hei);
    xs.renderer.domElement.classList.add("threeJsDrawLine");
    module.div.appendChild(xs.renderer.domElement);

    var camera = new THREE.PerspectiveCamera(45, wid / hei, 1, 500);
    camera.position.set(0, 0, 100);
    camera.lookAt(0, 0, 0);

    var scene = new THREE.Scene();

    var material = new THREE.LineBasicMaterial({ color: 0x0000ff });

    var geometry = new THREE.Geometry();
    geometry.vertices.push(new THREE.Vector3(-10, 0, 0));
    geometry.vertices.push(new THREE.Vector3(0, 10, 0));
    geometry.vertices.push(new THREE.Vector3(10, 0, 0));

    var line = new THREE.Line(geometry, material);

    scene.add(line);
    xs.renderer.render(scene, camera);
}