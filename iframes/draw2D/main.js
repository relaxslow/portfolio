//features
//2 layer of scene
//controls 2d
function PhotoSphere(){

}
function Controls2D(camera2d) {
    Controls2D.instance = this;
    document.addEventListener('mousemove', this.mouseMoveListener, false);
    document.addEventListener('mousedown', this.mouseDownListener, false);
    document.addEventListener('mouseup', this.mouseUpListener, false);
    document.addEventListener('mousewheel', this.mouseWheelListener, false);
    this.camera = camera2d;
    this.isMouseDown = false;
    this.button = -1;
    this.lastVec = new THREE.Vector2();
    this.vec = new THREE.Vector2();

    this.tween = new TWEEN.Tween(this.camera);
    this.tween.easing(TWEEN.Easing.Quartic.Out);


}
Controls2D.prototype.update = function updateControls2D() {
    TWEEN.update();
}
Controls2D.prototype.mouseWheel = function mouseWheel(event) {
    let camera = this.camera;
    this.tween.stop();
    this.tween.to({ zoom: this.camera.zoom + 0.001 * event.wheelDeltaY }, 500)
        .onUpdate(function () {
            //             console.log(camera.zoom);
            camera.updateProjectionMatrix();
        })
        .start();
}
Controls2D.prototype.mouseMove = function mouseMove(event) {
    if (this.isMouseDown && this.button == 2) {
        this.vec.set(event.clientX, event.clientY);
        this.vec.sub(this.lastVec);
        this.camera.position.x -= this.vec.x / this.camera.zoom;
        this.camera.position.y += this.vec.y / this.camera.zoom;
        this.camera.updateProjectionMatrix();
        this.lastVec.set(event.clientX, event.clientY);
    }
}
Controls2D.prototype.mouseDown = function mouseDown(event) {
    this.isMouseDown = true;
    this.button = event.button;
    this.lastVec.set(event.clientX, event.clientY);
}
Controls2D.prototype.mouseUp = function mouseUp(event) {
    this.button = -1;
    this.isMouseDown = false;
}

Controls2D.prototype.mouseMoveListener = function mouseMoveListener(event) {
    event.preventDefault();
    Controls2D.instance.mouseMove(event);
}
Controls2D.prototype.mouseUpListener = function moveUpListener(event) {
    event.preventDefault();
    Controls2D.instance.mouseUp(event);
}
Controls2D.prototype.mouseDownListener = function moveDownListener(event) {
    event.preventDefault();
    Controls2D.instance.mouseDown(event);
}
Controls2D.prototype.mouseWheelListener = function moveWheelListener(event) {
    event.preventDefault();
    Controls2D.instance.mouseWheel(event);
}

Controls2D.prototype.remove = function removeControls2D() {
    document.removeEventListener('mousemove', this.mouseMoveListener, false);
    document.removeEventListener('mousedown', this.mouseDownListener, false);
    document.removeEventListener('mouseup', this.mouseUpListener, false);
    document.removeEventListener('mousewheel', this.mouseWheelListener, false);
}


//start-------------------------------
let time, scene, sceneUI, camera, cameraUI, controls;
let allObjs = {},
    animations = [];

let mat = new THREE.Matrix4();
let quat = new THREE.Quaternion();
let Axis = {};
Axis.x = new THREE.Vector3(1, 0, 0);
Axis.y = new THREE.Vector3(0, 1, 0);
Axis.z = new THREE.Vector3(0, 0, 1);

init();
loop();

function init() {
    initSys();
    init3d();
    init2d();
    renderScene();
}

function init3d() {
    let triangle = drawBasicTriangle();
    animation_rotate.call(triangle, Axis.y, 90);
    drawLine();
    drawCircle()
}

function init2d() {
    // drawBasicRectangle();
    // drawCube();
    // drawLine();
    //     drawSimpleText();
}

function update(delta) {
    animate(delta);
    renderScene();
}

//2d
function drawLine() {
    let material = new THREE.LineBasicMaterial({ color: 0x000000 });
    let geometry = new THREE.Geometry();
    geometry.vertices.push(
        new THREE.Vector3(0, 200, 0),
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(300, 0, 0),
    );
    let line = new THREE.Line(geometry, material);
    scene.add(line);

}
function drawCube() {
    let geometry = new THREE.BoxGeometry(20, 20, 10);
    let material = new THREE.MeshBasicMaterial({ color: 0xff0000 });

    let cube = new THREE.Mesh(geometry, material);
    sceneUI.add(cube);
    cube.matrixAutoUpdate = true;
    let oMat = new THREE.Matrix4();
    oMat.makeTranslation(10, 10, 0);
    cube.applyMatrix(oMat);
}
// function drawSimpleText() {
//     let texture = createTextTexture("hello!!")
//     let geometry = new THREE.PlaneGeometry(1, 1);
//     let material = new THREE.MeshBasicMaterial({
//         color: 0xffffff,
//         map: texture,
//           side: THREE.DoubleSide
// //         transparent: true,
// //         alphaTest: 0.2
//     })
//     var plane = new THREE.Mesh(geometry, material);
//     plane.scale.set(200, 20, 1);
//     plane.position.set(50, 50, 0);
//     scene.add(plane)
// }
function drawMeshLine() {

}

//3d---------------------
function drawCube3D() {

}
function drawOrigin() {
    let geometry = new THREE.BufferGeometry();
    let length = 10;
    let vertices = new Float32Array([
        0.0, 0.0, 0.0,
        length, 0.0, 0.0,

        0.0, 0.0, 0.0,
        0.0, length, 0.0,

        0.0, 0.0, 0.0,
        0.0, 0.0, length,
    ]);
    let colors = new Float32Array([
        1, 0, 0,
        1, 0, 0,
        0, 1, 0,
        0, 1, 0,
        0, 0, 1,
        0, 0, 1
    ]);
    geometry.addAttribute('position', new THREE.BufferAttribute(vertices, 3));
    geometry.addAttribute('color', new THREE.BufferAttribute(colors, 3));
    let material = new THREE.LineBasicMaterial({ vertexColors: THREE.VertexColors });
    mesh = new THREE.LineSegments(geometry, material);
    return mesh;
}

function drawBasicTriangle() {
    let x=10;
    let y=12;
    let group=new THREE.Group();
    group.position.set(x, y, 0);

    sceneUI.add(group)
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
    //     triangleMesh.matrixAutoUpdate = false;
    allObjs[triangleMesh.name] = triangleMesh;
    return triangleMesh;
    //     rotateMesh(triangleMesh,20);
}
function drawBasicRectangle() {
    let geometry = new THREE.Geometry();
    geometry.vertices.push(
        new THREE.Vector3(-0.5, 0.5, 0.0),
        new THREE.Vector3(-0.5, -0.5, 0.0),
        new THREE.Vector3(0.5, -0.5, 0.0),
        new THREE.Vector3(0.5, 0.5, 0.0)
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
    // let texture = new THREE.TextureLoader().load('/assets/img/favicon.png');
    let texture = createTextTexture("hello World");
    let material = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        map: texture,
        transparent: true,
        //         alphaTest: 0.2
        // side: THREE.DoubleSide
    });
    //   material.map.needsUpdate = true;
    let mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);
    let [w, h] = texture.size;
    let meshWid = 100;
    let meshHei = meshWid * h / w;
    mesh.scale.set(meshWid, meshHei, 1);
    mesh.position.set(100, 0, 0)
}
function createTextTexture(text) {
    let fontHei = 50;
    var canvas = document.createElement('canvas');
    var context = canvas.getContext('2d');

    context.font = `${fontHei}px Georgia`;
    context.fillStyle = 'red';
    context.textAlign = "center";
    context.textBaseline = "middle";
    canvas.width = context.measureText(text).width;
    canvas.height = fontHei;


    context.font = `${fontHei}px Georgia`;
    context.fillStyle = 'red';
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.fillText(text, canvas.width / 2, canvas.height / 2, canvas.width);
    let texture = new THREE.Texture(canvas);
    texture.needsUpdate = true;
    texture.size = [canvas.width, canvas.height];
    return texture;
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


//sys

function initSys() {
    time = new Time();

    renderer = initRenderer();
    document.body.appendChild(renderer.domElement);
    document.body.onunload = cleanScene;
    document.body.addEventListener("keydown", keyDown, false);
    window.addEventListener("contextmenu", disableContexMenu);
    window.addEventListener('resize', onWindowResize, false);
    //     window.addEventListener('focus', getfocus);


    scene = new THREE.Scene();

    camera = initCamera2d();
    controls = initControls();
    sceneUI = new THREE.Scene();
    cameraUI = initCameraUI();



}
function disableContexMenu(event) {
    event.preventDefault();
}

function initCamera2d() {
    let camera = new THREE.OrthographicCamera();
    let halfwid = window.innerWidth / 2;
    let halfHei = window.innerHeight / 2
    camera = new THREE.OrthographicCamera(-halfwid, halfwid, halfHei, -halfHei, 1, 1000);
    camera.name = "camera2d";
    camera.position.z = 300;
    camera.resize = resize2d;
    return camera;
}
function initCamera3d() {
    let camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.name = "camera3d";
    camera.position.set(3.8, 3.8, 3.8);
    camera.lookAt(new THREE.Vector3(0, 0, 0));
    camera.resize = resize3d;
    return camera
}
function initCameraUI() {
    let camera = new THREE.OrthographicCamera(0, window.innerWidth, 0, window.innerHeight, 1, 1000);
    camera.position.z = 50;
    camera.resize = resizeUI;
    return camera
}

function resize2d() {
    resizeOrthoCamera.call(this, window.innerWidth);
}
function resize3d() {
    this.aspect = window.innerWidth / window.innerHeight;
    this.updateProjectionMatrix();
}
function resizeOrthoCamera(wid) {
    let halfwid = wid;
    let halfHei = halfwid * window.innerWidth / window.innerHeight;
    this.left = -halfwid;
    this.right = halfwid;
    this.top = halfHei;
    this.bottom = -halfHei;
    this.updateProjectionMatrix();
}

function resizeUI() {
    this.right = window.innerWidth;
    this.bottom = window.innerHeight;
    this.updateProjectionMatrix();
}


function cleanScene() {
    scene.traverse(cleanMeshes);
}
function cleanMeshes(obj) {
    if (obj instanceof THREE.Mesh) {
        obj.geometry.dispose();
        for (let i = 0; i < obj.material.length; i++) {
            const mat = obj.material[i];
            mat.dispose();
        }
    }
}

function onWindowResize() {
    camera.resize();
    cameraUI.resize();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderScene();
}
function initRenderer() {
    let renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setClearColor(0xffffff, 0);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.autoClear = false;
    return renderer;
}
function renderScene() {
    renderer.clear()
    renderer.render(scene, camera);
    renderer.clearDepth();
    renderer.render(sceneUI, cameraUI);
}


function initControls() {
    if (camera.name === "camera3d") {
        return initControl3D();
    }
    else if (camera.name === "camera2d") {
        return initControl2D();
    }

}
function initControl2D() {
    let controls = new Controls2D(camera);


    return controls;
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
    controls.addEventListener('change', renderScene);
    return controls;
}


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
    renderScene();
};



function loop(t) {
    if (!t) t = 0;
    let elapes = t - time.last
    update(elapes)
    time.last = t;

    requestAnimationFrame(loop);
    controls.update();

};

function Time() {
    this.framerate = 30;
    this.frametime = 1000 / this.framerate;
    this.last = 0
    //helper
    this.count = 0;
    this.second = 0;
}




// let origin = new THREE.AxesHelper(1.25);
// origin.name = "sceneOrigin";
// scene.add(origin);


function animate(delta) {
    for (let i = 0; i < animations.length; i++) {
        let [aniFun, host] = animations[i];
        aniFun.call(host, delta);
    }
}
function animation_rotate(axis, angle) {
    let speedRot = angle / 1000;
    this.aniParam = [axis, speedRot];
    animations.push([rotate, this]);
}
function rotate(delta) {
    let [axis, speedRot] = this.aniParam;
    mat.identity();
    quat.setFromAxisAngle(axis, speedRot * delta * Math.PI / 180);
    mat.makeRotationFromQuaternion(quat);
    this.applyMatrix(mat);
}