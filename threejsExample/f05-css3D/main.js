
function main() {
  init();
  animate();
  // render();
}
let container;
let camera, scene, renderer;
let css3Dscene, css3DRenderer;
let material;
function init() {
  container = document.getElementById('container');
  // camera = new THREE.PerspectiveCamera(60, container.clientWidth / container.clientHeight, 0.1, 1000);
  // camera.position.z = 200;
  var frustumSize = 500;
  var aspect = container.clientWidth / container.clientHeight;

  camera = new THREE.OrthographicCamera(frustumSize * aspect / - 2, frustumSize * aspect / 2, frustumSize / 2, frustumSize / - 2, 1, 1000);
  camera.position.set(0, 0, 200);
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x777777);

  css3Dscene = new THREE.Scene();
  material = new THREE.MeshBasicMaterial({ color: 0x000000, wireframe: true, wireframeLinewidth: 1, side: THREE.DoubleSide });
  // geometry
  // initMesh();
  // initText();
  // left
  createPlane(
    100, 100,
    'chocolate',
    new THREE.Vector3(- 50, 0, 0),
    new THREE.Euler(0, - 90 * THREE.Math.DEG2RAD, 0)
  );
  // right
  createPlane(
    100, 100,
    'saddlebrown',
    new THREE.Vector3(0, 0, 50),
    new THREE.Euler(0, 0, 0)
  );
  // top
  createPlane(
    100, 100,
    'none',
    new THREE.Vector3(0, 50, 0),
    new THREE.Euler(- 90 * THREE.Math.DEG2RAD, 0, 0)
  );
  // bottom
  createPlane(
    300, 300,
    'seagreen',
    new THREE.Vector3(0, - 50, 0),
    new THREE.Euler(- 90 * THREE.Math.DEG2RAD, 0, 0)
  );
  //renderer
  let canvas = document.querySelector(".scene")
  let context = canvas.getContext('webgl2');
  renderer = new THREE.WebGLRenderer({ canvas: canvas, context: context });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.setClearColor(0x777777, 0);
  container.appendChild(renderer.domElement);
  //Css3d scene renderer


  css3DRenderer = new THREE.CSS3DRenderer();
  css3DRenderer.setSize(container.clientWidth, container.clientHeight);
  css3DRenderer.domElement.style.position = 'absolute';
  css3DRenderer.domElement.style.top = 0;
  container.appendChild(css3DRenderer.domElement);

  window.addEventListener('resize', onWindowResize, false);
  let controls = new THREE.OrbitControls(camera);



}
function createPlane(width, height, cssColor, pos, rot) {
  var element = document.createElement('div');
  element.style.width = width + 'px';
  element.style.height = height + 'px';
  element.style.overflow = "hidden";
  element.style.opacity = 0.75;
  element.style.background = cssColor;
  element.innerHTML = `<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 128 128" width="128px" height="128px" style="enable-background:new 0 0 128 128;" xml:space="preserve">
	<path class="body2" fill="#F46A6A" d="M12.4,54.1c-0.2-0.2-0.2-0.3-0.3-0.5C4.6,40.3,1.3,23.4,2.7,2.8c21.4-3,40.2,1.6,56.3,13.4
            c0.2,0,0.2,0,0.2,0.2l0,0c16.3,12,30.9,26,44,41.4L47,106C31.2,84.8,19.8,67.5,12.4,54.1z" />
	<path class="body2" fill="#F46A6A" d="M30.9,91.2L57.7,126c-8.8,0.3-16.6-2.9-24.1-9.5C22.4,106.7,23.2,97.4,30.9,91.2z" />
	<path class="body2" fill="#F46A6A" d="M60.1,70.4c-5.9,5.4-1.7,15.4,6.6,25.5c5.8,7.1,15.8,11.5,29.5,13.4c1-11-2.4-22.2-9.5-30.7
            C77.7,66.8,67.2,65.1,60.1,70.4z" />
	<path class="body2" fill="#F46A6A" d="M93.8,44.4L122,67.1c5.8-9.3,4.8-16.8-2.7-22.7C112,39,100.6,39,93.8,44.4z" />
	<path class="symbol" fill="#FFFFFF" d="M32.9,39.5L28,71.1L59.9,67l-9.7-9.8l-13.4,5.1l4.8-13.7L32.9,39.5z" />
	<path class="symbol" fill="#FFFFFF" d="M36.1,33.5l31.7-4.2l-4.4,31.9L54,51.4l5.3-13.2l-13.7,4.6L36.1,33.5z" />
</svg>`
  element.addEventListener("mouseover", mouseOverFace, false);
  element.addEventListener("mouseout", mouseOutFace, false);
  var object = new THREE.CSS3DObject(element);
  object.position.copy(pos);
  object.rotation.copy(rot);
  css3Dscene.add(object);
  var geometry = new THREE.PlaneBufferGeometry(width, height);
  var mesh = new THREE.Mesh(geometry, material);
  mesh.position.copy(object.position);
  mesh.rotation.copy(object.rotation);
  scene.add(mesh);
}
let select
function mouseOverFace(evt) {
  let face = evt.currentTarget;
  face.originColor = face.style.background;
  face.style.background = "white";
  select = face;
}
function mouseOutFace(evt) {
  if (select)
    select.style.background = select.originColor;

}
function onWindowResize() {
  camera.aspect = container.clientWidth / container.clientHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(container.clientWidth, container.clientHeight);
}
//




// function initText() {

//   var text = document.createElement('div');
//   text.className = 'label';
//   text.textContent = 'Earth';
//   text.style.marginTop = '-1em';
//   text.style.color = "white";
//   var label = new THREE.CSS2DObject(text);
//   label.position.set(0, 1, 0);
//   mesh.add(label);
// }

// let mesh;
// function initMesh() {
//   let geometry = new THREE.BoxGeometry(1, 1, 1);
//   let material = new THREE.MeshBasicMaterial({
//     color: 0x00ff00
//   })
//   mesh = new THREE.Mesh(geometry, material);

//   scene.add(mesh);
// }
function animate() {
  requestAnimationFrame(animate);
  render();
}
function render() {
  renderer.render(scene, camera);
  css3DRenderer.render(css3Dscene, camera);
}





main();