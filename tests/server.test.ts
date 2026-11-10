import { describe, expect, test } from "bun:test";
import { server } from "../server.ts";

describe("Google Design Sovereign Mirror Server", () => {
  test("serves homepage with status 200 and valid HTML", async () => {
    const res = await server.fetch(new Request("http://localhost:3030/"));
    expect(res.status).toBe(200);
    const text = await res.text();
    expect(text).toContain("Google Design & Material 3 Sovereign Mirror");
  });

  test("serves /hct with HCT palette calculations", async () => {
    const res = await server.fetch(
      new Request("http://localhost:3030/hct?seed=%234285F4"),
    );
    expect(res.status).toBe(200);
    const text = await res.text();
    expect(text).toContain("Primary Tonal Palette");
  });

  test("serves /tokens multi-surface compiler", async () => {
    const res = await server.fetch(
      new Request("http://localhost:3030/tokens?seed=%234285F4"),
    );
    expect(res.status).toBe(200);
    const text = await res.text();
    expect(text).toContain("Web CSS Custom Properties");
  });

  test("serves /symbols with vector icons", async () => {
    const res = await server.fetch(
      new Request("http://localhost:3030/symbols?q=search"),
    );
    expect(res.status).toBe(200);
    const text = await res.text();
    expect(text).toContain("search");
    expect(text).toContain('viewBox="0 -960 960 960"');
  });

  test("serves /llms.txt AI SEO specification", async () => {
    const res = await server.fetch(
      new Request("http://localhost:3030/llms.txt"),
    );
    expect(res.status).toBe(200);
    const text = await res.text();
    expect(text).toContain("Google Design Sovereign Mirror");
  });

  test("serves /api/tokens JSON endpoint", async () => {
    const res = await server.fetch(
      new Request("http://localhost:3030/api/tokens?seed=%234285F4"),
    );
    expect(res.status).toBe(200);
    const json: any = await res.json();
    expect(json.surfaces).toBeDefined();
    expect(json.surfaces.webCss).toBeDefined();
  });
});
