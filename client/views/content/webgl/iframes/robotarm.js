let backgroundColor = 0x000000;
let renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.autoClear = false;
document.body.appendChild(renderer.domElement);
let scene = new THREE.Scene();
scene.background = new THREE.Color(backgroundColor);

document.body.onunload = function () {
    // cancelAnimationFrame(window.animationID);
    scene.traverse(cleanMeshes);

    function cleanMeshes(obj) {
        if (obj instanceof THREE.Mesh) {
            obj.geometry.dispose();
            for (let i = 0; i < obj.material.length; i++) {
                const mat = obj.material[i];
                mat.dispose();
            }
        }
    }
};

window.addEventListener('resize', onWindowResize, false);
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    camera2D.right = window.innerWidth;
    camera2D.bottom = window.innerHeight;
    camera2D.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);

    renderScene();
}
let camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(3.8, 3.8, 3.8);
camera.lookAt(new THREE.Vector3(0, 0, 0));





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

document.body.addEventListener("keydown", keyDown, false);
function keyDown(event) {
    let finger1 = Obj3D.objs["finger1"];
    let finger2 = Obj3D.objs["finger2"];
    let arm1 = Obj3D.objs["arm1"];
    let joint1 = Obj3D.objs["joint1"];
    let joint2 = Obj3D.objs["joint2"];
    let keyCode = event.which;
    if (keyCode == 65) {//a
        arm1.rotate(Axis.y, 10);
    } else if (keyCode == 68) {//d
        arm1.rotate(Axis.y, -10);
    } else if (keyCode == 87) {//w
        joint1.rotate(Axis.x, 10);
    } else if (keyCode == 83) {//s
        joint1.rotate(Axis.x, -10);
    } else if (keyCode == 81) {//q
        finger1.rotate(Axis.z, -10);
        finger2.rotate(Axis.z, 10);
    } else if (keyCode == 69) {//e
        finger1.rotate(Axis.z, 10);
        finger2.rotate(Axis.z, -10);
    } else if (keyCode == 90) {//z
        joint2.rotate(Axis.y, 10);
    } else if (keyCode == 67) {//c
        joint2.rotate(Axis.y, -10);
    }
    renderScene();
};
var raycaster = new THREE.Raycaster();
var mouse = new THREE.Vector2();
document.body.addEventListener('mousedown', function (event) {

    // For the following method to work correctly, set the canvas position *static*; margin > 0 and padding > 0 are OK
    mouse.x = ((event.clientX - renderer.domElement.offsetLeft) / renderer.domElement.clientWidth) * 2 - 1;
    mouse.y = - ((event.clientY - renderer.domElement.offsetTop) / renderer.domElement.clientHeight) * 2 + 1;

    // For this alternate method, set the canvas position *fixed*; set top > 0, set left > 0; padding must be 0; margin > 0 is OK
    //mouse.x = ( ( event.clientX - container.offsetLeft ) / container.clientWidth ) * 2 - 1;
    //mouse.y = - ( ( event.clientY - container.offsetTop ) / container.clientHeight ) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);

    intersects = raycaster.intersectObjects(Obj3D.pickupMeshes);

    if (intersects.length > 0) {
        let select = intersects[0].object;
        console.log("pick!!" + select.name);
        selectObj(select);
    }

}, false);

let selectMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
function selectObj(obj) {
    if (obj.material != selectMaterial) {
        obj.materialOrigin = obj.material;
        obj.material = selectMaterial;
    }
    for (let i = 0; i < Obj3D.pickupMeshes.length; i++) {
        const one = Obj3D.pickupMeshes[i];
        if (one.material == selectMaterial && one != obj)
            one.material = one.materialOrigin;

    }

    renderScene();
}

let color = '#111111',
    ambientLight = new THREE.AmbientLight('#111111'),
    hemiLight = new THREE.HemisphereLight(color, color, 0),
    light = new THREE.PointLight("#ffffff", 1, 100);
hemiLight.position.set(0, 50, 0);
light.position.set(10, 20, 10);
scene.add(ambientLight);
// scene.add(hemiLight);
scene.add(light);


let geometry = new THREE.BoxGeometry(1, 1, 1);
geometry.name = "boxGeometry"
let material = new THREE.MeshLambertMaterial({
    color: 0x00ff00,
    polygonOffset: true,
    polygonOffsetFactor: 1, // positive value pushes polygon further away
    polygonOffsetUnits: 1
});
let cube = new THREE.Mesh(geometry, material);
cube.name = "boxMesh";
cube.visible = true;
cube.geometry.translate(0, 0.5, 0);
scene.add(cube);

let wireGeo = new THREE.EdgesGeometry(cube.geometry); // or WireframeGeometry
wireGeo.name = "boxWireGeometry";
let wiremat = new THREE.LineBasicMaterial({ color: 0x777777, linewidth: 1 });
let cube1Wire = new THREE.LineSegments(wireGeo, wiremat);
cube1Wire.name = "boxWireMesh";

let objOriginGeometry = new THREE.BufferGeometry();
let indices = [0, 1, 2, 3, 4, 5]
let originLength = 0.2;
let vertices = new Float32Array([
    0.0, 0.0, 0.0,
    originLength, 0.0, 0.0,

    0.0, 0.0, 0.0,
    0.0, originLength, 0.0,

    0.0, 0.0, 0.0,
    0.0, 0.0, originLength,
]);
let colors = new Float32Array([
    1, 0, 0,
    1, 0, 0,
    0, 1, 0,
    0, 1, 0,
    0, 0, 1,
    0, 0, 1
]);
objOriginGeometry.addAttribute('position', new THREE.BufferAttribute(vertices, 3));
objOriginGeometry.addAttribute('color', new THREE.BufferAttribute(colors, 3));
let objOriginMaterial = new THREE.LineBasicMaterial({ vertexColors: THREE.VertexColors });
objOriginMesh = new THREE.LineSegments(objOriginGeometry, objOriginMaterial);

let obj = new THREE.Group();
obj.name = "obj";
obj.matrixAutoUpdate = false;
obj.add(cube);
obj.add(cube1Wire);
obj.add(objOriginMesh);
obj.cube = cube;
obj.wire = cube1Wire;
obj.origin = objOriginMesh;
// scene.add(obj);
// cube1Wire.position.set(0,1,0);

function Obj3D(name, srcObj, parentName) {
    this.axis = new THREE.Vector3(0, 0, 0);
    this.root = srcObj.clone();
    this.root.name = name;
    this.root.children[0].name = name + "body";
    this.root.children[1].name = name + "wire";
    this.root.children[2].name = name + "origin";
    this.root.children[0].matrixAutoUpdate = false;
    this.root.children[1].matrixAutoUpdate = false;
    this.root.children[2].matrixAutoUpdate = false;

    let parent
    if (parentName == undefined)
        parent = scene;
    else
        parent = Obj3D.objs[parentName].root.children[2];
    parent.add(this.root);

    Obj3D.objs[name] = this;
    Obj3D.pickupMeshes.push(this.root.children[0]);
    return this;
}
Obj3D.objs = {};
Obj3D.pickupMeshes = [];
Obj3D.oMat = new THREE.Matrix4();

Obj3D.prototype.scale = function (x, y, z) {
    Obj3D.oMat.identity();
    Obj3D.oMat.makeScale(x, y, z);
    this.root.children[0].applyMatrix(Obj3D.oMat);
    this.root.children[1].applyMatrix(Obj3D.oMat);
    return this;
}
Obj3D.prototype.translate = function (x, y, z) {
    Obj3D.oMat.identity();
    Obj3D.oMat.makeTranslation(x, y, z);
    this.root.applyMatrix(Obj3D.oMat);
    this.axis = this.axis.applyMatrix4(Obj3D.oMat);
    return this;
}
Obj3D.quaternion = new THREE.Quaternion();
let Axis = {};
Axis.x = new THREE.Vector3(1, 0, 0);
Axis.y = new THREE.Vector3(0, 1, 0);
Axis.z = new THREE.Vector3(0, 0, 1);

Obj3D.prototype.rotate = function (axis, angle) {
    let radian = angle * Math.PI / 180;
    Obj3D.quaternion.setFromAxisAngle(axis, radian);
    Obj3D.oMat.makeRotationFromQuaternion(Obj3D.quaternion);
    this.root.children[0].applyMatrix(Obj3D.oMat);
    this.root.children[1].applyMatrix(Obj3D.oMat);
    this.root.children[2].applyMatrix(Obj3D.oMat);

    return this;
}
new Obj3D("arm0", obj).scale(1.5, 0.4, 1.5);

new Obj3D("arm1", obj, "arm0").scale(1, 1, 1).translate(0, 0.4, 0);
new Obj3D("joint1", obj, "arm1").scale(0.6, 0.4, 0.4).translate(0, 1, 0).rotate(Axis.x, 60);
new Obj3D("arm2", obj, "joint1").scale(0.4, 1, 0.4).translate(0, 0.4, 0);
new Obj3D("joint2", obj, "arm2").scale(0.8, 0.5, 0.5).translate(0, 1, 0);
new Obj3D("finger1", obj, "joint2").scale(0.1, 0.2, 0.1).translate(-0.3, 0.5, 0);
new Obj3D("finger2", obj, "joint2").scale(0.1, 0.2, 0.1).translate(0.3, 0.5, 0);

let scene2D, camera2D;
function init2D() {
    camera2D = new THREE.OrthographicCamera(0, window.innerWidth, 0, window.innerHeight, 1, 1000);
    camera2D.position.z = 2;
    scene2D = new THREE.Scene();
    drawCube();
    drawLine();
    drawBasicTriangle();
}
function drawLine() {

    let material = new THREE.LineBasicMaterial({ color: 0xff0000 });
    let geometry = new THREE.Geometry();
    geometry.vertices.push(
        new THREE.Vector3(10, 20, 0),
        new THREE.Vector3(10, 40, 0),
        new THREE.Vector3(100, 40, 0),
    );
    let line = new THREE.Line(geometry, material);
    scene2D.add(line);

}
function drawCube() {
    let geometry = new THREE.BoxGeometry(20, 20, 20);
    let material = new THREE.MeshBasicMaterial({ color: 0xff0000 });

    let cube = new THREE.Mesh(geometry, material);
    scene2D.add(cube);
    cube.matrixAutoUpdate = false;
    let oMat = new THREE.Matrix4();
    oMat.makeTranslation(10, 20, 0);
    cube.applyMatrix(oMat);
}

function drawBasicTriangle() {
    var triangleGeometry = new THREE.Geometry();
    triangleGeometry.vertices.push(
        new THREE.Vector3(0.0, -1.0, 0.0),
        new THREE.Vector3(-1.0, 1.0, 0.0),
        new THREE.Vector3(1.0, 1.0, 0.0)
    );
    triangleGeometry.faces.push(new THREE.Face3(0, 1, 2));
    var triangleMaterial = new THREE.MeshBasicMaterial({
        color: 0xFFFFFF,
        // side: THREE.DoubleSide
    });
    var triangleMesh = new THREE.Mesh(triangleGeometry, triangleMaterial);
    scene2D.add(triangleMesh);
    triangleMesh.position.set(30, 10, 0);
    triangleMesh.scale.set(10, 10, 1);
}

init2D();


// let origin = new THREE.AxesHelper(1.25);
// origin.name = "sceneOrigin";
// scene.add(origin);
renderScene();

function renderScene() {
    renderer.clear();
    renderer.render(scene, camera);
    renderer.clearDepth();
    renderer.render(scene2D, camera2D);
}
function loop() {
    requestAnimationFrame(loop);
    controls.update();
};

loop();