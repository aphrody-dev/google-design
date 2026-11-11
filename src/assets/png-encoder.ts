/**
 * Pure TypeScript PNG Binary Encoder (RGBA 8-bit TrueColor, Filter 0/1, Zlib IDAT + IEEE CRC32)
 * 100% Pure Bun v1.4.4 - Zero External Dependencies
 */

import { deflateSync } from "node:zlib";

// Precomputed IEEE 802.3 CRC-32 lookup table
const CRC32_TABLE = (() => {
  const table = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) {
      c = (c & 1) !== 0 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    }
    table[n] = c >>> 0;
  }
  return table;
})();

export function crc32(bytes: Uint8Array): number {
  let c = 0xffffffff;
  for (let i = 0; i < bytes.length; i++) {
    c = CRC32_TABLE[(c ^ bytes[i]) & 0xff] ^ (c >>> 8);
  }
  return (c ^ 0xffffffff) >>> 0;
}

function writeUint32BE(buf: Uint8Array, offset: number, val: number): void {
  buf[offset] = (val >>> 24) & 0xff;
  buf[offset + 1] = (val >>> 16) & 0xff;
  buf[offset + 2] = (val >>> 8) & 0xff;
  buf[offset + 3] = val & 0xff;
}

function buildPngChunk(typeAscii: string, data: Uint8Array): Uint8Array {
  const chunk = new Uint8Array(12 + data.length);
  writeUint32BE(chunk, 0, data.length);
  for (let i = 0; i < 4; i++) {
    chunk[4 + i] = typeAscii.charCodeAt(i) & 0xff;
  }
  chunk.set(data, 8);
  const crcSlice = chunk.subarray(4, 8 + data.length);
  writeUint32BE(chunk, 8 + data.length, crc32(crcSlice));
  return chunk;
}

/**
 * Encode an RGBA8888 pixel buffer (length = width * height * 4) into a specification-compliant PNG binary.
 */
export function encodePngRgba(
  width: number,
  height: number,
  rgbaPixels: Uint8Array,
): Uint8Array {
  if (width <= 0 || height <= 0) {
    throw new Error(`Invalid PNG dimensions: ${width}x${height}`);
  }
  const expectedLength = width * height * 4;
  if (rgbaPixels.length !== expectedLength) {
    throw new Error(
      `RGBA buffer length mismatch: got ${rgbaPixels.length}, expected ${expectedLength}`,
    );
  }

  // PNG 8-byte magic signature: 89 50 4E 47 0D 0A 1A 0A
  const signature = new Uint8Array([
    0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a,
  ]);

  // IHDR chunk (13 bytes): width(4), height(4), bitDepth=8, colorType=6 (RGBA), compression=0, filter=0, interlace=0
  const ihdrData = new Uint8Array(13);
  writeUint32BE(ihdrData, 0, width);
  writeUint32BE(ihdrData, 4, height);
  ihdrData[8] = 8; // 8 bits per channel
  ihdrData[9] = 6; // Truecolor with alpha (RGBA)
  ihdrData[10] = 0; // Deflate
  ihdrData[11] = 0; // Adaptive filtering
  ihdrData[12] = 0; // No interlace
  const ihdrChunk = buildPngChunk("IHDR", ihdrData);

  // Build scanlines with Sub filter (1) for better gradient/pixel compression
  const rowStride = width * 4;
  const rawScanlines = new Uint8Array(height * (1 + rowStride));
  for (let y = 0; y < height; y++) {
    const outRowStart = y * (1 + rowStride);
    const inRowStart = y * rowStride;
    rawScanlines[outRowStart] = 1; // Filter type 1 (Sub)
    for (let x = 0; x < rowStride; x++) {
      const curr = rgbaPixels[inRowStart + x];
      const left = x >= 4 ? rgbaPixels[inRowStart + x - 4] : 0;
      rawScanlines[outRowStart + 1 + x] = (curr - left) & 0xff;
    }
  }

  // Compress scanlines into zlib stream (RFC 1950 header + deflate + Adler32) via node:zlib deflateSync
  const compressed = deflateSync(rawScanlines, { level: 9 });
  const idatChunk = buildPngChunk("IDAT", new Uint8Array(compressed));

  // IEND chunk (0 bytes)
  const iendChunk = buildPngChunk("IEND", new Uint8Array(0));

  const totalLen =
    signature.length + ihdrChunk.length + idatChunk.length + iendChunk.length;
  const out = new Uint8Array(totalLen);
  let pos = 0;
  out.set(signature, pos);
  pos += signature.length;
  out.set(ihdrChunk, pos);
  pos += ihdrChunk.length;
  out.set(idatChunk, pos);
  pos += idatChunk.length;
  out.set(iendChunk, pos);
  return out;
}

/**
 * Decode & verify basic PNG structure (magic, chunks, CRC32 integrity) for deterministic testing.
 */
export function verifyPngIntegrity(pngBytes: Uint8Array): {
  valid: boolean;
  width: number;
  height: number;
  chunks: string[];
} {
  const sig = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a];
  if (pngBytes.length < 33) {
    return { valid: false, width: 0, height: 0, chunks: [] };
  }
  for (let i = 0; i < 8; i++) {
    if (pngBytes[i] !== sig[i]) {
      return { valid: false, width: 0, height: 0, chunks: [] };
    }
  }

  const chunks: string[] = [];
  let offset = 8;
  let width = 0;
  let height = 0;

  while (offset + 12 <= pngBytes.length) {
    const length =
      ((pngBytes[offset] << 24) |
        (pngBytes[offset + 1] << 16) |
        (pngBytes[offset + 2] << 8) |
        pngBytes[offset + 3]) >>>
      0;
    const type = String.fromCharCode(
      pngBytes[offset + 4],
      pngBytes[offset + 5],
      pngBytes[offset + 6],
      pngBytes[offset + 7],
    );
    if (offset + 12 + length > pngBytes.length) {
      return { valid: false, width, height, chunks };
    }
    const crcExpected =
      ((pngBytes[offset + 8 + length] << 24) |
        (pngBytes[offset + 9 + length] << 16) |
        (pngBytes[offset + 10 + length] << 8) |
        pngBytes[offset + 11 + length]) >>>
      0;
    const crcActual = crc32(pngBytes.subarray(offset + 4, offset + 8 + length));
    if (crcExpected !== crcActual) {
      return { valid: false, width, height, chunks };
    }

    if (type === "IHDR" && length === 13) {
      width =
        ((pngBytes[offset + 8] << 24) |
          (pngBytes[offset + 9] << 16) |
          (pngBytes[offset + 10] << 8) |
          pngBytes[offset + 11]) >>>
        0;
      height =
        ((pngBytes[offset + 12] << 24) |
          (pngBytes[offset + 13] << 16) |
          (pngBytes[offset + 14] << 8) |
          pngBytes[offset + 15]) >>>
        0;
    }

    chunks.push(type);
    offset += 12 + length;
    if (type === "IEND") break;
  }

  const valid =
    offset === pngBytes.length &&
    chunks[0] === "IHDR" &&
    chunks.includes("IDAT") &&
    chunks[chunks.length - 1] === "IEND";

  return { valid, width, height, chunks };
}
