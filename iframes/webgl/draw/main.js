let canvas = document.getElementById("c");
let gl = canvas.getContext("webgl2");
if (!gl) {
    throw new Error("gl error!");
}
function resize() {
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;
}
resize();
let res = loadRes([
    "/iframes/webgl/draw/basic.vert",
    "/iframes/webgl/draw/basic.frag",
], main);

function main() {
    createShaderProgram();
    initgl();
    bindBuffer();
    bindMouseEvent();
}
let vertexShader, fragmentShader;
let program;
function createShaderProgram() {
    vertexShader = createShader(gl, gl.VERTEX_SHADER, res["/iframes/webgl/draw/basic.vert"]);
    fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, res["/iframes/webgl/draw/basic.frag"]);
    program = createProgram(gl, vertexShader, fragmentShader);

}
function initgl() {
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(1.0, 1.0, 1.0, 1.0);
}
var positionBuffer;
var colorBuffer;
var maxNumberOfPoints = 20000;
function bindBuffer() {
    gl.useProgram(program);
    // Vertex buffer
    
    positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, 8 * maxNumberOfPoints, gl.STATIC_DRAW);
    var aPosition = gl.getAttribLocation(program, "a_Position");
    gl.vertexAttribPointer(aPosition, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(aPosition);

    // Color buffer
    colorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, 8 * maxNumberOfPoints, gl.STATIC_DRAW);
    var aColor = gl.getAttribLocation(program, "a_Color");
    gl.vertexAttribPointer(aColor, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(aColor);
}

var currPts = [];
var points = [];
var colors = [];

var lineWidth = 1.0;
var mouseClicked = false;
var lineColor = [1, 0, 0];
function bindMouseEvent() {
    // Event listeners for mouse input
    canvas.addEventListener("mousemove", function (event) {
        if (mouseClicked == true) {
            currPts.push(vec2(-1 + 2 * event.offsetX / canvas.width,
                -1 + 2 * (canvas.height - event.offsetY) / canvas.height));
            render();
        }
    });

    canvas.addEventListener("mousedown", function () {
        mouseClicked = true;
    });

    canvas.addEventListener("mouseup", function () {
        mouseClicked = false;
        currPts = [];
    });

    currPts = [];
    render();
}
function createLine(begin, end) {
    // get initial and final pts on a line, return rectangle with width
    var width = lineWidth * 0.001;
    var beta = (Math.PI / 2.0) - Math.atan2(end[1] - begin[1], end[0] - begin[0]);
    var delta_x = Math.cos(beta) * width;
    var delta_y = Math.sin(beta) * width;
    return [vec2(begin[0] - delta_x, begin[1] + delta_y),
    vec2(begin[0] + delta_x, begin[1] - delta_y),
    vec2(end[0] + delta_x, end[1] - delta_y),
    vec2(end[0] - delta_x, end[1] + delta_y)];
}
function render() {
   
    gl.clear(gl.COLOR_BUFFER_BIT);
    if (currPts.length == 2) {
        var tempPts = createLine(currPts[0], currPts[1]);
        points.push(tempPts[0], tempPts[1], tempPts[2], tempPts[3]);
        for (var i = 0; i < 4; ++i) {
            colors.push(lineColor[0], lineColor[1], lineColor[2]);
        }
        currPts.shift();
    }
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    gl.bufferSubData(gl.ARRAY_BUFFER, 0, flatten(colors));
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferSubData(gl.ARRAY_BUFFER, 0, flatten(points));
    for (var i = 0; i < points.length / 4; i++) {
        gl.drawArrays(gl.TRIANGLE_FAN, 4 * i, 4);
    }
}