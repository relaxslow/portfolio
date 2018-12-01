//button
let bubbleBut = document.querySelector(".control .bubble");
let barBut = document.querySelector(".control .bar");
let ballBut = document.querySelector(".control .ball");


bubbleBut.addEventListener("click", clickBubbleButton);
barBut.addEventListener("click", clickBarButton);
ballBut.addEventListener("click", clickBallButton);

//tip
let tipPanel = document.getElementById("tip");
function updateTip(x, y) {
	moveTipPanel(x, y);
	changeInfo();

}

//info
function changeInfo() {
	let name = tipPanel.getElementsByClassName("name")[0];
	let experience = tipPanel.getElementsByClassName("experience")[0];
	let education = tipPanel.getElementsByClassName("education")[0];
	let salary = tipPanel.getElementsByClassName("salary")[0];
	name.innerHTML = selectedObject.name;
	experience.innerHTML = personsInfo[selectedObject.index].workingExp;
	education.innerHTML = personsInfo[selectedObject.index].education;
	salary.innerHTML = personsInfo[selectedObject.index].salary;
}
function showTip() {
	tipPanel.style.visibility = "visible";
}
function hideTip() {
	tipPanel.style.visibility = "hidden";
}
function moveTipPanel(x, y) {
	tipPanel.style.left = `${x}px`;
	tipPanel.style.top = `${y}px`;
}
var selectedObject = null;
let mouseEvent;
let mousedown;
function BallControl() {
	scene3dDiv.addEventListener('mousemove', onMousemove, false);
	scene3dDiv.addEventListener('mousedown', onMousedown, false);
	scene3dDiv.addEventListener('mouseup', onMouseup, false);

	let buttonHei = 50;
	function onMousemove(event) {
		event.preventDefault();

		let inBallArea = testMouseInArea(event, 0, 0, Width, Height);
		if (!inBallArea)
			mouseEvent = null;
		else
			mouseEvent = event;
		testIntersect();
		if (selectedObject) {
			showTip();
			updateTip(event.clientX, event.clientY);
		} else {
			hideTip();
		}
	}
	function onMousedown(event) {
		mousedown = true;
		if (showStatus === "showBall" && atBegin) {
			let inBallArea = testMouseInArea(event, 0, buttonHei, Width, Height);
			if (!inBallArea) {
				controls.enabled = false;
				return;
			} else {
				controls.enabled = true;
				event.preventDefault();
				removeRotation();
				// 				if (selectedObject) {
				// 					showTip();
				// 					updateTip(event.clientX, event.clientY);
				// 				}
			}
		}
	}
	function onMouseup(event) {
		mousedown = false;
		if (showStatus === "showBall" && atBegin) {
			let inBallArea = testMouseInArea(event, 0, buttonHei, Width, Height);
			if (inBallArea) {
				restartRotation();
				controls.enabled = false;
			}
		}
	}
}
let Axis = {}
Axis.x = new THREE.Vector3(1, 0, 0);
Axis.y = new THREE.Vector3(0, 1, 0);
Axis.z = new THREE.Vector3(0, 0, 1);
oMat = new THREE.Matrix4();
quaternion = new THREE.Quaternion();
function rotate(axis, angle) {
	let radian = angle * Math.PI / 180;
	quaternion.setFromAxisAngle(axis, radian);
	oMat.makeRotationFromQuaternion(quaternion);
	this.applyMatrix(oMat);
}

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
let personsInfo = [
	{
		education: "Master",
		workingExp: 5,
		salary: 3000
	},
	{
		education: "Bachelor",
		workingExp: 2,
		salary: 2000
	},
	{
		education: "PhD",
		workingExp: 1,
		salary: 1234
	},
	{
		education: "Master",
		workingExp: 4,
		salary: 5604
	},
	{
		education: "Master",
		workingExp: 0.4,
		salary: 2357
	},
	{
		education: "PhD",
		workingExp: 8,
		salary: 6943
	},
	{
		education: "Bachelor",
		workingExp: 2.4,
		salary: 4320
	},
	{
		education: "Master",
		workingExp: 7,
		salary: 2934
	},
	{
		education: "Master",
		workingExp: 15,
		salary: 6704
	},
	{
		education: "Master",
		workingExp: 1.5,
		salary: 5930
	},
	{
		education: "PhD",
		workingExp: 0.8,
		salary: 8604
	},
	{
		education: "PhD",
		workingExp: 4,
		salary: 5964
	},
	{
		education: "Bachelor",
		workingExp: 7,
		salary: 3495
	},
	{
		education: "Master",
		workingExp: 2.3,
		salary: 9543
	},
	{
		education: "Master",
		workingExp: 6,
		salary: 4839
	},
	{
		education: "Master",
		workingExp: 3.6,
		salary: 3945
	},
	{
		education: "PhD",
		workingExp: 5.4,
		salary: 1543
	},
	{
		education: "Bachelor",
		workingExp: 5,
		salary: 5694
	},
	{
		education: "Master",
		workingExp: 8,
		salary: 1293
	},
	{
		education: "PhD",
		workingExp: 10,
		salary: 4303
	},
]
function topSalary() {
	let result = [];
	result.push([0, personsInfo[0].salary]);
	for (let i = 1; i < personsInfo.length; i++) {
		let s = personsInfo[i].salary;
		let done = false;
		for (let j = 0; j < result.length; j++) {
			if (s <= result[j][1]) {
				continue;
			}
			else if (s > result[j][1]) {
				result.splice(j, 0, [i, s]);
				done = true;
				break;
			}
		}
		if (!done)
			result.push([i, s]);//index, salary
	}
	return result;
}
let section_workingExp = [
	[0, 1, 0, 100],
	[1, 3, 100, 200],
	[3, 5, 200, 300],
	[5, 10, 300, 400],
	[10, 15, 400, 500]
];
function getWorkingExpSection(year) {
	for (let i = 0; i < section_workingExp.length; i++) {
		let [low, high, min, max] = section_workingExp[i];
		if (year >= low && year <= high) {
			return [min, max];
		}
	}
}
let section_education = [
	["Bachelor", 0, 100],
	["Master", 100, 200],
	["PhD", 200, 300]
];

//param
let scene3dDiv = document.getElementById("scene3d");
let viewBeginX = 50, viewBeginY = 0;
let Width = 500, Height = 500;
let AreaWid = 600, AreaHei = 600;
let photoWid = 200, photohei = 250;//inBall
let photoRatio = 250 / 200
let axisWid = 500, axisHei = 300;
let axisOrigin = new THREE.Vector3(80, 400);
let showStatus = "showBall";

//content
let content = document.getElementsByClassName("content")[0];
content.style.left = `${axisOrigin.x}px`;
content.style.top = `${axisOrigin.y - 390}px`;
let atBegin = true;
let contentBall = document.querySelector(".content .ball");
let contentBubble = document.querySelector(".content .bubble");
let contentBar = document.querySelector(".content .bar");
contentBall.style.visibility = "visible";
contentBubble.style.visibility = "hidden";
contentBar.style.visibility = "hidden";

let bubbleWid = 20, bubbleHei = 30;
let barWid = 400;
let sortSalary = topSalary();

initBar();

function disableBallMove() {
	controls.enabled = false;
	removeRotation();
}
function clickBubbleButton() {

	// console.log("analyze!");
	// clearBallVars();
	disableBallMove();
	if (showStatus != "showBubble") {
		if (showStatus === "showBar") {
			// Events.remove(barAniEvt);
			flyAllFromBarToBubble();
		}
		else if (showStatus === "showBall") {
			flyAllFromBallToBubble();
		}
		showAxis();

		showStatus = "showBubble";
		atBegin = false;
	}
}
function showAxis() {
	contentBall.style.visibility = "hidden";
	contentBubble.style.visibility = "visible";
	contentBar.style.visibility = "hidden";
	// loadHtml(content, "/iframes/data524/rotatePhoto/bubbleAxis");
}


// let barAniEvt = { condition: { htmlOk: false, flyOk: false }, fun: animateBar };

function clickBarButton() {
	disableBallMove()
	if (showStatus != "showBar") {
		if (showStatus === "showBall") {
			contentBall.style.visibility = "hidden";
			flyAllFromBallToBar();
		} else if (showStatus === "showBubble") {
			contentBubble.style.visibility = "hidden";
			flyAllFromBubbleToBar();
		}
		atBegin = false;
		// Events.add(barAniEvt);




		showStatus = "showBar";
	}
}
function showBar() {
	contentBar.style.visibility = "visible";
	animateBar();
	// loadHtml(content, "/iframes/data524/rotatePhoto/top10Salary", function () {
	// 	initBar();
	// 	Events.setConditionOk(barAniEvt, "htmlOk");
	// });
}
function initBar() {
	let firstBar = content.getElementsByClassName("horizontalBar")[0];
	firstBar.index = sortSalary[0][0];
	y = 77;
	x = 33;
	firstBar.style.top = y + "px";
	firstBar.style.left = x + "px";
	firstBar.style.width = "0px";
	//build all other bars
	for (let i = 1; i < 10; i++) {
		let newBar = firstBar.cloneNode(true);
		newBar.index = sortSalary[i][0];
		firstBar.parentNode.appendChild(newBar);
		y += bubbleHei;
		newBar.style.top = y + "px";
		newBar.style.width = "0px";


	}
}
function animateBar() {
	let allBar = content.getElementsByClassName("horizontalBar");
	for (let i = 0; i < allBar.length; i++) {
		let bar = allBar[i];
		let wid = sortSalary[i][1] / sortSalary[0][1] * barWid;
		bar.style.width = "0px";
		let text = bar.getElementsByClassName("SalaryText")[0];
		text.innerHTML = "";
		bar.offsetWidth;

		bar.style.transition = `width 1s ease-in-out`;//transition must after offsetWidth trigger
		bar.addEventListener("transitionend", barTransitionEnd, false);
		bar.style.width = `${wid}px`;


		// //or // getComputedStyle(element).opacity;




	}
}
function barTransitionEnd(event) {
	let bar = event.currentTarget;
	let text = bar.getElementsByClassName("SalaryText")[0];
	text.innerHTML = `$ ${personsInfo[bar.index].salary}`;
	bar.style.transition = "";
	bar.removeEventListener("transitionend", barTransitionEnd);
}



function clickBallButton() {
	if (showStatus != "showBall") {
		showStatus = "showBall";
		flyAllToBall();
		showBallContent();

		// loadHtml(content, "/iframes/data524/rotatePhoto/ball");

	}
}
function showBallContent() {
	contentBall.style.visibility = "visible";
	contentBubble.style.visibility = "hidden";
	contentBar.style.visibility = "hidden";
}

function getEducationSection(degree) {
	for (let i = 0; i < section_education.length; i++) {
		let [degreeName, min, max] = section_education[i];
		if (degree === degreeName) {
			return [min, max];
		}
	}
}

function flyAllFromBubbleToBar() {
	toBar(toBarEnd);

}
function toBarEnd() {
	showBar();
	// Events.setConditionOk(barAniEvt, "flyOk");
}
function toBar(endFun) {
	let visibleGroup = [];
	let x = axisOrigin.x + bubbleWid / 2 + 10;
	let y = axisOrigin.y - 300;
	for (let i = 0; i < 10; i++) {
		let index = sortSalary[i][0];
		let uiphoto = UIPhotoGroup.children[index];
		moveToChart(uiphoto, x, y, endFun);
		y += bubbleHei;
		visibleGroup.push(index);
	}

	for (let i = 0; i < UIPhotoGroup.children.length; i++) {
		UIPhotoGroup.children[i].visible = false;
		for (let j = 0; j < visibleGroup.length; j++) {
			if (i == visibleGroup[j]) {
				UIPhotoGroup.children[i].visible = true;
				break;
			}
		}

	}

}
function flyAllFromBallToBar() {
	showUIphoto();
	toBar(toBarEnd);
	photoGroup.visible = false;
	removeRotation();
}
function flyAllFromBarToBubble() {
	toBubble();
}
function toBubble() {
	for (let i = 0; i < UIPhotoGroup.children.length; i++) {
		let uiphoto = UIPhotoGroup.children[i];
		uiphoto.visible = true;
		let year = personsInfo[uiphoto.index].workingExp;
		let degree = personsInfo[uiphoto.index].education;
		let [workingExpMin, workingExpMax] = getWorkingExpSection(year);
		let [educationMin, educationMax] = getEducationSection(degree)
		let randX = bubbleWid / 2 + workingExpMin + Math.random() * (workingExpMax - workingExpMin - bubbleWid);
		let randY = bubbleHei / 2 + educationMin + Math.random() * (educationMax - educationMin - bubbleHei);
		let finalx = axisOrigin.x + randX;
		let finaly = axisOrigin.y - randY;

		moveToChart(uiphoto, finalx, finaly);
	}
}
function flyAllFromBallToBubble() {
	showUIphoto();
	toBubble();
	photoGroup.visible = false;
	removeRotation();

}

function flyAllToBall() {
	let finishCount = 0;
	for (let i = 0; i < UIPhotoGroup.children.length; i++) {
		let uiphoto = UIPhotoGroup.children[i];

		let param = {
			x: uiphoto.position.x,
			y: uiphoto.position.y,
			sx: uiphoto.scale.x,
			sy: uiphoto.scale.y

		}
		let tween = new TWEEN.Tween(param)
			.to({
				x: uiphoto.originPosX,
				y: uiphoto.originPosY,
				sx: uiphoto.originScaleX,
				sy: uiphoto.originScaleY
			}, 500)
			.onUpdate(function (p) {
				uiphoto.position.x = p.x;
				uiphoto.position.y = p.y;
				uiphoto.scale.x = p.sx;
				uiphoto.scale.y = p.sy;
				render();
			})
			.onComplete(function (obj) {
				if (showStatus != "showBall") return;
				finishCount++;
				if (finishCount == UIPhotoGroup.children.length) {
					showBall();
				}



			})
			.start();
	}
}
function showBall() {
	UIPhotoGroup.visible = false;
	photoGroup.visible = true;
	restartRotation();
	atBegin = true;
}

//mouse

function onDocumentMouseMove(event) {
	// 	if (mouseOnButton) return;
	//if mouse out of border, mouseEvent=null



}

function testIntersect() {
	if (showStatus !== "showBall") return;
	if (!mouseEvent) return;
	if (selectedObject) {
		selectedObject.material.color.set('#ffffff');
		selectedObject = null;
	}
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
	if (selectedObject)
		changeInfo();
	// displaySelectPhotoInfo();
}

function testMouseInArea(event, beginX, beginY, endX, endY) {
	let x = event.clientX, y = event.clientY;
	// console.log(x,y);
	if (x < beginX || x > endX || y < beginY || y > endY)
		return false;
	return true;
}
var raycaster = new THREE.Raycaster();
var mouseVector = new THREE.Vector3();

function getIntersects(x, y) {
	//todo
	x = ((x - viewBeginX) / Width) * 2 - 1;
	y = - ((y - viewBeginY) / Height) * 2 + 1;

	mouseVector.set(x, y, 0.5);
	raycaster.setFromCamera(mouseVector, camera);

	return raycaster.intersectObject(photoGroup, true);

}



let UIPhotoGroup;
function initAllUIPhotos() {
	UIPhotoGroup = new THREE.Group();
	sceneUI.add(UIPhotoGroup);
	for (let i = 0; i < photoGroup.children.length; i++) {
		let photo = photoGroup.children[i];
		let uiphoto = createPhotoMesh(photo.name);
		UIPhotoGroup.add(uiphoto);
		uiphoto.index = photo.index;
		uiphoto.name = photo.name;
		photo.uiphoto = uiphoto;
	}
	UIPhotoGroup.visible = false;
}

function showUIphoto() {
	if (atBegin == true) {
		UIPhotoGroup.visible = true;
		for (let i = 0; i < photoGroup.children.length; i++) {// 
			let photo = photoGroup.children[i];
			let [proj, scalex, depth] = toScreenPosition(photo, camera);
			scaley = scalex * photoRatio;
			let uiphoto = photo.uiphoto;
			uiphoto.position.set(proj.x, proj.y, depth);
			uiphoto.scale.set(scalex, -scaley, 1);
			uiphoto.originScaleX = scalex;
			uiphoto.originScaleY = -scaley;

			uiphoto.originPosX = proj.x;
			uiphoto.originPosY = proj.y;
		}
	}





}

function moveToChart(obj, finalx, finaly, fun) {
	let param = {
		x: obj.position.x,
		y: obj.position.y,
		sx: obj.scale.x,
		sy: obj.scale.y

	}
	let tween = new TWEEN.Tween(param)
		.to({ x: finalx, y: finaly, sx: bubbleWid, sy: -bubbleHei }, 500)
		.easing(TWEEN.Easing.Quadratic.In)
		.onUpdate(function (p) {
			obj.position.x = p.x;
			obj.position.y = p.y;
			obj.scale.x = p.sx;
			obj.scale.y = p.sy;
			render();
		})
		.onComplete(function () {
			tween.stop();
			if (fun)
				fun();
		})

		.start();
}
var proj = new THREE.Vector3();
let dimensionX = new THREE.Vector3();
let size = new THREE.Vector3(photoWid, 0, 0);
let offset = new THREE.Vector3(1, 1, 0);
function toScreenPosition(obj, camera) {
	dimensionX.set(size.x, size.y, size.z);
	dimensionX.applyQuaternion(camera.quaternion);

	obj.updateMatrixWorld();
	proj.setFromMatrixPosition(obj.matrixWorld);

	dimensionX.add(proj);

	proj.project(camera);
	let depth = (1 - proj.z) * 10000;
	// console.log(depth);
	dimensionX.project(camera);

	convertTo01(dimensionX);
	convertTo01(proj)
	dimensionX.sub(proj);
	proj.x += viewBeginX;
	proj.y += viewBeginY;
	return [proj, Math.abs(dimensionX.x), depth];

}
function convertTo01(vector) {
	vector.x = (vector.x + 1) * Width / 2;
	vector.y = - (vector.y - 1) * Height / 2;
	vector.z = 0;
	return vector;
}
//scene

var camera, scene, renderer, stats, controls;
let cameraUI, sceneUI;
let textures = {};
var photoGroup;
function restartRotation() {
	photoGroup.tweenX.start();
	photoGroup.tweenY.start();
}
function addRotation() {
	photoGroup.tweenX = new TWEEN.Tween(photoGroup.rotation)
		.to({ x: 360 }, 500000)
		.repeat(Infinity)
		.onUpdate(function () {
			render();
		})
		.start();
	photoGroup.tweenY = new TWEEN.Tween(photoGroup.rotation)
		.to({ y: 360 }, 1000000)
		.repeat(Infinity)
		.onUpdate(function () {
			render();
		})
		.start();
}
function removeRotation() {
	photoGroup.tweenX.stop();
	photoGroup.tweenY.stop();
}
init();

let lastTime = Date.now();
loop();

function init() {

	//scene
	camera = initCam3d();
	scene = new THREE.Scene();
	scene.background = 0x000000;

	//photos
	photoGroup = new THREE.Group();
	scene.add(photoGroup);
	controls = initControl3D();
	BallControl();
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
	for (var i = 0; i < imgs.length; i++) {//
		let plane = createPhotoSprite(imgs[i]);
		plane.name = imgs[i];
		plane.position.copy(points[i]);
		plane.index = photoGroup.children.length;
		photoGroup.add(plane);
		// plane.position.x = Math.random() * 1000 - 500;
		// plane.position.y = Math.random() * 1000 - 500;
		// plane.position.z = Math.random() * 1000 - 500;


	}
	addRotation();

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
	drawRotateTriangle(axisOrigin.x, axisOrigin.y - axisHei - 20);
	initAllUIPhotos();
	// loadHtml(content, "/iframes/data524/rotatePhoto/ball")

	loadHtml(tipPanel, "/iframes/data524/rotatePhoto/detailInfo");
	tipPanel.style.visibility = "hidden";

	//sys
	renderer = new THREE.WebGLRenderer({ alpha: true });
	renderer.setClearColor(0xffffff, 0);
	scene3dDiv.appendChild(renderer.domElement);

	renderer.setSize(AreaWid, AreaHei);
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
	// let camera = new THREE.OrthographicCamera(UIBeginX, window.innerWidth - UIBeginX, UIBeginY, window.innerHeight - UIBeginY, 1, 1000);
	// let camera = new THREE.OrthographicCamera(-window.innerWidth / 2, window.innerWidth / 2, -window.innerHeight / 2, window.innerHeight / 2, 1, 100);
	camera.position.z = 200;
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
	axis.position.set(axisOrigin.x, axisOrigin.y, 0)
	axis.scale.set(1, -1, 1);
	axis.name = "axis"
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
	root.name = "rotating Triangle"
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
	Events.update();
	controls.update();
	TWEEN.update();
	testIntersect();
}
function render() {
	renderer.clear()
	renderer.setViewport(viewBeginX, viewBeginY, Width, Height);
	renderer.render(scene, camera);
	renderer.clearDepth();
	renderer.setViewport(0, 0, window.innerWidth, window.innerHeight);
	renderer.render(sceneUI, cameraUI);
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
