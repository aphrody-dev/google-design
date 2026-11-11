import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import {
  Ambient,
  AphrodyPetController,
  bestEntry,
  entryToPng,
  gaze,
  getAphrodyPetSymbolSvg,
  isIco,
  m3Icon,
  m3IconNames,
  optimizeSvgMarkup,
  parseIco,
  PET,
  PET_WEB,
  resolve,
  type WebTrack,
} from "../index.ts";

const PARITE_FIXTURE_PATH = join(
  import.meta.dir,
  "../../../crates/design-system/crates/aphrody-design-identity/tests/fixtures/parite-web.json",
);

type TickRow = [number, string, string | null, number | null, number | null];

interface ParityFixture {
  schema: number;
  gazeDeadzone: number;
  cases: { id: string; tracks: Record<string, WebTrack>; ticks: TickRow[] }[];
  ambient: {
    op: "voir" | "poser" | "effacer";
    state: string | null;
    now: number;
    animation: string;
    elapsed: number;
    sprite: number | null;
    delay: number | null;
  }[];
  gaze: [number, number, number | null][];
}

const fixture = JSON.parse(
  readFileSync(PARITE_FIXTURE_PATH, "utf8"),
) as ParityFixture;

describe("Aphrody Pet Rust <-> Web Parity & Assets", () => {
  test("replays all 966+ ticks across aphrody and synthetique cases with exact integer-ms parity", () => {
    expect(fixture.schema).toBe(1);
    let totalTicks = 0;
    for (const c of fixture.cases) {
      totalTicks += c.ticks.length;
      const got = c.ticks.map(([elapsed, name]): TickRow => {
        const r = resolve(c.tracks, name, elapsed);
        return [
          elapsed,
          name,
          r?.track ?? null,
          r?.tick.sprite ?? null,
          r?.tick.delay ?? null,
        ];
      });
      expect(got).toEqual(c.ticks);
    }
    expect(totalTicks).toBeGreaterThanOrEqual(960);
  });

  test("ambient lifetime script and 16-way gaze rose match Rust crate bit-for-bit", () => {
    const first = fixture.ambient[0]!;
    const ambient = new Ambient(first.now, PET_WEB.states);
    const gotAmbient = fixture.ambient.map((step) => {
      if (step.op === "poser" && step.state) ambient.set(step.state, step.now);
      if (step.op === "effacer") ambient.clear();
      const [animation, elapsed] = ambient.animation(step.now);
      const r = resolve(PET_WEB.tracks, animation, elapsed);
      return {
        ...step,
        animation,
        elapsed,
        sprite: r?.tick.sprite ?? null,
        delay: r?.tick.delay ?? null,
      };
    });
    expect(gotAmbient).toEqual(fixture.ambient);

    const gotGaze = fixture.gaze.map(([dx, dy]) => [
      dx,
      dy,
      gaze(dx, dy, fixture.gazeDeadzone, PET_WEB.directions.length),
    ]);
    expect(gotGaze).toEqual(fixture.gaze);
    expect(PET.directions.length).toBe(16);
  });

  test("AphrodyPetController, M3 optimized icons, AphrodyPetSymbols, and .ico parser work deterministically", () => {
    const ctrl = new AphrodyPetController(1000);
    const craftState = ctrl.notifySurface("craft", 1500);
    expect(craftState.track).toBe("running");
    expect(ctrl.lookAt(0, -100)).toBe(72);

    const petWaveSvg = getAphrodyPetSymbolSvg("pet_wave", "rounded", 500, 32);
    expect(petWaveSvg).toContain("<svg");
    expect(petWaveSvg).toContain('width="32"');

    const searchSvg = m3Icon({ name: "search", style: "outlined", size: 20 });
    expect(searchSvg).toContain('viewBox="0 -960 960 960"');
    expect(
      optimizeSvgMarkup(
        '<!-- comment -->\n<svg width="24" height="24"> <path d="M0 0"/> </svg>',
        18,
      ),
    ).toContain('width="18" height="18"');
    expect(m3IconNames().length).toBeGreaterThan(40);

    const icoBytes = new Uint8Array(
      readFileSync(join(import.meta.dir, "../assets/brand/favicon.ico")),
    );
    expect(isIco(icoBytes)).toBe(true);
    const entries = parseIco(icoBytes);
    expect(entries.length).toBeGreaterThanOrEqual(4);
    const png = entryToPng(entries[bestEntry(entries, 32)]!);
    expect(png[0]).toBe(0x89);
  });
});
