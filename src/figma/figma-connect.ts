/**
 * Figma Variables & Code Connect Integration Engine
 * 100% Pure Bun v1.4.4 - Zero External Dependencies
 * Conforms to upstream figma/code-connect & figma/plugin-typings specifications.
 */

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
  valuesByMode: Record<string, any>;
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
  // Figma Variables tokens should follow category/sub/token or md-sys-* syntax
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
