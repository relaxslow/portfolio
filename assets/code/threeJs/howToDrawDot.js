var dotGeometry = new THREE.Geometry();
dotGeometry.vertices.push(new THREE.Vector3(0, 0, 0));
dotGeometry.vertices.push(new THREE.Vector3(5, 0, 0));

var dotMaterial = new THREE.PointsMaterial({ size: 10, sizeAttenuation: false, color: 0xff00ff });
var dot = new THREE.Points(dotGeometry, dotMaterial);
scene.add(dot);