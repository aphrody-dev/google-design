/**
 * Google Design & Material 3 Sovereign Mirror Server
 * 100% Pure Bun v1.4.4 - Zero External Dependencies
 * Full-recon local mirror of design.google, m3.material.io, Stitch & Figma Connect.
 */

import {
  renderHome,
  renderHctPage,
  renderTokensPage,
  renderSymbolsPage,
  renderCanvasPage,
  renderStitchPage,
  renderFigmaPage,
  renderVerifyPage,
  renderLlmsTxt,
} from "./src/web/templates.ts";
import {
  generateDynamicTheme,
  getHctColorInfo,
} from "./src/color-utils/hct.ts";
import { compileUniversalTokens } from "./src/theme-builder/exporter.ts";
import { searchSymbols } from "./src/symbols/catalog.ts";
import { generateStitchScreen } from "./src/stitch/stitch-engine.ts";
import { verifyTarget } from "./src/verifier/ui-gate.ts";
import { createDefaultCanvasWorkspace } from "./src/canvas/canvas-engine.ts";

const port = Number(process.env.PORT || 3030);

export const server = Bun.serve({
  port,
  async fetch(req) {
    const url = new URL(req.url);
    const pathname = url.pathname;

    const headers = {
      "Content-Type": "text/html; charset=utf-8",
      "X-Content-Type-Options": "nosniff",
      "X-Frame-Options": "DENY",
      "Cache-Control": "public, max-age=3600",
    };

    // UI Routes
    if (pathname === "/") {
      return new Response(renderHome(), { headers });
    }

    if (pathname === "/hct") {
      const seed = url.searchParams.get("seed") || "#4285F4";
      return new Response(renderHctPage(seed), { headers });
    }

    if (pathname === "/tokens") {
      const seed = url.searchParams.get("seed") || "#4285F4";
      return new Response(renderTokensPage(seed), { headers });
    }

    if (pathname === "/symbols") {
      const q = url.searchParams.get("q") || "";
      return new Response(renderSymbolsPage(q), { headers });
    }

    if (pathname === "/canvas") {
      return new Response(renderCanvasPage(), { headers });
    }

    if (pathname === "/stitch") {
      return new Response(renderStitchPage(), { headers });
    }

    if (pathname === "/figma") {
      return new Response(renderFigmaPage(), { headers });
    }

    if (pathname === "/verify") {
      const target = url.searchParams.get("target");
      let reportHtml = "";
      if (target) {
        try {
          const report = verifyTarget(target);
          reportHtml = `
            <div class="card" style="margin-top:24px;">
              <h3>Audit Results for <code>${report.targetPath}</code></h3>
              <p>Score: <strong>${report.score}/100</strong> (${report.passed ? "PASSED" : "ACTION REQUIRED"})</p>
              <p>Files Scanned: ${report.scannedFilesCount} | Issues: ${report.issues.length}</p>
              <pre><code>${JSON.stringify(report.metrics, null, 2)}</code></pre>
            </div>
          `;
        } catch (err: any) {
          reportHtml = `<div class="card" style="color:var(--md-sys-color-error);"><p>Error: ${err.message}</p></div>`;
        }
      }
      return new Response(renderVerifyPage(reportHtml), { headers });
    }

    if (pathname === "/llms.txt") {
      return new Response(renderLlmsTxt(), {
        headers: { "Content-Type": "text/plain; charset=utf-8" },
      });
    }

    // JSON API Endpoints
    const jsonHeaders = {
      "Content-Type": "application/json; charset=utf-8",
      "Access-Control-Allow-Origin": "*",
    };

    if (pathname === "/api/hct") {
      const seed = url.searchParams.get("seed") || "#4285F4";
      const info = getHctColorInfo(seed);
      const theme = generateDynamicTheme(seed);
      return new Response(JSON.stringify({ info, theme }), {
        headers: jsonHeaders,
      });
    }

    if (pathname === "/api/tokens") {
      const seed = url.searchParams.get("seed") || "#4285F4";
      const bundle = compileUniversalTokens(seed);
      return new Response(JSON.stringify(bundle), { headers: jsonHeaders });
    }

    if (pathname === "/api/symbols") {
      const q = url.searchParams.get("q") || "";
      return new Response(JSON.stringify(searchSymbols(q)), {
        headers: jsonHeaders,
      });
    }

    if (pathname === "/api/stitch") {
      if (req.method === "POST") {
        const body = await req.json().catch(() => ({}));
        const prompt = body.prompt || "Design System Dashboard";
        const seed = body.seed || "#4285F4";
        return new Response(
          JSON.stringify(generateStitchScreen(prompt, seed)),
          {
            headers: jsonHeaders,
          },
        );
      }
      return new Response(
        JSON.stringify(generateStitchScreen("Default Screen")),
        {
          headers: jsonHeaders,
        },
      );
    }

    if (pathname === "/api/verify") {
      const target = url.searchParams.get("target") || "C:\\src\\google-design";
      const report = verifyTarget(target);
      return new Response(JSON.stringify(report), { headers: jsonHeaders });
    }

    if (pathname === "/api/canvas") {
      return new Response(JSON.stringify(createDefaultCanvasWorkspace()), {
        headers: jsonHeaders,
      });
    }

    return new Response("Not Found", { status: 404 });
  },
});

console.log(
  `Google Design Sovereign Mirror listening on http://localhost:${server.port}`,
);
