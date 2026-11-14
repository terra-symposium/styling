/**
 * src/documents/presentation.ts
 */

/*//////////////////////////////////////////////////
IMPORTS
//////////////////////////////////////////////////*/

// API
import fs from 'node:fs/promises';
import path from 'node:path';
import { createDocumentBrand } from './theme.js';

// COMPONENTS
import JSZip from 'jszip';
import PptxGenJS from 'pptxgenjs';

// TYPES
import type { TerraDocumentBrand, TerraDocumentBrandOptions } from './theme.js';
/** Minimal slide surface consumed by the Terra presentation builder. */
type TerraSlide = {
	background: { color: string };
	addText: (value: string, options: Record<string, unknown>) => void;
	addShape: (shape: string, options: Record<string, unknown>) => void;
	addImage: (options: Record<string, unknown>) => void;
	addTable: (rows: unknown[][], options: Record<string, unknown>) => void;
};
/** Minimal PptxGenJS API surface used by the presentation builder. */
type TerraPresentation = {
	layout: string;
	author: string;
	company: string;
	subject: string;
	title: string;
	lang: string;
	theme: Record<string, string>;
	ShapeType: { line: string; rect: string };
	addSlide: (options?: { masterName?: string }) => TerraSlide;
	defineSlideMaster: (props: Record<string, unknown>) => void;
	writeFile: (options: { fileName: string }) => Promise<string>;
};
/** Title, subtitle, and brand settings for the editable slide-deck template. */
export type PresentationTemplateOptions = {
	title?: string;
	subtitle?: string;
	brand?: TerraDocumentBrandOptions;
	/** Convenience override for the generated deck's primary hue saturation. */
	saturation?: TerraDocumentBrandOptions['saturation'];
};

/*//////////////////////////////////////////////////
PRESENTATION HELPERS
//////////////////////////////////////////////////*/

/**
 * Converts a CSS hex color to the uppercase format expected by Office.
 *
 * @param value - CSS hex color with or without a leading hash.
 *
 * @return The uppercase hexadecimal color without a leading hash.
 */
function officeColor(value: string): string {
	return value.replace(/^#/, '').toUpperCase();
}
/**
 * Formats a light-appearance palette entry as a CSS hex color.
 *
 * @param scale - Light and dark RGB channel values for one color scale.
 * @param index - Palette position to format.
 *
 * @return The selected light color as a hash-prefixed hex string.
 */
function scaleToken(scale: { light: readonly string[]; dark: readonly string[] }, index: number): string {
	const channels: string[] = [];
	for (const channel of scale.light[index]!.split(' ')) {
		channels.push(colorChannelToHex(channel));
	}
	return `#${channels.join('')}`;
}
/** Converts one 0–255 RGB channel into two uppercase hexadecimal digits.
 *
 * @param channel Numeric channel value encoded as a string.
 *
 * @return Two-digit lowercase hexadecimal channel text.
 */
function colorChannelToHex(channel: string): string {
	return Math.round(Number(channel)).toString(16).padStart(2, '0');
}
/**
 * Builds common text styling for a PowerPoint text object.
 *
 * @param fontFace - Font family applied to the text.
 * @param fontSize - Text size in points.
 * @param colorValue - CSS hex color used for the text.
 * @param extra - Additional PptxGenJS text options that override defaults.
 *
 * @return The normalized text options with color, font, and zero margin.
 */
function textOptions(fontFace: string, fontSize: number, colorValue: string, extra: Record<string, unknown> = {}): Record<string, unknown> {
	return {
		color: officeColor(colorValue),
		fontFace,
		fontSize,
		margin: 0,
		...extra,
	};
}
/**
 * Adds styled text to a slide at the supplied position.
 *
 * @param slide - Slide that receives the text.
 * @param value - Text content to add.
 * @param style - Text styling options.
 * @param position - Position and dimensions in slide units.
 *
 * @return Nothing; the slide is updated in place.
 */
function addText(slide: TerraSlide, value: string, style: Record<string, unknown>, position: { x: number; y: number; w: number; h: number }): void {
	slide.addText(value, { ...style, ...position } as never);
}

/**
 * Builds the logo object for a slide master, respecting dark-background settings.
 *
 * @param brand - Resolved brand configuration for the deck.
 * @param dark - Whether the master uses a dark background.
 *
 * @return The logo object list, empty when the selected logo is disabled.
 */
function logoMasterObjects(brand: TerraDocumentBrand, dark: boolean): Record<string, unknown>[] {
	const logo = dark ? brand.logoOnDark : brand.logo;
	if (logo === false) return [];
	if (logo === 'terra-wordmark')
		return [
			{
				text: {
					text: 'terra symposium',
					options: {
						x: 0.62,
						y: 0.32,
						w: 2.8,
						h: 0.32,
						fontFace: 'Avara',
						fontSize: 14,
						bold: true,
						italic: true,
						color: officeColor(dark ? brand.colors.paper : brand.colors.ink),
						margin: 0,
					},
				},
			},
		];
	return [
		{
			image: {
				path: logo,
				x: 0.62,
				y: 0.28,
				w: 2.15,
				h: 0.34,
				altText: 'Brand logo',
			},
		},
	];
}

/*//////////////////////////////////////////////////
PRESENTATION TEMPLATE
//////////////////////////////////////////////////*/

/**
 * Creates a five-slide, native PowerPoint starter deck with editable layouts and a UI-matched table.
 *
 * @param options - Optional deck title, subtitle, and Terra brand settings.
 *
 * @return A PptxGenJS presentation whose write operation applies the brand palette.
 */
export function createPresentationTemplate(options: PresentationTemplateOptions = {}): TerraPresentation {
	const brand = createDocumentBrand({
		...options.brand,
		saturation: options.saturation ?? options.brand?.saturation,
	});
	const c = brand.colors;
	const pptx = new (PptxGenJS as unknown as new () => TerraPresentation)();
	pptx.layout = 'LAYOUT_WIDE';
	pptx.author = 'Terra Symposium';
	pptx.company = 'Terra Symposium';
	pptx.subject = 'Editable presentation template';
	pptx.title = options.title ?? 'Terra presentation template';
	pptx.lang = 'en-AU';
	pptx.theme = {
		headFontFace: brand.fonts.body,
		bodyFontFace: brand.fonts.body,
		lang: 'en-AU',
	};
	// terra-quality-ignore single-use -- Bind the original PptxGenJS writer before replacing writeFile; inlining at the call would recurse into the wrapper.
	const writeFile = pptx.writeFile.bind(pptx);
	// terra-quality-ignore single-use -- Keep writeBrandedPresentation as a named declaration so its authored TSDoc stays attached. TSDoc: Writes the deck and applies the resolved brand palette to its theme.
	/** Writes the deck and applies the resolved brand palette to its theme.
	 *
	 * @param writeOptions Output filename passed to PptxGenJS.
	 *
	 * @return The result returned by PptxGenJS after the theme is updated.
	 */
	async function writeBrandedPresentation(writeOptions: { fileName: string }): Promise<string> {
		// terra-quality-ignore single-use -- Keep the original writer result before applying the brand; the wrapper must return that exact result afterward.
		const result = await writeFile(writeOptions);
		await applyPresentationBrand(writeOptions.fileName, brand);
		return result;
	}
	pptx.writeFile = writeBrandedPresentation;

	/**
	 * Registers a decorative master without editable title and body placeholders.
	 *
	 * @param title - Unique master name.
	 * @param background - CSS hex color used for the background.
	 * @param layout - Named layout variant used to choose foreground treatment.
	 *
	 * @return Nothing; the master is registered on the presentation.
	 */
	function registerMaster(title: string, background: string, layout: 'cover' | 'section' | 'content' | 'table' | 'closing'): void {
		const dark = layout === 'closing';
		pptx.defineSlideMaster({
			title,
			background: { color: officeColor(background) },
			objects: [
				...logoMasterObjects(brand, dark),
				{
					line: {
						x: 0.62,
						y: 6.9,
						w: 12.08,
						h: 0,
						line: {
							color: officeColor(dark ? c.primaryStrong : c.line),
							width: 0.7,
						},
					},
				},
			],
		});
	}

	// Named native layouts keep content editable in PowerPoint and Keynote.
	registerMaster('TERRA_COVER', c.paper, 'cover');
	registerMaster('TERRA_SECTION', c.surface, 'section');
	registerMaster('CONTENT', c.paper, 'content');
	registerMaster('TERRA_TABLE', c.paper, 'table');
	registerMaster('TERRA_CLOSING', c.ink, 'closing');

	// Keep the visual examples free of PowerPoint's inherited "Click to add" prompts.
	// Separate editable layouts remain available from Home > New Slide for real authoring.
	/**
	 * Registers a master with editable title and body placeholders.
	 *
	 * @param title - Unique master name.
	 * @param layout - Named layout variant used to position its placeholders.
	 *
	 * @return Nothing; the master is registered on the presentation.
	 */
	function registerEditableMaster(title: string, layout: 'cover' | 'section' | 'content' | 'table' | 'closing'): void {
		const dark = layout === 'closing';
		// terra-quality-ignore single-use -- Resolve title foreground before building logo objects so color getter order stays unchanged.
		const foreground = dark ? c.paper : c.ink;
		// terra-quality-ignore single-use -- Choose title geometry before PptxGenJS constructs slide-master objects, preserving setup order.
		const titlePosition = layout === 'cover' ? { x: 0.62, y: 2.05, w: 8.7, h: 1.35 } : layout === 'section' ? { x: 0.62, y: 2.0, w: 9.0, h: 1.05 } : { x: 0.62, y: 0.72, w: 12.0, h: 0.56 };
		// terra-quality-ignore single-use -- Choose body geometry before PptxGenJS constructs slide-master objects, preserving setup order.
		const bodyPosition = layout === 'cover' ? { x: 0.62, y: 3.72, w: 8.0, h: 0.9 } : layout === 'section' ? { x: 0.62, y: 3.35, w: 8.0, h: 0.76 } : { x: 0.62, y: 1.42, w: 11.9, h: 0.45 };
		pptx.defineSlideMaster({
			title,
			background: {
				color: officeColor(layout === 'closing' ? c.ink : layout === 'section' ? c.surface : c.paper),
			},
			objects: [
				...logoMasterObjects(brand, dark),
				{
					line: {
						x: 0.62,
						y: 6.9,
						w: 12.08,
						h: 0,
						line: {
							color: officeColor(dark ? c.primaryStrong : c.line),
							width: 0.7,
						},
					},
				},
				{
					placeholder: {
						options: {
							name: 'Title',
							type: 'title',
							...titlePosition,
							fontFace: brand.fonts.body,
							fontSize: layout === 'cover' || layout === 'closing' ? 32 : 25,
							color: officeColor(foreground),
							align: 'left',
							valign: 'middle',
							margin: 0,
							fit: 'shrink',
						},
						text: '',
					},
				},
				{
					placeholder: {
						options: {
							name: 'Body',
							type: 'body',
							...bodyPosition,
							fontFace: brand.fonts.body,
							fontSize: 14,
							color: officeColor(dark ? c.paper : c.muted),
							align: 'left',
							valign: 'top',
							margin: 0,
							fit: 'shrink',
						},
						text: '',
					},
				},
			],
		});
	}
	registerEditableMaster('TERRA_EDITABLE_COVER', 'cover');
	registerEditableMaster('TERRA_EDITABLE_SECTION', 'section');
	registerEditableMaster('TERRA_EDITABLE_CONTENT', 'content');
	registerEditableMaster('TERRA_EDITABLE_TABLE', 'table');
	registerEditableMaster('TERRA_EDITABLE_CLOSING', 'closing');

	// Cover: one decorative wordmark, left-aligned title and restrained hue field.
	{
		const slide = pptx.addSlide({ masterName: 'TERRA_COVER' });
		slide.addShape(pptx.ShapeType.rect, {
			x: 9.8,
			y: 0,
			w: 3.533,
			h: 7.5,
			line: { color: officeColor(c.primarySoft), transparency: 100 },
			fill: { color: officeColor(c.primarySoft) },
		});
		addText(slide, 'PRESENTATION TEMPLATE', textOptions(brand.fonts.body, 9, c.primaryStrong), { x: 0.62, y: 1.55, w: 5.8, h: 0.22 });
		addText(
			slide,
			options.title ?? 'The Styling system',
			textOptions(brand.fonts.body, 34, c.ink, {
				breakLine: false,
				fit: 'shrink',
				valign: 'middle',
			}),
			{ x: 0.62, y: 2.05, w: 8.5, h: 1.25 },
		);
		addText(
			slide,
			options.subtitle ?? 'A clear starting point for ideas, decisions and work in progress.',
			textOptions(brand.fonts.body, 17, c.muted, {
				fit: 'shrink',
				valign: 'top',
			}),
			{ x: 0.62, y: 3.62, w: 7.6, h: 0.72 },
		);
		addText(slide, brand.saturation.toUpperCase() + ' SATURATION', textOptions(brand.fonts.body, 9, c.primaryStrong), { x: 10.1, y: 6.48, w: 2.8, h: 0.24 });
	}
	// Section opener: left aligned, with three short working principles rather than a centered hero.
	{
		const slide = pptx.addSlide({ masterName: 'TERRA_SECTION' });
		addText(slide, '01  /  FOUNDATIONS', textOptions(brand.fonts.body, 9, c.primaryStrong), { x: 0.62, y: 1.42, w: 4.0, h: 0.2 });
		addText(slide, 'Make the system visible', textOptions(brand.fonts.body, 30, c.ink, { fit: 'shrink' }), { x: 0.62, y: 2.0, w: 9.0, h: 1.0 });
		addText(slide, 'Use a small set of clear choices to give every page a shared visual voice.', textOptions(brand.fonts.body, 17, c.muted, { fit: 'shrink' }), { x: 0.62, y: 3.32, w: 8.0, h: 0.68 });
		slide.addShape(pptx.ShapeType.line, {
			x: 0.62,
			y: 4.35,
			w: 1.25,
			h: 0,
			line: { color: officeColor(c.primary), width: 2 },
		});
		const principles = [
			['Color', 'Generate from one hue scale.'],
			['Type', 'Use Authentic Sans for reading.'],
			['Space', 'Give each idea room to land.'],
		];
		for (const [index, [label, description]] of principles.entries()) {
			const x = 0.62 + index * 3.95;
			addText(slide, label!, textOptions(brand.fonts.body, 15, c.primaryStrong), { x, y: 5.0, w: 3.3, h: 0.3 });
			addText(slide, description!, textOptions(brand.fonts.body, 11, c.muted, { fit: 'shrink' }), { x, y: 5.42, w: 3.45, h: 0.48 });
		}
	}
	// Palette slide shows roles and contrast without exposing serialized hex or RGB values.
	{
		const slide = pptx.addSlide({ masterName: 'CONTENT' });
		addText(slide, 'Color roles', textOptions(brand.fonts.body, 25, c.ink), {
			x: 0.62,
			y: 0.72,
			w: 8.0,
			h: 0.56,
		});
		addText(slide, 'The selected hue creates the primary scale, its complement creates secondary, and gray stays neutral.', textOptions(brand.fonts.body, 13, c.muted, { fit: 'shrink' }), {
			x: 0.62,
			y: 1.42,
			w: 10.7,
			h: 0.38,
		});
		const swatches = [c.paper, c.surface, c.primary, c.secondary, c.ink];
		const labels = ['Page', 'Raised surface', 'Primary action', 'Complement', 'Text'];
		for (let i = 0; i < swatches.length; i += 1) {
			const x = 0.62 + i * 2.42;
			slide.addShape(pptx.ShapeType.rect, {
				x,
				y: 2.2,
				w: 2.12,
				h: 1.3,
				fill: { color: officeColor(swatches[i]!) },
				line: { color: officeColor(c.line), width: 0.5 },
			});
			addText(slide, labels[i]!, textOptions(brand.fonts.body, 11, c.primaryStrong, { fit: 'shrink' }), { x, y: 3.68, w: 2.12, h: 0.24 });
		}
		addText(slide, 'Low, medium and high variants change chroma while each new document build receives a fresh hue.', textOptions(brand.fonts.body, 13, c.muted, { fit: 'shrink' }), {
			x: 0.62,
			y: 4.5,
			w: 9.6,
			h: 0.42,
		});
	}
	// Native editable table follows Styling's Table primitives: left aligned head, roomy cells, bottom-only rules.
	{
		const slide = pptx.addSlide({ masterName: 'TERRA_TABLE' });
		addText(slide, 'A table that matches the UI', textOptions(brand.fonts.body, 25, c.ink), { x: 0.62, y: 0.72, w: 9.0, h: 0.56 });
		addText(slide, 'Same hierarchy, row rules and cell spacing as the Styling table component.', textOptions(brand.fonts.body, 13, c.muted), { x: 0.62, y: 1.42, w: 9.0, h: 0.35 });
		const none = { type: 'none' };
		// terra-quality-ignore single-use -- Share one bottom-border object across table cells so PptxGenJS sees consistent border options.
		const bottom = {
			type: 'solid',
			color: officeColor(scaleToken(brand.scales.primary, 5)),
			pt: 0.65,
		};
		/**
		 * Creates one table cell using the deck's body font and row divider.
		 *
		 * @param text - Cell text content.
		 * @param options - Optional cell styling overrides.
		 *
		 * @return A PptxGenJS table cell value and options pair.
		 */
		function cell(text: string, options: Record<string, unknown> = {}): { text: string; options: Record<string, unknown> } {
			return {
				text,
				options: {
					fontFace: brand.fonts.body,
					fontSize: 12,
					color: officeColor(c.ink),
					margin: [0.1, 0.16, 0.1, 0.16],
					valign: 'middle',
					border: [none, none, bottom, none],
					...options,
				},
			};
		}
		// terra-quality-ignore single-use -- Build all cell values before passing the rows to PptxGenJS, preserving generation order.
		const rows = [
			[
				cell('Element', {
					color: officeColor(c.primaryStrong),
					fontSize: 11,
					margin: [0.12, 0.16, 0.12, 0.16],
				}),
				cell('Styling UI', {
					color: officeColor(c.primaryStrong),
					fontSize: 11,
					margin: [0.12, 0.16, 0.12, 0.16],
				}),
				cell('Office template', {
					color: officeColor(c.primaryStrong),
					fontSize: 11,
					margin: [0.12, 0.16, 0.12, 0.16],
				}),
			],
			[cell('Header', { color: officeColor(c.primaryStrong) }), cell('12-unit height; left aligned.'), cell('12 pt height; left aligned.')],
			[cell('Body row', { color: officeColor(c.primaryStrong) }), cell('16-unit cell padding.'), cell('Roomy horizontal and vertical padding.')],
			[cell('Row divider', { color: officeColor(c.primaryStrong) }), cell('Primary 6 border below each row.'), cell('Thin hue-generated rule below each row.')],
			[
				cell('Selected', { color: officeColor(c.primaryStrong) }),
				cell('Primary 2 surface.'),
				cell('Same hue scale and subtle surface fill.', {
					fill: { color: officeColor(c.primarySoft) },
				}),
			],
		];
		slide.addTable(rows, {
			x: 0.62,
			y: 2.08,
			w: 12.08,
			h: 3.48,
			colW: [2.18, 4.95, 4.95],
			rowH: [0.58, 0.68, 0.68, 0.68, 0.68],
			fontFace: brand.fonts.body,
			fontSize: 11,
			color: officeColor(c.ink),
			fill: { color: officeColor(c.paper) },
			margin: [0.1, 0.16, 0.1, 0.16],
			border: [none, none, none, none],
			autoFit: false,
			vertAlign: 'middle',
		});
		addText(slide, 'Use a clear header, no vertical grid, and no alternating fill unless row selection needs it.', textOptions(brand.fonts.body, 11, c.muted, { fit: 'shrink' }), {
			x: 0.62,
			y: 5.95,
			w: 10.8,
			h: 0.32,
		});
	}
	// Closing: dark ink is reserved for one closing surface; the functional title remains sans and left aligned.
	{
		const slide = pptx.addSlide({ masterName: 'TERRA_CLOSING' });
		addText(slide, 'NEXT', textOptions(brand.fonts.body, 9, c.primarySoft), {
			x: 0.62,
			y: 1.55,
			w: 2.0,
			h: 0.22,
		});
		addText(slide, 'Take the system into your work', textOptions(brand.fonts.body, 32, c.paper, { fit: 'shrink' }), { x: 0.62, y: 2.1, w: 9.6, h: 1.05 });
		addText(slide, 'Replace the sample content. Keep the hierarchy, table treatment and generated palette.', textOptions(brand.fonts.body, 15, c.paper, { fit: 'shrink' }), {
			x: 0.62,
			y: 3.5,
			w: 8.8,
			h: 0.56,
		});
	}
	return pptx;
}

/**
 * Applies a generated Terra palette to the OOXML theme of a PptxGenJS deck.
 *
 * @param presentationPath - Path to the `.pptx` file whose theme will be updated.
 * @param brandOrOptions - Existing brand or options used to generate one.
 *
 * @return Resolves after the theme palette and package content types are finalized.
 */
export async function applyPresentationBrand(presentationPath: string, brandOrOptions: TerraDocumentBrand | TerraDocumentBrandOptions = {}): Promise<void> {
	await finalizePresentation(presentationPath, 'scales' in brandOrOptions ? brandOrOptions : createDocumentBrand(brandOrOptions));
}

/**
 * Replaces exact text in slide XML parts of a generated PPTX.
 *
 * @param sourcePath - Existing generated presentation to edit.
 * @param destinationPath - Path where the edited presentation is written.
 * @param replacements - Map of exact source text to replacement text.
 *
 * @return Resolves after matching slide text has been replaced.
 *
 * @throws If none of the requested source text occurs in slide parts.
 */
export async function editPresentationTemplate(sourcePath: string, destinationPath: string, replacements: Record<string, string>): Promise<void> {
	// terra-quality-ignore single-use -- Keep isSlidePart as a named declaration so its authored TSDoc stays attached. TSDoc: Selects only numbered slide XML parts for exact-text edits.
	/** Selects only numbered slide XML parts for exact-text edits.
	 *
	 * @param name Package entry name.
	 *
	 * @return Whether the entry is a numbered presentation slide.
	 */
	function isSlidePart(name: string): boolean {
		return /^ppt\/slides\/slide\d+\.xml$/.test(name);
	}
	await replaceOfficeText(sourcePath, destinationPath, replacements, isSlidePart);
}

/**
 * Replaces exact text in selected entries of an OOXML presentation package.
 *
 * @param sourcePath - Existing package file to edit.
 * @param destinationPath - Path where the updated package is written.
 * @param replacements - Map of exact source text to replacement text.
 * @param include - Predicate selecting package entry names eligible for replacement.
 *
 * @return Resolves after the updated package has been written.
 *
 * @throws If none of the requested text occurs in selected entries.
 */
export async function replaceOfficeText(sourcePath: string, destinationPath: string, replacements: Record<string, string>, include: (entry: string) => boolean): Promise<void> {
	const zip = await JSZip.loadAsync(await fs.readFile(sourcePath));
	let replacementsMade = 0;
	for (const [entryName, entry] of Object.entries(zip.files)) {
		if (entry.dir || !include(entryName)) continue;
		let xml = await entry.async('string');
		for (const [from, to] of Object.entries(replacements)) {
			const escapedFrom = escapeXml(from);
			// terra-quality-ignore single-use -- Escape each replacement before checking occurrences; inlining inside the branch would skip validation for absent text.
			const escapedTo = escapeXml(to);
			const occurrences = xml.split(escapedFrom).length - 1;
			if (occurrences) {
				xml = xml.replaceAll(escapedFrom, escapedTo);
				replacementsMade += occurrences;
			}
		}
		zip.file(entryName, xml);
	}
	if (!replacementsMade) throw new Error('No editable text matched the requested replacements in ' + path.basename(sourcePath) + '.');
	await fs.mkdir(path.dirname(destinationPath), { recursive: true });
	await fs.writeFile(destinationPath, await zip.generateAsync({ type: 'nodebuffer' }));
}

/* Finalizes a standard OOXML deck for common Office editors and sets its Design > Variants palette. */
// terra-quality-ignore single-use -- Keep finalizePresentation as a named declaration so its authored TSDoc stays attached. TSDoc: Finalizes the OOXML deck and applies its palette to the theme and compatibility metadata.
/**
 * Finalizes the OOXML deck and applies its palette to the theme and compatibility metadata.
 *
 * @param presentationPath - Path to the generated PPTX file to update.
 * @param brand - Resolved palette and color roles applied to the deck.
 *
 * @return Resolves after the presentation package has been rewritten.
 *
 * @throws If required presentation package parts are missing.
 */
async function finalizePresentation(presentationPath: string, brand: TerraDocumentBrand): Promise<void> {
	const zip = await JSZip.loadAsync(await fs.readFile(presentationPath));
	const contentTypes = zip.file('[Content_Types].xml');
	if (!contentTypes) throw new Error('The generated presentation is missing [Content_Types].xml.');
	let xml = await contentTypes.async('string');
	// terra-quality-ignore single-use -- Keep removeMissingOverride as a named declaration so its authored TSDoc stays attached. TSDoc: Keeps content-type overrides only when the package part still exists.
	/** Keeps content-type overrides only when the package part still exists.
	 *
	 * @param match Full content-type override element.
	 * @param partName Package part path declared by the override.
	 *
	 * @return The original override or an empty string when its part is absent.
	 */
	function removeMissingOverride(match: string, partName: string): string {
		return zip.file(partName.replace(/^\//, '')) ? match : '';
	}
	xml = xml.replace(/<Override\b[^>]*\bPartName="([^"]+)"[^>]*\/>/g, removeMissingOverride);
	zip.file('[Content_Types].xml', xml);
	const theme = zip.file('ppt/theme/theme1.xml');
	if (!theme) throw new Error('The generated presentation is missing its theme palette.');
	let themeXml = await theme.async('string');
	const scheme: Record<string, string> = {
		dk1: brand.colors.ink,
		lt1: brand.colors.paper,
		dk2: scaleToken(brand.scales.secondary, 11),
		lt2: scaleToken(brand.scales.secondary, 0),
		accent1: brand.colors.primary,
		accent2: brand.colors.secondary,
		accent3: brand.colors.primaryStrong,
		accent4: scaleToken(brand.scales.secondary, 10),
		accent5: scaleToken(brand.scales.primary, 6),
		accent6: scaleToken(brand.scales.secondary, 6),
		hlink: brand.colors.primary,
		folHlink: brand.colors.secondary,
	};
	for (const [name, value] of Object.entries(scheme)) {
		// terra-quality-ignore single-use -- Validate and convert the palette color before testing theme XML so error precedence stays unchanged.
		const replacement = '<a:' + name + '><a:srgbClr val="' + officeColor(value) + '"/></a:' + name + '>';
		const pattern = new RegExp('<a:' + name + '>[\\s\\S]*?<\\/a:' + name + '>');
		if (!pattern.test(themeXml)) throw new Error('The generated presentation theme is missing ' + name + '.');
		themeXml = themeXml.replace(pattern, replacement);
	}
	zip.file('ppt/theme/theme1.xml', themeXml);
	// PptxGenJS serializes the table-cell shortcut "mid" literally, but DrawingML
	// only accepts "ctr" for centered vertical alignment. Normalize legacy output
	// as well as the "middle" value emitted by new templates before Office opens it.
	for (const [entryName, entry] of Object.entries(zip.files)) {
		if (entry.dir || !entryName.endsWith('.xml')) continue;
		const xml = await entry.async('string');
		if (!/\banchor="mid"/.test(xml)) continue;
		zip.file(entryName, xml.replace(/\banchor="mid"/g, 'anchor="ctr"'));
	}
	await fs.writeFile(presentationPath, await zip.generateAsync({ type: 'nodebuffer' }));
}

/**
 * Escapes XML-sensitive characters in text content.
 *
 * @param value - Text to escape.
 *
 * @return The value with XML entities substituted for reserved characters.
 */
function escapeXml(value: string): string {
	return value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&apos;');
}
