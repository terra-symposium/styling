/**
 * docs/styling/1-colouring/_matrix.tsx
 */

/*//////////////////////////////////////////////////
IMPORTS
//////////////////////////////////////////////////*/

// COMPONENTS
import * as React from 'react';

// DATA
import * as UI from '../../../src/components/ui/index.js';

// TYPES
import type { ButtonVariant, CardVariant } from '../../../src/components/ui/types.js';
import type { DataTableColumn } from '../../../src/components/data-table.js';

/*//////////////////////////////////////////////////
CONFIG
//////////////////////////////////////////////////*/

/** The shared palette used by both component-family matrices. */
const COLORS = ['primary', 'secondary', 'gray', 'destructive', 'success', 'caution'] as const;
/** Button actions support underline links as well as the standard button styles. */
const BUTTON_TREATMENTS = ['default', 'outline', 'ghost', 'tonal', 'glass', 'underline'] as const;
/** Cards support surface treatments; they do not have a separate default treatment. */
const CARD_TREATMENTS = ['outline', 'ghost', 'tonal', 'saturated', 'glass'] as const;
/** Identifies the palette color used by each treatment-matrix row. */
type ColorRow = { color: (typeof COLORS)[number] };
/** A row per palette color lets the shared DataTable provide consistent row labels. */
const COLOR_ROWS: ColorRow[] = [];
for (const color of COLORS) COLOR_ROWS.push({ color });
// terra-quality-ignore single-use -- Build button columns once so DataTable receives a stable column array across rerenders.
const BUTTON_COLS = createButtonCols();
// terra-quality-ignore single-use -- Build card columns once so DataTable receives a stable column array across rerenders.
const CARD_COLS = createCardCols();

/*//////////////////////////////////////////////////
HELPERS
//////////////////////////////////////////////////*/

/**
 * Render the canonical variant name below the component example.
 *
 * @param variant - Canonical variant name shown beneath the example.
 * @param children - Rendered component example.
 *
 * @return A component example with its canonical variant name.
 */
function VariantExample({ variant, children }: { variant: string; children: React.ReactNode }): React.JSX.Element {
	return (
		<div className='grid justify-items-start gap-1'>
			{children}
			<code>{variant}</code>
		</div>
	);
}

// terra-quality-ignore single-use -- Keep createButtonCols as a named declaration so its authored TSDoc stays attached. TSDoc: Create one button column for each supported treatment.
/**
 * Create one button column for each supported treatment.
 *
 * @return A color column followed by one example column per button treatment.
 */
function createButtonCols(): DataTableColumn<ColorRow>[] {
	const cols: DataTableColumn<ColorRow>[] = [{ key: 'color', label: 'Color', rowHeader: true }];
	for (const treatment of BUTTON_TREATMENTS) {
		cols.push(createButtonCol(treatment));
	}
	return cols;
}

/** Builds a button treatment column with the correct link or button example.
 * @param treatment - Supported button treatment shown in this column.
 * @return A data-table column rendering the selected button treatment.
 */
function createButtonCol(treatment: (typeof BUTTON_TREATMENTS)[number]): DataTableColumn<ColorRow> {
	// terra-quality-ignore single-use -- Keep renderButtonExample as a named declaration so its authored TSDoc stays attached. TSDoc: Renders one color row with the selected button treatment.
	/**
	 * Renders one color row with the selected button treatment.
	 *
	 * @param color - Color name used to form the button variant.
	 * @return A variant preview containing the matching button or link.
	 */
	function renderButtonExample({ color }: ColorRow): React.JSX.Element {
		const variant = `${color}-${treatment}` as ButtonVariant;
		return (
			<VariantExample variant={variant}>
				{treatment === 'underline' ? (
					<UI.ButtonLink href='#card-surfaces' size='sm' variant={variant}>
						Sample
					</UI.ButtonLink>
				) : (
					<UI.Button size='sm' variant={variant}>
						Sample
					</UI.Button>
				)}
			</VariantExample>
		);
	}
	return {
		key: treatment,
		label: treatment,
		width: 'wide-wrapped',
		render: renderButtonExample,
	};
}

// terra-quality-ignore single-use -- Keep createCardCols as a named declaration so its authored TSDoc stays attached. TSDoc: Create one card column for each supported surface treatment.
/**
 * Create one card column for each supported surface treatment.
 *
 * @return A color column followed by one example column per card treatment.
 */
function createCardCols(): DataTableColumn<ColorRow>[] {
	const cols: DataTableColumn<ColorRow>[] = [{ key: 'color', label: 'Color', rowHeader: true }];
	for (const treatment of CARD_TREATMENTS) {
		cols.push(createCardCol(treatment));
	}
	return cols;
}

/** Builds a card treatment column with its corresponding surface example.
 * @param treatment - Supported card treatment shown in this column.
 * @return A data-table column rendering the selected card surface.
 */
function createCardCol(treatment: (typeof CARD_TREATMENTS)[number]): DataTableColumn<ColorRow> {
	// terra-quality-ignore single-use -- Keep renderCardExample as a named declaration so its authored TSDoc stays attached. TSDoc: Renders one color row with the selected card surface treatment.
	/**
	 * Renders one color row with the selected card surface treatment.
	 *
	 * @param color - Color name used to form the card variant.
	 * @return A variant preview containing a card with the matching surface.
	 */
	function renderCardExample({ color }: ColorRow): React.JSX.Element {
		const variant = `${color}-${treatment}` as CardVariant;
		return (
			<VariantExample variant={variant}>
				<UI.Card variant={variant} size='sm'>
					<UI.CardContent>Sample</UI.CardContent>
				</UI.Card>
			</VariantExample>
		);
	}
	return {
		key: treatment,
		label: treatment,
		width: 'wide-wrapped',
		render: renderCardExample,
	};
}

/**
 * Shows each supported button color and treatment in the shared DataTable.
 *
 * @return A DataTable of all supported button colors and treatments.
 */
export function ButtonTreatmentMatrix(): React.JSX.Element {
	return (
		<UI.DataTable
			title='Button color and treatment matrix'
			description='Six palette colors combined with six button treatments'
			rows={COLOR_ROWS}
			columns={BUTTON_COLS}
			rowKey='color'
			variant='editor'
			tableWidth='wider'
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
			title='Card color and treatment matrix'
			description='Six palette colors combined with five card treatments'
			rows={COLOR_ROWS}
			columns={CARD_COLS}
			rowKey='color'
			variant='editor'
			tableWidth='wider'
		/>
	);
}
