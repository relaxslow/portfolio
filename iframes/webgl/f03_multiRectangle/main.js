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

let shaderSrcs = getShaderSrc([
    "/iframes/webgl/f02_rectangle/basic.vert",
    "/iframes/webgl/f03_multiRectangle/basic.frag"
], main);

function main() {
    createShaderProgram();
    initgl();
    bindBuffer();
    render();
}
let vertexShader, fragmentShader
let program;
function createShaderProgram() {
    vertexShader = createShader(gl, gl.VERTEX_SHADER, shaderSrcs["/iframes/webgl/f02_rectangle/basic.vert"]);
    fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, shaderSrcs["/iframes/webgl/f03_multiRectangle/basic.frag"]);
    program = createProgram(gl, vertexShader, fragmentShader);

}
function initgl() {
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(1.0, 1.0, 1.0, 1.0);
}
let vao;
let resolutionUniformLocation;
let colorLocation;
function bindBuffer() {

    var positionAttributeLocation = gl.getAttribLocation(program, "a_position");
    var positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    var positions = [
        10, 20,
        80, 20,
        10, 30,
        10, 30,
        80, 20,
        80, 30,
    ];
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

    resolutionUniformLocation = gl.getUniformLocation(program, "u_resolution");
    colorLocation = gl.getUniformLocation(program, "u_color");

    vao = gl.createVertexArray();
    gl.bindVertexArray(vao);

    gl.enableVertexAttribArray(positionAttributeLocation);
    var size = 2;          // 2 components per iteration
    var type = gl.FLOAT;   // the data is 32bit floats
    var normalize = false; // don't normalize the data
    var stride = 0;        // 0 = move forward size * sizeof(type) each iteration to get the next position
    var offset = 0;        // start at the beginning of the buffer
    gl.vertexAttribPointer(positionAttributeLocation, size, type, normalize, stride, offset);



}
// Returns a random integer from 0 to range - 1.
function randomInt(range) {
    return Math.floor(Math.random() * range);
}

// Fill the buffer with the values that define a rectangle.
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
function render() {
    gl.useProgram(program);
    gl.bindVertexArray(vao);
    gl.uniform2f(resolutionUniformLocation, gl.canvas.width, gl.canvas.height);
    for (var ii = 0; ii < 50; ++ii) {
        // Put a rectangle in the position buffer
        setRectangle(gl, randomInt(300), randomInt(300), randomInt(300), randomInt(300));

        // Set a random color.
        let r=Math.random();
         let g=Math.random();
          let b=Math.random();
        gl.uniform4f(colorLocation, r, g, b, 1);

        // Draw the rectangle.
        var primitiveType = gl.TRIANGLES;
        var offset = 0;
        var count = 6;
        gl.drawArrays(primitiveType, offset, count);
    }

    // draw
    // var primitiveType = gl.TRIANGLES;
    // var offset = 0;
    // var count = 6;
    // gl.drawArrays(primitiveType, offset, count);
}