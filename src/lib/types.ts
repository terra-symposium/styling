/**
 * src/lib/types.ts
 * Shared type contracts for generated color palettes.
 */

/*//////////////////////////////////////////////////
TYPES
//////////////////////////////////////////////////*/

// COLOR PALETTE
/** Fixed-length tuple for the twelve ordered steps in a color scale. */
export type ArrayOf12<T> = [T, T, T, T, T, T, T, T, T, T, T, T];

/** Optional numeric settings accepted by the `colors` palette generator. */
export type ColorGenOpts = {
  accentLightness?: number;
  accentChroma?: number;
  hueAvoidanceShift?: number;
  hoverLightnessShift?: number;
  hoverChromaMultiplier?: number;
};

/** Light and dark appearances of a twelve-step color scale. */
export type ColorScales = { light: ArrayOf12<string>; dark: ArrayOf12<string> };
