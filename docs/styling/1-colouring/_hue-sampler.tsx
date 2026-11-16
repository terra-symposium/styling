import * as React from 'react';
import { applyHue, colors } from '../../../src/lib/hue.js';
import { Button, Card, Checkbox, Input, Label, Slider } from '../../../src/components/ui/index.js';

/** An isolated, interactive preview of the generated twelve-step palettes. */
export function HueSampler(): React.JSX.Element {
	const [hue, setHue] = React.useState(220);
	const [grayscale, setGrayscale] = React.useState(false);
	const [dark, setDark] = React.useState(false);
	const scope = React.useRef<HTMLDivElement>(null);
	const selectedHue = grayscale ? null : hue;
	const [accent, gray] = React.useMemo(() => colors(selectedHue), [selectedHue]);
	React.useEffect(() => {
		if (scope.current) applyHue(selectedHue, scope.current);
	}, [selectedHue, dark]);
	const steps = dark ? accent.dark : accent.light;
	const graySteps = dark ? gray.dark : gray.light;
	function swatches(values: readonly string[], label: string): React.JSX.Element {
		return (
			<div className='grid gap-2' style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(4rem, 1fr))' }} aria-label={`${label} twelve color steps`}>
				{values.map((rgb, index) => (
					<div key={index} className='grid gap-1 text-center text-xs'>
						<span className='h-10 rounded border' style={{ backgroundColor: `rgb(${rgb.replaceAll(' ', ', ')})` }} />
						<span>{index + 1}</span>
					</div>
				))}
			</div>
		);
	}
	return (
		<div className='grid gap-4 rounded-lg border border-primary-6 p-4'>
			<div className='flex flex-wrap items-end gap-4'>
				<div className='grid min-w-48 flex-1 gap-2'>
					<Label htmlFor='hue-slider'>Hue</Label>
					<Slider id='hue-slider' aria-label='Hue' min={0} max={360} value={[hue]} disabled={grayscale} onValueChange={values => setHue(values[0] ?? 0)} />
				</div>
				<div className='grid gap-1'>
					<Label htmlFor='hue-degrees'>Degrees</Label>
					<Input
						id='hue-degrees'
						className='w-24'
						type='number'
						min={0}
						max={360}
						value={hue}
						disabled={grayscale}
						onChange={event => setHue(Math.max(0, Math.min(360, Number(event.target.value))))}
					/>
				</div>
				<div className='flex items-center gap-2'>
					<Checkbox id='hue-grayscale' checked={grayscale} onCheckedChange={checked => setGrayscale(checked === true)} />
					<Label htmlFor='hue-grayscale'>Grayscale</Label>
				</div>
				<div className='flex items-center gap-2'>
					<Checkbox id='hue-dark' checked={dark} onCheckedChange={checked => setDark(checked === true)} />
					<Label htmlFor='hue-dark'>Dark</Label>
				</div>
			</div>
			<div>
				<p className='mb-2 text-sm'>Primary</p>
				{swatches(steps, 'Primary')}
			</div>
			<div>
				<p className='mb-2 text-sm'>Gray</p>
				{swatches(graySteps, 'Gray')}
			</div>
			<div ref={scope} data-hue-scope className={`${dark ? 'dark' : 'light'} rounded-lg border border-primary-6 bg-primary-1 p-4 text-primary-12`}>
				<p className='mb-2 text-sm'>This preview is scoped to the selected palette.</p>
				<div className='flex flex-wrap gap-2'>
					<Button variant='primary-saturated' size='sm'>
						Primary action
					</Button>
					<Button variant='secondary-outline' size='sm'>
						Secondary action
					</Button>
					<Card variant='primary-tonal' size='sm' className='p-2'>
						Card surface
					</Card>
				</div>
			</div>
		</div>
	);
}
