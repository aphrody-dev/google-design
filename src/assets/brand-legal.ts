/**
 * Open-Source Brand Identity, BIMI Tiny-PS Mail Marks, OFL Typography Kit & Bilingual Legal Notices
 * 100% Pure Bun v1.4.4 - Zero External Dependencies
 */

import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { synthesizePrdAndDesignMd } from "../spec/prd-design-md.ts";

export interface BrandLegalAssetFiles {
  files: string[];
  brandBook: Record<string, any>;
}

export function generateBrandAndLegalAssets(
  outDir: string,
): BrandLegalAssetFiles {
  const brandDir = join(outDir, "brand");
  const fontsDir = join(outDir, "fonts");
  const legalDir = join(outDir, "legal");

  mkdirSync(brandDir, { recursive: true });
  mkdirSync(fontsDir, { recursive: true });
  mkdirSync(legalDir, { recursive: true });

  const written: string[] = [];
  const write = (relPath: string, content: string) => {
    const abs = join(outDir, relPath);
    writeFileSync(abs, content, "utf8");
    written.push(abs);
  };

  // 1. Aphrody Brand Book JSON
  const brandBook = {
    name: "Aphrody",
    legalEntity: "Aphrody",
    domain: "aphrody.com",
    contactEmail: "contact@aphrody.com",
    version: "2.0.0",
    license: "CC0-1.0",
    positioning:
      "Generalist systems, web, desktop, Linux/WSL2 workstation, and creative software platform engineered with zero bloat.",
    solePublicAiProduct: "@aphrody/ai-os",
    colors: {
      primary: "#1A73E8",
      primaryDark: "#8AB4F8",
      ink: "#101418",
      paper: "#F8F9FA",
      obsidian: "#0D1117",
      emerald: "#10B981",
      amber: "#F59E0B",
      crimson: "#DC2626",
    },
    typography: {
      display: {
        family: "Space Grotesk",
        license: "SIL-OFL-1.1",
        weights: [500, 600, 700],
      },
      sans: {
        family: "Inter",
        license: "SIL-OFL-1.1",
        weights: [400, 500, 600],
      },
      mono: {
        family: "JetBrains Mono",
        license: "SIL-OFL-1.1",
        weights: [400, 500, 600],
      },
    },
    marks: {
      mark: "brand/aphrody-mark.svg",
      wordmark: "brand/aphrody-wordmark.svg",
      bimiTinyPs: "brand/aphrody-monogram-bimi.svg",
      favicon: "brand/favicon.svg",
    },
  };
  write("brand/brand-book.json", JSON.stringify(brandBook, null, 2));

  // 2.BRAND.md & Root DESIGN.md
  const brandMd = `# Aphrody Brand Identity & Usage Guidelines

## 1. Brand Architecture

Aphrody builds generalist systems, desktop compositors, publishing platforms, and creative software across \`aphrody.com\`, \`aphrody.app\`, \`dragonballfr.com\`, and \`rosegriffon.fr\`. \`@aphrody/ai-os\` is the sole public AI product; every other surface uses sober, high-clarity technical design without AI marketing tropes or decorative emojis.

## 2. Logomarks & Clear Space

- **Primary Mark (\`brand/aphrody-mark.svg\`)**: Precision geometric A-prism inscribed on a 24x24 pixel grid. Maintain a minimum clear space of \`25%\` of the mark width on all four sides.
- **Wordmark (\`brand/aphrody-wordmark.svg\`)**: Geometric uppercase \`APHRODY\` lockup paired with the A-prism emblem.
- **BIMI Tiny-PS Monogram (\`brand/aphrody-monogram-bimi.svg\`)**: RFC/BIMI SVG Tiny Portable/Secure compliant square emblem (\`baseProfile="tiny-ps"\`, explicit \`<title>Aphrody</title>\`, solid vector paths, zero scripts or external references) ready for \`mail.aphrody.com\` DNS BIMI records.
- **Favicon (\`brand/favicon.svg\`)**: Adaptive \`prefers-color-scheme\` vector icon legible down to \`16x16px\`.

## 3. Color & Typography Discipline

- **Core Anchors**: Aphrody Cobalt (\`#1A73E8\` light / \`#8AB4F8\` dark), Paper (\`#F8F9FA\`), Obsidian (\`#0D1117\`), and Ink (\`#101418\`).
- **Open Font License (OFL) Type Suite**: \`Space Grotesk\` for display and architectural headings, \`Inter\` for dense UI and long-form reading, and \`JetBrains Mono\` for code, hashes, and tabular telemetry.
`;
  write("brand/BRAND.md", brandMd);

  const specBundle = synthesizePrdAndDesignMd({
    name: "Aphrody Sovereign Design System",
    domain: "aphrody.com",
    seedColor: "#1A73E8",
    mode: "operate",
  });
  write("brand/DESIGN.md", specBundle.designMarkdown);
  write("brand/PRD.md", specBundle.prdMarkdown);

  // 3. SVG Marks (crisp 24x24 / geometric vectors)
  const aphrodyMarkSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="96" height="96" fill="none">
  <title>Aphrody Mark</title>
  <rect x="2" y="2" width="20" height="20" rx="5" fill="#101418"/>
  <path d="M12 5.5L17.75 18.5H15.1L13.85 15.5H10.15L8.9 18.5H6.25L12 5.5ZM10.95 13.35H13.05L12 10.65L10.95 13.35Z" fill="#F8F9FA"/>
  <circle cx="12" cy="17.25" r="1.15" fill="#1A73E8"/>
</svg>
`;
  write("brand/aphrody-mark.svg", aphrodyMarkSvg);

  const aphrodyWordmarkSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 220 40" width="220" height="40" fill="none">
  <title>Aphrody</title>
  <rect x="4" y="4" width="32" height="32" rx="8" fill="#101418"/>
  <path d="M20 9.5L29.2 30.5H25L23 25.7H17L15 30.5H10.8L20 9.5ZM18.3 22.3H21.7L20 18L18.3 22.3Z" fill="#F8F9FA"/>
  <circle cx="20" cy="28.5" r="1.8" fill="#1A73E8"/>
  <g fill="#101418">
    <path d="M56 12L63.5 28H60.2L58.6 24.4H53.4L51.8 28H48.5L56 12ZM54.6 21.7H57.4L56 18.2L54.6 21.7Z"/>
    <path d="M68 12H74.6C78 12 80.2 14 80.2 17C80.2 20 78 22 74.6 22H71.2V28H68V12ZM71.2 14.8V19.2H74.3C76.1 19.2 77 18.4 77 17C77 15.6 76.1 14.8 74.3 14.8H71.2Z"/>
    <path d="M85 12H88.2V18.5H95.4V12H98.6V28H95.4V21.4H88.2V28H85V12Z"/>
    <path d="M104.2 12H111.2C114.6 12 116.8 13.9 116.8 16.8C116.8 19 115.5 20.6 113.4 21.3L117.2 28H113.6L110.2 21.7H107.4V28H104.2V12ZM107.4 14.8V19.1H110.9C112.7 19.1 113.6 18.3 113.6 16.9C113.6 15.6 112.7 14.8 110.9 14.8H107.4Z"/>
    <path d="M128.6 11.7C133.4 11.7 137 15.2 137 20C137 24.8 133.4 28.3 128.6 28.3C123.8 28.3 120.2 24.8 120.2 20C120.2 15.2 123.8 11.7 128.6 11.7ZM128.6 14.6C125.6 14.6 123.5 16.9 123.5 20C123.5 23.1 125.6 25.4 128.6 25.4C131.6 25.4 133.7 23.1 133.7 20C133.7 16.9 131.6 14.6 128.6 14.6Z"/>
    <path d="M141.8 12H147.8C152.8 12 156.2 15.2 156.2 20C156.2 24.8 152.8 28 147.8 28H141.8V12ZM145 14.9V25.1H147.6C150.9 25.1 152.9 23.1 152.9 20C152.9 16.9 150.9 14.9 147.6 14.9H145Z"/>
    <path d="M164.6 21.6L158.8 12H162.5L166.3 18.6L170.1 12H173.7L167.8 21.6V28H164.6V21.6Z"/>
  </g>
</svg>
`;
  write("brand/aphrody-wordmark.svg", aphrodyWordmarkSvg);

  // Strict BIMI SVG Tiny-PS (version="1.2" baseProfile="tiny-ps", square viewBox, <title>, no rx on rect, pure paths)
  const bimiTinyPsSvg = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<svg version="1.2" baseProfile="tiny-ps" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <title>Aphrody</title>
  <rect x="0" y="0" width="100" height="100" fill="#101418"/>
  <path d="M50 18L78 82H65L59 68H41L35 82H22L50 18ZM44.5 57.5H55.5L50 43.5L44.5 57.5Z" fill="#F8F9FA"/>
  <circle cx="50" cy="76" r="5.5" fill="#1A73E8"/>
</svg>
`;
  write("brand/aphrody-monogram-bimi.svg", bimiTinyPsSvg);

  const faviconSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
  <style>
    .bg { fill: #101418; }
    .fg { fill: #F8F9FA; }
    .dot { fill: #1A73E8; }
    @media (prefers-color-scheme: dark) {
      .bg { fill: #161B22; }
      .dot { fill: #8AB4F8; }
    }
  </style>
  <rect class="bg" x="1" y="1" width="22" height="22" rx="5"/>
  <path class="fg" d="M12 5L18.2 19H15.4L14.1 15.8H9.9L8.6 19H5.8L12 5ZM10.8 13.5H13.2L12 10.4L10.8 13.5Z"/>
  <circle class="dot" cx="12" cy="17.5" r="1.25"/>
</svg>
`;
  write("brand/favicon.svg", faviconSvg);

  // 4. Open Font License (OFL) Zero-CLS Typography Kit
  const typographyCss = `/**
 * Aphrody Open Font License (SIL-OFL-1.1) Zero-CLS Typography Kit
 * Metric-matched local & variable font fallbacks (CLS = 0.00)
 */

@font-face {
  font-family: "Inter Fallback";
  src: local("Segoe UI"), local("Roboto"), local("Helvetica Neue"), local("Arial");
  size-adjust: 107.0%;
  ascent-override: 90.2%;
  descent-override: 22.5%;
  line-gap-override: 0.0%;
}

@font-face {
  font-family: "Space Grotesk Fallback";
  src: local("Segoe UI Semibold"), local("Arial");
  size-adjust: 103.5%;
  ascent-override: 94.0%;
  descent-override: 24.0%;
  line-gap-override: 0.0%;
}

@font-face {
  font-family: "JetBrains Mono Fallback";
  src: local("Cascadia Mono"), local("Consolas"), local("Liberation Mono");
  size-adjust: 100.0%;
  ascent-override: 96.0%;
  descent-override: 24.0%;
  line-gap-override: 0.0%;
}

:root {
  --aph-font-display: "Space Grotesk", "Space Grotesk Fallback", system-ui, sans-serif;
  --aph-font-sans: "Inter", "Inter Fallback", system-ui, -apple-system, sans-serif;
  --aph-font-mono: "JetBrains Mono", "JetBrains Mono Fallback", ui-monospace, monospace;

  --aph-text-xs: 0.75rem;
  --aph-text-sm: 0.875rem;
  --aph-text-base: 0.9375rem;
  --aph-text-lg: 1.125rem;
  --aph-text-xl: 1.375rem;
  --aph-text-2xl: 1.75rem;
  --aph-text-3xl: 2.25rem;
  --aph-text-4xl: 3rem;
}

body {
  font-family: var(--aph-font-sans);
  font-size: var(--aph-text-base);
  line-height: 1.55;
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
}

h1, h2, h3, .aph-display {
  font-family: var(--aph-font-display);
  letter-spacing: -0.02em;
  text-wrap: balance;
}

code, pre, kbd, samp, .aph-tabular {
  font-family: var(--aph-font-mono);
  font-variant-numeric: tabular-nums;
}
`;
  write("fonts/typography.css", typographyCss);

  const fontManifest = {
    version: "1.0.0",
    license: "SIL-OFL-1.1",
    zeroClsFallbackConfigured: true,
    families: [
      {
        name: "Inter",
        role: "body-ui",
        license: "SIL-OFL-1.1",
        copyright: "Copyright The Inter Project Authors",
        unicodeSubsets: ["U+0000-00FF", "U+0100-024F", "U+2000-206F"],
        axes: { wght: [400, 700], opsz: [14, 32] },
        fallbackMetrics: {
          sizeAdjust: "107.0%",
          ascentOverride: "90.2%",
          descentOverride: "22.5%",
        },
      },
      {
        name: "Space Grotesk",
        role: "display-headline",
        license: "SIL-OFL-1.1",
        copyright: "Copyright Florian Karsten",
        unicodeSubsets: ["U+0000-00FF", "U+0100-024F"],
        axes: { wght: [400, 700] },
        fallbackMetrics: {
          sizeAdjust: "103.5%",
          ascentOverride: "94.0%",
          descentOverride: "24.0%",
        },
      },
      {
        name: "JetBrains Mono",
        role: "code-telemetry",
        license: "SIL-OFL-1.1",
        copyright: "Copyright JetBrains s.r.o.",
        unicodeSubsets: ["U+0000-00FF"],
        axes: { wght: [400, 700] },
        fallbackMetrics: {
          sizeAdjust: "100.0%",
          ascentOverride: "96.0%",
          descentOverride: "24.0%",
        },
      },
    ],
  };
  write("fonts/font-manifest.json", JSON.stringify(fontManifest, null, 2));

  // 5. Bilingual Legal Notices (FR LCEN / RGPD + EN)
  write(
    "legal/mentions-legales-fr.md",
    `# Mentions Legales

Conformement aux dispositions de la loi n 2004-575 du 21 juin 2004 pour la confiance dans l'economie numerique (LCEN), les utilisateurs des services Aphrody sont informes de l'identite des intervenants impliques dans leur realisation et leur suivi.

## 1. Editeur de la Plateforme

- **Denomination** : Aphrody
- **Domaine principal** : \`https://aphrody.com\`
- **Adresse electronique de contact** : \`contact@aphrody.com\`
- **Direction de la publication** : Aphrody

## 2. Hebergement & Infrastructure Reseau

Les services et ressources statiques sont distribues sur une infrastructure souveraine multi-noeuds en Union Europeenne (France, OVHcloud SAS, 2 rue Kellermann, 59100 Roubaix, France) protegee par routage chiffre WireGuard et Cloudflare.

## 3. Propriete Intellectuelle & Banque d'Actifs Ouverts

Les logiciels et actifs graphiques, sonores, tridimensionnels et typographiques distribues dans la banque creative Aphrody sont places sous licences libres explicites (\`CC0-1.0\`, \`MIT\` et \`SIL-OFL-1.1\`), detaillees dans \`legal/open-source-licenses.json\`.
`,
  );

  write(
    "legal/legal-notice-en.md",
    `# Legal Notice

## 1. Publisher Information

- **Organization**: Aphrody
- **Primary Domain**: \`https://aphrody.com\`
- **Contact Email**: \`contact@aphrody.com\`
- **Publication Director**: Aphrody

## 2. Hosting & Network Security

Services are hosted on European Union dedicated cloud infrastructure (OVHcloud SAS, 2 rue Kellermann, 59100 Roubaix, France) interconnected via encrypted WireGuard and MASQUE transport.

## 3. Open-Source Creative Assets & Licensing

All first-party generated vector icons, stylesheets, animated Open Pets, architectural wallpapers, glTF/GLB 3D meshes, and acoustic UI waveforms in the Aphrody Creative Asset Bank are published under open-source licenses (\`CC0-1.0\`, \`MIT\`, and \`SIL-OFL-1.1\`) as cataloged in \`legal/open-source-licenses.json\`.
`,
  );

  write(
    "legal/privacy-rgpd-fr.md",
    `# Politique de Confidentialite & Protection des Donnees (RGPD)

## 1. Responsable du Traitement

Le responsable du traitement des donnees personnelles est **Aphrody** (\`contact@aphrody.com\`).

## 2. Minimisation des Donnees & Absence de Pistage Publicitaire

Aphrody applique le principe strict de minimisation des donnees (Article 5 du Reglement UE 2016/679 — RGPD) :
- Aucun traceur publicitaire tiers, pixel de reciblage ni revente de donnees personnelles.
- Les journaux techniques de securite (adresses IP anonymisees, codes de statut HTTP) sont conserves pour une duree maximale de 30 jours aux seules fins de prevention des abus et de diagnostic reseau.
- Les polices (\`SIL-OFL-1.1\`), icones SVG et feuilles de style sont servies localement sans requete vers des serveurs tiers.

## 3. Droits des Utilisateurs

Conformement aux articles 15 a 22 du RGPD, vous disposez d'un droit d'acces, de rectification, d'effacement, de limitation et de portabilite de vos donnees en ecrivant a \`contact@aphrody.com\`.
`,
  );

  write(
    "legal/terms-cgu-fr.md",
    `# Conditions Generales d'Utilisation (CGU)

## 1. Objet

Les presentes Conditions Generales d'Utilisation definissent les modalites d'acces et d'utilisation des plateformes numeriques, logiciels et banques d'actifs edites par **Aphrody** (\`aphrody.com\`, \`aphrody.app\`).

## 2. Acces au Service &Disponibilite

L'acces aux ressources publiques et a la banque d'actifs ouverts est gratuit. Aphrody met en oeuvre des architectures deterministes a haute disponibilite sans toutefois garantir l'absence totale d'interruptions liees a la maintenance technique.

## 3. Utilisation des Actifs Ouverts

Les actifs publies sous licence \`CC0-1.0\` ou \`MIT\` peuvent etre telecharges, modifies et integres librement dans tout projet personnel ou commercial, sous reserve du respect des avis de licence correspondants dans \`legal/open-source-licenses.json\`.

## 4. Contact & Droit Applicable

Les presentes CGU sont regies par le droit francais. Toute question relative a leur application peut etre adressee a \`contact@aphrody.com\`.
`,
  );

  const licensesJson = {
    owner: "Aphrody",
    contact: "contact@aphrody.com",
    generatedBy: "@aphrody/google-design",
    defaultAssetLicense: "CC0-1.0",
    codeAndEncoderLicense: "MIT",
    fontLicense: "SIL-OFL-1.1",
    categories: {
      brandMarks: {
        license: "CC-BY-4.0",
        notes:
          "Aphrody logomarks and BIMI emblem identify official Aphrody surfaces.",
      },
      iconsAndSprites: {
        license: "CC0-1.0",
        spdxUrl: "https://spdx.org/licenses/CC0-1.0.html",
      },
      themesAndStylesheets: {
        license: "MIT",
        spdxUrl: "https://spdx.org/licenses/MIT.html",
      },
      openPets: {
        license: "CC0-1.0",
        spdxUrl: "https://spdx.org/licenses/CC0-1.0.html",
      },
      wallpapers: {
        license: "CC0-1.0",
        spdxUrl: "https://spdx.org/licenses/CC0-1.0.html",
      },
      models3d: {
        license: "CC0-1.0",
        spdxUrl: "https://spdx.org/licenses/CC0-1.0.html",
      },
      audioAndMotion: {
        license: "CC0-1.0",
        spdxUrl: "https://spdx.org/licenses/CC0-1.0.html",
      },
      typography: {
        license: "SIL-OFL-1.1",
        spdxUrl: "https://spdx.org/licenses/OFL-1.1.html",
      },
    },
  };
  write(
    "legal/open-source-licenses.json",
    JSON.stringify(licensesJson, null, 2),
  );

  return { files: written, brandBook };
}
