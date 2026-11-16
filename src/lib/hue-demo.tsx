import * as React from 'react';
import { applyHue, colors, invert } from './hue.js';
import { Button, Card, Checkbox, Input, Label, Slider, Switch } from '../components/ui/index.js';
import type { ColorGenOpts } from './types.js';

const DEFAULT_OPTS: Required<ColorGenOpts> = { accentLightness: 0.5, accentChroma: 0.075, hueAvoidanceShift: 60, hoverLightnessShift: 0.03, hoverChromaMultiplier: 0.93 };

export type HueDemoProps = { hue?: number; onHueChange?: (hue: number) => void; className?: string };

/** Interactive palette generator shared by the Styling guide and its consumers. */
export function HueDemo({ hue: controlledHue, onHueChange, className = '' }: HueDemoProps): React.JSX.Element {
	const [localHue, setLocalHue] = React.useState(220);
	const [grayscale, setGrayscale] = React.useState(false);
	const [dark, setDark] = React.useState(false);
	const [showConstants, setShowConstants] = React.useState(false);
	const [opts, setOpts] = React.useState<Required<ColorGenOpts>>(DEFAULT_OPTS);
	const [copied, setCopied] = React.useState<string | null>(null);
	const scope = React.useRef<HTMLDivElement>(null);
	const hue = controlledHue ?? localHue;
	const selectedHue = grayscale ? null : hue;
	const [primary, gray] = React.useMemo(() => colors(selectedHue, opts), [selectedHue, opts]);
	const [secondary] = React.useMemo(() => colors(invert(selectedHue), opts), [selectedHue, opts]);

	React.useEffect(() => { if (scope.current) applyHue(selectedHue, scope.current); }, [selectedHue, dark]);
	React.useEffect(() => { if (copied) { const timer = window.setTimeout(() => setCopied(null), 650); return () => window.clearTimeout(timer); } }, [copied]);

	function setHue(next: number): void {
		const clamped = Math.max(0, Math.min(360, next));
		if (controlledHue === undefined) setLocalHue(clamped);
		onHueChange?.(clamped);
	}

	function swatches(values: readonly string[], label: string): React.JSX.Element {
		return <div className='grid grid-cols-3 gap-2 md:grid-cols-4 xl:grid-cols-6' aria-label={`${label} twelve color steps`}>
			{values.map((rgb, i) => {
				const hex = `#${rgb.split(' ').map(channel => Number(channel).toString(16).padStart(2, '0')).join('')}`;
				const key = `${label}-${i}`;
				return <Button key={key} type='button' variant='primary-ghost' size='sm' className='h-auto min-w-0 flex-col items-stretch gap-1 p-1 text-left font-normal' aria-label={`Copy ${label} scale ${i + 1} colour`} title='Copy hex' onClick={() => { setCopied(key); void navigator.clipboard?.writeText(hex); }}>
					<span className='h-8 rounded' style={{ backgroundColor: `rgb(${rgb})` }} />
					<span className='flex justify-between gap-1 text-[11px]'><span>{i + 1}</span><span className='truncate font-mono'>{copied === key ? 'Copied!' : hex}</span></span>
				</Button>;
			})}
		</div>;
	}

	function option(label: string, key: keyof ColorGenOpts, min: number, max: number, step: number): React.JSX.Element {
		return <div className='grid gap-1'><Label htmlFor={`hue-${key}`}>{label}: {opts[key]}</Label><Slider id={`hue-${key}`} aria-label={label} min={min} max={max} step={step} value={[opts[key]]} onValueChange={values => setOpts(current => ({ ...current, [key]: values[0] ?? current[key] }))} /></div>;
	}

	return <div className={`grid gap-4 rounded-lg border border-primary-6 p-4 ${className}`}>
		<div className='flex flex-wrap items-end gap-4'>
			<div className='grid min-w-48 flex-1 gap-2'><Label htmlFor='hue-demo-slider'>Hue: {hue}°</Label><Slider id='hue-demo-slider' aria-label='Hue' min={0} max={360} value={[hue]} disabled={grayscale} onValueChange={values => setHue(values[0] ?? 0)} /></div>
			<div className='grid gap-1'><Label htmlFor='hue-demo-degrees'>Degrees</Label><Input id='hue-demo-degrees' className='w-24' type='number' min={0} max={360} value={hue} disabled={grayscale} onChange={event => setHue(Number(event.target.value))} /></div>
			<div className='flex items-center gap-2'><Checkbox id='hue-demo-grayscale' checked={grayscale} onCheckedChange={checked => setGrayscale(checked === true)} /><Label htmlFor='hue-demo-grayscale'>Grayscale</Label></div>
			<div className='flex items-center gap-2'><Checkbox id='hue-demo-dark' checked={dark} onCheckedChange={checked => setDark(checked === true)} /><Label htmlFor='hue-demo-dark'>Dark</Label></div>
			<div className='flex items-center gap-2'><Switch id='hue-demo-constants' checked={showConstants} onCheckedChange={setShowConstants} /><Label htmlFor='hue-demo-constants'>Generator constants</Label></div>
		</div>
		{showConstants && <div className='grid gap-4 border-t border-primary-6 pt-4 sm:grid-cols-2'>{option('Accent lightness', 'accentLightness', 0.2, 0.8, 0.01)}{option('Accent chroma', 'accentChroma', 0, 0.2, 0.005)}{option('Green hue shift', 'hueAvoidanceShift', 0, 120, 1)}{option('Hover lightness', 'hoverLightnessShift', 0, 0.1, 0.005)}{option('Hover chroma', 'hoverChromaMultiplier', 0.5, 1, 0.01)}</div>}
		<div><p className='mb-2 text-sm'>Primary</p>{swatches(dark ? primary.dark : primary.light, 'Primary')}</div>
		<div><p className='mb-2 text-sm'>Secondary</p>{swatches(dark ? secondary.dark : secondary.light, 'Secondary')}</div>
		<div><p className='mb-2 text-sm'>Gray</p>{swatches(dark ? gray.dark : gray.light, 'Gray')}</div>
		<div ref={scope} data-hue-scope className={`${dark ? 'dark' : 'light'} rounded-lg border border-primary-6 bg-primary-1 p-4 text-primary-12`}>
			<p className='mb-2 text-sm'>This preview is scoped to the selected palette.</p>
			<div className='flex flex-wrap gap-2'><Button variant='primary-saturated' size='sm'>Primary action</Button><Button variant='secondary-outline' size='sm'>Secondary action</Button><Card variant='primary-tonal' size='sm' className='p-2'>Card surface</Card></div>
		</div>
	</div>;
}
