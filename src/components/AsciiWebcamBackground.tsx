import { useEffect, useRef } from 'react';

// Lightweight replacement for the `shaders` Ascii + Tritone + WebcamTexture stack.
// The whole effect runs in a single WebGL1 pass and only redraws when the webcam
// delivers a new frame, instead of three full-screen render targets every frame.

const BACKGROUND = '#1f0e45';
const CHARACTERS = '⌁⌗⌔⌭';
const CELL_SIZE = 24; // at 1080px viewport height, scales with height
const COLOR_A = '#004ad4';
const COLOR_B = '#ffbf00';
const COLOR_C = '#0aa9ff';
const BLEND_MID = 0.23;
const MAX_DPR = 1.5;

const VERTEX = `
attribute vec2 aPos;
void main() { gl_Position = vec4(aPos, 0.0, 1.0); }
`;

const FRAGMENT = `
precision mediump float;
uniform sampler2D uVideo;
uniform sampler2D uAtlas;
uniform sampler2D uLut;
uniform vec2 uRes;
uniform float uCell;
uniform float uVideoAspect;
uniform float uCharCount;
uniform float uAtlasSize;

void main() {
  vec2 uv = vec2(gl_FragCoord.x / uRes.x, 1.0 - gl_FragCoord.y / uRes.y);
  vec2 grid = uRes / uCell;
  vec2 gridCoords = uv * grid;
  vec2 cellCoords = floor(gridCoords);
  vec2 cellUV = fract(gridCoords);
  vec2 cellCenter = (cellCoords + 0.5) / grid;

  // object-fit: cover, mirrored
  float viewAspect = uRes.x / uRes.y;
  float coverScale = max(viewAspect / uVideoAspect, 1.0);
  vec2 uvScale = vec2(uVideoAspect / viewAspect * coverScale, coverScale);
  vec2 adj = (cellCenter - 0.5) / uvScale + 0.5;
  vec3 cam = texture2D(uVideo, vec2(1.0 - adj.x, adj.y)).rgb;

  float lum = dot(pow(cam, vec3(2.2)), vec3(0.299, 0.587, 0.114));
  vec4 lut = texture2D(uLut, vec2((lum * 255.0 + 0.5) / 256.0, 0.5));
  float charIndex = floor(lut.a * (uCharCount - 1.0) + 0.5);

  vec2 glyphUV = (cellUV - 0.5) / 1.5 + 0.5;
  vec2 atlasCell = vec2(mod(charIndex, uAtlasSize), floor(charIndex / uAtlasSize));
  vec3 glyph = texture2D(uAtlas, (atlasCell + glyphUV) / uAtlasSize).rgb;

  if (dot(glyph, vec3(0.299, 0.587, 0.114)) < 0.1) {
    gl_FragColor = vec4(0.0);
    return;
  }
  vec3 color = glyph * pow(lut.rgb, vec3(2.2));
  gl_FragColor = vec4(pow(color, vec3(1.0 / 2.2)), 1.0);
}
`;

// --- Tritone lookup table (luminance -> color + character), mixed in OKLCH ---

type Vec3 = [number, number, number];

const srgbToLinear = (c: number) =>
  c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
const linearToSrgb = (c: number) =>
  c <= 0.0031308 ? c * 12.92 : 1.055 * Math.pow(c, 1 / 2.4) - 0.055;

const hexToLinear = (hex: string): Vec3 => {
  const n = parseInt(hex.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255].map((v) => srgbToLinear(v / 255)) as Vec3;
};

const linearToOklch = ([r, g, b]: Vec3): Vec3 => {
  const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b);
  const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b);
  const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);
  const L = 0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s;
  const a = 1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s;
  const bb = 0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s;
  return [L, Math.hypot(a, bb), Math.atan2(bb, a)];
};

const oklchToLinear = ([L, C, h]: Vec3): Vec3 => {
  const a = C * Math.cos(h);
  const b = C * Math.sin(h);
  const l = (L + 0.3963377774 * a + 0.2158037573 * b) ** 3;
  const m = (L - 0.1055613458 * a - 0.0638541728 * b) ** 3;
  const s = (L - 0.0894841775 * a - 1.291485548 * b) ** 3;
  return [
    4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
    -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
    -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s,
  ];
};

const mixOklch = (x: Vec3, y: Vec3, t: number): Vec3 => {
  const a = linearToOklch(x);
  const b = linearToOklch(y);
  return oklchToLinear([0, 1, 2].map((i) => a[i] + (b[i] - a[i]) * t) as Vec3);
};

const smoothstep = (e0: number, e1: number, x: number) => {
  const t = Math.min(Math.max((x - e0) / (e1 - e0), 0), 1);
  return t * t * (3 - 2 * t);
};

function buildLut(): Uint8Array {
  const a = hexToLinear(COLOR_A);
  const b = hexToLinear(COLOR_B);
  const c = hexToLinear(COLOR_C);
  const count = CHARACTERS.length;
  const data = new Uint8Array(256 * 4);
  for (let i = 0; i < 256; i++) {
    const lum = i / 255;
    const lower = mixOklch(a, b, smoothstep(BLEND_MID - 0.25, BLEND_MID, lum));
    const upper = mixOklch(b, c, smoothstep(BLEND_MID, BLEND_MID + 0.25, lum));
    const color = mixOklch(lower, upper, smoothstep(BLEND_MID - 0.1, BLEND_MID + 0.1, lum)).map(
      (v) => Math.min(Math.max(v, 0), 1)
    ) as Vec3;
    const brightness = color[0] * 0.299 + color[1] * 0.587 + color[2] * 0.114;
    const charIndex = Math.min(Math.max(Math.floor((1 - brightness) * count), 0), count - 1);
    data[i * 4] = Math.round(linearToSrgb(color[0]) * 255);
    data[i * 4 + 1] = Math.round(linearToSrgb(color[1]) * 255);
    data[i * 4 + 2] = Math.round(linearToSrgb(color[2]) * 255);
    data[i * 4 + 3] = Math.round((charIndex / Math.max(count - 1, 1)) * 255);
  }
  return data;
}

function buildAtlas(atlasSize: number): HTMLCanvasElement {
  const cell = 171;
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = cell * atlasSize;
  const ctx = canvas.getContext('2d')!;
  ctx.fillStyle = '#fff';
  ctx.font = '128px "JetBrains Mono", monospace';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  [...CHARACTERS].forEach((char, i) => {
    ctx.fillText(char, (i % atlasSize) * cell + cell / 2, Math.floor(i / atlasSize) * cell + cell / 2);
  });
  return canvas;
}

function createTexture(gl: WebGLRenderingContext, filter: number) {
  const tex = gl.createTexture()!;
  gl.bindTexture(gl.TEXTURE_2D, tex);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, filter);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, filter);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  return tex;
}

function compile(gl: WebGLRenderingContext, type: number, source: string) {
  const shader = gl.createShader(type)!;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    throw new Error(gl.getShaderInfoLog(shader) ?? 'shader compile failed');
  }
  return shader;
}

export function AsciiWebcamBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !navigator.mediaDevices?.getUserMedia) return;
    const gl = canvas.getContext('webgl', {
      alpha: true,
      antialias: false,
      depth: false,
      stencil: false,
      powerPreference: 'low-power',
    });
    if (!gl) return;

    let disposed = false;
    let stream: MediaStream | null = null;
    let frameHandle = 0;
    const video = document.createElement('video');
    video.muted = true;
    video.playsInline = true;

    const program = gl.createProgram()!;
    try {
      gl.attachShader(program, compile(gl, gl.VERTEX_SHADER, VERTEX));
      gl.attachShader(program, compile(gl, gl.FRAGMENT_SHADER, FRAGMENT));
    } catch (error) {
      console.error('[AsciiWebcamBackground]', error);
      return;
    }
    gl.linkProgram(program);
    gl.useProgram(program);

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const aPos = gl.getAttribLocation(program, 'aPos');
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

    const uniform = (name: string) => gl.getUniformLocation(program, name);
    const atlasSize = Math.max(2, Math.ceil(Math.sqrt(CHARACTERS.length)));

    gl.activeTexture(gl.TEXTURE0);
    const videoTex = createTexture(gl, gl.NEAREST);
    gl.activeTexture(gl.TEXTURE1);
    const atlasTex = createTexture(gl, gl.LINEAR);
    const uploadAtlas = () => {
      gl.activeTexture(gl.TEXTURE1);
      gl.bindTexture(gl.TEXTURE_2D, atlasTex);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, buildAtlas(atlasSize));
    };
    uploadAtlas();
    gl.activeTexture(gl.TEXTURE2);
    createTexture(gl, gl.NEAREST);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 256, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, buildLut());

    gl.uniform1i(uniform('uVideo'), 0);
    gl.uniform1i(uniform('uAtlas'), 1);
    gl.uniform1i(uniform('uLut'), 2);
    gl.uniform1f(uniform('uCharCount'), CHARACTERS.length);
    gl.uniform1f(uniform('uAtlasSize'), atlasSize);
    const uRes = uniform('uRes');
    const uCell = uniform('uCell');
    const uVideoAspect = uniform('uVideoAspect');

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);
      canvas.width = Math.round(canvas.clientWidth * dpr);
      canvas.height = Math.round(canvas.clientHeight * dpr);
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.uniform2f(uRes, canvas.width, canvas.height);
      gl.uniform1f(uCell, CELL_SIZE * (canvas.height / 1080));
    };

    const draw = () => {
      if (video.readyState < 2) return;
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, videoTex);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, video);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };

    // Redraw only when the camera produces a new frame (~30fps), not every display frame.
    const hasVideoFrameCallback = 'requestVideoFrameCallback' in HTMLVideoElement.prototype;
    let lastDraw = 0;
    const loop = (now: number) => {
      if (disposed) return;
      if (hasVideoFrameCallback) {
        draw();
        frameHandle = video.requestVideoFrameCallback(loop);
      } else {
        if (now - lastDraw >= 33) {
          lastDraw = now;
          draw();
        }
        frameHandle = requestAnimationFrame(loop);
      }
    };

    const onResize = () => {
      resize();
      draw();
    };
    resize();
    window.addEventListener('resize', onResize);
    if (!document.querySelector('link[href*="JetBrains+Mono"]')) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = 'https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400&display=swap';
      document.head.appendChild(link);
    }
    document.fonts?.load('128px "JetBrains Mono"', CHARACTERS).then(() => !disposed && uploadAtlas()).catch(() => {});

    navigator.mediaDevices
      .getUserMedia({
        video: { width: { ideal: 640 }, height: { ideal: 480 }, facingMode: 'user' },
        audio: false,
      })
      .then(async (media) => {
        if (disposed) {
          media.getTracks().forEach((track) => track.stop());
          return;
        }
        stream = media;
        video.srcObject = media;
        await video.play();
        if (disposed) return;
        gl.uniform1f(uVideoAspect, (video.videoWidth || 640) / (video.videoHeight || 480));
        loop(performance.now());
      })
      .catch((error) => console.warn('[AsciiWebcamBackground] webcam unavailable:', error?.name ?? error));

    return () => {
      disposed = true;
      window.removeEventListener('resize', onResize);
      if (hasVideoFrameCallback) video.cancelVideoFrameCallback(frameHandle);
      else cancelAnimationFrame(frameHandle);
      stream?.getTracks().forEach((track) => track.stop());
      video.srcObject = null;
      gl.deleteProgram(program);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 0,
        backgroundColor: BACKGROUND,
        pointerEvents: 'none',
      }}
    />
  );
}

// Lite-mode background: same palette, no camera, no WebGL.
export function StaticBackground() {
  return (
    <div
      aria-hidden="true"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 0,
        pointerEvents: 'none',
        backgroundColor: BACKGROUND,
        backgroundImage:
          'radial-gradient(ellipse 80% 50% at 50% 0%, rgba(0, 74, 212, 0.35), transparent 70%), radial-gradient(ellipse 60% 50% at 100% 100%, rgba(10, 169, 255, 0.18), transparent 70%), radial-gradient(ellipse 60% 40% at 0% 80%, rgba(255, 191, 0, 0.12), transparent 70%)',
      }}
    />
  );
}
