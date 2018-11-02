var camera, scene, renderer, stats, controls;

var mesh, group, svgGroup;

init();
animate();

function init() {

	camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 10000);
	camera.position.z = 500;

	scene = new THREE.Scene();
	scene.fog = new THREE.FogExp2(0xffff00, 0.0025);
	scene.background = new THREE.Color(0xf0f0f0);
	controls = initControl3D();
	// QRCODE

	// var loader = new THREE.JSONLoader();
	// loader.load( 'models/json/QRCode.json', function ( geometry) {

	// 	mesh = new THREE.Mesh( geometry, new THREE.MeshLambertMaterial( { /*emissive: 0xff0000,*/ vertexColors: THREE.FaceColors } ) );
	// 	mesh.scale.x = mesh.scale.y = mesh.scale.z = 2;
	// 	scene.add( mesh );

	// } );

	// CUBES

	// var cube = new THREE.BoxBufferGeometry( 100, 100, 100 );

	// mesh = new THREE.Mesh( cube, new THREE.MeshBasicMaterial( { color: 0x0000ff, opacity: 0.5, transparent: true } ) );
	// mesh.position.x = 500;
	// mesh.rotation.x = Math.random();
	// mesh.rotation.y = Math.random();
	// mesh.scale.x = mesh.scale.y = mesh.scale.z = 2;
	// scene.add( mesh );

	// mesh = new THREE.Mesh( cube, new THREE.MeshBasicMaterial( { color: Math.random() * 0xffffff } ) );
	// mesh.position.x = 500;
	// mesh.position.y = 500;
	// mesh.rotation.x = Math.random();
	// mesh.rotation.y = Math.random();
	// mesh.scale.x = mesh.scale.y = mesh.scale.z = 2;
	// scene.add( mesh );

	// // PLANE

	// mesh = new THREE.Mesh( new THREE.PlaneBufferGeometry( 100, 100 ), new THREE.MeshBasicMaterial( { color: Math.random() * 0xffffff, side: THREE.DoubleSide } ) );
	// mesh.position.y = -500;
	// mesh.scale.x = mesh.scale.y = mesh.scale.z = 2;
	// scene.add( mesh );

	// // CYLINDER

	// mesh = new THREE.Mesh( new THREE.CylinderBufferGeometry( 20, 100, 200, 10 ), new THREE.MeshBasicMaterial( { color: Math.random() * 0xffffff } ) );
	// mesh.position.x = -500;
	// mesh.rotation.x = - Math.PI / 2;
	// mesh.scale.x = mesh.scale.y = mesh.scale.z = 2;
	// scene.add( mesh );

	// POLYFIELD

	// 	var geometry = new THREE.Geometry();
	// 	var material = new THREE.MeshBasicMaterial({ vertexColors: THREE.FaceColors, side: THREE.DoubleSide });

	// 	for (var i = 0; i < 100; i++) {

	// 		var v = new THREE.Vector3(
	// 			Math.random() * 1000 - 500,
	// 			Math.random() * 1000 - 500,
	// 			Math.random() * 1000 - 500
	// 		);

	// 		var v0 = new THREE.Vector3(
	// 			Math.random() * 100 - 50,
	// 			Math.random() * 100 - 50,
	// 			Math.random() * 100 - 50
	// 		);

	// 		var v1 = new THREE.Vector3(
	// 			Math.random() * 100 - 50,
	// 			Math.random() * 100 - 50,
	// 			Math.random() * 100 - 50
	// 		);

	// 		var v2 = new THREE.Vector3(
	// 			Math.random() * 100 - 50,
	// 			Math.random() * 100 - 50,
	// 			Math.random() * 100 - 50
	// 		);

	// 		v0.add(v);
	// 		v1.add(v);
	// 		v2.add(v);

	// 		var face = new THREE.Face3(
	// 			geometry.vertices.push(v0) - 1,
	// 			geometry.vertices.push(v1) - 1,
	// 			geometry.vertices.push(v2) - 1,
	// 			null,
	// 			new THREE.Color(Math.random() * 0xffffff)
	// 		);

	// 		geometry.faces.push(face);

	// 	}

	// 	geometry.computeFaceNormals();

	// 	group = new THREE.Mesh(geometry, material);
	// 	group.scale.set(2, 2, 2);
	// 	scene.add(group);

	// SPRITES

	// for ( var i = 0; i < 50; i ++ ) {

	// 	var material = new THREE.SpriteMaterial( { color: Math.random() * 0xffffff } );
	// 	var sprite = new THREE.Sprite( material );
	// 	sprite.position.x = Math.random() * 1000 - 500;
	// 	sprite.position.y = Math.random() * 1000 - 500;
	// 	sprite.position.z = Math.random() * 1000 - 500;
	// 	sprite.scale.set( 64, 64, 1 );
	// 	scene.add( sprite );

	// }

	// CUSTOM
	svgGroup = new THREE.Group();
	scene.add(svgGroup);

	// var node = document.createElementNS(, 'circle');
	// 				node.setAttribute( 'stroke', 'black' );
	// node.setAttribute('fill', 'red');
	// node.setAttribute('r', '20');

	// var headshot = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
	// 	headshot.setAttributeNS('http://www.w3.org/2000/svg', 'xlink', 'http://www.w3.org/1999/xlink');
	// headshot.setAttribute('height', '30');
	// headshot.setAttribute('width', '40');
	// svg.setAttributeNS('http://www.w3.org/2000/svg', 'id', 'test2');

	var svgImg = document.createElementNS('http://www.w3.org/2000/svg', 'image');
	svgImg.setAttribute('height', '100');
	svgImg.setAttribute('width', '150');
	svgImg.setAttribute('x', '0');
	svgImg.setAttribute('y', '0');

	// headshot.appendChild(svgimg);
	// var rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect')
	// rect.setAttributeNS(null, 'width', 30)
	// rect.setAttributeNS(null, 'height', 40)
	// rect.setAttributeNS(null, 'fill', '#f06')

	let imgs=[
		"AlfieAllen",
		"ChrisPratt",
		"EmiliaClarke",
		"Eugene Simon",
		"IsaacHempsteadWright",
		"Iwan Rheon",
		"Jack Gleeson",
		"KitHairington",
		"LenaHeadey",
		"LiamCunningham",
		"MaisieWilliams",
		"NatalieDormer",
		"NikolajCoster-Waldau",
		"PeterDinklage",
		"SophieTurner",
		"Stephen Dillane",
		"Zoe Saldana"
	];
	for (var i = 0; i < imgs.length; i++) {
		let headshot = svgImg.cloneNode();
		headshot.setAttribute('href', `/iframes/draw2D/headshot/${imgs[i]}.jpg`);

		var object = new THREE.SVGObject(headshot);
		object.position.x = Math.random() * 1000 - 500;
		object.position.y = Math.random() * 1000 - 500;
		object.position.z = Math.random() * 1000 - 500;
		svgGroup.add(object);

	}

	// LIGHTS

	var ambient = new THREE.AmbientLight(0x80ffff);
	scene.add(ambient);

	var directional = new THREE.DirectionalLight(0xffff00);
	directional.position.set(- 1, 0.5, 0);
	scene.add(directional);

	renderer = new THREE.SVGRenderer();
	renderer.setSize(window.innerWidth, window.innerHeight);
	renderer.setQuality('low');
	document.body.appendChild(renderer.domElement);

	stats = new Stats();
	document.body.appendChild(stats.dom);

	//

	window.addEventListener('resize', onWindowResize, false);

}

function onWindowResize() {

	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();

	renderer.setSize(window.innerWidth, window.innerHeight);

}

//

function animate() {

	requestAnimationFrame(animate);

	render();
	stats.update();
	controls.update();
}

function render() {

	var time = Date.now() * 0.0002;

	// 				camera.position.x = Math.sin( time ) * 500;
	// 				camera.position.z = Math.cos( time ) * 500;
	// 				camera.lookAt( scene.position );
	// 	group.rotation.y += 0.01;
	svgGroup.rotation.y += 0.01;

	renderer.render(scene, camera);

}


function initControl3D() {
	let controls = new THREE.TrackballControls(camera);
	controls.rotateSpeed = 3.0;
	controls.zoomSpeed = 2;
	controls.panSpeed = 0.8;
	controls.noZoom = false;
	controls.noPan = false;
	controls.staticMoving = false;
	controls.dynamicDampingFactor = 0.2;
	controls.target.set(0, 1.5, 0);
	controls.update();
	controls.addEventListener('change', render);
	return controls;
}