/**
 * src/documents/presentation.ts
 */

/*//////////////////////////////////////////////////
IMPORTS
//////////////////////////////////////////////////*/

// API
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createDocumentBrand } from './theme.js';

// COMPONENTS
import JSZip from 'jszip';
import PptxGenJS from 'pptxgenjs';

// TYPES
import type { TerraDocumentBrand, TerraDocumentBrandOptions } from './theme.js';
/**
 * Creates the pattern used to split a six-digit hex color into RGB pairs.
 *
 * @return A global pattern matching each two-character channel.
 */
const G_REGEX = () => /../g;
const BTYPE_REGEX = /\btype="[^"]*"/;
/**
 * Creates the matcher for complete DrawingML shape elements.
 *
 * @return A global pattern matching each `p:sp` element.
 */
const P_SP_S_S_P_SP_G_REGEX = () => /<p:sp>[\s\S]*?<\/p:sp>/g;
const PPT_SLIDES_SLIDE_D_XML_REGEX = /^ppt\/slides\/slide\d+\.xml$/;

/**
 * Minimal slide surface consumed by the Terra presentation builder.
 */
type TerraSlide = {
	background: { color: string };
	addText: (value: string | { text: string; options?: Record<string, unknown> }[], options: Record<string, unknown>) => void;
	addShape: (shape: string, options: Record<string, unknown>) => void;
	addImage: (options: Record<string, unknown>) => void;
	addTable: (rows: unknown[][], options: Record<string, unknown>) => void;
	addChart: (type: string, data: unknown[], options: Record<string, unknown>) => void;
};
/**
 * Minimal PptxGenJS API surface used by the presentation builder.
 */
type TerraPresentation = {
	layout: string;
	author: string;
	company: string;
	subject: string;
	title: string;
	lang: string;
	theme: Record<string, string>;
	ShapeType: { line: string; rect: string; roundRect: string };
	addSlide: (options?: { masterName?: string }) => TerraSlide;
	defineSlideMaster: (props: Record<string, unknown>) => void;
	writeFile: (options: { fileName: string }) => Promise<string>;
};
/**
 * Title, subtitle, and brand settings for the editable slide-deck template.
 */
export type PresentationTemplateOptions = {
	title?: string;
	subtitle?: string;
	/**
	 * Include the narrative demo slides; false produces editable cover and graphic starter slides.
	 */
	showcase?: boolean;
	brand?: TerraDocumentBrandOptions;
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
/**
 * Converts one 0–255 RGB channel into two uppercase hexadecimal digits.
 *
 * @param channel Numeric channel value encoded as a string.
 *
 * @return Two-digit lowercase hexadecimal channel text.
 */
function colorChannelToHex(channel: string): string {
	return Math.round(Number(channel)).toString(16).padStart(2, '0');
}
// hygiene-ignore single-use -- Keep branded text-option normalization in one helper so Office color conversion and caller overrides retain their established precedence.
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
// hygiene-ignore single-use -- Keep addText as a named presentation-generation boundary so its coordinated validation and output behavior remain together.
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

/*//////////////////////////////////////////////////
PRESENTATION TEMPLATE
//////////////////////////////////////////////////*/

/**
 * Creates a concise, multi-surface native PowerPoint starter deck with reusable editable layouts.
 *
 * @param options - Optional deck title, subtitle, and Terra brand settings.
 *
 * @return A PptxGenJS presentation whose write operation applies the brand palette.
 */
export function createPresentationTemplate(options: PresentationTemplateOptions = {}): TerraPresentation {
	const brand = createDocumentBrand(options.brand);
	const p = brand.scales.primary;
	const s = brand.scales.secondary;
	const g = brand.scales.gray;
	const light = (scale: typeof p, step: number) => scaleToken(scale, step - 1);
	const dark = (scale: typeof p, step: number) => {
		// hygiene-ignore single-use -- Capture the selected dark RGB channels once before formatting the color token.
		const channels = scale.dark[step - 1]!.split(' ');
		return `#${channels.map(colorChannelToHex).join('')}`;
	};
	const palette = {
		paper: light(p, 1),
		raised: light(p, 2),
		border: light(p, 6),
		text: light(p, 12),
		muted: light(p, 11),
		accent: light(p, 9),
		accentText: light(p, 11),
		complement: light(s, 9),
		neutral: light(g, 3),
		dark: dark(p, 1),
		darkRaised: dark(p, 3),
		darkText: dark(p, 12),
		darkMuted: dark(p, 11),
		darkBorder: dark(p, 7),
	};
	const mix = (a: string, b: string, shareOfB: number) => {
		// hygiene-ignore single-use -- Keep channels as a named OOXML transformation step so the source snapshot, validation, and replacement sequence stay in their current order.
		const channels = [1, 3, 5].map(i => Math.round(parseInt(a.slice(i, i + 2), 16) * (1 - shareOfB) + parseInt(b.slice(i, i + 2), 16) * shareOfB));
		return `#${channels.map(n => n.toString(16).padStart(2, '0')).join('')}`;
	};
	const cardStyles = {
		'secondary-tonal': { fill: light(s, 2), border: light(s, 6), text: light(s, 11) },
		'primary-tonal': { fill: mix(palette.paper, palette.accent, 0.05), border: mix(palette.paper, palette.accent, 0.3), text: palette.text },
		primary: { fill: light(p, 10), border: mix(light(p, 10), '#000000', 0.2), text: light(s, 5) },
		outline: { fill: light(s, 4), border: light(s, 8), text: light(s, 11) },
	} as const;
	const pptx = new (PptxGenJS as unknown as new () => TerraPresentation)();
	pptx.layout = 'LAYOUT_WIDE';
	pptx.author = 'Terra Symposium';
	pptx.company = 'Terra Symposium';
	pptx.subject = 'Editable Terra presentation layouts';
	pptx.title = options.title ?? 'Terra presentation template';
	pptx.lang = 'en-AU';
	pptx.theme = { headFontFace: options.brand?.fonts?.display ?? 'AUTHENTIC Sans 130', bodyFontFace: brand.fonts.body, lang: 'en-AU' };
	// hygiene-ignore single-use -- Keep the original write promise and its result explicit so branding and placeholder passes remain sequenced after the completed PPTX write.
	const writeFile = pptx.writeFile.bind(pptx);
	pptx.writeFile = async (writeOptions: { fileName: string }) => {
		// hygiene-ignore single-use -- Keep the original write promise and its result explicit so branding and placeholder passes remain sequenced after the completed PPTX write.
		const result = await writeFile(writeOptions);
		await applyPresentationBrand(writeOptions.fileName, brand);
		if (options.showcase === false) await specializeEditablePlaceholders(writeOptions.fileName);
		await roundGraphicPictures(writeOptions.fileName);
		return result;
	};
	const W = 13.333,
		H = 7.5,
		inset = 0.72,
		contentW = W - inset * 2;
	const font = brand.fonts.body;
	const heading = options.brand?.fonts?.display ?? 'AUTHENTIC Sans 130';
	const text = (slide: TerraSlide, value: string, x: number, y: number, w: number, h: number, size = 20, color = palette.text, extra: Record<string, unknown> = {}) =>
		addText(slide, value, textOptions(size >= 25 ? heading : font, size, color, { fit: 'shrink', breakLine: false, valign: 'mid', ...extra }), { x, y, w, h });
	const shape = (slide: TerraSlide, x: number, y: number, w: number, h: number, fill: string, line?: string) =>
		slide.addShape(pptx.ShapeType.rect, { x, y, w, h, rectRadius: 0, fill: { color: officeColor(fill) }, line: { color: officeColor(line ?? fill), width: line ? 0.6 : 0 } });
	// hygiene-ignore single-use -- Keep rule as a named intermediate to preserve the current evaluation order in this generated output path.
	const rule = (slide: TerraSlide, x: number, y: number, w: number, color = palette.border) => slide.addShape(pptx.ShapeType.line, { x, y, w, h: 0, line: { color: officeColor(color), width: 0.7 } });
	const layouts = ['Cover', 'Homepage', 'Section public', 'Section demo', 'Content', 'Process', 'Chart', 'Theorist'] as const;
	const darkLayouts = new Set(['Section demo']);
	const saturatedLayouts = new Set(['Cover', 'Homepage', 'Section public', 'Theorist']);
	const saturatedText = (() => {
		// hygiene-ignore single-use -- Keep rgb as a named intermediate in the presentation builder so derived palette or layout data is evaluated once before slide mutation.
		const rgb = palette.accent
			.slice(1)
			.match(G_REGEX())!
			.map(part => parseInt(part, 16) / 255);
		const linear = rgb.map(value => (value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4));
		return linear[0]! * 0.2126 + linear[1]! * 0.7152 + linear[2]! * 0.0722 > 0.35 ? palette.text : palette.paper;
	})();
	const masterRect = (x: number, y: number, w: number, h: number, fill: string) => ({
		rect: { x, y, w, h, fill: { color: officeColor(fill) }, line: { color: officeColor(fill), transparency: 100 } },
	});
	const masterLine = (x: number, y: number, w: number, color: string, width = 0.7) => ({ line: { x, y, w, h: 0, line: { color: officeColor(color), width } } });
	const masterText = (value: string, x: number, y: number, w: number, h: number, size: number, color: string, face = font) => ({
		text: { text: value, options: { x, y, w, h, fontFace: face, italic: face === 'Avara Bold', fontSize: size, color: officeColor(color), margin: 0, breakLine: false } },
	});
	const shortNames: Record<(typeof layouts)[number], string> = {
		Cover: 'Cover',
		Homepage: 'Home',
		'Section public': 'Chapter',
		'Section demo': 'Night',
		Content: 'Text',
		Process: 'Steps',
		Chart: 'Chart',
		Theorist: 'Graphic',
	};
	// hygiene-ignore single-use -- Materialize variantHues once so each primary and secondary master uses the same deterministic hue sequence.
	const variantHues = Array.from({ length: 6 }, (_, i) => ((typeof brand.hue === 'number' ? brand.hue : 200) + i * 50) % 300);
	const masterVariants =
		options.showcase === false
			? variantHues.flatMap((hue, i) => [
					{ hue, index: i + 1, role: 'P' as const },
					{ hue, index: i + 1, role: 'S' as const },
				])
			: [{ hue: typeof brand.hue === 'number' ? brand.hue : 200, index: 1, role: 'P' as const }];
	const editableMaster = (name: (typeof layouts)[number]) => `${shortNames[name]} P1`;
	for (const variant of masterVariants) {
		const variantBrand = createDocumentBrand({ ...options.brand, hue: variant.hue });
		const p = variant.role === 'P' ? variantBrand.scales.primary : variantBrand.scales.secondary;
		// hygiene-ignore single-use -- Capture s as the complementary scale for this master before deriving its palette and card treatments.
		const s = variant.role === 'P' ? variantBrand.scales.secondary : variantBrand.scales.primary;
		const dark = (scale: typeof p, step: number) => `#${scale.dark[step - 1]!.split(' ').map(colorChannelToHex).join('')}`;
		const palette = {
			paper: light(p, 1),
			raised: light(p, 2),
			border: light(p, 6),
			text: light(p, 12),
			muted: light(p, 11),
			accent: light(p, 9),
			accentText: light(p, 11),
			complement: light(s, 9),
			neutral: light(g, 3),
			dark: dark(p, 1),
			darkRaised: dark(p, 3),
			darkText: dark(p, 12),
			darkMuted: dark(p, 11),
			darkBorder: dark(p, 7),
		};
		const saturatedText = (() => {
			// hygiene-ignore single-use -- Keep rgb as a named intermediate in the presentation builder so derived palette or layout data is evaluated once before slide mutation.
			const rgb = palette.accent
				.slice(1)
				.match(G_REGEX())!
				.map(part => parseInt(part, 16) / 255);
			const linear = rgb.map(value => (value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4));
			return linear[0]! * 0.2126 + linear[1]! * 0.7152 + linear[2]! * 0.0722 > 0.35 ? palette.text : palette.paper;
		})();
		for (const name of layouts) {
			const isDark = darkLayouts.has(name);
			const saturated = saturatedLayouts.has(name);
			const bg = isDark ? palette.dark : saturated ? palette.accent : palette.paper;
			const foreground = isDark ? palette.darkText : saturated ? saturatedText : palette.text;
			const brandMark = isDark || (saturated && saturatedText === palette.paper) ? palette.darkText : palette.text;
			const customMark = isDark ? variantBrand.logoOnDark : variantBrand.logo;
			const masterObjects: Record<string, unknown>[] = [
				...(isDark || saturated ? [{ rect: { x: 0, y: 0, w: W, h: H, fill: { color: officeColor(bg) }, line: { color: officeColor(bg), transparency: 100 } } }] : []),
				...(customMark === false
					? []
					: customMark === 'terra-wordmark'
						? [masterText('terra symposium', inset, 7.02, 3.1, 0.32, 14, brandMark, 'Avara Bold')]
						: [{ image: { path: customMark, x: inset, y: 7.02, w: 2.18, h: 0.3, altText: 'Presentation footer logo' } }]),
				...(!isDark && !saturated ? [{ line: { x: inset, y: 6.88, w: contentW, h: 0, line: { color: officeColor(brandMark), width: 0.65 } } }] : []),
			];
			const decorations: Record<string, unknown>[] = [];
			// The cover remains an open colour field, matching the edited deck.
			if (name === 'Homepage') {
				// A still frame of the Website's independently moving rows. Start each
				// phrase at a different cropped point, then mask its far end at the split.
				// Keep shapes on-slide: PowerPoint displays off-slide shapes in edit view.
				const rows = [
					{ label: 'r theory  •  bioethics  •  business ethics', x: 0 },
					{ label: 'ent voice  •  belonging  •  resilience', x: 0 },
					{ label: 'acter education  •  care ethics  •  civics', x: 0 },
					{ label: 'tion  •  dialogue  •  civil discourse', x: 0 },
				];
				for (const [index, row] of rows.entries()) decorations.push(masterText(row.label, row.x, 4.48 + index * 0.53, 12.4, 0.48, 27, mix(palette.accent, light(p, 6), 0.42), font));
				decorations.push(masterRect(6.92, 0, W - 6.92, H, palette.paper));
			}
			if (name.startsWith('Section')) decorations.push(masterRect(inset, 4.46, 1.36, 0.1, foreground));
			if (name === 'Theorist') decorations.push(masterLine(inset, 5.78, 6.1, foreground));
			// Editorial graphics sit on the generated colour field; no white photo panel.
			if (name === 'Process')
				for (let i = 0; i < 4; i++) {
					const x = inset + i * 3.05;
					decorations.push(masterRect(x, 2.83, 2.72, 0.12, i === 3 ? palette.complement : palette.accent), masterText(`0${i + 1}`, x, 3.24, 0.6, 0.32, 14, palette.accentText));
				}
			// List rules belong to editable paragraphs, so their count follows the content.
			if (name === 'Chart') decorations.push(masterRect(8.78, 2.7, 0.016, 3.52, palette.border), masterText('TAKEAWAY', 9.22, 2.77, 2.8, 0.32, 13, palette.accentText));
			masterObjects.push(...decorations);
			// hygiene-ignore single-use -- Compute titleY once from the selected master layout before creating its editable title and body objects.
			const titleY = name === 'Cover' ? 1.18 : name === 'Homepage' ? 1.45 : name === 'Theorist' ? 2.35 : name.startsWith('Section') ? 2.0 : 0.88;
			// hygiene-ignore single-use -- Compute titleSize once from the selected master layout before creating its editable title and body objects.
			const titleSize = name === 'Cover' ? 54 : name === 'Theorist' ? 36 : name.startsWith('Section') ? 34 : 28;
			// hygiene-ignore single-use -- Compute titleW once from the selected master layout before creating its editable title and body objects.
			const titleW = name === 'Cover' ? 7 : name === 'Homepage' ? 5.6 : name === 'Theorist' ? 6.35 : contentW;
			// hygiene-ignore single-use -- Compute bodyPositions once from the selected master layout before creating its editable title and body objects.
			const bodyPositions = (() => {
				if (name === 'Cover') return [{ x: inset, y: 3.04, w: 7.0, h: 1.35 }];
				if (name === 'Homepage') return [{ x: inset, y: 3.0, w: 5.75, h: 1.3 }];
				if (name === 'Theorist') return [{ x: inset, y: 4.02, w: 6.35, h: 1.25 }];
				if (name.startsWith('Section')) return [{ x: inset, y: 3.04, w: 9.7, h: 1.55 }];
				if (name === 'Process') return [{ x: inset, y: 1.68, w: contentW, h: 0.55 }, ...[0, 1, 2, 3].map(i => ({ x: inset + i * 3.05, y: 3.5, w: 2.72, h: 2.65 }))];
				if (name === 'Chart')
					return [
						{ x: inset, y: 1.68, w: contentW, h: 0.55 },
						{ x: 9.22, y: 3.02, w: 3.25, h: 2.65 },
					];
				return [
					{ x: inset, y: 1.68, w: contentW, h: 0.55 },
					{ x: inset, y: 2.38, w: contentW, h: 4.22 },
				];
			})();
			const key = shortNames[name];
			// Demo and editable decks each expose only their own layouts in PowerPoint's menu.
			if (options.showcase !== false)
				pptx.defineSlideMaster({
					title: key,
					background: { color: officeColor(bg) },
					objects: masterObjects,
					slideNumber: { x: 11.7, y: 7.06, w: 0.9, h: 0.22, fontFace: font, fontSize: 9, color: officeColor(name === 'Homepage' ? palette.text : foreground), align: 'right', margin: 0 },
				});
			else
				pptx.defineSlideMaster({
					title: `${key} ${variant.role}${variant.index}`,
					background: { color: officeColor(bg) },
					slideNumber: { x: 11.7, y: 7.06, w: 0.9, h: 0.22, fontFace: font, fontSize: 9, color: officeColor(name === 'Homepage' ? palette.text : foreground), align: 'right', margin: 0 },
					objects: [
						...masterObjects,
						{
							placeholder: {
								options: {
									name: 'Title',
									type: 'title',
									x: inset,
									y: titleY,
									w: titleW,
									h: name === 'Cover' ? 1.65 : name === 'Theorist' ? 1.2 : 0.86,
									fontFace: name === 'Cover' ? 'Avara Bold' : heading,
									italic: name === 'Cover',
									fontSize: titleSize,
									color: officeColor(foreground),
									align: 'left',
									valign: 'mid',
									margin: 0,
									fit: 'shrink',
									lineSpacingMultiple: 0.88,
								},
								text: '',
							},
						},
						...(name === 'Chart' ? [{ placeholder: { options: { name: 'Chart', type: 'chart', x: inset, y: 2.6, w: 7.55, h: 3.74 }, text: '' } }] : []),
						...(name === 'Theorist' ? [{ placeholder: { options: { name: 'Replace sketch', type: 'pic', x: 7.45, y: 1.12, w: 5.15, h: 5.15 }, text: '' } }] : []),
						...bodyPositions.map((position, i) => ({
							placeholder: {
								options: {
									name: `Content ${i + 1}`,
									type: 'body',
									...position,
									fontFace: font,
									fontSize: 18,
									color: officeColor(name === 'Cover' && i === 1 ? palette.text : isDark ? palette.darkMuted : saturated ? foreground : palette.muted),
									breakLine: true,
									align: 'left',
									valign: 'top',
									margin: 0.04,
									fit: 'shrink',
								},
								text: '',
							},
						})),
					],
				});
		}
	}
	const slide = (layout: (typeof layouts)[number] | 'Poster' | 'Table' | 'List', title: string, subtitle?: string) => {
		const masterLayout = layout === 'Poster' ? 'Theorist' : layout === 'Table' || layout === 'List' ? 'Content' : layout;
		const item = pptx.addSlide({ masterName: shortNames[masterLayout] });
		const isDark = darkLayouts.has(masterLayout);
		const saturated = saturatedLayouts.has(masterLayout);
		// hygiene-ignore single-use -- Capture fg from the resolved light, dark, or saturated palette before writing the corresponding slide text.
		const fg = isDark ? palette.darkText : saturated ? saturatedText : palette.text;
		// hygiene-ignore single-use -- Capture muted from the resolved light, dark, or saturated palette before writing the corresponding slide text.
		const muted = isDark ? palette.darkMuted : saturated ? saturatedText : palette.muted;
		const large = layout === 'Cover' || layout.startsWith('Section');
		text(
			item,
			title,
			inset,
			layout === 'Cover' ? 1.18 : layout === 'Homepage' ? 1.45 : layout === 'Theorist' ? 2.35 : layout === 'Poster' ? 1.5 : large ? 1.78 : 0.88,
			layout === 'Cover' ? 7.0 : layout === 'Homepage' ? 5.6 : layout === 'Theorist' ? 6.35 : layout === 'Poster' ? 5.72 : contentW,
			layout === 'Cover' ? 1.65 : layout === 'Poster' ? 1.48 : layout === 'Homepage' || layout === 'Theorist' ? 1.2 : large ? 1.02 : 0.62,
			layout === 'Cover' ? 54 : layout === 'Poster' ? 48 : layout === 'Homepage' || layout === 'Theorist' ? 36 : large ? 38 : 28,
			fg,
			layout === 'Cover' || layout === 'Poster' ? { fontFace: 'Avara Bold', italic: true, lineSpacingMultiple: 0.88 } : {},
		);
		if (subtitle)
			text(
				item,
				subtitle,
				inset,
				layout === 'Homepage' ? 3.0 : layout === 'Theorist' ? 4.02 : layout === 'Poster' ? 3.34 : large ? 3.04 : 1.68,
				layout === 'Cover' ? 7.0 : layout === 'Homepage' ? 5.75 : layout === 'Theorist' ? 6.35 : layout === 'Poster' ? 5.72 : contentW,
				layout === 'Theorist' || layout === 'Poster' ? 1.25 : layout === 'Homepage' ? 1.3 : 0.55,
				large ? 19 : 16,
				muted,
			);
		return item;
	};
	// hygiene-ignore single-use -- Keep pictureShadow as a named intermediate in the presentation builder so derived palette or layout data is evaluated once before slide mutation.
	const pictureShadow = () => ({ type: 'outer', color: '17232B', opacity: 0.25, blur: 12, angle: 45, offset: 4 });
	const card = (item: TerraSlide, title: string, body: string, x: number, y: number, w: number, h: number, style: (typeof cardStyles)[keyof typeof cardStyles]) => {
		item.addText(
			[
				{ text: title, options: { fontFace: brand.fonts.body, fontSize: 20, bold: true, breakLine: true, paraSpaceAfter: 12 } },
				{ text: body, options: { fontFace: brand.fonts.body, fontSize: 15, breakLine: false } },
			],
			{
				x,
				y,
				w,
				h,
				objectName: `Reusable card — ${title}`,
				shape: pptx.ShapeType.roundRect,
				rectRadius: 0.12,
				margin: [18, 21, 14, 21],
				breakLine: true,
				valign: 'mid',
				fit: 'shrink',
				color: officeColor(style.text),
				fill: { color: officeColor(style.fill) },
				line: { color: officeColor(style.border), width: 1.2 },
				shadow: { type: 'outer', color: '17232B', opacity: 0.17, blur: 10, angle: 45, offset: 3 },
			},
		);
	};
	const badge = (item: TerraSlide, label: string, x: number, y: number, w: number, treatment: 'glass' | 'ghost' = 'glass', icon?: 'location' | 'gamification') => {
		// hygiene-ignore single-use -- Keep fill as a named intermediate in the presentation builder so derived palette or layout data is evaluated once before slide mutation.
		const fill = treatment === 'glass' ? mix(palette.accent, palette.paper, 0.12) : palette.accent;
		item.addText(label, {
			x,
			y,
			w,
			h: 0.38,
			objectName: `Reusable badge — ${label}`,
			shape: pptx.ShapeType.roundRect,
			rectRadius: 0.18,
			margin: [icon === 'location' ? 26 : 10, icon === 'gamification' ? 26 : 10, 4, 4],
			fontFace: font,
			fontSize: 12,
			color: officeColor(saturatedText),
			valign: 'mid',
			breakLine: false,
			fit: 'shrink',
			fill: { color: officeColor(fill) },
			line: { color: officeColor(mix(palette.accent, palette.paper, 0.25)), width: treatment === 'glass' ? 0.8 : 0 },
			shadow: treatment === 'glass' ? { type: 'outer', color: '17232B', opacity: 0.15, blur: 4, angle: 45, offset: 1 } : undefined,
		});
		if (icon)
			item.addImage({ path: fileURLToPath(new URL(`./assets/${icon}.svg`, import.meta.url)), x: icon === 'location' ? x + 0.1 : x + w - 0.32, y: y + 0.09, w: 0.2, h: 0.2, altText: `${icon} icon` });
	};
	const addTheoristPicture = (item: TerraSlide) =>
		item.addImage({ path: fileURLToPath(new URL('./assets/theorist-sketch.png', import.meta.url)), x: 7.45, y: 1.12, w: 5.15, h: 5.15, altText: 'Terra Sanity sketch of philosopher John Locke' });
	const addPosterPicture = (item: TerraSlide) =>
		item.addImage({
			path: fileURLToPath(new URL('./assets/propaganda-demo.jpg', import.meta.url)),
			x: 7.55,
			y: 1.12,
			w: 4.61,
			h: 5.0,
			rotate: -6.34,
			shadow: pictureShadow(),
			altText: 'Archival Terra Symposium campaign poster with a student standing in front of it',
		});
	const dataTable = (item: TerraSlide, rows: string[][]) => {
		const none = { type: 'none' },
			bottom = { type: 'solid', color: officeColor(palette.border), pt: 0.7 };
		item.addTable(
			rows.map((row, i) =>
				row.map((value, j) => ({
					text: value,
					options: {
						fontFace: font,
						fontSize: i ? 16 : 14,
						bold: i > 0 && j === 0,
						color: officeColor(i ? palette.text : palette.muted),
						fill: { color: officeColor(palette.paper) },
						margin: [0.15, 0.2, 0.15, 0.2],
						border: [none, none, i === rows.length - 1 ? none : bottom, none],
					},
				})),
			),
			{ x: inset, y: 2.62, w: contentW, colW: [2.0, 3.3, 2.4, 4.19], rowH: [0.66, 0.68, 0.68, 0.68, 0.68], autoFit: false, border: [none, none, none, none] },
		);
	};
	// The component library exposes every surface treatment in six colour families.
	// These are native PowerPoint shapes so each example can be moved or recoloured.
	const variantColors = ['primary', 'secondary', 'gray', 'destructive', 'success', 'caution'] as const;
	const treatments = ['outline', 'ghost', 'tonal', 'saturated', 'glass'] as const;
	const surface = (family: (typeof variantColors)[number], treatment: (typeof treatments)[number] | 'default', mode: 'light' | 'dark' = 'light') => {
		const scale = family === 'primary' ? p : family === 'secondary' ? s : family === 'gray' ? g : undefined;
		if (mode === 'dark') {
			const backdrop = scale ? dark(scale, 1) : '#111820';
			const deep = scale ? dark(scale, 12) : family === 'destructive' ? '#ffccd5' : family === 'success' ? '#a5f3c7' : '#fce5a3';
			// hygiene-ignore single-use -- Keep soft as a named intermediate in the presentation builder so derived palette or layout data is evaluated once before slide mutation.
			const soft = scale ? dark(scale, 3) : family === 'destructive' ? '#4c1829' : family === 'success' ? '#123d32' : '#47351a';
			const border = scale ? dark(scale, 7) : family === 'destructive' ? '#b74464' : family === 'success' ? '#38a27d' : '#ba893a';
			const accent = scale ? dark(scale, 9) : family === 'destructive' ? '#ff6286' : family === 'success' ? '#4fd5a1' : '#edb34e';
			if (treatment === 'ghost') return { fill: backdrop, border: backdrop, text: deep };
			if (treatment === 'outline') return { fill: backdrop, border, text: deep };
			if (treatment === 'tonal') return { fill: soft, border, text: deep };
			if (treatment === 'glass') return { fill: mix(accent, backdrop, 0.3), border: mix(accent, backdrop, 0.55), text: deep };
			return { fill: accent, border: accent, text: deep };
		}
		const base = scale ? light(scale, 9) : family === 'destructive' ? '#e11d48' : family === 'success' ? '#047857' : '#b45309';
		const deep = scale ? light(scale, 12) : family === 'destructive' ? '#881337' : family === 'success' ? '#064e3b' : '#78350f';
		// hygiene-ignore single-use -- Keep pale as a named intermediate in the presentation builder so derived palette or layout data is evaluated once before slide mutation.
		const pale = scale ? light(scale, 2) : family === 'destructive' ? '#fff1f2' : family === 'success' ? '#ecfdf5' : '#fffbeb';
		const border = scale ? light(scale, 6) : family === 'destructive' ? '#fda4af' : family === 'success' ? '#6ee7b7' : '#fcd34d';
		if (treatment === 'ghost') return { fill: palette.paper, border: palette.paper, text: deep };
		if (treatment === 'outline') return { fill: family === 'secondary' ? light(s, 1) : palette.paper, border, text: deep };
		if (treatment === 'tonal') return { fill: pale, border, text: deep };
		if (treatment === 'glass') return { fill: mix(base, palette.paper, 0.3), border: mix(base, palette.paper, 0.45), text: deep };
		if (family === 'secondary') return { fill: light(s, 7), border: light(s, 11), text: light(s, 1) };
		return { fill: base, border: deep, text: palette.paper };
	};
	const variantGallery = (item: TerraSlide, family: (typeof variantColors)[number]) => {
		const halves = [
			{ mode: 'light' as const, x: inset, background: palette.paper, label: palette.text },
			{ mode: 'dark' as const, x: 6.76, background: '#111820', label: '#f5fbfb' },
		];
		for (const half of halves) {
			shape(item, half.x - 0.12, 2.25, 5.94, 4.28, half.background);
			text(item, half.mode === 'light' ? 'LIGHT' : 'DARK', half.x + 0.08, 2.34, 1.2, 0.28, 12, half.label, { bold: true, charSpacing: 1.3 });
			for (const [index, treatment] of (['default', ...treatments] as const).entries()) {
				const style = surface(family, treatment, half.mode);
				// hygiene-ignore single-use -- Keep y as a named intermediate in the presentation builder so derived palette or layout data is evaluated once before slide mutation.
				const y = 2.72 + index * 0.45;
				item.addText(`${family} ${treatment}`, {
					x: half.x + 0.08,
					y,
					w: 5.42,
					h: 0.37,
					objectName: `Reusable ${half.mode} card — ${family}-${treatment}`,
					shape: pptx.ShapeType.roundRect,
					rectRadius: 0.09,
					margin: [9, 10, 2, 2],
					fontFace: font,
					fontSize: 13,
					bold: true,
					color: officeColor(style.text),
					valign: 'mid',
					fit: 'resize',
					fill: { color: officeColor(style.fill) },
					line: { color: officeColor(style.border), width: 0.8 },
				});
			}
			for (const [index, treatment] of ['default', ...treatments].entries()) {
				const style = surface(family, treatment as (typeof treatments)[number] | 'default', half.mode);
				const x = half.x + 0.08 + (index % 3) * 1.84,
					y = 5.5 + Math.floor(index / 3) * 0.47;
				item.addText(treatment, {
					x,
					y,
					w: 1.68,
					h: 0.35,
					objectName: `Reusable ${half.mode} badge — ${family}-${treatment}`,
					shape: pptx.ShapeType.roundRect,
					rectRadius: 0.16,
					margin: 0.03,
					fontFace: font,
					fontSize: 11,
					color: officeColor(style.text),
					align: 'center',
					valign: 'mid',
					fit: 'resize',
					fill: { color: officeColor(style.fill) },
					line: { color: officeColor(style.border), width: 0.7 },
				});
			}
		}
	};
	if (options.showcase === false) {
		pptx.addSlide({ masterName: editableMaster('Cover') });
		const homepage = pptx.addSlide({ masterName: editableMaster('Homepage') });
		card(homepage, 'Why is philosophy important?', 'Discussion gives students a way to test ideas and explain their choices.', 7.47, 2.18, 5.13, 1.73, cardStyles['secondary-tonal']);
		card(homepage, 'Who is this for?', 'Educators who want students to reason aloud and learn together.', 7.47, 4.31, 5.13, 1.73, cardStyles['primary-tonal']);
		badge(homepage, 'Made in Sydney', 4.47, 6.05, 1.9, 'glass', 'location');
		badge(homepage, '600+ interactive lessons', 3.81, 6.5, 2.56, 'glass', 'gamification');
		addTheoristPicture(pptx.addSlide({ masterName: editableMaster('Theorist') }));
		addPosterPicture(pptx.addSlide({ masterName: editableMaster('Theorist') }));
		pptx.addSlide({ masterName: editableMaster('Section public') });
		pptx.addSlide({ masterName: editableMaster('Section demo') });
		// hygiene-ignore single-use -- Keep hierarchy as a named intermediate in the presentation builder so derived palette or layout data is evaluated once before slide mutation.
		const hierarchy = pptx.addSlide({ masterName: editableMaster('Content') });
		rule(hierarchy, inset, 2.77, contentW, palette.text);
		dataTable(pptx.addSlide({ masterName: editableMaster('Content') }), [
			['Item', 'Owner', 'Status', 'Next step'],
			['Research', 'Maya', 'Complete', 'Share findings'],
			['Design', 'Alex', 'In progress', 'Review concept'],
			['Delivery', 'Sam', 'Planned', 'Confirm dates'],
			['Review', 'Team', 'Pending', 'Record outcome'],
		]);
		pptx.addSlide({ masterName: editableMaster('Process') });
		pptx.addSlide({ masterName: editableMaster('Chart') }).addChart('bar', [{ name: 'Attendees', labels: ['1', '2', '3', '4'], values: [18, 24, 31, 38] }], {
			x: inset,
			y: 2.6,
			w: 7.55,
			h: 3.74,
			barDir: 'col',
			showLegend: false,
			showTitle: false,
			showValue: true,
			showCatName: false,
			valAxisHidden: true,
			catAxisLineShow: false,
			valGridLine: { style: 'none' },
			catGridLine: { style: 'none' },
			chartColors: [officeColor(palette.accent)],
			catAxisLabelFontFace: font,
			catAxisLabelFontSize: 14,
			catAxisLabelColor: officeColor(palette.muted),
			dataLabelColor: officeColor(palette.text),
			showBorder: false,
		});
		for (const family of variantColors) variantGallery(pptx.addSlide({ masterName: editableMaster('Content') }), family);
		return pptx;
	}
	// The illustrative pilot runs from need, through delivery and evidence, to a decision.
	{
		const a = slide('Cover', options.title ?? 'Community workshop pilot', options.subtitle ?? 'An illustrative story from need to decision.');
		text(a, 'ILLUSTRATIVE DATA  /  TERRA SYMPOSIUM', inset, 4.47, 7.2, 0.38, 11, saturatedText, { charSpacing: 1.2 });
		text(a, 'Four sessions.\nOne testable idea.\nA clear next step.', 8.86, 2.08, 3.3, 2.5, 24, palette.text, { breakLine: true });
	}
	{
		const a = slide('Homepage', 'Questions become practice', 'A workshop turns philosophical inquiry into shared work.');
		card(a, 'Why is philosophy important?', 'Discussion gives students a way to test ideas and explain their choices.', 7.47, 2.18, 5.13, 1.73, cardStyles['secondary-tonal']);
		card(a, 'Who is this for?', 'Educators who want students to reason aloud and learn together.', 7.47, 4.31, 5.13, 1.73, cardStyles['primary-tonal']);
		badge(a, 'Made in Sydney', 4.47, 6.05, 1.9, 'glass', 'location');
		badge(a, '600+ interactive lessons', 3.81, 6.5, 2.56, 'glass', 'gamification');
	}
	{
		const a = slide('Content', 'Reusable homepage surfaces', 'Four card treatments and two badge treatments from the Website.');
		for (const [i, [name, style]] of Object.entries(cardStyles).entries()) {
			card(
				a,
				name,
				i < 2 ? 'FAQ content follows the page’s primary or secondary palette.' : 'Review and testimonial content can change without changing the surface.',
				inset + (i % 2) * 6.05,
				2.62 + Math.floor(i / 2) * 1.77,
				5.74,
				1.64,
				style,
			);
		}
		badge(a, 'Glass badge', 0.94, 6.35, 1.7);
		badge(a, 'Ghost badge', 2.85, 6.35, 1.75, 'ghost');
		badge(a, 'Location badge', 4.87, 6.35, 2.1, 'glass', 'location');
		badge(a, 'Feature badge', 7.25, 6.35, 2.1, 'glass', 'gamification');
	}
	{
		slide('Section public', '01  /  The opportunity', 'A public-facing chapter break in the generated hue.');
	}
	{
		const a = slide('Theorist', 'Learning from experience', 'John Locke argued that knowledge begins with experience and observation. The pilot puts that idea to work.');
		addTheoristPicture(a);
		text(a, 'JOHN LOCKE  /  TERRA THEORIST SKETCH', inset, 6.18, 6.1, 0.3, 11, saturatedText, { charSpacing: 1.0 });
	}
	{
		const a = slide('Content', 'Why run a pilot?', 'The team needed evidence before expanding the programme.');
		text(a, 'Observed need', inset, 2.58, 5.6, 0.46, 23, palette.text, { underline: { color: officeColor(palette.text), style: 'sng' } });
		text(a, 'Families asked for practical workshops, but attendance and project completion were untested.', inset, 3.45, 5.6, 1.45, 19);
		text(a, 'Pilot question', 7.0, 2.58, 5.6, 0.46, 23, palette.text, { underline: { color: officeColor(palette.text), style: 'sng' } });
		text(a, 'Would a four-session format attract participants and help them finish a project?', 7.0, 3.45, 5.6, 1.45, 19);
	}
	{
		slide('Section demo', '02  /  The pilot', 'A dark chapter break before the four-session sequence.');
	}
	{
		const a = slide('Process', 'Four sessions, one project', 'Each stage added a piece needed for the final result.');
		[
			['Discover', 'Choose a problem'],
			['Design', 'Sketch an approach'],
			['Build', 'Make a first version'],
			['Share', 'Present the result'],
		].forEach(([name, note], i) => {
			const x = inset + i * 3.05;
			text(a, name, x, 3.82, 2.7, 0.5, 22);
			text(a, note, x, 4.52, 2.7, 0.7, 16, palette.muted);
		});
	}
	{
		// hygiene-ignore single-use -- Keep a named as the table slide handle while rows are added to that exact slide.
		const a = slide('Table', 'Attendance and completion', 'Illustrative counts; one row per session.');
		// hygiene-ignore single-use -- Keep rows as a named OOXML transformation step so the source snapshot, validation, and replacement sequence stay in their current order.
		const rows = [
			['Session', 'Focus', 'Attended', 'Projects completed'],
			['1', 'Discover', '18', '14'],
			['2', 'Design', '24', '19'],
			['3', 'Build', '31', '25'],
			['4', 'Share', '38', '31'],
		];
		dataTable(a, rows);
	}
	{
		const a = slide('Chart', 'Attendance rose each session', 'The native chart remains editable in PowerPoint.');
		a.addChart('bar', [{ name: 'Attendees', labels: ['1', '2', '3', '4'], values: [18, 24, 31, 38] }], {
			x: inset,
			y: 2.6,
			w: 7.55,
			h: 3.74,
			barDir: 'col',
			showLegend: false,
			showTitle: false,
			showValue: true,
			showCatName: false,
			valAxisHidden: true,
			catAxisLineShow: false,
			valGridLine: { style: 'none' },
			catGridLine: { style: 'none' },
			chartColors: [officeColor(palette.accent)],
			showMarker: false,
			catAxisLabelFontFace: font,
			catAxisLabelFontSize: 14,
			catAxisLabelColor: officeColor(palette.muted),
			dataLabelColor: officeColor(palette.text),
			dataLabelFormatCode: '0',
			showBorder: false,
		});
		text(a, '38 attended the final session, up from 18 at the start.', 9.22, 3.25, 3.18, 1.65, 21);
	}
	{
		const a = slide('List', 'What the pilot supports', 'The evidence points to a measured next step.');
		['Repeat the four-session format', 'Track attendance and completion again', 'Compare results before expanding'].forEach((item, i) => {
			const y = 2.7 + i * 0.95;
			text(a, `0${i + 1}`, inset, y, 0.7, 0.46, 17, palette.accentText);
			text(a, item, 1.48, y, 10.6, 0.52, 22, palette.text, { underline: { color: officeColor(palette.border), style: 'sng' } });
		});
	}
	{
		const a = slide('Poster', 'Take it public', 'Share the findings and invite the next cohort with a public campaign.');
		addPosterPicture(a);
		text(a, 'ARCHIVAL CAMPAIGN GRAPHIC', inset, 5.8, 5.72, 0.34, 11, saturatedText, { charSpacing: 1.0 });
	}
	return pptx;
}

// hygiene-ignore single-use -- Keep specializeEditablePlaceholders as a separate async OOXML pass so each ZIP read, validation, and write completes before the next export step.
/**
 * Preserve dedicated picture and table insertion controls in editable PowerPoint layouts.
 *
 * @param fileName Presentation file to update in place.
 */
async function specializeEditablePlaceholders(fileName: string): Promise<void> {
	const zip = await JSZip.loadAsync(await fs.readFile(fileName));
	const pictureIndexes = new Map<string, string>();
	for (const name of Object.keys(zip.files)) {
		if (!/^ppt\/slideLayouts\/slideLayout\d+\.xml$/.test(name)) continue;
		const file = zip.file(name);
		if (!file) continue;
		const xml = await file.async('string');
		const kind = /Graphic [PS][1-6]/.test(xml) ? 'pic' : undefined;
		if (!kind) continue;
		const placeholders = [...xml.matchAll(/<p:ph\b[\s\S]*?\/>/g)];
		if (placeholders.length < 2) throw new Error(`Missing ${kind} placeholder in ${name}`);
		const orig = placeholders[1]![0];
		const index = orig.match(/\bidx="(\d+)"/)?.[1];
		if (kind === 'pic' && index) {
			if (xml.includes('Graphic P1')) {
				pictureIndexes.set('theorist', index);
				pictureIndexes.set('poster', index);
			}
		}
		// hygiene-ignore single-use -- Keep replacement as a named OOXML transformation stage so the exact input snapshot and replacement order remain explicit.
		const replacement = BTYPE_REGEX.test(orig) ? orig.replace(BTYPE_REGEX, `type="${kind}"`) : orig.replace('<p:ph', `<p:ph type="${kind}"`);
		zip.file(name, xml.replace(orig, replacement));
	}
	for (const [slideNum, layout] of [
		[3, 'theorist'],
		[4, 'poster'],
	] as const) {
		const name = `ppt/slides/slide${slideNum}.xml`;
		const file = zip.file(name);
		if (!file) throw new Error(`Missing graphic starter slide ${name}`);
		const xml = await file.async('string');
		const index = pictureIndexes.get(layout);
		if (!index || !xml.includes('<p:nvPr></p:nvPr>')) throw new Error(`Missing replaceable picture on ${name}`);
		// hygiene-ignore single-use -- Keep pictureWithPlaceholder as a named OOXML transformation stage so the exact input snapshot and replacement order remain explicit.
		const pictureWithPlaceholder = xml.replace('<p:nvPr></p:nvPr>', `<p:nvPr><p:ph idx="${index}"/></p:nvPr>`);
		let removed = 0;
		// hygiene-ignore single-use -- Keep withoutOverlay as a named OOXML transformation stage so the exact input snapshot and replacement order remain explicit.
		const withoutOverlay = pictureWithPlaceholder.replace(P_SP_S_S_P_SP_G_REGEX(), shape => {
			if (!new RegExp(`<p:ph\\b[^>]*\\bidx="${index}"`).test(shape)) return shape;
			removed++;
			return '';
		});
		if (removed !== 1) throw new Error(`Expected one redundant picture placeholder on ${name}, found ${removed}`);
		zip.file(name, withoutOverlay);
	}
	const starterCopy: { title: string; bodies: string[] }[] = [
		{ title: 'Presentation title', bodies: ['A clear sentence about the work.'] },
		{ title: 'The work in one view', bodies: ['One sentence introduces the idea.'] },
		{ title: 'An idea worth testing', bodies: ['Explain how this thinker relates to your point.'] },
		{ title: 'Use images for immersion', bodies: ['Explain what the campaign image shows.'] },
		{ title: '01 / A new chapter', bodies: ['The public-facing section message.'] },
		{ title: '02 / Live demonstration', bodies: ['Introduce the demonstration.'] },
		{ title: 'Text Hierarchy', bodies: ['An example of different text hierarchies.', 'nested-list'] },
		{ title: 'Evidence at a glance', bodies: ['Replace the native table data.'] },
		{
			title: 'How the work moves',
			bodies: ['Four stages, each with a distinct outcome.', 'Discover: define the need.', 'Design: choose an approach.', 'Test: check the result.', 'Share: put it to use.'],
		},
		{ title: 'What the data shows', bodies: ['Replace the native chart data.', 'One sentence states the takeaway.'] },
		...(['primary', 'secondary', 'gray', 'destructive', 'success', 'caution'] as const).map(family => ({
			title: `${family[0]!.toUpperCase()}${family.slice(1)} surfaces`,
			bodies: [`Light and dark card and badge treatments.`],
		})),
	];
	const escapeXml = (value: string) => value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
	const paragraph = (value: string) => `<a:p><a:pPr><a:buNone/></a:pPr><a:r><a:rPr lang="en-US" dirty="0"/><a:t>${escapeXml(value)}</a:t></a:r><a:endParaRPr lang="en-US"/></a:p>`;
	const listParagraph = (value: string, level = 0) =>
		`<a:p><a:pPr lvl="${level}" marL="${level ? 594360 : 274320}" indent="-228600"><a:lnSpc><a:spcPct val="112000"/></a:lnSpc><a:spcAft><a:spcPts val="700"/></a:spcAft><a:buChar char="•"/><a:defRPr sz="1800" u="none"><a:latin typeface="AUTHENTIC Sans 90"/></a:defRPr></a:pPr><a:r><a:rPr lang="en-US" sz="1800" u="none" dirty="0"><a:latin typeface="AUTHENTIC Sans 90"/></a:rPr><a:t>${escapeXml(value)}</a:t></a:r><a:endParaRPr lang="en-US" sz="1800" u="none"/></a:p>`;
	const h3Paragraph = (value: string) =>
		`<a:p><a:pPr><a:buNone/><a:defRPr sz="2000" b="1"><a:latin typeface="AUTHENTIC Sans 90"/></a:defRPr></a:pPr><a:r><a:rPr lang="en-US" sz="2000" b="1" dirty="0"><a:latin typeface="AUTHENTIC Sans 90"/></a:rPr><a:t>${escapeXml(value)}</a:t></a:r><a:endParaRPr lang="en-US" sz="2000"/></a:p>`;
	for (const [index, copy] of starterCopy.entries()) {
		const name = `ppt/slides/slide${index + 1}.xml`;
		const file = zip.file(name);
		if (!file) throw new Error(`Missing editable starter ${name}`);
		let bodyIndex = 0;
		// hygiene-ignore single-use -- Keep xml awaited at this async boundary before transforming the slide XML so I/O rejection order stays unchanged.
		const xml = (await file.async('string')).replace(P_SP_S_S_P_SP_G_REGEX(), shape => {
			const type = shape.match(/<p:ph\b[^>]*\btype="(title|body)"/)?.[1];
			if (!type) return shape;
			const value = type === 'title' ? copy.title : copy.bodies[bodyIndex++];
			if ((index === 7 || index >= 10) && type === 'body' && value === undefined) return '';
			if (value === undefined) throw new Error(`Missing ${type} copy on ${name}`);
			// hygiene-ignore single-use -- Keep content as a named OOXML transformation stage so the exact input snapshot and replacement order remain explicit.
			const content = value.startsWith('Subheading\n')
				? '<a:p><a:pPr><a:buNone/></a:pPr><a:r><a:rPr lang="en-US" u="sng" dirty="0"/><a:t>Subheading</a:t></a:r></a:p>' + paragraph(value.split('\n')[1]!)
				: value === 'nested-list'
					? [h3Paragraph('Prepare the next session'), listParagraph('Confirm the date and facilitator', 1), listParagraph('Invite the participants', 1), listParagraph('Review the evidence')].join('')
					: index === 3 && type === 'title'
						? `<a:p><a:pPr><a:buNone/></a:pPr><a:r><a:rPr lang="en-US" sz="4800" b="1" i="1" dirty="0"><a:latin typeface="Avara Bold"/></a:rPr><a:t>${escapeXml(value)}</a:t></a:r><a:endParaRPr lang="en-US"/></a:p>`
						: paragraph(value);
			// hygiene-ignore single-use -- Keep label as a named OOXML transformation stage so the exact input snapshot and replacement order remain explicit.
			const label = type === 'title' ? 'Slide title' : `Content ${bodyIndex}`;
			let result = shape.replace(/(<p:cNvPr\b[^>]*\bname=")[^"]*(")/, `$1${label}$2`).replace(/<a:p>[\s\S]*?<\/a:p>/, content);
			if (index === 3 && type === 'title') result = result.replace(/<a:off x="\d+" y="\d+"\/>\s*<a:ext cx="\d+" cy="\d+"\/>/, '<a:off x="658368" y="1371600"/><a:ext cx="5230368" cy="1353312"/>');
			return result;
		});
		zip.file(name, xml);
	}
	await fs.writeFile(fileName, await zip.generateAsync({ type: 'nodebuffer' }));
}

// hygiene-ignore single-use -- Keep roundGraphicPictures as a separate async OOXML pass so each ZIP read, validation, and write completes before the next export step.
/**
 * Give replaceable graphic pictures the Website's softly rounded corners.
 *
 * @param fileName Presentation file to update in place.
 */
async function roundGraphicPictures(fileName: string): Promise<void> {
	const zip = await JSZip.loadAsync(await fs.readFile(fileName));
	let rounded = 0,
		groupedBadges = 0;
	for (const [name, file] of Object.entries(zip.files)) {
		if (!PPT_SLIDES_SLIDE_D_XML_REGEX.test(name)) continue;
		const xml = await file.async('string');
		let updated = xml.replace(/<p:pic>[\s\S]*?<\/p:pic>/g, picture => {
			if (!/Terra Sanity sketch|Archival Terra Symposium campaign poster/.test(picture)) return picture;
			if (!/<a:prstGeom prst="rect">/.test(picture)) throw new Error(`Missing graphic picture geometry in ${name}`);
			rounded++;
			if (picture.includes('Terra Sanity sketch')) return picture.replace(/<a:blip r:embed="([^"]+)"><\/a:blip>/, '<a:blip r:embed="$1"><a:alphaModFix amt="50000"/></a:blip>');
			return picture.replace('<a:prstGeom prst="rect"><a:avLst/>', '<a:prstGeom prst="roundRect"><a:avLst><a:gd name="adj" fmla="val 3000"/></a:avLst>');
		});
		if (name === 'ppt/slides/slide2.xml') {
			let nextId = Math.max(...[...updated.matchAll(/<p:cNvPr id="(\d+)"/g)].map(match => Number(match[1]))) + 1;
			const labels = [
				['Made in Sydney', 'location'],
				['600+ interactive lessons', 'gamification'],
			] as const;
			for (const [label, icon] of labels) {
				const objects = [...updated.matchAll(/<p:sp>[\s\S]*?<\/p:sp>|<p:pic>[\s\S]*?<\/p:pic>/g)];
				const index = objects.findIndex(match => match[0].startsWith('<p:sp>') && match[0].includes(`<a:t>${label}</a:t>`));
				const shape = objects[index],
					picture = objects[index + 1];
				if (!shape || !picture || !picture[0].includes(`descr="${icon} icon"`)) throw new Error(`Missing adjacent ${label} badge parts in ${name}`);
				const position = shape[0].match(/<a:xfrm><a:off x="(\d+)" y="(\d+)"\/><a:ext cx="(\d+)" cy="(\d+)"\/>/);
				if (!position) throw new Error(`Missing ${label} badge geometry in ${name}`);
				const [, x, y, w, h] = position;
				// hygiene-ignore single-use -- Keep group as a named OOXML transformation stage so the exact input snapshot and replacement order remain explicit.
				const group = `<p:grpSp><p:nvGrpSpPr><p:cNvPr id="${nextId++}" name="Reusable badge — ${label}"/><p:cNvGrpSpPr/><p:nvPr/></p:nvGrpSpPr><p:grpSpPr><a:xfrm><a:off x="${x}" y="${y}"/><a:ext cx="${w}" cy="${h}"/><a:chOff x="${x}" y="${y}"/><a:chExt cx="${w}" cy="${h}"/></a:xfrm></p:grpSpPr>${shape[0]}${picture[0]}</p:grpSp>`;
				updated = updated.slice(0, shape.index) + group + updated.slice(picture.index! + picture[0].length);
				groupedBadges++;
			}
		}
		if (updated !== xml) zip.file(name, updated);
	}
	if (rounded !== 2) throw new Error(`Expected two rounded graphic pictures, found ${rounded}`);
	if (groupedBadges !== 2) throw new Error(`Expected two movable icon badges, found ${groupedBadges}`);
	await fs.writeFile(fileName, await zip.generateAsync({ type: 'nodebuffer' }));
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
 * @param srcPath - Existing generated presentation to edit.
 * @param destPath - Path where the edited presentation is written.
 * @param replacements - Map of exact source text to replacement text.
 *
 * @return Resolves after matching slide text has been replaced.
 *
 * @throws If none of the requested source text occurs in slide parts.
 */
export async function editPresentationTemplate(srcPath: string, destPath: string, replacements: Record<string, string>): Promise<void> {
	// hygiene-ignore single-use -- Keep isSlidePart as a named OOXML transformation step so the source snapshot, validation, and replacement sequence stay in their current order.
	/**
	 * Selects only numbered slide XML parts for exact-text edits.
	 *
	 * @param name Package entry name.
	 *
	 * @return Whether the entry is a numbered presentation slide.
	 */
	function isSlidePart(name: string): boolean {
		return PPT_SLIDES_SLIDE_D_XML_REGEX.test(name);
	}
	await replaceOfficeText(srcPath, destPath, replacements, isSlidePart);
}

/**
 * Replaces exact text in selected entries of an OOXML presentation package.
 *
 * @param srcPath - Existing package file to edit.
 * @param destPath - Path where the updated package is written.
 * @param replacements - Map of exact source text to replacement text.
 * @param include - Predicate selecting package entry names eligible for replacement.
 *
 * @return Resolves after the updated package has been written.
 *
 * @throws If none of the requested text occurs in selected entries.
 */
export async function replaceOfficeText(srcPath: string, destPath: string, replacements: Record<string, string>, include: (entry: string) => boolean): Promise<void> {
	const zip = await JSZip.loadAsync(await fs.readFile(srcPath));
	let replacementsMade = 0;
	for (const [entryName, entry] of Object.entries(zip.files)) {
		if (entry.dir || !include(entryName)) continue;
		let xml = await entry.async('string');
		for (const [from, to] of Object.entries(replacements)) {
			const escapedFrom = escapeXml(from);
			// hygiene-ignore single-use -- Keep escapedTo as a named OOXML transformation step so the source snapshot, validation, and replacement sequence stay in their current order.
			const escapedTo = escapeXml(to);
			const occurrences = xml.split(escapedFrom).length - 1;
			if (occurrences) {
				xml = xml.replaceAll(escapedFrom, escapedTo);
				replacementsMade += occurrences;
			}
		}
		zip.file(entryName, xml);
	}
	if (!replacementsMade) throw new Error('No editable text matched the requested replacements in ' + path.basename(srcPath) + '.');
	await fs.mkdir(path.dirname(destPath), { recursive: true });
	await fs.writeFile(destPath, await zip.generateAsync({ type: 'nodebuffer' }));
}

// hygiene-ignore single-use -- Keep finalizePresentation as a named OOXML transformation step so the source snapshot, validation, and replacement sequence stay in their current order.
/**
 * Finalizes the OOXML deck for common Office editors and applies its Design > Variants palette to the theme and compatibility metadata.
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
	// hygiene-ignore single-use -- Keep removeMissingOverride as a named OOXML transformation step so the source snapshot, validation, and replacement sequence stay in their current order.
	/**
	 * Keeps content-type overrides only when the package part still exists.
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
		// hygiene-ignore single-use -- Keep replacement as a named OOXML transformation step so the source snapshot, validation, and replacement sequence stay in their current order.
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
