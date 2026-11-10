import { describe, expect, test } from "bun:test";
import { verifyTarget } from "../src/verifier/ui-gate.ts";

describe("UI Gate Design System Verifier", () => {
  test("audits google-design and passes with high compliance score", () => {
    const report = verifyTarget(import.meta.dir + "/..");
    expect(report.scannedFilesCount).toBeGreaterThan(5);
    expect(report.score).toBeGreaterThanOrEqual(75);
    expect(report.passed).toBe(true);
    expect(report.metrics.contrastComplianceRate).toBe(1.0);
  });
});
