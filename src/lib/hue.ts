/**
 * src/lib/hue.ts
 */

/*//////////////////////////////////////////////////
IMPORTS
//////////////////////////////////////////////////*/

// COMPONENTS
import * as RadixColors from "@radix-ui/colors";
import BezierEasing from "bezier-easing";
import Color from "colorjs.io";

// TYPES
import type { ArrayOf12, ColorGenOpts, ColorScales } from "./types.js";

/**
 * Returns an explicit hue when supplied, or a stable hue derived from a label.
 * Markdown filenames and display separators are normalized the same way as
 * Docs tree labels before hashing, so every host gets the same palette.
 *
 * @param title - Document title or filename used to derive a hue.
 * @param hue - Optional explicit hue, returned unchanged when supplied as a number.
 * @return The explicit hue or a deterministic hue derived from the normalized title.
 */
export function getHue(title: string, hue?: number): number {
  if (typeof hue === "number") return hue;
  const normTitle = title
    .replace(/\.pdf$/i, "")
    .replace(/\.(?:md|mdx)$/i, "")
    .replace(/^_+/, "")
    .replace(/[-_]+/g, " ")
    .toLowerCase();
  let result = 0;
  for (const char of normTitle) result = (result * 31 + char.charCodeAt(0)) | 0;
  return result % 300;
}

/*//////////////////////////////////////////////////
FUNCTIONS
//////////////////////////////////////////////////*/

/**
 * Caches generated color scales by hue so repeated theme work does not recompute them.
 */
const CACHE = new Map<string, [ColorScales, ColorScales]>();

/*//////////////////////////////////////////////////
CONSTANTS
//////////////////////////////////////////////////*/

// COLOR SCALES
// prettier-ignore
const gsNames = ['gray', 'mauve', 'slate', 'sage', 'olive', 'sand'] as const;

/**
 * Lazy initialization of Radix color scales to avoid expensive parsing of all
 * colors on module load.
 */
const SCALES_CACHE: Record<string, Record<string, ArrayOf12<Color>>> = {};
/** Cache to store the OKLab representation of a Color for fast distance calculations. */
const OKLAB_CACHE = new WeakMap<Color, Color>();
const darkEasing = [1, 0, 1, 0] as [number, number, number, number];

/*//////////////////////////////////////////////////
HELPERS
//////////////////////////////////////////////////*/

/**
 * Generates accent and gray color scales from a hue value with aesthetic filtering.
 *
 * @param hue - Hue value in degrees (0-360), or null for grayscale scales.
 * @param opts - Optional palette-generation settings such as contrast and filtering thresholds.
 *
 * @return Tuple containing accent and gray color scales
 */
export function colors(
  hue: number | null,
  opts: ColorGenOpts = {},
): [ColorScales, ColorScales] {
  // VALIDATE
  if (hue !== null && (typeof hue !== "number" || !Number.isFinite(hue)))
    throw new Error(`Invalid hue: ${JSON.stringify(hue)}`);

  // NORMALIZE
  // Round to 1 decimal place to prevent memory leaks from high-precision floats
  // while maintaining sufficient visual fidelity for color scales.
  let normHue = hue === null ? null : Math.round(hue * 10) / 10;
  const accentLightness = opts.accentLightness ?? 0.5;
  const accentChroma = opts.accentChroma ?? 0.075;
  const hueAvoidanceShift = opts.hueAvoidanceShift ?? 60;
  const hoverLightnessShift = opts.hoverLightnessShift ?? 0.03;
  const hoverChromaMultiplier = opts.hoverChromaMultiplier ?? 0.93;
  const key = `${normHue}:${accentLightness}:${accentChroma}:${hueAvoidanceShift}:${hoverLightnessShift}:${hoverChromaMultiplier}`;

  // CACHE
  if (CACHE.has(key)) return CACHE.get(key)!;
  if (normHue === null) {
    /**
     * Converts a Radix color value to the RGB triplet format used by the theme.
     *
     * @param val - Radix color string to convert.
     * @return Three sRGB channels separated by spaces, rounded to integers and clamped to 0–255.
     */
    function toRgbTriplet(val: string): string {
      const channels: number[] = [];
      for (const channel of new Color(val).to("srgb").toGamut({ method: "css" })
        .coords) {
        channels.push(Math.min(255, Math.max(0, Math.round(channel * 255))));
      }
      return channels.join(" ");
    }
    const grayscale: ColorScales = {
      light: Object.values(RadixColors.grayP3).map(
        toRgbTriplet,
      ) as ArrayOf12<string>,
      dark: Object.values(RadixColors.grayDarkP3).map(
        toRgbTriplet,
      ) as ArrayOf12<string>,
    };
    const result: [ColorScales, ColorScales] = [grayscale, grayscale];
    CACHE.set(key, result);
    return result;
  }
  if (normHue >= 70 && normHue <= 130) normHue = normHue + hueAvoidanceShift;

  // PROCESS
  const gray = "#9ca3af";
  const accent = new Color("oklch", [
    accentLightness,
    accentChroma,
    normHue,
  ]).toString({ format: "hex" });
  const light = genRadixColors({
    appearance: "light",
    accent,
    gray,
    bg: "#FFFFFF",
    hoverLightnessShift,
    hoverChromaMultiplier,
  });
  const dark = genRadixColors({
    appearance: "dark",
    accent,
    gray,
    bg: "#111111",
    hoverLightnessShift,
    hoverChromaMultiplier,
  });

  const result: [ColorScales, ColorScales] = [
    { light: light.asRgb, dark: dark.asRgb },
    { light: light.gsRgb, dark: dark.gsRgb },
  ];

  // CACHE
  CACHE.set(key, result);
  return result;
}

/**
 * Inverts a hue value for complementary color generation.
 *
 * @param hue - Original hue value in degrees, or null for grayscale mode.
 *
 * @return The hue rotated by 150 degrees within the 0–300 scale, or `null` to preserve grayscale mode.
 */
export function invert(hue: number | null): number | null {
  if (hue === null) return null;
  hue = 300 / 2 + hue;
  if (hue > 300) hue -= 300;
  return hue;
}

/**
 * Resolves the active document theme, allowing an explicit class to override the system preference.
 *
 * @param scope - Optional element used to find the nearest explicit `.dark` or `.light` class.
 * @return `true` when an explicit dark theme is active or the browser prefers dark mode; otherwise `false`.
 */
export function isDarkMode(scope?: HTMLElement): boolean {
  if (typeof document === "undefined") return false;
  const scopedTheme = scope?.closest(".dark, .light");
  if (scopedTheme?.classList.contains("dark")) return true;
  if (scopedTheme?.classList.contains("light")) return false;
  if (
    document.documentElement.classList.contains("dark") ||
    document.body?.classList.contains("dark")
  )
    return true;
  if (
    document.documentElement.classList.contains("light") ||
    document.body?.classList.contains("light")
  )
    return false;
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-color-scheme: dark)").matches
  );
}

/**
 * Applies a hue palette to the current document or a scoped element and notifies live consumers.
 *
 * @param hue - Hue value in degrees, or null for the grayscale palette.
 * @param scope - Optional element whose palette should be updated without changing the host document theme.
 *
 * @return Resolves after the primary, secondary, and grayscale CSS variables are updated and change events are dispatched.
 */
export function applyHue(hue: number | null, scope?: HTMLElement): void {
  if (typeof document === "undefined") return;
  const [primary, baseGray] = colors(hue);
  const [secondary, gray] =
    hue === null ? [baseGray, baseGray] : colors(invert(hue));
  const darkMode = isDarkMode(scope);
  const colorVars: Record<string, string> = {
    ...flattenColors("primary", primary, true),
    ...flattenColors("gray", gray, true),
    ...flattenColors("secondary", secondary, true),
  };
  for (let i = 0; i < 12; i++) {
    const step = i + 1;
    colorVars[`--primary-${step}`] = (darkMode ? primary.dark : primary.light)[
      i
    ]!;
    colorVars[`--gray-${step}`] = (darkMode ? gray.dark : gray.light)[i]!;
    colorVars[`--secondary-${step}`] = (
      darkMode ? secondary.dark : secondary.light
    )[i]!;
  }
  // prettier-ignore
  const legacyTargets = scope
		? Array.from(scope.querySelectorAll<HTMLElement>('[style*="--primaryLight1"]'))
		: Array.from(document.querySelectorAll<HTMLElement>('[style*="--primaryLight1"]'));
  const targets = scope
    ? [scope, ...legacyTargets]
    : [
        document.documentElement,
        ...(document.body ? [document.body] : []),
        ...legacyTargets,
      ];
  for (const element of new Set<HTMLElement>(targets)) {
    const declarations: string[] = [];
    for (const [name, value] of Object.entries(colorVars))
      declarations.push(`${name}: ${value};`);
    element.style.cssText = `${element.style.cssText.replace(/--(?:hue|(?:primary|gray|secondary)-\d+|(?:primary|gray|secondary)(?:Light|Dark)\d+)\s*:[^;]*;?/g, "")}; --hue: ${hue ?? 0}; ${declarations.join("")}`;
  }
  document.dispatchEvent(
    new CustomEvent("docs:hue-change", { detail: { hue } }),
  );
}

/**
 * Flattens color scales into a flat object for CSS variable definition.
 *
 * @param scheme - Color scheme name prefix
 * @param colors - Color scales object containing light and dark themes
 * @param prefix - Whether generated keys should start with `--`.
 *
 * @return Flattened object with color variable names as keys
 */
export function flattenColors(
  scheme: string,
  colors: ColorScales,
  prefix: boolean = false,
): Record<string, string> {
  const { light, dark } = colors;

  /**
   * Flattens a color theme into CSS custom property names.
   *
   * @param theme - Theme scale to flatten.
   * @param id - Palette suffix used in the generated variable names.
   *
   * @return Flattened CSS variables map.
   */
  function reduce(theme: ArrayOf12<string>, id: string) {
    const flattened: Record<string, string> = {};
    for (let index = 0; index < theme.length; index++)
      flattened[`${prefix ? "--" : ""}${scheme}${id}${index + 1}`] =
        theme[index]!;
    return flattened;
  }
  return { ...reduce(light, "Light"), ...reduce(dark, "Dark") };
}

/**
 * Gets scales.
 *
 * @param theme - Color-scheme appearance used to select light or dark Radix scales.
 * @param grayOnly - When true, load only the six neutral gray families.
 *
 * @return Records containing Radix UI scales.
 */
function getScales(theme: "light" | "dark", grayOnly = false) {
  const key = `${theme}${grayOnly ? "Gray" : ""}`;
  if (SCALES_CACHE[key]) return SCALES_CACHE[key];
  const scaleNames = grayOnly
    ? gsNames
    : ([
        ...gsNames,
        "tomato",
        "red",
        "ruby",
        "crimson",
        "pink",
        "plum",
        "purple",
        "violet",
        "iris",
        "indigo",
        "blue",
        "cyan",
        "teal",
        "jade",
        "green",
        "grass",
        "brown",
        "orange",
        "sky",
        "mint",
        "lime",
        "yellow",
        "amber",
      ] as const);
  const result: Record<string, ArrayOf12<Color>> = {};
  for (const name of scaleNames) {
    const colors: Color[] = [];
    const radixScale = RadixColors[
      `${name}${theme === "light" ? "P3" : "DarkP3"}`
    ] as Record<string, string>;
    for (const value of Object.values(radixScale))
      colors.push(new Color(value).to("oklch"));
    result[name] = colors as ArrayOf12<Color>;
  }
  SCALES_CACHE[key] = result;
  return result;
}

/**
 * Resolves the OKLab representation of a Color, caching the result to avoid
 * redundant color space conversions.
 *
 * @param color - Color.js value to convert to OKLab.
 *
 * @return The cached OKLab color value used by perceptual-distance calculations.
 */
function getOklab(color: Color): Color {
  let cached = OKLAB_CACHE.get(color);
  if (!cached) {
    cached = color.to("oklab");
    OKLAB_CACHE.set(color, cached);
  }
  return cached;
}

/**
 * Calculates Delta E OK color difference between two colors using their OKLab coordinates.
 * This is mathematically equivalent to color.deltaEOK(other) but significantly faster
 * as it avoids repeated, expensive coordinate transformations on hot paths.
 *
 * @param c1 - First color sample in the distance calculation.
 * @param c2 - Second color sample in the distance calculation.
 *
 * @return The Euclidean distance between the colors in OKLab space.
 */
function deltaEOKFast(c1: Color, c2: Color): number {
  const [l1, a1, b1] = getOklab(c1).coords;
  const [l2, a2, b2] = getOklab(c2).coords;
  return Math.sqrt((l1 - l2) ** 2 + (a1 - a2) ** 2 + (b1 - b2) ** 2);
}

/*//////////////////////////////////////////////////
MAIN FUNCTION
//////////////////////////////////////////////////*/

/**
 * Produces alpha-blended sRGB colors for one twelve-step palette.
 *
 * @param colors - Hex colors to composite over the selected background.
 * @param background - Background color used for the alpha blend.
 * @return Twelve sRGB color strings with their resolved alpha values.
 */
function getAlphaSrgbColors(
  colors: ArrayOf12<string>,
  background: string,
): ArrayOf12<string> {
  const results: string[] = [];
  for (const color of colors)
    results.push(getAlphaColorSrgb(color, background));
  return results as ArrayOf12<string>;
}

/**
 * Produces alpha-blended Display-P3 colors for one twelve-step palette.
 *
 * @param colors - Color strings to composite over the selected background.
 * @param background - Background color used for the alpha blend.
 * @return Twelve Display-P3 color strings with their resolved alpha values.
 */
function getAlphaP3Colors(
  colors: ArrayOf12<string>,
  background: string,
): ArrayOf12<string> {
  const results: string[] = [];
  for (const color of colors) results.push(getAlphaColorP3(color, background));
  return results as ArrayOf12<string>;
}

/**
 * Generates a complete color system based on Radix UI color scales with custom accent and gray
 * colors. Uses lazy getters to avoid expensive calculations for unused color variants.
 *
 * @param appearance - Determines the light or dark Radix scale used for generated colors.
 * @param hoverLightnessShift - Lightness adjustment used to find the interactive hover tone.
 * @param hoverChromaMultiplier - Chroma adjustment applied to the interactive hover tone.
 * @param args - Accent, gray, and background colors used to build the derived scales.
 *
 * @return Complete light/dark color scales with hex and wide-gamut variants, including text and hover colors.
 */
function genRadixColors({
  appearance,
  hoverLightnessShift = 0.03,
  hoverChromaMultiplier = 0.93,
  ...args
}: {
  appearance: "light" | "dark";
  accent: string;
  gray: string;
  bg: string;
} & Pick<ColorGenOpts, "hoverLightnessShift" | "hoverChromaMultiplier">) {
  // STATES
  // define scales
  const bgColors = new Color(args.bg).to("oklch");
  const gsColors = getScaleFromColor(
    new Color(args.gray).to("oklch"),
    getScales(appearance, true),
    bgColors,
  );
  const accentBaseColor = new Color(args.accent).to("oklch");
  let asColors = getScaleFromColor(
    accentBaseColor,
    getScales(appearance),
    bgColors,
  );

  // ENFORCE SRGB for the bg color
  const bgHex = bgColors.to("srgb").toString({ format: "hex" });

  // ENFORCE TINT from the gray scale for when base is pure white or black
  const accentBaseHex = accentBaseColor.to("srgb").toString({ format: "hex" });
  if (accentBaseHex === "#000" || accentBaseHex === "#fff") {
    asColors = [] as unknown as ArrayOf12<Color>;
    for (const color of gsColors) asColors.push(color.clone());
  }
  const [accent9Color, accentContrastColor] =
    deltaEOKFast(accentBaseColor, asColors[0]) * 100 < 25
      ? [asColors[8], getTextColor(asColors[8])]
      : [accentBaseColor, getTextColor(accentBaseColor)];
  asColors[8] = accent9Color;
  const [accentLightness, accentChroma, accentHue] = accent9Color.coords;
  const buttonHoverColor = new Color("oklch", [
    accentLightness > 0.4
      ? accentLightness - hoverLightnessShift / (accentLightness + 0.1)
      : accentLightness + hoverLightnessShift / (accentLightness + 0.1),
    accentLightness > 0.4 && !isNaN(accentHue)
      ? accentChroma * hoverChromaMultiplier + 0
      : accentChroma,
    accentHue,
  ]);
  let closestColor = buttonHoverColor;
  let minDist = Infinity;
  for (const color of asColors) {
    const dist = deltaEOKFast(buttonHoverColor, color);
    if (dist < minDist) {
      minDist = dist;
      closestColor = color;
    }
  }
  buttonHoverColor.coords[1] = closestColor.coords[1];
  buttonHoverColor.coords[2] = closestColor.coords[2];
  asColors[9] = buttonHoverColor;

  // LIMIT SATURATION of the text colors
  asColors[10].coords[1] = Math.min(
    Math.max(asColors[8].coords[1], asColors[7].coords[1]),
    asColors[10].coords[1],
  );
  asColors[11].coords[1] = Math.min(
    Math.max(asColors[8].coords[1], asColors[7].coords[1]),
    asColors[11].coords[1],
  );

  // PRE-CALCULATE basic variants
  const asHex: ArrayOf12<string> = [] as unknown as ArrayOf12<string>;
  const gsHex: ArrayOf12<string> = [] as unknown as ArrayOf12<string>;
  for (const color of asColors)
    asHex.push(color.to("srgb").toString({ format: "hex" }));
  for (const color of gsColors)
    gsHex.push(color.to("srgb").toString({ format: "hex" }));

  /**
   * To rgb triplet.
   *
   * @param c - Color.js value to convert to a space-delimited RGB triplet.
   *
   * @return space-delimited RGB triplet string.
   */
  function toRgbTriplet(c: Color) {
    const channels: number[] = [];
    for (const value of c.to("srgb").toGamut({ method: "css" }).coords) {
      channels.push(Math.min(255, Math.max(0, Math.round(value * 255))));
    }
    return channels.join(" ");
  }
  // RETURN with lazy getters for expensive variants
  return {
    as: asHex,
    asRgb: asColors.map(toRgbTriplet) as ArrayOf12<string>,
    gs: gsHex,
    gsRgb: gsColors.map(toRgbTriplet) as ArrayOf12<string>,
    bg: bgHex,

    /**
     * Returns alpha-blended sRGB accents.
     *
     * @return Twelve sRGB hex colors with alpha, composited over the generated background.
     */
    get asAlpha() {
      return getAlphaSrgbColors(asHex, bgHex);
    },
    /**
     * Returns wide-gamut accent tones in OKLCH form.
     *
     * @return Twelve CSS OKLCH color strings for the accent scale.
     */
    get asWideGamut() {
      return asColors.map(toOklchString) as ArrayOf12<string>;
    },
    /**
     * Returns alpha-blended wide-gamut accents.
     *
     * @return Twelve Display-P3 color strings with alpha for the accent scale.
     */
    get asAlphaWideGamut() {
      return getAlphaP3Colors(asHex, bgHex);
    },
    /**
     * Returns the accent contrast color.
     *
     * @return The accent's sRGB hex contrast color.
     */
    get accentContrast() {
      return accentContrastColor.to("srgb").toString({ format: "hex" });
    },
    /**
     * Returns a surface tint derived from the accent palette.
     *
     * @return An alpha-blended sRGB hex tint based on accent step 2.
     */
    get accentSurface() {
      return appearance === "light"
        ? getAlphaColorSrgb(asHex[1], bgHex, 0.8)
        : getAlphaColorSrgb(asHex[1], bgHex, 0.5);
    },
    /**
     * Returns a wide-gamut surface tint derived from the accent palette.
     *
     * @return An alpha-blended Display-P3 tint based on accent step 2.
     */
    get accentSurfaceWideGamut() {
      const asWideGamut = this.asWideGamut;
      return appearance === "light"
        ? getAlphaColorP3(asWideGamut[1], bgHex, 0.8)
        : getAlphaColorP3(asWideGamut[1], bgHex, 0.5);
    },
    /**
     * Returns alpha-blended gray scale swatches.
     *
     * @return Twelve sRGB hex colors with alpha, composited over the generated background.
     */
    get gsAlpha() {
      return getAlphaSrgbColors(gsHex, bgHex);
    },
    /**
     * Returns wide-gamut gray scale swatches.
     *
     * @return Twelve CSS OKLCH color strings for the gray scale.
     */
    get gsWideGamut() {
      return gsColors.map(toOklchString) as ArrayOf12<string>;
    },
    /**
     * Returns alpha-blended wide-gamut gray scale swatches.
     *
     * @return Twelve Display-P3 color strings with alpha for the gray scale.
     */
    get gsAlphaWideGamut() {
      return getAlphaP3Colors(gsHex, bgHex);
    },
    /**
     * Returns the default gray surface color.
     *
     * @return The appearance-specific gray surface color as an alpha color string.
     */
    get graySurface() {
      return appearance === "light" ? "#ffffffcc" : "rgba(0, 0, 0, 0.05)";
    },
    /**
     * Returns a wide-gamut gray surface tint.
     *
     * @return The appearance-specific gray surface as a Display-P3 color string with alpha.
     */
    get graySurfaceWideGamut() {
      return appearance === "light"
        ? "color(display-p3 1 1 1 / 80%)"
        : "color(display-p3 0 0 0 / 5%)";
    },
  };
}

/**
 * Derives a Radix scale that most closely matches a src color.
 *
 * @param src - Source string to normalize.
 * @param scales - Mapping of Radix scale names to their OKLCH representations.
 * @param bgColor - Background color whose lightness sets the scale's starting progression.
 *
 * @return resolved value.
 */
function getScaleFromColor(
  src: Color,
  scales: Record<string, ArrayOf12<Color>>,
  bgColor: Color,
) {
  // Find the closest color within each scale in a single pass to reduce sorting overhead.
  const list: { scale: string; dist: number; color: Color }[] = [];
  for (const [name, scale] of Object.entries(scales)) {
    let minDist = Infinity;
    let closestColor = scale[0];
    for (const color of scale) {
      const dist = deltaEOKFast(src, color);
      if (dist < minDist) {
        minDist = dist;
        closestColor = color;
      }
    }
    list.push({ scale: name, dist: minDist, color: closestColor });
  }
  if (!list.length) throw new Error("Unable to resolve a color scale.");

  // Find the absolute closest scale (min1)
  let min1 = list[0]!;
  for (let i = 1; i < list.length; i++)
    if (list[i]!.dist < min1.dist) min1 = list[i]!;

  // Filter and find the second closest scale (min2)
  const gsNamesStr = gsNames as readonly string[];
  let min2: typeof min1 | null = null;
  let onlyGrayScales = true;
  for (const item of list) {
    if (!gsNamesStr.includes(item.scale)) onlyGrayScales = false;
  }
  for (const item of list) {
    if (item === min1) continue;
    if (
      !onlyGrayScales &&
      gsNamesStr.includes(min1.scale) &&
      gsNamesStr.includes(item.scale)
    )
      continue;
    if (min2 === null || item.dist < min2.dist) min2 = item;
  }

  // Fallback in case list has fewer elements or something unexpected:
  if (min2 === null) {
    for (const item of list) {
      if (item === min1) continue;
      if (min2 === null || item.dist < min2.dist) min2 = item;
    }
  }
  const colorB = min2!;
  const c = deltaEOKFast(min1.color, colorB.color);

  // We can get the ratios of AD to BD lengths with trigonometry using tangents,
  // as the ratio of the tangents of the opposite angles will match.
  const cosA =
    (min1.dist ** 2 + c ** 2 - colorB.dist ** 2) / (2 * min1.dist * c);
  const cosB =
    (colorB.dist ** 2 + c ** 2 - min1.dist ** 2) / (2 * colorB.dist * c);

  // The ratio of the tangents corresponds to the ratio of the dists AD to BD
  // In the end, it means how much of scale B we want to mix into scale A.
  // If it’s "0" or less, this is an obtuse triangle from case 2, and we use just scale A.

  // The base scale is going to be a mix of the two closest scales, with the mix ratio we determined before
  const scaleA = scales[min1.scale];
  const scaleB = scales[colorB.scale];
  if (!scaleA || !scaleB)
    throw new Error("Unable to resolve the source color scales.");
  const scale: ArrayOf12<Color> = [] as unknown as ArrayOf12<Color>;
  const mixRatio = Math.min(
    0.5,
    Math.max(
      0,
      (cosA / Math.sin(Math.acos(cosA)) / (cosB / Math.sin(Math.acos(cosB)))) *
        0.5,
    ),
  );
  for (let index = 0; index < 12; index++) {
    scale.push(
      new Color(Color.mix(scaleA[index], scaleB[index], mixRatio).to("oklch")),
    );
  }

  // Get the closest color from the pre-mixed scale we created
  let baseColor = scale[0];
  if (!baseColor) throw new Error("Pre-mixed scale is empty");
  let minBaseDist = deltaEOKFast(src, baseColor);
  for (let i = 1; i < scale.length; i++) {
    const color = scale[i];
    if (!color) continue;
    const dist = deltaEOKFast(src, color);
    if (dist < minBaseDist) {
      minBaseDist = dist;
      baseColor = color;
    }
  }

  // Note the chroma difference between the src color and the base color
  // Modify hue and chroma only when the base scale has chroma. A grayscale
  // base has no hue to transfer, and dividing by its zero chroma would create NaN channels.
  if (baseColor.coords[1] > Number.EPSILON) {
    for (const color of scale) {
      color.coords[1] = Math.min(
        src.coords[1] * 1.5,
        color.coords[1] * (src.coords[1] / baseColor.coords[1]),
      );
      color.coords[2] = src.coords[2];
    }
  }

  // Light mode
  if (bgColor.coords[0] > 0.5) {
    // Add white as the first "step" of the light scale
    // prettier-ignore
    const scaleLightness = [1];
    for (const color of scale) scaleLightness.push(color.coords[0]);
    const progression = transposeProgressionStart(
      Math.max(0, Math.min(1, bgColor.coords[0])),
      scaleLightness,
      [0, 2, 0, 2],
    );
    for (let index = 0; index < scale.length; index++) {
      const lightness = progression[index + 1];
      const color = scale[index];
      if (color !== undefined && lightness !== undefined)
        color.coords[0] = lightness;
    }
    return scale;
  }
  // Dark mode
  const ease: typeof darkEasing = [...darkEasing];
  // If bg is lighter than step 0, we want to gradually change the easing to linear
  const ratioL =
    Math.max(0, Math.min(1, bgColor.coords[0])) / baseColor.coords[0];
  if (ratioL > 1) {
    const maxRatio = 1.5;
    for (let i = 0; i < ease.length; i++) {
      const val = ease[i];
      if (val !== undefined)
        ease[i] =
          ratioL > maxRatio
            ? 0
            : Math.max(
                0,
                val * (1 - (ratioL - 1) * (maxRatio / (maxRatio - 1))),
              );
    }
  }
  const scaleLightness = [];
  for (const color of scale) scaleLightness.push(color.coords[0]);
  const progression = transposeProgressionStart(
    bgColor.coords[0],
    scaleLightness,
    ease,
  );
  for (let index = 0; index < progression.length; index++) {
    const lightness = progression[index];
    const color = scale[index];
    if (color !== undefined && lightness !== undefined)
      color.coords[0] = lightness;
  }
  return scale;
}

/**
 * Resolves a legible text color against a given OKLCH bg.
 *
 * @param bg - Bg color to evaluate for contrast.
 *
 * @return resolved value.
 */
function getTextColor(bg: Color) {
  const white = new Color("oklch", [1, 0, 0]);
  if (Math.abs(white.contrastAPCA(bg)) < 40) {
    const [, C, H] = bg.coords;
    return new Color("oklch", [0.25, Math.max(0.08 * C, 0.04), H]);
  }
  return white;
}

// tgt = bg * (1 - alpha) + fg * alpha
// alpha = (tgt - bg) / (fg - bg)
// Expects 0-1 numbers for the RGB channels
/**
 * Calcs a semi-transparent fg color that blends to a tgt RGB value.
 *
 * @param tRgb - TGT color expressed as RGB channel values.
 * @param bgRgb - Bg RGB values the color will be composited over.
 * @param rgbPrecision - Precision multiplier for RGB calculations (typically 255).
 * @param alphaPrecision - Precision multiplier applied to the alpha channel.
 * @param tAlpha - Optional target opacity, quantized to `alphaPrecision`.
 *
 * @return resolved value.
 */
function getAlphaColor(
  tRgb: number[],
  bgRgb: number[],
  rgbPrecision: number,
  alphaPrecision: number,
  tAlpha?: number,
) {
  const scaledTarget: number[] = [];
  const scaledBackground: number[] = [];
  for (const channel of tRgb)
    scaledTarget.push(Math.round(channel * rgbPrecision));
  for (const channel of bgRgb)
    scaledBackground.push(Math.round(channel * rgbPrecision));
  const [tr, tg, tb] = scaledTarget;
  const [br, bg, bb] = scaledBackground;
  // prettier-ignore
  if (tr === undefined || tg === undefined || tb === undefined || br === undefined || bg === undefined || bb === undefined ) throw Error('Color is undefined');
  // Is the bg color lighter, RGB-wise, than tgt color?
  // Decide whether we want to add as little color or as much color as possible,
  // darkening or lightening the bg respectively.
  // If at least one of the bits of the tgt RGB value
  // is lighter than the bg, we want to lighten it.
  let desiredRgb = 0;
  if (tr > br) desiredRgb = rgbPrecision;
  else if (tg > bg) desiredRgb = rgbPrecision;
  else if (tb > bb) desiredRgb = rgbPrecision;
  const alphaR = (tr - br) / (desiredRgb - br);
  const alphaG = (tg - bg) / (desiredRgb - bg);
  const alphaB = (tb - bb) / (desiredRgb - bb);

  // No need for precision gymnastics with pure grays, and we can get cleaner output
  if (!tAlpha && alphaG === alphaR && alphaB === alphaR) {
    // Convert back to 0-1 values
    const V = desiredRgb / rgbPrecision;
    return [V, V, V, alphaR] as const;
  }
  /**
   * Clamps rgb.
   *
   * @param n - RGB channel value to clamp to the configured precision range.
   *
   * @return Clamped numeric value.
   */
  function clampRgb(n: number) {
    return isNaN(n) ? 0 : Math.min(rgbPrecision, Math.max(0, n));
  }
  const A =
    Math.min(
      alphaPrecision,
      Math.max(
        0,
        Math.ceil(
          (tAlpha ?? Math.max(alphaR, alphaG, alphaB)) * alphaPrecision,
        ) || 0,
      ),
    ) / alphaPrecision;
  let R = clampRgb(((br * (1 - A) - tr) / A) * -1);
  let G = clampRgb(((bg * (1 - A) - tg) / A) * -1);
  let B = clampRgb(((bb * (1 - A) - tb) / A) * -1);
  R = Math.ceil(R);
  G = Math.ceil(G);
  B = Math.ceil(B);
  const blendedR = blendAlpha(R, A, br);
  const blendedG = blendAlpha(G, A, bg);
  const blendedB = blendAlpha(B, A, bb);
  // Correct for rounding errors in light mode
  if (desiredRgb === 0) {
    if (tr <= br && tr !== blendedR) R = tr > blendedR ? R + 1 : R - 1;
    if (tg <= bg && tg !== blendedG) G = tg > blendedG ? G + 1 : G - 1;
    if (tb <= bb && tb !== blendedB) B = tb > blendedB ? B + 1 : B - 1;
  }
  // Correct for rounding errors in dark mode
  if (desiredRgb === rgbPrecision) {
    if (tr >= br && tr !== blendedR) R = tr > blendedR ? R + 1 : R - 1;
    if (tg >= bg && tg !== blendedG) G = tg > blendedG ? G + 1 : G - 1;
    if (tb >= bb && tb !== blendedB) B = tb > blendedB ? B + 1 : B - 1;
  }
  // Convert back to 0-1 values
  R = R / rgbPrecision;
  G = G / rgbPrecision;
  B = B / rgbPrecision;
  return [R, G, B, A] as const;
}

// Important – I empirically discovered that this rounding is how the browser actually overlays
// transparent RGB bits over each other. It does NOT round the whole result altogether.
/**
 * Blends a fg channel over a bg channel using the supplied alpha.
 *
 * @param fg - fg color channel value.
 * @param alpha - Alpha coefficient in the range 0–1.
 * @param bg - Bg color channel value.
 * @param round - Whether to round foreground and background contributions separately.
 *
 * @return blend Alpha.
 */
function blendAlpha(fg: number, alpha: number, bg: number, round = true) {
  if (round) return Math.round(bg * (1 - alpha)) + Math.round(fg * alpha);
  return bg * (1 - alpha) + fg * alpha;
}

/**
 * Produces an sRGB hex string with alpha that visually matches the tgt on the bg.
 *
 * @param tColor - Hex color string to approximate with transparency.
 * @param bgColor - sRGB background color over which the target should appear.
 * @param tAlpha - Optional target opacity, quantized to 8-bit alpha.
 *
 * @return resolved value.
 */
function getAlphaColorSrgb(tColor: string, bgColor: string, tAlpha?: number) {
  const [r, g, b, a] = getAlphaColor(
    new Color(tColor).to("srgb").coords,
    new Color(bgColor).to("srgb").coords,
    255,
    255,
    tAlpha,
  );
  const hex = new Color("srgb", [r, g, b], a).toString({ format: "hex" });
  if (!hex.startsWith("#")) return hex;
  if (hex.length === 4) {
    const r = hex.charAt(1);
    const g = hex.charAt(2);
    const b = hex.charAt(3);
    return hex.charAt(0) + r + r + g + g + b + b;
  }
  if (hex.length === 5) {
    const r = hex.charAt(1);
    const g = hex.charAt(2);
    const b = hex.charAt(3);
    const a = hex.charAt(4);
    return hex.charAt(0) + r + r + g + g + b + b + a + a;
  }
  return hex;
}

/**
 * Produces a Display-P3 color string with alpha that matches the tgt on the bg.
 *
 * @param tColor - Display-P3 color string to approximate.
 * @param bgColor - Display-P3 background color over which the target should appear.
 * @param tAlpha - Optional target opacity, quantized to 1000 alpha steps.
 *
 * @return resolved value.
 */
function getAlphaColorP3(tColor: string, bgColor: string, tAlpha?: number) {
  const [r, g, b, a] = getAlphaColor(
    new Color(tColor).to("p3").coords,
    new Color(bgColor).to("p3").coords,
    // Not sure why, but the resulting P3 alpha colors are blended in the browser most precisely when
    // rounded to 255 integers too. Is the browser using 0-255 rather than 0-1 under the hood for P3 too?
    255,
    1000,
    tAlpha,
  );
  // Important: in non-browser environments colorjs.io outputs a different format for some reason
  // prettier-ignore
  return new Color('p3', [r, g, b], a).toString({ precision: 4 }).replace('color(p3 ', 'color(display-p3 ');
}

/**
 * Transposes a numeric progression to start from a different value using a bezier curve.
 *
 * @param to - TGT starting value
 * @param arr - Array of numeric values to transpose
 * @param curve - Bezier curve control points
 *
 * @return Transposed array with new starting point
 */
function transposeProgressionStart(
  to: number,
  arr: number[],
  curve: [number, number, number, number],
) {
  const first = arr[0];
  if (first === undefined) return [];
  const last = arr.length - 1;
  const easing = BezierEasing(...curve);
  const transposed: number[] = [];
  for (let index = 0; index < arr.length; index++) {
    const value = arr[index]!;
    transposed.push(value - (first - to) * easing(last ? 1 - index / last : 0));
  }
  return transposed;
}

// Convert to OKLCH string with percentage for the lightness channel
// https://github.com/radix-ui/themes/issues/420
/**
 * Formats an OKLCH color instance into a CSS-ready string with percent lightness.
 *
 * @param c - OKLCH color to convert.
 *
 * @return Oklch String.
 */
function toOklchString(c: Color) {
  // prettier-ignore
  return c.to('oklch').toString({ precision: 4 }).replace(/(\S+)(.+)/, `oklch(${+(c.coords[0] * 100).toFixed(1)}%$2`);
}
