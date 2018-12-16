if (WEBGL.isWebGL2Available() === false) {
  document.body.appendChild(WEBGL.getWebGL2ErrorMessage());
}

let res = loadLocalRes([
  'first.vert',
  'first.frag'
], main);
function main() {
  init();
  render();
}
var container;
var camera, scene, renderer;

// animate();
function init() {
  container = document.getElementById('container');
  camera = new THREE.PerspectiveCamera(
    60, container.clientWidth / container.clientHeight, 0.1, 100);
  camera.position.z = 5;
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0xffffff);
  // geometry
  var positions = [
    0, 0, 0,
    1, 0, 0,
    0.5, 1, 0
  ];

  var geometry = new THREE.BufferGeometry();

  var positionAttribute = new THREE.Float32BufferAttribute(positions, 3);

  geometry.addAttribute('position', positionAttribute);

  // material
  var material = new THREE.RawShaderMaterial({
    uniforms: {},
    vertexShader: res["first.vert"],
    fragmentShader: res["first.frag"],
    side: THREE.DoubleSide,
    // transparent: true

  });

  var mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);


  var canvas = document.createElement('canvas');
  var context = canvas.getContext('webgl2');
  renderer = new THREE.WebGLRenderer({ canvas: canvas, context: context });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(container.clientWidth, container.clientHeight);
  // renderer.setClearColor( 0xffffff, 0);
  container.appendChild(renderer.domElement);

  window.addEventListener('resize', onWindowResize, false);
}


function onWindowResize() {
  camera.aspect = container.clientWidth / container.clientHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(container.clientWidth, container.clientHeight);
}
//

function animate() {
  // requestAnimationFrame(animate);
  // render();
}
function render() {
  renderer.render(scene, camera);
}