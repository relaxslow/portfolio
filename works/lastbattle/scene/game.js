let destroyHelicopter = 0, destroySatellite = 0, destroyWalkingBomb = 0;
window.getStatisticalData = function () {
    return [
        destroyHelicopter,
        destroySatellite,
        destroyWalkingBomb,
        score
    ];

}
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
let group_bLines; //boundingBox line
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
    let index = this.indexOf(elem);
    if (index == -1) return;
    this.splice(this.indexOf(elem), 1);
}
function RenderList() {
    let renderList = [];
    RenderList.render = function () {
        for (let i = 0; i < renderList.length; i++) {
            let render = renderList[i];
            render();
        }
    }
    RenderList.push = function (renderfun) {
        renderList.push(renderfun);
    }
    RenderList.remove = function (renderfun) {
        renderList.splice(renderList.indexOf(elem), 1);
    }
}

function main() {
    init();
    animate();

}

function init() {
    container = document.querySelector(".container");
    var frustumSize = 500;
    var aspect = container.clientWidth / container.clientHeight;
    camera2D = new THREE.OrthographicCamera(frustumSize * aspect / -2, frustumSize * aspect / 2, frustumSize / 2, frustumSize / -2, 1, 1000);
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
    needUpdate.name = "needUpdate";
    collideUpdate = new UpdateGroup();
    collideUpdate.name = "collideUpdate";
    // create an AudioListener and add it to the camera
    new SoundEffect();


    initMesh();

    new Collide();

    new RenderList();
    RenderList.push(render);

    // inittest();
    subscribeTestReady();

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
    RenderList.render();

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
    let allSound = [];
    SoundEffect.add = function (name, fun) {
        let sound = new THREE.Audio(listener);
        sound.maxVolume = 1;
        sound.setMaxVolume = function (value) {
            sound.maxVolume = value;
            sound.setVolume(value);
        }
        allSound.push(sound);
        audioLoader.load(folder + name, function (buffer) {
            soundBuffers[name] = buffer; //?
            sound.setBuffer(buffer);
            sound.name = name;
            fun(sound);
        });


        return sound;
    }
    SoundEffect.replay = function (sound) {
        if (sound.buffer) {
            if (sound.isPlaying)
                sound.stop();
            sound.play();
        }
    }

    // let volume = 1;
    SoundEffect.setVolume = function adjustVolume(value) {
        for (let i = 0; i < allSound.length; i++) {
            let sound = allSound[i];
            sound.setVolume(value * sound.maxVolume);
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

    // SoundEffect.add("background.mp3", function (sound) {
    //     sound.setLoop(true);
    //     sound.setMaxVolume(0.2);
    //     sound.play();
    // });


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

    //     event.preventDefault();
    //     event.stopPropagation();
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
    //     event.preventDefault();
    control2D.isMouseDown = true;
    control2D.button = event.button;
    control2D.lastVec.set(event.clientX, event.clientY);
}

function mouseUp(event) {
    if (!control2D.enabled) return;
    //     event.preventDefault();
    control2D.button = -1;
    control2D.isMouseDown = false;
}


let hq;
function initMesh() {
    var gridHelper = new THREE.GridHelper(1000, 10);
    scene.add(gridHelper);
    gridHelper = new THREE.GridHelper(1000, 10);
    gridHelper.rotation.x = Math.PI / 2;
    scene.add(gridHelper);

    loader = new THREE.GLTFLoader();
    // new Border(-320, 320, 480, 0);
    new Gun();

    new SatelliteMaker();
    new Effect();
    new HelicopterMaker();
    new WalkingBombMaker();
    hq = new EnemyHeadquater();
}
function EnemyHeadquater() {
    let command = "attack";
    EnemyHeadquater.prototype.getCommand = function () {
        return command;
    }
    EnemyHeadquater.prototype.setCommand = function (value) {
        command = value;
    }
}
// let testExplode;
function Effect() {
    loader.load('/assets/lastBattle/explode.gltf', loadOk);
    let sources = {};
    let effects = [
        {
            name: "explode",
            sound: "explosion.wav",
            volume: 0.3,
            scale: 0.3
        },
        {
            name: "spark",
            sound: "spark.mp3",
            volume: 0.1,
            scale: 0.5
        },
        {
            name: "groundExplode",
            sound: "groundExplode.mp3",
            volume: 0.3,
            scale: 1
        }
    ]
    let id = 0;

    function loadOk(gltf) {
        for (let i = 0; i < effects.length; i++) {
            let name = effects[i].name;
            let src = {};
            src.name = name;
            src.scene = gltf.scene.getObjectByName(name);
            src.animations = [];
            for (let i = 0; i < gltf.animations.length; i++) {
                let clip = gltf.animations[i];
                if (clip.name.indexOf(name) !== -1) {
                    src.animations.push(clip);
                }

            }
            src.sound = SoundEffect.add(effects[i].sound, function (sound) {
                sound.setLoop(false);
                sound.setMaxVolume(effects[i].volume);
            });
            src.scale = 1;
            if (effects[i].scale) src.scale = effects[i].scale;
            sources[name] = src;
            gltf.scene.remove(sources[name]);

            pool[name] = [];
        }

        let ss = gltf.scene.getObjectByName("ss");
        ss.visible = false;
        let groundExplode = sources["groundExplode"];
        for (let i = 0; i < groundExplode.animations.length; i++) {
            let clip = groundExplode.animations[i];
            if (clip.name === "groundExplode_2") {

                var times = [0 / 24, 11 / 24], values = [true, false];
                var trackName = 'ss.visible';
                var track = new THREE.BooleanKeyframeTrack(trackName, times, values);

                clip.tracks.push(track);
                clip.resetDuration();

            }
            if (clip.name === "groundExplode.002") {

                var times = [0 / 24, 6 / 24, 23 / 24], values = [false, true, false];
                var trackName = 'Plane.012.visible';
                var track = new THREE.BooleanKeyframeTrack(trackName, times, values);

                clip.tracks.push(track);
                clip.resetDuration();

            }
        }


        // //test
        // testExplode = Effect.create();
        // scene.add(testExplode.scene);
        // testExplode.scene.position.set(100, 200, 20);
        // resetAllAndPlay.call(testExplode) 
    }
    let pool = {};
    Effect.getPool = function () {
        return pool;
    }
    Effect.create = function (type) {
        let source = sources[type]
        if (!source) return null;
        let effect;
        if (pool[type].length > 0) {
            effect = pool[type].pop();
        } else {
            effect = cloneGltf(source);
            effect.sound = source.sound;
            effect.mixer = new THREE.AnimationMixer(effect.scene);
            initAction.call(effect);
            setLoopOnce.call(effect);
            canDisplayWire.call(effect);

            effect.reclaim = function () {
                pool[type].push(effect);
                scene.remove(effect.scene);
                needUpdate.remove(effect.mixer);
                effect.mixer.removeEventListener('finished', finish);
            }
            let count = 0;
            function finish(evt) {
                count++;
                if (count >= effect.animations.length)
                    effect.reclaim();
            }
            effect.place = function beginExplode(pos) {
                effect.placeXY(pos.x, pos.y);
            }
            effect.placeXY = function placeXY(x, y) {
                count = 0;
                effect.scene.name = "effect" + id++;
                effect.mixer.name = "mixer_" + effect.scene.name;
                effect.name = "root_" + effect.scene.name;
                effect.mixer.addEventListener('finished', finish);

                needUpdate.push(effect.mixer);
                scene.add(effect.scene);

                effect.scene.scale.set(source.scale, source.scale, 1);
                effect.scene.position.set(x, y, 10);
                resetAllAndPlay.call(effect);
                SoundEffect.replay(effect.sound);
            }

        }

        return effect;
    }




}
function loopAndGone(action) {
    action.setLoop(THREE.LoopRepeat);
    action.clampWhenFinished = true;
}
function loopOnceStopAtLastFrame(action) {
    action.setLoop(THREE.LoopOnce);
    action.clampWhenFinished = true;
}

function loopOnce(action) {
    action.setLoop(THREE.LoopOnce);
    action.clampWhenFinished = false;
}
function loopOnceAndGone(action) {
    action.setLoop(THREE.LoopOnce);
    action.clampWhenFinished = true;
}
function setLoopOnce() {
    for (let key in this.actions) {
        let action = this.actions[key];
        loopOnceAndGone(action);
    }
}

function putInWireGroup(child) {
    if (child instanceof THREE.Mesh) {
        wireGroup.push(child);
    }
}

function canDisplayWire() {
    this.scene.traverse(function (child) {
        putInWireGroup(child);
    });
}

function initAction() {
    this.actions = {};
    for (let i = 0; i < this.animations.length; i++) {
        let clip = this.animations[i];
        let action = this.mixer.clipAction(clip);
        this.actions[clip.name] = action;
    }
}

function stopAllAction() {
    for (let key in this.actions) {
        let action = this.actions[key];
        action.stopFading();
        action.stop();

    }
}
function resetAndPlay(name) {
    let action = this.actions[name];
    //     fadeToAction(name,2);
    action.stop();
    action.play();
}
function fadeToAction(name, duration) {
    this.previousAction = this.activeAction;
    this.activeAction = this.actions[name];
    if (this.previousAction && this.previousAction !== this.activeAction) {

        this.previousAction.fadeOut(duration);
    }
    this.activeAction
        .reset()
        .setEffectiveTimeScale(1)
        .setEffectiveWeight(1)
        .fadeIn(duration)
        .play();
}
function resetAllAndPlay() {
    for (let key in this.actions) {
        let action = this.actions[key];
        action.stop();
        action.play();
    }
}
function defaultDamage(value, intersetPoint, effectName) {
    this.hp -= value;
    if (this.hp <= 0) {
        Effect.create(effectName).place(this.scene.position);
        this.reclaim();
    }
    else
        Effect.create("spark").place(intersetPoint);
}

let score = 0;
let score_ui = document.querySelector(".score");
function addScore(value) {

    score += value;
    score_ui.textContent = score;
    jumpNumber(score_ui, 1.5, 1);


}
function damage(value, intersetPoint, partName) {
    if (this.damage) //custom damage function
        this.damage(value, intersetPoint, partName);
    else {//default damage function
        defaultDamage.call(this, value, intersetPoint, "explode");
        addScore(1);
    }

}

function groundExplode() {
    Effect.create("groundExplode").place(this.scene.position);
    this.reclaim();
}
function explode() {
    Effect.create("explode").place(this.scene.position);
    this.reclaim();
}

function SatelliteMaker() {
    function Satellite() {
        sat = cloneGltf(source);
        sat.mixer = new THREE.AnimationMixer(sat.scene);
        initAction.call(sat);
        setLoopOnce.call(sat);
        canDisplayWire.call(sat);
        initBBox();

        sat.getType = function () {
            return type;
        }
        sat.reclaim = function () {
            pool.push(sat);
            scene.remove(sat.scene);
            needUpdate.remove(sat.mixer);
            live.remove(sat);

            sat.scene.bBox.hide();
            clearInterval(this.flashInterval);
            //                 sat.tween.kill();
            sat.tween.stop();
        }
        sat.place = function (x, y) {
            sat.scene.name = sat.type + id++;
            sat.mixer.name = "mixer_" + sat.scene.name;
            sat.name = "root_" + sat.scene.name;
            needUpdate.push(sat.mixer);
            scene.add(sat.scene);
            live.push(sat);

            sat.scene.position.set(x, y, 0);
            sat.scene.scale.set(0.4, 0.4, 0.4);
            //set init transform befoe update last
            updateLast.call(sat.scene);
            sat.hp = 10;
            sat.flashInterval = setInterval(function () {
                sat.flash();
                SoundEffect.replay(sound);
            }, 3000)


            activeBBox();

        }
        function activeBBox() {
            // sat.scene.bBox.show();
            sat.scene.bBox.update();
            sat.BBoxUpdate = { name: "updateBBox_" + sat.name }
            sat.BBoxUpdate.update = function (delta) {
                sat.scene.bBox.update();
            }
            needUpdate.push(sat.BBoxUpdate);
        }

        sat.flash = function satelliteFlash() {
            resetAllAndPlay.call(sat);
        }
        sat.launch = function satelliteLaunch() {
            sat.place(500, 450, 0);
            let goal = -500;
            let duration = 5000;
            sat.tween = new TWEEN.Tween(sat.scene.position)
                .to({ x: goal }, duration)
                .start()
                .onComplete(function () {
                    sat.reclaim();
                });

        }
        sat.getType = function () {
            return type;
        }
        function initBBox() {
            initLast.call(sat.scene);
            //BBox
            let points = [
                [26, -29],
                [-20, -29],
                [-25, 24],
                [30, 29],

            ];
            let bBox = new BBox(points);
            bBox.attach(sat.scene);
        }
        sat.damage = function (value, intersetPoint, partName) {
            addScore(100);
            defaultDamage.call(sat, value, intersetPoint, "explode");
            destroySatellite++;
        }
        return sat;
    }
    let type = "satellite";
    let source;
    loader.load('/assets/lastBattle/satellite.gltf', loadSatOk);

    function loadSatOk(src) {
        source = src;
    }
    //boundingBox
    let live = new CollideGroup();
    SatelliteMaker.getLiving = function () {
        return live.get();
    }

    //pool
    let num = 0;
    let maxNum = 1;
    let pool = [];
    let id = 0;
    SatelliteMaker.getPool = function () {
        return pool;
    }
    SatelliteMaker.create = function createSatellites() {
        if (!source) return null;
        let sat;
        if (pool.length > 0) {
            sat = pool.pop();
        } else {
            num++;
            if (num > maxNum) {
                num = maxNum;
                return null;
            }
            sat = new Satellite();
        }

        return sat;

    }


    let sound = SoundEffect.add("camera-shutter.mp3", function (sound) {
        sound.setLoop(false);
        sound.setVolume(0.01);
    })
    //scheduler
    // placeOne();
    beginLaunch();

    function placeOne() {
        let sat = SatelliteMaker.create();
        if (sat)
            sat.place(200, 200);
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

function MultiBBox(datas) {
    BBox.id = 0;
    let lineId = 0;
    let segments = [];
    let parts = { status: {} };
    let bLines = {};
    let backup = {};
    let material = new THREE.LineBasicMaterial({
        color: 0xff0000,
        depthTest: false
    });
    for (let i = 0; i < datas.length; i++) {
        let data = datas[i];//one data one line
        let points = data.points;
        var geometry = new THREE.Geometry();
        let part = [];
        for (let i = 0; i < points.length; i++) {
            let p1, p2;
            p1 = new THREE.Vector3(points[i][0], points[i][1], 0);
            geometry.vertices.push(p1);
            if (i != points.length - 1) {
                p2 = new THREE.Vector3(points[i + 1][0], points[i + 1][1], 0);
            } else {
                if (data.type == 0) {
                    p2 = new THREE.Vector3(points[0][0], points[0][1], 0);
                }
                else if (data.type == 1) {
                    continue;
                }
            }
            let line = [];
            line.push(p1, p2);
            line.name = lineId++;
            line.partName = data.name;
            // segments.push(line);
            part.push(line)

        }
        if (data.type == 0) {
            geometry.vertices.push(new THREE.Vector3(points[0][0], points[0][1], 0));
        }


        let bLine = new THREE.Line(geometry, material);
        bLine.renderOrder = 1;
        bLine.matrixAutoUpdate = false;
        bLine.name = "BBox" + BBox.id++;
        bLines[data.name] = bLine;
        backup[data.name] = bLine;
        parts[data.name] = part;
        parts.status[data.name] = 0;
    }

    this.show = function () {
        for (let key in bLines) {
            const bLine = bLines[key];
            scene.add(bLine);
        }

    }
    this.hide = function () {
        for (let key in bLines) {
            const bLine = bLines[key];
            scene.remove(bLine);
        }


    }

    this.attach = function (obj) {
        this.host = obj;
        obj.bBox = this;
        for (let key in bLines) {
            const bLine = bLines[key];
            bLine.name += "-" + obj.name;
        }


    }
    this.update = function () {
        this.host.updateMatrixWorld(); //host must has matrix
        for (let key in bLines) {
            const bLine = bLines[key];
            bLine.matrix.copy(this.host.matrixWorld);
        }

    }
    this.getSgmt = function () {
        return segments;
    }
    this.addPart = function (partName) {
        if (parts.status[partName] == 1) return;
        let part = parts[partName];
        let i = 0;
        while (i < part.length) {
            let line = part[i];
            segments.push(line);
            i++;
        }

        bLines[partName] = backup[partName];
        // scene.add(bLines[partName]);
        parts.status[partName] = 1;
    }
    this.removePart = function (partName) {
        if (parts.status[partName] == 0) return;
        let part = parts[partName];
        let i = part.length;
        while (i--) {
            let line = part[i];
            removeElemtFromArray.call(segments, line);
        }
        scene.remove(bLines[partName])
        delete bLines[partName];
        parts.status[partName] = 0;
    }
    this.clearPart = function () {
        segments.length = 0;
        for (let key in parts.status) {
            parts.status[key] = 0;
            scene.remove(bLines[key]);
            delete bLines[key];
        }


    }
}
function BBox(points) {
    BBox.id = 0;
    let segments = [];
    let material = new THREE.LineBasicMaterial({
        color: 0xff0000,
        depthTest: false
    });
    var geometry = new THREE.Geometry();
    for (let i = 0; i < points.length; i++) {
        let p1, p2;
        p1 = new THREE.Vector3(points[i][0], points[i][1], 0);
        if (i != points.length - 1) {
            p2 = new THREE.Vector3(points[i + 1][0], points[i + 1][1], 0);
        } else {
            p2 = new THREE.Vector3(points[0][0], points[0][1], 0);
        }
        let line = [];
        line.push(p1, p2);
        segments.push(line);

        geometry.vertices.push(p1);
    }

    geometry.vertices.push(new THREE.Vector3(points[0][0], points[0][1], 0)); //close the line

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
        this.host.updateMatrixWorld(); //host must has matrix
        bLine.matrix.copy(this.host.matrixWorld);

    }
    this.getSgmt = function () {
        return segments;
    }
}

function randomRange(min, max) {
    return min + Math.random() * (max - min);
}

function HelicopterMaker() {
    function Helicopter() {
        let helicopter = cloneGltf(source);
        helicopter.mixer = new THREE.AnimationMixer(helicopter.scene);
        initAction.call(helicopter);
        canDisplayWire.call(helicopter);
        initBBox();

        helicopter.getType = function () {
            return type;
        }
        helicopter.reclaim = function () {
            pool.push(helicopter);
            scene.remove(helicopter.scene);
            needUpdate.remove(helicopter.mixer);
            live.remove(helicopter);

            helicopter.tween.stop();
            helicopter.deactiveBBox();
            helicopter.stopDropBomb();
        }
        helicopter.placexy = function (x, y) {
            helicopter.scene.name = type + id++;
            helicopter.mixer.name = "mixer_" + helicopter.scene.name;
            helicopter.name = "root_" + helicopter.scene.name;
            needUpdate.push(helicopter.mixer);
            scene.add(helicopter.scene);
            live.push(helicopter);

            helicopter.hp = 2;
            helicopter.scene.position.set(x, y, 0);

            updateLast.call(helicopter.scene);
            resetAllAndPlay.call(helicopter);
            helicopter.activeBBox();
            if (hq.getCommand() === "attack")
                helicopter.beginDropBomb();
        }
        helicopter.activeBBox = function () {
            // helicopter.scene.bBox.show();
            helicopter.scene.bBox.update();
            helicopter.BBoxUpdate = { name: "updateBBox_" + helicopter.name }
            helicopter.BBoxUpdate.update = function (delta) {
                helicopter.scene.bBox.update();
            }
            needUpdate.push(helicopter.BBoxUpdate);

        }
        helicopter.deactiveBBox = function () {
            helicopter.scene.bBox.hide();
            needUpdate.remove(helicopter.BBoxUpdate);
        }

        helicopter.beginDropBomb = function () {
            helicopter.dropBombUpdate = { name: "updateDropBomb_" + helicopter.name };
            needUpdate.push(helicopter.dropBombUpdate);
            helicopter.dropBombUpdate.update = function (delta) {
                countDown -= delta;
                if (countDown <= 0) {
                    countDown = randomRange(0.5, 6);
                    if (!remain) return;
                    if (helicopter.scene.position.x > max || helicopter.scene.position.x < min) return;
                    WalkingBombMaker.drop(helicopter.scene.position.x, helicopter.scene.position.y);
                    remain--;
                }
            }
            let max = 300;
            let min = -300;
            let num = 2;
            let remain = num;
            let countDown = randomRange(0.5, 3);
        }
        helicopter.stopDropBomb = function () {
            needUpdate.remove(helicopter.dropBombUpdate);
        }
        function initBBox() {
            initLast.call(helicopter.scene)

            //BBox
            let points = [
                [20, -17],
                [-17, -15],
                [-42, 11],
                [-42, 35],
                [29, 37]
            ];
            let bBox = new BBox(points);
            bBox.attach(helicopter.scene);
        }
        helicopter.damage = function (value, intersetPoint, partName) {
            addScore(2);
            defaultDamage.call(helicopter, value, intersetPoint, "explode");
            destroyHelicopter++;
        }
        return helicopter;
    }
    let type = "helicopter";
    loader.load('/assets/lastBattle/helicopter.gltf', loadok);
    let source;

    function loadok(src) {
        source = src;
    }
    let pool = [];
    HelicopterMaker.getPool = function getHelicopterPool() {
        return pool;
    }
    let live = new CollideGroup();
    HelicopterMaker.getLiving = function () {
        return live.get();
    }

    let id = 0;
    HelicopterMaker.create = function createHelicopter() {
        if (!source) return null;
        let helicopter;
        if (pool.length > 0) {
            helicopter = pool.pop();
        } else {
            helicopter = new Helicopter();
        }
        return helicopter;
    }

    let sound = SoundEffect.add("helicopter.mp3", function (sound) {
        sound.setLoop(true);
        sound.setMaxVolume(0.02);
    })

    //schedule------
    // loadAndRun(test);
    // loadAndRun(oneLToR);
    randomOnBothSize();

    function randomOnBothSize() {
        needUpdate.push(HelicopterMaker);
        let minInterval = 1;
        let maxInterval = 3;
        let randomNext = randomRange(minInterval, maxInterval);
        let areaTopLeft = [
            [-500, 400, 1],
            [400, 400, -1]
        ]; //x,y,direction
        let areaWid = 100;
        let areaHei = 300;
        let max = 10;
        let scale = 0.4;



        HelicopterMaker.update = function (delta) {
            if (source == null) return;
            if (HelicopterMaker.getLiving().length >= max) return;
            randomNext = randomNext - delta;
            if (randomNext <= 0) {
                randomNext = randomRange(minInterval, maxInterval);
                let helicopter = HelicopterMaker.create();
                let randomSide = Math.round(Math.random()); //1/right or 0/left
                let beginPoint = areaTopLeft[randomSide];
                let leftOrRight = beginPoint[2]
                helicopter.scene.scale.set(scale * leftOrRight, scale, 1);
                helicopter.scene.rotation.set(0, 0, -0.3 * leftOrRight);
                let x = beginPoint[0] + randomRange(0, areaWid);
                let y = beginPoint[1] - randomRange(0, areaHei);
                let flyDist = 1000;
                let targetX = flyDist * leftOrRight;
                helicopter.placexy(x, y);
                let param = { posX: x };

                helicopter.tween = new TWEEN.Tween(param)
                    .to({ posX: x + targetX }, 10000)
                    // .repeat(Infinity)
                    .start()
                    .onUpdate(function (obj) {
                        helicopter.scene.position.x = param.posX;

                    })
                    .onComplete(function (obj) {
                        helicopter.reclaim();
                    })




            }
            //sound
            let livenum = HelicopterMaker.getLiving().length;
            if (livenum > 0 && sound.isPlaying == false) {
                sound.play();
            } else if (livenum <= 0 && sound.isPlaying == true) {
                sound.stop();
            }


        }
    }

    function oneLToR() {
        let helicopter = HelicopterMaker.create();
        helicopter.scene.scale.set(0.5, 0.5, 0.5);
        helicopter.place(new THREE.Vector3(-200, 200, 0));

        let param = { posX: -200, posY: 200, scaleX: 0.5, scaleY: 0.5, scaleZ: 0.5, rotZ: 0 };

        helicopter.tween = new TWEEN.Tween(param)
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

    function test() {
        let helicopter = HelicopterMaker.create();
        helicopter.scene.scale.set(0.5, 0.5, 0.5);
        helicopter.place(new THREE.Vector3(200, 200, 0));

    }
    HelicopterMaker.stopAllDropBomb = function () {
        let living = live.get();
        for (let i = 0; i < living.length; i++) {
            let helicopter = living[i];
            helicopter.stopDropBomb();
        }
    }

}

function runAfterLoadOk(fun) {
    let host = this;
    if (this.getSrc() == null) { //this is source
        let loadSrc = {};
        needUpdate.push(loadSrc);
        loadSrc.update = function () {
            if (host.getSrc() != null) {
                needUpdate.remove(loadSrc);
                fun();
            }
        }

    }
}

// function WalkingBomb() {

// }
function WalkingBombMaker() {
    function WalkingBomb(source) {
        let walkingBomb = cloneGltf(source);
        walkingBomb.mixer = new THREE.AnimationMixer(walkingBomb.scene);
        initAction.call(walkingBomb);
        loopOnceStopAtLastFrame(walkingBomb.actions["normal"]);
        loopOnceStopAtLastFrame(walkingBomb.actions["parachuteOpen"]);
        loopOnceStopAtLastFrame(walkingBomb.actions["parachuteClose"]);
        loopOnceStopAtLastFrame(walkingBomb.actions["standUp"]);
        loopAndGone(walkingBomb.actions["walking"])
        canDisplayWire.call(walkingBomb);
        initBBox();

        walkingBomb.reclaim = function () {
            stopAllAction.call(walkingBomb);

            pool.push(walkingBomb);
            // walkingBomb.mixer.stopAllAction();
            needUpdate.remove(walkingBomb.mixer);
            live.remove(walkingBomb);
            scene.remove(walkingBomb.scene);

            clearTimeout(walkingBomb.timer);
            walkingBomb.tween.stop();
            walkingBomb.deactiveBBox();
            id--;

        }

        walkingBomb.constantSpeedFall = function constantSpeedFall() {
            let duration = walkingBomb.scene.position.y / parachuteOnSpeed * 1000;
            walkingBomb.tween = new TWEEN.Tween(walkingBomb.scene.position)
                .to({ y: 0 }, duration)
                .start()
                .onComplete(function () {
                    walkingBomb.closeParachute();
                });
        };
        walkingBomb.openParachute = function bombOpenParachute() {
            fadeToAction.call(walkingBomb, "parachuteOpen", 0.3);
            walkingBomb.tween.stop();
            //slowDown
            walkingBomb.tween = new TWEEN.Tween(walkingBomb.scene.position)
                .to({ y: walkingBomb.scene.position.y - 30 }, 500)
                .start()
                .easing(TWEEN.Easing.Quadratic.Out)
                .onComplete(function () {
                    walkingBomb.scene.bBox.addPart("parachute");
                    walkingBomb.constantSpeedFall();
                })




        };
        walkingBomb.closeParachute = function bombCloseParachute() {
            walkingBomb.scene.bBox.removePart("parachute");
            fadeToAction.call(walkingBomb, "parachuteClose", 0.5);
            fadeToAction.call(walkingBomb, "standUp", 0.5);

            walkingBomb.timer = setTimeout(function () {
                if (hq.getCommand() === "attack") {
                    let duration = Math.abs(walkingBomb.scene.position.x) / walkSpeed * 1000;
                    fadeToAction.call(walkingBomb, "walking", 0.5);
                    walkingBomb.tween = new TWEEN.Tween(walkingBomb.scene.position)
                        .to({ x: 0 }, duration)
                        .start()
                        .onUpdate(function () {
                            if (walkingBomb.scene.position.distanceToSquared(Gun.getPosition()) <= 30 * 30) {
                                groundExplode.call(walkingBomb);
                                Gun.reduceLife(20);
                            }
                        })
                }
            }, 500)



        };
        walkingBomb.placexy = function (x, y) {
            walkingBomb.scene.name = type + id++;
            walkingBomb.mixer.name = "mixer_" + walkingBomb.scene.name;
            walkingBomb.name = "root_" + walkingBomb.scene.name;
            needUpdate.push(walkingBomb.mixer);
            scene.add(walkingBomb.scene);
            live.push(walkingBomb);

            walkingBomb.hp = 1;
            walkingBomb.scene.position.set(x, y, 0);
            walkingBomb.scene.scale.set(0.3, 0.3, 1);
            walkingBomb.scene.updateMatrixWorld();
            updateLast.call(walkingBomb.scene);
            walkingBomb.activeBBox();
        };
        walkingBomb.damage = function (value, intersetPoint, partName) {
            if (partName === "bomb") {
                let effectName;
                if (walkingBomb.scene.position.y > 0)
                    effectName = "explode";
                else
                    effectName = "groundExplode";
                defaultDamage.call(walkingBomb, value, intersetPoint, effectName)
                addScore(1);
            } else if (partName === "parachute") {
                walkingBomb.tween.stop();
                let duration = walkingBomb.scene.position.y / freefallSpeed * 1000;
                walkingBomb.tween = new TWEEN.Tween(walkingBomb.scene.position)//fall
                    .to({ y: 0 }, duration)
                    .easing(TWEEN.Easing.Quadratic.In)
                    .start()
                    .onUpdate(function () {
                        if (walkingBomb.scene.position.y <= 0) {
                            groundExplode.call(walkingBomb);
                        }
                    })
                walkingBomb.scene.bBox.removePart("parachute");

                fadeToAction.call(walkingBomb, "normal", 0.1);
                addScore(1);
            }
            destroyWalkingBomb++;
        }

        function initBBox() {
            initLast.call(walkingBomb.scene);
            let points = [
                {
                    name: "bomb",
                    type: 0,
                    points: [
                        [14, -1],
                        [-15, -1],
                        [-15, 44],
                        [0, 54],
                        [14, 44]
                    ]
                },
                {
                    name: "parachute",
                    type: 1,
                    points: [
                        [-16, 39],
                        [-68, 93],
                        [64, 93],
                        [13, 39]
                    ]
                }

            ]

            let bBox = new MultiBBox(points);
            let boneRoot = walkingBomb.scene.getObjectByName("Armature_root");
            bBox.attach(boneRoot);

            walkingBomb.scene.bBox = bBox; //testCollide

        }

        walkingBomb.activeBBox = function () {
            walkingBomb.scene.bBox.clearPart();
            walkingBomb.scene.bBox.addPart("bomb");

            walkingBomb.scene.bBox.update();
            // walkingBomb.scene.bBox.show();
            walkingBomb.BBoxUpdate = { name: "updateBBox_" + walkingBomb.name }
            //update BBox
            walkingBomb.BBoxUpdate.update = function () {
                walkingBomb.scene.bBox.update();
            }
            needUpdate.push(walkingBomb.BBoxUpdate);
        }
        walkingBomb.deactiveBBox = function () {
            walkingBomb.scene.bBox.hide();
            needUpdate.remove(walkingBomb.BBoxUpdate);

        }

        walkingBomb.getType = function () {
            return type;
        }

        return walkingBomb;
    }
    let folder = "/assets/lastBattle/";
    let type = "walkingBomb";
    loader.load(folder + type + ".gltf", loadOk);
    let source;
    WalkingBombMaker.getSrc = function () {
        return source;
    }

    function loadOk(src) {
        source = src;

    }
    let pool = [];
    WalkingBombMaker.getPool = function getWalkingBombPool() {
        return pool;
    }
    let live = new CollideGroup();
    WalkingBombMaker.getLiving = function () {
        return live.get();
    }
    let id = 0;
    WalkingBombMaker.getTotal = function () {
        return id;
    }
    WalkingBombMaker.create = function createWalkingBomb() {
        if (!source) return null;
        let walkingBomb;
        if (pool.length > 0) {
            walkingBomb = pool.pop();
        } else {
            walkingBomb = new WalkingBomb(source);
        }
        return walkingBomb;
    }
    const freefallSpeed = 200;
    const parachuteOnSpeed = 30;
    const walkSpeed = 30;

    WalkingBombMaker.drop = function (x, y) {
        let duration = y / freefallSpeed * 1000;
        let openY = 50 + Math.random() * (y - 50);
        let walkingBomb = WalkingBombMaker.create();
        walkingBomb.placexy(x, y);
        walkingBomb.tween = new TWEEN.Tween(walkingBomb.scene.position)
            .to({ y: 0 }, duration)
            .easing(TWEEN.Easing.Quadratic.In)
            .start()
            .onUpdate(function () {
                if (walkingBomb.scene.position.y <= openY) {
                    walkingBomb.openParachute();
                }
            })
        fadeToAction.call(walkingBomb, "normal", 0.2);
        // resetAllAndPlay.call(walkingBomb, "normal");
    }
    WalkingBombMaker.stopAllOnGround = function () {
        let living = live.get();
        for (let i = 0; i < living.length; i++) {
            let walkingBomb = living[i];
            if (walkingBomb.scene.position.y <= 0) {
                walkingBomb.tween.stop();
                fadeToAction.call(walkingBomb, "standUpPos", 0.1);
            }
            clearTimeout(walkingBomb.timer);
        }
    }

    function loopDrop() {
        setInterval(function () {
            WalkingBombMaker.drop(-200, 300);
        }, 3000);
    }

    function test() {
        // let walkingBomb = WalkingBombMaker.create();
        // walkingBomb.placexy(200, 200);
        // resetAllAndPlay();
        WalkingBombMaker.drop(200, 300);

    }
    // runAfterLoadOk.call(WalkingBombMaker, test);
    // loopDrop();

}



function BulletsMaker() {
    //pool
    let num = 0;
    let maxNum = 20;
    let pool = [];
    BulletsMaker.getPool = function () {
        return pool;
    }
    //collide
    let live = new CollideGroup()
    let size = 1;
    BulletsMaker.getLiving = function getLiveBullet() {
        return live.get();
    }
    id = 0;
    BulletsMaker.create = function () {
        let bullet;
        if (pool.length > 0) {
            bullet = pool.pop();
        } else {
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


            //track
            // var trackMat = new THREE.LineBasicMaterial({
            //     color: 0xff00ff,
            //     depthTest: false
            // });

            // let MAX_POINTS = 2;
            // var trackGeo = new THREE.BufferGeometry();
            // var positions = new Float32Array(MAX_POINTS * 3); // 3 vertices per point
            // trackGeo.addAttribute('position', new THREE.BufferAttribute(positions, 3));



            // bullet.track = new THREE.Line(trackGeo, trackMat);
            // bullet.track.renderOrder = 3;
            // bullet.track.name = "track" + bullet.name;
            // bullet.showTrack = function () {
            //     scene.add(bullet.track);
            // }
            // bullet.hideTrack = function () {
            //     scene.remove(bullet.track);
            // }

            // bullet.updateTrack = function (offsetLast) {
            //     positions[0] = offsetLast.x;
            //     positions[1] = offsetLast.y;
            //     positions[2] = offsetLast.z;
            //     positions[3] = bullet.position.x;
            //     positions[4] = bullet.position.y;
            //     positions[5] = bullet.position.z;
            //     bullet.track.geometry.attributes.position.needsUpdate = true;

            // }


        }
        //collide
        bullet.lastPosition = new THREE.Vector3();
        // bullet.showTrack();

        live.push(bullet);
        bullet.name = "bullet" + id++;

        return bullet;

    }

    BulletsMaker.reclaim = function (bullet) {
        pool.push(bullet);
        live.remove(bullet);
        scene.remove(bullet);
        bullet.tween.stop();

        // bullet.hideTrack();
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
    let weapons = {};
    let gun;
    let weaponParams = [{
        name: "machineGun",
        shotInterval: 0.1,
        range: 400,
        duration: 1500,
        size: 1.2,
        sound: "MachineGun.mp3",
        volume: 0.05,
        cool: 16,
        coolrest: 2,
        damage: {
            "helicopter": 1,
        }

    },
    {
        name: "cannon",
        shotInterval: 1,
        range: 600,
        duration: 2000,
        size: 2,
        sound: "cannon.mp3",
        volume: 0.2,
        cool: -1,
        coolrest: 1,
        damage: {
            "helicopter": 3,
            "satellite": 10,
        }

    }
    ];
    Gun.getDamageValue = function getCurrentWeaponDamage(name) {
        for (let i = 0; i < weaponParams.length; i++) {
            let weapon = weaponParams[i]
            let weaponName = weapon.name;
            if (weaponName === currentWeapon) {
                if (weapon.damage[name])
                    return weapon.damage[name];
                else return 1;
            }
        }
        return 1;
    }

    function getWeaponParam(searchName) {
        for (let i = 0; i < weaponParams.length; i++) {
            let name = weaponParams[i].name;
            if (searchName === name)
                return weaponParams[i];
        }
        return null;
    }

    function getNextWeaponName(current) {
        for (let i = 0; i < weaponParams.length; i++) {
            let name = weaponParams[i].name;
            if (name === current) {
                let nextIndex = i + 1;
                if (nextIndex == weaponParams.length)
                    nextIndex = 0;
                return weaponParams[nextIndex].name;
            }
        }
        return null;
    }
    let gunTower;
    Gun.getPosition = function () {
        return gunTower.position;
    }
    let folder = "/assets/lastBattle/";
    loader.load(folder + "guntower.gltf", loadOk);

    function loadOk(gt) {
        canDisplayWire.call(gt);
        gunTower = gt.scene;
        scene.add(gunTower);
        gunTower.scale.set(0.7, 0.7, 1);
        gunTower.updateMatrixWorld();


        for (let i = 0; i < weaponParams.length; i++) {
            let name = weaponParams[i].name;
            weapons[name] = gunTower.getObjectByName("plug_" + name, true);
            weapons[name].control = gunTower.getObjectByName("control_" + name, true);

            placeInBase(weapons[name]);
            gunTower.remove(weapons[name]);
        }


        rise("machineGun");
        new BulletsMaker();

    }
    let packUpPos = new THREE.Vector3(0, -18, 0); //local pos

    function placeInBase(weapon) {
        weapon.normalPos = new THREE.Vector3().copy(weapon.position);
        weapon.packUpPos = new THREE.Vector3().copy(packUpPos).add(weapon.position);
        weapon.position.copy(weapon.packUpPos);
    }



    function packUp(name) {
        needUpdate.remove(Gun);
        let weapon = weapons[name];
        weapon.position.copy(weapon.normalPos);
        let tween = new TWEEN.Tween(weapon.position)
            .to({ y: weapon.packUpPos.y }, 1000)
            .start()
            .onComplete(function (obj) {
                gunTower.remove(weapon);
                if (action.fun && action.param) {
                    action.fun(action.param)
                }
            })
        let action = {};
        action.then = function (fun, param) {
            action.fun = fun;
            action.param = param;
        }
        return action;
    }

    function rise(name) {
        currentWeapon = name;
        let weapon = weapons[name];
        gunTower.add(weapon);
        weapon.position.copy(weapon.packUpPos);
        let tween = new TWEEN.Tween(weapon.position)
            .to({ y: weapon.normalPos.y }, 1000)
            .start()
            .onComplete(function (obj) {
                initWeapon(name);

            })
    }

    let gunNormalPos = new THREE.Vector3(); //for recoil pos
    let gunNormalPosWorld = new THREE.Vector3(); //for recoil pos
    function initWeapon(name) {
        let param = getWeaponParam(name);
        shotInterval = param.shotInterval;
        range = param.range;
        duration = param.duration;
        sound = sounds[param.sound];
        cool = param.cool;
        coolCount = cool;
        coolRest = param.coolrest;
        coolRestCount = coolRest;
        size = param.size;
        // resetWeapon = param.reset;

        gun = weapons[name].control;
        gunNormalPos.copy(gun.position);
        gunNormalPosWorld.copy(gunNormalPos);
        gun.parent.localToWorld(gunNormalPosWorld);
        gun.origin = new THREE.Vector3(); //for calculate bullet pos
        gun.origin.setFromMatrixPosition(gun.matrixWorld);
        gun.origin.z = 0;
        needUpdate.push(Gun);
        Gun.update = updateGunControl;

    }



    let maxAngle = THREE.Math.degToRad(100);
    let speed = THREE.Math.degToRad(150); //per second

    let total = 0;

    let cannonLen = 13;

    let count = 0;
    let shotInterval = 0.1; //const
    let range = 600; //const
    let duration = 2000; //const
    let cool = 5; //const
    let coolRest = 2; //const
    let coolCount = cool;
    let coolRestCount = coolRest;

    function resetCool() {
        coolCount = cool;
        count = 0;
    }
    let size;

    let direction = new THREE.Vector3();

    let sound; //current
    let sounds = {};


    let pressA = false;
    let pressD = false;
    let pressJ = false;
    let pressR = false;
    for (let i = 0; i < weaponParams.length; i++) {
        let name = weaponParams[i].sound;
        SoundEffect.add(name, function (sound) {
            sound.setLoop(false);
            let volume = weaponParams[i].volume;
            if (volume != null)
                sound.setMaxVolume(volume);
            sounds[name] = sound;
        })
    }


    function fire() {
        let bullet = BulletsMaker.create();
        if (bullet == null) return;
        bullet.scale.set(size, size, 1);
        //bullet init position
        direction.set(0, cannonLen, 0);
        direction.applyQuaternion(gun.quaternion);
        direction.add(gun.origin);
        bullet.position.copy(direction);
        updateLastPosition.call(bullet);
        // bullet.resetTrack();
        //bullet target
        direction.set(0, range, 0);
        direction.applyQuaternion(gun.quaternion);
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

        //gun recoil target
        direction.normalize();
        direction.negate();
        direction.multiplyScalar(5);
        direction.add(gunNormalPosWorld);
        gun.parent.worldToLocal(direction);


        //         direction.set(0, -1, 0);
        //         direction.applyQuaternion(gun.quaternion).add(gunNormalPos);
        gun.position.copy(direction);
        if (gun.recoil)
            gun.recoil.stop();
        gun.recoil = new TWEEN.Tween(gun.position)
            .to({ x: gunNormalPos.x, y: gunNormalPos.y }, shotInterval * 1000)
            .start()
            .onComplete(function () {
                //                 gun.position.copy(gunNormalPos);
            });
        SoundEffect.replay(sound);
    }

    let currentWeapon = "machineGun"

    function switchWeapon() {
        let nextWeapon = getNextWeaponName(currentWeapon);
        packUp(currentWeapon)
            .then(rise, nextWeapon)
    }
    // let keys = {};
    // keys.a = false;
    // keys.d = false;
    // keys.j = false;
    // keys.r = false;
    let accumulator = 0;
    function updateGunControl(deltaTime) {
        accumulator += deltaTime;
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
            count = accumulator;
            if (count >= shotInterval) {
                if (coolCount) {
                    fire();
                    coolCount--;
                } else {
                    coolRestCount--;
                    if (coolRestCount == 0) {
                        coolCount = cool;
                        coolRestCount = coolRest;
                    }
                }
                count = 0;
                accumulator = 0;
            }

        }
        //         console.log("coolrest:" + coolRestCount + "," + "coolCount:" + coolCount + "," + "count:" + count.toFixed(2) + "," + "accum:" + accumulator.toFixed(2));
        if (pressR) {
            switchWeapon();
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
                resetCool();
                break;
            case "r":
                pressR = false;
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
                pressJ = true;
                break;
            case "r":
                pressR = true;
        }
    }

    function focusGame() {
        let game = window.parent.document.querySelector(".game");
        game.focus();
    }
    document.addEventListener("click", focusGame, false);
    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('keyup', onKeyUp);
    let life = 100;
    Gun.getLife = function () {
        return life;
    }
    Gun.addLife = function (value) {
        life += value;
    }
    let life_ui = document.querySelector(".life");

    Gun.reduceLife = function (value) {
        life -= value;
        life_ui.textContent = life;
        jumpNumber(life_ui, 1.5, 1);
        if (life <= 0) {
            Gun.die();
        }
    }
    Gun.die = function () {
        beginExplode();
        gameOver();
    }
    function beginExplode() {
        Gun.update = gunExplode;
        let count = 0;
        let n = 0;
        function gunExplode(delta) {
            count += delta
            if ((n == 0 && count >= 0.1) ||
                (n == 1 && count >= 0.3) ||
                (n == 2 && count >= 0.8)) {
                let randomX = randomRange(-10, 10);
                let randomY = randomRange(0, 20);
                Effect.create("explode").placeXY(randomX, randomY);
                n++;
            }
            if (count >= 1)
                needUpdate.remove(Gun);
        }
    }

}
function jumpNumber(elem, big, normal) {
    elem.style.transform = `scale(${big})`;

    let param = { scale: big };
    if (elem.tween) elem.tween.stop();
    elem.tween = new TWEEN.Tween(param)
        .to({ scale: normal }, 300)
        .start()
        .onUpdate(function () {
            elem.style.transform = `scale(${param.scale})`;
        })
}
function gameOver() {
    hq.setCommand("stop");
    WalkingBombMaker.stopAllOnGround();
    HelicopterMaker.stopAllDropBomb();
    popupGameOverPanel();
}
function popupGameOverPanel() {
    let panel = document.createElement('iframe');
    panel.src = "/works/lastbattle/panel/gameover.html";
    panel.frameBorder = 0;
    panel.classList.add("panel");
    // panel.onload = function () {

    // }
    document.body.appendChild(panel);
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
let worldLoc = new THREE.Vector3();
let worldScl = new THREE.Vector3();
let worldQua = new THREE.Quaternion();
function updateLastGlobal() {
    let target = this.bBox.host;
    target.matrixWorld.decompose(worldLoc, worldQua, worldScl);
    worldLoc.z = 0;
    worldScl.z = 1;
    // worldQua.
    this.lastPosition.copy(worldLoc);
    this.lastScale.copy(worldScl);
    this.lastQuaternion.copy(worldQua);
}
function updateLast() {
    this.lastPosition.copy(this.bBox.host.position);
    this.lastScale.copy(this.bBox.host.scale);
    this.lastQuaternion.copy(this.bBox.host.quaternion);
}
function initLast() {
    this.lastPosition = new THREE.Vector3();
    this.lastQuaternion = new THREE.Quaternion();
    this.lastScale = new THREE.Vector3();
}

function Collide() {
    let bullets;
    let satellites;
    let helicopters;
    let walkingBombs;
    let checkAvailable = {};
    collideUpdate.push(checkAvailable);
    //init
    checkAvailable.update = function () {
        if (!BulletsMaker.getLiving) return;
        if (!SatelliteMaker.getLiving) return;
        if (!HelicopterMaker.getLiving) return;
        if (!WalkingBombMaker.getLiving) return;

        bullets = BulletsMaker.getLiving();
        satellites = SatelliteMaker.getLiving();
        helicopters = HelicopterMaker.getLiving();
        walkingBombs = WalkingBombMaker.getLiving();

        collideUpdate.remove(checkAvailable);
        collideUpdate.push(Collide);

    }
    Collide.update = function testCollide(delta) {
        bullet_enemy(helicopters);
        bullet_enemy(satellites);
        bullet_enemy(walkingBombs);

        //update lastPosition
        let i;
        i = bullets.length;
        while (i--) { updateLastPosition.call(bullets[i]); }
        i = satellites.length;
        while (i--) { updateLastPosition.call(satellites[i].scene); }
        i = helicopters.length;
        while (i--) { updateLast.call(helicopters[i].scene); }
        i = walkingBombs.length;
        while (i--) { updateLastGlobal.call(walkingBombs[i].scene) }
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
    let deltaScl = new THREE.Vector3();
    let deltaQua = new THREE.Quaternion();
    let matrix = new THREE.Matrix4();
    let ray = new THREE.Ray();

    let axisZ = new THREE.Vector3(0, 0, 1);
    let zero = new THREE.Vector3();
    let up = new THREE.Vector3(0, 1, 0);

    function bullet_enemy(group) {
        if (bullets.length == 0 || group.length == 0) return;

        let i = bullets.length;
        while (i--) {
            let bullet = bullets[i];
            if (bullet.position.equals(bullet.lastPosition)) continue;
            testPoint.copy(bullet.position);

            let j = group.length;
            while (j--) {
                let enemyRoot = group[j];
                let enemy = enemyRoot.scene;
                //delta matrix
                deltaPos.subVectors(enemy.position, enemy.lastPosition);
                deltaScl.copy(enemy.scale);
                deltaScl.divide(enemy.lastScale);
                deltaQua.copy(enemy.lastQuaternion);
                deltaQua.inverse();
                deltaQua.premultiply(enemy.quaternion);
                matrix.compose(deltaPos, deltaQua, deltaScl);

                offset.subVectors(bullet.lastPosition, enemy.lastPosition)
                offset.applyMatrix4(matrix);
                offsetLast.addVectors(enemy.lastPosition, offset)

                // bullet.updateTrack(offsetLast);//track
                lastDirect.subVectors(testPoint, offsetLast).normalize();
                ray.origin.copy(offsetLast);
                ray.direction.copy(lastDirect);
                d2vec.subVectors(testPoint, offsetLast);
                d2 = d2vec.lengthSq();

                enemy.updateMatrixWorld();
                let segments = enemy.bBox.getSgmt();
                let hit = false;
                for (let k = 0; k < segments.length; k++) {
                    let sgmt = segments[k];
                    v1.copy(sgmt[0]);
                    v2.copy(sgmt[1]);

                    v1.applyMatrix4(enemy.matrixWorld);
                    v2.applyMatrix4(enemy.matrixWorld);
                    // if (!facePoint(v1, v2, offsetLast)) continue;

                    let distSq = ray.distanceSqToSegment(v1, v2, intersetPoint);
                    //                     console.log(distSq);
                    if (distSq <= 0.1) {
                        d1 = ray.origin.clone().sub(intersetPoint).lengthSq();
                        if (d1 <= d2) {
                            BulletsMaker.reclaim(bullet);
                            let damageValue = Gun.getDamageValue(enemyRoot.getType());
                            damage.call(enemyRoot, damageValue, intersetPoint, sgmt.partName);
                            // enemyRoot.reclaim();
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
}

function facePoint(v1, v2, p) {
    return (p.x - v1.x) * (v2.y - v1.y) - (p.y - v1.y) * (v2.x - v1.x) < 0;
}

//debug
let camCord;
let wireGroup = [];
let wire = false;
function subscribeTestReady() {
    window.parent.subscribeTestReady(inittest)
}
function inittest() {
    let cam3DBtn = window.parent.getTestControls(".cam3d")
    let cam2DBtn = window.parent.getTestControls(".cam2d");
    cam3DBtn.addEventListener("click", toCam3D);
    cam2DBtn.addEventListener("click", toCam2D);
    let resetBtn = window.parent.getTestControls(".reset");
    resetBtn.addEventListener("click", resetCam);
    camCord = window.parent.getTestControls(".camCord");

    let wireBtn = window.parent.getTestControls(".wire");
    wireBtn.addEventListener('click', changeToWire);
    let play = window.parent.getTestControls(".play");
    play.addEventListener("click", testAnimation);
    let soundSlider = window.parent.getTestControls(".soundVolumn input")
    soundSlider.oninput = function () {
        SoundEffect.setVolume(this.value / 100);
    }
    let param = { x: 10 }
    let tween = new TWEEN.Tween(param)
        .to({ x: 20 }, 2000)
        .start()
        .onUpdate(function () {
            //         console.log(param.x);
        })
        .onComplete(function () {
            //         console("complete!")
        });
    setTimeout(function () {
        tween.stop();
    }, 1000);


    RenderList.push(renderTest);
}


function testAnimation() {
    // Effect.create("explode").place(new THREE.Vector3(0, 200, 0));
    // resetAllAndPlay.call(testExplode);
    addScore(1);
}

function changeToWire(evt) {
    if (evt)
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