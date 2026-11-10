import { describe, expect, test } from "bun:test";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { generateBunDesignDocs } from "../src/mdx/bun-docs-generator.ts";

const BUN_DOCS_DESIGN_DIR = "C:\\src\\bun\\docs\\design";

describe("Bun Docs Design MDX Suite", () => {
  test("generates all 6 MDX files with frontmatter and components", async () => {
    const result = await generateBunDesignDocs();
    expect(result.success).toBe(true);
    expect(result.generatedFiles.length).toBe(6);

    const requiredDocs = [
      "index.mdx",
      "hct-color-utils.mdx",
      "tokens-multi-surface.mdx",
      "material-symbols.mdx",
      "stitch-figma-canvas.mdx",
      "web-vitals-lighthouse.mdx",
    ];

    for (const doc of requiredDocs) {
      const fullPath = join(BUN_DOCS_DESIGN_DIR, doc);
      expect(existsSync(fullPath)).toBe(true);

      const content = readFileSync(fullPath, "utf8");
      expect(content).toContain("---");
      expect(content).toContain("title:");
      expect(content).toContain("description:");
    }
  });

  test("validates formatting with bun fmt --check", async () => {
    const proc = Bun.spawn(["bun", "fmt", "--check", BUN_DOCS_DESIGN_DIR], {
      stdout: "pipe",
      stderr: "pipe",
    });
    const exitCode = await proc.exited;
    expect(exitCode).toBe(0);
  });
});
