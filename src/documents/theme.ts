/*//////////////////////////////////////////////////
IMPORTS
//////////////////////////////////////////////////*/
import { colors, invert } from "../lib/hue.js";
import type { ColorScales } from "../lib/types.js";

/** Saturation presets accepted by the shared Office document palette. */
export type DocumentSaturation = "low" | "medium" | "high";

/** Public colors intentionally name the same roles used by Styling's UI palette. */
export type DocumentColors = {
  primary: string;
  primaryStrong: string;
  primarySoft: string;
  secondary: string;
  ink: string;
  muted: string;
  paper: string;
  surface: string;
  line: string;
  /** Backward-compatible aliases for earlier template consumers. */
  accent: string;
  accentStrong: string;
  accentSoft: string;
};

/** Light/dark color scales applied to shared template roles. */
export type DocumentColorScales = {
  primary: ColorScales;
  secondary: ColorScales;
  gray: ColorScales;
};

/** Optional consumer settings for document branding and palette generation. */
export type TerraDocumentBrandOptions = {
  /** `false` removes the Terra wordmark; a path supplies a consumer logo. */
  logo?: false | string;
  /** Optional alternate logo for saturated backgrounds. */
  logoOnDark?: false | string;
  /** Hue passed to Styling's palette generator. Omit for the website's random hue; null selects grayscale. */
  hue?: number | null;
  saturation?: DocumentSaturation;
  colors?: Partial<DocumentColors>;
  fonts?: { display?: string; body?: string };
};

/** Resolved palette, fonts, and logo assets consumed by document templates. */
export type TerraDocumentBrand = {
  logo: false | string;
  logoOnDark: false | string;
  hue: number | null;
  saturation: DocumentSaturation;
  colors: DocumentColors;
  scales: DocumentColorScales;
  fonts: { display: string; body: string };
};

/*//////////////////////////////////////////////////
PALETTE HELPERS
//////////////////////////////////////////////////*/
const SATURATION_CHROMA: Record<DocumentSaturation, number> = {
  low: 0.04,
  medium: 0.075,
  high: 0.12,
};

/**
 * Converts a space-separated RGB triplet to a hash-prefixed hexadecimal color.
 *
 * @param rgb - Space-separated red, green, and blue channel values.
 * @returns The channels combined as a hash-prefixed hexadecimal color.
 */
function hex(rgb: string): string {
  const channels: string[] = [];
  for (const channel of rgb.split(" ")) {
    channels.push(Math.round(Number(channel)).toString(16).padStart(2, "0"));
  }
  return `#${channels.join("")}`;
}
/**
 * Selects one palette entry and converts it to hexadecimal notation.
 *
 * @param scales - Color scales containing light and dark appearance values.
 * @param i - Palette position to select.
 * @param appearance - Appearance variant to read, defaulting to light.
 * @returns The selected color as a hash-prefixed hexadecimal string.
 */
function token(
  scales: ColorScales,
  i: number,
  appearance: "light" | "dark" = "light",
): string {
  return hex(scales[appearance][i]!);
}

/*//////////////////////////////////////////////////
BRAND PALETTE
//////////////////////////////////////////////////*/
/**
 * Builds the color, logo, and font settings shared by native Office templates.
 *
 * @param options - Optional hue, saturation, color, font, and logo overrides.
 * @returns A resolved brand with generated scales and merged public color roles.
 */
export function createDocumentBrand(
  options: TerraDocumentBrandOptions = {},
): TerraDocumentBrand {
  const saturation = options.saturation ?? "medium";
  const hue = options.hue === undefined ? Math.random() * 300 : options.hue;
  const logo =
    options.logo === false ? false : (options.logo ?? "terra-wordmark");
  const logoOnDark =
    options.logoOnDark === false ? false : (options.logoOnDark ?? logo);
  const paletteOptions = { accentChroma: SATURATION_CHROMA[saturation] };
  const [basePrimary] = colors(hue, paletteOptions);
  // Match the website's palette assignment: both secondary and gray come from
  // the inverted hue, with secondary using its accent scale and gray its neutral scale.
  const [baseSecondary, baseGray] = colors(invert(hue), paletteOptions);
  const grayscale = hue === null;
  const scales: DocumentColorScales = {
    primary: grayscale ? baseGray : basePrimary,
    secondary: grayscale ? baseGray : baseSecondary,
    gray: grayscale ? baseGray : baseGray,
  };
  const gen: DocumentColors = {
    // Keep surfaces and text on the generated Radix primary scale. Reserve
    // primary.11 for supporting text and primary.12 for readable body text.
    primary: token(scales.primary, 8),
    primaryStrong: token(scales.primary, 10),
    primarySoft: token(scales.primary, 1),
    secondary: token(scales.secondary, 8),
    ink: token(scales.primary, 11),
    muted: token(scales.primary, 10),
    paper: token(scales.primary, 0),
    surface: token(scales.primary, 1),
    line: token(scales.primary, 5),
    accent: token(scales.primary, 7),
    accentStrong: token(scales.primary, 10),
    accentSoft: token(scales.primary, 1),
  };
  const overrides = options.colors ?? {};
  const mergedColors = { ...gen, ...overrides };
  // Preserve old accent overrides as aliases only when callers do not supply the new primary names.
  if (overrides.accent && !overrides.primary)
    mergedColors.primary = overrides.accent;
  if (overrides.accentStrong && !overrides.primaryStrong)
    mergedColors.primaryStrong = overrides.accentStrong;
  if (overrides.accentSoft && !overrides.primarySoft)
    mergedColors.primarySoft = overrides.accentSoft;
  if (overrides.primary && !overrides.accent)
    mergedColors.accent = overrides.primary;
  if (overrides.primaryStrong && !overrides.accentStrong)
    mergedColors.accentStrong = overrides.primaryStrong;
  if (overrides.primarySoft && !overrides.accentSoft)
    mergedColors.accentSoft = overrides.primarySoft;
  return {
    logo,
    logoOnDark,
    hue,
    saturation,
    colors: mergedColors,
    scales,
    fonts: {
      // Functional text stays in Authentic Sans. Avara is reserved for the small wordmark.
      display: options.fonts?.display ?? "AUTHENTIC Sans",
      body: options.fonts?.body ?? "AUTHENTIC Sans",
    },
  };
}

/**
 * Returns a random hue in the same 0–300 range used by the Terra website.
 *
 * @returns A random hue value.
 */
export function randomDocumentHue(): number {
  return Math.random() * 300;
}
