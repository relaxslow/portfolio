let backgroundColor = 0x000000;
let renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
renderer.setClearColor(backgroundColor, 0);
renderer.setClearAlpha(0);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.autoClear = false;
document.body.appendChild(renderer.domElement);

function cleanMeshes(obj) {
    if (obj instanceof THREE.Mesh) {
        obj.geometry.dispose();
        for (let i = 0; i < obj.material.length; i++) {
            const mat = obj.material[i];
            mat.dispose();
        }
    }
}
document.body.onunload = function () {
    // cancelAnimationFrame(window.animationID);
    scene.traverse(cleanMeshes);
};

window.addEventListener('resize', onWindowResize, false);
function onWindowResize() {
    camera.resize();
    cameraUI.resize();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderScene();
}

function renderScene() {
    renderer.clear()
    renderer.render(scene, camera);
    renderer.clearDepth();
    renderer.render(sceneUI, cameraUI);
}
function loop() {
    animate()
    requestAnimationFrame(loop);
    controls.update();
};
let oMat = new THREE.Matrix4();
let quaternion = new THREE.Quaternion();
let angle = 1;
let axis = new THREE.Vector3(0, 1, 0);
function rotateMesh(mesh) {
    oMat.identity();
    quaternion.setFromAxisAngle(axis, angle * Math.PI / 180);
    oMat.makeRotationFromQuaternion(quaternion);
    mesh.applyMatrix(oMat);
}
function animate() {
    triangle = scene.allobjs["triangle"];
    rotateMesh(triangle);
    // triangle.rotation.y += 0.1; 

    renderScene();
}
let camera3d = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
camera3d.position.set(3.8, 3.8, 3.8);
camera3d.lookAt(new THREE.Vector3(0, 0, 0));
camera3d.resize = function () {
    this.aspect = window.innerWidth / window.innerHeight;
    this.updateProjectionMatrix();
}
let controls = new THREE.TrackballControls(camera3d);
controls.rotateSpeed = 3.0;
controls.zoomSpeed = 2;
controls.panSpeed = 0.8;
controls.noZoom = false;
controls.noPan = false;
controls.staticMoving = false;
controls.dynamicDampingFactor = 0.2;
controls.target.set(0, 1.5, 0);
controls.update();
controls.addEventListener('change', renderScene);

document.body.addEventListener("keydown", keyDown, false);
function keyDown(event) {

    let keyCode = event.which;
    if (keyCode == 65) {//a
    } else if (keyCode == 68) {//d
    } else if (keyCode == 87) {//w
    } else if (keyCode == 83) {//s
    } else if (keyCode == 81) {//q
    } else if (keyCode == 69) {//e
    } else if (keyCode == 90) {//z
    } else if (keyCode == 67) {//c
    }

};
//------------------------
let scene, camera;

function init() {
    scene = new THREE.Scene();
    scene.allobjs = {};
    scene.background = new THREE.Color(backgroundColor);
    let camera2d = new THREE.OrthographicCamera();

    let halfwid = window.innerWidth / 2;
    let halfHei = window.innerHeight / 2
    camera2d = new THREE.OrthographicCamera(-halfwid, halfwid, halfHei, -halfHei, 1, 1000);
    camera2d.name = "camera2d";
    camera2d.position.z = 50;
    camera2d.resize = function () {
        let halfwid = window.innerWidth / 2;
        let halfHei = window.innerHeight / 2;
        this.left = -halfwid;
        this.right = halfwid;
        this.top = halfHei;
        this.bottom = -halfHei;
        this.updateProjectionMatrix();
    }
    camera = camera2d;

    drawBasicTriangle();
    drawBasicRectangle();
    // drawPlane();
    drawCircle()
}
function drawBasicTriangle() {
    var triangleGeometry = new THREE.Geometry();
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
        // side: THREE.DoubleSide
    });
    var triangleMesh = new THREE.Mesh(triangleGeometry, triangleMaterial);
    scene.add(triangleMesh);
    triangleMesh.position.set(0, 0, 0);
    triangleMesh.scale.set(50, 50, 1);
    triangleMesh.name = "triangle";
    //     triangleMesh.matrixAutoUpdate = false;
    scene.allobjs[triangleMesh.name] = triangleMesh;
    //     rotateMesh(triangleMesh,20);
}
function drawBasicRectangle() {
    let geometry = new THREE.Geometry();
    geometry.vertices.push(
        new THREE.Vector3(-1.0, 1.0, 0.0),
        new THREE.Vector3(-1.0, -1.0, 0.0),
        new THREE.Vector3(1.0, -1.0, 0.0),
        new THREE.Vector3(1.0, 1.0, 0.0)
    );
    geometry.faces.push(
        new THREE.Face3(0, 1, 2),
        new THREE.Face3(0, 2, 3)
    );
    geometry.faceVertexUvs[0].push(
        [
            new THREE.Vector2(0, 1),
            new THREE.Vector2(0, 0),
            new THREE.Vector2(1, 0),
        ],

        [
            new THREE.Vector2(0, 1),
            new THREE.Vector2(1, 0),
            new THREE.Vector2(1, 1),
        ]
    );


    geometry.uvsNeedUpdate = true;
    let texture = new THREE.TextureLoader().load('/assets/img/favicon.png');
    let material = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        map: texture,
        // side: THREE.DoubleSide
    });
    let mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);
    mesh.scale.set(50, 50, 1);
    mesh.position.set(100, 0, 0)
}
function drawPlane() {
    var geometry = new THREE.PlaneGeometry(2, 2, 1);
    let texture = new THREE.TextureLoader().load('/assets/img/favicon.png');
    var material = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        // side: THREE.DoubleSide
        map: texture,

    });
    var plane = new THREE.Mesh(geometry, material);
    plane.scale.set(50, 50, 1);
    plane.position.set(100, 0, 0);
    scene.add(plane);
}
function drawCircle() {
    let geometry = new THREE.CircleGeometry(1, 32, 0, 270 * Math.PI / 180);
    let material = new THREE.MeshBasicMaterial({ color: 0xffff00 });
    let circle = new THREE.Mesh(geometry, material);
    scene.add(circle);
    circle.scale.set(20, 20, 1);
    circle.position.set(300, 100, 0);
}
//---------------------------------
let sceneUI, cameraUI;
function initUI() {
    cameraUI = new THREE.OrthographicCamera(0, window.innerWidth, 0, window.innerHeight, 1, 1000);
    cameraUI.position.z = 2;
    cameraUI.resize = function () {
        this.right = window.innerWidth;
        this.bottom = window.innerHeight;
        this.updateProjectionMatrix();
    }
    sceneUI = new THREE.Scene();
    drawCube();
    drawLine();
}
function drawLine() {

    let material = new THREE.LineBasicMaterial({ color: 0xff0000 });
    let geometry = new THREE.Geometry();
    geometry.vertices.push(
        new THREE.Vector3(100, 100, 0),
        new THREE.Vector3(200, 100, 0),
        new THREE.Vector3(300, 200, 0),
    );
    let line = new THREE.Line(geometry, material);
    sceneUI.add(line);

}
function drawCube() {
    let geometry = new THREE.BoxGeometry(50, 50, 50);
    let material = new THREE.MeshBasicMaterial({ color: 0xff0000 });

    let cube = new THREE.Mesh(geometry, material);
    sceneUI.add(cube);
    cube.matrixAutoUpdate = true;
    let oMat = new THREE.Matrix4();
    oMat.makeTranslation(200, 200, 0);
    cube.applyMatrix(oMat);
}
function drawMeshLine() {

}

init()
initUI();
// let origin = new THREE.AxesHelper(1.25);
// origin.name = "sceneOrigin";
// scene.add(origin);
renderScene();

loop();