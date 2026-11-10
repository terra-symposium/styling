/**
 * docs/styling/1-colouring/_matrix.tsx
 */

/*//////////////////////////////////////////////////
IMPORTS
//////////////////////////////////////////////////*/

// COMPONENTS
import * as React from "react";

// DATA
import * as UI from "../../../src/components/ui/index.js";

// TYPES
import type {
  ButtonVariant,
  CardVariant,
} from "../../../src/components/ui/types.js";
import type { DataTableColumn } from "../../../src/components/data-table.js";

/*//////////////////////////////////////////////////
CONFIG
//////////////////////////////////////////////////*/

/** The shared palette used by both component-family matrices. */
const COLORS = [
  "primary",
  "secondary",
  "gray",
  "destructive",
  "success",
  "caution",
] as const;
/** Button actions support underline links as well as the standard button styles. */
const BUTTON_TREATMENTS = [
  "default",
  "outline",
  "ghost",
  "tonal",
  "glass",
  "underline",
] as const;
/** Cards support surface treatments; they do not have a separate default treatment. */
const CARD_TREATMENTS = [
  "outline",
  "ghost",
  "tonal",
  "saturated",
  "glass",
] as const;
type ColorRow = { color: (typeof COLORS)[number] };
/** A row per palette color lets the shared DataTable provide consistent row labels. */
const COLOR_ROWS: ColorRow[] = COLORS.map((c) => ({ color: c }));
const BUTTON_COLS = createButtonCols();
const CARD_COLS = createCardCols();

/*//////////////////////////////////////////////////
HELPERS
//////////////////////////////////////////////////*/

/**
 * Render the canonical variant name below the component example.
 *
 * @param props - Variant name and rendered component example to display together.
 *
 * @return A component example with its canonical variant name.
 */
function VariantExample({
  variant,
  children,
}: {
  variant: string;
  children: React.ReactNode;
}): React.JSX.Element {
  return (
    <div className="grid justify-items-start gap-1">
      {children}
      <code>{variant}</code>
    </div>
  );
}

/**
 * Create one button column for each supported treatment.
 *
 * @return A color column followed by one example column per button treatment.
 */
function createButtonCols(): DataTableColumn<ColorRow>[] {
  return [
    { key: "color", label: "Color", rowHeader: true },
    ...BUTTON_TREATMENTS.map((t) => ({
      key: t,
      label: t,
      width: "wide-wrapped" as const,
      render: ({ color: c }: ColorRow) => {
        const variant = `${c}-${t}` as ButtonVariant;

        // Underline treatments are links; other treatments remain real buttons.
        const example =
          t === "underline" ? (
            <UI.ButtonLink href="#card-surfaces" size="sm" variant={variant}>
              Sample
            </UI.ButtonLink>
          ) : (
            <UI.Button size="sm" variant={variant}>
              Sample
            </UI.Button>
          );
        return <VariantExample variant={variant}>{example}</VariantExample>;
      },
    })),
  ];
}

/**
 * Create one card column for each supported surface treatment.
 *
 * @return A color column followed by one example column per card treatment.
 */
function createCardCols(): DataTableColumn<ColorRow>[] {
  return [
    { key: "color", label: "Color", rowHeader: true },
    ...CARD_TREATMENTS.map((t) => ({
      key: t,
      label: t,
      width: "wide-wrapped" as const,
      render: ({ color: c }: ColorRow) => {
        const variant = `${c}-${t}` as CardVariant;
        return (
          <VariantExample variant={variant}>
            <UI.Card variant={variant} size="sm">
              <UI.CardContent>Sample</UI.CardContent>
            </UI.Card>
          </VariantExample>
        );
      },
    })),
  ];
}

/**
 * Shows each supported button color and treatment in the shared DataTable.
 *
 * @return A DataTable of all supported button colors and treatments.
 */
export function ButtonTreatmentMatrix(): React.JSX.Element {
  return (
    <UI.DataTable
      title="Button color and treatment matrix"
      description="Six palette colors combined with six button treatments"
      rows={COLOR_ROWS}
      columns={BUTTON_COLS}
      rowKey="color"
      variant="editor"
      tableWidth="wider"
    />
  );
}

/**
 * Shows each supported card color and surface treatment in the shared DataTable.
 *
 * @return A DataTable of all supported card colors and surface treatments.
 */
export function CardTreatmentMatrix(): React.JSX.Element {
  return (
    <UI.DataTable
      title="Card color and treatment matrix"
      description="Six palette colors combined with five card treatments"
      rows={COLOR_ROWS}
      columns={CARD_COLS}
      rowKey="color"
      variant="editor"
      tableWidth="wider"
    />
  );
}
