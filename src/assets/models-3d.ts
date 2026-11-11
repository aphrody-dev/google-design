/**
 * Open-Source 3D Models & Pure TypeScript glTF 2.0 (.gltf + Binary .glb + Wavefront .obj) Encoder
 * 100% Pure Bun v1.4.4 - Zero External Dependencies
 *
 * Implements specification-compliant glTF 2.0 binary container (.glb):
 * - Header (12 bytes): magic 0x46546C67 ("glTF"), version 2, total length
 * - Chunk 0 (JSON): chunkType 0x4E4F534A ("JSON"), padded to 4-byte boundary with 0x20 spaces
 * - Chunk 1 (BIN):  chunkType 0x004E4942 ("BIN\0"), Float32 POSITION, NORMAL, TEXCOORD_0 + Uint16 indices, padded with 0x00
 * - PBR Metallic-Roughness materials ready for Three.js r186 WebGPURenderer & Rust wgpu
 */

import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

export interface MeshGeometryData {
  id: string;
  name: string;
  positions: Float32Array; // 3 * vertexCount
  normals: Float32Array; // 3 * vertexCount
  uvs: Float32Array; // 2 * vertexCount
  indices: Uint16Array; // 3 * triangleCount
  baseColorFactor: [number, number, number, number];
  metallicFactor: number;
  roughnessFactor: number;
}

function computeMinMaxVec3(arr: Float32Array): {
  min: [number, number, number];
  max: [number, number, number];
} {
  let minX = Infinity;
  let minY = Infinity;
  let minZ = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;
  let maxZ = -Infinity;

  for (let i = 0; i < arr.length; i += 3) {
    const x = arr[i];
    const y = arr[i + 1];
    const z = arr[i + 2];
    if (x < minX) minX = x;
    if (y < minY) minY = y;
    if (z < minZ) minZ = z;
    if (x > maxX) maxX = x;
    if (y > maxY) maxY = y;
    if (z > maxZ) maxZ = z;
  }

  return {
    min: [
      Number(minX.toFixed(6)),
      Number(minY.toFixed(6)),
      Number(minZ.toFixed(6)),
    ],
    max: [
      Number(maxX.toFixed(6)),
      Number(maxY.toFixed(6)),
      Number(maxZ.toFixed(6)),
    ],
  };
}

function buildBinaryBuffer(mesh: MeshGeometryData): {
  binChunkPadded: Uint8Array;
  offsets: {
    posOffset: number;
    posLen: number;
    normOffset: number;
    normLen: number;
    uvOffset: number;
    uvLen: number;
    idxOffset: number;
    idxLen: number;
    totalLen: number;
  };
} {
  const posBytes = new Uint8Array(
    mesh.positions.buffer,
    mesh.positions.byteOffset,
    mesh.positions.byteLength,
  );
  const normBytes = new Uint8Array(
    mesh.normals.buffer,
    mesh.normals.byteOffset,
    mesh.normals.byteLength,
  );
  const uvBytes = new Uint8Array(
    mesh.uvs.buffer,
    mesh.uvs.byteOffset,
    mesh.uvs.byteLength,
  );
  const idxBytes = new Uint8Array(
    mesh.indices.buffer,
    mesh.indices.byteOffset,
    mesh.indices.byteLength,
  );

  const posOffset = 0;
  const posLen = posBytes.byteLength;
  const normOffset = posOffset + posLen;
  const normLen = normBytes.byteLength;
  const uvOffset = normOffset + normLen;
  const uvLen = uvBytes.byteLength;
  const idxOffset = uvOffset + uvLen;
  const idxLen = idxBytes.byteLength;

  const rawTotal = idxOffset + idxLen;
  const paddedTotal = (rawTotal + 3) & ~3; // 4-byte alignment

  const bin = new Uint8Array(paddedTotal);
  bin.set(posBytes, posOffset);
  bin.set(normBytes, normOffset);
  bin.set(uvBytes, uvOffset);
  bin.set(idxBytes, idxOffset);

  return {
    binChunkPadded: bin,
    offsets: {
      posOffset,
      posLen,
      normOffset,
      normLen,
      uvOffset,
      uvLen,
      idxOffset,
      idxLen,
      totalLen: paddedTotal,
    },
  };
}

function buildGltfJsonObject(
  mesh: MeshGeometryData,
  offsets: ReturnType<typeof buildBinaryBuffer>["offsets"],
  embeddedBase64Uri?: string,
): Record<string, any> {
  const vertexCount = mesh.positions.length / 3;
  const bounds = computeMinMaxVec3(mesh.positions);

  const bufferDef: Record<string, any> = {
    byteLength: offsets.totalLen,
  };
  if (embeddedBase64Uri) {
    bufferDef.uri = embeddedBase64Uri;
  }

  return {
    asset: {
      version: "2.0",
      generator: "@aphrody/google-design gds v2.0.0 (Bun v1.4.4)",
      copyright: "CC0-1.0 Public Domain - Aphrody Open Creative Asset Bank",
    },
    scene: 0,
    scenes: [{ name: mesh.name, nodes: [0] }],
    nodes: [{ name: mesh.id, mesh: 0 }],
    materials: [
      {
        name: `${mesh.id}-pbr`,
        pbrMetallicRoughness: {
          baseColorFactor: mesh.baseColorFactor,
          metallicFactor: mesh.metallicFactor,
          roughnessFactor: mesh.roughnessFactor,
        },
        doubleSided: false,
      },
    ],
    meshes: [
      {
        name: mesh.name,
        primitives: [
          {
            attributes: {
              POSITION: 0,
              NORMAL: 1,
              TEXCOORD_0: 2,
            },
            indices: 3,
            material: 0,
            mode: 4, // TRIANGLES
          },
        ],
      },
    ],
    buffers: [bufferDef],
    bufferViews: [
      {
        buffer: 0,
        byteOffset: offsets.posOffset,
        byteLength: offsets.posLen,
        target: 34962, // ARRAY_BUFFER
      },
      {
        buffer: 0,
        byteOffset: offsets.normOffset,
        byteLength: offsets.normLen,
        target: 34962,
      },
      {
        buffer: 0,
        byteOffset: offsets.uvOffset,
        byteLength: offsets.uvLen,
        target: 34962,
      },
      {
        buffer: 0,
        byteOffset: offsets.idxOffset,
        byteLength: offsets.idxLen,
        target: 34963, // ELEMENT_ARRAY_BUFFER
      },
    ],
    accessors: [
      {
        bufferView: 0,
        componentType: 5126, // FLOAT
        count: vertexCount,
        type: "VEC3",
        min: bounds.min,
        max: bounds.max,
      },
      {
        bufferView: 1,
        componentType: 5126,
        count: vertexCount,
        type: "VEC3",
      },
      {
        bufferView: 2,
        componentType: 5126,
        count: vertexCount,
        type: "VEC2",
      },
      {
        bufferView: 3,
        componentType: 5123, // UNSIGNED_SHORT
        count: mesh.indices.length,
        type: "SCALAR",
      },
    ],
  };
}

/**
 * Encode a MeshGeometryData into a specification-compliant glTF 2.0 Binary (.glb).
 */
export function encodeGlb2(mesh: MeshGeometryData): Uint8Array {
  const { binChunkPadded, offsets } = buildBinaryBuffer(mesh);
  const gltfObj = buildGltfJsonObject(mesh, offsets);
  const jsonText = JSON.stringify(gltfObj);
  const jsonRaw = new TextEncoder().encode(jsonText);
  const jsonPaddedLen = (jsonRaw.length + 3) & ~3;
  const jsonChunk = new Uint8Array(jsonPaddedLen);
  jsonChunk.fill(0x20); // Pad JSON chunk with ASCII spaces per glTF 2.0 spec
  jsonChunk.set(jsonRaw, 0);

  const totalByteLength = 12 + 8 + jsonChunk.length + 8 + binChunkPadded.length;
  const out = new Uint8Array(totalByteLength);
  const view = new DataView(out.buffer);

  // Header (12 bytes)
  view.setUint32(0, 0x46546c67, true); // "glTF"
  view.setUint32(4, 2, true); // version 2
  view.setUint32(8, totalByteLength, true);

  // Chunk 0: JSON
  view.setUint32(12, jsonChunk.length, true);
  view.setUint32(16, 0x4e4f534a, true); // "JSON"
  out.set(jsonChunk, 20);

  // Chunk 1: BIN
  const binHeaderOffset = 20 + jsonChunk.length;
  view.setUint32(binHeaderOffset, binChunkPadded.length, true);
  view.setUint32(binHeaderOffset + 4, 0x004e4942, true); // "BIN\0"
  out.set(binChunkPadded, binHeaderOffset + 8);

  return out;
}

/**
 * Encode self-contained JSON .gltf with data:application/octet-stream;base64 URI.
 */
export function encodeGltfJson(mesh: MeshGeometryData): string {
  const { binChunkPadded, offsets } = buildBinaryBuffer(mesh);
  const b64 = Buffer.from(binChunkPadded).toString("base64");
  const uri = `data:application/octet-stream;base64,${b64}`;
  const gltfObj = buildGltfJsonObject(mesh, offsets, uri);
  return JSON.stringify(gltfObj, null, 2);
}

/**
 * Encode Wavefront .obj mesh text.
 */
export function encodeWavefrontObj(mesh: MeshGeometryData): string {
  const lines: string[] = [
    `# Aphrody Open Creative Asset Bank - ${mesh.name}`,
    `# License: CC0-1.0`,
    `o ${mesh.id}`,
  ];
  for (let i = 0; i < mesh.positions.length; i += 3) {
    lines.push(
      `v ${mesh.positions[i].toFixed(5)} ${mesh.positions[i + 1].toFixed(5)} ${mesh.positions[i + 2].toFixed(5)}`,
    );
  }
  for (let i = 0; i < mesh.uvs.length; i += 2) {
    lines.push(`vt ${mesh.uvs[i].toFixed(5)} ${mesh.uvs[i + 1].toFixed(5)}`);
  }
  for (let i = 0; i < mesh.normals.length; i += 3) {
    lines.push(
      `vn ${mesh.normals[i].toFixed(5)} ${mesh.normals[i + 1].toFixed(5)} ${mesh.normals[i + 2].toFixed(5)}`,
    );
  }
  for (let i = 0; i < mesh.indices.length; i += 3) {
    const a = mesh.indices[i] + 1;
    const b = mesh.indices[i + 1] + 1;
    const c = mesh.indices[i + 2] + 1;
    lines.push(`f ${a}/${a}/${a} ${b}/${b}/${b} ${c}/${c}/${c}`);
  }
  return lines.join("\n") + "\n";
}

/**
 * Verify a GLB 2.0 binary container in unit tests.
 */
export function inspectGlbBinary(glbBytes: Uint8Array): {
  valid: boolean;
  magic: number;
  version: number;
  totalLength: number;
  jsonChunkType: number;
  binChunkType: number;
  meshName: string;
} {
  if (glbBytes.byteLength < 28) {
    return {
      valid: false,
      magic: 0,
      version: 0,
      totalLength: 0,
      jsonChunkType: 0,
      binChunkType: 0,
      meshName: "",
    };
  }
  const view = new DataView(
    glbBytes.buffer,
    glbBytes.byteOffset,
    glbBytes.byteLength,
  );
  const magic = view.getUint32(0, true);
  const version = view.getUint32(4, true);
  const totalLength = view.getUint32(8, true);
  const jsonLen = view.getUint32(12, true);
  const jsonChunkType = view.getUint32(16, true);

  const jsonBytes = glbBytes.subarray(20, 20 + jsonLen);
  const parsed = JSON.parse(new TextDecoder().decode(jsonBytes));

  const binHeaderOffset = 20 + jsonLen;
  const binLen = view.getUint32(binHeaderOffset, true);
  const binChunkType = view.getUint32(binHeaderOffset + 4, true);

  const valid =
    magic === 0x46546c67 &&
    version === 2 &&
    totalLength === glbBytes.byteLength &&
    jsonChunkType === 0x4e4f534a &&
    binChunkType === 0x004e4942 &&
    binHeaderOffset + 8 + binLen === totalLength;

  return {
    valid,
    magic,
    version,
    totalLength,
    jsonChunkType,
    binChunkType,
    meshName: parsed?.meshes?.[0]?.name ?? "",
  };
}

// --- Procedural Mesh Generators ---

function createBoxPrimitive(
  hx: number,
  hy: number,
  hz: number,
  offsetY = 0,
): {
  pos: number[];
  norm: number[];
  uv: number[];
  idx: number[];
} {
  const faces: Array<{
    n: [number, number, number];
    v: Array<[number, number, number]>;
  }> = [
    {
      n: [0, 0, 1],
      v: [
        [-hx, -hy, hz],
        [hx, -hy, hz],
        [hx, hy, hz],
        [-hx, hy, hz],
      ],
    },
    {
      n: [0, 0, -1],
      v: [
        [hx, -hy, -hz],
        [-hx, -hy, -hz],
        [-hx, hy, -hz],
        [hx, hy, -hz],
      ],
    },
    {
      n: [1, 0, 0],
      v: [
        [hx, -hy, hz],
        [hx, -hy, -hz],
        [hx, hy, -hz],
        [hx, hy, hz],
      ],
    },
    {
      n: [-1, 0, 0],
      v: [
        [-hx, -hy, -hz],
        [-hx, -hy, hz],
        [-hx, hy, hz],
        [-hx, hy, -hz],
      ],
    },
    {
      n: [0, 1, 0],
      v: [
        [-hx, hy, hz],
        [hx, hy, hz],
        [hx, hy, -hz],
        [-hx, hy, -hz],
      ],
    },
    {
      n: [0, -1, 0],
      v: [
        [-hx, -hy, -hz],
        [hx, -hy, -hz],
        [hx, -hy, hz],
        [-hx, -hy, hz],
      ],
    },
  ];

  const pos: number[] = [];
  const norm: number[] = [];
  const uv: number[] = [];
  const idx: number[] = [];

  for (let f = 0; f < faces.length; f++) {
    const base = f * 4;
    const face = faces[f];
    const uvs: Array<[number, number]> = [
      [0, 0],
      [1, 0],
      [1, 1],
      [0, 1],
    ];
    for (let k = 0; k < 4; k++) {
      pos.push(face.v[k][0], face.v[k][1] + offsetY, face.v[k][2]);
      norm.push(face.n[0], face.n[1], face.n[2]);
      uv.push(uvs[k][0], uvs[k][1]);
    }
    idx.push(base, base + 1, base + 2, base, base + 2, base + 3);
  }

  return { pos, norm, uv, idx };
}

function buildAphrodyMonolithMesh(): MeshGeometryData {
  // Architectural 1:4:9 obelisk monolith (0.45 x 1.8 x 0.20)
  const b = createBoxPrimitive(0.4, 1.6, 0.18, 1.6);
  return {
    id: "aphrody-monolith",
    name: "Aphrody Architectural Monolith",
    positions: new Float32Array(b.pos),
    normals: new Float32Array(b.norm),
    uvs: new Float32Array(b.uv),
    indices: new Uint16Array(b.idx),
    baseColorFactor: [0.09, 0.11, 0.14, 1.0],
    metallicFactor: 0.75,
    roughnessFactor: 0.22,
  };
}

function buildIcosahedronCoreMesh(): MeshGeometryData {
  const t = (1 + Math.sqrt(5)) / 2;
  const rawVerts: Array<[number, number, number]> = [
    [-1, t, 0],
    [1, t, 0],
    [-1, -t, 0],
    [1, -t, 0],
    [0, -1, t],
    [0, 1, t],
    [0, -1, -t],
    [0, 1, -t],
    [t, 0, -1],
    [t, 0, 1],
    [-t, 0, -1],
    [-t, 0, 1],
  ].map(([x, y, z]) => {
    const len = Math.hypot(x, y, z);
    return [x / len, y / len, z / len];
  });

  const tris: Array<[number, number, number]> = [
    [0, 11, 5],
    [0, 5, 1],
    [0, 1, 7],
    [0, 7, 10],
    [0, 10, 11],
    [1, 5, 9],
    [5, 11, 4],
    [11, 10, 2],
    [10, 7, 6],
    [7, 1, 8],
    [3, 9, 4],
    [3, 4, 2],
    [3, 2, 6],
    [3, 6, 8],
    [3, 8, 9],
    [4, 9, 5],
    [2, 4, 11],
    [6, 2, 10],
    [8, 6, 7],
    [9, 8, 1],
  ];

  // Faceted flat normals for crisp architectural facets
  const pos: number[] = [];
  const norm: number[] = [];
  const uv: number[] = [];
  const idx: number[] = [];

  for (let i = 0; i < tris.length; i++) {
    const [ia, ib, ic] = tris[i];
    const a = rawVerts[ia];
    const b = rawVerts[ib];
    const c = rawVerts[ic];

    const ux = b[0] - a[0];
    const uy = b[1] - a[1];
    const uz = b[2] - a[2];
    const vx = c[0] - a[0];
    const vy = c[1] - a[1];
    const vz = c[2] - a[2];
    let nx = uy * vz - uz * vy;
    let ny = uz * vx - ux * vz;
    let nz = ux * vy - uy * vx;
    const nl = Math.hypot(nx, ny, nz) || 1;
    nx /= nl;
    ny /= nl;
    nz /= nl;

    const base = i * 3;
    pos.push(...a, ...b, ...c);
    norm.push(nx, ny, nz, nx, ny, nz, nx, ny, nz);
    uv.push(0, 0, 1, 0, 0.5, 1);
    idx.push(base, base + 1, base + 2);
  }

  return {
    id: "icosahedron-core",
    name: "Aphrody Geodesic Icosahedron Core",
    positions: new Float32Array(pos),
    normals: new Float32Array(norm),
    uvs: new Float32Array(uv),
    indices: new Uint16Array(idx),
    baseColorFactor: [0.1, 0.45, 0.91, 1.0],
    metallicFactor: 0.45,
    roughnessFactor: 0.28,
  };
}

function buildTorusKnotGpuMesh(): MeshGeometryData {
  // Parametric (2, 3) trefoil torus knot
  const tubularSegments = 48;
  const radialSegments = 10;
  const p = 2;
  const q = 3;
  const radius = 0.7;
  const tube = 0.18;

  const pos: number[] = [];
  const norm: number[] = [];
  const uv: number[] = [];
  const idx: number[] = [];

  const curvePoint = (u: number): [number, number, number] => {
    const cu = Math.cos(u);
    const su = Math.sin(u);
    const quOverP = (q / p) * u;
    const cs = Math.cos(quOverP);
    const r = radius * (2 + cs) * 0.5;
    return [r * cu, r * su, radius * Math.sin(quOverP) * 0.5];
  };

  for (let i = 0; i <= tubularSegments; i++) {
    const u = (i / tubularSegments) * p * Math.PI * 2;
    const p1 = curvePoint(u);
    const p2 = curvePoint(u + 0.01);

    let tx = p2[0] - p1[0];
    let ty = p2[1] - p1[1];
    let tz = p2[2] - p1[2];
    const tl = Math.hypot(tx, ty, tz) || 1;
    tx /= tl;
    ty /= tl;
    tz /= tl;

    let nx = -ty;
    let ny = tx;
    let nz = 0;
    const nl = Math.hypot(nx, ny, nz) || 1;
    nx /= nl;
    ny /= nl;

    const bx = ty * nz - tz * ny;
    const by = tz * nx - tx * nz;
    const bz = tx * ny - ty * nx;

    for (let j = 0; j <= radialSegments; j++) {
      const v = (j / radialSegments) * Math.PI * 2;
      const cx = -tube * Math.cos(v);
      const cy = tube * Math.sin(v);

      const vx = p1[0] + cx * nx + cy * bx;
      const vy = p1[1] + cx * ny + cy * by;
      const vz = p1[2] + cx * nz + cy * bz;

      let vnx = vx - p1[0];
      let vny = vy - p1[1];
      let vnz = vz - p1[2];
      const vnl = Math.hypot(vnx, vny, vnz) || 1;
      vnx /= vnl;
      vny /= vnl;
      vnz /= vnl;

      pos.push(vx, vy, vz);
      norm.push(vnx, vny, vnz);
      uv.push(i / tubularSegments, j / radialSegments);
    }
  }

  for (let j = 1; j <= tubularSegments; j++) {
    for (let i = 1; i <= radialSegments; i++) {
      const a = (radialSegments + 1) * (j - 1) + (i - 1);
      const b = (radialSegments + 1) * j + (i - 1);
      const c = (radialSegments + 1) * j + i;
      const d = (radialSegments + 1) * (j - 1) + i;
      idx.push(a, b, d, b, c, d);
    }
  }

  return {
    id: "torus-knot-gpu",
    name: "WebGPU Trefoil Torus Knot",
    positions: new Float32Array(pos),
    normals: new Float32Array(norm),
    uvs: new Float32Array(uv),
    indices: new Uint16Array(idx),
    baseColorFactor: [0.0, 0.8, 0.53, 1.0],
    metallicFactor: 0.65,
    roughnessFactor: 0.2,
  };
}

function buildWaylandCompositorStageMesh(): MeshGeometryData {
  // Multi-panel floating tiling window stage + base plinth
  const parts = [
    createBoxPrimitive(1.6, 0.05, 1.0, 0.0), // desk plinth
    createBoxPrimitive(0.75, 0.5, 0.03, 0.65), // master tiling pane
    createBoxPrimitive(0.55, 0.5, 0.03, 0.65), // secondary tiling pane (shifted)
  ];

  // Shift left/right panes along X
  for (let i = 0; i < parts[1].pos.length; i += 3) {
    parts[1].pos[i] -= 0.55;
  }
  for (let i = 0; i < parts[2].pos.length; i += 3) {
    parts[2].pos[i] += 0.82;
    parts[2].pos[i + 2] -= 0.08;
  }

  const pos: number[] = [];
  const norm: number[] = [];
  const uv: number[] = [];
  const idx: number[] = [];

  for (const part of parts) {
    const vOffset = pos.length / 3;
    pos.push(...part.pos);
    norm.push(...part.norm);
    uv.push(...part.uv);
    for (const id of part.idx) {
      idx.push(vOffset + id);
    }
  }

  return {
    id: "wayland-compositor-stage",
    name: "Wayland Tiling Compositor 3D Stage",
    positions: new Float32Array(pos),
    normals: new Float32Array(norm),
    uvs: new Float32Array(uv),
    indices: new Uint16Array(idx),
    baseColorFactor: [0.48, 0.64, 0.97, 1.0],
    metallicFactor: 0.35,
    roughnessFactor: 0.35,
  };
}

export function generate3dModelAssets(outDir: string): {
  files: string[];
  modelCount: number;
} {
  const modelsDir = join(outDir, "models-3d");
  mkdirSync(modelsDir, { recursive: true });

  const meshes: MeshGeometryData[] = [
    buildAphrodyMonolithMesh(),
    buildIcosahedronCoreMesh(),
    buildTorusKnotGpuMesh(),
    buildWaylandCompositorStageMesh(),
  ];

  const written: string[] = [];

  for (const mesh of meshes) {
    const glbBytes = encodeGlb2(mesh);
    const glbPath = join(modelsDir, `${mesh.id}.glb`);
    writeFileSync(glbPath, glbBytes);
    written.push(glbPath);

    const gltfJson = encodeGltfJson(mesh);
    const gltfPath = join(modelsDir, `${mesh.id}.gltf`);
    writeFileSync(gltfPath, gltfJson + "\n", "utf8");
    written.push(gltfPath);

    const objText = encodeWavefrontObj(mesh);
    const objPath = join(modelsDir, `${mesh.id}.obj`);
    writeFileSync(objPath, objText, "utf8");
    written.push(objPath);
  }

  return { files: written, modelCount: meshes.length };
}
