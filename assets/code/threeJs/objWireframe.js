var geo = new THREE.EdgesGeometry(mesh.geometry); // or WireframeGeometry
var mat = new THREE.LineBasicMaterial({ color: 0x777777, linewidth: 1 });
var wireframe = new THREE.LineSegments(geo, mat);

scene.add(wireframe); //only display wireframe

//##display wireframe on mesh
//mesh.add(wireframe);
//scene.add(mesh);