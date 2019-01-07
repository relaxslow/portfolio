

let container;
let scene, camera, renderer;
let camera2D, camera3D;
let css3Dscene, css3DRenderer;
let controls;
let control3D, control2D;
let loader;
let clock;
//object groups
let group_bLines;//boundingBox line
// update groups
let needUpdate;
let collideUpdate;
function UpdateGroup() {
    let group = [];
    this.get = function () {
        return group;
    }
    this.push = function (elem) {
        group.push(elem);
    }
    this.update = function (delta) {
        for (let i = 0; i < group.length; i++) {
            group[i].update(delta);
        }
    }
    this.remove = function (elem) {
        removeElemtFromArray.call(group, elem);
        // group.splice(group.indexOf(elem), 1);
    };
}
function removeElemtFromArray(elem) {
    this.splice(this.indexOf(elem), 1);
}
function main() {
    init();
    animate();

}

function init() {
    container = document.querySelector(".container");
    var frustumSize = 500;
    var aspect = container.clientWidth / container.clientHeight;
    camera2D = new THREE.OrthographicCamera(frustumSize * aspect / - 2, frustumSize * aspect / 2, frustumSize / 2, frustumSize / - 2, 1, 1000);
    camera2D.position.set(0, 240, 200);

    camera3D = new THREE.PerspectiveCamera(60, container.clientWidth / container.clientHeight, 0.1, 2000);
    camera3D.position.z = 200;

    control2D = new Control2D(camera2D);
    control3D = new THREE.TrackballControls(camera3D);
    control3D.rotateSpeed = 1.0;
    control3D.zoomSpeed = 1.2;
    control3D.panSpeed = 0.8;
    control3D.noZoom = false;
    control3D.noPan = false;
    control3D.staticMoving = true;
    control3D.dynamicDampingFactor = 0.3;
    //     control3D.addEventListener( 'change', render );

    camera = camera2D;
    control3D.enabled = false;
    //webgl renderer 
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
    group_bLines = new THREE.Group();
    scene.add(group_bLines);
    needUpdate = new UpdateGroup();
    collideUpdate = new UpdateGroup();

    inittest();
    initMesh();

    new Collide();

    // initLight();


}
function onWindowResize() {
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
}
function animate() {
    requestAnimationFrame(animate);
    var delta = clock.getDelta();
    TWEEN.update();

    needUpdate.update(delta);
    collideUpdate.update(delta);

    control3D.update();
    render();
    renderTest();
}
function render() {
    renderer.render(scene, camera);

}
function initLight() {
    var light = new THREE.AmbientLight(0x111111); // soft white light
    scene.add(light);
}


function Control2D(camera2d) {
    container.addEventListener('mousemove', mouseMove, false);
    container.addEventListener('mousedown', mouseDown, false);
    container.addEventListener('mouseup', mouseUp, false);
    container.addEventListener('mousewheel', onMouseWheel, false);
    container.addEventListener('contextmenu', onContextMenu, false);
    this.initPos = new THREE.Vector3();
    this.camera = camera2d;
    this.initPos.copy(this.camera.position);
    this.isMouseDown = false;
    this.button = -1;
    this.lastVec = new THREE.Vector2();
    this.vec = new THREE.Vector2();
    this.enabled = true;
    this.reset = function () {
        this.camera.position.copy(this.initPos);
        this.camera.zoom = 1;
        camera.updateProjectionMatrix();
    }
    this.remove = function () {
        container.removeEventListener('mousemove', mouseMove);
        container.removeEventListener('mousedown', mouseDown);
        container.removeEventListener('mouseup', mouseUp);
        container.removeEventListener('mousewheel', mouseWheel);
        container.removeEventListener('contextmenu', onContextMenu, false);

    }
}
function onContextMenu(evt) {
    event.preventDefault();
    event.stopPropagation();
}
function onMouseWheel(event) {
    if (!control2D.enabled) return;
    control2D.camera.zoom += 0.001 * event.wheelDeltaY;
    //     console.log(control2D.camera.zoom);
    control2D.camera.updateProjectionMatrix();
}
function mouseMove(event) {
    if (!control2D.enabled) return;

    event.preventDefault();
    event.stopPropagation();
    if (control2D.isMouseDown && control2D.button == 2) {
        control2D.vec.set(event.clientX, event.clientY);
        control2D.vec.sub(control2D.lastVec);
        control2D.camera.position.x -= control2D.vec.x / control2D.camera.zoom;
        control2D.camera.position.y += control2D.vec.y / control2D.camera.zoom;
        control2D.camera.updateProjectionMatrix();
        control2D.lastVec.set(event.clientX, event.clientY);
    }
}
function mouseDown(event) {
    if (!control2D.enabled) return;
    event.preventDefault();
    control2D.isMouseDown = true;
    control2D.button = event.button;
    control2D.lastVec.set(event.clientX, event.clientY);
}
function mouseUp(event) {
    if (!control2D.enabled) return;
    event.preventDefault();
    control2D.button = -1;
    control2D.isMouseDown = false;
}



function initMesh() {
    var gridHelper = new THREE.GridHelper(1000, 10);
    scene.add(gridHelper);
    gridHelper = new THREE.GridHelper(1000, 10);
    gridHelper.rotation.x = Math.PI / 2;
    scene.add(gridHelper);

    //gun
    loader = new THREE.GLTFLoader();
    loader.load('/assets/lastBattle/cannon.gltf', loadGunOk);

    new Border(-320, 320, 480, 0);
    //satellite
    loader.load('/assets/lastBattle/satellite.gltf', loadSatOk);

    new BLine();
    new Explode();

}
// let testExplode;
function Explode() {
    loader.load('/assets/lastBattle/explode.gltf', loadExplodeOk);
    let source
    let id = 0;
    function loadExplodeOk(src) {
        source = src;
        // //test
        // testExplode = Explode.create();
        // scene.add(testExplode.scene);
        // testExplode.scene.position.set(100, 200, 20);
        // resetAllAndPlay.call(testExplode) 
    }
    let pool = [];
    Explode.get = function () {
        return pool;
    }
    Explode.create = function () {
        if (!source) return null;
        let explode;
        if (pool.length > 0) {
            explode = pool.pop();
        }
        else {
            explode = cloneGltf(source);
            explode.mixer = new THREE.AnimationMixer(explode.scene);
            explode.mixer.addEventListener('finished', function (evt) {
                Explode.reclaim(explode);
            });
            setLoopOnce.call(explode);
            canDisplayWire.call(explode);
            explode.begin = function beginExplode(pos) {
                scene.add(explode.scene);
                explode.scene.scale.set(0.3, 0.3, 1);
                explode.scene.position.set(pos.x, pos.y, 20);
                resetAllAndPlay.call(explode);
            }
        }
        explode.scene.name = "explode" + id++;
        needUpdate.push(explode.mixer);
        return explode;
    }
    Explode.reclaim = function (explode) {
        pool.push(explode);
        scene.remove(explode.scene);
        needUpdate.remove(explode.mixer);
    }
}
function BLine() {
    let pool = [];
    BLine.create = function (sat) {
        let bLine;
        if (pool.length > 0) {
            bLine = pool.pop();
        }
        else {
            var material = new THREE.LineBasicMaterial({
                color: 0xff0000,
            });
            var geometry = new THREE.Geometry();
            geometry.vertices.push(
                bottomLeft,
                topLeft,
                topRight,
                bottomRight,
                bottomLeft

            );
            bLine = new THREE.Line(geometry, material);
        }
        let pos = sat.scene.position;
        bLine.update = function () {
            bLine.position.set(pos.x, pos.y, 10);
        }
        bLine.update();
        group_bLines.add(bLine);
        sat.bLine = bLine;
        return bLine;

    }
    BLine.reclaim = function (bLine) {
        pool.push(bLine);
        group_bLines.remove(bLine);
    }
}
function setLoopOnce() {
    for (let i = 0; i < this.animations.length; i++) {
        let clip = this.animations[i];
        let action = this.mixer.clipAction(clip);
        action.setLoop(THREE.LoopOnce);
        action.clampWhenFinished = false;
    }
}
function canDisplayWire() {
    this.scene.traverse(function (child) {
        if (child instanceof THREE.Mesh) {
            wireGroup.push(child);
        }
    });
}
function resetAllAndPlay() {
    for (let i = 0; i < this.animations.length; i++) {
        let clip = this.animations[i];
        let action = this.mixer.clipAction(clip);
        action.reset();
        action.play();
    }
}
function SatelliteMaker(source) {
    //boundingBox
    let wid = 30;
    let hei = 30;
    let hwid = wid / 2;
    let hhei = hei / 2;
    let topLeft = new THREE.Vector3(-hwid, hhei, 0);
    let bottomLeft = new THREE.Vector3(-hwid, -hhei, 0);
    let topRight = new THREE.Vector3(hwid, hhei, 0);
    let bottomRight = new THREE.Vector3(hwid, -hhei, 0);

    let liveBBoxs = [];//collisionTest
    liveBBoxs.remove = removeElemtFromArray;
    SatelliteMaker.getLivingBBoxs = function () {
        return liveBBoxs;
    }

    //pool
    let num = 0;
    let maxNum = 3;
    let pool = [];
    let id = 0;
    SatelliteMaker.create = function createSatellites() {
        let sat;
        if (pool.length > 0) {
            sat = pool.pop();
        }
        else {
            num++;
            if (num > maxNum) {
                num = maxNum;
                return null;
            }
            sat = cloneGltf(source);
            let animations = sat.animations;
            sat.mixer = new THREE.AnimationMixer(sat.scene);
            setLoopOnce.call(sat);

            //addtoWireGroup
            canDisplayWire.call(sat);

            //addboundingBox
            sat.bBox = [
                [bottomRight, bottomLeft],
                [bottomLeft, topLeft],
                [topLeft, topRight],
                [topRight, bottomRight]
            ];
            sat.bBox.host = sat;
            //ability
            sat.flash = function satelliteFlash() {
                resetAllAndPlay.call(sat);
            }
            sat.launch = function satelliteLaunch() {
                sat.place(500, 400, 0);
                let goal = -500;
                let duration = 10000;
                sat.tween = new TWEEN.Tween(sat.scene.position)
                    .to({ x: goal }, duration)
                    .start()
                    .onUpdate(function (obj) {
                        sat.bLine.update();
                    })
                    .onComplete(function () {
                        SatelliteMaker.reclaim(sat);
                    });


            }
            sat.place = function (x, y, z) {
                scene.add(sat.scene);
                sat.scene.position.set(x, y, z);
                sat.scene.scale.set(0.5, 0.5, 0.5);
                sat.flashInterval = setInterval(function () {
                    sat.flash();
                }, 3000)
                sat.bLine.update();
                liveBBoxs.push(sat.bBox);
            }

        }
        //init
        BLine.create(sat, bottomLeft, topLeft, topRight, bottomRight);
        sat.scene.name = "satellite" + id++;
        needUpdate.push(sat.mixer);
        return sat;

    }
    SatelliteMaker.reclaim = function reclaimSatellites(sat) {
        pool.push(sat);
        liveBBoxs.remove(sat.bBox);
        BLine.reclaim(sat.bLine)
        scene.remove(sat.scene);
        clearInterval(sat.flashInterval);
        needUpdate.remove(sat.mixer);
        sat.tween.stop();
    }
    //scheduler
    // placeOne();
    beginLaunch();

    function placeOne() {
        let sat = SatelliteMaker.create();
        sat.place(200, 200, 0);
        // sat.scene.visible = false;

    }
    function beginLaunch() {
        let count = 0;
        needUpdate.push(SatelliteMaker);
        SatelliteMaker.update = function loopLaunchSatellite(delta) {
            count += delta;
            if (count >= 5) {
                let sat = SatelliteMaker.create();
                if (sat) sat.launch();
                count = 0;
            }
        }

    }
}



function BulletsMaker() {
    //pool
    let num = 0;
    let maxNum = 15;
    let pool = [];
    //collide
    let live = [];
    live.remove = removeElemtFromArray;
    //bullet property
    let size = 2;
    BulletsMaker.getLive = function getLiveBullet() {
        return live;
    }
    id = 0;
    BulletsMaker.create = function () {
        let bullet;
        if (pool.length > 0) {
            bullet = pool.pop();
        }
        else {
            num++;
            if (num > maxNum)
                return null;
            let geometry = new THREE.CircleGeometry(size, 4);
            let material = new THREE.MeshBasicMaterial({
                color: 0xffff00,
            })
            bullet = new THREE.Mesh(geometry, material);
        }
        //collide
        bullet.direct = new THREE.Vector3();
        bullet.lastDirect = new THREE.Vector3();
        bullet.lastPosition = new THREE.Vector3();
        live.push(bullet);
        bullet.name = "bullet" + id++;

        return bullet;

    }
    BulletsMaker.reclaim = function (bullet) {
        pool.push(bullet);
        live.remove(bullet);
        scene.remove(bullet);
        bullet.tween.stop();
    }
}
function Border(left, right, top, bottom) {
    let bottomLeft = new THREE.Vector3(left, bottom, 0);
    let topLeft = new THREE.Vector3(left, top, 0);
    let topRight = new THREE.Vector3(right, top, 0);
    let bottomRight = new THREE.Vector3(right, bottom, 0);
    var material = new THREE.LineBasicMaterial({
        color: 0x0000ff
    });

    var geometry = new THREE.Geometry();
    geometry.vertices.push(
        bottomLeft,
        topLeft,
        topRight,
        bottomRight,
        bottomLeft

    );

    let line = new THREE.Line(geometry, material);
    line.position.z = 1;
    line.name = "border";
    scene.add(line);
    Border.isOut = function isOutOfBorder(obj) {
        if (obj.position.x < left ||
            obj.position.x > right ||
            obj.position.y > top ||
            obj.position.y < bottom)
            return true;
        return false;
    }
}


function loadSatOk(obj) {
    new SatelliteMaker(obj);
    //     Scheduler.add("sat", SatelliteMaker);
}
function loadGunOk(obj) {
    let model = obj.scene;
    model.name = "gunbase";
    scene.add(model);

    model.traverse(function (child) {
        if (child instanceof THREE.Mesh) {
            wireGroup.push(child);
        }
        if (child.name === "gun") {
            new Gun(child);
        }

    });
}

function Gun(gun) {
    gun.origin = new THREE.Vector3().copy(gun.position);
    needUpdate.push(Gun);
    let maxAngle = THREE.Math.degToRad(100);
    let speed = THREE.Math.degToRad(200);//per second
    let pressA = false;
    let pressD = false;
    let total = 0;

    let pressJ = false;
    let shotInterval = 0.3;
    let count = 0;
    let cannonLen = 25;
    let range = 600;
    let duration = 3000;
    let direction = new THREE.Vector3();
    new BulletsMaker();
    function fire() {
        let bullet = BulletsMaker.create();
        if (bullet == null) return;

        //bullet init position
        direction.set(0, cannonLen, 0);
        direction.applyQuaternion(gun.quaternion).add(gun.origin);
        bullet.position.copy(direction);
        bullet.position.z = -10;

        //bullet target
        direction.set(0, range, 0);
        direction.applyQuaternion(gun.quaternion).add(gun.origin);

        scene.add(bullet);
        bullet.tween = new TWEEN.Tween(bullet.position)
            .to({ x: direction.x, y: direction.y }, duration)
            .start()
            .onComplete(function () {
                BulletsMaker.reclaim(bullet);
            });

        //collide
        bullet.lastPosition.copy(bullet.position);
        bullet.lastPosition.z = 0;
        bullet.direct.copy(direction.normalize());
        bullet.direct.z = 0;
        bullet.lastDirect.copy(bullet.direct);

        //gun recoil target
        direction.set(0, -5, 0);
        direction.applyQuaternion(gun.quaternion).add(gun.origin);
        gun.position.copy(direction);
        if (gun.recoil)
            gun.recoil.stop();
        gun.recoil = new TWEEN.Tween(gun.position)
            .to({ x: gun.origin.x, y: gun.origin.y }, shotInterval * 1000)
            .start()
            .onComplete(function () {
                gun.position.copy(gun.origin);
            });
    }
    Gun.update = function updateGunControl(deltaTime) {
        let delta = deltaTime * speed;
        if (pressA) {
            total += delta;
            if (total >= maxAngle)
                total = maxAngle;
        }
        if (pressD) {
            total -= delta;
            if (total <= -maxAngle)
                total = -maxAngle;
        }
        gun.rotation.z = total;
        if (pressJ) {
            if (count == 0)
                fire();
            count += deltaTime;
            if (count >= shotInterval) {
                count = 0;
            }
        }
    }
    function onKeyUp(evt) {
        switch (event.key) {
            case "a":
                pressA = false;
                break;
            case "d":
                pressD = false;
                break;
            case "j":
                pressJ = false;
                count = 0;
                break;
        }
    }
    function onKeyDown(evt) {
        switch (evt.key) {
            case "a":
                pressA = true;
                break;
            case "d":
                pressD = true;
                break;
            case "j":
                if (pressJ) return;

                pressJ = true;
                break;
        }
    }
    function focusGame() {
        let game = window.parent.game;
        game.focus();
    }
    document.addEventListener("click", focusGame, false);
    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('keyup', onKeyUp);
}
//testcollide
function Collide() {
    let bullets;
    let bBoxs;
    let checkAvailable = {};
    collideUpdate.push(checkAvailable);
    //init
    checkAvailable.update = function () {
        if (BulletsMaker.getLive && SatelliteMaker.getLivingBBoxs) {
            bullets = BulletsMaker.getLive();
            bBoxs = SatelliteMaker.getLivingBBoxs();
            collideUpdate.remove(checkAvailable);
            collideUpdate.push(Collide);
        }
    }

    let d1;
    let d2;
    let d2vec = new THREE.Vector3();
    Collide.update = function testCollide(delta) {
        if (bullets.length == 0 || bBoxs.length == 0) return;
        let i = bullets.length;
        while (i--) {
            let bullet = bullets[i];
            bullet.updateMatrixWorld();
            let testPoint = bullet.position.clone();
            testPoint.z = 0;
//             if(testInside(bBoxs))return;
            let ray = new THREE.Ray(bullet.lastPosition, bullet.lastDirect);
            d2vec.subVectors(testPoint, bullet.lastPosition);
            d2 = d2vec.lengthSq();
            if (d2 == 0) return;
            intersectBboxs(ray, bBoxs, bullet);

            bullet.lastPosition.copy(testPoint);
            bullet.lastDirect.copy(bullet.direct);
        }
    }
    let intersetPoint = new THREE.Vector3();
    let satPosRot = new THREE.Vector3();
    let quaternion = new THREE.Quaternion();
    let score = document.querySelector(".score");
    function intersectBboxs(ray, bBoxs, bullet) {
        for (let i = 0; i < bBoxs.length; i++) {
            let bBox = bBoxs[i];
            for (let j = 0; j < bBox.length; j++) {
                let segPoints = bBox[j];
                let v1 = segPoints[0].clone();
                let v2 = segPoints[1].clone();
                satPosRot.setFromMatrixPosition(bBox.host.scene.matrixWorld);
                bBox.host.scene.getWorldQuaternion(quaternion);
                satPosRot.applyQuaternion(quaternion);
                v1.add(satPosRot);
                v2.add(satPosRot);
                if (!facePoint(v1, v2, bullet.lastPosition)) continue;
                let distSq = ray.distanceSqToSegment(v1, v2, intersetPoint);
                //console.log(distSq);
                if (distSq <= 0.1) {//intersect!
                    d1 = ray.origin.clone().sub(intersetPoint).lengthSq();
                    if (d1 <= d2) {//just go through the edge
                        Explode.create().begin(bBox.host.scene.position);
                        BulletsMaker.reclaim(bullet);
                        // SatelliteMaker.reclaim(bBox.host);
                        console.log("bang");
                        return;
                    }
                }
            }
            //console.log('-----------------');
        }

    }

    function facePoint(v1, v2, p) {
        let d = (p.x - v1.x) * (v2.y - v1.y) - (p.y - v1.y) * (v2.x - v1.x);
        if (d < 0) return true;
        else return false;
    }

}


//debug
let camCord;
let wireGroup = []
let wire = false;
function inittest() {
    let cam3DBtn = document.querySelector(".cam3d");
    let cam2DBtn = document.querySelector(".cam2d");
    cam3DBtn.addEventListener("click", toCam3D);
    cam2DBtn.addEventListener("click", toCam2D);
    let resetBtn = document.querySelector(".reset");
    resetBtn.addEventListener("click", resetCam);
    camCord = document.querySelector(".camCord");

    let wireBtn = document.querySelector(".wire");
    wireBtn.addEventListener('click', changeToWire);
    let play = document.querySelector(".play");
    play.addEventListener("click", testAnimation);


}

function testAnimation() {
    resetAllAndPlay.call(testExplode);

}
function changeToWire(evt) {
    evt.stopPropagation();
    for (let i = 0; i < wireGroup.length; i++) {
        const obj = wireGroup[i];
        //             console.log(obj.name);
        if (obj.material) obj.material.wireframe = !wire;
    }
    wire = !wire;

}
function renderTest() {
    camCord.textContent = camera.position.x.toFixed(2) + "," + camera.position.y.toFixed(2) + "," + camera.position.z.toFixed(2) + "|" + camera.zoom.toFixed(2);
}
function resetCam() {
    control3D.reset();
    control2D.reset();



}

function toCam3D() {
    camera = camera3D;
    camera.updateProjectionMatrix();
    control2D.enabled = false;
    control3D.enabled = true;
}
function toCam2D() {
    camera = camera2D;
    camera.updateProjectionMatrix();
    control2D.enabled = true;
    control3D.enabled = false;

}
main();