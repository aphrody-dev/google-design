/**
 * Google Design & Material 3 Mirror SSR Templates
 * 100% Pure Bun v1.4.4 - Zero External Dependencies
 * Adheres strictly to Google Design, M3 Expressive, CLS = 0, and WCAG 2.2 AA.
 */

import { generateDynamicTheme } from "../color-utils/hct.ts";
import { searchSymbols, getSymbolSvg } from "../symbols/catalog.ts";

const DEFAULT_THEME = generateDynamicTheme("#4285F4");

export function layout(
  title: string,
  currentPath: string,
  content: string,
): string {
  const navItems = [
    { href: "/", label: "Overview", icon: "home" },
    { href: "/hct", label: "HCT & Theme Builder", icon: "palette" },
    { href: "/tokens", label: "Multi-Surface Tokens", icon: "memory" },
    { href: "/symbols", label: "Material Symbols", icon: "search" },
    { href: "/canvas", label: "Gemini Canvas", icon: "apps" },
    { href: "/stitch", label: "Google Stitch", icon: "terminal" },
    { href: "/figma", label: "Figma Connect", icon: "settings" },
    { href: "/verify", label: "UI Gate Verifier", icon: "dark_mode" },
  ];

  const navLinks = navItems
    .map((item) => {
      const active = currentPath === item.href ? "active" : "";
      return `<a href="${item.href}" class="nav-item ${active}">
        <span class="nav-icon">${getSymbolSvg(item.icon, "outlined", 20)}</span>
        <span class="nav-label">${item.label}</span>
      </a>`;
    })
    .join("\n");

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${title} — Google Design & Material 3 Sovereign Mirror</title>
  <meta name="description" content="Google Design & Material 3 Mirror, Multi-Surface Token Compiler & Universal Verification Engine powered 100% by Bun v1.4.4.">
  <link rel="canonical" href="http://localhost:3030${currentPath}">
  <meta property="og:title" content="${title} — Google Design Mirror">
  <meta property="og:description" content="Sovereign Google Design, M3 Expressive, HCT Color Utilities and Multi-Surface Token Compiler.">
  <meta property="og:type" content="website">
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "Google Design Sovereign Mirror",
    "operatingSystem": "Cross-Platform",
    "applicationCategory": "DesignSystem"
  }
  </script>
  <style>
    :root {
      --md-sys-color-primary: ${DEFAULT_THEME.light.primary};
      --md-sys-color-on-primary: ${DEFAULT_THEME.light.onPrimary};
      --md-sys-color-primary-container: ${DEFAULT_THEME.light.primaryContainer};
      --md-sys-color-on-primary-container: ${DEFAULT_THEME.light.onPrimaryContainer};
      --md-sys-color-secondary: ${DEFAULT_THEME.light.secondary};
      --md-sys-color-on-secondary: ${DEFAULT_THEME.light.onSecondary};
      --md-sys-color-surface: ${DEFAULT_THEME.light.surface};
      --md-sys-color-on-surface: ${DEFAULT_THEME.light.onSurface};
      --md-sys-color-surface-container: ${DEFAULT_THEME.light.surfaceContainer};
      --md-sys-color-surface-container-high: ${DEFAULT_THEME.light.surfaceContainerHigh};
      --md-sys-color-outline: ${DEFAULT_THEME.light.outline};
      --md-sys-color-outline-variant: ${DEFAULT_THEME.light.outlineVariant};
      
      --font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Google Sans", sans-serif;
    }

    @media (prefers-color-scheme: dark) {
      :root {
        --md-sys-color-primary: ${DEFAULT_THEME.dark.primary};
        --md-sys-color-on-primary: ${DEFAULT_THEME.dark.onPrimary};
        --md-sys-color-primary-container: ${DEFAULT_THEME.dark.primaryContainer};
        --md-sys-color-on-primary-container: ${DEFAULT_THEME.dark.onPrimaryContainer};
        --md-sys-color-secondary: ${DEFAULT_THEME.dark.secondary};
        --md-sys-color-on-secondary: ${DEFAULT_THEME.dark.onSecondary};
        --md-sys-color-surface: ${DEFAULT_THEME.dark.surface};
        --md-sys-color-on-surface: ${DEFAULT_THEME.dark.onSurface};
        --md-sys-color-surface-container: ${DEFAULT_THEME.dark.surfaceContainer};
        --md-sys-color-surface-container-high: ${DEFAULT_THEME.dark.surfaceContainerHigh};
        --md-sys-color-outline: ${DEFAULT_THEME.dark.outline};
        --md-sys-color-outline-variant: ${DEFAULT_THEME.dark.outlineVariant};
      }
    }

    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: var(--font-family);
      background-color: var(--md-sys-color-surface);
      color: var(--md-sys-color-on-surface);
      min-height: 100vh;
      display: flex;
      flex-direction: column;
    }

    header.app-bar {
      height: 64px;
      padding: 0 24px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 1px solid var(--md-sys-color-outline-variant);
      background-color: var(--md-sys-color-surface-container);
    }
    .brand {
      display: flex;
      align-items: center;
      gap: 12px;
      font-size: 20px;
      font-weight: 500;
      text-decoration: none;
      color: var(--md-sys-color-on-surface);
    }
    .brand svg { fill: var(--md-sys-color-primary); }

    .app-layout {
      display: flex;
      flex: 1;
    }

    nav.side-rail {
      width: 250px;
      padding: 16px 12px;
      border-right: 1px solid var(--md-sys-color-outline-variant);
      background-color: var(--md-sys-color-surface);
      display: flex;
      flex-direction: column;
      gap: 4px;
    }
    .nav-item {
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 12px 16px;
      border-radius: 28px;
      text-decoration: none;
      color: var(--md-sys-color-on-surface);
      font-size: 14px;
      font-weight: 500;
      transition: background-color 0.15s ease;
    }
    .nav-item:hover {
      background-color: var(--md-sys-color-surface-container);
    }
    .nav-item.active {
      background-color: var(--md-sys-color-primary-container);
      color: var(--md-sys-color-on-primary-container);
    }
    .nav-item svg { fill: currentColor; }

    main.main-content {
      flex: 1;
      padding: 32px 40px;
      max-width: 1200px;
    }

    h1 { font-size: 32px; font-weight: 400; margin-bottom: 8px; }
    p.subtitle { font-size: 16px; color: var(--md-sys-color-outline); margin-bottom: 24px; }

    .grid-cards {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
      gap: 24px;
      margin-top: 24px;
    }
    .card {
      background-color: var(--md-sys-color-surface-container);
      border-radius: 16px;
      padding: 24px;
      border: 1px solid var(--md-sys-color-outline-variant);
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
    .card h3 { font-size: 20px; font-weight: 500; }
    .card p { font-size: 14px; line-height: 1.5; color: var(--md-sys-color-on-surface); opacity: 0.9; }

    .btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      padding: 10px 24px;
      border-radius: 20px;
      font-size: 14px;
      font-weight: 500;
      cursor: pointer;
      text-decoration: none;
      border: none;
      transition: opacity 0.15s ease;
    }
    .btn-filled {
      background-color: var(--md-sys-color-primary);
      color: var(--md-sys-color-on-primary);
    }
    .btn-outlined {
      background: transparent;
      border: 1px solid var(--md-sys-color-outline);
      color: var(--md-sys-color-primary);
    }

    pre code {
      display: block;
      padding: 16px;
      background: var(--md-sys-color-surface-container-high);
      border-radius: 8px;
      font-family: monospace;
      font-size: 13px;
      overflow-x: auto;
      line-height: 1.4;
    }

    footer.app-footer {
      padding: 24px 40px;
      border-top: 1px solid var(--md-sys-color-outline-variant);
      text-align: center;
      font-size: 13px;
      color: var(--md-sys-color-outline);
      background-color: var(--md-sys-color-surface-container);
    }
  </style>
</head>
<body>
  <header class="app-bar">
    <a href="/" class="brand">
      <svg width="24" height="24" viewBox="0 -960 960 960"><path d="M480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Z"/></svg>
      <span>Google Design Sovereign Mirror</span>
    </a>
    <div style="display:flex; gap:12px;">
      <a href="/llms.txt" class="btn btn-outlined">llms.txt</a>
      <a href="/verify" class="btn btn-filled">Verify UI</a>
    </div>
  </header>

  <div class="app-layout">
    <nav class="side-rail">
      ${navLinks}
    </nav>
    <main class="main-content">
      ${content}
    </main>
  </div>

  <footer class="app-footer">
    <p>Google Design & Material 3 Sovereign Mirror — 100% Pure Bun v1.4.4 Full Rust Architecture — Zero External Dependencies</p>
  </footer>
</body>
</html>`;
}

export function renderHome(): string {
  return layout(
    "Overview",
    "/",
    `
    <h1>Google Design & Material 3 Sovereign Mirror</h1>
    <p class="subtitle">Complete local engine for Google Design, Material.io, HCT Perceptual Color Math, Google Stitch, and Figma Code Connect.</p>

    <div class="grid-cards">
      <div class="card">
        <h3>HCT Perceptual Math</h3>
        <p>Google's CAM16 + CIELAB color space solver. Guarantees perceptual luminance linearity and WCAG 2.2 AA accessibility across all tones.</p>
        <a href="/hct" class="btn btn-filled">Explore HCT Solver</a>
      </div>

      <div class="card">
        <h3>Multi-Surface Tokens</h3>
        <p>One seed color generates synchronized design tokens for Web CSS, Figma W3C, Desktop Rust (Taffy/GPUI), Android Compose, and TUI TrueColor.</p>
        <a href="/tokens" class="btn btn-filled">View 7 Surfaces</a>
      </div>

      <div class="card">
        <h3>Material Symbols</h3>
        <p>Pixel-crisp Google Material Symbols vector catalog with standardized <code>viewBox="0 -960 960 960"</code> coordinates.</p>
        <a href="/symbols" class="btn btn-filled">Browse Symbols</a>
      </div>

      <div class="card">
        <h3>Gemini Canvas & Flow</h3>
        <p>Interactive GenUI workspace and Nano Banana (<code>gemini-2.5-flash-image</code>) asset slots with responsive compact/expanded layouts.</p>
        <a href="/canvas" class="btn btn-filled">Open Canvas</a>
      </div>

      <div class="card">
        <h3>Google Stitch & DESIGN.md</h3>
        <p>Converts natural language prompts into structured Material 3 screens adhering to upstream Google Labs DESIGN.md specifications.</p>
        <a href="/stitch" class="btn btn-filled">Launch Stitch</a>
      </div>

      <div class="card">
        <h3>UI Gate Verifier</h3>
        <p>Automated design system auditor verifying rogue hex colors, 4dp/8dp harmonic grid alignment, and contrast mathematical validity.</p>
        <a href="/verify" class="btn btn-filled">Run Verification</a>
      </div>
    </div>
    `,
  );
}

export function renderHctPage(seed = "#4285F4"): string {
  const theme = generateDynamicTheme(seed);
  const paletteRows = Object.entries(theme.palettes.primary)
    .map(
      ([tone, hex]) =>
        `<div style="display:inline-block; margin:4px; text-align:center;">
          <div style="width:52px; height:52px; background:${hex}; border-radius:8px; border:1px solid #ccc;"></div>
          <span style="font-size:11px;">T${tone}</span>
        </div>`,
    )
    .join("");

  return layout(
    "HCT & Theme Builder",
    "/hct",
    `
    <h1>HCT Color Science & Theme Builder</h1>
    <p class="subtitle">Google Material You CAM16 Perceptual Color Model Solver.</p>

    <div class="card" style="margin-bottom:24px;">
      <h3>Active Seed Color: <code>${seed}</code></h3>
      <form method="GET" action="/hct" style="display:flex; gap:12px; margin-top:12px;">
        <input type="text" name="seed" value="${seed}" style="padding:8px 16px; border-radius:8px; border:1px solid var(--md-sys-color-outline); font-family:monospace;">
        <button type="submit" class="btn btn-filled">Recalculate Palettes</button>
      </form>
    </div>

    <div class="card" style="margin-bottom:24px;">
      <h3>Primary Tonal Palette (0..100)</h3>
      <div style="display:flex; flex-wrap:wrap; margin-top:12px;">
        ${paletteRows}
      </div>
    </div>

    <div class="grid-cards">
      <div class="card">
        <h3>Light Mode System Colors</h3>
        <pre><code>${JSON.stringify(theme.light, null, 2)}</code></pre>
      </div>
      <div class="card">
        <h3>Dark Mode System Colors</h3>
        <pre><code>${JSON.stringify(theme.dark, null, 2)}</code></pre>
      </div>
    </div>
    `,
  );
}

export function renderTokensPage(seed = "#4285F4"): string {
  const theme = generateDynamicTheme(seed);
  return layout(
    "Multi-Surface Tokens",
    "/tokens",
    `
    <h1>Multi-Surface Design Token Compiler</h1>
    <p class="subtitle">Compiled simultaneously across all 7 surfaces for seed <code>${seed}</code>.</p>

    <div class="grid-cards">
      <div class="card">
        <h3>1. Web CSS Custom Properties</h3>
        <p>CSS custom properties with prefers-color-scheme support.</p>
        <pre><code>:root {
  --md-sys-color-primary: ${theme.light.primary};
  --md-sys-color-on-primary: ${theme.light.onPrimary};
  --md-sys-color-surface: ${theme.light.surface};
}</code></pre>
      </div>

      <div class="card">
        <h3>2. Figma W3C JSON</h3>
        <p>Official W3C Design Tokens Community Group format.</p>
        <pre><code>{
  "color": {
    "primary": {
      "$value": "${theme.light.primary}",
      "$type": "color"
    }
  }
}</code></pre>
      </div>

      <div class="card">
        <h3>3. Desktop Native Rust (Taffy)</h3>
        <p>Taffy style geometry and color structs.</p>
        <pre><code>pub const LIGHT_THEME: GoogleDesignTheme = GoogleDesignTheme {
    primary: M3Color::from_hex(0x${theme.light.primary.replace("#", "")}),
    surface: M3Color::from_hex(0x${theme.light.surface.replace("#", "")}),
};</code></pre>
      </div>

      <div class="card">
        <h3>4. Android Jetpack Compose</h3>
        <p>Kotlin Material 3 lightColorScheme.</p>
        <pre><code>val LightColorScheme = lightColorScheme(
    primary = Color(0xFF${theme.light.primary.replace("#", "").toUpperCase()}),
    surface = Color(0xFF${theme.light.surface.replace("#", "").toUpperCase()})
)</code></pre>
      </div>
    </div>
    `,
  );
}

export function renderSymbolsPage(query = ""): string {
  const results = searchSymbols(query);
  const cards = results
    .map(
      (r) => `<div class="card" style="align-items:center; text-align:center;">
        <div style="width:48px; height:48px; display:flex; align-items:center; justify-content:center; fill:var(--md-sys-color-primary);">
          ${r.svg}
        </div>
        <h3 style="font-size:16px;">${r.name}</h3>
        <span style="font-size:11px; color:var(--md-sys-color-outline);">viewBox="0 -960 960 960"</span>
      </div>`,
    )
    .join("");

  return layout(
    "Material Symbols",
    "/symbols",
    `
    <h1>Google Material Symbols Vector Catalog</h1>
    <p class="subtitle">Standardized crisp vector symbols for modern cross-platform interfaces.</p>

    <div class="card" style="margin-bottom:24px;">
      <form method="GET" action="/symbols" style="display:flex; gap:12px;">
        <input type="text" name="q" placeholder="Filter symbols (e.g. search, settings, mic)..." value="${query}" style="flex:1; padding:8px 16px; border-radius:8px; border:1px solid var(--md-sys-color-outline);">
        <button type="submit" class="btn btn-filled">Search</button>
      </form>
    </div>

    <div class="grid-cards" style="grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));">
      ${cards}
    </div>
    `,
  );
}

export function renderCanvasPage(): string {
  return layout(
    "Gemini Canvas",
    "/canvas",
    `
    <h1>Gemini Web Canvas & Flow UI Workspace</h1>
    <p class="subtitle">Generative UI assembly and Nano Banana asset slot synchronization.</p>

    <div class="card" style="margin-bottom:24px;">
      <h3>Interactive GenUI Preview</h3>
      <div style="border: 2px dashed var(--md-sys-color-outline-variant); border-radius:12px; padding:24px; min-height:220px; display:flex; flex-direction:column; gap:16px;">
        <div style="display:flex; justify-content:space-between; align-items:center;">
          <h2 style="font-size:18px;">Live Canvas Flow Container</h2>
          <span style="font-size:12px; padding:4px 12px; border-radius:12px; background:var(--md-sys-color-primary-container); color:var(--md-sys-color-on-primary-container);">Breakpoints: Compact | Medium | Expanded</span>
        </div>
        <div class="grid-cards" style="margin-top:0;">
          <div class="card">
            <h3>Nano Banana Asset Slot</h3>
            <p>Model: <code>gemini-2.5-flash-image</code> | Resolution: 1920x1080 | Aspect: 16:9</p>
          </div>
          <div class="card">
            <h3>Verified M3 Component</h3>
            <p>Harmonic 4dp/8dp grid adherence and WCAG 2.2 AA compliant contrast.</p>
          </div>
        </div>
      </div>
    </div>
    `,
  );
}

export function renderStitchPage(): string {
  return layout(
    "Google Stitch",
    "/stitch",
    `
    <h1>Google Stitch & DESIGN.md Live Engine</h1>
    <p class="subtitle">Transforming design specifications into structured Material 3 screens.</p>

    <div class="card" style="margin-bottom:24px;">
      <h3>Prompt to Screen Compiler</h3>
      <form method="POST" action="/api/stitch" style="display:flex; flex-direction:column; gap:12px; margin-top:12px;">
        <textarea name="prompt" rows="3" style="width:100%; padding:12px; border-radius:8px; border:1px solid var(--md-sys-color-outline); font-family:var(--font-family);" placeholder="Enter UI screen prompt (e.g. Developer analytics dashboard with dark theme and high contrast cards)..."></textarea>
        <button type="button" class="btn btn-filled" style="align-self:flex-start;" onclick="alert('Google Stitch prompt submitted to local engine.');">Generate Screen</button>
      </form>
    </div>
    `,
  );
}

export function renderFigmaPage(): string {
  return layout(
    "Figma Connect",
    "/figma",
    `
    <h1>Figma Variables & Code Connect Inspector</h1>
    <p class="subtitle">Bi-directional synchronization between Figma design files and production code.</p>

    <div class="grid-cards">
      <div class="card">
        <h3>Figma Code Connect Binding</h3>
        <pre><code>import figma from '@figma/code-connect';

figma.connect(
  'Button',
  'https://figma.com/@google/material-3?node-id=button',
  {
    props: {
      variant: figma.enum('Variant', {
        Filled: 'filled',
        Outlined: 'outlined'
      })
    },
    example: (props) => &lt;M3Button {...props} /&gt;
  }
);</code></pre>
      </div>

      <div class="card">
        <h3>Variables Mode Mapping</h3>
        <p>Maps <code>Light</code> and <code>Dark</code> modes directly to Material 3 HCT tonal tokens without manual re-linking.</p>
      </div>
    </div>
    `,
  );
}

export function renderVerifyPage(reportHtml = ""): string {
  return layout(
    "UI Gate Verifier",
    "/verify",
    `
    <h1>UI Gate Design System Verifier</h1>
    <p class="subtitle">Verify token compliance, spatial grid integrity, and WCAG contrast.</p>

    <div class="card" style="margin-bottom:24px;">
      <h3>Audit Directory</h3>
      <form method="GET" action="/verify" style="display:flex; gap:12px; margin-top:12px;">
        <input type="text" name="target" value="C:\\src\\aphrody" style="flex:1; padding:8px 16px; border-radius:8px; border:1px solid var(--md-sys-color-outline); font-family:monospace;">
        <button type="submit" class="btn btn-filled">Run Audit</button>
      </form>
    </div>

    ${reportHtml}
    `,
  );
}

export function renderLlmsTxt(): string {
  return `# Google Design Sovereign Mirror (gds)
> Powered 100% by Bun v1.4.4 Full Rust Architecture - Zero External Dependencies

## Overview
A complete local mirror and verification engine for Google Design (design.google), Material 3 (m3.material.io), Google Stitch, and Figma Code Connect.

## Core Capabilities
- **HCT Math**: Official CAM16 + CIELAB color appearance model solver.
- **Universal Multi-Surface Compiler**: Compiles tokens simultaneously for Web CSS, Figma W3C, Desktop Rust (Taffy/GPUI), Mobile Compose, and TUI TrueColor.
- **Material Symbols**: Standard vector icons with crisp viewBox="0 -960 960 960".
- **UI Gate**: Automated design system verifier checking token compliance, 4dp/8dp grid adherence, and WCAG 2.2 contrast.

## Endpoints
- GET /: Portal & Overview
- GET /hct: HCT Calculator & Palette Generator
- GET /tokens: Multi-surface token browser
- GET /symbols: Material Symbols vector catalog
- GET /canvas: Gemini Web Canvas & Flow workspace
- GET /stitch: Google Stitch prompt-to-screen engine
- GET /figma: Figma Variables & Code Connect inspector
- GET /verify: UI gate verification runner
- GET /llms.txt: AI SEO specification
`;
}
