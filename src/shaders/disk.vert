// Fullscreen quad pass-through. No transform needed here — the disk's
// sector/rotation math is done per-pixel in disk.frag using gl_FragCoord,
// since the pattern is defined in screen space rather than model space.
#version 300 es

in vec2 a_position;

void main() {
  gl_Position = vec4(a_position, 0.0, 1.0);
}
