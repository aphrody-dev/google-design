/**
 * Universal Multi-Surface Token Compiler — GUI, TUI, Web, Desktop, Mobile
 * 100% Pure Bun v1.4.4 - Zero External Dependencies
 * Compiles verified design tokens simultaneously across all 7 surfaces.
 */

import {
  generateDynamicTheme,
  type DynamicThemeResult,
  type SchemeVariant,
  STANDARD_TONES,
} from "../color-utils/hct.ts";

export interface UniversalTokenBundle {
  seed: string;
  variant: SchemeVariant;
  contrastLevel: number;
  surfaces: {
    webCss: string;
    figmaW3c: Record<string, any>;
    stitchAndCanvas: Record<string, any>;
    desktopRust: {
      taffy: string;
      gpui: string;
      cosmicRon: string;
      fluentParity: string;
    };
    mobile: {
      androidXml: string;
      jetpackCompose: string;
      swiftUi: string;
    };
    tui: {
      ansiEscapes: Record<string, string>;
      rioConfig: string;
      openTuiTheme: Record<string, any>;
    };
  };
}

/**
 * Surface 1: Web CSS Custom Properties
 */
export function exportWebCss(theme: DynamicThemeResult): string {
  const formatTokens = (
    colors: Record<string, string>,
    prefix = "--md-sys-color-",
  ) => {
    return Object.entries(colors)
      .map(([key, val]) => `  ${prefix}${kebabCase(key)}: ${val};`)
      .join("\n");
  };

  const paletteCss = Object.entries(theme.palettes)
    .map(([palName, tones]) => {
      const lines = Object.entries(tones)
        .map(([tone, hex]) => `  --md-ref-palette-${palName}-${tone}: ${hex};`)
        .join("\n");
      return `  /* ${palName.toUpperCase()} PALETTE */\n${lines}`;
    })
    .join("\n\n");

  return `/**
 * Google Material 3 Design Tokens (M3 Expressive)
 * Generated via Bun v1.4.4 - Seed: ${theme.seed} (Variant: ${theme.variant})
 */

:root {
  /* REFERENCE PALETTES */
${paletteCss}

  /* SYSTEM TOKENS - LIGHT */
${formatTokens(theme.light as any)}

  /* TYPOGRAPHY */
  --md-sys-typescale-display-large: 400 57px/64px "Roboto Flex", "Roboto", -apple-system, sans-serif;
  --md-sys-typescale-display-medium: 400 45px/52px "Roboto Flex", "Roboto", -apple-system, sans-serif;
  --md-sys-typescale-display-small: 400 36px/44px "Roboto Flex", "Roboto", -apple-system, sans-serif;
  --md-sys-typescale-headline-large: 400 32px/40px "Roboto Flex", "Roboto", -apple-system, sans-serif;
  --md-sys-typescale-headline-medium: 400 28px/36px "Roboto Flex", "Roboto", -apple-system, sans-serif;
  --md-sys-typescale-headline-small: 400 24px/32px "Roboto Flex", "Roboto", -apple-system, sans-serif;
  --md-sys-typescale-title-large: 400 22px/28px "Roboto Flex", "Roboto", -apple-system, sans-serif;
  --md-sys-typescale-title-medium: 500 16px/24px "Roboto Flex", "Roboto", -apple-system, sans-serif;
  --md-sys-typescale-title-small: 500 14px/20px "Roboto Flex", "Roboto", -apple-system, sans-serif;
  --md-sys-typescale-body-large: 400 16px/24px "Roboto Flex", "Roboto", -apple-system, sans-serif;
  --md-sys-typescale-body-medium: 400 14px/20px "Roboto Flex", "Roboto", -apple-system, sans-serif;
  --md-sys-typescale-body-small: 400 12px/16px "Roboto Flex", "Roboto", -apple-system, sans-serif;
  --md-sys-typescale-label-large: 500 14px/20px "Roboto Flex", "Roboto", -apple-system, sans-serif;
  --md-sys-typescale-label-medium: 500 12px/16px "Roboto Flex", "Roboto", -apple-system, sans-serif;
  --md-sys-typescale-label-small: 500 11px/16px "Roboto Flex", "Roboto", -apple-system, sans-serif;

  /* MOTION */
  --md-sys-motion-duration-short1: 50ms;
  --md-sys-motion-duration-short2: 100ms;
  --md-sys-motion-duration-short3: 150ms;
  --md-sys-motion-duration-short4: 200ms;
  --md-sys-motion-duration-medium1: 250ms;
  --md-sys-motion-duration-medium2: 300ms;
  --md-sys-motion-duration-medium3: 350ms;
  --md-sys-motion-duration-medium4: 400ms;
  --md-sys-motion-duration-long1: 450ms;
  --md-sys-motion-duration-long2: 500ms;
  --md-sys-motion-easing-standard: cubic-bezier(0.2, 0.0, 0, 1.0);
  --md-sys-motion-easing-emphasized: cubic-bezier(0.2, 0.0, 0, 1.0);
  --md-sys-motion-easing-decelerated: cubic-bezier(0.0, 0.0, 0, 1.0);
  --md-sys-motion-easing-accelerated: cubic-bezier(0.3, 0.0, 1, 1.0);

  /* SHAPE & ELEVATION */
  --md-sys-shape-corner-none: 0px;
  --md-sys-shape-corner-extra-small: 4px;
  --md-sys-shape-corner-small: 8px;
  --md-sys-shape-corner-medium: 12px;
  --md-sys-shape-corner-large: 16px;
  --md-sys-shape-corner-extra-large: 28px;
  --md-sys-shape-corner-full: 9999px;

  --md-sys-elevation-level0: none;
  --md-sys-elevation-level1: 0px 1px 2px rgba(0, 0, 0, 0.3), 0px 1px 3px 1px rgba(0, 0, 0, 0.15);
  --md-sys-elevation-level2: 0px 1px 2px rgba(0, 0, 0, 0.3), 0px 2px 6px 2px rgba(0, 0, 0, 0.15);
  --md-sys-elevation-level3: 0px 1px 3px rgba(0, 0, 0, 0.3), 0px 4px 8px 3px rgba(0, 0, 0, 0.15);
  --md-sys-elevation-level4: 0px 2px 3px rgba(0, 0, 0, 0.3), 0px 6px 10px 4px rgba(0, 0, 0, 0.15);
  --md-sys-elevation-level5: 0px 4px 4px rgba(0, 0, 0, 0.3), 0px 8px 12px 6px rgba(0, 0, 0, 0.15);
}

@media (prefers-color-scheme: dark) {
  :root {
${formatTokens(theme.dark as any)}
  }
}

[data-theme="dark"] {
${formatTokens(theme.dark as any)}
}
`;
}

/**
 * Surface 2: Figma W3C Design Tokens & Code Connect Schema
 */
export function exportFigmaW3cTokens(
  theme: DynamicThemeResult,
): Record<string, any> {
  const wrapTokens = (obj: Record<string, string>, type: string) => {
    const res: Record<string, any> = {};
    for (const [k, v] of Object.entries(obj)) {
      res[kebabCase(k)] = {
        $value: v,
        $type: type,
        $description: `Material 3 ${kebabCase(k)} color token`,
      };
    }
    return res;
  };

  return {
    $schema: "https://design-tokens.github.io/community-group/format/",
    name: "Google Material 3 Sovereign Design Tokens",
    version: "1.0.0",
    meta: {
      seed: theme.seed,
      variant: theme.variant,
      contrastLevel: theme.contrastLevel,
      generatedBy: "google-design-gds v1.0.0 (Bun v1.4.4)",
    },
    color: {
      light: wrapTokens(theme.light as any, "color"),
      dark: wrapTokens(theme.dark as any, "color"),
      palettes: Object.fromEntries(
        Object.entries(theme.palettes).map(([name, tones]) => [
          name,
          Object.fromEntries(
            Object.entries(tones).map(([tone, hex]) => [
              `tone-${tone}`,
              { $value: hex, $type: "color" },
            ]),
          ),
        ]),
      ),
    },
    codeConnect: {
      components: {
        Button: {
          figmaNodeUrl: "https://figma.com/@google/material-3?node-id=button",
          import:
            "import { MdFilledButton, MdOutlinedButton } from '@material/web/button/filled-button.js';",
          props: {
            variant: {
              filled: "<md-filled-button>{label}</md-filled-button>",
              outlined: "<md-outlined-button>{label}</md-outlined-button>",
              elevated: "<md-elevated-button>{label}</md-elevated-button>",
              tonal: "<md-filled-tonal-button>{label}</md-filled-tonal-button>",
              text: "<md-text-button>{label}</md-text-button>",
            },
          },
        },
        Card: {
          figmaNodeUrl: "https://figma.com/@google/material-3?node-id=card",
          import:
            "import { MdElevatedCard, MdOutlinedCard } from '@material/web/labs/card/elevated-card.js';",
          props: {
            variant: {
              elevated: "<md-elevated-card>{children}</md-elevated-card>",
              filled: "<md-filled-card>{children}</md-filled-card>",
              outlined: "<md-outlined-card>{children}</md-outlined-card>",
            },
          },
        },
      },
    },
  };
}

/**
 * Surface 3: Google Stitch & Gemini Web Canvas / Flow UI Schema
 */
export function exportStitchAndCanvasSchema(
  theme: DynamicThemeResult,
): Record<string, any> {
  return {
    stitchSchemaVersion: "1.0.0",
    spec: "google-labs/stitch-ui",
    canvasType: "gemini-web-canvas-flow",
    meta: {
      seed: theme.seed,
      variant: theme.variant,
      themeColors: {
        primary: theme.light.primary,
        surface: theme.light.surface,
        onSurface: theme.light.onSurface,
        surfaceContainer: theme.light.surfaceContainer,
      },
    },
    breakpoints: {
      compact: { maxDp: 599, columns: 4, marginDp: 16, gutterDp: 16 },
      medium: {
        minDp: 600,
        maxDp: 839,
        columns: 8,
        marginDp: 24,
        gutterDp: 24,
      },
      expanded: { minDp: 840, columns: 12, marginDp: 24, gutterDp: 24 },
    },
    nanoBananaAssetSlots: [
      {
        id: "hero-banner",
        model: "gemini-2.5-flash-image",
        aspectRatio: "16:9",
        resolution: "1920x1080",
        colorAffinity: theme.light.primary,
        purpose: "Hero background visualization with M3 color tonal harmony",
      },
      {
        id: "avatar-thumbnail",
        model: "gemini-2.5-flash-image",
        aspectRatio: "1:1",
        resolution: "512x512",
        colorAffinity: theme.light.secondary,
        purpose: "User profile avatar or entity badge",
      },
    ],
    componentTreeTemplate: {
      root: "AppScaffold",
      navigation: {
        compact: "NavigationBar",
        medium: "NavigationRail",
        expanded: "NavigationDrawer",
      },
      contentArea: {
        topAppBar: {
          variant: "centerAligned",
          title: "Google Sovereign Design Mirror",
          actions: ["search", "palette", "settings"],
        },
        body: "FlowGrid",
      },
    },
  };
}

/**
 * Surface 4: Desktop Native Rust (Taffy, GPUI, COSMIC RON, WinUI Fluent 2)
 */
export function exportDesktopRustTokens(theme: DynamicThemeResult): {
  taffy: string;
  gpui: string;
  cosmicRon: string;
  fluentParity: string;
} {
  const taffy = `//! Taffy Style & Color Definitions for Google Design System
//! Generated via Bun v1.4.4 - Seed: ${theme.seed}

use taffy::prelude::*;

#[derive(Clone, Copy, Debug, PartialEq)]
pub struct M3Color {
    pub r: u8,
    pub g: u8,
    pub b: u8,
    pub a: u8,
}

impl M3Color {
    pub const fn from_hex(hex: u32) -> Self {
        Self {
            r: ((hex >> 16) & 0xff) as u8,
            g: ((hex >> 8) & 0xff) as u8,
            b: (hex & 0xff) as u8,
            a: 255,
        }
    }
}

pub struct GoogleDesignTheme {
    pub primary: M3Color,
    pub on_primary: M3Color,
    pub primary_container: M3Color,
    pub on_primary_container: M3Color,
    pub surface: M3Color,
    pub on_surface: M3Color,
    pub surface_container: M3Color,
    pub outline: M3Color,
}

pub const LIGHT_THEME: GoogleDesignTheme = GoogleDesignTheme {
    primary: M3Color::from_hex(0x${theme.light.primary.replace("#", "")}),
    on_primary: M3Color::from_hex(0x${theme.light.onPrimary.replace("#", "")}),
    primary_container: M3Color::from_hex(0x${theme.light.primaryContainer.replace("#", "")}),
    on_primary_container: M3Color::from_hex(0x${theme.light.onPrimaryContainer.replace("#", "")}),
    surface: M3Color::from_hex(0x${theme.light.surface.replace("#", "")}),
    on_surface: M3Color::from_hex(0x${theme.light.onSurface.replace("#", "")}),
    surface_container: M3Color::from_hex(0x${theme.light.surfaceContainer.replace("#", "")}),
    outline: M3Color::from_hex(0x${theme.light.outline.replace("#", "")}),
};

pub const DARK_THEME: GoogleDesignTheme = GoogleDesignTheme {
    primary: M3Color::from_hex(0x${theme.dark.primary.replace("#", "")}),
    on_primary: M3Color::from_hex(0x${theme.dark.onPrimary.replace("#", "")}),
    primary_container: M3Color::from_hex(0x${theme.dark.primaryContainer.replace("#", "")}),
    on_primary_container: M3Color::from_hex(0x${theme.dark.onPrimaryContainer.replace("#", "")}),
    surface: M3Color::from_hex(0x${theme.dark.surface.replace("#", "")}),
    on_surface: M3Color::from_hex(0x${theme.dark.onSurface.replace("#", "")}),
    surface_container: M3Color::from_hex(0x${theme.dark.surfaceContainer.replace("#", "")}),
    outline: M3Color::from_hex(0x${theme.dark.outline.replace("#", "")}),
};

pub fn standard_button_style() -> Style {
    Style {
        size: Size {
            width: Dimension::Auto,
            height: length(40.0),
        },
        padding: Rect {
            left: length(24.0),
            right: length(24.0),
            top: length(10.0),
            bottom: length(10.0),
        },
        align_items: Some(AlignItems::Center),
        justify_content: Some(JustifyContent::Center),
        ..Default::default()
    }
}
`;

  const gpui = `// GPUI Theme Definition for Zed Parity
// Seed: ${theme.seed}

pub fn google_design_gpui_theme() -> gpui::Theme {
    gpui::Theme {
        mode: gpui::ThemeMode::Dark,
        accent: gpui::rgb(0x${theme.dark.primary.replace("#", "")}),
        background: gpui::rgb(0x${theme.dark.surface.replace("#", "")}),
        foreground: gpui::rgb(0x${theme.dark.onSurface.replace("#", "")}),
        border: gpui::rgb(0x${theme.dark.outline.replace("#", "")}),
        elevated_surface: gpui::rgb(0x${theme.dark.surfaceContainer.replace("#", "")}),
    }
}
`;

  const cosmicRon = `// System76 COSMIC Desktop RON Theme Parity
(
    name: "Google Material 3 Sovereign",
    accent: "${theme.dark.primary}",
    bg_color: "${theme.dark.surface}",
    text_color: "${theme.dark.onSurface}",
    container_bg: "${theme.dark.surfaceContainer}",
    border_color: "${theme.dark.outline}",
    corner_radius: 12,
)
`;

  const fluentParity = `<!-- Microsoft WinUI 3 / Fluent 2 Parity ResourceDictionary -->
<ResourceDictionary
    xmlns="http://schemas.microsoft.com/winfx/2006/xaml/presentation"
    xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml">
    <Color x:Key="SystemAccentColor">${theme.light.primary}</Color>
    <Color x:Key="SystemAccentColorLight">${theme.dark.primary}</Color>
    <Color x:Key="SolidBackgroundFillColorBase">${theme.light.surface}</Color>
    <Color x:Key="TextFillColorPrimary">${theme.light.onSurface}</Color>
</ResourceDictionary>
`;

  return { taffy, gpui, cosmicRon, fluentParity };
}

/**
 * Surface 5: Mobile (Android Compose, Android XML, SwiftUI)
 */
export function exportMobileTokens(theme: DynamicThemeResult): {
  androidXml: string;
  jetpackCompose: string;
  swiftUi: string;
} {
  const xmlColors = Object.entries(theme.light)
    .map(
      ([key, hex]) =>
        `    <color name="md_theme_light_${snakeCase(key)}">${hex}</color>\n    <color name="md_theme_dark_${snakeCase(key)}">${(theme.dark as any)[key]}</color>`,
    )
    .join("\n");

  const androidXml = `<?xml version="1.0" encoding="utf-8"?>
<!-- Generated via Bun v1.4.4 - Google Material You Color Tokens -->
<resources>
${xmlColors}
</resources>
`;

  const jetpackCompose = `// Jetpack Compose Material 3 Dynamic Color Palette
// Seed: ${theme.seed} (Variant: ${theme.variant})

package com.google.design.theme

import androidx.compose.material3.darkColorScheme
import androidx.compose.material3.lightColorScheme
import androidx.compose.ui.graphics.Color

val LightColorScheme = lightColorScheme(
    primary = Color(0xFF${theme.light.primary.replace("#", "").toUpperCase()}),
    onPrimary = Color(0xFF${theme.light.onPrimary.replace("#", "").toUpperCase()}),
    primaryContainer = Color(0xFF${theme.light.primaryContainer.replace("#", "").toUpperCase()}),
    onPrimaryContainer = Color(0xFF${theme.light.onPrimaryContainer.replace("#", "").toUpperCase()}),
    secondary = Color(0xFF${theme.light.secondary.replace("#", "").toUpperCase()}),
    onSecondary = Color(0xFF${theme.light.onSecondary.replace("#", "").toUpperCase()}),
    surface = Color(0xFF${theme.light.surface.replace("#", "").toUpperCase()}),
    onSurface = Color(0xFF${theme.light.onSurface.replace("#", "").toUpperCase()}),
    outline = Color(0xFF${theme.light.outline.replace("#", "").toUpperCase()})
)

val DarkColorScheme = darkColorScheme(
    primary = Color(0xFF${theme.dark.primary.replace("#", "").toUpperCase()}),
    onPrimary = Color(0xFF${theme.dark.onPrimary.replace("#", "").toUpperCase()}),
    primaryContainer = Color(0xFF${theme.dark.primaryContainer.replace("#", "").toUpperCase()}),
    onPrimaryContainer = Color(0xFF${theme.dark.onPrimaryContainer.replace("#", "").toUpperCase()}),
    secondary = Color(0xFF${theme.dark.secondary.replace("#", "").toUpperCase()}),
    onSecondary = Color(0xFF${theme.dark.onSecondary.replace("#", "").toUpperCase()}),
    surface = Color(0xFF${theme.dark.surface.replace("#", "").toUpperCase()}),
    onSurface = Color(0xFF${theme.dark.onSurface.replace("#", "").toUpperCase()}),
    outline = Color(0xFF${theme.dark.outline.replace("#", "").toUpperCase()})
)
`;

  const swiftUi = `// Apple SwiftUI Adaptive Theme Parity
import SwiftUI

public extension Color {
    static let mdPrimary = Color(red: ${(parseInt(theme.light.primary.slice(1, 3), 16) / 255).toFixed(3)}, green: ${(parseInt(theme.light.primary.slice(3, 5), 16) / 255).toFixed(3)}, blue: ${(parseInt(theme.light.primary.slice(5, 7), 16) / 255).toFixed(3)})
    static let mdSurface = Color(red: ${(parseInt(theme.light.surface.slice(1, 3), 16) / 255).toFixed(3)}, green: ${(parseInt(theme.light.surface.slice(3, 5), 16) / 255).toFixed(3)}, blue: ${(parseInt(theme.light.surface.slice(5, 7), 16) / 255).toFixed(3)})
    static let mdOnSurface = Color(red: ${(parseInt(theme.light.onSurface.slice(1, 3), 16) / 255).toFixed(3)}, green: ${(parseInt(theme.light.onSurface.slice(3, 5), 16) / 255).toFixed(3)}, blue: ${(parseInt(theme.light.onSurface.slice(5, 7), 16) / 255).toFixed(3)})
}
`;

  return { androidXml, jetpackCompose, swiftUi };
}

/**
 * Surface 6: TUI (OpenTUI, Rio Terminal, 24-bit TrueColor ANSI escapes)
 */
export function exportTuiTokens(theme: DynamicThemeResult): {
  ansiEscapes: Record<string, string>;
  rioConfig: string;
  openTuiTheme: Record<string, any>;
} {
  const hexToAnsi = (hex: string, isBg = false) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `\x1b[${isBg ? "48" : "38"};2;${r};${g};${b}m`;
  };

  const ansiEscapes: Record<string, string> = {
    primaryFg: hexToAnsi(theme.dark.primary, false),
    primaryBg: hexToAnsi(theme.dark.primary, true),
    surfaceFg: hexToAnsi(theme.dark.surface, false),
    surfaceBg: hexToAnsi(theme.dark.surface, true),
    onSurfaceFg: hexToAnsi(theme.dark.onSurface, false),
    surfaceContainerBg: hexToAnsi(theme.dark.surfaceContainer, true),
    outlineFg: hexToAnsi(theme.dark.outline, false),
    reset: "\x1b[0m",
  };

  const rioConfig = `# Rio Terminal Configuration (Google Design Parity)
[colors]
background = "${theme.dark.surface}"
foreground = "${theme.dark.onSurface}"
cursor = "${theme.dark.primary}"
selection-background = "${theme.dark.primaryContainer}"
selection-foreground = "${theme.dark.onPrimaryContainer}"

[colors.normal]
black = "${theme.dark.surfaceContainerLowest}"
red = "${theme.dark.error}"
green = "${theme.dark.tertiary}"
yellow = "#F4B400"
blue = "${theme.dark.primary}"
magenta = "${theme.dark.secondary}"
cyan = "#00ACC1"
white = "${theme.dark.onSurface}"
`;

  const openTuiTheme = {
    name: "Google Material 3 TUI",
    version: "1.0.0",
    glyphs: {
      cornerTopLeft: "╭",
      cornerTopRight: "╮",
      cornerBottomLeft: "╰",
      cornerBottomRight: "╯",
      horizontal: "─",
      vertical: "│",
      search: "/",
      palette: "#",
      settings: "*",
      terminal: ">_",
    },
    colors: {
      primary: theme.dark.primary,
      onPrimary: theme.dark.onPrimary,
      surface: theme.dark.surface,
      onSurface: theme.dark.onSurface,
      surfaceContainer: theme.dark.surfaceContainer,
      outline: theme.dark.outline,
    },
  };

  return { ansiEscapes, rioConfig, openTuiTheme };
}

/**
 * Universal Multi-Surface Compiler entrypoint
 */
export function compileUniversalTokens(
  seed: string | number,
  variant: SchemeVariant = "tonal_spot",
  contrastLevel = 0.0,
): UniversalTokenBundle {
  const theme = generateDynamicTheme(seed, variant, contrastLevel);

  return {
    seed: theme.seed,
    variant: theme.variant,
    contrastLevel: theme.contrastLevel,
    surfaces: {
      webCss: exportWebCss(theme),
      figmaW3c: exportFigmaW3cTokens(theme),
      stitchAndCanvas: exportStitchAndCanvasSchema(theme),
      desktopRust: exportDesktopRustTokens(theme),
      mobile: exportMobileTokens(theme),
      tui: exportTuiTokens(theme),
    },
  };
}

function kebabCase(str: string): string {
  return str.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`);
}

function snakeCase(str: string): string {
  return str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
}
