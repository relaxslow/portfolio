## format glsl files
install Clang-format  for vs code;
install  Clang-format use : npm install -g clang-format; 
install glsl-canvas for test and debug;
##  version
    console.log( THREE.REVISION );

## control target
    controls.target.set(0,1.2,0);
    controls.update();

##error
* Matrix3.getInverse() can't invert matrix, determinant is 0
> scale object set to 0

## custom uv
* mesh.faceVertexUvs
> geometry.faceVertexUvs[ 0 ][ faceIndex ][ vertexIndex ]
## custom texture filter
* THREE.NearestFilter 
* THREE.LinearFilter
* THREE.LinearMipMapNearestFilter
    texture.minFilter = THREE.NearestFilter;
    texture.magFilter = THREE.NearestFilter; 
    texture.needsUpdate = true; 
## Vector3.project()
vector.project( camera );
This only converts a vector to normalized device space. You still have to map the vector to 2D screen space. Something like:

vector.x = ( vector.x + 1) * width / 2;
vector.y = - ( vector.y - 1) * height / 2;
vector.z = 0;
width and height represent the dimensions of the canvas (renderer.domElement).

After the call of Vecto3.project(), the components of vector are in the range of [ - 1, + 1 ] (assuming the vector originally was inside the view frustum). The mentioned calculation will then convert this range to [ 0, 1 ] and then multiply the values with the respective dimensions (width or height). The y-coordinate is handled in a special way because in screen space the origin of the coordinate system is top left (and not bottom left).

if render single frame, add following , if whole function in animation loop, no need
//    camera.updateMatrixWorld();
//convert screen to 3D
## svg 
can't wrap svg  to mesh, it convert svg to bitmap and map to mesh  
svgloader -- convert svg to mesh
svg must have inline attribute fill to success read its color


##raycast
# bullet hit
Unfortunately, I don’t understand what you are doing in your code so let me provide you a general guide for implementing a robust bullet collision detection.

The line of fire is usually represented as a ray.
In each simulation step, the origin of the ray is the previous position of the bullet.
You now perform an intersection test with the obstacles in your game environment.
If there is an intersection, computed the (squared) euclidian distance between the origin of the ray and the intersection point. Let’s call this distance d1.
Now compute the “new” position of the bullet for this simulation step and the (squared) euclidian distance between the new position and the previous one. Let’s call this distance d2.
If d1 <= d2, you have a hit.
A working example of this code is presented in the following demo of Yuka 1, a library of developing game AI. The API is similar to three.js, so it should be no problem use the code as a template.

# import gltf
 material alpha can't export in current version
 can't import single channel of rotation 