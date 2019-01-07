

let container;
let scene, camera, renderer;
let camera2D, camera3D;
let listener;
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
        let i = group.length;
        while (i--) {
            group[i].update(delta);
        }

    }
    this.remove = function (elem) {
        removeElemtFromArray.call(group, elem);
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
    listener = new THREE.AudioListener();
    camera2D.add(listener);

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

    // create an AudioListener and add it to the camera
    new SoundEffect();

    inittest();
    initMesh();

    new Collide();

    // let segments = [
    //     [[16, -17], [-21, -17]],
    //     [[-21, -17], [-30, 37]],
    //     [[-30, 37], [25, 37]],
    //     [[25, 37], [16, -17]],
    // ];
    // let bBox = new BBox(segments);


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
function SoundEffect() {
    let soundBuffers = {};
    SoundEffect.getBuffers = function () {
        return soundBuffers;
    }
    let folder = "/assets/lastBattle/";
    let audioLoader = new THREE.AudioLoader();
    SoundEffect.add = function (name, fun) {
        audioLoader.load(folder + name, function (buffer) {
            soundBuffers[name] = buffer;
            fun(buffer);
        });
    }
    SoundEffect.replay = function (sound) {
        if (sound.buffer) {
            if (sound.isPlaying)
                sound.stop();
            sound.play();
        }
    }

    SoundEffect.schedulePlay = function (sound) {
        if (sound.buffer) {
            sound.play();
            return;
        }
        needUpdate.push(SoundEffect);
        SoundEffect.update = function check() {
            if (sound.buffer != null) {
                needUpdate.remove(SoundEffect);
                sound.play();
            }
        }

    }

    //background

    let sound = new THREE.Audio(listener);
    SoundEffect.add("background.mp3", function (buf) {
        sound.setBuffer(buf);
        sound.setLoop(true);
        sound.setVolume(0.2);
    });


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

    loader = new THREE.GLTFLoader();
    new Border(-320, 320, 480, 0);
    new Gun();
    new SatelliteMaker();
    new Explode();
    new Helicopter();

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
                SoundEffect.replay(sound);
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
    let sound = new THREE.Audio(listener);
    SoundEffect.add("explosion.wav", function (buf) {
        sound.setBuffer(buf);
        sound.setLoop(false);
        sound.setVolume(0.5);
    });


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

function SatelliteMaker() {
    let source;
    loader.load('/assets/lastBattle/satellite.gltf', loadSatOk);
    function loadSatOk(src) {
        source = src;
    }
    //boundingBox
    let size = new THREE.Vector3(25, 25, 25);
    let liveBBoxs = new CollideGroup();
    SatelliteMaker.getLivingBBoxs = function () {
        return liveBBoxs.get();
    }

    //pool
    let num = 0;
    let maxNum = 3;
    let pool = [];
    let id = 0;
    SatelliteMaker.get = function () {
        return pool;
    }
    SatelliteMaker.create = function createSatellites() {
        if (!source) return null;
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
            sat.mixer = new THREE.AnimationMixer(sat.scene);
            setLoopOnce.call(sat);
            canDisplayWire.call(sat);

            //addboundingBox
            sat.bBox = new THREE.Box3();
            sat.bBox.host = sat;
            sat.bBox.helper = new THREE.Box3Helper(sat.bBox, 0x0000ff);
            sat.bBox.show = function () {
                group_bLines.add(sat.bBox.helper);
            }
            sat.bBox.hide = function () {
                group_bLines.remove(sat.bBox.helper);
            }
            sat.bBox.update = function () {
                sat.bBox.setFromCenterAndSize(sat.scene.position, size);
            }

            sat.scene.lastPosition = new THREE.Vector3();


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
                        sat.bBox.update();
                    })
                    .onComplete(function () {
                        SatelliteMaker.reclaim(sat);
                    });


            }
            sat.place = function (x, y, z) {
                scene.add(sat.scene);
                sat.scene.position.set(x, y, z);
                updateLastPosition.call(sat.scene);
                sat.scene.scale.set(0.4, 0.4, 0.4);
                sat.flashInterval = setInterval(function () {
                    sat.flash();
                    SoundEffect.replay(sound);
                }, 3000)
                sat.bBox.update();
                liveBBoxs.push(sat.bBox);
            }

        }
        //init

        sat.scene.name = "satellite" + id++;
        sat.bBox.show();
        needUpdate.push(sat.mixer);
        return sat;

    }

    SatelliteMaker.reclaim = function reclaimSatellites(sat) {
        pool.push(sat);
        liveBBoxs.remove(sat.bBox);
        sat.bBox.hide();
        scene.remove(sat.scene);
        clearInterval(sat.flashInterval);
        needUpdate.remove(sat.mixer);
        sat.tween.stop();
    }
    let sound = new THREE.Audio(listener);
    SoundEffect.add("camera-shutter.mp3", function (buffer) {
        sound.setBuffer(buffer);
        sound.setLoop(false);
        sound.setVolume(0.2);
    })
    //scheduler
    // placeOne();
    // beginLaunch();

    function placeOne() {
        let sat = SatelliteMaker.create();
        if (sat)
            sat.place(200, 200, 0);
        // sat.scene.visible = false;

    }
    function beginLaunch() {
        let count = 0;
        needUpdate.push(SatelliteMaker);
        SatelliteMaker.update = function loopLaunchSatellite(delta) {
            count += delta;
            if (count >= 2) {
                let sat = SatelliteMaker.create();
                if (sat) sat.launch();
                count = 0;
            }


        }

    }
}

function BBox(segments) {
    BBox.id = 0;
    let points = [];
    var material = new THREE.LineBasicMaterial({
        color: 0xff0000,
        depthTest: false
    });
    var geometry = new THREE.Geometry();
    for (let i = 0; i < segments.length; i++) {
        let segment = segments[i];
        let p1 = new THREE.Vector3(segment[0][0], segment[0][1], 0);
        let p2 = new THREE.Vector3(segment[1][0], segment[1][1], 0);
        let line = [];
        line.push(p1, p2);
        points.push(line);

        geometry.vertices.push(p1);
    }
    geometry.vertices.push(new THREE.Vector3(segments[0][0][0], segments[0][0][1], 0));//close the line

    let bLine = new THREE.Line(geometry, material);
    bLine.renderOrder = 1;
    bLine.matrixAutoUpdate = false;
    bLine.name = "BBox" + BBox.id++;
    this.show = function () {
        scene.add(bLine)
    }
    this.hide = function () {
        scene.remove(bLine);
    }
    // this.show();

    this.attach = function (obj) {
        this.host = obj;
        obj.bBox = this;
        bLine.name += "-" + obj.name;
    }
    this.update = function () {
        this.host.updateMatrixWorld();
        bLine.matrix.copy(this.host.matrixWorld);

    }
    this.getSgmt = function () {
        return points;
    }
}
function Helicopter() {
    loader.load('/assets/lastBattle/helicopter.gltf', loadok);
    let source;
    function loadok(src) {
        source = src;
    }
    let pool = [];
    Helicopter.get = function getHelicopterPool() {
        return pool;
    }
    let live = new CollideGroup();
    Helicopter.getLiving = function () {
        return live.get();
    }

    let id = 0;
    Helicopter.create = function createHelicopter() {
        if (!source) return null;
        let helicopter;
        if (pool.length > 0) {
            helicopter = pool.pop();
        }
        else {
            helicopter = cloneGltf(source);
            helicopter.mixer = new THREE.AnimationMixer(helicopter.scene);
            canDisplayWire.call(helicopter);
            helicopter.scene.lastPosition = new THREE.Vector3();
            helicopter.scene.lastRotation = new THREE.Vector3();
            helicopter.scene.lastScale = new THREE.Vector3();
        }

        helicopter.scene.name = "helicopter" + id++;
        needUpdate.push(helicopter.mixer);

        let segments = [
            [[16, -17], [-21, -17]],
            [[-21, -17], [-30, 37]],
            [[-30, 37], [25, 37]],
            [[25, 37], [16, -17]],
        ];
        let bBox = new BBox(segments);
        bBox.attach(helicopter.scene);
        live.push(helicopter.scene);
        return helicopter;
    }

    Helicopter.place = function placeHelicopter(helicopter, pos) {
        helicopter.scene.position.copy(pos);
        helicopter.scene.rotation.z = -0.3;
        updateLast.call(helicopter.scene);
        resetAllAndPlay.call(helicopter);
        scene.add(helicopter.scene);

        SoundEffect.schedulePlay(sound);

        if (helicopter.bBox)
            helicopter.bBox.update();
        // SoundEffect.replay(sound);


    }
    Helicopter.reclaim = function reclaimHelicopter(helicopter) {
        pool.push(helicopter);
        scene.remove(helicopter.scene);
        needUpdate.remove(helicopter.mixer);
        live.remove(helicopter.scene);
    }

    let sound = new THREE.Audio(listener);
    SoundEffect.add("helicopter.mp3", function (buffer) {
        sound.setBuffer(buffer);
        sound.name = name;
        sound.setLoop(true);
        sound.setVolume(0.2);
    })

    //schedule------
    // test();
    oneLToR();

    function oneLToR() {
        if (source == null) {
            Helicopter.update = function () {
                if (source != null) {
                    needUpdate.remove(Helicopter);
                    let helicopter = Helicopter.create();
                    helicopter.scene.scale.set(0.5, 0.5, 0.5);
                    Helicopter.place(helicopter, new THREE.Vector3(-200, 200, 0));

                    let param = { posX: -200, posY: 200, scaleX: 0.5, scaleY: 0.5, scaleZ: 0.5, rotZ: 0 };

                    new TWEEN.Tween(param)
                        .to({ posX: 200, posY: 50, scaleX: 1.5, scaleY: 1.5, scaleZ: 1.5, rotZ: 20 }, 10000)
                        .repeat(Infinity)
                        .start()
                        .onUpdate(function (obj) {
                            helicopter.scene.position.x = param.posX;
                            helicopter.scene.position.y = param.posY;
                            helicopter.scene.scale.set(param.scaleX, param.scaleY, param.scaleZ);
                            helicopter.scene.rotation.z = param.rotZ;
                            helicopter.scene.bBox.update();
                        })
                        .onStart(function (obj) {
                            helicopter.scene.bBox.show();
                            helicopter.scene.bBox.update();
                        });
                  
                }
            }
            needUpdate.push(Helicopter);
        }
    }
    function test() {
        if (source == null) {
            Helicopter.update = function () {
                if (source != null) {
                    needUpdate.remove(Helicopter);
                    let helicopter = Helicopter.create();
                    helicopter.scene.scale.set(0.5, 0.5, 0.5);
                    Helicopter.place(helicopter, new THREE.Vector3(200, 200, 0));

                }
            }
            needUpdate.push(Helicopter);
        }

    }
}

function BulletsMaker() {
    //pool
    let num = 0;
    let maxNum = 20;
    let pool = [];
    BulletsMaker.get = function () {
        return pool;
    }
    //collide
    let live = new CollideGroup()
    let size = 2;
    BulletsMaker.getLive = function getLiveBullet() {
        return live.get();
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
                depthTest: false
            })
            bullet = new THREE.Mesh(geometry, material);
            bullet.renderOrder = 2;

            var trackMat = new THREE.LineBasicMaterial({
                color: 0xff00ff,
                depthTest: false
            });

            let MAX_POINTS = 2;
            var trackGeo = new THREE.BufferGeometry();
            var positions = new Float32Array(MAX_POINTS * 3); // 3 vertices per point
            trackGeo.addAttribute('position', new THREE.BufferAttribute(positions, 3));



            bullet.track = new THREE.Line(trackGeo, trackMat);
            bullet.track.renderOrder = 3;
            bullet.track.name = "track" + bullet.name;
            bullet.showTrack = function () {
                scene.add(bullet.track);
            }
            bullet.hideTrack = function () {
                scene.remove(bullet.track);
            }
            let index = 0;
            bullet.resetTrack = function () {
                index = 0;
            }
            bullet.updateTrack2 = function (offsetLast) {
                positions[0] = offsetLast.x;
                positions[1] = offsetLast.y;
                positions[2] = offsetLast.z;
                positions[3] = bullet.position.x;
                positions[4] = bullet.position.y;
                positions[5] = bullet.position.z;
                bullet.track.geometry.attributes.position.needsUpdate = true;

            }
           

        }
        //collide
        bullet.lastPosition = new THREE.Vector3();
        bullet.showTrack();

        live.push(bullet);
        bullet.name = "bullet" + id++;

        return bullet;

    }

    BulletsMaker.reclaim = function (bullet) {
        pool.push(bullet);
        live.remove(bullet);
        scene.remove(bullet);
        bullet.tween.stop();
        bullet.hideTrack();
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
}


function Gun() {
    let gun;
    loader.load('/assets/lastBattle/cannon.gltf', loadGunOk);
    function loadGunOk(obj) {
        let model = obj.scene;
        model.scale.set(0.7, 0.7, 0.7);
        model.updateMatrixWorld();
        model.name = "gunbase";
        scene.add(model);

        model.traverse(function (child) {
            if (child instanceof THREE.Mesh) {
                wireGroup.push(child);
            }
            if (child.name === "gun") {
                gun = child;
                initGun();
            }

        });
    }
    function initGun() {
        gunOldPos.copy(gun.position);
        gun.origin = new THREE.Vector3();
        gun.origin.setFromMatrixPosition(gun.matrixWorld);
        gun.origin.z = 0;
        needUpdate.push(Gun);
        new BulletsMaker();
    }


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
    let duration = 1000;
    let direction = new THREE.Vector3();

    let gunOldPos = new THREE.Vector3();
    function fire() {
        let bullet = BulletsMaker.create();
        if (bullet == null) return;

        //bullet init position
        direction.set(0, cannonLen, 0);
        direction.applyQuaternion(gun.quaternion)
        direction.add(gun.origin);
        bullet.position.copy(direction);
        updateLastPosition.call(bullet);
        bullet.resetTrack();
        //bullet target
        direction.set(0, range, 0);
        direction.applyQuaternion(gun.quaternion)
        direction.add(gun.origin);

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

        //gun recoil target

        direction.set(0, -5, 0);
        direction.applyQuaternion(gun.quaternion).add(gunOldPos);
        gun.position.copy(direction);
        if (gun.recoil)
            gun.recoil.stop();
        gun.recoil = new TWEEN.Tween(gun.position)
            .to({ x: gunOldPos.x, y: gunOldPos.y }, shotInterval * 1000)
            .start()
            .onComplete(function () {
                gun.position.copy(gunOldPos);
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
function CollideGroup() {
    let group = [];
    this.get = function () {
        return group;
    }
    this.push = function (obj) {
        group.push(obj);
    }
    this.remove = function (obj) {
        removeElemtFromArray.call(group, obj);
    }
}
function updateLastPosition() {
    this.lastPosition.copy(this.position);
}
function updateLast() {
    this.lastPosition.copy(this.position);
    this.lastRotation.copy(this.rotation);
    this.lastScale.copy(this.scale);
}
function Collide() {
    let bullets;
    let bBoxs;//sat
    let helicopters;
    let checkAvailable = {};
    collideUpdate.push(checkAvailable);
    //init
    checkAvailable.update = function () {

        if (BulletsMaker.getLive &&
            SatelliteMaker.getLivingBBoxs &&
            Helicopter.getLiving) {
            bullets = BulletsMaker.getLive();
            bBoxs = SatelliteMaker.getLivingBBoxs();
            helicopters = Helicopter.getLiving();
            collideUpdate.remove(checkAvailable);
            collideUpdate.push(Collide);
        }
    }

    let d1;
    let d1vec = new THREE.Vector3();
    let d2;
    let d2vec = new THREE.Vector3();
    let intersetPoint = new THREE.Vector3();
    let lastDirect = new THREE.Vector3();
    let testPoint = new THREE.Vector3();
    let offset = new THREE.Vector3();
    let offsetLast = new THREE.Vector3();


    let v1 = new THREE.Vector3();
    let v2 = new THREE.Vector3();
    let deltaPos = new THREE.Vector3();
    let deltaRot;
    let deltaScl = new THREE.Vector3();
    let quaternion = new THREE.Quaternion();
    let axisZ = new THREE.Vector3(0, 0, 1);
    let matrix = new THREE.Matrix4();
    let ray = new THREE.Ray();

    let zero = new THREE.Vector3();
    let up = new THREE.Vector3(0, 1, 0);
    function bullet_helicopter() {
        if (bullets.length == 0 || helicopters.length == 0) return;

        let i = bullets.length;
        while (i--) {
            let bullet = bullets[i];
            if (bullet.position.equals(bullet.lastPosition)) continue;
            testPoint.copy(bullet.position);

            let j = helicopters.length;
            while (j--) {
                let helicopter = helicopters[j];
                //delta matrix
                deltaPos.subVectors(helicopter.position, helicopter.lastPosition);
                deltaRot = helicopter.rotation.z - helicopter.lastRotation.z;
                deltaScl.copy(helicopter.scale);
                deltaScl.divide(helicopter.lastScale);
                quaternion.setFromAxisAngle(axisZ, deltaRot);
                matrix.compose(deltaPos, quaternion, deltaScl);

                offset.subVectors(bullet.lastPosition, helicopter.lastPosition)
                offset.applyMatrix4(matrix);
                offsetLast.addVectors(helicopter.lastPosition, offset)
               
                bullet.updateTrack2(offsetLast);//track
                lastDirect.subVectors(testPoint, offsetLast).normalize();
                ray.origin.copy(offsetLast);
                ray.direction.copy(lastDirect);
                d2vec.subVectors(testPoint, offsetLast);
                d2 = d2vec.lengthSq();

                helicopter.updateMatrixWorld();
                let segments = helicopter.bBox.getSgmt();
                let hit = false;
                for (let k = 0; k < segments.length; k++) {
                    let sgmt = segments[k];
                    v1.copy(sgmt[0]);
                    v2.copy(sgmt[1]);

                    v1.applyMatrix4(helicopter.matrixWorld);
                    v2.applyMatrix4(helicopter.matrixWorld);
                    if (!facePoint(v1, v2, offsetLast)) continue;

                    let distSq = ray.distanceSqToSegment(v1, v2, intersetPoint);

                    if (distSq <= 0.1) {
                        d1 = ray.origin.clone().sub(intersetPoint).lengthSq();
                        if (d1 <= d2) {
                            BulletsMaker.reclaim(bullet);
                            hit = true;
                            break;

                        }
                    }
                }
                if (hit == true) break;
            }
            // console.log('--------------')
        }
    }
    function bullet_sat() {
        if (bullets.length != 0 || bBoxs.length != 0) {
            let i = bullets.length;
            while (i--) {
                let bullet = bullets[i];
                testPoint.set(bullet.position.x, bullet.position.y, 0);//z=0

                let j = bBoxs.length;
                while (j--) {
                    let bBox = bBoxs[j];
                    offset.subVectors(bBox.host.scene.position, bBox.host.scene.lastPosition)
                    offsetLast.addVectors(bullet.lastPosition, offset);
                    lastDirect.subVectors(testPoint, offsetLast).normalize();
                    let raycaster = new THREE.Raycaster(offsetLast, lastDirect);
                    let interset = raycaster.ray.intersectBox(bBox, intersetPoint);
                    if (interset) {
                        d1vec.subVectors(interset, offsetLast);
                        d1 = d1vec.lengthSq()
                        d2vec.subVectors(testPoint, offsetLast);
                        d2 = d2vec.lengthSq();
                        if (d1 <= d2) {//just go through the edge
                            Explode.create().begin(bBox.host.scene.position);
                            BulletsMaker.reclaim(bullet);
                            SatelliteMaker.reclaim(bBox.host);
                            continue;
                        }
                    }
                }
            }
        }
    }
    Collide.update = function testCollide(delta) {
        bullet_sat();
        bullet_helicopter();
        //update lastPosition
        let i;
        i = bullets.length; while (i--) { updateLastPosition.call(bullets[i]); }
        i = bBoxs.length; while (i--) { updateLastPosition.call(bBoxs[i].host.scene); }
        i = helicopters.length; while (i--) { updateLast.call(helicopters[i]); }
    }


}
function facePoint(v1, v2, p) {
    return (p.x - v1.x) * (v2.y - v1.y) - (p.y - v1.y) * (v2.x - v1.x)<0;
    // if (d < 0) return true;
    // else return false;
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