#version 300 es
in vec3 position;
void main() { 
    gl_Position = vec4(position, 1);
     // gl_Position = projectionMatrix * modelViewMatrix*vec4(position,1);
}