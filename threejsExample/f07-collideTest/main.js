function main() {
    init();
    animate();
}

let scene, camera, renderer;
let controls;

let sgmtPoints;
let bBox;
let bullets = [];
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

    window.addEventListener('resize', onWindowResize, false);

    //grid
    gridHelper = new THREE.GridHelper(1000, 10);
    gridHelper.rotation.x = Math.PI / 2;
    scene.add(gridHelper);

    //bbox
    let segments = [
        [20, -17],
        [-17, -17],
        [-26, 37],
        [29, 37]
    ];
    sgmtPoints = [];
    var material = new THREE.LineBasicMaterial({
        color: 0xff0000,
        depthTest: false
    });
    var geometry = new THREE.Geometry();
    for (let i = 0; i < segments.length; i++) {
        let p1, p2;
        p1 = new THREE.Vector3(segments[i][0], segments[i][1], 0);
        if (i != segments.length - 1) {
            p2 = new THREE.Vector3(segments[i + 1][0], segments[i + 1][1], 0);
        } else {
            p2=  new THREE.Vector3(segments[0][0], segments[0][1], 0);
        }
        let line = [];
        line.push(p1, p2);
        sgmtPoints.push(line);

        geometry.vertices.push(p1);
    }

    geometry.vertices.push(new THREE.Vector3(segments[0][0], segments[0][1], 0));//close the line

    bBox = new THREE.Line(geometry, material);
    bBox.renderOrder = 1;
    bBox.lastPosition = new THREE.Vector3();
    // bBox.lastRotation = new THREE.Vector3();
    bBox.lastScale = new THREE.Vector3();
    bBox.lastQuaternion=new THREE.Quaternion();
    bBox.updateLast=function(){
        bBox.lastPosition.copy(bBox.position);
        // bBox.lastRotation.copy(bBox.rotation);
        bBox.lastScale.copy(bBox.scale);
        bBox.lastQuaternion.copy(bBox.quaternion);
    }


    scene.add(bBox);
    let param = { posX: -200, posY: 200, scaleX: 0.5, scaleY: 0.5, scaleZ: 0.5, rotZ: 0 };
    function applyTranformFromParam() {
        bBox.position.x = param.posX;
        bBox.position.y = param.posY;
        bBox.scale.set(param.scaleX, param.scaleY, param.scaleZ);
        bBox.rotation.z = param.rotZ;
        bBox.updateMatrixWorld();


    }
    applyTranformFromParam();
    new TWEEN.Tween(param)
        .to({ posX: 200, posY: 50, scaleX: 1.5, scaleY: 1.5, scaleZ: 1.5, rotZ: 20 }, 10000)
        .repeat(Infinity)
        .yoyo(Infinity)
        .start()
        .onUpdate(function (obj) {
            applyTranformFromParam();
        })

    //gun
    var gunMat = new THREE.LineBasicMaterial({
        color: 0x00ff00,
        depthTest: false
    });
    var gunGeo = new THREE.Geometry();
    gunGeo.vertices.push(new THREE.Vector3());
    gunGeo.vertices.push(new THREE.Vector3(0, 10, 0));
    let gun = new THREE.Line(gunGeo, gunMat);
    scene.add(gun);



    let id = 0;
    function createBullet() {
        let bullet;
        let geometry = new THREE.CircleGeometry(2, 4);
        let material = new THREE.MeshBasicMaterial({
            color: 0xffff00,
            depthTest: false
        })
        bullet = new THREE.Mesh(geometry, material);
        bullet.renderOrder = 2;
        bullet.lastPosition = new THREE.Vector3();

        bullets.push(bullet);
        bullet.name = "bullet" + id++;
        bullet.remove = function () {
            bullets.splice(bullets.indexOf(bullet), 1);
            scene.remove(bullet);
            bullet.tween.stop();

        }
        return bullet;



    }
    document.body.addEventListener("click", fire);
    let fireDirect = new THREE.Vector3();
    let clickDirect = new THREE.Vector3();
    var clickpos = new THREE.Vector3();
    function fire(evt) {
        //screen to Z plane
        let x = (evt.clientX / window.innerWidth) * 2 - 1;
        let y = - (evt.clientY / window.innerHeight) * 2 + 1;
        let z = 0.9;
        clickDirect.set(x, y, z);
        clickDirect.unproject(camera);
        clickDirect.sub(camera.position).normalize();
        var distance = - camera.position.z / clickDirect.z;
        clickpos.copy(camera.position).add(clickDirect.multiplyScalar(distance));

        //bullet
        let bullet = createBullet();
        scene.add(bullet);
        let range = 500;

        fireDirect.subVectors(clickpos, zero).normalize();
        //pointgun to firedirect
        let quaternion = new THREE.Quaternion();
        quaternion.setFromUnitVectors(up, fireDirect);
        gun.quaternion.copy(quaternion);

        fireDirect.multiplyScalar(range);
        bullet.tween = new TWEEN.Tween(bullet.position)
            .to({ x: fireDirect.x, y: fireDirect.y }, 3000)
            .start()
            .onComplete(function () {
                bullet.remove();
            });



        bullets.push(bullet);


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
let deltaQua = new THREE.Quaternion();
let axisZ = new THREE.Vector3(0, 0, 1);
let matrix = new THREE.Matrix4();
let zero = new THREE.Vector3();
let up = new THREE.Vector3(0, 1, 0);
let ray = new THREE.Ray();

function collideTest() {
    if (bullets.length == 0) return;

    let i = bullets.length;
    while (i--) {
        let bullet = bullets[i];
        if (bullet.position.equals(bullet.lastPosition)) continue;
        testPoint.copy(bullet.position);


        //delta Matrix
        deltaPos.subVectors(bBox.position, bBox.lastPosition);
        // deltaRot = bBox.rotation.z - bBox.lastRotation.z;
        deltaScl.copy(bBox.scale);
        deltaScl.divide(bBox.lastScale);
        // quaternion.setFromAxisAngle(axisZ, deltaRot);
        deltaQua.copy(bBox.lastQuaternion);
        deltaQua.inverse();
        deltaQua.premultiply(bBox.quaternion ) ;
        matrix.compose(deltaPos, deltaQua, deltaScl);

        //offset last postion
        offset.subVectors(bullet.lastPosition, bBox.lastPosition)
        offset.applyMatrix4(matrix);
        offsetLast.addVectors(bBox.lastPosition, offset)

        lastDirect.subVectors(testPoint, offsetLast).normalize();

        ray.origin.copy(offsetLast);
        ray.direction.copy(lastDirect);
        d2vec.subVectors(testPoint, offsetLast);
        d2 = d2vec.lengthSq();



        for (let k = 0; k < sgmtPoints.length; k++) {
            let sgmt = sgmtPoints[k];
            v1.copy(sgmt[0]);
            v2.copy(sgmt[1]);

            v1.applyMatrix4(bBox.matrixWorld);
            v2.applyMatrix4(bBox.matrixWorld);
            if (!facePoint(v1, v2, offsetLast)) continue;

            let distSq = ray.distanceSqToSegment(v1, v2, intersetPoint);
            if (distSq <= 0.1) {
                d1 = ray.origin.clone().sub(intersetPoint).lengthSq();
                if (d1 <= d2) {
                    bullet.remove();
                    break;
                }
            }
        }

    }
}

function updatelast() {
    let i = bullets.length; while (i--) {
        bullets[i].lastPosition.copy(bullets[i].position);
    }

    bBox.updateLast();

}
function facePoint(v1, v2, p) {
    return (p.x - v1.x) * (v2.y - v1.y) - (p.y - v1.y) * (v2.x - v1.x) < 0;
}
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
    requestAnimationFrame(animate);
    TWEEN.update();
    collideTest()
    updatelast();
    control3D.update();
    render();
}

function render() {
    renderer.render(scene, camera);
}


main();