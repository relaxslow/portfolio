
function main() {
    init();
    animate();
}
let container;
let scene, camera, renderer;
let controls;
let clock;
let needUpdate = new UpdateGroup();
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
    function removeElemtFromArray(elem) {
        this.splice(this.indexOf(elem), 1);
    }
}
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

    var axesHelper = new THREE.AxesHelper(20);
    scene.add(axesHelper);


    //box3
    var geometry = new THREE.PlaneGeometry(20, 20);
    geometry.computeBoundingBox();
    var material = new THREE.MeshBasicMaterial({
        color: 0x00ff00,
        side: THREE.DoubleSide,
        //         depthTest: false,
        // depthWrite:false
    });
    var plane = new THREE.Mesh(geometry, material);
    scene.add(plane);

    plane.position.set(0, 100, 0)
    // plane.rotation.set(1, 1, 1.2);
    // plane.scale.set(0.5, 0.5, 0.5);

    let speed = 10;
    plane.update = function (delta) {
        plane.position.x += speed * delta;
        plane.updateMatrixWorld();
        helper.box.copy( plane.geometry.boundingBox )
//         helper.box.max.z=10;
//         helper.box.min.z=-10;
        helper.box.applyMatrix4(plane.matrixWorld);

        if(plane.position.x>100)
            needUpdate.remove(plane);

             let intersets = raycaster.ray.intersectBox(box);
    console.log(intersets);
    }
    needUpdate.push(plane);


    var box = new THREE.Box3();
    // box.setFromCenterAndSize(new THREE.Vector3(), new THREE.Vector3(20, 20, 1));
    var helper = new THREE.Box3Helper(box, 0x0000ff);
    scene.add(helper);


    // new TWEEN.Tween(plane.position)
    // .to({x:100},5000)
    // .start()
    // .onUpdate(function(){

    //     // box.setFromCenterAndSize(plane.position, new THREE.Vector3(20, 20, 20));
    // })

    let raycaster = new THREE.Raycaster(new THREE.Vector3(0, 100, 0), new THREE.Vector3(1, 0, 0));
    //        let intersetPoint;
    let intersets = raycaster.ray.intersectBox(box);
    console.log(intersets);
    //     helper.position.set(10,20,50)

    //depth write
    function DepthWriteTest() {
        var geometry = new THREE.PlaneGeometry(20, 20);
        var material = new THREE.MeshBasicMaterial({
            color: 0x00ff00,
            side: THREE.DoubleSide,
            depthTest: false,
            // depthWrite:false
        });
        var plane = new THREE.Mesh(geometry, material);

        var geometry2 = new THREE.PlaneGeometry(5, 5);
        var material2 = new THREE.MeshBasicMaterial({
            color: 0xffff00,
            side: THREE.DoubleSide,
            depthTest: false,
            // depthWrite:false
        });
        var plane2 = new THREE.Mesh(geometry2, material2);
        plane2.position.z = -1;

        scene.add(plane);
        scene.add(plane2);
    }


    //lie on side
    //     new WhichSide();
    function WhichSide() {
        let wid = 30;
        let hei = 30;
        let hwid = wid / 2;
        let hhei = hei / 2;
        let topLeft = new THREE.Vector3(-hwid, hhei, 0);
        let bottomLeft = new THREE.Vector3(-hwid, -hhei, 0);
        let topRight = new THREE.Vector3(hwid, hhei, 0);
        let bottomRight = new THREE.Vector3(hwid, -hhei, 0);
        let geometry = new THREE.Geometry();
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
        function facePoint(v1, v2, p) {
            let d = (p.x - v1.x) * (v2.y - v1.y) - (p.y - v1.y) * (v2.x - v1.x);
            if (d < 0) return true;
            else return false;
        }
        //project mouse to z plane
        document.addEventListener("click", clickscreen, false);
        let projectPlane = new THREE.Plane(new THREE.Vector3(0, 0, 1));
        let vec = new THREE.Vector3();
        var pos = new THREE.Vector3();
        function clickscreen(evt) {
            let x = (evt.clientX / container.clientWidth) * 2 - 1;
            let y = - (event.clientY / container.clientHeight) * 2 + 1;
            let z = 0.9;
            vec.set(x, y, z);
            vec.unproject(camera);
            vec.sub(camera.position).normalize();
            //            var raycaster = new THREE.Raycaster( camera.position, vec );
            //         var intersects = raycaster.ray.intersectPlane( projectPlane, pos);
            var distance = - camera.position.z / vec.z;
            pos.copy(camera.position).add(vec.multiplyScalar(distance));
            console.log(pos);
            if (facePoint(bottomRight, bottomLeft, pos))
                console.log("out");
            else
                console.log("in");
        }

    }


    //angle
    let r = new THREE.Vector3(0, 1, 0);
    let a1 = new THREE.Vector3(0, 1, 0);
    let a2 = new THREE.Vector3(1, -1, 0).normalize();
    let a3 = new THREE.Vector3(-1, -1, 0).normalize();
    var quaternion = new THREE.Quaternion();
    quaternion.setFromUnitVectors(a1, a3);
    r.applyQuaternion(quaternion);
    quaternion.setFromUnitVectors(a2, a1);
    r.applyQuaternion(quaternion);

    // quaternion.setFromAxisAngle(new THREE.Vector3(0, 0, 1), Math.PI / 4);

    // let angle = a1.angleTo(a2);
    // angle = a3.angleTo(a1);
    let c1 = new THREE.Vector3();

    //ray
    let pointOnRay = new THREE.Vector3();
    let pointOnSeg = new THREE.Vector3();
    let v1 = new THREE.Vector3(200, 100, 0);
    let v2 = new THREE.Vector3(100, 100, 0);
    let ray = new THREE.Ray(new THREE.Vector3(50, 0, 0), new THREE.Vector3(1, 1, 0).normalize());
    let d = ray.distanceSqToSegment(v1, v2, pointOnRay, pointOnSeg)
    //     console.log(d);
}
function onWindowResize() {
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
}
function animate() {
    var delta = clock.getDelta();
    requestAnimationFrame(animate);
    TWEEN.update();

    needUpdate.update(delta);
    control3D.update();
    render();
}
function render() {
    renderer.render(scene, camera);
}

main();