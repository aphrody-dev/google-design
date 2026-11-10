import { describe, expect, test } from "bun:test";
import { compileUniversalTokens } from "../src/theme-builder/exporter.ts";

describe("Universal Multi-Surface Token Compiler", () => {
  test("compiles tokens simultaneously across all 7 surfaces", () => {
    const bundle = compileUniversalTokens("#4285F4");
    expect(bundle.seed).toBe("#4285f4");
    expect(bundle.surfaces.webCss).toContain("--md-sys-color-primary");
    expect(bundle.surfaces.webCss).toContain(
      "--md-sys-typescale-display-large",
    );
    expect(bundle.surfaces.figmaW3c.$schema).toContain(
      "design-tokens.github.io",
    );
    expect(bundle.surfaces.figmaW3c.codeConnect).toBeDefined();
    expect(bundle.surfaces.stitchAndCanvas.canvasType).toBe(
      "gemini-web-canvas-flow",
    );
    expect(
      bundle.surfaces.stitchAndCanvas.nanoBananaAssetSlots.length,
    ).toBeGreaterThan(0);
    expect(bundle.surfaces.desktopRust.taffy).toContain("taffy::prelude");
    expect(bundle.surfaces.desktopRust.gpui).toContain("gpui::Theme");
    expect(bundle.surfaces.desktopRust.cosmicRon).toContain("accent");
    expect(bundle.surfaces.desktopRust.fluentParity).toContain(
      "SystemAccentColor",
    );
    expect(bundle.surfaces.mobile.androidXml).toContain("<resources>");
    expect(bundle.surfaces.mobile.jetpackCompose).toContain("lightColorScheme");
    expect(bundle.surfaces.mobile.swiftUi).toContain("mdPrimary");
    expect(bundle.surfaces.tui.ansiEscapes.primaryFg).toBeDefined();
    expect(bundle.surfaces.tui.rioConfig).toContain("[colors]");
    expect(bundle.surfaces.tui.openTuiTheme.glyphs).toBeDefined();
  });
});
