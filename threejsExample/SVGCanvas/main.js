//svg->canvas->texture
var mesh;
var scene = new THREE.Scene();

var camera = new THREE.PerspectiveCamera(50, 500 / 400, 0.1, 1000);
camera.position.z = 10;

var renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(500, 400);
document.body.appendChild(renderer.domElement);

var svg = document.getElementById("svgContainer").querySelector("svg");


var canvas = document.createElement("canvas");
var svgSize = svg.getBoundingClientRect();
canvas.width = svgSize.width;
canvas.height = svgSize.height;
var ctx = canvas.getContext("2d");

var img = document.createElement("img");
function changeImg() {
    var svgData = (new XMLSerializer()).serializeToString(svg);
    img.setAttribute("src", "data:image/svg+xml;base64," + window.btoa(unescape(encodeURIComponent(svgData))));

}
changeImg();
img.onload = function () {
    ctx.drawImage(img, 0, 0);
    texture.needsUpdate = true;
};
var texture = new THREE.Texture(canvas);
texture.needsUpdate = true;
var geometry = new THREE.PlaneGeometry(5, 5, 1, 1);
let material;
material = new THREE.MeshBasicMaterial({ map: texture });
material.map.minFilter = THREE.LinearFilter;
material.side = THREE.DoubleSide;
mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);
document.body.addEventListener("click", clickBody)


var colors = ["red", "orange", "yellow", "green", "blue"];
var c = 0;
function clickBody() {
    let bodys = document.querySelectorAll(".body2");
    for (let i = 0; i < bodys.length; i++) {
        const body = bodys[i];
        body.setAttribute("fill", colors[c]);
    }
    // document.getElementById("test").setAttribute("fill", colors[c]);
    changeImg();

    c++;
    if (c == colors.length) {
        c = 0;
    }
}

var render = function () {
    requestAnimationFrame(render);
    mesh.rotation.y += 0.01;
    renderer.render(scene, camera);
};


render();