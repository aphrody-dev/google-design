/**
 * Acoustic UI Soundscapes (16-bit / 44.1kHz PCM .wav) & 60fps Canvas2D / WebGPU WGSL Motion Scenes
 * 100% Pure Bun v1.4.4 - Zero External Dependencies
 *
 * Audio assets (zero clipping, smooth raised-cosine attack/decay envelopes):
 * 1. audio/ui-tap.wav            (Crisp 45ms tactile wood/glass micro-tap)
 * 2. audio/workspace-glide.wav   (Smooth 220ms compositor workspace transition)
 * 3. audio/confirm-harmonic.wav  (Warm 320ms perfect-fifth C5-G5 harmonic chime)
 * 4. audio/focus-pulse.wav       (Subtle 160ms soft triangle focus pulse)
 * 5. audio/ambient-drone.wav     (Calm 900ms fundamental + octave ambient pad)
 *
 * Video & Motion assets:
 * - video/motion-scenes.js       (Zero-dep 60fps HTML5 Canvas2D + WebGPU WGSL shader module + WebM recorder helper)
 * - video/aphrody-hero-loop.svg  (Pure CSS/SMIL animated architectural vector loop)
 * - video/aphrody-kinetic-banner.gif (Multi-frame GIF89a animated kinetic banner)
 */

import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { gzipSync } from "node:zlib";
import { encodeAnimatedGif, type GifPaletteEntry } from "./gif-encoder.ts";

export interface WavSynthSpec {
  id: string;
  title: string;
  durationSec: number;
  sampleRate?: number;
  renderSample: (t: number, duration: number) => number;
}

/**
 * Encode normalized mono float samples (-1.0 .. +1.0) into a specification-compliant 16-bit PCM RIFF WAVE binary.
 */
export function encodeWavPcm16Mono(
  samples: Float32Array,
  sampleRate = 44100,
): Uint8Array {
  const numChannels = 1;
  const bitsPerSample = 16;
  const bytesPerSample = bitsPerSample / 8;
  const blockAlign = numChannels * bytesPerSample;
  const byteRate = sampleRate * blockAlign;
  const dataByteLen = samples.length * bytesPerSample;
  const totalByteLen = 44 + dataByteLen;

  const buf = new Uint8Array(totalByteLen);
  const view = new DataView(buf.buffer);

  const writeAscii = (offset: number, str: string) => {
    for (let i = 0; i < str.length; i++) {
      buf[offset + i] = str.charCodeAt(i) & 0xff;
    }
  };

  // RIFF chunk descriptor
  writeAscii(0, "RIFF");
  view.setUint32(4, 36 + dataByteLen, true);
  writeAscii(8, "WAVE");

  // fmt sub-chunk
  writeAscii(12, "fmt ");
  view.setUint32(16, 16, true); // Subchunk1Size (16 for PCM)
  view.setUint16(20, 1, true); // AudioFormat = 1 (Linear PCM)
  view.setUint16(22, numChannels, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, byteRate, true);
  view.setUint16(32, blockAlign, true);
  view.setUint16(34, bitsPerSample, true);

  // data sub-chunk
  writeAscii(36, "data");
  view.setUint32(40, dataByteLen, true);

  for (let i = 0; i < samples.length; i++) {
    // Soft limit to [-0.96, 0.96] to guarantee zero digital clipping
    const clamped = Math.max(-0.96, Math.min(0.96, samples[i]));
    const int16 = Math.round(clamped * 32767);
    view.setInt16(44 + i * 2, int16, true);
  }

  return buf;
}

/**
 * Inspect and validate a RIFF WAVE binary in unit tests.
 */
export function inspectWavBinary(wavBytes: Uint8Array): {
  valid: boolean;
  riffMagic: string;
  waveMagic: string;
  fmtMagic: string;
  audioFormat: number;
  sampleRate: number;
  bitsPerSample: number;
  sampleCount: number;
} {
  if (wavBytes.byteLength < 44) {
    return {
      valid: false,
      riffMagic: "",
      waveMagic: "",
      fmtMagic: "",
      audioFormat: 0,
      sampleRate: 0,
      bitsPerSample: 0,
      sampleCount: 0,
    };
  }
  const view = new DataView(
    wavBytes.buffer,
    wavBytes.byteOffset,
    wavBytes.byteLength,
  );
  const ascii = (start: number, len: number) =>
    String.fromCharCode(...wavBytes.subarray(start, start + len));

  const riffMagic = ascii(0, 4);
  const chunkSize = view.getUint32(4, true);
  const waveMagic = ascii(8, 4);
  const fmtMagic = ascii(12, 4);
  const audioFormat = view.getUint16(20, true);
  const numChannels = view.getUint16(22, true);
  const sampleRate = view.getUint32(24, true);
  const bitsPerSample = view.getUint16(34, true);
  const dataMagic = ascii(36, 4);
  const dataSize = view.getUint32(40, true);
  const sampleCount = dataSize / (numChannels * (bitsPerSample / 8));

  const valid =
    riffMagic === "RIFF" &&
    waveMagic === "WAVE" &&
    fmtMagic === "fmt " &&
    dataMagic === "data" &&
    audioFormat === 1 &&
    chunkSize + 8 === wavBytes.byteLength &&
    44 + dataSize === wavBytes.byteLength;

  return {
    valid,
    riffMagic,
    waveMagic,
    fmtMagic,
    audioFormat,
    sampleRate,
    bitsPerSample,
    sampleCount,
  };
}

function triangleWave(phaseRad: number): number {
  const norm = (((phaseRad / (Math.PI * 2)) % 1) + 1) % 1;
  return norm < 0.5 ? 4 * norm - 1 : 3 - 4 * norm;
}

const SOUND_SPECS: WavSynthSpec[] = [
  {
    id: "ui-tap",
    title: "UI Micro Tap",
    durationSec: 0.05,
    renderSample: (t, d) => {
      const env =
        Math.sin((Math.PI * Math.min(t, 0.004)) / 0.008) * Math.exp(-t * 85);
      const freq = 920 - (t / d) * 340;
      return 0.55 * env * Math.sin(2 * Math.PI * freq * t);
    },
  },
  {
    id: "workspace-glide",
    title: "Compositor Workspace Glide",
    durationSec: 0.22,
    renderSample: (t, d) => {
      const attack = Math.min(1, t / 0.025);
      const release = Math.pow(1 - t / d, 1.8);
      const env = attack * release;
      const f0 = 261.63 + (t / d) * 130.81; // C4 -> G4 smooth glide
      return (
        0.42 *
        env *
        (0.7 * Math.sin(2 * Math.PI * f0 * t) +
          0.3 * triangleWave(2 * Math.PI * f0 * 1.5 * t))
      );
    },
  },
  {
    id: "confirm-harmonic",
    title: "Harmonic Fifth Confirmation",
    durationSec: 0.32,
    renderSample: (t, d) => {
      const attack = Math.min(1, t / 0.012);
      const decay = Math.exp(-t * 8.5) * (1 - t / d);
      const noteA = Math.sin(2 * Math.PI * 523.25 * t); // C5
      const noteB =
        t > 0.055 ? Math.sin(2 * Math.PI * 783.99 * (t - 0.055)) : 0; // G5
      return 0.45 * attack * decay * (0.55 * noteA + 0.45 * noteB);
    },
  },
  {
    id: "focus-pulse",
    title: "Keyboard Focus Pulse",
    durationSec: 0.16,
    renderSample: (t, d) => {
      const win = Math.sin((Math.PI * t) / d);
      return (
        0.38 *
        win *
        (0.65 * triangleWave(2 * Math.PI * 440 * t) +
          0.35 * Math.sin(2 * Math.PI * 880 * t))
      );
    },
  },
  {
    id: "ambient-drone",
    title: "Ambient Studio Pad",
    durationSec: 0.65,
    renderSample: (t, d) => {
      const win = Math.sin((Math.PI * t) / d);
      const f = 146.83; // D3
      return (
        0.36 *
        win *
        (0.55 * Math.sin(2 * Math.PI * f * t) +
          0.28 * Math.sin(2 * Math.PI * f * 1.5 * t) +
          0.17 * Math.sin(2 * Math.PI * f * 2.0 * t))
      );
    },
  },
];

function renderMotionScenesModuleJs(): string {
  return `/**
 * Aphrody Sovereign 60fps Motion & WebGPU Shader Scenes
 * Zero External Dependencies - Respects prefers-reduced-motion: reduce
 * License: MIT / CC0-1.0
 */

export const APHRODY_WGSL_SHADER = /* wgsl */ \`
struct Uniforms {
  time : f32,
  aspect : f32,
  primaryR : f32,
  primaryG : f32,
  primaryB : f32,
  pad0 : f32,
};

@group(0) @binding(0) var<uniform> u : Uniforms;

struct VertexOut {
  @builtin(position) pos : vec4<f32>,
  @location(0) uv : vec2<f32>,
};

@vertex
fn vs_main(@builtin(vertex_index) idx : u32) -> VertexOut {
  var positions = array<vec2<f32>, 3>(
    vec2<f32>(-1.0, -1.0),
    vec2<f32>( 3.0, -1.0),
    vec2<f32>(-1.0,  3.0)
  );
  var out : VertexOut;
  let p = positions[idx];
  out.pos = vec4<f32>(p, 0.0, 1.0);
  out.uv = p * 0.5 + vec2<f32>(0.5, 0.5);
  return out;
}

@fragment
fn fs_main(in : VertexOut) -> @location(0) vec4<f32> {
  let centered = (in.uv - vec2<f32>(0.5, 0.5)) * vec2<f32>(u.aspect, 1.0);
  let dist = length(centered);
  let wave = sin(dist * 14.0 - u.time * 1.6) * 0.5 + 0.5;
  let base = vec3<f32>(0.055, 0.070, 0.098);
  let accent = vec3<f32>(u.primaryR, u.primaryG, u.primaryB);
  let mask = smoothstep(0.68, 0.08, dist) * (0.16 + 0.14 * wave);
  return vec4<f32>(mix(base, accent, mask), 1.0);
}
\`;

/**
 * Mount a 60fps architectural Canvas2D lattice scene (with automatic static hero render under reduced motion).
 */
export function mountAphrodyCanvasScene(canvas, options = {}) {
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("2D context unavailable");

  const accent = options.accent || "#1A73E8";
  const secondary = options.secondary || "#00CC88";
  const background = options.background || "#0D1117";
  const reducedMotion =
    typeof window !== "undefined" &&
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  let rafId = 0;
  let running = true;
  const start = performance.now();

  function drawFrame(now) {
    const t = reducedMotion ? 0 : (now - start) * 0.001;
    const w = canvas.width;
    const h = canvas.height;

    ctx.fillStyle = background;
    ctx.fillRect(0, 0, w, h);

    ctx.strokeStyle = accent;
    ctx.lineWidth = 1.25;
    const cols = 12;
    const stepX = w / cols;

    for (let i = 1; i < cols; i++) {
      const x = i * stepX;
      ctx.globalAlpha = 0.12;
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, h);
      ctx.stroke();
    }

    ctx.globalAlpha = 0.65;
    ctx.strokeStyle = secondary;
    ctx.lineWidth = 2;
    ctx.beginPath();
    for (let x = 0; x <= w; x += 6) {
      const nx = x / w;
      const y = h * 0.5 + Math.sin(nx * Math.PI * 3 + t * 1.5) * (h * 0.16);
      if (x === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();
    ctx.globalAlpha = 1;

    if (running && !reducedMotion) {
      rafId = requestAnimationFrame(drawFrame);
    }
  }

  drawFrame(start);

  return {
    stop() {
      running = false;
      if (rafId) cancelAnimationFrame(rafId);
    },
  };
}

/**
 * Zero-dependency browser MediaRecorder helper to export any HTMLCanvasElement scene as a downloadable WebM clip.
 */
export function recordCanvasToWebm(canvas, durationMs = 3000, fps = 60) {
  if (typeof canvas.captureStream !== "function" || typeof MediaRecorder === "undefined") {
    throw new Error("Canvas MediaRecorder API requires an interactive browser context");
  }
  const stream = canvas.captureStream(fps);
  const recorder = new MediaRecorder(stream, { mimeType: "video/webm;codecs=vp9" });
  const chunks = [];

  return new Promise((resolve, reject) => {
    recorder.ondataavailable = (ev) => {
      if (ev.data && ev.data.size > 0) chunks.push(ev.data);
    };
    recorder.onerror = (err) => reject(err);
    recorder.onstop = () => resolve(new Blob(chunks, { type: "video/webm" }));
    recorder.start();
    setTimeout(() => recorder.stop(), durationMs);
  });
}
`;
}

function renderHeroLoopSvg(): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 960 320" width="960" height="320" fill="none">
  <title>Aphrody Architectural Motion Loop</title>
  <style>
    .bg { fill: #0D1117; }
    .grid { stroke: #1E293B; stroke-width: 1; }
    .orbit { stroke: #1A73E8; stroke-width: 2; stroke-dasharray: 12 8; animation: dash 12s linear infinite; }
    .pulse { fill: #00CC88; animation: scalePulse 3.2s ease-in-out infinite; transform-origin: 480px 160px; }
    @keyframes dash { to { stroke-dashoffset: -200; } }
    @keyframes scalePulse { 0%, 100% { opacity: 0.85; } 50% { opacity: 0.35; } }
    @media (prefers-reduced-motion: reduce) {
      .orbit, .pulse { animation: none; }
    }
  </style>
  <rect class="bg" width="960" height="320" rx="12"/>
  <path class="grid" d="M0 80H960M0 160H960M0 240H960M160 0V320M320 0V320M480 0V320M640 0V320M800 0V320"/>
  <circle class="orbit" cx="480" cy="160" r="96"/>
  <circle cx="480" cy="160" r="56" stroke="#8AB4F8" stroke-width="1.75"/>
  <circle class="pulse" cx="480" cy="160" r="10"/>
</svg>
`;
}

function buildKineticBannerGif(): Uint8Array {
  const width = 160;
  const height = 48;
  const palette: GifPaletteEntry[] = [
    { r: 13, g: 17, b: 23 }, // 0: obsidian bg
    { r: 30, g: 41, b: 59 }, // 1: hairline grid
    { r: 26, g: 115, b: 232 }, // 2: cobalt wave
    { r: 0, g: 204, b: 136 }, // 3: emerald wave
    { r: 248, g: 249, b: 250 }, // 4: crisp node dot
  ];

  const frameCount = 10;
  const frames = [];

  for (let f = 0; f < frameCount; f++) {
    const pixels = new Uint8Array(width * height);
    const phase = (f / frameCount) * Math.PI * 2;

    // Grid lines
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        if (x % 16 === 0 || y % 16 === 0) {
          pixels[y * width + x] = 1;
        }
      }
    }

    // Dual harmonic waves
    for (let x = 0; x < width; x++) {
      const nx = x / width;
      const y1 = Math.round(
        height * 0.5 + Math.sin(nx * Math.PI * 4 + phase) * 12,
      );
      const y2 = Math.round(
        height * 0.5 + Math.cos(nx * Math.PI * 4 - phase) * 9,
      );
      if (y1 >= 0 && y1 < height) pixels[y1 * width + x] = 2;
      if (y2 >= 0 && y2 < height) pixels[y2 * width + x] = 3;
      if (x % 32 === 16 && y1 >= 0 && y1 < height) {
        pixels[y1 * width + x] = 4;
      }
    }

    frames.push({ pixels, delayCs: 8, disposalMethod: 1 as const });
  }

  return encodeAnimatedGif({
    width,
    height,
    palette,
    frames,
    loopCount: 0,
  });
}

export function generateAudioAndVideoAssets(outDir: string): {
  files: string[];
  audioMetadata: Array<{
    id: string;
    file: string;
    durationSec: number;
    sampleRate: number;
    pcmBytes: number;
    gzipBytes: number;
  }>;
} {
  const audioDir = join(outDir, "audio");
  const videoDir = join(outDir, "video");
  mkdirSync(audioDir, { recursive: true });
  mkdirSync(videoDir, { recursive: true });

  const written: string[] = [];
  const audioMetadata: Array<{
    id: string;
    file: string;
    durationSec: number;
    sampleRate: number;
    pcmBytes: number;
    gzipBytes: number;
  }> = [];

  for (const spec of SOUND_SPECS) {
    const sampleRate = spec.sampleRate ?? 44100;
    const totalSamples = Math.floor(spec.durationSec * sampleRate);
    const samples = new Float32Array(totalSamples);
    for (let i = 0; i < totalSamples; i++) {
      samples[i] = spec.renderSample(i / sampleRate, spec.durationSec);
    }
    const wavBytes = encodeWavPcm16Mono(samples, sampleRate);
    const gzBytes = gzipSync(wavBytes, { level: 9 });
    const wavPath = join(audioDir, `${spec.id}.wav`);
    writeFileSync(wavPath, wavBytes);
    written.push(wavPath);

    audioMetadata.push({
      id: spec.id,
      file: `audio/${spec.id}.wav`,
      durationSec: spec.durationSec,
      sampleRate,
      pcmBytes: wavBytes.byteLength,
      gzipBytes: gzBytes.byteLength,
    });
  }

  const audioCatalogPath = join(audioDir, "audio-catalog.json");
  writeFileSync(
    audioCatalogPath,
    JSON.stringify(audioMetadata, null, 2),
    "utf8",
  );
  written.push(audioCatalogPath);

  // Video & Motion scenes
  const motionJsPath = join(videoDir, "motion-scenes.js");
  writeFileSync(motionJsPath, renderMotionScenesModuleJs(), "utf8");
  written.push(motionJsPath);

  const heroLoopPath = join(videoDir, "aphrody-hero-loop.svg");
  writeFileSync(heroLoopPath, renderHeroLoopSvg(), "utf8");
  written.push(heroLoopPath);

  const kineticGifBytes = buildKineticBannerGif();
  const kineticGifPath = join(videoDir, "aphrody-kinetic-banner.gif");
  writeFileSync(kineticGifPath, kineticGifBytes);
  written.push(kineticGifPath);

  return { files: written, audioMetadata };
}
