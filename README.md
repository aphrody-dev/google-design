# Google Design Sovereign Mirror & UI Gate (`gds`)

Complete local mirror, HCT perceptual color engine, universal multi-surface token compiler, and UI gate verification engine for Google Design (`design.google`), Material Design 3 (`m3.material.io`), Google Stitch, Figma Code Connect, and Gemini Web Canvas.

Built with 100% pure **Bun v1.4.4 Full Rust Architecture** with strictly **zero external npm dependencies**.

---

## Capabilities

1. **Exact CAM16 + CIELAB -> HCT Color Science**:
   - Perceptual color space math based directly on Google's `material-foundation/material-color-utilities`.
   - Full tonal palettes (`0, 4, 6, 10, 12, 17, 20, 22, 24, 30, 40, 50, 60, 70, 80, 87, 90, 92, 94, 95, 96, 98, 99, 100`).
   - DynamicScheme generation across TonalSpot, Expressive, Vibrant, Monochrome, and Neutral variants.
   - Mathematical WCAG 2.2 AA / AAA contrast solver and image seed color quantizer.

2. **Universal Multi-Surface Token Compiler (7 Surfaces)**:
   - **Web CSS**: `--md-sys-color-*`, `--md-sys-typescale-*`, `--md-sys-motion-*`, `--md-sys-shape-*`, `--md-sys-elevation-*`.
   - **Figma W3C Tokens**: `$value`, `$type`, Collections schema, and Code Connect contracts.
   - **Stitch & Gemini Canvas**: Interactive UI tree, responsive breakpoints (Compact, Medium, Expanded), and Nano Banana (`gemini-2.5-flash-image`) asset slots.
   - **Desktop Rust**: `taffy::google_design` styles, Zed `GPUI` themes, System76 `COSMIC` RON, and Microsoft WinUI 3 `Fluent 2` parity.
   - **Mobile**: Android Material You `colors.xml`, Jetpack Compose `lightColorScheme`, and Apple SwiftUI `Color` extensions.
   - **TUI**: 24-bit TrueColor ANSI escape sequences, Rio terminal config, and OpenTUI Unicode glyph themes.

3. **Automated UI Gate Verifier (`gds verify`)**:
   - Scans web, mobile, desktop, and UI codebases against Material 3 token rules.
   - Flags rogue hardcoded hex colors outside the HCT tonal system.
   - Audits 4dp/8dp harmonic grid compliance for margins, paddings, and layout gaps.
   - Verifies crisp Material Symbols vector SVG coordinates (`viewBox="0 -960 960 960"`).
   - Validates WCAG 2.2 contrast ratios and tone delta mathematically.

4. **Automated MDX Generator for Bun Docs (`gds mdx`)**:
   - Compiles full documentation directly into `C:\src\bun\docs\design\`.
   - Formatted natively via `bun fmt`.

5. **Full-Recon Local Mirror Web Server (`server.ts`)**:
   - Routes: `/`, `/hct`, `/tokens`, `/symbols`, `/canvas`, `/stitch`, `/figma`, `/verify`, `/llms.txt`.
   - JSON API: `/api/hct`, `/api/tokens`, `/api/symbols`, `/api/stitch`, `/api/verify`, `/api/canvas`.
   - Enforces zero layout shift (`CLS = 0`) and high performance.

---

## 3-Letter CLI Usage (`gds`)

```bash
# Display help and available commands
gds help

# Start the local mirror server
gds serve --port 3030

# Run UI Gate verification on any target directory
gds verify C:\src\google-design
gds verify C:\src\aphrody

# Analyze any color in CAM16 / HCT perceptual space
gds hct 4285F4
gds hct EA4335

# Compile universal multi-surface tokens from a seed color
gds tokens --seed "#4285F4" --out ./tokens

# Search crisp Material Symbols
gds symbols search

# Generate structured Material 3 screens from prompts
gds stitch "Developer analytics dashboard"

# Re-generate and format Bun docs MDX suite
gds mdx
```

---

## Upstream Sovereign Repositories (`upstream/`)

The following upstream repositories are tracked locally with minimal byte footprints (`--depth=1 --filter=blob:none` and sparse checkouts):

- `material-foundation/material-color-utilities`
- `material-foundation/material-theme-builder`
- `material-foundation/material-tokens`
- `material-components/material-web`
- `google/material-design-icons` (sparse checkout of core symbols, variablefont, README)
- `figma/code-connect`
- `figma/plugin-typings`
- `google-labs-code/stitch-sdk`
- `google-labs-code/stitch-skills`
- `google-labs-code/design.md`
