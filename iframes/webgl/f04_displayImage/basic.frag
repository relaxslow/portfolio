#version 300 es
 

precision mediump float;
uniform sampler2D u_image;
in vec2 v_texCoord;
//  uniform vec4 u_color;

out vec4 outColor;
 
void main() {
  outColor = texture(u_image, v_texCoord).bgra;
  // outColor = u_color;
}