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
  renderer = new THREE.WebGLRenderer({ canvas: canvas, context: context });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.setClearColor(0x777777, 0);
  container.appendChild(renderer.domElement);

  window.addEventListener('resize', onWindowResize, false);
  let controls = new THREE.OrbitControls(camera, renderer.domElement);

  let button = document.querySelector(".wire");
  button.addEventListener('click', function (event) {
    event.stopPropagation();
    var group = scene.children[1];
    group.traverse(function (child) {
      if (child.material) child.material.wireframe = !child.material.wireframe;
    });
  });

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
let positions, uv;
let drawRange;
function changeText(s) {
  positions = textMesh.geometry.attributes.position.array;
  uv = textMesh.geometry.attributes.uv.array;
  getTextData(s);
  textMesh.geometry.scale(0.03, 0.03, 0.03);
  textMesh.geometry.setDrawRange(0, drawRange);

  textMesh.geometry.attributes.position.needsUpdate = true;
  textMesh.geometry.attributes.uv.needsUpdate = true;


}

let maxLen = 15;
positions = new Float32Array(maxLen * 6 * 3);
uv = new Float32Array(maxLen * 6 * 2);
function getTextData(s) {
  let len = s.length;
  // let numVertices = len * 6;


  var offsetPos = 0;
  let offsetUv = 0;
  var x = 0;
  let ttt = 0.005//get rid of flikering edge 
  var maxX = fontInfo.textureWidth;
  var maxY = fontInfo.textureHeight;
  let min = maxLen > len ? len : maxLen;
  drawRange = min * 6;
  for (var ii = 0; ii < min; ++ii) {
    var letter = s[ii];
    var glyphInfo = fontInfo.glyphInfos[letter];
    if (glyphInfo) {
      var x2 = x + glyphInfo.width;
      var u1 = glyphInfo.x / maxX + ttt;
      var u2 = (glyphInfo.x + glyphInfo.width) / maxX - ttt;
      var v1 = (maxY - glyphInfo.y - fontInfo.letterHeight) / maxY + ttt;
      var v2 = (maxY - glyphInfo.y) / maxY - ttt;

      // 6 vertices per letter
      positions[offsetPos + 0] = x;
      positions[offsetPos + 1] = 0;
      positions[offsetPos + 2] = 0;
      uv[offsetUv + 0] = u1;
      uv[offsetUv + 1] = v1;

      positions[offsetPos + 3] = x2;
      positions[offsetPos + 4] = 0;
      positions[offsetPos + 5] = 0;
      uv[offsetUv + 2] = u2;
      uv[offsetUv + 3] = v1;

      positions[offsetPos + 6] = x;
      positions[offsetPos + 7] = fontInfo.letterHeight;
      positions[offsetPos + 8] = 0;
      uv[offsetUv + 4] = u1;
      uv[offsetUv + 5] = v2;

      positions[offsetPos + 9] = x;
      positions[offsetPos + 10] = fontInfo.letterHeight;
      positions[offsetPos + 11] = 0;
      uv[offsetUv + 6] = u1;
      uv[offsetUv + 7] = v2;

      positions[offsetPos + 12] = x2;
      positions[offsetPos + 13] = 0;
      positions[offsetPos + 14] = 0;
      uv[offsetUv + 8] = u2;
      uv[offsetUv + 9] = v1;

      positions[offsetPos + 15] = x2;
      positions[offsetPos + 16] = fontInfo.letterHeight;
      positions[offsetPos + 17] = 0;
      uv[offsetUv + 10] = u2;
      uv[offsetUv + 11] = v2;

      x += glyphInfo.width;
      offsetPos += 18;
      offsetUv += 12;
    } else {
      // we don't have this character so just advance
      x += fontInfo.spaceWidth;
    }
  }
}

function initText() {

  getTextData("123.123123")
  var image = new Image();
  image.src = "/assets/img/8x8-font.png";
  image.onload = function (img) {
    texture.needsUpdate = true;
  }
  let geometry = new THREE.BufferGeometry();

  let positionAttribute = new THREE.Float32BufferAttribute(positions, 3);
  let uvAttribute = new THREE.Float32BufferAttribute(uv, 2);
  geometry.addAttribute('position', positionAttribute);
  geometry.addAttribute('uv', uvAttribute);
  geometry.scale(0.05, 0.05, 0.05);
  geometry.setDrawRange(0, drawRange);
  let texture = new THREE.Texture(image);
  //   THREE.RepeatWrapping
  // THREE.ClampToEdgeWrapping
  // THREE.MirroredRepeatWrapping
  texture.wrapS = THREE.ClampToEdgeWrapping;//
  texture.wrapT = THREE.ClampToEdgeWrapping;
  //   THREE.NearestFilter
  // THREE.LinearFilter
  texture.minFilter = THREE.NearestFilter;
  texture.magFilter = THREE.NearestFilter;
  let material = new THREE.RawShaderMaterial({
    uniforms: {
      texture1: { value: texture }
    },
    vertexShader: res["first.vert"],
    fragmentShader: res["first.frag"],
    side: THREE.DoubleSide,
    transparent: true,
    depthTest: false//always on top of 

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
  textMesh.position.set(point.x, point.y, point.z);
  point.project(camera);
  point = toScreen(point);
  changeText(point.x.toFixed(2) + "," + point.y.toFixed(2));
}
function drawF() {
  // Fmesh.rotation.y += 0.05;
  Fmesh.updateMatrixWorld();
}

var fontInfo = {
  letterHeight: 8,
  spaceWidth: 8,
  spacing: -1,
  textureWidth: 64,
  textureHeight: 64,
  glyphInfos: {
    'a': { x: 0, y: 0, width: 8, },
    'b': { x: 8, y: 0, width: 8, },
    'c': { x: 16, y: 0, width: 8, },
    'd': { x: 24, y: 0, width: 8, },
    'e': { x: 32, y: 0, width: 8, },
    'f': { x: 40, y: 0, width: 8, },
    'g': { x: 48, y: 0, width: 8, },
    'h': { x: 56, y: 0, width: 8, },
    'i': { x: 0, y: 8, width: 8, },
    'j': { x: 8, y: 8, width: 8, },
    'k': { x: 16, y: 8, width: 8, },
    'l': { x: 24, y: 8, width: 8, },
    'm': { x: 32, y: 8, width: 8, },
    'n': { x: 40, y: 8, width: 8, },
    'o': { x: 48, y: 8, width: 8, },
    'p': { x: 56, y: 8, width: 8, },
    'q': { x: 0, y: 16, width: 8, },
    'r': { x: 8, y: 16, width: 8, },
    's': { x: 16, y: 16, width: 8, },
    't': { x: 24, y: 16, width: 8, },
    'u': { x: 32, y: 16, width: 8, },
    'v': { x: 40, y: 16, width: 8, },
    'w': { x: 48, y: 16, width: 8, },
    'x': { x: 56, y: 16, width: 8, },
    'y': { x: 0, y: 24, width: 8, },
    'z': { x: 8, y: 24, width: 8, },
    '0': { x: 16, y: 24, width: 8, },
    '1': { x: 24, y: 24, width: 8, },
    '2': { x: 32, y: 24, width: 8, },
    '3': { x: 40, y: 24, width: 8, },
    '4': { x: 48, y: 24, width: 8, },
    '5': { x: 56, y: 24, width: 8, },
    '6': { x: 0, y: 32, width: 8, },
    '7': { x: 8, y: 32, width: 8, },
    '8': { x: 16, y: 32, width: 8, },
    '9': { x: 24, y: 32, width: 8, },
    '-': { x: 32, y: 32, width: 8, },
    '*': { x: 40, y: 32, width: 8, },
    '!': { x: 48, y: 32, width: 8, },
    '?': { x: 56, y: 32, width: 8, },
    '.': { x: 0, y: 40, width: 8 },
    ',': { x: 8, y: 40, width: 8 }
  },
};