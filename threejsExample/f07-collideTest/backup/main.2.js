function main() {
    init();
    animate();
}

let scene, camera, renderer;
let controls;
let clock;

let points;
let bBox;
let bullets;
let pool;
let helicopters;
function init() {

    camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 2000);
    camera.position.z = 500;
    camera.position.y = 0;
    control3D = new THREE.TrackballControls(camera);
    control3D.rotateSpeed = 1.0;
    control3D.zoomSpeed = 1.2;
    control3D.panSpeed = 0.8;
    control3D.noZoom = false;
    control3D.noPan = false;
    control3D.staticMoving = true;
    control3D.dynamicDampingFactor = 0.3;
    control3D.target.set(0, 0, 0);
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);
    let canvas = document.querySelector(".scene")
    let context = canvas.getContext('webgl2');
    renderer = new THREE.WebGLRenderer({
        canvas: canvas,
        context: context
    });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x777777, 0);
    //document.body.appendChild(renderer.domElement);

    window.addEventListener('resize', onWindowResize, false);
    clock = new THREE.Clock();
    // var axesHelper = new THREE.AxesHelper(5);
    // scene.add(axesHelper);

    //bbox
    let segments = [
        [
            [16, -17],
            [-21, -17]
        ],
        // [
        //     [-21, -17],
        //     [-30, 37]
        // ],
        // [
        //     [-30, 37],
        //     [25, 37]
        // ],
        // [
        //     [25, 37],
        //     [16, -17]
        // ],
    ];
    points = [];
    var material = new THREE.LineBasicMaterial({
        color: 0xff0000,
        depthTest: false
    });
    var geometry = new THREE.Geometry();
    for (let i = 0; i < segments.length; i++) {
        let segment = segments[i];
        let p1 = new THREE.Vector3(segment[0][0], segment[0][1], 0);
        let p2 = new THREE.Vector3(segment[1][0], segment[1][1], 0);
        points.push(p1, p2);

        // geometry.vertices.push(p1);
    }

    geometry.vertices.push(points[0], points[1]);
    // geometry.vertices.push(new THREE.Vector3(segments[0][0][0], segments[0][0][1], 0));//close the line

    bBox = new THREE.Line(geometry, material);
    bBox.renderOrder = 1;
    bBox.lastPosition = new THREE.Vector3();
    bBox.lastRotation = new THREE.Vector3();
    bBox.lastQuaternion = new THREE.Quaternion();
    bBox.lastScale = new THREE.Vector3();

    scene.add(bBox);
    let param = { posX: -100, posY: 100, scaleX: 1.5, scaleY: 1.5, scaleZ: 1.5, rotZ: 0 };
    function applyTranformFromParam() {
        bBox.scale.set(param.scaleX, param.scaleY, param.scaleZ);
        //         bBox.rotation.z = param.rotZ
        bBox.position.x = param.posX;
        bBox.position.y = param.posY;


    }
    applyTranformFromParam();

    new TWEEN.Tween(param)
        .to({ posX: 100, posY: 100, scaleX: 3, scaleY: 3, scaleZ: 3, rotZ: 5 }, 10000)
        .repeat(Infinity)
        .yoyo(Infinity)
        .start()
        .onUpdate(function (obj) {
            applyTranformFromParam();
        })

    //gun
    var gunMat = new THREE.LineBasicMaterial({
        color: 0xff0000,
        depthTest: false
    });
    var gunGeo = new THREE.Geometry();
    gunGeo.vertices.push(new THREE.Vector3());
    gunGeo.vertices.push(new THREE.Vector3(0, 10, 0));
    let gun = new THREE.Line(gunGeo, gunMat);
    scene.add(gun);


    document.body.addEventListener("click", fire);
    document.addEventListener('keydown', onKeyDown);
    let direction = new THREE.Vector3();
    let range = 500;
    let duration = 3000;

    bullets = [];
    function fire() {
        console.log("========================")
        let bullet = BulletsMaker.create();
        if (bullet == null) return;
        scene.add(bullet);

        direction.set(0, range, 0);
        direction.applyQuaternion(gun.quaternion);
        // direction.copy(bBox.position).normalize().multiplyScalar(range);

        bullet.position.set(0, 0, 0);
        updateLastPosition.call(bullet);
        bullet.resetTrack();


        bullet.tween = TweenMax.to(bullet.position, 3, {
            x: direction.x,
            y: direction.y,
            onComplete: function () {
                BulletsMaker.reclaim(bullet);
            },
            ease: Linear.easeNone
        });


        // bullets.push(bullet);
    }
    function onKeyDown(evt) {
        switch (evt.key) {
            case "a":
                gun.rotation.z += 0.1;
                break;
            case "d":
                gun.rotation.z -= 0.1;
                break;
        }
    }
    new Helicopter();
    helicopters = Helicopter.getLiving();
    new BulletsMaker();
    bullets = BulletsMaker.getLive();
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
let zero = new THREE.Vector3();
let ray = new THREE.Ray();

function bullet_helicopter() {

    if (bullets.length == 0 || helicopters.length == 0) return;

    let i = bullets.length;
    while (i--) {
        let bullet = bullets[i];
        if (bullet.position.x == bullet.lastPosition.x && bullet.position.y == bullet.lastPosition.y) continue;
        testPoint.copy(bullet.position);
        testPoint.z = 0;
        let j = helicopters.length;
        while (j--) {
            let helicopter = helicopters[j];
            deltaPos.subVectors(helicopter.position, helicopter.lastPosition);
            deltaRot = helicopter.rotation.z - helicopter.lastRotation.z;
            deltaScl.copy(helicopter.scale);
            deltaScl.divide(helicopter.lastScale);
            quaternion.setFromAxisAngle(axisZ, deltaRot);
            matrix.compose(deltaPos, quaternion, deltaScl);

            offset.subVectors(bullet.lastPosition, helicopter.lastPosition)
            offset.applyMatrix4(matrix);
            offsetLast.addVectors(helicopter.lastPosition, offset)
            offsetLast.z = 0;
            bullet.updateTrack2(offsetLast);//track
            lastDirect.subVectors(testPoint, offsetLast).normalize();
            if (lastDirect.equals(zero)) continue;
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
                        // console.log(distSq);
                        BulletsMaker.reclaim(bullet);
                        //  bullet.remove();
                        console.log(bullet.name + " hit");
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
function collideTest() {
    //     if (bullets.length == 0) return;

    let i = bullets.length;
    while (i--) {
        let bullet = bullets[i];
        //         if (bullet.position.x == bullet.lastPosition.x && bullet.position.y == bullet.lastPosition.y) continue;
        testPoint.copy(bullet.position);
        testPoint.z = 0;

        //delta matrix
        deltaPos.subVectors(bBox.position, bBox.lastPosition);
        deltaRot = bBox.rotation.z - bBox.lastRotation.z;
        deltaScl.copy(bBox.scale);
        deltaScl.divide(bBox.lastScale);
        quaternion.setFromAxisAngle(axisZ, deltaRot);

        matrix.compose(deltaPos, quaternion, deltaScl);

        //offsetVector
        offset.subVectors(bullet.lastPosition, bBox.lastPosition)
        offset.applyMatrix4(matrix);
        offsetLast.addVectors(bBox.lastPosition, offset)
        offsetLast.z = 0;
        bullet.updateTrack(offsetLast);//track

        //offset Direct
        lastDirect.subVectors(testPoint, offsetLast).normalize();

        //ray
        ray.origin.copy(offsetLast);
        ray.direction.copy(lastDirect);
        d2vec.subVectors(testPoint, offsetLast);
        d2 = d2vec.lengthSq();

        bBox.updateMatrixWorld();

        //
        v1.copy(points[0]);
        v2.copy(points[1]);

        v1.applyMatrix4(bBox.matrixWorld);
        v2.applyMatrix4(bBox.matrixWorld);
        //             if (!facePoint(v1, v2, offsetLast)) continue;

        let distSq = ray.distanceSqToSegment(v1, v2, intersetPoint);
        d1vec.subVectors(ray.origin, intersetPoint);
        d1 = d1vec.lengthSq();

        if (distSq <= 0.1) {
            //  console.log(distSq.toFixed(2),v1.z,v2.z,ray.origin.z,ray.direction.z,intersetPoint);

            if (d1 <= d2) {
                console.log("hit");
                bullet.remove();
                return;

            }
        }


        console.log('--------------');
    }


    //updatelast


}
function showVec(vec3) {
    return vec3.x.toFixed(2) + "|" + vec3.y.toFixed(2);
}
function updatelast() {
    //     let i = bullets.length;
    //     while (i--) {
    //         let bullet = bullets[i];
    //         bullet.lastPosition.copy(bullet.position);
    //     }

    bBox.lastPosition.copy(bBox.position);
    bBox.lastQuaternion.copy(bBox.quaternion);
    bBox.lastRotation.copy(bBox.rotation);
    bBox.lastScale.copy(bBox.scale);

    let i;
    i = bullets.length; while (i--) { updateLastPosition.call(bullets[i]); }
    i = helicopters.length; while (i--) { updateLast.call(helicopters[i]); }
}
function facePoint(v1, v2, p) {
    let d = (p.x - v1.x) * (v2.y - v1.y) - (p.y - v1.y) * (v2.x - v1.x);
    if (d < 0) return true;
    else return false;
}
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
    var delta = clock.getDelta();
    requestAnimationFrame(animate);
    TWEEN.update();
    // collideTest();
    bullet_helicopter()
    updatelast();
    control3D.update();
    render();
}

function render() {
    renderer.render(scene, camera);
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

    let source;
    loadok();
    function loadok() {
        var geometry = new THREE.PlaneGeometry(5, 20, 32);
        var material = new THREE.MeshBasicMaterial({ color: 0xffff00, side: THREE.DoubleSide });
        source = new THREE.Mesh(geometry, material);
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
            helicopter = source.clone();

            helicopter.lastPosition = new THREE.Vector3();
            helicopter.lastRotation = new THREE.Vector3();
            helicopter.lastScale = new THREE.Vector3();
        }

        helicopter.name = "helicopter" + id++;

        let segments = [
            [[16, -17], [-21, -17]],
            [[-21, -17], [-30, 37]],
            [[-30, 37], [25, 37]],
            [[25, 37], [16, -17]],
        ];
        let bBox = new BBox(segments);
        bBox.attach(helicopter);
        live.push(helicopter);
        return helicopter;
    }

    Helicopter.place = function placeHelicopter(helicopter, pos) {
        helicopter.position.copy(pos);
        helicopter.rotation.z = -0.3;
        updateLast.call(helicopter);
        scene.add(helicopter);



        if (helicopter.bBox)
            helicopter.bBox.update();
        // SoundEffect.replay(sound);


    }
    Helicopter.reclaim = function reclaimHelicopter(helicopter) {
        pool.push(helicopter);
        scene.remove(helicopter);
        live.remove(helicopter);
    }


    //schedule------
    // test();
    oneLToR();

    function oneLToR() {

        let helicopter = Helicopter.create();
        helicopter.scale.set(0.5, 0.5, 0.5);
        Helicopter.place(helicopter, new THREE.Vector3(-200, 200, 0));

        let param = { posX: -200, posY: 200, scaleX: 0.5, scaleY: 0.5, scaleZ: 0.5, rotZ: 0 };

     new TweenMax(param, 10, {
            posX: 200, posY: 50, scaleX: 1.5, scaleY: 1.5, scaleZ: 1.5, rotZ: 20,
            onUpdate: function () {
                helicopter.position.x = param.posX;
                helicopter.position.y = param.posY;
                helicopter.scale.set(param.scaleX, param.scaleY, param.scaleZ);
                helicopter.rotation.z = param.rotZ;
                helicopter.bBox.update();
            },
            onStart: function () {
                helicopter.bBox.show();
                helicopter.bBox.update();
            },
            yoyo:true, repeat:-1
        })
        // new TWEEN.Tween(param)
        //     .to({ posX: 200, posY: 50, scaleX: 1.5, scaleY: 1.5, scaleZ: 1.5, rotZ: 20 }, 10000)
        //     .repeat(Infinity)
        //     .start()
        //     .onUpdate(function (obj) {
        //         helicopter.position.x = param.posX;
        //         helicopter.position.y = param.posY;
        //         helicopter.scale.set(param.scaleX, param.scaleY, param.scaleZ);
        //         helicopter.rotation.z = param.rotZ;
        //         helicopter.bBox.update();
        //     })
        //     .onStart(function (obj) {
        //         helicopter.bBox.show();
        //         helicopter.bBox.update();
        //     });




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
    //bullet property
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
        bullet.tween.kill();
        bullet.hideTrack();

    }

}
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
function removeElemtFromArray(elem) {
    this.splice(this.indexOf(elem), 1);
}
function updateLast() {
    this.lastPosition.copy(this.position);
    this.lastRotation.copy(this.rotation);
    this.lastScale.copy(this.scale);
}
function updateLastPosition() {
    this.lastPosition.copy(this.position);
}
main();
