#version 300 es
precision mediump float;
uniform sampler2D texture1;
in vec2 v_uv;
out vec4 outColor;
void main() {
  outColor = texture(texture1, v_uv);
//   outColor = vec4(1, 0, 0, 1);
}