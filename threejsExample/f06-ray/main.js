
function main() {
    init();
    animate();
}
let container;
let scene, camera, renderer;
let controls;
let clock;

let bullets = [];
bullets.remove = removeElemtFromArray;
function removeElemtFromArray(elem) {
    this.splice(this.indexOf(elem), 1);
}
let bBoxs = [];
function init() {
    container = document.querySelector(".container");
    camera = new THREE.PerspectiveCamera(60, container.clientWidth / container.clientHeight, 0.1, 2000);
    camera.position.z = 200;
    camera.position.y = 50;
    control3D = new THREE.TrackballControls(camera);
    control3D.rotateSpeed = 1.0;
    control3D.zoomSpeed = 1.2;
    control3D.panSpeed = 0.8;
    control3D.noZoom = false;
    control3D.noPan = false;
    control3D.staticMoving = true;
    control3D.dynamicDampingFactor = 0.3;
    control3D.target.set(0, 50, 0);
    scene = new THREE.Scene();
    let canvas = document.querySelector(".scene")
    let context = canvas.getContext('webgl2');
    renderer = new THREE.WebGLRenderer({ canvas: canvas, context: context });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setClearColor(0x777777, 0);
    container.appendChild(renderer.domElement);

    window.addEventListener('resize', onWindowResize, false);
    clock = new THREE.Clock();


    //bullet
    new ControlGun();

    //boundingBox
    let wid = 50;
    let hei = 50;
    let hwid = wid / 2;
    let hhei = hei / 2;
    let topLeft = new THREE.Vector3(-hwid, hhei, 0);
    let bottomLeft = new THREE.Vector3(-hwid, -hhei, 0);
    let topRight = new THREE.Vector3(hwid, hhei, 0);
    let bottomRight = new THREE.Vector3(hwid, -hhei, 0);
    material = new THREE.LineBasicMaterial({
        color: 0xff0000
    });
    geometry = new THREE.Geometry();
    geometry.vertices.push(
        bottomRight,
        bottomLeft,
        topLeft,


    );
    boundingBox = new THREE.Line(geometry, material);
    boundingBox.position.set(100, 100, 0);
    scene.add(boundingBox);
    bBoxs.push(boundingBox);
}
function onWindowResize() {
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
}
function animate() {
    var delta = clock.getDelta();
    requestAnimationFrame(animate);
    ControlGun.update(delta);
    TWEEN.update();

    testCollide()
    control3D.update();
    render();
}
function render() {
    renderer.render(scene, camera);
}
let hit = 0;
let hitinfo = document.querySelector(".hit");
let d1;
let d2;
let d2vec = new THREE.Vector3();
function testCollide() {
    let i = bullets.length;
    while (i--) {
        let bullet = bullets[i];
        bullet.updateMatrixWorld();
        var ray = new THREE.Raycaster(bullet.lastPosition, bullet.lastDirect);
        var intersects = ray.intersectObjects(bBoxs);
        if (intersects[0] == undefined) return;
        d1 = intersects[0].distance;
        d2vec.subVectors(bullet.position, bullet.lastPosition);
        d2 = d2vec.length();
        if (d1 <= d2) {
            scene.remove(bullet);
            bullets.remove(bullet);
            bullet.tween.stop();

            hit++;
            hitinfo.textContent = "hit:" + hit;
        }
        bullet.lastPosition.copy(bullet.position);
        bullet.lastDirect.copy(bullet.direct);
    }
}

function ControlGun() {
    let shotInterval = 0.3;
    let count = 0;


    ControlGun.update = function updateGunControl(delta) {
        if (count == 0)
            fire();
        count += delta;
        if (count >= shotInterval) {
            count = 0;
        }

    }


    function createBullet() {
        let geometry = new THREE.CircleGeometry(2, 4);
        let material = new THREE.MeshBasicMaterial({
            color: 0x000000,
        })
        bullet = new THREE.Mesh(geometry, material);
        scene.add(bullet);
        bullet.direct = new THREE.Vector3();
        return bullet;

    }
    let target = new THREE.Vector3();
    let direct = new THREE.Vector3();
    let initDirect = new THREE.Vector3(0, 1, 0);
    let total = 0;
    let info = document.querySelector(".fire");
    function fire() {
        let bullet = createBullet();
        if (bullet == null) return;
        //bullet init position
        bullet.position.set(0, 0, 0);
        //bullet target
        target.set(450, 500, 0);
        direct.subVectors(target, bullet.position);
        let angle = initDirect.angleTo(direct);
        bullet.rotation.z = angle;
        bullet.direct.copy(direct.normalize());
        bullet.lastDirect = new THREE.Vector3().copy(bullet.direct);
        bullet.lastPosition = new THREE.Vector3().copy(bullet.position);

        scene.add(bullet);
        bullets.push(bullet);
        bullet.tween = new TWEEN.Tween(bullet.position)
            .to({ x: target.x, y: target.y }, 2000)
            .start()
            .onComplete(function () {
                bullets.remove(bullet);
            });

        total++;
        info.textContent = "total:" + total;
    }

}
main();