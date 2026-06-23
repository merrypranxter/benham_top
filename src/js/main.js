// Benham top renderer and rotation control.
//
// WebGL2, no build step: shaders are plain files loaded with fetch() and
// resolved relative to this module via import.meta.url, so the page works
// from any static file server with no bundler.

import { clampArcCount, clampArcWidthDeg } from './arc-pattern.js';
import { predictColor } from './color-predict.js';
import { REGIMES, findRegimeByKey } from './presets.js';

const state = {
  arcCount: 3,
  arcWidthDeg: 45,
  rotationHz: 5,
  rotationDeg: 0,
  paused: false,
  strobe: false,
  showColorOverlay: false,
};

async function loadShaderSource(relativePath) {
  const url = new URL(relativePath, import.meta.url);
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to load shader: ${relativePath}`);
  return res.text();
}

function compileShader(gl, type, source) {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    const info = gl.getShaderInfoLog(shader);
    gl.deleteShader(shader);
    throw new Error(`Shader compile error: ${info}`);
  }
  return shader;
}

function linkProgram(gl, vertSource, fragSource) {
  const program = gl.createProgram();
  const vert = compileShader(gl, gl.VERTEX_SHADER, vertSource);
  const frag = compileShader(gl, gl.FRAGMENT_SHADER, fragSource);
  gl.attachShader(program, vert);
  gl.attachShader(program, frag);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    const info = gl.getProgramInfoLog(program);
    gl.deleteProgram(program);
    throw new Error(`Program link error: ${info}`);
  }
  return program;
}

function createFullscreenQuad(gl) {
  const buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
    gl.STATIC_DRAW,
  );
  return buffer;
}

function bindQuadAttribute(gl, program, quadBuffer) {
  const loc = gl.getAttribLocation(program, 'a_position');
  gl.bindBuffer(gl.ARRAY_BUFFER, quadBuffer);
  gl.enableVertexAttribArray(loc);
  gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
}

function resizeCanvasToDisplaySize(canvas) {
  const dpr = window.devicePixelRatio || 1;
  const width = Math.round(canvas.clientWidth * dpr);
  const height = Math.round(canvas.clientHeight * dpr);
  if (canvas.width !== width || canvas.height !== height) {
    canvas.width = width;
    canvas.height = height;
    return true;
  }
  return false;
}

function applyRegime(regime) {
  state.arcCount = regime.arcCount;
  state.arcWidthDeg = regime.arcWidthDeg;
  state.rotationHz = regime.rotationHz;
  state.strobe = regime.strobe;
}

function buildColorOverlay() {
  const overlay = document.createElement('div');
  overlay.id = 'color-overlay';
  overlay.hidden = true;
  document.body.appendChild(overlay);
  return overlay;
}

function updateColorOverlay(overlay) {
  if (!state.showColorOverlay) {
    overlay.hidden = true;
    return;
  }
  overlay.hidden = false;
  const prediction = predictColor({ arcWidthDeg: state.arcWidthDeg, rotationHz: state.rotationHz });
  overlay.style.borderColor = prediction.hex;
  overlay.innerHTML = `
    <div class="swatch" style="background:${prediction.hex}"></div>
    <div>
      <strong>${prediction.label}</strong>
      <p>${prediction.note}</p>
      <p class="params">arcs: ${state.arcCount} · width: ${state.arcWidthDeg}° · ${state.rotationHz.toFixed(1)} Hz · confidence: ${prediction.confidence}</p>
    </div>
  `;
}

function bindKeyboard() {
  window.addEventListener('keydown', (e) => {
    switch (e.code) {
      case 'Space':
        e.preventDefault();
        state.paused = !state.paused;
        break;
      case 'ArrowUp':
        state.rotationHz = Math.min(30, state.rotationHz + 0.5);
        break;
      case 'ArrowDown':
        state.rotationHz = Math.max(0.1, state.rotationHz - 0.5);
        break;
      case 'Equal':
      case 'NumpadAdd':
        state.arcCount = clampArcCount(state.arcCount + 1);
        state.arcWidthDeg = clampArcWidthDeg(state.arcWidthDeg, state.arcCount);
        break;
      case 'Minus':
      case 'NumpadSubtract':
        state.arcCount = clampArcCount(state.arcCount - 1);
        state.arcWidthDeg = clampArcWidthDeg(state.arcWidthDeg, state.arcCount);
        break;
      case 'BracketLeft':
        state.arcWidthDeg = clampArcWidthDeg(state.arcWidthDeg - 5, state.arcCount);
        break;
      case 'BracketRight':
        state.arcWidthDeg = clampArcWidthDeg(state.arcWidthDeg + 5, state.arcCount);
        break;
      case 'KeyS':
        state.strobe = !state.strobe;
        break;
      case 'KeyC':
        state.showColorOverlay = !state.showColorOverlay;
        break;
      default: {
        const regime = findRegimeByKey(e.key);
        if (regime) applyRegime(regime);
      }
    }
  });
}

async function main() {
  const canvas = document.getElementById('gl');
  const gl = canvas.getContext('webgl2');
  if (!gl) {
    document.body.textContent = 'WebGL2 is required and is not available in this browser.';
    return;
  }

  const [diskVert, diskFrag, strobeFrag] = await Promise.all([
    loadShaderSource('../shaders/disk.vert'),
    loadShaderSource('../shaders/disk.frag'),
    loadShaderSource('../shaders/strobe.frag'),
  ]);

  const diskProgram = linkProgram(gl, diskVert, diskFrag);
  const strobeProgram = linkProgram(gl, diskVert, strobeFrag);
  const quadBuffer = createFullscreenQuad(gl);

  const diskUniforms = {
    resolution: gl.getUniformLocation(diskProgram, 'u_resolution'),
    rotationDeg: gl.getUniformLocation(diskProgram, 'u_rotationDeg'),
    arcCount: gl.getUniformLocation(diskProgram, 'u_arcCount'),
    arcWidthDeg: gl.getUniformLocation(diskProgram, 'u_arcWidthDeg'),
    diskRadius: gl.getUniformLocation(diskProgram, 'u_diskRadius'),
  };
  const strobeUniforms = {
    time: gl.getUniformLocation(strobeProgram, 'u_time'),
    strobeFreq: gl.getUniformLocation(strobeProgram, 'u_strobeFreq'),
  };

  const colorOverlay = buildColorOverlay();
  bindKeyboard();

  let lastTimeMs = performance.now();

  function frame(nowMs) {
    const dtSeconds = (nowMs - lastTimeMs) / 1000;
    lastTimeMs = nowMs;

    if (!state.paused) {
      state.rotationDeg = (state.rotationDeg + dtSeconds * state.rotationHz * 360) % 360;
    }

    resizeCanvasToDisplaySize(canvas);
    gl.viewport(0, 0, canvas.width, canvas.height);

    gl.disable(gl.BLEND);
    gl.useProgram(diskProgram);
    bindQuadAttribute(gl, diskProgram, quadBuffer);
    gl.uniform2f(diskUniforms.resolution, canvas.width, canvas.height);
    gl.uniform1f(diskUniforms.rotationDeg, state.rotationDeg);
    gl.uniform1f(diskUniforms.arcCount, state.arcCount);
    gl.uniform1f(diskUniforms.arcWidthDeg, state.arcWidthDeg);
    gl.uniform1f(diskUniforms.diskRadius, 0.48);
    gl.drawArrays(gl.TRIANGLES, 0, 6);

    if (state.strobe) {
      gl.enable(gl.BLEND);
      gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
      gl.useProgram(strobeProgram);
      bindQuadAttribute(gl, strobeProgram, quadBuffer);
      gl.uniform1f(strobeUniforms.time, nowMs / 1000);
      gl.uniform1f(strobeUniforms.strobeFreq, state.rotationHz);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
    }

    updateColorOverlay(colorOverlay);
    requestAnimationFrame(frame);
  }

  requestAnimationFrame(frame);
}

main();

export { state, REGIMES };
