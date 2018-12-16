if (WEBGL.isWebGL2Available() === false) {
  document.body.appendChild(WEBGL.getWebGL2ErrorMessage());
}

let res = loadLocalRes([
  'first.vert',
  'first.frag'
], main);
function main() {
  init();
  animate();
  // render();
}
let container;
let camera, scene, renderer;

function init() {
  container = document.getElementById('container');
  camera = new THREE.PerspectiveCamera(60, container.clientWidth / container.clientHeight, 0.1, 100);
  camera.position.z = 5;
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x777777);
  // geometry
  initFMesh();
  initText();
  //renderer
  let canvas = document.querySelector(".scene")
  let context = canvas.getContext('webgl2');
  renderer = new THREE.WebGLRenderer({ canvas: canvas, context: context});
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.setClearColor( 0x777777, 0);
  container.appendChild(renderer.domElement);

  window.addEventListener('resize', onWindowResize, false);
  let controls = new THREE.OrbitControls(camera, renderer.domElement);


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



let textMesh;
let textCtx;
function initText() {
  let textCanvas = document.querySelector(".text");
  textCtx = textCanvas.getContext("2d");
  wid = 64;
  hei = 32;
  textCtx.canvas.width = wid;
  textCtx.canvas.height = hei;
  textCtx.font = "20px monospace";
  textCtx.textAlign = "center";
  textCtx.textBaseline = "middle";
  textCtx.fillStyle = "black";
  textCtx.clearRect(0, 0, textCtx.canvas.width, textCtx.canvas.height);
  textCtx.fillText("text", wid / 2, hei / 2);


  let geometry = new THREE.BufferGeometry();

  let positionAttribute = new THREE.Float32BufferAttribute(rect.positions, 3);
  let uvAttribute = new THREE.Float32BufferAttribute(rect.uv2, 2);
  geometry.addAttribute('position', positionAttribute);
  geometry.addAttribute('uv', uvAttribute);
  geometry.scale(1,0.5,1);
  let texture = new THREE.CanvasTexture(textCanvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.minFilter = THREE.NearestFilter;
  let material = new THREE.RawShaderMaterial({
    uniforms: {
      texture1: { value: texture }
    },
    vertexShader: res["first.vert"],
    fragmentShader: res["first.frag"],
    side: THREE.DoubleSide,
    transparent: true,
    depthTest:false//always on top of 

  });

  // above can be shorten to these three.
  // let geometry=new  THREE.PlaneGeometry( 1, 0.5 );
  // let material = new THREE.MeshBasicMaterial();
  // material.map = new THREE.CanvasTexture( textCanvas );

  textMesh = new THREE.Mesh(geometry, material);
  // textMesh.matrixAutoUpdate=false;
  scene.add(textMesh);
}

let Fmesh;
function initFMesh() {
  let geometry = new THREE.BufferGeometry();

  let positionAttribute = new THREE.Float32BufferAttribute(f.positions, 3);
  let uvAttribute = new THREE.Float32BufferAttribute(f.uv, 2);

  geometry.addAttribute('position', positionAttribute);
  geometry.addAttribute('uv', uvAttribute);
  geometry.scale(0.01, 0.01, 0.01);

  let image = document.createElement('img');
  image.width = 256;
  image.height = 128;
  image.src = '/assets/img/boxTex.svg';
  image.onload = function (img) {
    texture.needsUpdate = true;
  }
  let texture = new THREE.Texture(image);

  // let loader = new THREE.TextureLoader();
  // let texture = loader.load('/assets/img/boxTex.svg');
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.minFilter = THREE.NearestFilter;


  let material = new THREE.RawShaderMaterial({
    uniforms: {
      texture1: { value: texture }
    },
    vertexShader: res["first.vert"],
    fragmentShader: res["first.frag"],
    side: THREE.DoubleSide,
    // transparent: true

  });

  Fmesh = new THREE.Mesh(geometry, material);

  scene.add(Fmesh);
}
function animate() {
  requestAnimationFrame(animate);
  drawF();
  let point = new THREE.Vector3(1, 0, 0);
  point.applyMatrix4(Fmesh.matrixWorld);
  drawText(point);

  render();
}
function render() {
  renderer.render(scene, camera);
}
function drawText(point) {
  // textMesh.lookAt( camera.position );
  textMesh.quaternion.copy(camera.quaternion);
  textMesh.position.set(point.x,point.y,point.z);
}
function drawF() {
  Fmesh.rotation.y += 0.05;
  Fmesh.updateMatrixWorld();
}