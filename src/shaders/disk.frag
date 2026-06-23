// Renders the spinning black-and-white Benham disk: `u_arcCount` sectors,
// each `u_arcWidthDeg` degrees of white out of its `360/u_arcCount` period,
// rotated by `u_rotationDeg`. All angle math is per-pixel polar coords.
#version 300 es
precision highp float;

uniform vec2 u_resolution;
uniform float u_rotationDeg;   // current disk rotation, degrees
uniform float u_arcCount;      // number of arc sectors
uniform float u_arcWidthDeg;   // white arc width within each sector, degrees
uniform float u_diskRadius;    // 0..1, fraction of min(viewport dimension)

out vec4 outColor;

const float PI = 3.14159265359;
const float TAU = 6.28318530718;

void main() {
  vec2 uv = (gl_FragCoord.xy - 0.5 * u_resolution) / min(u_resolution.x, u_resolution.y);
  float r = length(uv);

  if (r > u_diskRadius) {
    outColor = vec4(0.0, 0.0, 0.0, 1.0);
    return;
  }

  // atan2 gives [-PI, PI]; shift to [0, TAU) before applying rotation so the
  // mod() below never has to deal with negative remainders.
  float angle = atan(uv.y, uv.x);
  angle = mod(angle + TAU, TAU);

  float rotationRad = radians(u_rotationDeg);
  angle = mod(angle - rotationRad + TAU, TAU);

  float angleDeg = degrees(angle);
  float period = 360.0 / max(u_arcCount, 1.0);
  float posInPeriod = mod(angleDeg, period);

  float white = step(posInPeriod, u_arcWidthDeg);
  outColor = vec4(vec3(white), 1.0);
}
