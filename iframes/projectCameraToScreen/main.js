var scene, renderer, camera, control;
var objArr = [];

init();
animate();

function init()
{
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100000);
    camera.position.x = 0;
    camera.position.y = 0;
    camera.position.z = 200;
    
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);
    
    control = new THREE.OrbitControls(camera, renderer.domElement);
    control.addEventListener('change', function() {
        onCameraChange();
    });
    
    
    for (var i = 0; i < 5; i++)
    {
        var sphereGeo = new THREE.SphereGeometry(10, 20, 10);
        var sphereMesh = new THREE.Mesh(sphereGeo);
        sphereMesh.position.set(i*20, 0, i*20);
        
        scene.add(sphereMesh);
        
        var divElem = document.createElement('div');
        divElem.style.position = 'absolute';
        divElem.style.color = 'white';
        divElem.innerHTML = 'sphere_' + i;
        document.body.appendChild(divElem);
        var divObj = new THREE.Object3D();
        divObj.position = sphereGeo.vertices[0].clone();
        sphereMesh.add(divObj);
        
        var objData = {
            mesh: sphereMesh,
            divElem: divElem,
            divObj: divObj
        };
        objArr.push(objData);

    }
    
}

function animate()
{
    requestAnimationFrame( animate );
    update();
    render();
}

function update()
{
    control.update();
}

function render()
{
    renderer.render(scene, camera);
}

function onCameraChange()
{
    objArr.forEach(function(objData) {
        var proj = toScreenPosition(objData.divObj, camera);
        objData.divElem.style.left = proj.x + 'px';
        objData.divElem.style.top = proj.y + 'px';        
        
    });
}


var vector = new THREE.Vector3();
function toScreenPosition(obj, camera)
{
    // TODO: need to update this when resize window
    var widthHalf = 0.5*renderer.context.canvas.width;
    var heightHalf = 0.5*renderer.context.canvas.height;
    
    obj.updateMatrixWorld();
    vector.setFromMatrixPosition(obj.matrixWorld);
    vector.project(camera);
    
    vector.x = ( vector.x * widthHalf ) + widthHalf;
    vector.y = - ( vector.y * heightHalf ) + heightHalf;
    
    return  vector;

}

    