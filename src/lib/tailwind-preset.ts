/**
 * src/lib/tailwind-preset.ts
 * Reusable Tailwind preset with shared color, typography, animation, and plugin tokens.
 * @see https://tailwindcss.com/docs/presets
 */

/*//////////////////////////////////////////////////
IMPORTS
//////////////////////////////////////////////////*/

// API
import headlessui from "@headlessui/tailwindcss";
import typography from "@tailwindcss/typography";
import animate from "tailwindcss-animate";
import scrimGradients from "tailwindcss-scrim-gradients";
import plugin from "tailwindcss/plugin.js";

// TYPES
import type { Config } from "tailwindcss";

/*//////////////////////////////////////////////////
CONFIG
//////////////////////////////////////////////////*/

/**
 * Creates a Tailwind color callback for a CSS variable containing RGB channels.
 *
 * @param variable - CSS custom property name that resolves to a space-delimited RGB triplet.
 * @return A color callback that uses `opacityValue`, falling back to `100` when it is falsy.
 */
function applyOpacityValue(variable: string) {
  /**
   * Builds an RGB declaration with Tailwind's optional opacity modifier.
   *
   * @param prop - Opacity values supplied by the Tailwind color resolver.
   * @return CSS RGB color using the selected channel variable and opacity.
   */
  function applyOpacity(
    prop: Partial<{ opacityVariable: string; opacityValue: number }>,
  ): string {
    const opacityValue = prop?.opacityValue;
    return `rgb(var(${variable}) / ${opacityValue || "100"})`;
  }
  return applyOpacity;
}

/**
 * Creates numbered Tailwind color entries for legacy and current scale names.
 *
 * @param prefix - CSS custom property prefix used for each scale entry.
 * @param legacy - Legacy color steps retained for existing consumers.
 * @param current - Current one-through-twelve scale step numbers.
 * @return Color callbacks keyed by the legacy and current step numbers.
 */
function makeOpacityColors(
  prefix: string,
  legacy: readonly number[],
  current: readonly number[],
): Record<number, ReturnType<typeof applyOpacityValue>> {
  const colors: Record<number, ReturnType<typeof applyOpacityValue>> = {};
  for (const step of legacy)
    colors[step] = applyOpacityValue(`${prefix}${step}`);
  for (const step of current)
    colors[step] = applyOpacityValue(`${prefix}-${step}`);
  return colors;
}

/** Tailwind callback that resolves one dotted theme path. */
type ThemeLookup = (path: string) => unknown;
/** Theme resolver passed to computed min-width and typography extensions. */
type ThemeExtOptions = { theme: ThemeLookup };

/**
 * Returns the shared maximum-width scale for Tailwind's min-width extension.
 *
 * @param theme - Tailwind resolver used to read the configured max-width scale.
 * @return A shallow copy of the configured max-width entries.
 */
function minWidthFromTheme({ theme }: ThemeExtOptions): Record<string, string> {
  return { ...(theme("maxWidth") as Record<string, string>) };
}

/**
 * Builds the shared prose colors and typography rules from Tailwind's theme resolver.
 *
 * @param theme - Tailwind resolver used to read the shared color and font tokens.
 * @return Typography plugin defaults for prose content.
 */
function typographyFromTheme({ theme }: ThemeExtOptions) {
  return {
    DEFAULT: {
      css: {
        "--tw-prose-body": theme("colors.gray[11]"),
        "--tw-prose-headings": theme("colors.gray[12]"),
        "--tw-prose-lead": theme("colors.gray[10]"),
        "--tw-prose-links": theme("colors.gray[12]"),
        "--tw-prose-bold": theme("colors.gray[12]"),
        "--tw-prose-counters": theme("colors.primary[600]"),
        "--tw-prose-bullets": theme("colors.primary[400]"),
        "--tw-prose-hr": theme("colors.gray[7]"),
        "--tw-prose-quotes": theme("colors.gray[12]"),
        "--tw-prose-quote-borders": theme("colors.gray[7]"),
        "--tw-prose-captions": theme("colors.gray[10]"),
        "--tw-prose-code": theme("colors.gray[12]"),
        "--tw-prose-pre-code": theme("colors.gray[3]"),
        "--tw-prose-pre-bg": theme("colors.gray[12]"),
        "--tw-prose-th-borders": theme("colors.gray[7]"),
        "--tw-prose-td-borders": theme("colors.gray[6]"),
        "code::before": false,
        "code::after": false,
        strong: { color: "inherit" },
        a: {
          position: "relative",
          fontWeight: theme("fontWeight.semibold"),
          textDecoration: "underline",
          textUnderlineOffset: "3px",
        },
        h1: { color: "inherit" },
        h2: { color: "inherit" },
        h3: { color: "inherit" },
        h4: { color: "inherit" },
        h5: { color: "inherit" },
        h6: { color: "inherit" },
        "a:hover": { textUnderlineOffset: "3px" },
        blockquote: {
          color: "var(--primary-7)",
          borderLeftColor: "rgba(var(--primary-7), 0.5)",
        },
        "li::marker": { color: "var(--primary-7)" },
      },
    },
  };
}

/** Tailwind plugin subset used to register shared selectors and child variants. */
type TailwindVariantApi = {
  addVariant: (name: string, selector: string | string[]) => void;
  matchVariant: (
    name: string,
    selector: (value: string) => string,
    options: { values: Record<string, string> },
  ) => void;
};

/**
 * Registers the shared focus, enabled, and direct-child variants.
 *
 * @param addVariant - Registers a named static selector variant.
 * @param matchVariant - Registers the parameterized direct-child selector variant.
 */
function registerTailwindVariants({
  addVariant,
  matchVariant,
}: TailwindVariantApi): void {
  addVariant("hocus", ["&:hover", "&:focus"]);
  addVariant("hocus-visible", ["&:hover", "&:focus-visible"]);
  addVariant("enabled", "&:not(:disabled)");
  matchVariant("*", childSelector, { values: { DEFAULT: "*" } });
}

/**
 * Converts underscores in a matched child selector to spaces.
 *
 * @param value - Child selector value supplied by Tailwind.
 * @return Selector with spaces restored for CSS syntax.
 */
function childSelector(value: string): string {
  return `:where(& > ${value.replace(/_/g, " ")})`;
}
const transform =
  "translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y)) ";

const preset: Omit<Config, "content"> = {
  darkMode: [
    "variant",
    [
      "@media (prefers-color-scheme: dark) { &:not(.light *, .light) }",
      "&:is(.dark *, .dark)",
    ],
  ],
  theme: {
    extend: {
      keyframes: {
        fadeIn: { "0%": { opacity: "0" }, "100%": { opacity: "1" } },
        shimmer: {
          "0%, 20%": {
            maskPosition: "0 0",
            backgroundClip: "text",
            maskImage:
              "linear-gradient(110deg,white,45%,rgba(0,0,0,0.6),55%,white)",
            maskSize: "250% 100%",
          },
          "80%, 100%": {
            maskPosition: "-200% 0",
            backgroundClip: "text",
            maskImage:
              "linear-gradient(110deg,white,45%,rgba(0,0,0,0.6),55%,white)",
            maskSize: "250% 100%",
          },
        },
        wiggle: {
          "0%, 100%": { transform: transform + "rotate(-2deg)" },
          "50%": { transform: transform + "rotate(2deg)" },
        },
        blink: { "0%,70%,100%": { opacity: "1" }, "20%,50%": { opacity: "0" } },
        scaleIn: {
          "0%": { transform: transform + "scale(0.95)", opacity: "0" },
          "100%": { transform: transform + "scale(1)", opacity: "1" },
        },
        error: {
          "10%, 90%": { transform: transform + "translateX(-1px)" },
          "20%, 80%": { transform: transform + "translateX(2px)" },
          "30%, 50%, 70%": { transform: transform + "translateX(-4px)" },
          "40%, 60%": { transform: transform + "translateX(4px)" },
        },
      },
      animation: {
        "fade-in": "fadeIn 150ms ease-in-out",
        shimmer: "shimmer 6s ease-in-out infinite alternate",
        wiggle: "wiggle 0.25s ease-in-out infinite",
        blink: "blink 1.25s ease-out infinite",
        "scale-in": "scaleIn 300ms ease-out",
        error: "error 0.82s cubic-bezier(0.36, 0.07, 0.19, 0.97) both",
      },
      // prettier-ignore
      backgroundImage: {'gradient-from-c': 'radial-gradient(circle at center, var(--tw-gradient-stops))'},
      // prettier-ignore
      transitionTimingFunction: {'quad-in-out': 'cubic-bezier(0.46,0.03,0.52,0.96);'},
      // prettier-ignore
      fontFamily: { sans: [ 'Authentic Sans', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Oxygen-Sans', 'Ubuntu', 'Cantarell', 'Helvetica Neue', 'sans-serif', ], serif: [ 'Avara', 'Authentic Sans', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Oxygen-Sans', 'Ubuntu', 'Cantarell', 'Helvetica Neue', 'sans-serif', ], docs: [ 'Inter', '-apple-system', 'system-ui', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Liberation Sans', 'sans-serif', ], },
      borderRadius: { 100: "100%" },
      colors: {
        primary: makeOpacityColors(
          "--primary",
          [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950],
          [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
        ),
        gray: makeOpacityColors(
          "--gray",
          [],
          [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
        ),
        secondary: makeOpacityColors(
          "--secondary",
          [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950],
          [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
        ),
        accent: applyOpacityValue("--accent"),
        "accent-foreground": applyOpacityValue("--accent-foreground"),
        ring: applyOpacityValue("--ring"),
        background: applyOpacityValue("--background"),
      },
      ringColor: { ring: applyOpacityValue("--ring") },
      ringOffsetColor: { background: applyOpacityValue("--background") },
      scale: { 175: "1.75", 200: "2" },
      minWidth: minWidthFromTheme,
      // Simple 20 column grid
      gridTemplateColumns: { 20: "repeat(20, minmax(0, 1fr))" },
      // Simple 20 row grid
      gridTemplateRows: { 20: "repeat(20, minmax(0, 1fr))" },
      gridColumn: {
        "span-13": "span 13 / span 13",
        "span-14": "span 14 / span 14",
        "span-15": "span 15 / span 15",
        "span-16": "span 16 / span 16",
        "span-17": "span 17 / span 17",
        "span-18": "span 18 / span 18",
        "span-19": "span 19 / span 19",
        "span-20": "span 20 / span 20",
      },
      gridRow: {
        "span-7": "span 7 / span 7",
        "span-8": "span 8 / span 8",
        "span-9": "span 9 / span 9",
        "span-10": "span 10 / span 10",
        "span-11": "span 11 / span 11",
        "span-12": "span 12 / span 12",
        "span-13": "span 13 / span 13",
        "span-14": "span 14 / span 14",
        "span-15": "span 15 / span 15",
        "span-16": "span 16 / span 16",
        "span-17": "span 17 / span 17",
        "span-18": "span 18 / span 18",
        "span-19": "span 19 / span 19",
        "span-20": "span 20 / span 20",
      },
      // prettier-ignore
      gridColumnStart: {13:'13',14:'14',15:'15',16:'16',17:'17',18:'18',19:'19',20:'20',21:'21',},
      // prettier-ignore
      gridRowStart: {8:'8',9:'9',10:'10',11:'11',12:'12',13:'13',14:'14',15:'15',16:'16',17:'17',18:'18',19:'19',20:'20',21:'21',},
      // prettier-ignore
      gridColumnEnd: {13:'13',14:'14',15:'15',16:'16',17:'17',18:'18',19:'19',20:'20',21:'21',},
      // prettier-ignore
      gridRowEnd: { 8: '8', 9: '9', 10: '10', 11: '11', 12: '12', 13: '13', 14: '14', 15: '15', 16: '16', 17: '17', 18: '18', 19: '19', 20: '20', 21: '21' },
      typography: typographyFromTheme,
    },
  },
  plugins: [
    typography,
    headlessui,
    scrimGradients,
    animate,
    plugin(registerTailwindVariants),
  ],
};
export default preset;
