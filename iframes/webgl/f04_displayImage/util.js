
function loadRes(names, fun) {
    let res = {}

    for (let i = 0; i < names.length; i++) {
        const name = names[i];
        res[name] = undefined;
        let loadfun = {
            ".jpg": loadImage,
            ".svg": loadImage

        }
        let suffix = name.slice(name.indexOf("."))
        if (loadfun[suffix])
            loadfun[suffix](name);
        else {

            sendRequest(`${name}`, loadOk, name, res);
        }
        // sendRequest(`${name}`, loadOk, name, res);

    }
    let loadResEvt = new xs.Event(res, fun);
    function loadOk(res, name) {
        loadResEvt.ok(name, res);
    }
    function loadImage(name) {
        let image = new Image();
        image.src = name;
        image.onload = function (evt) {
            loadOk(evt.currentTarget, name);
        };

    }
    return res;
}

function createShader(gl, type, source) {
    var shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    var success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
    if (success) {
        return shader;
    }

    console.log(gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
}
function createProgram(gl, vertexShader, fragmentShader) {
    var program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    var success = gl.getProgramParameter(program, gl.LINK_STATUS);
    if (success) {
        return program;
    }

    console.log(gl.getProgramInfoLog(program));
    gl.deleteProgram(program);
}