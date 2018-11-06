## lookat version
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
##Vector3.project()
vector.project( camera );
This only converts a vector to normalized device space. You still have to map the vector to 2D screen space. Something like:

vector.x = ( vector.x + 1) * width / 2;
vector.y = - ( vector.y - 1) * height / 2;
vector.z = 0;
width and height represent the dimensions of the canvas (renderer.domElement).

After the call of Vecto3.project(), the components of vector are in the range of [ - 1, + 1 ] (assuming the vector originally was inside the view frustum). The mentioned calculation will then convert this range to [ 0, 1 ] and then multiply the values with the respective dimensions (width or height). The y-coordinate is handled in a special way because in screen space the origin of the coordinate system is top left (and not bottom left).