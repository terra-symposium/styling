/*//////////////////////////////////////////////////
IMPORTS
//////////////////////////////////////////////////*/

import * as React from 'react';
import { Copy, Moon, Sun } from '@carbon/icons-react';
import { applyHue, colors, invert } from './hue.js';
import { Button, Label, Slider, Switch } from '../components/ui/index.js';
import type { ColorGenOpts } from './types.js';
const GRID_GAP_2_CLASS = 'grid gap-2';
const FONT_MEDIUM_TEXT_PRIMARY_12_CLASS = 'font-medium text-primary-12';

const STEPS = Array.from({ length: 12 }, (_, i) => i + 1);
export const DEFAULT_HUE_DEMO_OPTS: Required<ColorGenOpts> = {
	accentLightness: 0.5,
	accentChroma: 0.075,
	hueAvoidanceShift: 60,
	hoverLightnessShift: 0.03,
	hoverChromaMultiplier: 0.93,
};
/** Required color-generation settings used by the hue demo. */
export type HueDemoOptions = Required<ColorGenOpts>;

/** Properties for rendering the generated palette without its controls. */
export type HueDemoPreviewProps = {
	hue: number;
	appearance?: 'light' | 'dark';
	generatorOpts?: Required<ColorGenOpts>;
	showGeneratorConstants?: boolean;
	compact?: boolean;
	className?: string;
};

/**
 * The Website palette preview, shared with the Styling documentation. Controls belong outside this preview.
 * @param hue Hue that determines the generated palette.
 * @param appearance Light or dark palette presentation.
 * @param generatorOpts Generator settings for the color scales.
 * @param showGeneratorConstants Whether to show the constants used for generation.
 * @param compact Whether to use the compact preview layout.
 * @param className Additional classes for the preview container.
 * @return The rendered palette preview.
 */
export function HueDemoPreview({
	hue,
	appearance = 'light',
	generatorOpts = DEFAULT_HUE_DEMO_OPTS,
	showGeneratorConstants = false,
	compact = false,
	className = '',
}: HueDemoPreviewProps): React.JSX.Element {
	const [copiedKey, setCopiedKey] = React.useState<string | null>(null);
	const container = React.useRef<HTMLDivElement>(null);
	const [cols, setCols] = React.useState(6);
	const [primary] = React.useMemo(() => colors(hue, generatorOpts), [hue, generatorOpts]);
	const [secondary] = React.useMemo(() => colors(invert(hue), generatorOpts), [hue, generatorOpts]);

	React.useEffect(() => {
		if (!copiedKey) return;
		// hygiene-ignore single-use -- Keep the timeout handle so the effect cleanup cancels the exact timer created for this copied swatch.
		const timer = window.setTimeout(() => setCopiedKey(null), 650);
		return () => window.clearTimeout(timer);
	}, [copiedKey]);
	React.useEffect(() => {
		if (!container.current) return;
		const observer = new ResizeObserver(entries => {
			// hygiene-ignore single-use -- Capture the ResizeObserver entry width once before deriving the responsive column count for that notification.
			const width = entries[0]?.contentRect.width ?? 0;
			setCols(width >= (compact ? 960 : 1152) ? 12 : 6);
		});
		observer.observe(container.current);
		return () => observer.disconnect();
	}, [compact]);

	function swatches(title: 'Primary' | 'Secondary', scale: ReturnType<typeof colors>[0]): React.JSX.Element {
		return (
			<div>
				<p className={compact ? 'mb-1 text-sm font-medium' : 'mb-2 text-sm font-medium'}>{title}</p>
				<div className={GRID_GAP_2_CLASS} style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }} aria-label={`${title} twelve color steps`}>
					{scale[appearance].map((rgb, i) => {
						const key = `${title}-${i}`;
						const channels = rgb.split(' ').map(channel => Number.parseInt(channel, 10));
						const hex = `#${channels.map(channel => channel.toString(16).padStart(2, '0')).join('')}`;
						const [red = 0, green = 0, blue = 0] = channels;
						const copied = copiedKey === key;
						// hygiene-ignore single-use -- Capture the luminance-based foreground class once alongside the RGB values used to render this palette swatch.
						const iconClass = (red * 299 + green * 587 + blue * 114) / 1000 > 155 ? 'text-black/80' : 'text-white/90 drop-shadow-sm';
						return (
							<Button
								key={key}
								type='button'
								variant='primary-ghost'
								size='sm'
								className='h-auto min-w-0 w-full flex-col items-stretch gap-1 rounded-md p-1 text-left font-normal'
								aria-label={`Copy ${title} scale ${STEPS[i]} colour`}
								title={`Copy ${hex}`}
								onClick={() => {
									setCopiedKey(key);
									void navigator.clipboard?.writeText(hex);
								}}
							>
								<span className='relative flex h-7 w-full items-center justify-center rounded-md' style={{ backgroundColor: `rgb(${rgb})` }}>
									{copied && <Copy className={iconClass} />}
								</span>
								<span className='flex min-w-0 items-center justify-between text-nowrap text-[11px]'>
									<span>{STEPS[i]}</span>
									<span className='mx-1 truncate font-mono uppercase text-primary-12/50'>{copied ? 'Copied!' : hex}</span>
								</span>
							</Button>
						);
					})}
				</div>
			</div>
		);
	}

	return (
		<div ref={container} className={`size-full space-y-4 overflow-auto ${className}`}>
			{showGeneratorConstants && (
				<dl className='grid grid-cols-2 gap-x-4 gap-y-1 border-b border-primary-6 pb-3 text-xs text-primary-11 sm:grid-cols-4'>
					<div>
						<dt className={FONT_MEDIUM_TEXT_PRIMARY_12_CLASS}>Space</dt>
						<dd>OKLCH</dd>
					</div>
					<div>
						<dt className={FONT_MEDIUM_TEXT_PRIMARY_12_CLASS}>Chroma</dt>
						<dd>{generatorOpts.accentChroma.toFixed(3)}</dd>
					</div>
					<div>
						<dt className={FONT_MEDIUM_TEXT_PRIMARY_12_CLASS}>Neutral</dt>
						<dd>#9ca3af</dd>
					</div>
					<div>
						<dt className={FONT_MEDIUM_TEXT_PRIMARY_12_CLASS}>Scale</dt>
						<dd>Radix 12-step</dd>
					</div>
				</dl>
			)}
			{swatches('Primary', primary)}
			{swatches('Secondary', secondary)}
		</div>
	);
}

/** Optional controlled value, callback, and layout settings for the standalone hue demo. */
export type HueDemoProps = { hue?: number; onHueChange?: (hue: number) => void; compact?: boolean; className?: string };

/**
 * Standalone docs demo: palette preview followed by its controls. The hue themes the whole page.
 * @param controlledHue Optional controlled hue value.
 * @param onHueChange Callback for hue changes.
 * @param compact Whether to use the compact layout.
 * @param className Additional classes for the demo container.
 * @return The rendered hue demo.
 */
export function HueDemo({ hue: controlledHue, onHueChange, compact = false, className = '' }: HueDemoProps): React.JSX.Element {
	const [localHue, setLocalHue] = React.useState(220);
	const [appearance, setAppearance] = React.useState<'light' | 'dark'>('light');
	const [showConstants, setShowConstants] = React.useState(false);
	const [opts, setOpts] = React.useState<Required<ColorGenOpts>>(DEFAULT_HUE_DEMO_OPTS);
	const hue = controlledHue ?? localHue;

	React.useEffect(() => {
		applyHue(hue);
	}, [hue]);

	// hygiene-ignore single-use -- Keep hue clamping and controlled/uncontrolled updates together as the Slider callback boundary.
	function setHue(value: number): void {
		const next = Math.max(0, Math.min(360, value));
		if (controlledHue === undefined) setLocalHue(next);
		onHueChange?.(next);
	}

	function setting(label: string, key: keyof ColorGenOpts, min: number, max: number, step: number, desc: string): React.JSX.Element {
		return (
			<div className={GRID_GAP_2_CLASS}>
				<Label htmlFor={`hue-demo-${key}`} title={desc} className='flex justify-between text-primary-11'>
					<span>{label}</span>
					<span>{opts[key].toFixed(key === 'accentChroma' ? 3 : 2)}</span>
				</Label>
				<Slider
					id={`hue-demo-${key}`}
					aria-label={label}
					min={min}
					max={max}
					step={step}
					value={[opts[key]]}
					onValueChange={values => setOpts(current => ({ ...current, [key]: values[0] ?? current[key] }))}
				/>
			</div>
		);
	}

	return (
		<div className={`grid gap-4 ${className}`}>
			<div className='rounded-lg border border-primary-6 p-4'>
				<HueDemoPreview hue={hue} appearance={appearance} generatorOpts={opts} showGeneratorConstants={showConstants} compact={compact} />
			</div>
			<div className='grid gap-4 sm:grid-cols-2'>
				<div className={GRID_GAP_2_CLASS}>
					<Label htmlFor='hue-demo-slider' className='flex justify-between text-primary-11'>
						<span>Hue</span>
						<span>{hue}°</span>
					</Label>
					<Slider id='hue-demo-slider' aria-label='Hue' min={0} max={360} step={1} value={[hue]} onValueChange={values => setHue(values[0] ?? 0)} />
				</div>
				<div className={GRID_GAP_2_CLASS}>
					<Label>Appearance</Label>
					<div className='flex gap-2' role='group' aria-label='Appearance'>
						<Button type='button' size='sm' variant={appearance === 'light' ? 'primary-tonal' : 'primary-ghost'} aria-pressed={appearance === 'light'} onClick={() => setAppearance('light')}>
							<Sun />
							Light
						</Button>
						<Button type='button' size='sm' variant={appearance === 'dark' ? 'primary-tonal' : 'primary-ghost'} aria-pressed={appearance === 'dark'} onClick={() => setAppearance('dark')}>
							<Moon />
							Dark
						</Button>
					</div>
				</div>
				<div className='flex items-center gap-2 sm:col-span-2'>
					<Switch id='hue-demo-constants' checked={showConstants} onCheckedChange={setShowConstants} />
					<Label htmlFor='hue-demo-constants'>Generator Constants</Label>
				</div>
				{showConstants && (
					<div className='grid gap-4 sm:col-span-2 sm:grid-cols-2'>
						{setting('Accent Lightness', 'accentLightness', 0.2, 0.8, 0.01, 'Default OKLCH lightness of the accent colour')}
						{setting('Accent Chroma', 'accentChroma', 0, 0.2, 0.005, 'Default OKLCH chroma of the accent colour')}
						{setting('Green Hue Shift', 'hueAvoidanceShift', 0, 120, 1, 'Shift applied to hues in the green-brown range')}
						{setting('Hover Lightness', 'hoverLightnessShift', 0, 0.1, 0.005, 'Lightness adjustment for hover colours')}
						{setting('Hover Chroma', 'hoverChromaMultiplier', 0.5, 1, 0.01, 'Chroma multiplier for hover colours')}
					</div>
				)}
			</div>
		</div>
	);
}
