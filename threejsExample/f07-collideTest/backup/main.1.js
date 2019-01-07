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
    bBox.lastQuaternion=new THREE.Quaternion();
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
        .to({ posX: 100, posY:100, scaleX: 3, scaleY: 3, scaleZ: 3, rotZ: 5 }, 10000)
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
        let bullet;
        let geometry = new THREE.CircleGeometry(2, 4);
        let material = new THREE.MeshBasicMaterial({
            color: 0xffff00,
            depthTest: false
        })
        bullet = new THREE.Mesh(geometry, material);
        bullet.lastPosition = new THREE.Vector3();
        bullet.renderOrder = 2;
        bullet.remove = function () {
            scene.remove(bullet);
            bullets.splice(bullets.indexOf(bullet), 1);
            //             pool.push(bullet);
        }
        let trackMat = new THREE.LineBasicMaterial({
            vertexColors: THREE.VertexColors,
            // color: 0xff00ff,
            depthTest: false
        });
        let MAX_POINTS = 2;
        let trackGeo = new THREE.BufferGeometry();
        let positions = new Float32Array(MAX_POINTS * 3); // 3 vertices per point
        let colors = new Uint8Array(MAX_POINTS * 3);
          colors[0] = 0;
            colors[1] = 0;
            colors[2] = 255;
            colors[3] = 0;
            colors[4] = 255;
            colors[5] = 0;
        trackGeo.addAttribute('position', new THREE.BufferAttribute(positions, 3));
        trackGeo.addAttribute('color', new THREE.BufferAttribute(colors, 3, true));
        bullet.track = new THREE.Line(trackGeo, trackMat);
        bullet.track.renderOrder = 3;
        bullet.track.name = "track" + bullet.name;
        bullet.showTrack = function () {
            scene.add(bullet.track);
        }
        bullet.hideTrack = function () {
            scene.remove(bullet.track);
        }

        bullet.updateTrack = function (offsetLast) {
            positions[0] = offsetLast.x;
            positions[1] = offsetLast.y;
            positions[2] = offsetLast.z;
            positions[3] = bullet.position.x;
            positions[4] = bullet.position.y;
            positions[5] = bullet.position.z;
            bullet.track.geometry.attributes.position.needsUpdate = true;
                console.log(offsetLast);
            
        }

        bullet.position.set(0, 0, 0);
        bullet.lastPosition.copy(bullet.position);
        scene.add(bullet);

        direction.set(0, range, 0);
        direction.applyQuaternion(gun.quaternion);
        // direction.copy(bBox.position).normalize().multiplyScalar(range);



        bullet.tween = new TWEEN.Tween(bullet.position)
            .to({ x: direction.x, y: direction.y }, duration)
            .start()
            .onComplete(function () {
                bullet.remove();
            });


        bullet.showTrack();
        bullets.push(bullet);
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
    let i = bullets.length;
    while (i--) {
        let bullet = bullets[i];
        bullet.lastPosition.copy(bullet.position);
    }

    bBox.lastPosition.copy(bBox.position);
    bBox.lastQuaternion.copy(bBox.quaternion);
    bBox.lastRotation.copy(bBox.rotation);
    bBox.lastScale.copy(bBox.scale);
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
    collideTest();
    updatelast();
    control3D.update();
    render();
}

function render() {
    renderer.render(scene, camera);
}

main();
