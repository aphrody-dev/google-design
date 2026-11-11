/**
 * Sovereign 27-Theme Stylesheet & W3C Token Compiler
 * 100% Pure Bun v1.4.4 - Zero External Dependencies
 *
 * Includes:
 * - All 23 canonical Omarchy workstation palettes (parsed live from C:\src\third_party\omacom\omarchy\themes\*\colors.toml
 *   with an embedded standalone fallback table so compiled gds.exe runs anywhere with zero external files!)
 * - CachyOS Emerald Dark
 * - Aphrody Google M3 Light & Dark (CAM16/HCT)
 * - Microsoft Fluent 2 Mica Slate
 */

import {
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  writeFileSync,
} from "node:fs";
import { join } from "node:path";

export interface SovereignThemePalette {
  id: string;
  name: string;
  family: "omarchy" | "cachyos" | "google-m3" | "fluent-2";
  mode: "light" | "dark";
  accent: string;
  selection: string;
  muted: string;
  background: string;
  darkBackground: string;
  darkerBackground: string;
  lighterBackground: string;
  foreground: string;
  darkForeground: string;
  lightForeground: string;
  brightForeground: string;
  red: string;
  yellow: string;
  orange: string;
  green: string;
  cyan: string;
  blue: string;
  magenta: string;
}

const CANONICAL_OMARCHY_FALLBACKS: SovereignThemePalette[] = [
  {
    id: "catppuccin",
    name: "Omarchy Catppuccin Mocha",
    family: "omarchy",
    mode: "dark",
    accent: "#89b4fa",
    selection: "#45475a",
    muted: "#585b70",
    background: "#1e1e2e",
    darkBackground: "#161622",
    darkerBackground: "#101019",
    lighterBackground: "#313244",
    foreground: "#cdd6f4",
    darkForeground: "#6c7086",
    lightForeground: "#bac2de",
    brightForeground: "#cdd6f4",
    red: "#f38ba8",
    yellow: "#f9e2af",
    orange: "#f6b6ab",
    green: "#a6e3a1",
    cyan: "#94e2d5",
    blue: "#89b4fa",
    magenta: "#f5c2e7",
  },
  {
    id: "catppuccin-latte",
    name: "Omarchy Catppuccin Latte",
    family: "omarchy",
    mode: "light",
    accent: "#1e66f5",
    selection: "#ccd0da",
    muted: "#acb0be",
    background: "#eff1f5",
    darkBackground: "#e3e4e8",
    darkerBackground: "#d7d8dc",
    lighterBackground: "#dce0e8",
    foreground: "#4c4f69",
    darkForeground: "#9ca0b0",
    lightForeground: "#5c5f77",
    brightForeground: "#4c4f69",
    red: "#d20f39",
    yellow: "#df8e1d",
    orange: "#d84e2b",
    green: "#40a02b",
    cyan: "#179299",
    blue: "#1e66f5",
    magenta: "#ea76cb",
  },
  {
    id: "ethereal",
    name: "Omarchy Ethereal",
    family: "omarchy",
    mode: "dark",
    accent: "#7d82d9",
    selection: "#252e56",
    muted: "#6d7db6",
    background: "#060B1E",
    darkBackground: "#040816",
    darkerBackground: "#030610",
    lighterBackground: "#131a3a",
    foreground: "#ffcead",
    darkForeground: "#6d7db6",
    lightForeground: "#c9b8a6",
    brightForeground: "#ffcead",
    red: "#ED5B5A",
    yellow: "#E9BB4F",
    orange: "#eb8b54",
    green: "#92a593",
    cyan: "#a3bfd1",
    blue: "#7d82d9",
    magenta: "#c89dc1",
  },
  {
    id: "everforest",
    name: "Omarchy Everforest",
    family: "omarchy",
    mode: "dark",
    accent: "#7fbbb3",
    selection: "#3d484d",
    muted: "#475258",
    background: "#2d353b",
    darkBackground: "#21272c",
    darkerBackground: "#181d20",
    lighterBackground: "#343f44",
    foreground: "#d3c6aa",
    darkForeground: "#4f585e",
    lightForeground: "#9da9a0",
    brightForeground: "#d3c6aa",
    red: "#e67e80",
    yellow: "#dbbc7f",
    orange: "#e09d7f",
    green: "#a7c080",
    cyan: "#83c092",
    blue: "#7fbbb3",
    magenta: "#d699b6",
  },
  {
    id: "flexoki-light",
    name: "Omarchy Flexoki Light",
    family: "omarchy",
    mode: "light",
    accent: "#205EA6",
    selection: "#CECDC3",
    muted: "#B7B5AC",
    background: "#FFFCF0",
    darkBackground: "#f2efe4",
    darkerBackground: "#e5e2d8",
    lighterBackground: "#E6E4D9",
    foreground: "#100F0F",
    darkForeground: "#878580",
    lightForeground: "#403E3C",
    brightForeground: "#100F0F",
    red: "#D14D41",
    yellow: "#D0A215",
    orange: "#d0772b",
    green: "#879A39",
    cyan: "#3AA99F",
    blue: "#205EA6",
    magenta: "#CE5D97",
  },
  {
    id: "gruvbox",
    name: "Omarchy Gruvbox",
    family: "omarchy",
    mode: "dark",
    accent: "#7daea3",
    selection: "#504945",
    muted: "#665c54",
    background: "#282828",
    darkBackground: "#1e1e1e",
    darkerBackground: "#161616",
    lighterBackground: "#3c3836",
    foreground: "#d4be98",
    darkForeground: "#7c6f64",
    lightForeground: "#bdae93",
    brightForeground: "#d4be98",
    red: "#ea6962",
    yellow: "#d8a657",
    orange: "#e1875c",
    green: "#a9b665",
    cyan: "#89b482",
    blue: "#7daea3",
    magenta: "#d3869b",
  },
  {
    id: "hackerman",
    name: "Omarchy Hackerman",
    family: "omarchy",
    mode: "dark",
    accent: "#82FB9C",
    selection: "#1f253a",
    muted: "#2d3450",
    background: "#0B0C16",
    darkBackground: "#080910",
    darkerBackground: "#06060c",
    lighterBackground: "#151828",
    foreground: "#ddf7ff",
    darkForeground: "#6a6e95",
    lightForeground: "#b5c5db",
    brightForeground: "#ddf7ff",
    red: "#50f872",
    yellow: "#50f7d4",
    orange: "#50f7a3",
    green: "#4fe88f",
    cyan: "#7cf8f7",
    blue: "#829dd4",
    magenta: "#86a7df",
  },
  {
    id: "jade-horse",
    name: "Omarchy Jade Horse",
    family: "omarchy",
    mode: "dark",
    accent: "#8bcbb1",
    selection: "#2b5147",
    muted: "#64887b",
    background: "#142620",
    darkBackground: "#0f1e19",
    darkerBackground: "#0a1713",
    lighterBackground: "#203b31",
    foreground: "#dfede5",
    darkForeground: "#91ad9f",
    lightForeground: "#bed6c9",
    brightForeground: "#f0faf4",
    red: "#d88d91",
    yellow: "#c5cc91",
    orange: "#d2ab8d",
    green: "#8bcbb1",
    cyan: "#86c7c5",
    blue: "#96b7d0",
    magenta: "#b7a1c8",
  },
  {
    id: "kanagawa",
    name: "Omarchy Kanagawa",
    family: "omarchy",
    mode: "dark",
    accent: "#dcd7ba",
    selection: "#363646",
    muted: "#54546D",
    background: "#1f1f28",
    darkBackground: "#17171e",
    darkerBackground: "#111116",
    lighterBackground: "#223249",
    foreground: "#dcd7ba",
    darkForeground: "#727169",
    lightForeground: "#c8c093",
    brightForeground: "#dcd7ba",
    red: "#c34043",
    yellow: "#c0a36e",
    orange: "#c17158",
    green: "#76946a",
    cyan: "#6a9589",
    blue: "#7e9cd8",
    magenta: "#957fb8",
  },
  {
    id: "last-horizon",
    name: "Omarchy Last Horizon",
    family: "omarchy",
    mode: "dark",
    accent: "#b59790",
    selection: "#584e51",
    muted: "#584e51",
    background: "#0c0b0c",
    darkBackground: "#090809",
    darkerBackground: "#060606",
    lighterBackground: "#181618",
    foreground: "#FAFCFB",
    darkForeground: "#584e51",
    lightForeground: "#cfd3cd",
    brightForeground: "#e2dddc",
    red: "#c38b7b",
    yellow: "#6B5E73",
    orange: "#c38b7b",
    green: "#87a9b0",
    cyan: "#a5a0b6",
    blue: "#b59790",
    magenta: "#c4d8e2",
  },
  {
    id: "lumon",
    name: "Omarchy Lumon",
    family: "omarchy",
    mode: "dark",
    accent: "#8bc9eb",
    selection: "#243d56",
    muted: "#304860",
    background: "#16242d",
    darkBackground: "#101b21",
    darkerBackground: "#0b1216",
    lighterBackground: "#1b2d40",
    foreground: "#d6e2ee",
    darkForeground: "#4d86b0",
    lightForeground: "#d6e2ee",
    brightForeground: "#f2fcff",
    red: "#4d86b0",
    yellow: "#6fa4c9",
    orange: "#8bc9eb",
    green: "#5e95bc",
    cyan: "#b4e4f6",
    blue: "#6fb8e3",
    magenta: "#8bc9eb",
  },
  {
    id: "lupine",
    name: "Omarchy Lupine",
    family: "omarchy",
    mode: "light",
    accent: "#3264eb",
    selection: "#d0d0d0",
    muted: "#9e9e9e",
    background: "#fafafa",
    darkBackground: "#ececec",
    darkerBackground: "#dedede",
    lighterBackground: "#f5f5f5",
    foreground: "#212121",
    darkForeground: "#757575",
    lightForeground: "#424242",
    brightForeground: "#000000",
    red: "#c900c4",
    yellow: "#026fde",
    orange: "#026fde",
    green: "#4a2fd0",
    cyan: "#0c67de",
    blue: "#3264eb",
    magenta: "#8a4ad7",
  },
  {
    id: "matte-black",
    name: "Omarchy Matte Black",
    family: "omarchy",
    mode: "dark",
    accent: "#e68e0d",
    selection: "#2a2a2a",
    muted: "#333333",
    background: "#121212",
    darkBackground: "#0d0d0d",
    darkerBackground: "#090909",
    lighterBackground: "#1e1e1e",
    foreground: "#bebebe",
    darkForeground: "#555555",
    lightForeground: "#8a8a8d",
    brightForeground: "#bebebe",
    red: "#D35F5F",
    yellow: "#b91c1c",
    orange: "#c63d3d",
    green: "#FFC107",
    cyan: "#bebebe",
    blue: "#e68e0d",
    magenta: "#D35F5F",
  },
  {
    id: "miasma",
    name: "Omarchy Miasma",
    family: "omarchy",
    mode: "dark",
    accent: "#78824b",
    selection: "#383838",
    muted: "#666666",
    background: "#222222",
    darkBackground: "#191919",
    darkerBackground: "#121212",
    lighterBackground: "#2c2c2c",
    foreground: "#c2c2b0",
    darkForeground: "#555555",
    lightForeground: "#8a8a7e",
    brightForeground: "#c2c2b0",
    red: "#685742",
    yellow: "#b36d43",
    orange: "#8d6242",
    green: "#5f875f",
    cyan: "#c9a554",
    blue: "#78824b",
    magenta: "#bb7744",
  },
  {
    id: "nord",
    name: "Omarchy Nord",
    family: "omarchy",
    mode: "dark",
    accent: "#81a1c1",
    selection: "#434c5e",
    muted: "#4c566a",
    background: "#2e3440",
    darkBackground: "#222730",
    darkerBackground: "#191c23",
    lighterBackground: "#3b4252",
    foreground: "#d8dee9",
    darkForeground: "#667080",
    lightForeground: "#adb5c4",
    brightForeground: "#d8dee9",
    red: "#bf616a",
    yellow: "#ebcb8b",
    orange: "#d5967a",
    green: "#a3be8c",
    cyan: "#88c0d0",
    blue: "#81a1c1",
    magenta: "#b48ead",
  },
  {
    id: "retro-82",
    name: "Omarchy Retro 82",
    family: "omarchy",
    mode: "dark",
    accent: "#faa968",
    selection: "#134e5a",
    muted: "#2a6b78",
    background: "#05182e",
    darkBackground: "#031222",
    darkerBackground: "#020c17",
    lighterBackground: "#0a2540",
    foreground: "#f6dcac",
    darkForeground: "#3f8f8a",
    lightForeground: "#a7c9c6",
    brightForeground: "#f6dcac",
    red: "#f85525",
    yellow: "#e97b3c",
    orange: "#faa968",
    green: "#028391",
    cyan: "#8cbfb8",
    blue: "#3f8f8a",
    magenta: "#3f8f8a",
  },
  {
    id: "ristretto",
    name: "Omarchy Ristretto",
    family: "omarchy",
    mode: "dark",
    accent: "#f38d70",
    selection: "#403e41",
    muted: "#72696a",
    background: "#2c2525",
    darkBackground: "#211b1b",
    darkerBackground: "#181414",
    lighterBackground: "#3d2f2a",
    foreground: "#e6d9db",
    darkForeground: "#72696a",
    lightForeground: "#c3b7b8",
    brightForeground: "#e6d9db",
    red: "#fd6883",
    yellow: "#f9cc6c",
    orange: "#fb9a77",
    green: "#adda78",
    cyan: "#85dacc",
    blue: "#f38d70",
    magenta: "#a8a9eb",
  },
  {
    id: "rose-pine",
    name: "Omarchy Rose Pine Dawn",
    family: "omarchy",
    mode: "light",
    accent: "#56949f",
    selection: "#dfdad9",
    muted: "#cecacd",
    background: "#faf4ed",
    darkBackground: "#ede7e1",
    darkerBackground: "#e1dbd5",
    lighterBackground: "#f2e9e1",
    foreground: "#575279",
    darkForeground: "#9893a5",
    lightForeground: "#6e6a86",
    brightForeground: "#575279",
    red: "#b4637a",
    yellow: "#ea9d34",
    orange: "#cf8057",
    green: "#286983",
    cyan: "#d7827e",
    blue: "#56949f",
    magenta: "#907aa9",
  },
  {
    id: "solitude",
    name: "Omarchy Solitude",
    family: "omarchy",
    mode: "dark",
    accent: "#798186",
    selection: "#343d41",
    muted: "#4b4e55",
    background: "#101315",
    darkBackground: "#0c0e10",
    darkerBackground: "#080a0b",
    lighterBackground: "#181c20",
    foreground: "#cacccc",
    darkForeground: "#4b4e55",
    lightForeground: "#cbc2be",
    brightForeground: "#a5aeb4",
    red: "#de6145",
    yellow: "#d9dbdc",
    orange: "#de6145",
    green: "#9fa5a9",
    cyan: "#707070",
    blue: "#798186",
    magenta: "#aeaeae",
  },
  {
    id: "starship",
    name: "Omarchy Starship",
    family: "omarchy",
    mode: "dark",
    accent: "#ff9f0a",
    selection: "#3a3a3c",
    muted: "#8e8e93",
    background: "#1c1c1e",
    darkBackground: "#161618",
    darkerBackground: "#0e0e10",
    lighterBackground: "#2c2c2e",
    foreground: "#f5f5f7",
    darkForeground: "#98989d",
    lightForeground: "#fbfbfd",
    brightForeground: "#ffffff",
    red: "#ff5f4a",
    yellow: "#ffc27a",
    orange: "#ff6a3d",
    green: "#ff9f0a",
    cyan: "#a6dcef",
    blue: "#8fb8de",
    magenta: "#ff8fa3",
  },
  {
    id: "tokyo-night",
    name: "Omarchy Tokyo Night",
    family: "omarchy",
    mode: "dark",
    accent: "#7aa2f7",
    selection: "#292e42",
    muted: "#414868",
    background: "#1a1b26",
    darkBackground: "#13141c",
    darkerBackground: "#0e0e14",
    lighterBackground: "#24283b",
    foreground: "#a9b1d6",
    darkForeground: "#565f89",
    lightForeground: "#b4bee6",
    brightForeground: "#c0caf5",
    red: "#f7768e",
    yellow: "#e0af68",
    orange: "#eb927b",
    green: "#9ece6a",
    cyan: "#449dab",
    blue: "#7aa2f7",
    magenta: "#ad8ee6",
  },
  {
    id: "vantablack",
    name: "Omarchy Vantablack",
    family: "omarchy",
    mode: "dark",
    accent: "#8d8d8d",
    selection: "#1a1a1a",
    muted: "#7a7a7a",
    background: "#000000",
    darkBackground: "#090909",
    darkerBackground: "#070707",
    lighterBackground: "#1a1a1a",
    foreground: "#ffffff",
    darkForeground: "#505050",
    lightForeground: "#ececec",
    brightForeground: "#ffffff",
    red: "#a4a4a4",
    yellow: "#cecece",
    orange: "#b9b9b9",
    green: "#b6b6b6",
    cyan: "#b0b0b0",
    blue: "#8d8d8d",
    magenta: "#9b9b9b",
  },
  {
    id: "white",
    name: "Omarchy Pure White",
    family: "omarchy",
    mode: "light",
    accent: "#1a1a1a",
    selection: "#c0c0c0",
    muted: "#808080",
    background: "#ffffff",
    darkBackground: "#f5f5f5",
    darkerBackground: "#e8e8e8",
    lighterBackground: "#efefef",
    foreground: "#000000",
    darkForeground: "#666666",
    lightForeground: "#222222",
    brightForeground: "#000000",
    red: "#2a2a2a",
    yellow: "#4a4a4a",
    orange: "#383838",
    green: "#3a3a3a",
    cyan: "#3e3e3e",
    blue: "#1a1a1a",
    magenta: "#2e2e2e",
  },
];

const PLATFORM_THEMES: SovereignThemePalette[] = [
  {
    id: "cachyos-emerald",
    name: "CachyOS Emerald Workstation",
    family: "cachyos",
    mode: "dark",
    accent: "#00cc88",
    selection: "#163832",
    muted: "#4b6b64",
    background: "#0b1416",
    darkBackground: "#070d0f",
    darkerBackground: "#05090a",
    lighterBackground: "#132226",
    foreground: "#e2f1ee",
    darkForeground: "#648780",
    lightForeground: "#b8d8d1",
    brightForeground: "#f4fcfa",
    red: "#f43f5e",
    yellow: "#f59e0b",
    orange: "#fb923c",
    green: "#00cc88",
    cyan: "#06b6d4",
    blue: "#38bdf8",
    magenta: "#818cf8",
  },
  {
    id: "aphrody-m3-light",
    name: "Aphrody Google Material 3 Light",
    family: "google-m3",
    mode: "light",
    accent: "#1a73e8",
    selection: "#d3e3fd",
    muted: "#5f6368",
    background: "#f8f9fa",
    darkBackground: "#f1f3f4",
    darkerBackground: "#e8eaed",
    lighterBackground: "#ffffff",
    foreground: "#1f1f1f",
    darkForeground: "#5f6368",
    lightForeground: "#3c4043",
    brightForeground: "#000000",
    red: "#d93025",
    yellow: "#f9ab00",
    orange: "#e8710a",
    green: "#1e8e3e",
    cyan: "#12b5cb",
    blue: "#1a73e8",
    magenta: "#9334e6",
  },
  {
    id: "aphrody-m3-dark",
    name: "Aphrody Google Material 3 Dark",
    family: "google-m3",
    mode: "dark",
    accent: "#8ab4f8",
    selection: "#174ea6",
    muted: "#9aa0a6",
    background: "#131314",
    darkBackground: "#0e0e0f",
    darkerBackground: "#080809",
    lighterBackground: "#1e1f20",
    foreground: "#e3e3e3",
    darkForeground: "#8e918f",
    lightForeground: "#c4c7c5",
    brightForeground: "#ffffff",
    red: "#f28b82",
    yellow: "#fdd663",
    orange: "#fcad70",
    green: "#81c995",
    cyan: "#78d9ec",
    blue: "#8ab4f8",
    magenta: "#c58af9",
  },
  {
    id: "fluent-2-mica",
    name: "Microsoft Fluent 2 Mica Slate",
    family: "fluent-2",
    mode: "dark",
    accent: "#60cdff",
    selection: "#263b52",
    muted: "#8a929b",
    background: "#191c20",
    darkBackground: "#131519",
    darkerBackground: "#0d0f12",
    lighterBackground: "#24282f",
    foreground: "#f3f4f6",
    darkForeground: "#7d8590",
    lightForeground: "#d0d7de",
    brightForeground: "#ffffff",
    red: "#ff99a4",
    yellow: "#fce100",
    orange: "#f7941d",
    green: "#6ccb5f",
    cyan: "#60cdff",
    blue: "#4cc2ff",
    magenta: "#b4a0ff",
  },
];

function parseTomlKeyValues(tomlText: string): Record<string, string> {
  const map: Record<string, string> = {};
  for (const rawLine of tomlText.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) continue;
    const m = line.match(/^([a-zA-Z0-9_]+)\s*=\s*"([^"]*)"/);
    if (m) {
      map[m[1]] = m[2].trim();
    }
  }
  return map;
}

function titleCaseSlug(slug: string): string {
  return slug
    .split("-")
    .map((s) => (s ? s[0].toUpperCase() + s.slice(1) : s))
    .join(" ");
}

/**
 * Load all 27 themes (23 Omarchy + 4 CachyOS/M3/Fluent2).
 * Uses live C:\src\third_party\omacom\omarchy\themes\*\colors.toml when present,
 * falling back cleanly to embedded canonical values when standalone.
 */
export function loadAll27Themes(
  omarchyDir = "C:\\src\\third_party\\omacom\\omarchy\\themes",
): SovereignThemePalette[] {
  const fallbackById = new Map(
    CANONICAL_OMARCHY_FALLBACKS.map((t) => [t.id, t]),
  );

  const omarchyThemes: SovereignThemePalette[] = [];

  if (existsSync(omarchyDir)) {
    const dirs = readdirSync(omarchyDir, { withFileTypes: true })
      .filter((d) => d.isDirectory())
      .map((d) => d.name)
      .sort();

    for (const id of dirs) {
      const tomlPath = join(omarchyDir, id, "colors.toml");
      const fb = fallbackById.get(id);
      if (existsSync(tomlPath)) {
        const kv = parseTomlKeyValues(readFileSync(tomlPath, "utf8"));
        omarchyThemes.push({
          id,
          name: fb?.name ?? `Omarchy ${titleCaseSlug(id)}`,
          family: "omarchy",
          mode: kv.mode === "light" ? "light" : "dark",
          accent: kv.accent || fb?.accent || "#7aa2f7",
          selection: kv.selection || fb?.selection || "#292e42",
          muted: kv.muted || fb?.muted || "#565f89",
          background: kv.background || fb?.background || "#1a1b26",
          darkBackground: kv.dark_background || fb?.darkBackground || "#13141c",
          darkerBackground:
            kv.darker_background || fb?.darkerBackground || "#0e0e14",
          lighterBackground:
            kv.lighter_background || fb?.lighterBackground || "#24283b",
          foreground: kv.foreground || fb?.foreground || "#c0caf5",
          darkForeground: kv.dark_foreground || fb?.darkForeground || "#565f89",
          lightForeground:
            kv.light_foreground || fb?.lightForeground || "#a9b1d6",
          brightForeground:
            kv.bright_foreground || fb?.brightForeground || "#ffffff",
          red: kv.red || fb?.red || "#f7768e",
          yellow: kv.yellow || fb?.yellow || "#e0af68",
          orange: kv.orange || kv.yellow || fb?.orange || "#ff9e64",
          green: kv.green || fb?.green || "#9ece6a",
          cyan: kv.cyan || fb?.cyan || "#7dcfff",
          blue: kv.blue || fb?.blue || "#7aa2f7",
          magenta: kv.magenta || fb?.magenta || "#bb9af7",
        });
      } else if (fb) {
        omarchyThemes.push(fb);
      }
    }
  } else {
    omarchyThemes.push(...CANONICAL_OMARCHY_FALLBACKS);
  }

  return [...omarchyThemes, ...PLATFORM_THEMES];
}

/**
 * Render a minified CSS stylesheet for a single theme.
 */
export function renderThemeMinifiedCss(
  theme: SovereignThemePalette,
  asRootDefault = true,
): string {
  const selector = asRootDefault
    ? `:root,[data-theme="${theme.id}"]`
    : `[data-theme="${theme.id}"]`;

  const vars = [
    `color-scheme:${theme.mode}`,
    `--aph-theme-id:"${theme.id}"`,
    `--md-sys-color-primary:${theme.accent}`,
    `--md-sys-color-on-primary:${theme.mode === "dark" ? theme.darkerBackground : "#ffffff"}`,
    `--md-sys-color-primary-container:${theme.selection}`,
    `--md-sys-color-on-primary-container:${theme.brightForeground}`,
    `--md-sys-color-secondary:${theme.cyan}`,
    `--md-sys-color-tertiary:${theme.green}`,
    `--md-sys-color-error:${theme.red}`,
    `--md-sys-color-background:${theme.background}`,
    `--md-sys-color-on-background:${theme.foreground}`,
    `--md-sys-color-surface:${theme.background}`,
    `--md-sys-color-surface-container-lowest:${theme.darkerBackground}`,
    `--md-sys-color-surface-container-low:${theme.darkBackground}`,
    `--md-sys-color-surface-container:${theme.lighterBackground}`,
    `--md-sys-color-on-surface:${theme.foreground}`,
    `--md-sys-color-on-surface-variant:${theme.lightForeground}`,
    `--md-sys-color-outline:${theme.muted}`,
    `--md-sys-color-outline-variant:${theme.selection}`,
    `--term-red:${theme.red}`,
    `--term-yellow:${theme.yellow}`,
    `--term-orange:${theme.orange}`,
    `--term-green:${theme.green}`,
    `--term-cyan:${theme.cyan}`,
    `--term-blue:${theme.blue}`,
    `--term-magenta:${theme.magenta}`,
  ].join(";");

  const surfaceRules = asRootDefault
    ? `::selection{background:${theme.selection};color:${theme.brightForeground}}:focus-visible{outline:2px solid ${theme.accent};outline-offset:2px}body{background:var(--md-sys-color-surface);color:var(--md-sys-color-on-surface);caret-color:${theme.accent}}`
    : "";

  return `${selector}{${vars}}${surfaceRules}`;
}

export function generateThemeStylesheetAssets(outDir: string): {
  files: string[];
  themes: SovereignThemePalette[];
} {
  const themesDir = join(outDir, "themes");
  mkdirSync(themesDir, { recursive: true });

  const themes = loadAll27Themes();
  const written: string[] = [];

  const combinedParts: string[] = [
    `/* Aphrody Sovereign 27-Theme Stylesheet Bundle (23 Omarchy + CachyOS + M3 + Fluent 2) - MIT License */`,
  ];

  const w3cTokens: Record<string, any> = {
    $schema: "https://design-tokens.github.io/community-group/format/",
    name: "Aphrody 27-Theme Workstation & Web Token Catalog",
    version: "2.0.0",
    license: "MIT",
    count: themes.length,
    themes: {},
  };

  for (const theme of themes) {
    const singleCss = renderThemeMinifiedCss(theme, true);
    const singlePath = join(themesDir, `${theme.id}.css`);
    writeFileSync(singlePath, singleCss + "\n", "utf8");
    written.push(singlePath);

    const scopedCss = renderThemeMinifiedCss(
      theme,
      theme.id === "aphrody-m3-light",
    );
    combinedParts.push(scopedCss);

    w3cTokens.themes[theme.id] = {
      $description: `${theme.name} (${theme.family}, ${theme.mode})`,
      mode: { $value: theme.mode, $type: "string" },
      accent: { $value: theme.accent, $type: "color" },
      background: { $value: theme.background, $type: "color" },
      surfaceContainerLow: { $value: theme.darkBackground, $type: "color" },
      surfaceContainer: { $value: theme.lighterBackground, $type: "color" },
      foreground: { $value: theme.foreground, $type: "color" },
      muted: { $value: theme.muted, $type: "color" },
      selection: { $value: theme.selection, $type: "color" },
      terminal: {
        red: { $value: theme.red, $type: "color" },
        yellow: { $value: theme.yellow, $type: "color" },
        orange: { $value: theme.orange, $type: "color" },
        green: { $value: theme.green, $type: "color" },
        cyan: { $value: theme.cyan, $type: "color" },
        blue: { $value: theme.blue, $type: "color" },
        magenta: { $value: theme.magenta, $type: "color" },
      },
    };
  }

  const allCssPath = join(themesDir, "all-themes.css");
  writeFileSync(allCssPath, combinedParts.join("\n") + "\n", "utf8");
  written.push(allCssPath);

  const tokensJsonPath = join(themesDir, "design-tokens.json");
  writeFileSync(tokensJsonPath, JSON.stringify(w3cTokens, null, 2), "utf8");
  written.push(tokensJsonPath);

  return { files: written, themes };
}
