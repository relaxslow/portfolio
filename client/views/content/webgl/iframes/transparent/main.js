
let renderer, scene, scene2D, camera, camera2D, controls;
init();
loop();

function init() {
    renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setClearColor( 0xffffff, 0 );
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.autoClear = false;
    document.body.appendChild(renderer.domElement);
    window.addEventListener('resize', onWindowResize, false);

    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(3.8, 3.8, 3.8);

    scene2D = new THREE.Scene();
    camera2D = new THREE.OrthographicCamera(0, window.innerWidth, 0, window.innerHeight, 1, 1000);
    camera2D.position.z = 2;

    setupControls();
    init3d();
    init2d();
    renderScene();//render after init
}
function renderScene() {
    renderer.clear();
    renderer.render(scene, camera);
    renderer.clearDepth();
    renderer.render(scene2D, camera2D);
}
function loop() {
    requestAnimationFrame(loop);
    controls.update();
    // renderScene();//not render in loop cause alpha failed
}

function setupControls() {
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
    controls.addEventListener('change', renderScene);//render after control change
}
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    camera2D.right = window.innerWidth;
    camera2D.bottom = window.innerHeight;
    camera2D.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);

    renderScene();// render after window resize
}
//3d
function init3d() {
    drawbox();
}
function drawbox() {
    let geometry = new THREE.BoxGeometry(1, 1, 1);
    geometry.name = "boxGeometry"
    let material = new THREE.MeshBasicMaterial({
        color: 0x00ff00,
        polygonOffset: true,
        polygonOffsetFactor: 1, // positive value pushes polygon further away
        polygonOffsetUnits: 1
    });
    let cube = new THREE.Mesh(geometry, material);
    cube.geometry.translate(0, 0.5, 0);
    scene.add(cube);
}
//2d
function init2d() {
    drawCube2d();
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
function drawCube2d() {
    let geometry = new THREE.BoxGeometry(1, 1, 1);
    let material = new THREE.MeshBasicMaterial({ color: 0xff0000 });

    let cube = new THREE.Mesh(geometry, material);
    scene2D.add(cube);
    cube.matrixAutoUpdate = false
    let mat = new THREE.Matrix4();
    mat.makeScale(10, 10, 10);
    mat.setPosition(new THREE.Vector3(20, 20, 0));
    cube.applyMatrix(mat);
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
        color: 0xFFFF00,
        // side: THREE.DoubleSide
    });
    var triangleMesh = new THREE.Mesh(triangleGeometry, triangleMaterial);
    scene2D.add(triangleMesh);
    triangleMesh.position.set(30, 20, 0);
    triangleMesh.scale.set(10, 10, 1);
}