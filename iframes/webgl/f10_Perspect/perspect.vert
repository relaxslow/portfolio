#version 300 es
 
in vec4 a_position;
in vec4 a_color;

uniform mat4 u_matrix;
// uniform float u_fudgeFactor;

out vec4 v_color;
 
void main(){
  gl_Position = u_matrix * a_position;
    v_color = a_color;
}

// void main() {
//      vec4 position = u_matrix * a_position;
// float zToDivideBy = 1.0 + position.z * u_fudgeFactor;
//   // Multiply the position by the matrix.
//  gl_Position = vec4(position.xyz, zToDivideBy);
//   v_color = a_color;
// }