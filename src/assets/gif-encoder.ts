/**
 * Pure TypeScript GIF89a Animated Binary Encoder + Variable-Code-Size LZW Compressor & Verifier
 * 100% Pure Bun v1.4.4 - Zero External Dependencies
 *
 * Implements the full CompuServe GIF89a specification:
 * - Header ("GIF89a") & Logical Screen Descriptor
 * - Global Color Table (power-of-two up to 256 RGB entries)
 * - NETSCAPE2.0 Application Extension for infinite/counted looping
 * - Graphic Control Extension (frame delay in centiseconds, disposal method, transparency index)
 * - Image Descriptor & Variable-Width LZW Compression (Clear Code, EOI Code, 12-bit max table reset, 255-byte sub-blocks)
 * - Reference LZW decompressor for round-trip unit test verification
 */

export interface GifPaletteEntry {
  r: number;
  g: number;
  b: number;
}

export interface GifFrameInput {
  /** Indexed pixel values (0..palette.length-1), length = width * height */
  pixels: Uint8Array;
  /** Delay in centiseconds (1/100s), e.g., 12 = 120ms */
  delayCs?: number;
  /** Optional transparent color index */
  transparentIndex?: number;
  /** Disposal method: 1 = do not dispose, 2 = restore to background (default for transparent sprites) */
  disposalMethod?: 1 | 2;
}

export interface GifEncodeOptions {
  width: number;
  height: number;
  palette: GifPaletteEntry[];
  frames: GifFrameInput[];
  /** 0 = infinite loop (default) */
  loopCount?: number;
  backgroundIndex?: number;
}

function nextPowerOfTwoBits(count: number): number {
  let bits = 1;
  while (1 << bits < count && bits < 8) {
    bits++;
  }
  return Math.max(2, bits);
}

/**
 * Compress indexed pixel array using GIF Variable-Code-Size LSB-first LZW.
 */
export function lzwCompressGifIndices(
  indices: Uint8Array,
  minCodeSize: number,
): Uint8Array {
  const clearCode = 1 << minCodeSize;
  const eoiCode = clearCode + 1;

  let codeSize = minCodeSize + 1;
  let nextCode = eoiCode + 1;

  // Map key = (prefixCode << 8) | suffixByte -> code
  let dict = new Map<number, number>();

  const bytes: number[] = [];
  let bitBuffer = 0;
  let bitCount = 0;

  const emitCode = (code: number) => {
    bitBuffer |= code << bitCount;
    bitCount += codeSize;
    while (bitCount >= 8) {
      bytes.push(bitBuffer & 0xff);
      bitBuffer >>>= 8;
      bitCount -= 8;
    }
  };

  // Always start with a Clear Code
  emitCode(clearCode);

  if (indices.length > 0) {
    let prefix = indices[0] & ((1 << minCodeSize) - 1);

    for (let i = 1; i < indices.length; i++) {
      const k = indices[i] & ((1 << minCodeSize) - 1);
      const key = (prefix << 8) | k;
      const hit = dict.get(key);

      if (hit !== undefined) {
        prefix = hit;
      } else {
        emitCode(prefix);

        if (nextCode < 4096) {
          dict.set(key, nextCode);
          if (nextCode === 1 << codeSize && codeSize < 12) {
            codeSize++;
          }
          nextCode++;
        } else {
          // Dictionary full (4096 entries): emit Clear Code and reset table
          emitCode(clearCode);
          dict = new Map<number, number>();
          codeSize = minCodeSize + 1;
          nextCode = eoiCode + 1;
        }
        prefix = k;
      }
    }

    emitCode(prefix);
  }

  emitCode(eoiCode);
  if (bitCount > 0) {
    bytes.push(bitBuffer & 0xff);
  }

  return new Uint8Array(bytes);
}

/**
 * Reference GIF LZW decompressor to deterministically verify encoded frames in unit tests.
 */
export function lzwDecompressGifIndices(
  compressedStream: Uint8Array,
  minCodeSize: number,
): Uint8Array {
  const clearCode = 1 << minCodeSize;
  const eoiCode = clearCode + 1;

  let codeSize = minCodeSize + 1;
  let table: Uint8Array[] = [];

  const resetTable = () => {
    table = [];
    for (let i = 0; i < clearCode; i++) {
      table[i] = new Uint8Array([i]);
    }
    table[clearCode] = new Uint8Array(0);
    table[eoiCode] = new Uint8Array(0);
    codeSize = minCodeSize + 1;
  };

  resetTable();

  let bitPos = 0;
  const totalBits = compressedStream.length * 8;
  const readCode = (): number | null => {
    if (bitPos + codeSize > totalBits) return null;
    let code = 0;
    for (let b = 0; b < codeSize; b++) {
      const byteIdx = (bitPos + b) >>> 3;
      const bitIdx = (bitPos + b) & 7;
      if ((compressedStream[byteIdx] & (1 << bitIdx)) !== 0) {
        code |= 1 << b;
      }
    }
    bitPos += codeSize;
    return code;
  };

  const out: number[] = [];
  let prevEntry: Uint8Array | null = null;

  while (true) {
    const code = readCode();
    if (code === null || code === eoiCode) break;

    if (code === clearCode) {
      resetTable();
      prevEntry = null;
      continue;
    }

    let entry: Uint8Array;
    if (code < table.length) {
      entry = table[code];
    } else if (code === table.length && prevEntry !== null) {
      entry = new Uint8Array(prevEntry.length + 1);
      entry.set(prevEntry, 0);
      entry[prevEntry.length] = prevEntry[0];
    } else {
      throw new Error(
        `Invalid GIF LZW code ${code} (table size ${table.length})`,
      );
    }

    for (let i = 0; i < entry.length; i++) {
      out.push(entry[i]);
    }

    if (prevEntry !== null && table.length < 4096) {
      const nextEntry = new Uint8Array(prevEntry.length + 1);
      nextEntry.set(prevEntry, 0);
      nextEntry[prevEntry.length] = entry[0];
      table.push(nextEntry);
      if (table.length === 1 << codeSize && codeSize < 12) {
        codeSize++;
      }
    }

    prevEntry = entry;
  }

  return new Uint8Array(out);
}

/**
 * Encode a complete multi-frame animated GIF89a binary.
 */
export function encodeAnimatedGif(options: GifEncodeOptions): Uint8Array {
  const { width, height, palette, frames } = options;
  if (width <= 0 || height <= 0 || width > 65535 || height > 65535) {
    throw new Error(`Invalid GIF dimensions: ${width}x${height}`);
  }
  if (palette.length === 0 || palette.length > 256) {
    throw new Error(
      `GIF palette must contain 1..256 colors (got ${palette.length})`,
    );
  }
  if (frames.length === 0) {
    throw new Error("GIF requires at least 1 frame");
  }

  const colorBits = nextPowerOfTwoBits(palette.length); // 2..8
  const gctSizeCount = 1 << colorBits;
  const gctSizeField = colorBits - 1; // 0..7 in packed byte
  const minCodeSize = Math.max(2, colorBits);

  const bytes: number[] = [];
  const pushU16LE = (val: number) => {
    bytes.push(val & 0xff, (val >>> 8) & 0xff);
  };
  const pushAscii = (s: string) => {
    for (let i = 0; i < s.length; i++) {
      bytes.push(s.charCodeAt(i) & 0xff);
    }
  };

  // 1. Header: GIF89a
  pushAscii("GIF89a");

  // 2. Logical Screen Descriptor
  pushU16LE(width);
  pushU16LE(height);
  // Packed: GCT flag (1<<7) | Color Resolution (7<<4) | Sort (0<<3) | GCT Size
  const packedLsd = 0x80 | (0x07 << 4) | gctSizeField;
  bytes.push(packedLsd);
  bytes.push((options.backgroundIndex ?? 0) & 0xff);
  bytes.push(0x00); // Pixel aspect ratio

  // 3. Global Color Table
  for (let i = 0; i < gctSizeCount; i++) {
    const entry = palette[i] ?? { r: 0, g: 0, b: 0 };
    bytes.push(entry.r & 0xff, entry.g & 0xff, entry.b & 0xff);
  }

  // 4. NETSCAPE2.0 Application Extension (for animated multi-frame loop)
  const loopCount = options.loopCount ?? 0;
  bytes.push(0x21, 0xff, 0x0b); // Extension Introducer, App Extension Label, Block Size 11
  pushAscii("NETSCAPE2.0");
  bytes.push(0x03, 0x01); // Sub-block size 3, sub-block ID 1
  pushU16LE(loopCount);
  bytes.push(0x00); // Block terminator

  // 5. Frames
  for (const frame of frames) {
    if (frame.pixels.length !== width * height) {
      throw new Error(
        `Frame pixel length ${frame.pixels.length} does not match ${width}x${height}`,
      );
    }

    const delayCs = frame.delayCs ?? 12;
    const hasTransparency = frame.transparentIndex !== undefined;
    const disposal = frame.disposalMethod ?? (hasTransparency ? 2 : 1);

    // Graphic Control Extension
    bytes.push(0x21, 0xf9, 0x04);
    const gcePacked =
      ((disposal & 0x07) << 2) | (hasTransparency ? 0x01 : 0x00);
    bytes.push(gcePacked);
    pushU16LE(delayCs);
    bytes.push((frame.transparentIndex ?? 0) & 0xff);
    bytes.push(0x00); // Terminator

    // Image Descriptor
    bytes.push(0x2c); // Image Separator
    pushU16LE(0); // Left
    pushU16LE(0); // Top
    pushU16LE(width);
    pushU16LE(height);
    bytes.push(0x00); // No local color table, non-interlaced

    // Image Data: LZW Minimum Code Size + 255-byte data sub-blocks
    bytes.push(minCodeSize);
    const lzwBytes = lzwCompressGifIndices(frame.pixels, minCodeSize);
    let offset = 0;
    while (offset < lzwBytes.length) {
      const chunkLen = Math.min(255, lzwBytes.length - offset);
      bytes.push(chunkLen);
      for (let i = 0; i < chunkLen; i++) {
        bytes.push(lzwBytes[offset + i]);
      }
      offset += chunkLen;
    }
    bytes.push(0x00); // Sub-block terminator
  }

  // 6. GIF Trailer
  bytes.push(0x3b);

  return new Uint8Array(bytes);
}

/**
 * Inspect and verify an encoded GIF89a binary (magic header, dimensions, NETSCAPE2.0 loop, frame count, trailer).
 */
export function inspectGifBinary(gifBytes: Uint8Array): {
  valid: boolean;
  magic: string;
  width: number;
  height: number;
  hasNetscapeLoop: boolean;
  frameCount: number;
} {
  if (gifBytes.length < 20) {
    return {
      valid: false,
      magic: "",
      width: 0,
      height: 0,
      hasNetscapeLoop: false,
      frameCount: 0,
    };
  }
  const magic = String.fromCharCode(
    gifBytes[0],
    gifBytes[1],
    gifBytes[2],
    gifBytes[3],
    gifBytes[4],
    gifBytes[5],
  );
  const width = gifBytes[6] | (gifBytes[7] << 8);
  const height = gifBytes[8] | (gifBytes[9] << 8);
  const packed = gifBytes[10];
  const hasGct = (packed & 0x80) !== 0;
  const gctCount = hasGct ? 1 << ((packed & 0x07) + 1) : 0;

  let offset = 13 + gctCount * 3;
  let hasNetscapeLoop = false;
  let frameCount = 0;

  while (offset < gifBytes.length) {
    const marker = gifBytes[offset++];
    if (marker === 0x3b) {
      return {
        valid:
          magic === "GIF89a" && frameCount > 0 && offset === gifBytes.length,
        magic,
        width,
        height,
        hasNetscapeLoop,
        frameCount,
      };
    }
    if (marker === 0x21) {
      // Extension
      const label = gifBytes[offset++];
      if (label === 0xff) {
        const blockSize = gifBytes[offset++];
        const appId = String.fromCharCode(
          ...gifBytes.subarray(offset, offset + blockSize),
        );
        if (appId === "NETSCAPE2.0") hasNetscapeLoop = true;
        offset += blockSize;
      } else {
        const blockSize = gifBytes[offset++];
        offset += blockSize;
      }
      // Skip sub-blocks until 0x00
      while (offset < gifBytes.length) {
        const subLen = gifBytes[offset++];
        if (subLen === 0) break;
        offset += subLen;
      }
    } else if (marker === 0x2c) {
      // Image Descriptor (9 bytes after 0x2c)
      frameCount++;
      const imgPacked = gifBytes[offset + 8];
      offset += 9;
      if ((imgPacked & 0x80) !== 0) {
        const lctCount = 1 << ((imgPacked & 0x07) + 1);
        offset += lctCount * 3;
      }
      offset++; // LZW min code size
      while (offset < gifBytes.length) {
        const subLen = gifBytes[offset++];
        if (subLen === 0) break;
        offset += subLen;
      }
    } else {
      break;
    }
  }

  return {
    valid: false,
    magic,
    width,
    height,
    hasNetscapeLoop,
    frameCount,
  };
}
