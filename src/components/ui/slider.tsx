/**
 * src/components/ui/slider.tsx
 * https://ui.shadcn.com/docs/components/slider
 */

/*//////////////////////////////////////////////////
IMPORTS
//////////////////////////////////////////////////*/

// API
import { cn } from '../../lib/cn.js';

// COMPONENTS
import * as React from 'react';
import * as SliderPrimitive from '@radix-ui/react-slider';

// DATA
import { INTERACTIVE_CONTROL_VARIANTS } from './variants.js';
const SLIDER_TRACK_CLASSES =
	'relative grow overflow-hidden rounded-full border bg-primary-1 data-[orientation=horizontal]:h-1.5 data-[orientation=vertical]:h-full data-[orientation=horizontal]:w-full data-[orientation=vertical]:w-1.5';
const SLIDER_RANGE_CLASSES = 'absolute bg-primary-11 data-[orientation=horizontal]:h-full data-[orientation=vertical]:w-full';

/*//////////////////////////////////////////////////
COMPONENTS
//////////////////////////////////////////////////*/

/**
 * Radix slider wrapper for controlled or uncontrolled values. Without custom
 * `children`, it renders one thumb per controlled `value` (or `defaultValue`)
 * entry, and renders two thumbs when neither prop is an array.
 *
 * @param className Optional classes applied to the slider root.
 * @param defaultValue Initial slider values when uncontrolled.
 * @param value Controlled slider values.
 * @param min Minimum numeric slider value.
 * @param max Maximum numeric slider value.
 * @param ariaLabel Accessible label for the slider.
 * @param ariaLabelledBy Id of the element that labels the slider.
 * @param children Optional custom slider track and thumbs.
 * @param rootProps Remaining Radix slider properties.
 *
 * @return A slider root with a track, range, and value-matched thumbs.
 */
function Slider({
	className,
	defaultValue,
	value,
	min = 0,
	max = 100,
	'aria-label': ariaLabel,
	'aria-labelledby': ariaLabelledBy,
	children,
	...rootProps
}: React.ComponentProps<typeof SliderPrimitive.Root>): React.JSX.Element {
	// terra-quality-ignore single-use -- Keep getSliderValues as a named declaration so its authored TSDoc stays attached. TSDoc: Resolves the thumb positions from the controlled or default slider values.
	/** Resolves the thumb positions from the controlled or default slider values.
	 *
	 * @return Slider values or the minimum and maximum endpoints.
	 */
	function getSliderValues(): number[] {
		return Array.isArray(value) ? value : Array.isArray(defaultValue) ? defaultValue : [min, max];
	}
	const vals = React.useMemo(getSliderValues, [value, defaultValue, min, max]);
	// terra-quality-ignore single-use -- Keep renderThumb as a named declaration so its authored TSDoc stays attached. TSDoc: Renders one thumb and labels its position when multiple values are present.
	/** Renders one thumb and labels its position when multiple values are present.
	 *
	 * @param _value Unused array element placeholder required by `Array.from`.
	 * @param index Zero-based position of this thumb.
	 *
	 * @return A slider thumb with its corresponding accessible label.
	 */
	function renderThumb(_value: undefined, index: number): React.JSX.Element {
		return (
			<SliderPrimitive.Thumb
				data-slot='slider-thumb'
				key={index}
				aria-labelledby={ariaLabelledBy}
				aria-label={
					vals.length === 1 ? ariaLabel : vals.length === 2 ? `${index === 0 ? 'Minimum' : 'Maximum'} ${ariaLabel ?? 'value'}` : `${ariaLabel ?? 'Slider value'} ${index + 1} of ${vals.length}`
				}
				className={cn('block size-4 shrink-0 rounded-full border border-primary-1 bg-primary-12 shadow-sm transition-[color,box-shadow] hover:ring-4', INTERACTIVE_CONTROL_VARIANTS())}
			/>
		);
	}
	return (
		<SliderPrimitive.Root
			data-slot='slider'
			defaultValue={defaultValue}
			value={value}
			min={min}
			max={max}
			aria-label={ariaLabel}
			aria-labelledby={ariaLabelledBy}
			className={cn(
				'relative flex w-full touch-none select-none items-center data-[orientation=vertical]:h-full data-[orientation=vertical]:min-h-44 data-[orientation=vertical]:w-auto data-[orientation=vertical]:flex-col data-[disabled]:opacity-50',
				className,
			)}
			{...rootProps}
		>
			{children === undefined ? (
				<>
					<SliderPrimitive.Track data-slot='slider-track' className={cn(SLIDER_TRACK_CLASSES)}>
						<SliderPrimitive.Range data-slot='slider-range' className={cn(SLIDER_RANGE_CLASSES)} />
					</SliderPrimitive.Track>
					{Array.from({ length: vals.length }, renderThumb)}
				</>
			) : (
				children
			)}
		</SliderPrimitive.Root>
	);
}

/*
 * Slider track primitive container.
 *
 */
// terra-quality-ignore single-use -- Keep renderSliderTrack as a named declaration so its authored TSDoc stays attached. TSDoc: Renders the track primitive with shared slider track classes.
/** Renders the track primitive with shared slider track classes.
 *
 * @param trackProps Track properties and optional classes.
 * @param ref Forwarded track element ref.
 *
 * @return The styled slider track.
 */
function renderSliderTrack(trackProps: React.ComponentPropsWithoutRef<typeof SliderPrimitive.Track>, ref: React.ForwardedRef<React.ElementRef<typeof SliderPrimitive.Track>>): React.JSX.Element {
	const { className, ...primitiveProps } = trackProps;
	return <SliderPrimitive.Track ref={ref} className={cn(SLIDER_TRACK_CLASSES, className)} {...primitiveProps} />;
}
const SliderTrack = Object.assign(React.forwardRef(renderSliderTrack), {
	displayName: SliderPrimitive.Track.displayName,
});

/*
 * Slider range primitive fill indicator.
 *
 */
// terra-quality-ignore single-use -- Keep renderSliderRange as a named declaration so its authored TSDoc stays attached. TSDoc: Renders the selected-value fill with shared slider range classes.
/** Renders the selected-value fill with shared slider range classes.
 *
 * @param rangeProps Range properties and optional classes.
 * @param ref Forwarded range element ref.
 *
 * @return The styled slider range.
 */
function renderSliderRange(rangeProps: React.ComponentPropsWithoutRef<typeof SliderPrimitive.Range>, ref: React.ForwardedRef<React.ElementRef<typeof SliderPrimitive.Range>>): React.JSX.Element {
	const { className, ...primitiveProps } = rangeProps;
	return <SliderPrimitive.Range ref={ref} className={cn(SLIDER_RANGE_CLASSES, className)} {...primitiveProps} />;
}
const SliderRange = Object.assign(React.forwardRef(renderSliderRange), {
	displayName: SliderPrimitive.Range.displayName,
});

/*
 * Slider thumb primitive handle.
 *
 */
// terra-quality-ignore single-use -- Keep renderSliderThumb as a named declaration so its authored TSDoc stays attached. TSDoc: Renders a slider thumb with focus and selection styling.
/** Renders a slider thumb with focus and selection styling.
 *
 * @param thumbProps Thumb properties and optional classes.
 * @param ref Forwarded thumb element ref.
 *
 * @return The styled slider thumb.
 */
function renderSliderThumb(thumbProps: React.ComponentPropsWithoutRef<typeof SliderPrimitive.Thumb>, ref: React.ForwardedRef<React.ElementRef<typeof SliderPrimitive.Thumb>>): React.JSX.Element {
	const { className, ...primitiveProps } = thumbProps;
	return (
		<SliderPrimitive.Thumb
			ref={ref}
			className={cn(
				'block size-4 shrink-0 rounded-full border border-primary-1 bg-primary-12 shadow-sm transition-[color,box-shadow] hover:ring-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-9 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
				className,
			)}
			{...primitiveProps}
		/>
	);
}
const SliderThumb = Object.assign(React.forwardRef(renderSliderThumb), {
	displayName: SliderPrimitive.Thumb.displayName,
});
Slider.displayName = SliderPrimitive.Root.displayName;
export { Slider, SliderTrack, SliderRange, SliderThumb };
