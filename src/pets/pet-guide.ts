// SPDX-License-Identifier: Apache-2.0
import { Ambient, gaze, PET_WEB, resolve, type Tick } from "./runtime.ts";
import { PET_COLORS } from "./pet.ts";

export interface PetGuideTip {
  readonly surface: string;
  readonly state: "running" | "waiting" | "review" | "failed" | "idle";
  readonly message: string;
}

export const APHRODY_SURFACE_TIPS: readonly PetGuideTip[] = [
  {
    surface: "search",
    state: "idle",
    message:
      "3-VPS cluster ready (fr1 edge, fr2 Chromium crawler, usa Google grounding).",
  },
  {
    surface: "craft",
    state: "running",
    message: "WASM SIMD + WebGPU WGSL studio active.",
  },
  {
    surface: "office",
    state: "review",
    message:
      "Fluent 2 WordCraft, GridCraft, and DeckCraft autosaved to SQLite WAL.",
  },
  {
    surface: "drive",
    state: "idle",
    message: "Spacedrive VDFS content-addressed Blake3 store mounted.",
  },
  {
    surface: "studio",
    state: "waiting",
    message: "Local inference router probing :8787, :8129, and :11434.",
  },
];

export class AphrodyPetController {
  readonly ambient: Ambient;
  constructor(nowMs = 0) {
    this.ambient = new Ambient(nowMs, PET_WEB.states);
  }
  notifySurface(
    surface: string,
    nowMs: number,
  ): { tip: PetGuideTip; tick: Tick | null; track: string } {
    const tip =
      APHRODY_SURFACE_TIPS.find((t) => t.surface === surface) ??
      APHRODY_SURFACE_TIPS[0]!;
    if (tip.state === "idle") {
      this.ambient.clear();
    } else {
      this.ambient.set(tip.state, nowMs);
    }
    const [anim, elapsed] = this.ambient.animation(nowMs);
    const resolved = resolve(PET_WEB.tracks, anim, elapsed);
    return {
      tip,
      tick: resolved?.tick ?? null,
      track: resolved?.track ?? "idle",
    };
  }
  lookAt(dx: number, dy: number): number {
    const idx = gaze(dx, dy, PET_WEB.gazeDeadzone, PET_WEB.directions.length);
    return idx === null
      ? PET_WEB.neutral
      : (PET_WEB.directions[idx] ?? PET_WEB.neutral);
  }
}

export { PET_COLORS };
