window.start=function (data){
    let [renderer, scene] = initThree(0xffffff);

    var camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 500);
    camera.position.set(0, 40, 20);
    camera.lookAt(0, 0, 0);
    
    var material = new THREE.LineBasicMaterial({ linewidth: 3, color: 0x0000ff });
    var geometry = new THREE.Geometry();
    geometry.vertices.push(new THREE.Vector3(-10, 0, 0));
    geometry.vertices.push(new THREE.Vector3(0, 10, 0));
    geometry.vertices.push(new THREE.Vector3(10, 0, 0));
    var line = new THREE.Line(geometry, material);
    scene.add(line);
    
    //draw point
    var dotGeometry = new THREE.Geometry();
    dotGeometry.vertices.push(new THREE.Vector3(0, 0, 0));
    dotGeometry.vertices.push(new THREE.Vector3(5, 0, 0));
    
    var dotMaterial = new THREE.PointsMaterial({ size: 10, sizeAttenuation: false, color: 0xff00ff });
    var dot = new THREE.Points(dotGeometry, dotMaterial);
    scene.add(dot);
    
    renderer.render(scene, camera);
}



