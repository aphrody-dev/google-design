import { describe, expect, test } from "bun:test";
import {
  formatDesignMd,
  parseDesignMd,
  generateStitchScreen,
} from "../src/stitch/stitch-engine.ts";

describe("Google Stitch & DESIGN.md Live Engine", () => {
  test("formats and parses DESIGN.md markdown faithfully", () => {
    const original = {
      name: "Google Analytics Cloud",
      overview: "Modern high-density data analytics platform.",
      colors: {
        paper: "#ffffff",
        ink: "#202124",
        accent: "#1a73e8",
      },
      typography: {
        headline: "Google Sans 24px",
      },
      spacing: { grid: "8dp", compactMargin: "16dp", expandedMargin: "24dp" },
      components: ["M3TopAppBar", "M3Card"],
      proseGuidelines: ["Consistent 8dp grid spacing."],
    };

    const formatted = formatDesignMd(original);
    expect(formatted).toContain("name: Google Analytics Cloud");
    expect(formatted).toContain("paper: '#ffffff'");

    const parsed = parseDesignMd(formatted);
    expect(parsed.name).toBe("Google Analytics Cloud");
    expect(parsed.colors.paper).toBe("#ffffff");
    expect(parsed.colors.ink).toBe("#202124");
  });

  test("generates valid Stitch UI screen with Nano Banana asset slots", () => {
    const screen = generateStitchScreen("Cloud Monitoring Console");
    expect(screen.id).toBeDefined();
    expect(screen.html).toContain("stitch-scaffold");
    expect(screen.html).toContain("nano-banana-slot");
    expect(screen.componentTree.type).toBe("Scaffold");
  });
});
