"use strict";
let folder = "/iframes/webgl/f13_Texture/"
let res = loadRes([
    folder + "basic.vert",
    folder + "basic.frag"
], main)



function main() {
    // Get A WebGL context
    /** @type {HTMLCanvasElement} */
    var canvas = document.getElementById("canvas");
    var gl = canvas.getContext("webgl2");
    if (!gl) {
        return;
    }
    function resize() {
        canvas.width = canvas.clientWidth;
        canvas.height = canvas.clientHeight;
    }
    resize();
    // Use our boilerplate utils to compile the shaders and link into a program

    var program = createProgramFromSrc(gl, res[folder + "basic.vert"], res[folder + "basic.frag"]);

    // look up where the vertex data needs to go.
    var positionAttributeLocation = gl.getAttribLocation(program, "a_position");
    var colorAttributeLocation = gl.getAttribLocation(program, "a_color");
    var texcoordAttributeLocation = gl.getAttribLocation(program, "a_texcoord");
    // look up uniform locations
    var colorLocation = gl.getUniformLocation(program, "u_color");
    var matrixLocation = gl.getUniformLocation(program, "u_matrix");
    // Create a buffer

    let renderObj = rect;

    // Create a vertex array object (attribute state)
    var vao = gl.createVertexArray();

    // and make it the one we're currently working with
    gl.bindVertexArray(vao);
    //position------
    var positionBuffer = gl.createBuffer();
    // Turn on the attribute
    gl.enableVertexAttribArray(positionAttributeLocation);

    // Bind it to ARRAY_BUFFER (think of it as ARRAY_BUFFER = positionBuffer)
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    // Set Geometry.
    gl.bufferData(gl.ARRAY_BUFFER, renderObj.posData, gl.STATIC_DRAW);

    // Tell the attribute how to get data out of positionBuffer (ARRAY_BUFFER)
    var size = 3;          // 2 components per iteration
    var type = gl.FLOAT;   // the data is 32bit floats
    var normalize = false; // don't normalize the data
    var stride = 0;        // 0 = move forward size * sizeof(type) each iteration to get the next position
    var offset = 0;        // start at the beginning of the buffer
    gl.vertexAttribPointer(positionAttributeLocation, size, type, normalize, stride, offset);

    //color-----
    var colorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, renderObj.colorData, gl.STATIC_DRAW);
    gl.enableVertexAttribArray(colorAttributeLocation);
    var size = 3;          // 3 components per iteration
    var type = gl.UNSIGNED_BYTE;   // the data is 8bit unsigned bytes
    var normalize = true;  // convert from 0-255 to 0.0-1.0
    var stride = 0;        // 0 = move forward size * sizeof(type) each iteration to get the next color
    var offset = 0;        // start at the beginning of the buffer
    gl.vertexAttribPointer(colorAttributeLocation, size, type, normalize, stride, offset);

    //tex
    var texcoordBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, texcoordBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, renderObj.texData2, gl.STATIC_DRAW);
    // Turn on the attribute
    gl.enableVertexAttribArray(texcoordAttributeLocation);

    // Tell the attribute how to get data out of colorBuffer (ARRAY_BUFFER)
    var size = 2;          // 2 components per iteration
    var type = gl.FLOAT;   // the data is 32bit floating point values
    var normalize = true;  // convert from 0-255 to 0.0-1.0
    var stride = 0;        // 0 = move forward size * sizeof(type) each iteration to get the next color
    var offset = 0;        // start at the beginning of the buffer
    gl.vertexAttribPointer(texcoordAttributeLocation, size, type, normalize, stride, offset);

    var texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);

    // Fill the texture with a 1x1 blue pixel.
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE,
        new Uint8Array([0, 0, 255, 255]));

    var wrapS = gl.CLAMP_TO_EDGE;//gl.CLAMP_TO_EDGE//gl.MIRRORED_REPEAT//gl.REPEAT
    var wrapT = gl.MIRRORED_REPEAT;
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, wrapS);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, wrapT);
    // Asynchronously load an image
    var image = new Image();
    image.src = folder + "logoS.svg";
    image.addEventListener('load', function () {
        // Now that the image has loaded make copy it to the texture.
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
        gl.generateMipmap(gl.TEXTURE_2D);
    });

    // First let's make some variables
    // to hold the translation,
    var translation = [0, 0, 0];
    var rotation = [degToRad(40), degToRad(25), degToRad(325)];
    var scale = [renderObj.scale, renderObj.scale, renderObj.scale];
    var color = [Math.random(), Math.random(), Math.random(), 1];
    var fieldOfViewRadians = degToRad(60);
    let cameraAngleRadians = degToRad(0);
    var rotationSpeed = 1.2;
    var then = 0;


    // requestAnimationFrame(drawScene);

    // Setup a ui. 
    function updateCameraAngle(evt) {
        cameraAngleRadians = degToRad(evt.currentTarget.value);
        rotateCamera();
    }
    let slider = document.querySelector("#cameraAngle");

    slider.addEventListener("input", updateCameraAngle, false);

    //init gl
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

    // Clear the canvas
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    // gl.enable(gl.CULL_FACE);
    gl.enable(gl.DEPTH_TEST);
    var aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
    var zNear = 1;
    var zFar = 2000;
    var projectionMatrix = m4.perspective(fieldOfViewRadians, aspect, zNear, zFar);

    var viewProjectionMatrix;
    rotateCamera();
    function rotateCamera() {
        var cameraMatrix = m4.yRotation(cameraAngleRadians);
        cameraMatrix = m4.translate(cameraMatrix, 0, 50, 300);

        var cameraPosition = [
            cameraMatrix[12],
            cameraMatrix[13],
            cameraMatrix[14],
        ];

        var up = [0, 1, 0];
        var target = [0, 0, 0];
        var cameraMatrix = m4.lookAt(cameraPosition, target, up);
        var viewMatrix = m4.inverse(cameraMatrix);

        viewProjectionMatrix = m4.multiply(projectionMatrix, viewMatrix);
    }
    requestAnimationFrame(drawScene);
    // Draw the scene.
    function drawScene(now) {
        // Convert to seconds
        now *= 0.001;
        // Subtract the previous time from the current time
        var deltaTime = now - then;
        // Remember the current time for the next frame.
        then = now;
        // Tell it to use our program (pair of shaders)
        gl.useProgram(program);

        // Bind the attribute/buffer set we want.
        gl.bindVertexArray(vao);


        // Set the color.
        gl.uniform4fv(colorLocation, color);

        //set matrix
        rotation[1] += rotationSpeed * deltaTime;  // don't do this

        let matrix = m4.translate(viewProjectionMatrix, translation[0], translation[1], translation[2]);
        matrix = m4.xRotate(matrix, rotation[0]);
        matrix = m4.yRotate(matrix, rotation[1]);
        matrix = m4.zRotate(matrix, rotation[2]);
        matrix = m4.scale(matrix, scale[0], scale[1], scale[2]);
        matrix = m4.translate(matrix, -renderObj.center[0], -renderObj.center[1], -renderObj.center[2]);//custom center

        gl.uniformMatrix4fv(matrixLocation, false, matrix);

        // Draw the geometry.
        var primitiveType = gl.TRIANGLES;
        var offset = 0;
        var count = renderObj.pointNum;
        gl.drawArrays(primitiveType, offset, count);

        requestAnimationFrame(drawScene);
    }
}



// with the values that define a letter 'F'.
