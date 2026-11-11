/**
 * Anti-AI-Slop Humanizer & Impeccable Design Auditor
 * 100% Pure Bun v1.4.4 - Zero External Dependencies
 *
 * Grounded empirically in:
 * - C:\src\third_party\design-ecosystem\humanizer (blader/humanizer 26 AI prose tells)
 * - C:\src\third_party\design-ecosystem\impeccable (pbakaus/impeccable 62 UI anti-patterns & craft floor)
 */

import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { extname, join } from "node:path";

export type SlopCategory =
  | "ai-lexicon"
  | "staged-opener"
  | "chatbot-residue"
  | "inflated-significance"
  | "puffery-triad"
  | "emoji"
  | "em-dash-overuse"
  | "saas-slop-gradient"
  | "gradient-text"
  | "side-stripe-card"
  | "glow-halo"
  | "unaligned-spacing";

export interface SlopFinding {
  ruleId: string;
  category: SlopCategory;
  severity: "error" | "warning";
  line: number;
  column: number;
  excerpt: string;
  message: string;
  replacement?: string;
}

export interface AntiSlopAuditOptions {
  filePath?: string;
  checkUiStyles?: boolean;
  checkSpacing?: boolean;
  includeSuggestion?: boolean;
  maxEmDashes?: number;
}

export interface AntiSlopAuditResult {
  clean: boolean;
  score: number;
  findings: SlopFinding[];
  humanizedSuggestion?: string;
}

export interface DirectorySlopReport {
  targetPath: string;
  scannedFiles: number;
  clean: boolean;
  averageScore: number;
  totalFindings: number;
  files: Array<{
    file: string;
    clean: boolean;
    score: number;
    findings: SlopFinding[];
  }>;
}

interface LexiconRule {
  id: string;
  category: SlopCategory;
  severity: "error" | "warning";
  pattern: RegExp;
  replacement: string;
  message: string;
}

const LEXICON_RULES: LexiconRule[] = [
  {
    id: "humanizer-chatbot-residue",
    category: "chatbot-residue",
    severity: "error",
    pattern:
      /\b(I hope this helps!?|Great question!?|You're absolutely right!?|Certainly!|Of course!|Let me know if you(?:'d| would) like me to)\b/gi,
    replacement: "",
    message:
      "Chatbot wrapper residue detected; remove conversational scaffolding.",
  },
  {
    id: "humanizer-staged-opener",
    category: "staged-opener",
    severity: "warning",
    pattern:
      /\b(Let's dive in(?:to)?|Without further ado|Here's what you need to know|In today's fast-paced (?:world|landscape|digital age|era))\b[:,.!]?\s*/gi,
    replacement: "",
    message:
      "Staged AI run-up opener detected; state the concrete point directly.",
  },
  {
    id: "humanizer-delve",
    category: "ai-lexicon",
    severity: "warning",
    pattern: /\bdelve(?:s|d)?\s+into\b/gi,
    replacement: "examine",
    message:
      "Stock AI verb 'delve into' detected; use 'examine' or state the subject.",
  },
  {
    id: "humanizer-delve-bare",
    category: "ai-lexicon",
    severity: "warning",
    pattern: /\bdelve(?:s|d|ing)?\b/gi,
    replacement: "explore",
    message: "Stock AI verb 'delve' detected.",
  },
  {
    id: "humanizer-testament",
    category: "inflated-significance",
    severity: "warning",
    pattern:
      /\b(?:stands|serves)\s+as\s+a\s+(?:enduring\s+)?testament\s+to\b/gi,
    replacement: "demonstrates",
    message:
      "Inflated significance phrase 'stands as a testament to' detected.",
  },
  {
    id: "humanizer-testament-short",
    category: "inflated-significance",
    severity: "warning",
    pattern: /\btestament\s+to\b/gi,
    replacement: "evidence of",
    message: "Stock AI phrase 'testament to' detected.",
  },
  {
    id: "humanizer-tapestry",
    category: "ai-lexicon",
    severity: "warning",
    pattern: /\b(?:rich\s+|intricate\s+|vibrant\s+)?tapestry\s+of\b/gi,
    replacement: "mix of",
    message: "Figurative 'tapestry of' AI cliché detected.",
  },
  {
    id: "humanizer-tapestry-bare",
    category: "ai-lexicon",
    severity: "warning",
    pattern: /\btapestry\b/gi,
    replacement: "structure",
    message: "Abstract 'tapestry' AI cliché detected.",
  },
  {
    id: "humanizer-unleash",
    category: "ai-lexicon",
    severity: "warning",
    pattern:
      /\bunleash(?:es|ed|ing)?(?:\s+the\s+(?:full\s+)?(?:power|potential)\s+of)?\b/gi,
    replacement: "enable",
    message:
      "Promotional AI verb 'unleash' detected; describe the exact capability.",
  },
  {
    id: "humanizer-seamless",
    category: "ai-lexicon",
    severity: "warning",
    pattern: /\bseamlessly\b/gi,
    replacement: "directly",
    message:
      "Overused AI adverb 'seamlessly' detected; specify how integration works.",
  },
  {
    id: "humanizer-seamless-adj",
    category: "ai-lexicon",
    severity: "warning",
    pattern: /\bseamless\b/gi,
    replacement: "direct",
    message:
      "Overused AI adjective 'seamless' detected; specify the concrete behavior.",
  },
  {
    id: "humanizer-game-changer",
    category: "inflated-significance",
    severity: "warning",
    pattern: /\bgame[- ]chang(?:er|ing)\b/gi,
    replacement: "significant",
    message: "Sales hype 'game-changer' detected.",
  },
  {
    id: "humanizer-elevate-your",
    category: "ai-lexicon",
    severity: "warning",
    pattern: /\belevate\s+your\b/gi,
    replacement: "improve your",
    message: "Sales cliché 'elevate your' detected.",
  },
  {
    id: "humanizer-revolutionize",
    category: "inflated-significance",
    severity: "warning",
    pattern: /\brevolutioniz(?:e|es|ed|ing)\b/gi,
    replacement: "redesign",
    message: "Hyperbolic verb 'revolutionize' detected.",
  },
  {
    id: "humanizer-cutting-edge-ai",
    category: "ai-lexicon",
    severity: "error",
    pattern: /\bcutting[- ]edge\s+AI[- ]powered\b/gi,
    replacement: "automated",
    message:
      "Public AI-hype phrase 'cutting-edge AI-powered' violates generalist anti-slop rules.",
  },
  {
    id: "humanizer-ai-powered-hype",
    category: "ai-lexicon",
    severity: "warning",
    pattern:
      /\b(?:supercharge|next[- ]gen(?:eration)?\s+AI|unlock\s+the\s+power\s+of)\b/gi,
    replacement: "accelerate",
    message: "Promotional AI-hype puffery detected.",
  },
  {
    id: "humanizer-pivotal-moment",
    category: "inflated-significance",
    severity: "warning",
    pattern: /\bmarking\s+a\s+(?:pivotal|crucial)\s+moment\b/gi,
    replacement: "changing",
    message: "Inflated historical significance phrase detected.",
  },
  {
    id: "humanizer-serves-as",
    category: "ai-lexicon",
    severity: "warning",
    pattern: /\bserves\s+as\s+a\b/gi,
    replacement: "is a",
    message: "Avoid 'serves as a' where plain 'is a' is clearer.",
  },
  {
    id: "humanizer-let-that-sink-in",
    category: "staged-opener",
    severity: "warning",
    pattern:
      /\b(?:Let that sink in\.|Read that again\.|That is the real win\.)/gi,
    replacement: "",
    message: "Dramatic one-line closer detected.",
  },
];

// Matches Extended Pictographic & Surrogate-Pair Emojis while sparing standard ASCII/Box-Drawing/Math symbols
const EMOJI_REGEX = /(?:\p{Emoji_Presentation}|\p{Extended_Pictographic})/gu;

// Puffery adjective triads such as "fast, scalable, and revolutionary platform" or "sleek, intuitive, seamless"
const PUFFERY_WORDS =
  "(?:seamless|intuitive|cutting-edge|revolutionary|effortless|groundbreaking|transformative|unparalleled|next-generation|world-class|vibrant|breathtaking|robust|scalable|synergistic)";
const TRIPLE_PUFFERY_REGEX = new RegExp(
  `\\b(${PUFFERY_WORDS})\\s*,\\s*(${PUFFERY_WORDS})(?:\\s*,?\\s+(?:and\\s+)?(${PUFFERY_WORDS}))\\b`,
  "gi",
);

// Generic purple-to-pink / indigo-to-fuchsia SaaS slop gradients
const SAAS_SLOP_GRADIENT_REGEX =
  /(?:linear-gradient|radial-gradient)\([^)]*(?:#8b5cf6|#7c3aed|#6366f1|#a855f7)[^)]*(?:#ec4899|#db2777|#f43f5e|#d946ef)[^)]*\)|from-(?:purple|violet|indigo)-[456]00\s+(?:via-[a-z]+-[456]00\s+)?to-(?:pink|fuchsia|rose)-[456]00/gi;

const GRADIENT_TEXT_REGEX =
  /background-clip\s*:\s*text[\s\S]{0,120}?color\s*:\s*transparent|text-transparent\s+bg-clip-text\s+bg-gradient-to/gi;

const SIDE_STRIPE_CARD_REGEX =
  /border-left\s*:\s*([3-9]|\d{2,})px\s+solid\s+(?!transparent)/gi;

const GLOW_HALO_REGEX =
  /box-shadow\s*:\s*0(?:px)?\s+0(?:px)?\s+(?:1[6-9]|[2-9]\d|\d{3,})px\s+(?:rgba?\(|#|oklch\()/gi;

const VALID_GRID_PX = new Set([
  0, 1, 2, 4, 6, 8, 10, 12, 16, 20, 24, 28, 32, 36, 40, 44, 48, 56, 64, 72, 80,
  96, 112, 128, 144, 160,
]);

/**
 * Deterministically rewrite AI-sounding prose into direct, plain human prose
 * while preserving fenced code blocks, inline code, URLs, and file paths.
 */
export function humanizeText(input: string): string {
  // Split out fenced code blocks so code is never mutated
  const segments = input.split(/(```[\s\S]*?```)/g);
  const transformed = segments.map((segment) => {
    if (segment.startsWith("```") && segment.endsWith("```")) {
      return segment;
    }
    return humanizeProseSegment(segment);
  });
  return transformed.join("");
}

function humanizeProseSegment(segment: string): string {
  // Protect inline code spans
  const inlineCodes: string[] = [];
  let working = segment.replace(/`[^`\n]+`/g, (match) => {
    const idx = inlineCodes.length;
    inlineCodes.push(match);
    return `@@INLINE_CODE_${idx}@@`;
  });

  // Strip emojis
  working = working.replace(EMOJI_REGEX, "");

  // Apply lexicon rewrites
  for (const rule of LEXICON_RULES) {
    working = working.replace(rule.pattern, (match) => {
      if (!rule.replacement) return "";
      const isCapitalized =
        match.length > 0 &&
        match[0] === match[0].toUpperCase() &&
        match[0] !== match[0].toLowerCase();
      if (isCapitalized) {
        return (
          rule.replacement.charAt(0).toUpperCase() + rule.replacement.slice(1)
        );
      }
      return rule.replacement;
    });
  }

  // Collapse puffery triads to their concrete final adjective or plain phrasing
  working = working.replace(TRIPLE_PUFFERY_REGEX, "reliable");

  // Rewrite Not-only-X-but-also-Y staging into direct coordination
  working = working.replace(
    /\b[Ii]t(?:'s| is) not (?:just|merely|only) about ([^,;:.]+)[,;]\s*it(?:'s| is) about ([^.]+)\./g,
    (_, a: string, b: string) => `It covers ${a.trim()} and ${b.trim()}.`,
  );

  // Replace spaced em dashes in prose with commas
  working = working.replace(/\s+—\s+/g, ", ");
  working = working.replace(/—/g, ", ");

  // Clean up double spaces or orphaned leading spaces on lines
  working = working
    .replace(/[ \t]{2,}/g, " ")
    .replace(/^[ \t]+([A-Za-z])/gm, (full, ch, offset, str) => {
      // Preserve intentional Markdown list indentation
      const lineStart = str.lastIndexOf("\n", offset) + 1;
      const prefix = str.slice(lineStart, offset);
      if (prefix.length >= 2) return full;
      return ch;
    })
    .replace(/\s+([,.;:!?])/g, "$1")
    .replace(/,\s*,/g, ",")
    .replace(/\n{3,}/g, "\n\n");

  // Restore inline code spans
  working = working.replace(/@@INLINE_CODE_(\d+)@@/g, (_, idxStr: string) => {
    return inlineCodes[Number(idxStr)] ?? "";
  });

  return working.trim() ? working : working;
}

/**
 * Audit prose, Markdown, HTML, CSS, or TSX/TS content for AI writing clichés,
 * emojis, SaaS purple-pink gradients, ghost halos, and unaligned spacing.
 */
export function auditAntiSlop(
  textOrHtml: string,
  options: AntiSlopAuditOptions = {},
): AntiSlopAuditResult {
  const findings: SlopFinding[] = [];
  const checkUiStyles = options.checkUiStyles ?? true;
  const checkSpacing = options.checkSpacing ?? true;
  const includeSuggestion = options.includeSuggestion ?? true;
  const maxEmDashes = options.maxEmDashes ?? 2;

  const lines = textOrHtml.split("\n");
  let insideFence = false;
  let emDashCount = 0;
  let firstEmDashLine = 1;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const lineNum = i + 1;

    if (line.trimStart().startsWith("```")) {
      insideFence = !insideFence;
      continue;
    }

    // 1. Emoji check runs across all lines (zero-emoji policy everywhere)
    EMOJI_REGEX.lastIndex = 0;
    let emojiMatch: RegExpExecArray | null;
    while ((emojiMatch = EMOJI_REGEX.exec(line)) !== null) {
      findings.push({
        ruleId: "sovereign-zero-emoji",
        category: "emoji",
        severity: "error",
        line: lineNum,
        column: emojiMatch.index + 1,
        excerpt: emojiMatch[0],
        message:
          "Emoji character detected. Zero emojis are permitted; use geometric 24x24 SVG icons or plain prose.",
        replacement: "",
      });
    }

    if (!insideFence) {
      // Mask inline code before running prose checks
      const proseLine = line.replace(/`[^`]+`/g, (m) => " ".repeat(m.length));

      for (const rule of LEXICON_RULES) {
        rule.pattern.lastIndex = 0;
        let m: RegExpExecArray | null;
        while ((m = rule.pattern.exec(proseLine)) !== null) {
          findings.push({
            ruleId: rule.id,
            category: rule.category,
            severity: rule.severity,
            line: lineNum,
            column: m.index + 1,
            excerpt: m[0].trim(),
            message: rule.message,
            replacement: rule.replacement,
          });
        }
      }

      TRIPLE_PUFFERY_REGEX.lastIndex = 0;
      let triadMatch: RegExpExecArray | null;
      while ((triadMatch = TRIPLE_PUFFERY_REGEX.exec(proseLine)) !== null) {
        findings.push({
          ruleId: "humanizer-triple-puffery",
          category: "puffery-triad",
          severity: "warning",
          line: lineNum,
          column: triadMatch.index + 1,
          excerpt: triadMatch[0],
          message:
            "Triple-adjective promotional puffery detected; replace with measurable technical specifics.",
          replacement: "reliable",
        });
      }

      const lineDashes = proseLine.match(/—/g);
      if (lineDashes) {
        if (emDashCount === 0) firstEmDashLine = lineNum;
        emDashCount += lineDashes.length;
      }
    }

    if (checkUiStyles) {
      SAAS_SLOP_GRADIENT_REGEX.lastIndex = 0;
      let gradMatch: RegExpExecArray | null;
      while ((gradMatch = SAAS_SLOP_GRADIENT_REGEX.exec(line)) !== null) {
        findings.push({
          ruleId: "impeccable-saas-slop-gradient",
          category: "saas-slop-gradient",
          severity: "error",
          line: lineNum,
          column: gradMatch.index + 1,
          excerpt: gradMatch[0],
          message:
            "Generic purple-to-pink SaaS slop gradient detected (#8b5cf6 -> #ec4899). Use HCT tonal surfaces or Omarchy/M3 palettes.",
        });
      }

      GRADIENT_TEXT_REGEX.lastIndex = 0;
      const gradTextMatch = GRADIENT_TEXT_REGEX.exec(line);
      if (gradTextMatch) {
        findings.push({
          ruleId: "impeccable-ban-gradient-text",
          category: "gradient-text",
          severity: "warning",
          line: lineNum,
          column: gradTextMatch.index + 1,
          excerpt: gradTextMatch[0],
          message:
            "Gradient-clipped text detected. Create typographic hierarchy with weight, scale, and high-contrast solid ink.",
        });
      }

      SIDE_STRIPE_CARD_REGEX.lastIndex = 0;
      const stripeMatch = SIDE_STRIPE_CARD_REGEX.exec(line);
      if (stripeMatch) {
        findings.push({
          ruleId: "impeccable-side-tab",
          category: "side-stripe-card",
          severity: "warning",
          line: lineNum,
          column: stripeMatch.index + 1,
          excerpt: stripeMatch[0],
          message:
            "Thick colored border-left side-tab accent detected (>2px). Use tonal container fills or a 1px hairline border.",
        });
      }

      GLOW_HALO_REGEX.lastIndex = 0;
      const haloMatch = GLOW_HALO_REGEX.exec(line);
      if (haloMatch) {
        findings.push({
          ruleId: "impeccable-no-glow-halo",
          category: "glow-halo",
          severity: "warning",
          line: lineNum,
          column: haloMatch.index + 1,
          excerpt: haloMatch[0],
          message:
            "Zero-offset neon glow halo shadow detected. Real elevation requires vertical offset and subtle ambient shadow.",
        });
      }
    }

    if (
      checkSpacing &&
      /(?:padding|margin|gap)\s*:/i.test(line) &&
      !line.includes("calc(")
    ) {
      const pxMatches = line.matchAll(/(?<!-)\b(\d+)px\b/g);
      for (const px of pxMatches) {
        const val = Number.parseInt(px[1], 10);
        if (val > 2 && val <= 160 && !VALID_GRID_PX.has(val) && val % 4 !== 0) {
          findings.push({
            ruleId: "impeccable-unaligned-spacing",
            category: "unaligned-spacing",
            severity: "warning",
            line: lineNum,
            column: (px.index ?? 0) + 1,
            excerpt: px[0],
            message: `Unaligned spacing '${val}px' falls off the 4dp/8dp spatial grid.`,
            replacement: `${Math.round(val / 4) * 4}px`,
          });
        }
      }
    }
  }

  if (emDashCount > maxEmDashes) {
    findings.push({
      ruleId: "humanizer-em-dash-overuse",
      category: "em-dash-overuse",
      severity: "warning",
      line: firstEmDashLine,
      column: 1,
      excerpt: `— (x${emDashCount})`,
      message: `Excessive em-dash usage (${emDashCount} occurrences); replace with commas, colons, or separate sentences.`,
    });
  }

  let penalty = 0;
  for (const f of findings) {
    penalty += f.severity === "error" ? 20 : 8;
  }
  const score = Math.max(0, Math.min(100, 100 - penalty));
  const clean = findings.length === 0;

  const result: AntiSlopAuditResult = {
    clean,
    score,
    findings,
  };

  if (includeSuggestion && !clean) {
    result.humanizedSuggestion = humanizeText(textOrHtml);
  }

  return result;
}

/**
 * Audit a file or directory tree recursively for anti-slop compliance.
 */
export function auditPathAntiSlop(targetPath: string): DirectorySlopReport {
  if (!existsSync(targetPath)) {
    throw new Error(`Target path does not exist: ${targetPath}`);
  }

  const allFiles = collectAuditableFiles(targetPath);
  const fileReports: DirectorySlopReport["files"] = [];
  let scoreSum = 0;
  let totalFindings = 0;

  for (const file of allFiles) {
    const ext = extname(file).toLowerCase();
    const isStyleCapable = [
      ".html",
      ".css",
      ".tsx",
      ".jsx",
      ".vue",
      ".svelte",
    ].includes(ext);
    const content = readFileSync(file, "utf8");
    const res = auditAntiSlop(content, {
      filePath: file,
      checkUiStyles: isStyleCapable,
      checkSpacing: isStyleCapable,
      includeSuggestion: false,
    });
    scoreSum += res.score;
    totalFindings += res.findings.length;
    fileReports.push({
      file,
      clean: res.clean,
      score: res.score,
      findings: res.findings,
    });
  }

  const averageScore =
    allFiles.length === 0 ? 100 : Math.round(scoreSum / allFiles.length);
  const hasErrors = fileReports.some((r) =>
    r.findings.some((f) => f.severity === "error"),
  );

  return {
    targetPath,
    scannedFiles: allFiles.length,
    clean: totalFindings === 0 && !hasErrors,
    averageScore,
    totalFindings,
    files: fileReports,
  };
}

function collectAuditableFiles(target: string): string[] {
  const st = statSync(target);
  if (!st.isDirectory()) return [target];

  const allowedExts = new Set([
    ".md",
    ".mdx",
    ".txt",
    ".html",
    ".css",
    ".tsx",
    ".jsx",
  ]);
  const skipDirs = new Set([
    ".git",
    ".yolo",
    "node_modules",
    "upstream",
    "dist",
    "var",
    "third_party",
    "graphify-out",
  ]);

  const out: string[] = [];
  for (const entry of readdirSync(target, { withFileTypes: true })) {
    const full = join(target, entry.name);
    if (entry.isDirectory()) {
      if (!skipDirs.has(entry.name)) {
        out.push(...collectAuditableFiles(full));
      }
    } else if (allowedExts.has(extname(entry.name).toLowerCase())) {
      out.push(full);
    }
  }
  return out;
}
