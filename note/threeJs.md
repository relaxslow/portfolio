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