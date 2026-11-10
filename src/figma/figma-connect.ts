/**
 * Figma REST API v1 + Figma Variables + Code Connect + Material Design Icons Bridge
 * 100% Pure Bun v1.4.4 - Zero External Dependencies
 * Links live Figma API (`FIGMA_ACCESS_TOKEN` / `C:\src\.env`) with `C:\src\google-design\upstream\material-design-icons`.
 */

import { existsSync, readFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { getSymbolSvg, listAvailableSymbols } from "../symbols/catalog.ts";

export interface CodeConnectBinding {
  componentName: string;
  figmaNodeUrl: string;
  sourceFile: string;
  propsMapping: Record<string, string>;
}

export interface FigmaVariableEntry {
  id: string;
  name: string;
  resolvedType: "COLOR" | "FLOAT" | "STRING" | "BOOLEAN";
  valuesByMode: Record<string, unknown>;
}

export interface FigmaUserIdentity {
  id: string;
  handle: string;
  email: string;
  img_url?: string;
}

export interface FigmaMaterialIconSyncItem {
  symbolName: string;
  localSvgPath: string;
  figmaComponentName: string;
  viewBox: "0 -960 960 960";
  svgByteLength: number;
  codeConnectSnippet: string;
}

/**
 * Resolves `FIGMA_ACCESS_TOKEN` or `FIGMA_TOKEN` from `process.env` or `C:\src\.env` without leaking secrets.
 */
export function resolveFigmaToken(envFilePath = "C:/src/.env"): string | null {
  const fromEnv = process.env.FIGMA_ACCESS_TOKEN || process.env.FIGMA_TOKEN;
  if (fromEnv && fromEnv.trim().length > 0) {
    return fromEnv.trim();
  }
  const absEnv = resolve(envFilePath);
  if (!existsSync(absEnv)) return null;
  const raw = readFileSync(absEnv, "utf8");
  for (const line of raw.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const k = trimmed.slice(0, eq).trim();
    const v = trimmed
      .slice(eq + 1)
      .trim()
      .replace(/^["']|["']$/g, "");
    if ((k === "FIGMA_ACCESS_TOKEN" || k === "FIGMA_TOKEN") && v.length > 0) {
      return v;
    }
  }
  return null;
}

/**
 * Queries live Figma REST API `/v1/me` using `X-Figma-Token`.
 */
export async function fetchFigmaCurrentUser(
  token?: string,
): Promise<FigmaUserIdentity> {
  const resolved = token ?? resolveFigmaToken();
  if (!resolved) {
    throw new Error(
      "Missing FIGMA_ACCESS_TOKEN in process.env or C:\\src\\.env",
    );
  }
  const res = await fetch("https://api.figma.com/v1/me", {
    headers: { "X-Figma-Token": resolved },
  });
  if (!res.ok) {
    throw new Error(`Figma API /v1/me returned HTTP ${res.status}`);
  }
  return (await res.json()) as FigmaUserIdentity;
}

/**
 * Builds a deterministic Figma Code Connect + Icon Component manifest directly from
 * `C:\src\google-design\upstream\material-design-icons`.
 */
export function buildMaterialIconsFigmaManifest(
  figmaFileUrl = "https://www.figma.com/community/plugin/740272380439725040/material-design-icons",
): FigmaMaterialIconSyncItem[] {
  const iconsRoot = resolve(
    import.meta.dir,
    "../../upstream/material-design-icons/symbols/web",
  );
  const symbols = listAvailableSymbols();
  return symbols.map((symbolName) => {
    const svg = getSymbolSvg(symbolName, "outlined", 24, 0);
    const pascal = symbolName
      .split("_")
      .map((s) => (s ? s[0].toUpperCase() + s.slice(1) : ""))
      .join("");
    const compName = `MaterialSymbol${pascal}`;
    const localSvgPath = join(
      iconsRoot,
      symbolName,
      "materialsymbolsoutlined",
      `${symbolName}_24px.svg`,
    ).replaceAll("\\", "/");
    const snippet = generateFigmaCodeConnectFile([
      {
        componentName: compName,
        figmaNodeUrl: `${figmaFileUrl}?node-id=${encodeURIComponent(symbolName)}`,
        sourceFile: localSvgPath,
        propsMapping: {
          style:
            "enum('Style', { Outlined: 'outlined', Rounded: 'rounded', Sharp: 'sharp' })",
          fill: "boolean('Fill')",
        },
      },
    ]);
    return {
      symbolName,
      localSvgPath,
      figmaComponentName: compName,
      viewBox: "0 -960 960 960",
      svgByteLength: Buffer.byteLength(svg),
      codeConnectSnippet: snippet,
    };
  });
}

/**
 * Generate standard Figma Code Connect TypeScript file content
 */
export function generateFigmaCodeConnectFile(
  bindings: CodeConnectBinding[],
): string {
  const imports = `import figma from '@figma/code-connect';\n`;

  const blocks = bindings
    .map((b) => {
      const propsEntries = Object.entries(b.propsMapping)
        .map(([k, v]) => `    ${k}: figma.${v},`)
        .join("\n");

      return `
figma.connect(
  '${b.componentName}',
  '${b.figmaNodeUrl}',
  {
    props: {
${propsEntries}
    },
    example: (props) => \`<${b.componentName} {...props} />\`,
  }
);`;
    })
    .join("\n");

  return `${imports}${blocks}\n`;
}

/**
 * Verify if component props comply with Figma token naming conventions
 */
export function verifyFigmaTokenBinding(tokenName: string): boolean {
  const validPrefixes = [
    "md-sys-",
    "md-ref-",
    "color/",
    "typography/",
    "spacing/",
    "elevation/",
  ];
  return validPrefixes.some((p) => tokenName.startsWith(p));
}
