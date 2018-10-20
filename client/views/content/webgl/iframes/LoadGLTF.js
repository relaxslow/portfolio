
let [renderer, scene] = initThree(0xffffff);

camera = new THREE.PerspectiveCamera(10, window.innerWidth / window.innerHeight, 1, 1000);
camera.position.set(-5, 12, 10);
camera.lookAt(scene.position);




controls = new THREE.TrackballControls(camera);
controls.rotateSpeed = 5.0;
controls.zoomSpeed = 3.2;
controls.panSpeed = 0.8;
controls.noZoom = false;
controls.noPan = true;
controls.staticMoving = false;
controls.dynamicDampingFactor = 0.2;
controls.addEventListener('change', renderScene);

var iphone_color = '#FAFAFA',
    ambientLight = new THREE.AmbientLight('#EEEEEE'),
    hemiLight = new THREE.HemisphereLight(iphone_color, iphone_color, 0),
    light = new THREE.PointLight(iphone_color, 1, 100);

hemiLight.position.set(0, 50, 0);
light.position.set(0, 20, 10);

scene.add(ambientLight);
scene.add(hemiLight);
scene.add(light);


var axisHelper = new THREE.AxesHelper(1.25);
scene.add(axisHelper);



animationLoop();

let model,
    // loader = new THREE.ColladaLoader(),
    loader2 = new THREE.GLTFLoader();


// loader.options.convertUpAxis = true;
// loader.load('https://s3-us-west-2.amazonaws.com/s.cdpn.io/392/iphone6.dae', loadCollada);
loader2.load('/assets/3d/box.gltf', loadModelOk);


function renderScene() {
    renderer.render(scene, camera);
}

function animationLoop() {
    requestAnimationFrame(animationLoop);
    controls.update();
}
function loadModelOk(obj) {
    model = obj.scene;
    let mesh = model.children[0];
    let matt= new THREE.Matrix4();
//     matt.setTranslation(0,10,0);
    mesh.geometry.translate( 0, 0.5, 0 );
    // dae.position.set(0.4, 0, 0.8);


    var geo = new THREE.EdgesGeometry(mesh.geometry); // or WireframeGeometry
    var mat = new THREE.LineBasicMaterial({ color: 0x777777, linewidth: 1 });
    var wireframe = new THREE.LineSegments(geo, mat);
    mesh.add(wireframe);

    scene.add(wireframe);
    renderScene();
}