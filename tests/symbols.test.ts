import { describe, expect, test } from "bun:test";
import {
  listAvailableSymbols,
  getSymbolSvg,
  searchSymbols,
} from "../src/symbols/catalog.ts";

describe("Material Symbols Vector Catalog", () => {
  test("lists all sparse-checked-out symbols", () => {
    const list = listAvailableSymbols();
    expect(list.length).toBeGreaterThanOrEqual(10);
    expect(list).toContain("search");
    expect(list).toContain("home");
    expect(list).toContain("settings");
    expect(list).toContain("palette");
  });

  test("retrieves crisp vector SVG with standard 0 -960 960 960 viewBox", () => {
    const svg = getSymbolSvg("search", "outlined", 24);
    expect(svg).toContain('viewBox="0 -960 960 960"');
    expect(svg).toContain("<path");
  });

  test("searches symbols by query substring", () => {
    const results = searchSymbols("set");
    expect(results.length).toBe(1);
    expect(results[0].name).toBe("settings");
    expect(results[0].svg).toContain('viewBox="0 -960 960 960"');
  });
});
