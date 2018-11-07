let Width = 600, Height = 600;
let photoWid = 200, photohei = 250;
let photoRatio = 250 / 200
let axisWid = 500, axisHei = 300;
let axisOrigin = new THREE.Vector3(700, 500);

//mouse
var selectedObject = null;
let mouseDown = false;
let mouseEvent;
function onDocumentMouseMove(event) {
	mouseEvent = event;
	event.preventDefault();
	testIntersect();
}

var raycaster = new THREE.Raycaster();
var mouseVector = new THREE.Vector3();

function getIntersects(x, y) {
	//todo
	x = (x / Width) * 2 - 1;
	y = - (y / Height) * 2 + 1;

	mouseVector.set(x, y, 0.5);
	raycaster.setFromCamera(mouseVector, camera);

	return raycaster.intersectObject(group, true);

}

function onDocumentMouseDown() {
	group.tweenX.stop();
	group.tweenY.stop();
	if (selectedObject) {
		console.log(selectedObject.name);
		// generatePictureInUICamera()
	}
}
function onDocumentMouseUp() {
	group.tweenX.start();
	group.tweenY.start();
}

let CposX = 700, CposY = 500//chart transform
function generatePictureInUICamera() {
	let [proj, scalex] = toScreenPosition(selectedObject, camera);
	scaley = scalex * photoRatio;
	let uiphoto = createPhotoMesh(selectedObject.name);
	uiphoto.position.set(proj.x, proj.y, 0);
	uiphoto.scale.set(scalex, -scaley, 1);
	sceneUI.add(uiphoto);

	let randX = Math.random() * axisWid;
	let randY = Math.random() * axisHei;
	moveToChart(uiphoto, randX, randY);


}
function moveToChart(obj, x, y) {

	let finalToX = axisOrigin.x + x;
	let finalToY = axisOrigin.y - y;
	let param = {
		x: obj.position.x,
		y: obj.position.y,
		sx: obj.scale.x,
		sy: obj.scale.y

	}
	let tween = new TWEEN.Tween(param)
		.to({ x: finalToX, y: finalToY, sx: 40, sy: -60 }, 500)
		.onUpdate(function (p) {
			obj.position.x = p.x;
			obj.position.y = p.y;
			obj.scale.x = p.sx;
			obj.scale.y = p.sy;
			render();
		})
		.start();
}
var proj = new THREE.Vector3();
let dimensionX = new THREE.Vector3();
function toScreenPosition(obj, camera) {
	// TODO: need to update this when resize window
	// var widthHalf = 0.5 * renderer.context.canvas.width;
	// var heightHalf = 0.5 * renderer.context.canvas.height;

	obj.updateMatrixWorld();
	proj.setFromMatrixPosition(obj.matrixWorld);
	dimensionX.set(proj.x + photoWid, proj.y, proj.z);
	proj.project(camera);
	dimensionX.project(camera);

	dimensionX.x = (0.5 + dimensionX.x / 2) * Width;
	dimensionX.y = (0.5 - dimensionX.y / 2) * Height;
	// vector.x = (vector.x * widthHalf) + widthHalf;
	// vector.y = - (vector.y * heightHalf) + heightHalf;
	// 	vector.x=(vector.x + 1) / 2 * window.innerWidth;
	// 	vector.y=-(vector.y - 1) / 2 * window.innerHeight;
	proj.x = (0.5 + proj.x / 2) * Width;
	proj.y = (0.5 - proj.y / 2) * Height;
	dimensionX.sub(proj);

	return [proj, dimensionX.x];

}

//BEGIN

var camera, scene, renderer, stats, controls;
let cameraUI, sceneUI;
let textures = {};
var group;

init();

let lastTime = Date.now();
loop();

function init() {
	// container = document.getElementById('scene');
	// Width = container.clientWidth;
	// Height = container.clientHeight;
	//scene
	camera = initCam3d();
	scene = new THREE.Scene();
	scene.background = 0x000000;
	controls = initControl3D();
	document.body.addEventListener('mousemove', onDocumentMouseMove, false);
	document.body.addEventListener('mousedown', onDocumentMouseDown, false);
	document.body.addEventListener('mouseup', onDocumentMouseUp, false);

	//photos
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
	function loadAllTextures(name) {
		for (let i = 0; i < imgs.length; i++) {
			let texture = new THREE.TextureLoader().load(`/iframes/draw2D/headshot/${imgs[i]}.jpg`);
			textures[imgs[i]] = texture;

		}
	}
	loadAllTextures();
	function randomOnSphere(radius, PhiRange, ThetaRange) {
		let randomPhi = Math.random() * PhiRange * Math.PI / 180;
		let randomTheta = Math.random() * ThetaRange * Math.PI / 180;
		spherical.set(radius, randomPhi, randomTheta);
		point.setFromSpherical(spherical);
		return point;
	}
	function evenOnSphere(radius, PhiNum, thetaNum) {
		let points = [];
		phiSpan = Math.PI / (PhiNum + 1);
		thetaSpan = Math.PI * 2 / thetaNum;
		for (let i = 1; i < PhiNum + 1; i++) {
			phi = phiSpan * i;
			for (let j = 0; j < thetaNum; j++) {
				theta = thetaSpan * j;
				let point = new THREE.Vector3().setFromSphericalCoords(radius, phi, theta);
				points.push(point);
			}
		}
		return points;
	}

	let points = evenOnSphere(500, 4, 5);
	for (var i = 0; i < imgs.length; i++) {
		let plane = createPhotoSprite(imgs[i]);
		plane.name = imgs[i];
		plane.position.copy(points[i]);
		group.add(plane);
		// plane.position.x = Math.random() * 1000 - 500;
		// plane.position.y = Math.random() * 1000 - 500;
		// plane.position.z = Math.random() * 1000 - 500;


	}
	// group.rotation.x += 0.005;
	// group.rotation.y -= 0.01;

	group.tweenX = new TWEEN.Tween(group.rotation)
		.to({ x: 360 }, 500000)
		.repeat(Infinity)
		.onUpdate(function () {
			render();
		})
		.start();
	group.tweenY = new TWEEN.Tween(group.rotation)
		.to({ y: 360 }, 1000000)
		.repeat(Infinity)
		.onUpdate(function () {
			render();
		})
		.start();

	// LIGHTS

	var ambient = new THREE.AmbientLight(0x80ffff);
	scene.add(ambient);

	var directional = new THREE.DirectionalLight(0xffff00);
	directional.position.set(- 1, 0.5, 0);
	scene.add(directional);

	//ui
	sceneUI = new THREE.Scene();
	sceneUI.background = 0xffffff;
	cameraUI = initCamUI();
	drawRotateTriangle(axisOrigin.x, axisOrigin.y-axisHei-20);
	drawLine();


	//sys
	renderer = new THREE.WebGLRenderer({ alpha: true });
	renderer.setClearColor(0xffffff, 0);
	document.body.appendChild(renderer.domElement);

	renderer.setSize(window.innerWidth, window.innerHeight);
	renderer.setPixelRatio(window.devicePixelRatio);
	renderer.autoClear = false;

	window.addEventListener('resize', onWindowResize, false);
	window.addEventListener("contextmenu", disableContexMenu);


	// stats = new Stats();
	// document.body.appendChild(stats.dom);

}
function createPhotoMesh(name) {
	let material = new THREE.MeshBasicMaterial({ map: textures[name], color: 0xffffff, side: THREE.DoubleSide })
	var geometry = new THREE.PlaneGeometry(1, 1);
	let plane = new THREE.Mesh(geometry, material);
	plane.scale.set(photoWid, -photohei, 1);
	return plane;

}
function createPhotoSprite(name) {
	var material = new THREE.SpriteMaterial({ map: textures[name], color: 0xffffff, });//sizeAttenuation: false
	let plane = new THREE.Sprite(material);
	plane.scale.set(photoWid, photohei, 1);
	return plane;
}
//window
function disableContexMenu(event) {
	event.preventDefault();
}
//camera
function initCam3d() {
	let camera = new THREE.PerspectiveCamera(75, Width / Height, 1, 10000);
	camera.position.z = 1200;
	return camera;
}

function initCamUI() {
	let camera = new THREE.OrthographicCamera(0, window.innerWidth, 0, window.innerHeight, 1, 1000);
	// let camera = new THREE.OrthographicCamera(-window.innerWidth / 2, window.innerWidth / 2, -window.innerHeight / 2, window.innerHeight / 2, 1, 100);
	camera.position.z = 50;
	return camera;
}
//resize
function onWindowResize() {
	resize3d.call(camera);
	resizeUI.call(cameraUI);
	renderer.setSize(window.innerWidth, window.innerHeight);

}
function resize3d() {
	this.aspect = Width / Height;
	this.updateProjectionMatrix();
}

function resizeUI() {
	// this.left = --window.innerWidth / 2;
	// this.right = window.innerWidth / 2;
	// this.top = -window.innerHeight / 2;
	// this.bottom = window.innerHeight / 2;
	this.right = window.innerWidth;
	this.bottom = window.innerHeight;
	this.updateProjectionMatrix();
}
//line
function drawLine() {
	let axis = new THREE.Group();
	axis.position.set(axisOrigin.x,axisOrigin.y, 0)
	axis.scale.set(1, -1, 1);
	sceneUI.add(axis);
	let material = new THREE.LineBasicMaterial({
		color: 0x0000ff
	});
	let geometry = new THREE.BufferGeometry();
	var points = [];
	points.push(0, 0, 0, axisWid, 0, 0);
	geometry.addAttribute('position', new THREE.Float32BufferAttribute(points, 3));
	let object = new THREE.Line(geometry, material);
	axis.add(object);

	geometry = new THREE.BufferGeometry();
	points = [];
	points.push(0, 0, 0, 0, axisHei, 0);
	geometry.addAttribute('position', new THREE.Float32BufferAttribute(points, 3));
	object = new THREE.Line(geometry, material);
	axis.add(object);
}
function drawRotateTriangle(x, y) {
	let [root, triangle] = drawBasicTriangle();
	sceneUI.add(root)


	root.position.set(x, y, 0);

	new TWEEN.Tween(triangle.rotation)
		.to({ y: 360 }, 100000)
		.repeat(Infinity)
		.onUpdate(function () {
			render();
		})
		.start();
}
function drawBasicTriangle() {
	let group = new THREE.Group();
	// let origin=drawOrigin();
	// group.add(origin);
	let triangleGeometry = new THREE.Geometry();
	triangleGeometry.vertices.push(
		new THREE.Vector3(0.0, 1.0, 0.0),
		new THREE.Vector3(-1.0, -1.0, 0.0),
		new THREE.Vector3(1.0, -1.0, 0.0)
	);
	triangleGeometry.faces.push(new THREE.Face3(0, 1, 2));
	triangleGeometry.faces[0].vertexColors.push(
		new THREE.Color(0xFF0000),
		new THREE.Color(0x00FF00),
		new THREE.Color(0x0000FF)
	);

	var triangleMaterial = new THREE.MeshBasicMaterial({
		vertexColors: THREE.VertexColors,
		// color: 0x00ff00,
		side: THREE.DoubleSide
	});
	var triangleMesh = new THREE.Mesh(triangleGeometry, triangleMaterial);
	group.add(triangleMesh);

	triangleMesh.scale.set(10, 10, 1);
	triangleMesh.name = "triangle";
	// triangleMesh.matrixAutoUpdate = false;
	// sceneUI.add(group)
	// allObjs[triangleMesh.name] = triangleMesh;
	return [group, triangleMesh];
	//     rotateMesh(triangleMesh,20);
}
// function faceCamera(group) {
// 	for (let i = 0; i < group.length; i++) {
// 		const plane = group[i];
// 		plane.quaternion.copy(camera.quaternion)
// 	}
// }


//loop
function loop() {
	requestAnimationFrame(loop);
	let now = Date.now();
	let delta = now - lastTime;
	update(delta)
	render();

	lastTime = now;
}
function update(delta) {
	// stats.update();
	controls.update();
	TWEEN.update();
	testIntersect();
}
function render() {
	renderer.clear()
	renderer.setViewport(0, 0, Width, Height);
	renderer.render(scene, camera);
	renderer.clearDepth();
	renderer.setViewport(0, 0, window.innerWidth, window.innerHeight);
	renderer.render(sceneUI, cameraUI);
}
function testIntersect() {
	if (selectedObject) {

		selectedObject.material.color.set('#ffffff');
		selectedObject = null;

	}
	if (!mouseEvent) return;
	var intersects = getIntersects(mouseEvent.clientX, mouseEvent.clientY);
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

