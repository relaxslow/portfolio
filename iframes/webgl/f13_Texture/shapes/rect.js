let rect = {};
rect.pointNum = 6;
rect.scale = 150;
rect.center=[0.5,0.5,0];
rect.posData = new Float32Array([
    0, 0, 0,
    0, 1, 0,
    1, 1, 0,
    1, 1, 0,
    1, 0, 0,
    0, 0, 0,
])
rect.colorData = new Uint8Array([
    1, 0, 0,
    0, 1, 0,
    0, 0, 1,
    1, 0, 0,
    0, 1, 0,
    0, 0, 1,
]);
rect.texData = new Float32Array([
    0, 0,
    0, 1,
    1, 1,
    1, 1,
    1, 0,
    0, 0,

]);
rect.texData2 = new Float32Array([
    -1, -1,
    -1, 2,
    2, 2,
    2, 2,
    2, -1,
    -1, -1,
]);