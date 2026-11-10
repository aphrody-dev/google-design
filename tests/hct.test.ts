import { describe, expect, test } from "bun:test";
import {
  getHctColorInfo,
  getTonalPaletteMap,
  generateDynamicTheme,
  calculateContrast,
  STANDARD_TONES,
} from "../src/color-utils/hct.ts";

describe("HCT Color Math & Material Dynamic Scheme", () => {
  test("converts hex to valid CAM16 / HCT color coordinates", () => {
    const info = getHctColorInfo("#4285F4");
    expect(info.hex).toBe("#4285f4");
    expect(info.hue).toBeGreaterThan(260);
    expect(info.hue).toBeLessThan(270);
    expect(info.tone).toBeGreaterThan(50);
    expect(info.tone).toBeLessThan(60);
    expect(info.chroma).toBeGreaterThan(50);
  });

  test("generates full standard tonal palette", () => {
    const palette = getTonalPaletteMap("#4285F4");
    for (const tone of STANDARD_TONES) {
      expect(palette[tone]).toBeDefined();
      expect(palette[tone]).toMatch(/^#[0-9a-fA-F]{6}$/);
    }
    // Tone 100 is white, Tone 0 is black
    expect(palette[100]).toBe("#ffffff");
    expect(palette[0]).toBe("#000000");
  });

  test("generates light and dark dynamic themes with all M3 system roles", () => {
    const theme = generateDynamicTheme("#4285F4", "tonal_spot");
    expect(theme.seed).toBe("#4285f4");
    expect(theme.light.primary).toBeDefined();
    expect(theme.light.surface).toBeDefined();
    expect(theme.dark.primary).toBeDefined();
    expect(theme.dark.surface).toBeDefined();
    expect(theme.palettes.primary).toBeDefined();
    expect(theme.palettes.secondary).toBeDefined();
  });

  test("calculates accurate WCAG 2.2 contrast ratio and tone delta", () => {
    // Pure black on pure white
    const bw = calculateContrast("#000000", "#ffffff");
    expect(bw.ratio).toBeGreaterThan(20);
    expect(bw.passAA).toBe(true);
    expect(bw.passAAA).toBe(true);
    expect(bw.toneDelta).toBe(100);

    // Tone 40 primary on tone 100 onPrimary
    const theme = generateDynamicTheme("#4285F4");
    const contrast = calculateContrast(
      theme.light.onPrimary,
      theme.light.primary,
    );
    expect(contrast.ratio).toBeGreaterThanOrEqual(4.5);
    expect(contrast.passAA).toBe(true);
  });
});
