// var image = new Image();
// image.src = "/assets/img/logo3.svg";  // MUST BE SAME DOMAIN!!!
// image.onload = function () {
//     render(image);
// };

let canvas = document.getElementById("c");
// canvas.addEventListener("resize", resize, false);
function resize() {
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;
}
resize();
let gl = canvas.getContext("webgl2");
if (!gl) {
    throw new Error("gl error!");
}

let res = loadRes([
    "/assets/img/baby.jpg",
    "/iframes/webgl/f04_displayImage/basic.vert",
    "/iframes/webgl/f04_displayImage/basic.frag",
], main);

function main() {
    createImage();
    createShaderProgram();
    initgl();
    bindBuffer();
    render();
}
let img;
function createImage() {
    img = res["/assets/img/baby.jpg"];
}
let vertexShader, fragmentShader
let program;
function createShaderProgram() {
    vertexShader = createShader(gl, gl.VERTEX_SHADER, res["/iframes/webgl/f04_displayImage/basic.vert"]);
    fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, res["/iframes/webgl/f04_displayImage/basic.frag"]);
    program = createProgram(gl, vertexShader, fragmentShader);

}
function initgl() {
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(1.0, 1.0, 1.0, 1.0);
}
let vao;
let resolutionUniformLocation;
let colorLocation;
let imageLocation;
function bindBuffer() {

    var positionAttributeLocation = gl.getAttribLocation(program, "a_position");
    var texCoordAttributeLocation = gl.getAttribLocation(program, "a_texCoord");
    var positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    setRectangle(gl, 0, 0, img.width, img.height);


    resolutionUniformLocation = gl.getUniformLocation(program, "u_resolution");
    imageLocation = gl.getUniformLocation(program, "u_image");
    // colorLocation = gl.getUniformLocation(program, "u_color");

    vao = gl.createVertexArray();
    gl.bindVertexArray(vao);

    gl.enableVertexAttribArray(positionAttributeLocation);
    var size = 2;          // 2 components per iteration
    var type = gl.FLOAT;   // the data is 32bit floats
    var normalize = false; // don't normalize the data
    var stride = 0;        // 0 = move forward size * sizeof(type) each iteration to get the next position
    var offset = 0;        // start at the beginning of the buffer
    gl.vertexAttribPointer(positionAttributeLocation, size, type, normalize, stride, offset);


    var texCoordBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, texCoordBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
        0.0,  0.0,
        1.0,  0.0,
        0.0,  1.0,
        0.0,  1.0,
        1.0,  0.0,
        1.0,  1.0,
    ]), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(texCoordAttributeLocation);
    var size = 2;          // 2 components per iteration
    var type = gl.FLOAT;   // the data is 32bit floats
    var normalize = false; // don't normalize the data
    var stride = 0;        // 0 = move forward size * sizeof(type) each iteration to get the next position
    var offset = 0;        // start at the beginning of the buffer
    gl.vertexAttribPointer(texCoordAttributeLocation, size, type, normalize, stride, offset);

    var texture = gl.createTexture();
    gl.activeTexture(gl.TEXTURE0 + 0);
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    var mipLevel = 0;               // the largest mip
    var internalFormat = gl.RGBA;   // format we want in the texture
    var srcFormat = gl.RGBA;        // format of data we are supplying
    var srcType = gl.UNSIGNED_BYTE; // type of data we are supplying
    gl.texImage2D(gl.TEXTURE_2D,
        mipLevel,
        internalFormat,
        srcFormat,
        srcType,
        img);

}
// Returns a random integer from 0 to range - 1.
function randomInt(range) {
    return Math.floor(Math.random() * range);
}



function render() {
    gl.useProgram(program);
    gl.bindVertexArray(vao);
    gl.uniform2f(resolutionUniformLocation, gl.canvas.width, gl.canvas.height);
   
    gl.uniform1i(imageLocation, 0);


    var primitiveType = gl.TRIANGLES;
    var offset = 0;
    var count = 6;
    gl.drawArrays(primitiveType, offset, count);
}

function setRectangle(gl, x, y, width, height) {
    var x1 = x;
    var x2 = x + width;
    var y1 = y;
    var y2 = y + height;
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
        x1, y1,
        x2, y1,
        x1, y2,
        x1, y2,
        x2, y1,
        x2, y2,
    ]), gl.STATIC_DRAW);
}