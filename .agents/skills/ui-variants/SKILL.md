---
name: ui-variants
description: Consolidate Terra UI variants without changing behavior.
metadata:
  related-files:
    - src/components/ui/variants.ts
    - src/components/ui/types.ts
    - src/components/ui/button.tsx
    - tests/components/ui/variants.test.ts
---

# UI Variants

## Trigger

Use this skill when adding, reviewing, consolidating, or migrating shared styles under `src/components/ui/`, especially when the request mentions repeated variants, shared primitives, color/type matrices, or localizing one-off variants.

## Purpose

The goal is a small set of understandable contracts that components compose. Follow the [Terra design language](../ui/references/terra-design-language.md) for font roles, hue-derived palette roles, contrast, and composition; this skill governs the typed component variant contract.

A component should obtain shared palette and state behavior from the primitive family that owns those decisions, while retaining its own dimensions, slot layout, and interaction behavior.

At consumers, express the palette-and-treatment choice as the component's canonical `variant` prop inline (for example, `variant='secondary-outline'`).

The matrix is a typed component contract, not a call-site object of utility strings. Prefer named component props for repeated presentation.

Reserve `className` for layout or genuine one-off geometry not owned by the component; do not make routine callers reconstruct the component's visual API with long utility lists.

## Boundaries

- Treat `src/components/ui/types.ts`, `src/components/ui/variants.ts`, UI source files, and `tests/components/ui/variants.test.ts` as one contract. Update all relevant parts together.
- Preserve the user's working tree. Inspect branch, status, existing diffs, and recent commits before editing. Do not reset or overwrite pre-existing changes.
- Keep work local unless the user explicitly asks for a push, deploy, or external write. Commit only when the user asks or has already authorized committing.
- Do not install missing dependencies merely to run a check. If a tool offers an interactive package install, stop that command and choose an available repository check; report any validation that could not run.
- Do not invent a visual rule from class-name similarity alone. Compare existing component behavior and selectors first.

## Contract model

The shared axes live in `src/components/ui/types.ts`:

- `UiSize` is `xs | sm | md | lg | xl`.
- `UiColor` is `primary | secondary | gray | destructive | success | caution`.
- `UiType` is `default | outline | ghost | tonal | saturated | underline | glass`; button links use the underline treatment.
- A plain color key remains a compatibility alias for the saturated treatment. Name button matrix entries `color-saturated`; `primary-saturated` keeps its distinct medium-size styling. Card and other component defaults are separate contracts.
- Each family gets a narrower type: actions exclude surface-only treatments, surfaces exclude action-only underline, and form controls expose only treatments that make sense for fields.
- Cards accept explicit color/treatment combinations without a `default` treatment; their default variant is `primary-tonal`.
- `UiSize` shares the scale keys, not a universal set of pixel dimensions. Preserve geometry appropriate to buttons, fields, cards, tooltips, and menus.

The canonical shared families in `variants.ts` are:

1. Action and toggle color/treatment matrices.
2. Surface color/treatment matrix and semantic feedback surface values.
3. Form-control color/treatment matrix, size, focus, invalid, and disabled behavior.
4. Text tone, size, and weight; label typography and alignment.
5. Focus-visible and disabled selector helpers; the interactive-control composition.
6. Neutral overlay surface, shared motion, and Radix side positioning.
7. Menu item intent, highlight, and indicator contracts shared by dropdown and context menus.

A contract belongs in `variants.ts` only when multiple UI components actually consume it. Keep one-consumer variants in the component file. Examples include badge-only tones, button-group orientation, select-item padding, tooltip dimensions, and an auth input pattern.

## Workflow

### 1. Establish repository state

1. Confirm the repository root and branch. Read applicable `AGENTS.md` files and the current `variants.ts`/types documentation.
2. Run `git status --short`, `git diff --stat`, and inspect relevant diffs. Record which changes predate the task.
3. Fetch/pull only as requested. If a merge is needed, first commit the working changes only when authorized, then integrate the intended upstream branch and resolve conflicts by understanding both sides. Preserve meaningful local and incoming behavior; never select one side wholesale without review.
4. After a merge, re-run the inventory. Upstream may have deleted components or changed consumers and test expectations.

### 2. Inventory repetition and ownership

Search both definitions and consumers. Start with commands like:

```sh
rg -n "export const .*VARIANTS|export const .*_VARIANTS|cva\\(" src/components/ui
rg -n "from ['\"](@ui/variants|@components/ui/variants|\./variants)['\"]|VARIANTS\(" src
rg -n "border-(primary|secondary|gray|red)|bg-(primary|secondary|gray|red)|text-(primary|secondary|gray|red)" src/components/ui
rg -n "UiSize|Size|variant\\??:" src/components/ui src/components/ui/types.ts
```

For each repeated block:

- Identify the element and slot where it is applied.
- Compare normal, hover, selected, invalid, focus-visible, disabled, dark-mode, and print states.
- Separate palette/treatment from width, height, padding, radius, placement, typography role, and animation.
- Count component consumers. If only one component needs a complete style choice, keep it local even if its classes resemble a shared primitive.
- Check type imports and runtime imports, including indirect consumers in wrappers and app pages.

Do not replace every repeated token mechanically. The same `bg-*` class can encode different contrast, interaction, or surface semantics.

### 3. Define matrix types before class grids

In `types.ts`, document the shared axes and create family-specific unions with template-literal keys. Use a type shape such as:

```ts
type FamilyVariant = UiColor | `${UiColor}-${AllowedUiType}`;
```

Use `Exclude`/`Extract` so invalid combinations fail at compile time. Keep feedback status types separate from `UiColor`. Keep local props, such as a badge's editorial tone or select's compatibility `default`, explicit and narrow.

When a component exposes legacy names, keep aliases at its existing API boundary and map them to canonical matrix keys. Avoid repeating utility classes in alias entries.

### 4. Build shared contracts once

In `variants.ts`:

- Keep each color/treatment grid explicit and complete for its family.
- Flatten the grid into canonical keys such as `secondary-outline` and `destructive-tonal`.
- Store Tailwind class names as complete static strings; do not construct class fragments from color names at runtime.
- Reference canonical values from compatibility aliases.
- Put shared state, typography, overlay, and menu primitives in named, documented sections.
- Compose `FOCUS_VISIBLE_VARIANTS`, `DISABLED_STATE_VARIANTS`, and `INTERACTIVE_CONTROL_VARIANTS` where their selector semantics match.
- Keep `OVERLAY_SURFACE_VARIANTS`, `OVERLAY_MOTION_VARIANTS`, and `RADIX_SIDE_POSITION_VARIANTS` separate so an overlay can reuse only what it needs.
- Avoid exporting implementation helpers or values consumed by just one component.

Use `UiSize` for the five shared keys in every family. A family's size map may use different dimensions. Keep button-only `icon`, `icon-sm`, `icon-xs`, and `icon-lg` values in the action contract; do not force them onto fields or surfaces.

### 5. Migrate components without changing their role

For each consumer, compose the shared palette/state contract with local geometry. Preserve:

- DOM and Radix structure, refs, props, labels, keyboard support, and ARIA state;
- padding, height, width, radius, positioning, responsive rules, and slot relationships;
- action loading/icon behavior, selected state, invalid state, disabled state, and focus styling;
- existing aliases that callers still use;
- semantic feedback distinctions, including appropriate light and dark colors.

If the shared class must differ for one component (for example an input's transparent ghost geometry), keep that narrow adjustment local instead of weakening the family contract. Normalize to the canonical family key first, then apply the local geometry class.

Move any one-consumer export into the component that owns it and update all imports/types. Do not leave a deprecated re-export in `variants.ts` unless a documented external API needs it.

### 6. Test and document the ownership boundary

Update the targeted UI variant-consumer test to check:

- every documented valid color/treatment/size combination produces non-empty classes;
- unsupported family combinations are absent from the typed contract;
- all five `UiSize` keys are accepted;
- all four button icon sizes and necessary compatibility aliases still generate classes;
- semantic feedback values retain their tone;
- shared contracts have multiple UI consumers;
- one-consumer contracts are local and are not exported from `variants.ts`.

Update the owning component or package documentation whenever the matrix, family boundaries, aliases, or shared export consumers change. Keep type comments and documentation terminology aligned. Organize examples so valid combinations and ownership boundaries are easy to scan. Show consumers selecting the canonical variant prop instead of repeating raw presentation classes.

### 7. Validate and report

Run the narrowest useful checks first, then strict types and repository checks available without changing dependencies. At minimum, run the targeted variant test, the repository TypeScript check (`pnpm exec tsc -p config/tsconfig.json --noEmit`), and `git diff --check` when those commands are available. Do not claim a check passed if it was skipped, prompted for a dependency install, or returned only partial diagnostics.

Review the final diff for unintended geometry changes, duplicate classes, missing import updates, stale exports, inaccessible controls, and type widening. Report changed contract families, local variants moved, validation results, merge/conflict outcome if applicable, and any remaining limitation.

## Common failure modes

- Treating a repeated color word as proof that two entire class blocks are equivalent.
- Mixing `success`, `warning`, or `error` into `UiColor` instead of using semantic surface states.
- Creating the full cartesian product for a family when some treatments make no sense there.
- Sharing one dimension table across components whose geometry differs.
- Leaving dynamic Tailwind class construction that the scanner cannot discover.
- Widening component props to `string` after generating a matrix with `Object.fromEntries`.
- Moving a helper to the shared file when it still has only one real UI consumer.
- Removing a compatibility alias without searching all callers and type-only imports.
- Running broad refactors after a pull without rechecking whether upstream removed or changed consumers.
- Claiming a strict typecheck based on a command that only printed an install prompt or warnings.
