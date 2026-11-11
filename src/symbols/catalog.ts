/**
 * Material Symbols + Aphrody Pet Symbols Vector Catalog, Optimizer & Inline SVG Generator
 * 100% Pure Bun v1.4.4 - Zero External Dependencies
 * Coordinate space: standard crisp Google Material Symbols viewBox="0 -960 960 960"
 */

import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

export type M3IconStyle = "outlined" | "rounded" | "sharp";

export interface M3IconOptions {
  name: string;
  style?: M3IconStyle;
  fill?: number;
  weight?: number;
  grade?: number;
  opticalSize?: number;
  size?: number;
  className?: string;
  ariaLabel?: string;
}

export interface SymbolDescriptor {
  name: string;
  style: M3IconStyle;
  fill: 0 | 1;
  weight: number;
  size: 20 | 24 | 40 | 48;
  svgPath: string;
}

export interface SymbolSearchResult {
  name: string;
  category: string;
  availableStyles: string[];
  svg: string;
}

const UPSTREAM_SYMBOLS_DIR = join(
  import.meta.dir,
  "../../upstream/material-design-icons/symbols/web",
);
const DESIGN_SYSTEM_SOURCES_DIR = join(
  import.meta.dir,
  "../../../../crates/design-system/crates/aphrody-design-icons/sources/material-symbols",
);
const PET_SYMBOLS_DIR = join(import.meta.dir, "../../assets/symbols/svg");
const MATERIAL_INDEX_JSON = join(
  import.meta.dir,
  "../../assets/symbols/material-symbols-index.json",
);

/**
 * Crisp 0 -960 960 960 Material Design 3 vector paths (pre-minified, lossless)
 */
export const OPTIMIZED_M3_PATHS: Readonly<Record<string, string>> = {
  search:
    "M784-120 532-372q-30 24-69 38t-83 14q-109 0-184.5-75.5T120-580q0-109 75.5-184.5T380-840q109 0 184.5 75.5T640-580q0 44-14 83t-38 69l252 252-56 56ZM380-400q75 0 127.5-52.5T560-580q0-75-52.5-127.5T380-760q-75 0-127.5 52.5T200-580q0 75 52.5 127.5T380-400Z",
  home: "M240-200h120v-240h240v240h120v-360L480-740 240-560v360Zm-80 80v-480l320-240 320 240v480H520v-240h-80v240H160Zm320-350Z",
  settings:
    "m370-80-16-128q-13-5-24.5-12T307-235l-119 50L78-375l103-78q-1-7-1-13.5v-27q0-6.5 1-13.5L78-585l110-190 119 50q11-8 23-15t24-12l16-128h220l16 128q13 5 24.5 12t22.5 15l119-50 110 190-103 78q1 7 1 13.5v27q0 6.5-2 13.5l103 78-110 190-118-50q-11 8-23 15t-24 12L590-80H370Zm112-260q58 0 99-41t41-99q0-58-41-99t-99-41q-59 0-99.5 41T342-480q0 58 40.5 99t99.5 41Z",
  mic: "M480-400q-50 0-85-35t-35-85v-240q0-50 35-85t85-35q50 0 85 35t35 85v240q0 50-35 85t-85 35Zm-40 280v-123q-104-14-172-93t-68-184h80q0 83 58.5 141.5T480-320q83 0 141.5-58.5T680-520h80q0 105-68 184t-172 93v123h-80Z",
  photo_camera:
    "M480-260q75 0 127.5-52.5T660-440q0-75-52.5-127.5T480-620q-75 0-127.5 52.5T300-440q0 75 52.5 127.5T480-260Zm0-80q-42 0-71-29t-29-71q0-42 29-71t71-29q42 0 71 29t29 71q0 42-29 71t-71 29ZM160-120q-33 0-56.5-23.5T80-200v-480q0-33 23.5-56.5T160-760h126l74-80h240l74 80h126q33 0 56.5 23.5T880-680v480q0 33-23.5 56.5T800-120H160Z",
  apps: "M240-640q-33 0-56.5-23.5T160-720q0-33 23.5-56.5T240-800q33 0 56.5 23.5T320-720q0 33-23.5 56.5T240-640Zm240 0q-33 0-56.5-23.5T400-720q0-33 23.5-56.5T480-800q33 0 56.5 23.5T560-720q0 33-23.5 56.5T480-640Zm240 0q-33 0-56.5-23.5T640-720q0-33 23.5-56.5T720-800q33 0 56.5 23.5T800-720q0 33-23.5 56.5T720-640ZM240-400q-33 0-56.5-23.5T160-480q0-33 23.5-56.5T240-560q33 0 56.5 23.5T320-480q0 33-23.5 56.5T240-400Zm240 0q-33 0-56.5-23.5T400-480q0-33 23.5-56.5T480-560q33 0 56.5 23.5T560-480q0 33-23.5 56.5T480-400Zm240 0q-33 0-56.5-23.5T640-480q0-33 23.5-56.5T720-560q33 0 56.5 23.5T800-480q0 33-23.5 56.5T720-400ZM240-160q-33 0-56.5-23.5T160-240q0-33 23.5-56.5T240-320q33 0 56.5 23.5T320-240q0 33-23.5 56.5T240-160Zm240 0q-33 0-56.5-23.5T400-240q0-33 23.5-56.5T480-320q33 0 56.5 23.5T560-240q0 33-23.5 56.5T480-160Zm240 0q-33 0-56.5-23.5T640-240q0-33 23.5-56.5T720-320q33 0 56.5 23.5T800-240q0 33-23.5 56.5T720-160Z",
  dark_mode:
    "M480-120q-150 0-255-105T120-480q0-150 105-255t255-105q14 0 27.5 1t26.5 3q-41 29-65.5 75.5T444-660q0 90 63 153t153 63q55 0 101-24.5t75-65.5q2 13 3 26.5t1 27.5q0 150-105 255T480-120Z",
  light_mode:
    "M480-360q50 0 85-35t35-85q0-50-35-85t-85-35q-50 0-85 35t-35 85q0 50 35 85t85 35Zm0 80q-83 0-141.5-58.5T280-480q0-83 58.5-141.5T480-680q83 0 141.5 58.5T680-480q0 83-58.5 141.5T480-280ZM200-440H40v-80h160v80Zm720 0H760v-80h160v80ZM440-760v-160h80v160h-80Zm0 720v-160h80v160h-80Z",
  palette:
    "M480-80q-82 0-155-31.5t-127.5-86Q143-252 111.5-325T80-480q0-83 32.5-156t88-127Q256-817 330-848.5T488-880q80 0 151 27.5t124.5 76q53.5 48.5 85 115T880-518q0 115-70 176.5T640-280h-74q-9 0-12.5 5t-3.5 11q0 12 15 34.5t15 51.5q0 50-27.5 74T480-80Zm-220-400q26 0 43-17t17-43q0-26-17-43t-43-17q-26 0-43 17t-17 43q0 26 17 43t43 17Zm120-160q26 0 43-17t17-43q0-26-17-43t-43-17q-26 0-43 17t-17 43q0 26 17 43t43 17Zm200 0q26 0 43-17t17-43q0-26-17-43t-43-17q-26 0-43 17t-17 43q0 26 17 43t43 17Zm120 160q26 0 43-17t17-43q0-26-17-43t-43-17q-26 0-43 17t-17 43q0 26 17 43t43 17Z",
  terminal:
    "M160-160q-33 0-56.5-23.5T80-240v-480q0-33 23.5-56.5T160-800h640q33 0 56.5 23.5T880-720v480q0 33-23.5 56.5T800-160H160Zm0-80h640v-400H160v400Zm140-40-56-56 103-104-104-104 57-56 160 160-160 160Zm180 0v-80h240v80H480Z",
  memory:
    "M360-360v-240h240v240H360Zm80-80h80v-80h-80v80Zm-80 320v-80h-80q-33 0-56.5-23.5T200-280v-80h-80v-80h80v-80h-80v-80h80v-80q0-33 23.5-56.5T280-760h80v-80h80v80h80v-80h80v80h80q33 0 56.5 23.5T760-680v80h80v80h-80v80h80v80h-80v80q0 33-23.5 56.5T680-200h-80v80h-80v-80h-80v80h-80Z",
  folder:
    "M160-160q-33 0-56.5-23.5T80-240v-480q0-33 23.5-56.5T160-800h240l80 80h320q33 0 56.5 23.5T880-640v400q0 33-23.5 56.5T800-160H160Z",
  description:
    "M320-240h320v-80H320v80Zm0-160h320v-80H320v80ZM240-80q-33 0-56.5-23.5T160-160v-640q0-33 23.5-56.5T240-880h320l240 240v480q0 33-23.5 56.5T720-80H240Zm280-520h200L520-800v200Z",
  table_chart:
    "M120-720v560q0 33 23.5 56.5T200-80h560q33 0 56.5-23.5T840-160v-560q0-33-23.5-56.5T760-800H200q-33 0-56.5 23.5T120-720Zm80 160h560v-160H200v160Zm200 80v320h160v-320H400Zm240 320h120v-320H640v320ZM200-480v320h120v-320H200Z",
  slideshow:
    "M380-360l280-180-280-180v360ZM200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h560q33 0 56.5 23.5T840-760v560q0 33-23.5 56.5T760-120H200Z",
  brush:
    "M240-120q-45 0-89-22t-71-58q26 0 53-20.5t27-59.5q0-50 35-85t85-35q50 0 85 35t35 85q0 66-47 113t-113 47Zm230-240L360-470l358-358q11-11 27.5-11.5T774-828l54 54q12 12 12 28t-12 28L470-360Z",
  draw: "M200-200h57l391-391-57-57-391 391v57Zm-80 80v-170l528-527q12-11 26.5-17t30.5-6q16 0 31 6t26 18l55 56q12 11 17.5 26t5.5 30q0 16-5.5 30.5T817-647L290-120H120Z",
  view_in_ar:
    "M440-183v-274L200-596v274l240 139Zm80 0 240-139v-274L520-457v274Zm-40-343 237-137-237-137-237 137 237 137ZM120-252v-456l360-208 360 208v456L480-44 120-252Z",
  graphic_eq:
    "M280-240v-480h80v480h-80Zm160 160v-800h80v800h-80ZM120-400v-160h80v160h-80Zm480 160v-480h80v480h-80Zm160-160v-160h80v160h-80Z",
  code: "M320-240 80-480l240-240 57 57-184 184 183 183-56 56Zm320 0-57-57 184-184-183-183 56-56 240 240-240 240Z",
  mail: "M160-160q-33 0-56.5-23.5T80-240v-480q0-33 23.5-56.5T160-800h640q33 0 56.5 23.5T880-720v480q0 33-23.5 56.5T800-160H160Zm320-280L160-640v400h640v-400L480-440Zm0-80 320-200H160l320 200Z",
  photo_library:
    "M360-400h400L622-580l-92 120-62-80-108 140Zm-40 160q-33 0-56.5-23.5T240-320v-480q0-33 23.5-56.5T320-880h480q33 0 56.5 23.5T880-800v480q0 33-23.5 56.5T800-240H320ZM160-80q-33 0-56.5-23.5T80-160v-560h80v560h560v80H160Z",
  sticky_note_2:
    "M200-200h360v-200h200v-360H200v560Zm0 80q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h560q33 0 56.5 23.5T840-760v400L600-120H200Z",
  calendar_month:
    "M200-80q-33 0-56.5-23.5T120-160v-560q0-33 23.5-56.5T200-800h40v-80h80v80h320v-80h80v80h40q33 0 56.5 23.5T840-720v560q0 33-23.5 56.5T760-80H200Zm0-80h560v-400H200v400Z",
  contacts:
    "M160-80q-33 0-56.5-23.5T80-160v-640q0-33 23.5-56.5T160-880h640q33 0 56.5 23.5T880-800v640q0 33-23.5 56.5T800-80H160Zm320-400q50 0 85-35t35-85q0-50-35-85t-85-35q-50 0-85 35t-35 85q0 50 35 85t85 35ZM240-240h480v-48q0-45-44-73.5T480-390q-152 0-196 28.5T240-288v48Z",
  translate:
    "m476-80 182-480h84L924-80h-84l-43-122H603L560-80h-84ZM160-200l-56-56 202-202q-35-35-63.5-80T190-640h84q20 39 40 68t48 58q33-33 68.5-92.5T484-720H40v-80h280v-80h80v80h280v80H564q-21 72-63 148t-83 116l96 98-30 82-122-125-202 201Zm468-72h144l-72-204-72 204Z",
  visibility:
    "M480-320q75 0 127.5-52.5T660-500q0-75-52.5-127.5T480-680q-75 0-127.5 52.5T300-500q0 75 52.5 127.5T480-320Zm0-72q-45 0-76.5-31.5T372-500q0-45 31.5-76.5T480-608q45 0 76.5 31.5T588-500q0 45-31.5 76.5T480-392Zm0 192q-146 0-266-81.5T40-500q54-137 174-218.5T480-800q146 0 266 81.5T920-500q-54 137-174 218.5T480-200Z",
  shield_lock:
    "M480-80q-139-35-229.5-159.5T160-516v-244l320-120 320 120v244q0 152-90.5 276.5T480-80Zm0-360q33 0 56.5-23.5T560-520q0-33-23.5-56.5T480-600q-33 0-56.5 23.5T400-520q0 33 23.5 56.5T480-440Zm-80 120h160v-40q0-33-23.5-56.5T480-440q-33 0-56.5 23.5T400-360v40Z",
  dns: "M200-120q-33 0-56.5-23.5T120-200v-160q0-33 23.5-56.5T200-440h560q33 0 56.5 23.5T840-360v160q0 33-23.5 56.5T760-120H200Zm80-120q17 0 28.5-11.5T320-280q0-17-11.5-28.5T280-320q-17 0-28.5 11.5T240-280q0 17 11.5 28.5T280-240ZM200-520q-33 0-56.5-23.5T120-600v-160q0-33 23.5-56.5T200-840h560q33 0 56.5 23.5T840-760v160q0 33-23.5 56.5T760-520H200Zm80-120q17 0 28.5-11.5T320-680q0-17-11.5-28.5T280-720q-17 0-28.5 11.5T240-680q0 17 11.5 28.5T280-640Z",
  travel_explore:
    "M784-120 532-372q-30 24-69 38t-83 14q-109 0-184.5-75.5T120-580q0-109 75.5-184.5T380-840q109 0 184.5 75.5T640-580q0 44-14 83t-38 69l252 252-56 56ZM380-400q75 0 127.5-52.5T560-580q0-75-52.5-127.5T380-760q-75 0-127.5 52.5T200-580q0 75 52.5 127.5T380-400Z",
  bolt: "m280-80 160-300-320-40 480-460h80L520-580l320 40L360-80h-80Z",
  hub: "M480-400q-33 0-56.5-23.5T400-480q0-33 23.5-56.5T480-560q33 0 56.5 23.5T560-480q0 33-23.5 56.5T480-400ZM200-120q-33 0-56.5-23.5T120-200q0-33 23.5-56.5T200-280q24 0 43 11.5t29 30.5l129-129q-19-20-30.5-44.5T359-465l-139-70q-20 18-45 26.5T120-500q-33 0-56.5-23.5T40-580q0-33 23.5-56.5T120-660q33 0 56.5 23.5T200-580q0 8-1.5 15t-4.5 14l142 71q27-44 71-69.5T508-575l32-145q-28-14-44-40t-16-58q0-42 29-71t71-29q42 0 71 29t29 71q0 42-29 71t-71 29q-6 0-12-.5t-12-2.5l-31 142q47 22 76.5 65T640-440q0 12-1.5 23.5T634-394l112 84q15-14 34-22t40-8q42 0 71 29t29 71q0 42-29 71t-71 29q-42 0-71-29t-29-71q0-14 3.5-27t10.5-24l-115-86q-30 35-72.5 55.5T452-301l-129 129q8 13 12.5 27.5T340-115q0 33-23.5 56.5T260-35Z",
  check: "M382-240 154-468l57-57 171 171 367-367 57 57-424 424Z",
  check_circle:
    "m424-296 282-282-56-56-226 226-114-114-56 56 170 170Zm56 216q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Z",
  warning:
    "M40-120l440-760 440 760H40Zm440-120q17 0 28.5-11.5T520-280q0-17-11.5-28.5T480-320q-17 0-28.5 11.5T440-280q0 17 11.5 28.5T480-240Zm-40-120h80v-200h-80v200Z",
  close:
    "m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z",
  add: "M440-440H200v-80h240v-240h80v240h240v80H520v240h-80v-240Z",
  delete:
    "M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm80-160h80v-360h-80v360Zm160 0h80v-360h-80v360Z",
  download:
    "M480-320 280-520l56-58 104 104v-326h80v326l104-104 56 58-200 200ZM240-160q-33 0-56.5-23.5T160-240v-120h80v120h480v-120h80v120q0 33-23.5 56.5T720-160H240Z",
  upload:
    "M440-320v-326L336-542l-56-58 200-200 200 200-56 58-104-104v326h-80ZM240-160q-33 0-56.5-23.5T160-240v-120h80v120h480v-120h80v120q0 33-23.5 56.5T720-160H240Z",
  play_arrow: "M320-200v-560l440 280-440 280Z",
  refresh:
    "M480-160q-134 0-227-93t-93-227q0-134 93-227t227-93q69 0 132 28.5T720-690v-110h80v280H520v-80h168q-32-56-87.5-88T480-720q-100 0-170 70t-70 170q0 100 70 170t170 70q77 0 139-44t87-116h84q-28 106-114 173t-196 67Z",
  pets: "M180-475q-42 0-71-29t-29-71q0-42 29-71t71-29q42 0 71 29t29 71q0 42-29 71t-71 29Zm180-160q-42 0-71-29t-29-71q0-42 29-71t71-29q42 0 71 29t29 71q0 42-29 71t-71 29Zm240 0q-42 0-71-29t-29-71q0-42 29-71t71-29q42 0 71 29t29 71q0 42-29 71t-71 29Zm180 160q-42 0-71-29t-29-71q0-42 29-71t71-29q42 0 71 29t29 71q0 42-29 71t-71 29ZM266-75q-45 0-75.5-34.5T160-191q0-52 35.5-91t70.5-77q29-31 50-67.5t50-68.5q22-26 51-43t63-17q34 0 63 16t51 42q28 32 49.5 69t50.5 69q35 38 70.5 77t35.5 91q0 47-30.5 81.5T694-75q-54 0-107-9t-107-9q-54 0-107 9t-107 9Z",
  layers:
    "M480-118 120-398l66-50 294 228 294-228 66 50-360 280Zm0-202L120-600l360-280 360 280-360 280Z",
  grid_view:
    "M120-520v-320h320v320H120Zm0 400v-320h320v320H120Zm400-400v-320h320v320H520Zm0 400v-320h320v320H520Z",
  arrow_back:
    "m313-440 224 224-57 56-320-320 320-320 57 56-224 224h487v80H313Z",
  arrow_forward:
    "M647-440H160v-80h487L423-744l57-56 320 320-320 320-57-56 224-224Z",
};

/**
 * Minify and sanitize an SVG document, normalizing excess whitespace and unsafe attributes.
 */
export function optimizeSvgMarkup(svg: string, size?: number): string {
  let clean = svg
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/<\?xml[\s\S]*?\?>/gi, "")
    .replace(/\s+/g, " ")
    .replace(/>\s+</g, "><")
    .replace(/\s(on\w+|xmlns:xlink)="[^"]*"/gi, "")
    .trim();

  if (size !== undefined && Number.isFinite(size) && size > 0) {
    clean = clean.replace(/<svg\b[^>]*>/, (tag) =>
      tag
        .replace(/\s(width|height)="[^"]*"/g, "")
        .replace(/^<svg\b/, `<svg width="${size}" height="${size}"`),
    );
  }
  return clean;
}

/**
 * Load an AphrodyPetSymbols SVG (`pet_idle`, `pet_jump`, `pet_run`, `pet_wave`)
 */
export function getAphrodyPetSymbolSvg(
  name: "pet_idle" | "pet_jump" | "pet_run" | "pet_wave",
  style: M3IconStyle = "outlined",
  weight: 100 | 300 | 400 | 500 | 700 = 400,
  size = 24,
): string {
  const filePath = join(PET_SYMBOLS_DIR, style, `wght${weight}`, `${name}.svg`);
  if (existsSync(filePath)) {
    return optimizeSvgMarkup(readFileSync(filePath, "utf8"), size);
  }
  return m3Icon({ name: "pets", style, size });
}

/**
 * Render any Material Symbol or Aphrody Pet Symbol as a crisp, optimized standalone SVG string.
 */
export function m3Icon(options: M3IconOptions): string {
  const style: M3IconStyle = options.style ?? "outlined";
  const size = options.size ?? options.opticalSize ?? 24;
  const weight = options.weight ?? 400;
  const fill = (options.fill ?? 0) >= 0.5 ? 1 : 0;
  const name = options.name.trim().toLowerCase();

  if (
    name === "pet_idle" ||
    name === "pet_jump" ||
    name === "pet_run" ||
    name === "pet_wave"
  ) {
    const snappedWeight: 100 | 300 | 400 | 500 | 700 =
      weight <= 200
        ? 100
        : weight <= 350
          ? 300
          : weight <= 450
            ? 400
            : weight <= 600
              ? 500
              : 700;
    return getAphrodyPetSymbolSvg(name, style, snappedWeight, size);
  }

  // 1. Check crates/design-system/crates/aphrody-design-icons/sources/material-symbols
  const dsCandidate = join(
    DESIGN_SYSTEM_SOURCES_DIR,
    fill === 1 ? `${name}_fill.svg` : `${name}.svg`,
  );
  if (existsSync(dsCandidate)) {
    return optimizeSvgMarkup(readFileSync(dsCandidate, "utf8"), size);
  }
  const dsBaseCandidate = join(DESIGN_SYSTEM_SOURCES_DIR, `${name}.svg`);
  if (existsSync(dsBaseCandidate)) {
    return optimizeSvgMarkup(readFileSync(dsBaseCandidate, "utf8"), size);
  }

  // 2. Check upstream sparse directory if present
  const styleDir = `materialsymbols${style}`;
  const fillSuffix = fill === 1 ? "fill1_" : "";
  const upstreamPath = join(
    UPSTREAM_SYMBOLS_DIR,
    name,
    styleDir,
    `${name}_${fillSuffix}24px.svg`,
  );
  if (existsSync(upstreamPath)) {
    return optimizeSvgMarkup(readFileSync(upstreamPath, "utf8"), size);
  }

  // 3. Built-in optimized M3 path dictionary
  const pathData = OPTIMIZED_M3_PATHS[name] ?? OPTIMIZED_M3_PATHS.apps!;
  const classAttr = options.className ? ` class="${options.className}"` : "";
  const ariaAttrs = options.ariaLabel
    ? ` role="img" aria-label="${options.ariaLabel}"`
    : ` aria-hidden="true"`;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 -960 960 960" fill="currentColor"${classAttr}${ariaAttrs}><path d="${pathData}"/></svg>`;
}

/**
 * List available Material Symbols + Aphrody Pet Symbols names
 */
export function m3IconNames(_style: M3IconStyle = "outlined"): string[] {
  const names = new Set<string>(Object.keys(OPTIMIZED_M3_PATHS));
  for (const petSym of ["pet_idle", "pet_jump", "pet_run", "pet_wave"]) {
    names.add(petSym);
  }
  if (existsSync(DESIGN_SYSTEM_SOURCES_DIR)) {
    for (const f of readdirSync(DESIGN_SYSTEM_SOURCES_DIR)) {
      if (f.endsWith(".svg")) names.add(f.replace(/(_fill)?\.svg$/, ""));
    }
  }
  if (existsSync(MATERIAL_INDEX_JSON)) {
    try {
      const idx = JSON.parse(readFileSync(MATERIAL_INDEX_JSON, "utf8")) as {
        symbols?: Record<string, unknown>;
        catalogOnly?: string[];
      };
      if (idx.symbols) {
        for (const k of Object.keys(idx.symbols)) names.add(k);
      }
      if (Array.isArray(idx.catalogOnly)) {
        for (const k of idx.catalogOnly.slice(0, 120)) names.add(k);
      }
    } catch {
      // Ignore malformed optional index
    }
  }
  return [...names].sort();
}

export function listAvailableSymbols(): string[] {
  if (!existsSync(UPSTREAM_SYMBOLS_DIR)) {
    return [
      "search",
      "home",
      "settings",
      "mic",
      "photo_camera",
      "apps",
      "dark_mode",
      "palette",
      "terminal",
      "memory",
    ];
  }
  return readdirSync(UPSTREAM_SYMBOLS_DIR, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name);
}

export function getSymbolSvg(
  name: string,
  style: M3IconStyle = "outlined",
  size: 20 | 24 | 40 | 48 = 24,
  fill: 0 | 1 = 0,
): string {
  return m3Icon({ name, style, size, fill });
}

export function searchSymbols(query = ""): SymbolSearchResult[] {
  const all = listAvailableSymbols();
  const q = query.trim().toLowerCase();
  const filtered = q ? all.filter((s) => s.toLowerCase().includes(q)) : all;

  return filtered.map((name) => ({
    name,
    category: "system",
    availableStyles: ["outlined", "rounded", "sharp"],
    svg: getSymbolSvg(name, "outlined", 24, 0),
  }));
}

export function searchM3Icons(query = ""): SymbolSearchResult[] {
  const all = m3IconNames("outlined");
  const q = query.trim().toLowerCase();
  const filtered = q
    ? all.filter((s) => s.toLowerCase().includes(q))
    : all.slice(0, 64);

  return filtered.slice(0, 64).map((name) => ({
    name,
    category: name.startsWith("pet_") ? "aphrody-pet" : "material-m3",
    availableStyles: ["outlined", "rounded", "sharp"],
    svg: getSymbolSvg(name, "outlined", 24, 0),
  }));
}
