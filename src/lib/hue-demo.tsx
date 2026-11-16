import * as React from 'react';
import { Copy, Moon, Sun } from '@carbon/icons-react';
import { applyHue, colors, invert } from './hue.js';
import { Button, Label, Slider, Switch } from '../components/ui/index.js';
import type { ColorGenOpts } from './types.js';

const STEPS = Array.from({ length: 12 }, (_, index) => index + 1);
const DEFAULT_OPTS: Required<ColorGenOpts> = {
	accentLightness: 0.5,
	accentChroma: 0.075,
	hueAvoidanceShift: 60,
	hoverLightnessShift: 0.03,
	hoverChromaMultiplier: 0.93,
};

export type HueDemoProps = { hue?: number; onHueChange?: (hue: number) => void; compact?: boolean; className?: string };

/** The shared colour demo, based on the Website's palette controls and swatches. */
export function HueDemo({ hue: controlledHue, onHueChange, compact = false, className = '' }: HueDemoProps): React.JSX.Element {
	const [localHue, setLocalHue] = React.useState(220);
	const [appearance, setAppearance] = React.useState<'light' | 'dark'>('light');
	const [showConstants, setShowConstants] = React.useState(false);
	const [opts, setOpts] = React.useState<Required<ColorGenOpts>>(DEFAULT_OPTS);
	const [copiedKey, setCopiedKey] = React.useState<string | null>(null);
	const scope = React.useRef<HTMLDivElement>(null);
	const hue = controlledHue ?? localHue;
	const [primary] = React.useMemo(() => colors(hue, opts), [hue, opts]);
	const [secondary] = React.useMemo(() => colors(invert(hue), opts), [hue, opts]);

	React.useEffect(() => { if (scope.current) applyHue(hue, scope.current); }, [hue]);
	React.useEffect(() => {
		if (!copiedKey) return;
		const timer = window.setTimeout(() => setCopiedKey(null), 650);
		return () => window.clearTimeout(timer);
	}, [copiedKey]);

	function setHue(value: number): void {
		const next = Math.max(0, Math.min(360, value));
		if (controlledHue === undefined) setLocalHue(next);
		onHueChange?.(next);
	}

	function setting(label: string, key: keyof ColorGenOpts, min: number, max: number, step: number, description: string): React.JSX.Element {
		return <div className='grid gap-2'>
			<Label htmlFor={`hue-demo-${key}`} title={description} className='flex justify-between text-primary-11'><span>{label}</span><span>{opts[key].toFixed(key === 'accentChroma' ? 3 : 2)}</span></Label>
			<Slider id={`hue-demo-${key}`} aria-label={label} min={min} max={max} step={step} value={[opts[key]]} onValueChange={values => setOpts(current => ({ ...current, [key]: values[0] ?? current[key] }))} />
		</div>;
	}

	function swatches(title: 'Primary' | 'Secondary', scale: ReturnType<typeof colors>[0]): React.JSX.Element {
		return <div>
			<p className={compact ? 'mb-1 text-sm font-medium' : 'mb-2 text-sm font-medium'}>{title}</p>
			<div className='grid gap-2' style={{ gridTemplateColumns: `repeat(auto-fit, minmax(${compact ? '4rem' : '8rem'}, 1fr))` }} aria-label={`${title} twelve color steps`}>
				{scale[appearance].map((rgb, index) => {
					const key = `${title}-${index}`;
					const channels = rgb.split(' ').map(channel => Number.parseInt(channel, 10));
					const hex = `#${channels.map(channel => channel.toString(16).padStart(2, '0')).join('')}`;
					const [red = 0, green = 0, blue = 0] = channels;
					const copied = copiedKey === key;
					const iconClass = (red * 299 + green * 587 + blue * 114) / 1000 > 155 ? 'text-black/80' : 'text-white/90 drop-shadow-sm';
					return <Button key={key} type='button' variant='primary-ghost' size='sm' className='h-auto w-full flex-col items-stretch gap-1 rounded-md p-1 text-left font-normal' aria-label={`Copy ${title} scale ${STEPS[index]} colour`} title={`Copy ${hex}`} onClick={() => { setCopiedKey(key); void navigator.clipboard?.writeText(hex); }}>
						<span className='relative flex h-7 w-full items-center justify-center rounded-md' style={{ backgroundColor: `rgb(${rgb})` }}>{copied && <Copy className={iconClass} />}</span>
						<span className='flex items-center justify-between text-nowrap text-[11px]'><span>{STEPS[index]}</span><span className='mx-1 truncate font-mono uppercase text-primary-12/50'>{copied ? 'Copied!' : hex}</span></span>
					</Button>;
				})}
			</div>
		</div>;
	}

	return <div ref={scope} className={`grid gap-4 rounded-lg border border-primary-6 p-4 ${className}`}>
		<div className='grid gap-4'>
			{showConstants && <dl className='grid grid-cols-2 gap-x-4 gap-y-1 border-b border-primary-6 pb-3 text-xs text-primary-11 sm:grid-cols-4'>
				<div><dt className='font-medium text-primary-12'>Space</dt><dd>OKLCH</dd></div>
				<div><dt className='font-medium text-primary-12'>Chroma</dt><dd>{opts.accentChroma.toFixed(3)}</dd></div>
				<div><dt className='font-medium text-primary-12'>Neutral</dt><dd>#9ca3af</dd></div>
				<div><dt className='font-medium text-primary-12'>Scale</dt><dd>Radix 12-step</dd></div>
			</dl>}
			{swatches('Primary', primary)}
			{swatches('Secondary', secondary)}
		</div>
		<div className='grid gap-4 border-t border-primary-6 pt-4 sm:grid-cols-2'>
			<div className='grid gap-2'><Label htmlFor='hue-demo-slider' className='flex justify-between text-primary-11'><span>Hue</span><span>{hue}°</span></Label><Slider id='hue-demo-slider' aria-label='Hue' min={0} max={360} step={1} value={[hue]} onValueChange={values => setHue(values[0] ?? 0)} /></div>
			<div className='grid gap-2'><Label>Appearance</Label><div className='flex gap-2' role='group' aria-label='Appearance'>
				<Button type='button' size='sm' variant={appearance === 'light' ? 'primary-tonal' : 'primary-ghost'} aria-pressed={appearance === 'light'} onClick={() => setAppearance('light')}><Sun />Light</Button>
				<Button type='button' size='sm' variant={appearance === 'dark' ? 'primary-tonal' : 'primary-ghost'} aria-pressed={appearance === 'dark'} onClick={() => setAppearance('dark')}><Moon />Dark</Button>
			</div></div>
			<div className='flex items-center gap-2 sm:col-span-2'><Switch id='hue-demo-constants' checked={showConstants} onCheckedChange={setShowConstants} /><Label htmlFor='hue-demo-constants'>Generator Constants</Label></div>
			{showConstants && <div className='grid gap-4 sm:col-span-2 sm:grid-cols-2'>
				{setting('Accent Lightness', 'accentLightness', 0.2, 0.8, 0.01, 'Default OKLCH lightness of the accent colour')}
				{setting('Accent Chroma', 'accentChroma', 0, 0.2, 0.005, 'Default OKLCH chroma of the accent colour')}
				{setting('Green Hue Shift', 'hueAvoidanceShift', 0, 120, 1, 'Shift applied to hues in the green-brown range')}
				{setting('Hover Lightness', 'hoverLightnessShift', 0, 0.1, 0.005, 'Lightness adjustment for hover colours')}
				{setting('Hover Chroma', 'hoverChromaMultiplier', 0.5, 1, 0.01, 'Chroma multiplier for hover colours')}
			</div>}
		</div>
	</div>;
}
