let backgroundColor = 0x000000;
let renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
var scene = new THREE.Scene();
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
    renderer.setSize(window.innerWidth, window.innerHeight);
}
let camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(3.8, 3.8, 3.8);
// camera.lookAt(new THREE.Vector3(0, 0, 0));

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
    var keyCode = event.which;
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

var objOriginGeometry = new THREE.BufferGeometry();
let indices = [0, 1, 2, 3, 4, 5]
let originLength = 0.2;
var vertices = new Float32Array([
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

    return this;
}
Obj3D.objs = {};
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
new Obj3D("joint1", obj, "arm1").scale(0.6, 0.4, 0.4).translate(0, 1, 0);
new Obj3D("arm2", obj, "joint1").scale(0.4, 1, 0.4).translate(0, 0.4, 0).rotate(Axis.x,60);
new Obj3D("joint2", obj, "arm2").scale(0.8, 0.5, 0.5).translate(0, 1, 0);
new Obj3D("finger1", obj, "joint2").scale(0.1, 0.2, 0.1).translate(-0.3, 0.5, 0);
new Obj3D("finger2", obj, "joint2").scale(0.1, 0.2, 0.1).translate(0.3, 0.5, 0);

// let arm1=obj.clone();
// arm0.add(arm1);
// operateMatrix.identity();
// operateMatrix.makeTranslation(0,0.4,0);
// arm1.applyMatrix(operateMatrix);


// let origin = new THREE.AxesHelper(1.25);
// origin.name = "sceneOrigin";
// scene.add(origin);
renderScene();

function renderScene() {
    renderer.render(scene, camera);
}
function loop() {
    requestAnimationFrame(loop);
    controls.update();
};

loop();