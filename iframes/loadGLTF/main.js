let model, loader = new THREE.GLTFLoader();
function init3d() {
    let color = '#111111',
        ambientLight = new THREE.AmbientLight(0x404040),
        hemiLight = new THREE.HemisphereLight(color, color, 0),
        light = new THREE.PointLight("#ffffff", 4, 100);
    hemiLight.position.set(0, 50, 0);
    light.position.set(10, 10, 10);
    scene.add(ambientLight);
    // scene.add(hemiLight);
    scene.add(light);
    var axisHelper = new THREE.AxesHelper(1.25);
    scene.add(axisHelper);
    loader.load('/assets/3d/redCar/model.gltf', loadModelOk);


}
function loadModelOk(obj) {
    model = obj.scene;
    scene.add(model);
    // let mesh = model.children[0];
    // let matt = new THREE.Matrix4();
    
    //     matt.setTranslation(0,10,0);
    // mesh.geometry.translate(0, 0.5, 0);
    // dae.position.set(0.4, 0, 0.8);


    // var geo = new THREE.EdgesGeometry(mesh.geometry); // or WireframeGeometry
    // var mat = new THREE.LineBasicMaterial({ color: 0x777777, linewidth: 1 });
    // var wireframe = new THREE.LineSegments(geo, mat);
    // mesh.add(wireframe);
    renderScene();

}
function init2d() {

}


let scene, sceneUI, camera, camera2d, cameraUI, controls;

init();
loop();
function init() {
    initSys();
    init3d();
    init2d();
//     initLastTime();
    renderScene();
}
function initSys() {
    renderer = initRenderer();
    document.body.appendChild(renderer.domElement);
    document.body.onunload = cleanScene;
    // document.body.addEventListener("keydown", keyDown, false);
    window.addEventListener('resize', onWindowResize, false);
//     window.addEventListener('focus', getfocus);


    scene = new THREE.Scene();
    scene.allobjs = {};
    scene.animation = [];

    camera = initCamera3d();


    sceneUI = new THREE.Scene();
    cameraUI = initCameraUI();
    initControls();

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
    camera.position.set(3.8, 3.8, 3.8);
    camera.lookAt(new THREE.Vector3(0, 0, 0));
    camera.resize = resize3d;
    return camera
}
function initCameraUI() {
    let camera = new THREE.OrthographicCamera(0, window.innerWidth, 0, window.innerHeight, 1, 1000);
    camera.position.z = 2;
    camera.resize = resizeUI;
    return camera
}
function resize2d() {
    let halfwid = window.innerWidth / 2;
    let halfHei = window.innerHeight / 2;
    this.left = -halfwid;
    this.right = halfwid;
    this.top = halfHei;
    this.bottom = -halfHei;
    this.updateProjectionMatrix();
}
function resize3d() {
    this.aspect = window.innerWidth / window.innerHeight;
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
    controls = new THREE.TrackballControls(camera);
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
}


function renderScene() {
    renderer.render(scene, camera);
}

function loop() {
    requestAnimationFrame(loop);
    controls.update();
}












