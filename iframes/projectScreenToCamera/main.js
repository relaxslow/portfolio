// @ Mugen87

let camera, cameraOrtho, scene, sceneOrtho, renderer, mesh, sprite, lineGeometry;

const spriteWorldCoords = new THREE.Vector3();
const spriteDimensions = new THREE.Vector2( 128, 128 );

init();
animate();

function init() {

	const width = window.innerWidth;
	const height = window.innerHeight;

  camera = new THREE.PerspectiveCamera( 70, width / height, 0.01, 10 );
  camera.position.z = 1;
  
  cameraOrtho = new THREE.OrthographicCamera( - width / 2, width / 2, height / 2, - height / 2, 0.01, 10 );
	cameraOrtho.position.z = 1;

  scene = new THREE.Scene();
  sceneOrtho = new THREE.Scene();
  
  // mesh

  const geometry = new THREE.BoxBufferGeometry( 0.2, 0.2, 0.2 );
  const material = new THREE.MeshNormalMaterial();

  mesh = new THREE.Mesh( geometry, material );
  scene.add( mesh );
  
  // sprite
  
  const textureLoader = new THREE.TextureLoader();
  const texture = textureLoader.load( '/assets/img/favicon.png' );
  const spriteMaterial = new THREE.SpriteMaterial( { map: texture } );
  sprite = new THREE.Sprite( spriteMaterial );
  
  sprite.scale.set( spriteDimensions.x, spriteDimensions.y, 1 );
  sceneOrtho.add( sprite );
  
 	updateSprite();
  
  // line
  
  lineGeometry = new THREE.BufferGeometry();
  lineGeometry.setFromPoints( [ mesh.position.clone(), sprite.position.clone() ] );
  lineGeometry.attributes.position.dynamic = true;
  const lineMaterial = new THREE.LineBasicMaterial( { color: 0xffffff } );
  const line = new THREE.Line( lineGeometry, lineMaterial );
  scene.add( line );
  
  //

  renderer = new THREE.WebGLRenderer( { antialias: true } );
  renderer.setPixelRatio( window.devicePixelRatio );
  renderer.setSize( window.innerWidth, window.innerHeight );
  renderer.autoClear = false;
  document.body.appendChild( renderer.domElement );

  window.addEventListener( 'resize', onWindowResize, false );
  
  const controls = new THREE.OrbitControls( camera, renderer.domElement );

}

function onWindowResize() {

	const width = window.innerWidth;
	const height = window.innerHeight;

  camera.aspect = width / height;
  camera.updateProjectionMatrix();
  
  cameraOrtho.left = - width / 2;
	cameraOrtho.right = width / 2;
	cameraOrtho.top = height / 2;
	cameraOrtho.bottom = - height / 2;
	cameraOrtho.updateProjectionMatrix();
  
  updateSprite();
  
  renderer.setSize( window.innerWidth, window.innerHeight );
  
}

function updateSprite() {

  var width = window.innerWidth / 2;
  var height = window.innerHeight / 2;
  width -= spriteDimensions.x / 2;
  height -= spriteDimensions.y / 2;
  sprite.position.set( width, height, 0 ); // top right

}

function animate() {

	requestAnimationFrame( animate );
  
  mesh.rotation.x += 0.01;
  mesh.rotation.y += 0.02;
  
  //

  spriteWorldCoords.x = ( ( sprite.position.x ) / window.innerWidth ) * 2;
	spriteWorldCoords.y = ( ( sprite.position.y ) / window.innerHeight ) * 2;
  spriteWorldCoords.z = 0.5;
  
  camera.updateMatrixWorld();
 	spriteWorldCoords.unproject( camera );
  
  // update line geometry
  
  const position = lineGeometry.attributes.position;
  position.setXYZ( 0, mesh.position.x, mesh.position.y, mesh.position.z );
  position.setXYZ( 1, spriteWorldCoords.x, spriteWorldCoords.y, spriteWorldCoords.z );
  position.needsUpdate = true;
  
  //

	renderer.clear();
  renderer.render( scene, camera );
  renderer.clearDepth();
	renderer.render( sceneOrtho, cameraOrtho );

}