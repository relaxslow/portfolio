var ballGeo = new THREE.SphereGeometry(10,35,35);
var material = new THREE.MeshPhongMaterial({color: 0xF7FE2E}); 
var ball = new THREE.Mesh(ballGeo, material);

var pendulumGeo = new THREE.CylinderGeometry(1, 1, 50, 16);
ball.updateMatrix();
pendulumGeo.merge(ball.geometry, ball.matrix);

var pendulum = new THREE.Mesh(pendulumGeo, material);
scene.add(pendulum);