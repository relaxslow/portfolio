var selectedObject = null;
let mouseEvent;
function onDocumentMouseMove(event) {
	mouseEvent = event;
	event.preventDefault();
	testIntersect();
}

var raycaster = new THREE.Raycaster();
var mouseVector = new THREE.Vector3();

function getIntersects(x, y) {

	x = (x / window.innerWidth) * 2 - 1;
	y = - (y / window.innerHeight) * 2 + 1;

	mouseVector.set(x, y, 0.5);
	raycaster.setFromCamera(mouseVector, camera);

	return raycaster.intersectObject(group, true);

}

function onDocumentMouseDown() {
	if (selectedObject) {
		console.log(selectedObject.name);
	}
}
//BEGIN

var camera, scene, renderer, stats, controls;

var mesh, group;

init();
animate();

function init() {

	camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 10000);
	camera.position.z = 1200;
	scene = new THREE.Scene();
	controls = initControl3D();
	document.body.addEventListener('mousemove', onDocumentMouseMove, false);
	document.body.addEventListener('mousedown', onDocumentMouseDown, false);


	// CUSTOM
	group = new THREE.Group();
	scene.add(group);

	let imgs = [
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
		"Zoe Saldana",
		"bob",
		"Helen-Super",
		"Jack-Jack"
	];
	let spherical = new THREE.Spherical();
	let point = new THREE.Vector3();
	function randomOnSphere(radius, PhiRange, ThetaRange) {
		let randomPhi = Math.random() * PhiRange * Math.PI / 180;
		let randomTheta = Math.random() * ThetaRange * Math.PI / 180;
		spherical.set(radius, randomPhi, randomTheta);
		point.setFromSpherical(spherical);
		return point;
	}
	function randomOnSphereEven(radius, PhiNum, thetaNum) {
		let points = [];
		phiSpan = Math.PI / (PhiNum+1);
		thetaSpan = Math.PI * 2 / thetaNum;
		// create random spherical coordinate
		for (let i = 1; i < PhiNum+1; i++) {
			phi = phiSpan * i;
			for (let j = 0; j < thetaNum; j++) {
				theta = thetaSpan * j
				spherical.set(radius, phi, theta);
				let point=new THREE.Vector3();
				point.setFromSpherical(spherical)
				points.push(point);
			}
		}
		return points;
	}
	let points= randomOnSphereEven(500,4,5);
	for (var i = 0; i < imgs.length; i++) {
		var texture = new THREE.TextureLoader().load(`/iframes/draw2D/headshot/${imgs[i]}.jpg`);
		var material = new THREE.SpriteMaterial({ map: texture, color: 0xffffff, });//sizeAttenuation: false
		// var geometry = new THREE.PlaneGeometry(1,1);
		let plane = new THREE.Sprite(material);
		plane.scale.set(200, 250, 1);
		// plane.scale.set(0.3,0.5,1)
		plane.name = imgs[i];


		plane.position.copy(points[i]);
		group.add(plane);
		// plane.position.x = Math.random() * 1000 - 500;
		// plane.position.y = Math.random() * 1000 - 500;
		// plane.position.z = Math.random() * 1000 - 500;


	}

	// LIGHTS

	var ambient = new THREE.AmbientLight(0x80ffff);
	scene.add(ambient);

	var directional = new THREE.DirectionalLight(0xffff00);
	directional.position.set(- 1, 0.5, 0);
	scene.add(directional);

	renderer = new THREE.WebGLRenderer({ alpha: true });
	renderer.setSize(window.innerWidth, window.innerHeight);

	document.body.appendChild(renderer.domElement);

	stats = new Stats();
	document.body.appendChild(stats.dom);

	window.addEventListener('resize', onWindowResize, false);

}
function faceCamera(group) {
	for (let i = 0; i < group.length; i++) {
		const plane = group[i];
		plane.quaternion.copy(camera.quaternion)
	}
}
function initMouseDown() {
	var raycaster = new THREE.Raycaster();
	var mouse = new THREE.Vector2();
	document.body.addEventListener('mousedown', function (event) {
		mouse.x = ((event.clientX - renderer.domElement.offsetLeft) / renderer.domElement.clientWidth) * 2 - 1;
		mouse.y = - ((event.clientY - renderer.domElement.offsetTop) / renderer.domElement.clientHeight) * 2 + 1;

		raycaster.setFromCamera(mouse, camera);

		intersects = raycaster.intersectObjects(group.children);

		if (intersects.length > 0) {
			let select = intersects[0].object;
			console.log("pick!!" + select.name);
			// 			selectObj(select);
		}

	}, false);
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
	group.rotation.x += 0.01;
	group.rotation.y += 0.01;
	testIntersect();
	renderer.render(scene, camera);
}
function testIntersect() {
	if (selectedObject) {

		selectedObject.material.color.set('#ffffff');
		selectedObject = null;

	}
	if (!mouseEvent) return;
	var intersects = getIntersects(mouseEvent.layerX, mouseEvent.layerY);
	if (intersects.length > 0) {

		var res = intersects.filter(function (res) {

			return res && res.object;

		})[0];

		if (res && res.object) {

			selectedObject = res.object;
			selectedObject.material.color.set('#f00');


		}

	}

}

function initControl3D() {
	let controls = new THREE.TrackballControls(camera);
	controls.rotateSpeed = 3.0;
	controls.zoomSpeed = 2;
	controls.panSpeed = 0.8;
	controls.noZoom = true;
	controls.noPan = false;
	controls.staticMoving = false;
	controls.dynamicDampingFactor = 0.2;
	controls.target.set(0, 1.5, 0);
	controls.update();
	controls.addEventListener('change', render);
	return controls;
}

