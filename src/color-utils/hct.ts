/**
 * Google Material Color Utilities (MCU) & HCT Perceptual Color Space Engine
 * 100% Pure Bun v1.4.4 - Zero External Dependencies
 * Exact Port & Integration of Google CAM16 + CIELAB -> HCT Color Science
 */

import {
  argbFromHex,
  hexFromArgb,
  Hct,
  Cam16,
  ViewingConditions,
  TonalPalette,
  CorePalette,
  DynamicColor,
  DynamicScheme,
  MaterialDynamicColors,
  Contrast,
  QuantizerCelebi,
  QuantizerMap,
  QuantizerWu,
  Score,
  SchemeTonalSpot,
  SchemeExpressive,
  SchemeVibrant,
  SchemeMonochrome,
  SchemeNeutral,
  SchemeFidelity,
  SchemeContent,
  Variant,
} from "../../upstream/material-color-utilities/typescript/index.ts";

export {
  argbFromHex,
  hexFromArgb,
  Hct,
  Cam16,
  ViewingConditions,
  TonalPalette,
  CorePalette,
  DynamicColor,
  DynamicScheme,
  MaterialDynamicColors,
  Contrast,
  QuantizerCelebi,
  QuantizerMap,
  QuantizerWu,
  Score,
  SchemeTonalSpot,
  SchemeExpressive,
  SchemeVibrant,
  SchemeMonochrome,
  SchemeNeutral,
  SchemeFidelity,
  SchemeContent,
  Variant,
};

export const STANDARD_TONES = [
  0, 4, 6, 10, 12, 17, 20, 22, 24, 30, 40, 50, 60, 70, 80, 87, 90, 92, 94, 95,
  96, 98, 99, 100,
] as const;

export type StandardTone = (typeof STANDARD_TONES)[number];

export type SchemeVariant =
  | "tonal_spot"
  | "expressive"
  | "vibrant"
  | "monochrome"
  | "neutral"
  | "fidelity"
  | "content";

export interface HctColorInfo {
  hex: string;
  argb: number;
  hue: number;
  chroma: number;
  tone: number;
  rgb: { r: number; g: number; b: number };
}

export interface ContrastResult {
  ratio: number;
  passAA: boolean;
  passAAA: boolean;
  toneDelta: number;
}

export interface M3ColorScheme {
  primary: string;
  onPrimary: string;
  primaryContainer: string;
  onPrimaryContainer: string;
  secondary: string;
  onSecondary: string;
  secondaryContainer: string;
  onSecondaryContainer: string;
  tertiary: string;
  onTertiary: string;
  tertiaryContainer: string;
  onTertiaryContainer: string;
  error: string;
  onError: string;
  errorContainer: string;
  onErrorContainer: string;
  background: string;
  onBackground: string;
  surface: string;
  onSurface: string;
  surfaceVariant: string;
  onSurfaceVariant: string;
  surfaceContainerLowest: string;
  surfaceContainerLow: string;
  surfaceContainer: string;
  surfaceContainerHigh: string;
  surfaceContainerHighest: string;
  outline: string;
  outlineVariant: string;
  shadow: string;
  scrim: string;
  inverseSurface: string;
  inverseOnSurface: string;
  inversePrimary: string;
}

export interface DynamicThemeResult {
  seed: string;
  variant: SchemeVariant;
  contrastLevel: number;
  light: M3ColorScheme;
  dark: M3ColorScheme;
  palettes: {
    primary: Record<number, string>;
    secondary: Record<number, string>;
    tertiary: Record<number, string>;
    neutral: Record<number, string>;
    neutralVariant: Record<number, string>;
    error: Record<number, string>;
  };
}

/**
 * Parse hex or argb integer into detailed HCT color info.
 */
export function getHctColorInfo(input: string | number): HctColorInfo {
  const argb = typeof input === "string" ? argbFromHex(input) : input;
  const hct = Hct.fromInt(argb);
  const hex = hexFromArgb(argb);
  const r = (argb >> 16) & 0xff;
  const g = (argb >> 8) & 0xff;
  const b = argb & 0xff;

  return {
    hex,
    argb,
    hue: Number(hct.hue.toFixed(2)),
    chroma: Number(hct.chroma.toFixed(2)),
    tone: Number(hct.tone.toFixed(2)),
    rgb: { r, g, b },
  };
}

/**
 * Generate full TonalPalette mapping tone -> hex string.
 */
export function getTonalPaletteMap(
  seed: string | number,
): Record<number, string> {
  const argb = typeof seed === "string" ? argbFromHex(seed) : seed;
  const palette = TonalPalette.fromInt(argb);
  const map: Record<number, string> = {};
  for (const tone of STANDARD_TONES) {
    map[tone] = hexFromArgb(palette.tone(tone));
  }
  return map;
}

/**
 * Instantiate DynamicScheme for a given variant.
 */
export function createDynamicScheme(
  sourceColorHct: Hct,
  variant: SchemeVariant,
  isDark: boolean,
  contrastLevel = 0.0,
): DynamicScheme {
  switch (variant) {
    case "expressive":
      return new SchemeExpressive(sourceColorHct, isDark, contrastLevel);
    case "vibrant":
      return new SchemeVibrant(sourceColorHct, isDark, contrastLevel);
    case "monochrome":
      return new SchemeMonochrome(sourceColorHct, isDark, contrastLevel);
    case "neutral":
      return new SchemeNeutral(sourceColorHct, isDark, contrastLevel);
    case "fidelity":
      return new SchemeFidelity(sourceColorHct, isDark, contrastLevel);
    case "content":
      return new SchemeContent(sourceColorHct, isDark, contrastLevel);
    case "tonal_spot":
    default:
      return new SchemeTonalSpot(sourceColorHct, isDark, contrastLevel);
  }
}

/**
 * Extract M3 color tokens from a DynamicScheme.
 */
export function extractColorScheme(scheme: DynamicScheme): M3ColorScheme {
  return {
    primary: hexFromArgb(scheme.primary),
    onPrimary: hexFromArgb(scheme.onPrimary),
    primaryContainer: hexFromArgb(scheme.primaryContainer),
    onPrimaryContainer: hexFromArgb(scheme.onPrimaryContainer),
    secondary: hexFromArgb(scheme.secondary),
    onSecondary: hexFromArgb(scheme.onSecondary),
    secondaryContainer: hexFromArgb(scheme.secondaryContainer),
    onSecondaryContainer: hexFromArgb(scheme.onSecondaryContainer),
    tertiary: hexFromArgb(scheme.tertiary),
    onTertiary: hexFromArgb(scheme.onTertiary),
    tertiaryContainer: hexFromArgb(scheme.tertiaryContainer),
    onTertiaryContainer: hexFromArgb(scheme.onTertiaryContainer),
    error: hexFromArgb(scheme.error),
    onError: hexFromArgb(scheme.onError),
    errorContainer: hexFromArgb(scheme.errorContainer),
    onErrorContainer: hexFromArgb(scheme.onErrorContainer),
    background: hexFromArgb(scheme.background),
    onBackground: hexFromArgb(scheme.onBackground),
    surface: hexFromArgb(scheme.surface),
    onSurface: hexFromArgb(scheme.onSurface),
    surfaceVariant: hexFromArgb(scheme.surfaceVariant),
    onSurfaceVariant: hexFromArgb(scheme.onSurfaceVariant),
    surfaceContainerLowest: hexFromArgb(scheme.surfaceContainerLowest),
    surfaceContainerLow: hexFromArgb(scheme.surfaceContainerLow),
    surfaceContainer: hexFromArgb(scheme.surfaceContainer),
    surfaceContainerHigh: hexFromArgb(scheme.surfaceContainerHigh),
    surfaceContainerHighest: hexFromArgb(scheme.surfaceContainerHighest),
    outline: hexFromArgb(scheme.outline),
    outlineVariant: hexFromArgb(scheme.outlineVariant),
    shadow: hexFromArgb(scheme.shadow),
    scrim: hexFromArgb(scheme.scrim),
    inverseSurface: hexFromArgb(scheme.inverseSurface),
    inverseOnSurface: hexFromArgb(scheme.inverseOnSurface),
    inversePrimary: hexFromArgb(scheme.inversePrimary),
  };
}

/**
 * Generate complete Material You DynamicTheme (Light & Dark + 6 Tonal Palettes).
 */
export function generateDynamicTheme(
  seed: string | number,
  variant: SchemeVariant = "tonal_spot",
  contrastLevel = 0.0,
): DynamicThemeResult {
  const argb = typeof seed === "string" ? argbFromHex(seed) : seed;
  const hct = Hct.fromInt(argb);
  const hex = hexFromArgb(argb);

  const lightScheme = createDynamicScheme(hct, variant, false, contrastLevel);
  const darkScheme = createDynamicScheme(hct, variant, true, contrastLevel);

  const core = CorePalette.of(argb);
  const buildPaletteMap = (palette: TonalPalette): Record<number, string> => {
    const map: Record<number, string> = {};
    for (const tone of STANDARD_TONES) {
      map[tone] = hexFromArgb(palette.tone(tone));
    }
    return map;
  };

  return {
    seed: hex,
    variant,
    contrastLevel,
    light: extractColorScheme(lightScheme),
    dark: extractColorScheme(darkScheme),
    palettes: {
      primary: buildPaletteMap(core.a1),
      secondary: buildPaletteMap(core.a2),
      tertiary: buildPaletteMap(core.a3),
      neutral: buildPaletteMap(core.n1),
      neutralVariant: buildPaletteMap(core.n2),
      error: buildPaletteMap(core.error),
    },
  };
}

/**
 * Calculate WCAG contrast ratio and HCT tone delta between two colors.
 */
export function calculateContrast(
  foregroundHex: string,
  backgroundHex: string,
): ContrastResult {
  const fgArgb = argbFromHex(foregroundHex);
  const bgArgb = argbFromHex(backgroundHex);

  const fgHct = Hct.fromInt(fgArgb);
  const bgHct = Hct.fromInt(bgArgb);

  const ratio = Contrast.ratioOfTones(fgHct.tone, bgHct.tone);

  const toneDelta = Math.abs(fgHct.tone - bgHct.tone);

  return {
    ratio: Number(ratio.toFixed(2)),
    passAA: ratio >= 4.5,
    passAAA: ratio >= 7.0,
    toneDelta: Number(toneDelta.toFixed(2)),
  };
}

/**
 * Quantize pixel array into ranked seed color hexes using Wu + Celebi quantizers.
 */
export function quantizeImageSeedColors(
  pixels: number[],
  maxColors = 4,
): string[] {
  const celebi = QuantizerCelebi.quantize(pixels, 128);
  const ranked = Score.score(celebi);
  return ranked.slice(0, maxColors).map((argb: number) => hexFromArgb(argb));
}
