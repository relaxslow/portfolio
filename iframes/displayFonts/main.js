
let [renderer, scene] = initThree(0xffffff);

//camera
camera = new THREE.PerspectiveCamera(30, window.innerWidth / window.innerHeight, 1, 1500);
camera.position.set(0, 300, 700);
cameraTarget = new THREE.Vector3(0, 20, 0);
//controls
controls = new THREE.TrackballControls(camera);
controls.rotateSpeed = 5.0;
controls.zoomSpeed = 3.2;
controls.panSpeed = 0.8;
controls.noZoom = false;
controls.noPan = true;
controls.staticMoving = false;
controls.dynamicDampingFactor = 0.2;
controls.addEventListener('change', renderScene);
//light
var light = new THREE.AmbientLight(0x444444); // soft white light
scene.add(light);
// var dirLight = new THREE.DirectionalLight(0xffffff, 0.125);
// dirLight.position.set(0, 0, 1).normalize();
// scene.add(dirLight);
var pointLight = new THREE.PointLight(0xffffff, 1);
pointLight.position.set(0, 100, 90);
scene.add(pointLight);

materials = [
    new THREE.MeshPhongMaterial({ color: 0xff0000, flatShading: true }), // front
    new THREE.MeshPhongMaterial({ color: 0x0000ff }) // side
];

var text = "three.js",
    height = 20,
    size = 70,
    hover = 30,
    curveSegments = 4,
    bevelThickness = 2,
    bevelSize = 1.5,
    bevelSegments = 3,
    bevelEnabled = true,
    font = undefined,
    fontName = "optimer", // helvetiker, optimer, gentilis, droid sans, droid serif
    fontWeight = "bold"; // normal bold

var loader = new THREE.FontLoader();
loader.load('/assets/fontsThree/helvetiker_bold.typeface.json', function (response) {
    font = response;
    refreshText();
});
function refreshText() {
    textGeo = new THREE.TextGeometry(text, {
        font: font,
        size: size,
        height: height,
        curveSegments: curveSegments,
        bevelThickness: bevelThickness,
        bevelSize: bevelSize,
        bevelEnabled: bevelEnabled
    });
    textGeo.computeBoundingBox();
    textGeo.computeVertexNormals();
    var centerOffset = -0.5 * (textGeo.boundingBox.max.x - textGeo.boundingBox.min.x);
    textGeo = new THREE.BufferGeometry().fromGeometry(textGeo);
    textMesh1 = new THREE.Mesh(textGeo, materials);
    textMesh1.position.x = centerOffset;
    textMesh1.position.y = hover;
    textMesh1.position.z = 0;
    textMesh1.rotation.x = 0;
    textMesh1.rotation.y = Math.PI * 2;
    scene.add(textMesh1);


    renderScene();
}

animate();
function animate() {
  
    requestAnimationFrame(animate);
    renderScene();
    controls.update();
}

function renderScene() {
    renderer.render(scene, camera);
}
