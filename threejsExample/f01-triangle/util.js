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
function createProgramFromSrc(gl, vertSrc, fragSrc) {
  let vert = createShader(gl, gl.VERTEX_SHADER, vertSrc);
  let frag = createShader(gl, gl.FRAGMENT_SHADER, fragSrc);
  let program = createProgram(gl, vert, frag);
  return program;
}

function getCurrentFolder() {
  var scripts = document.getElementsByTagName('script');
  var path = scripts[scripts.length - 1].src.split('?')[0];
  var current = '/' + path.split('/').slice(3, -1).join('/') + '/';
  return current;
}
function loadLocalRes(names, fun) {
  let folder = getCurrentFolder();
  let res = {};
  for (let i = 0; i < names.length; i++) {
    const name = names[i];
    res[name] = undefined;
    sendRequest(`${folder+name}`, loadOk, name, res);
  }
  let finish = 0;
  function loadOk(r1, name) {
    this[name] = r1;
    finish++;
    if (finish == names.length) fun();
  }
  return res;
}
function loadRes(names, fun) {
  let res = {};
  for (let i = 0; i < names.length; i++) {
    const name = names[i];
    res[name] = undefined;
    sendRequest(`${name}`, loadOk, name, res);
  }
  let finish = 0;
  function loadOk(r1, name) {
    this[name] = r1;
    finish++;
    if (finish == names.length) fun();
  }
  return res;
}

function sendRequest(url, fun, data, owner) {
  url += '?data=' + encodeURIComponent(data);  // parsedUrl.query.data
  let xhttp = new XMLHttpRequest();
  xhttp.open('get', url, true);
  xhttp.setRequestHeader('x-requested-with', 'XMLHttpRequest');
  xhttp.setRequestHeader('Content-Type', 'text/plain');
  xhttp.send();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      if (fun != undefined) {
        fun.call(owner, this.responseText, data);
      }
      if (this.readyState == 4 && this.status == 500) {
        window.stop();
        console.trace();
        throw new Error('internal server error');
      }
    }
  };
};


function radToDeg(r) {
  return r * 180 / Math.PI;
}

function degToRad(d) {
  return d * Math.PI / 180;
}
