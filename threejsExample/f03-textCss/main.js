
function main() {
  init();
  animate();
  // render();
}
let container;
let camera, scene, renderer;
let labelRenderer;
function init() {
  container = document.getElementById('container');
  camera = new THREE.PerspectiveCamera(60, container.clientWidth / container.clientHeight, 0.1, 100);
  camera.position.z = 5;
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x777777);
  // geometry
  initMesh();
  initText();
  //renderer
  let canvas = document.querySelector(".scene")
  let context = canvas.getContext('webgl2');
  renderer = new THREE.WebGLRenderer({ canvas: canvas, context: context });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.setClearColor(0x777777, 0);
  container.appendChild(renderer.domElement);

  labelRenderer = new THREE.CSS2DRenderer();
  labelRenderer.setSize(container.clientWidth, container.clientHeight);
  labelRenderer.domElement.style.position = 'absolute';
  labelRenderer.domElement.style.top = 0;
  document.body.appendChild(labelRenderer.domElement);

  window.addEventListener('resize', onWindowResize, false);
  let controls = new THREE.OrbitControls(camera);

  

}

function toScreen(vector) {
  vector.x = (vector.x + 1) * container.clientWidth / 2;
  vector.y = - (vector.y - 1) * container.clientHeight / 2;
  vector.z = 0;
  return vector;
}
function onWindowResize() {
  camera.aspect = container.clientWidth / container.clientHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(container.clientWidth, container.clientHeight);
}
//




function initText() {

  var text = document.createElement('div');
  text.className = 'label';
  text.textContent = 'Earth';
  text.style.marginTop = '-1em';
  text.style.color="white";
  var label = new THREE.CSS2DObject(text);
  label.position.set(0, 1, 0);
  mesh.add(label);
}

let mesh;
function initMesh() {
  let geometry = new THREE.BoxGeometry(1, 1, 1);
  let material = new THREE.MeshBasicMaterial({
    color: 0x00ff00
  })
  mesh = new THREE.Mesh(geometry, material);

  scene.add(mesh);
}
function animate() {
  requestAnimationFrame(animate);
  render();
}
function render() {
  renderer.render(scene, camera);
  labelRenderer.render( scene, camera );
}





main();