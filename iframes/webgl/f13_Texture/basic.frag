#version 300 es

precision mediump float;

uniform vec4 u_color;
uniform sampler2D u_texture;
in vec4 v_color;
in vec2 v_texcoord;
// we need to declare an output for the fragment shader
out vec4 outColor;

void main() {
  // outColor = v_color;
  outColor = texture(u_texture, v_texcoord);
  
}