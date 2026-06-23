// Full-viewport flicker overlay, blended on top of the disk when strobe
// mode is on. A hard step (not a sine) is used because Fechner/Benham color
// emergence is driven by sharp luminance transitions, not smooth ones.
#version 300 es
precision highp float;

uniform float u_time;        // seconds
uniform float u_strobeFreq;  // Hz

out vec4 outColor;

void main() {
  float phase = fract(u_time * u_strobeFreq);
  float flash = step(0.5, phase); // 50% duty cycle on/off flicker
  outColor = vec4(vec3(flash), flash * 0.5);
}
