/**
 * astro/src/components/ui/slider.tsx
 * https://ui.shadcn.com/docs/components/slider
 */

/*//////////////////////////////////////////////////
IMPORTS
//////////////////////////////////////////////////*/

// API
import { cn } from "../../lib/cn.js";
import { INTERACTIVE_CONTROL_VARIANTS } from "./variants.js";

// COMPONENTS
import * as React from "react";
import * as SliderPrimitive from "@radix-ui/react-slider";

const SLIDER_TRACK_CLASSES =
  "relative grow overflow-hidden rounded-full border bg-primary-1 data-[orientation=horizontal]:h-1.5 data-[orientation=vertical]:h-full data-[orientation=horizontal]:w-full data-[orientation=vertical]:w-1.5";
const SLIDER_RANGE_CLASSES =
  "absolute bg-primary-11 data-[orientation=horizontal]:h-full data-[orientation=vertical]:w-full";

/*//////////////////////////////////////////////////
COMPONENTS
//////////////////////////////////////////////////*/

/**
 * Radix slider wrapper for controlled or uncontrolled values. Without custom
 * `children`, it renders one thumb per controlled `value` (or `defaultValue`)
 * entry, and renders two thumbs when neither prop is an array.
 *
 * @param props - Radix slider settings, optional custom children, and accessible labels.
 * @returns A slider root with a track, range, and value-matched thumbs.
 */
function Slider({
  className,
  defaultValue,
  value,
  min = 0,
  max = 100,
  "aria-label": ariaLabel,
  "aria-labelledby": ariaLabelledBy,
  children,
  ...props
}: React.ComponentProps<typeof SliderPrimitive.Root>): React.JSX.Element {
  const vals = React.useMemo(
    () =>
      Array.isArray(value)
        ? value
        : Array.isArray(defaultValue)
          ? defaultValue
          : [min, max],
    [value, defaultValue, min, max],
  );
  return (
    <SliderPrimitive.Root
      data-slot="slider"
      defaultValue={defaultValue}
      value={value}
      min={min}
      max={max}
      aria-label={ariaLabel}
      aria-labelledby={ariaLabelledBy}
      className={cn(
        "relative flex w-full touch-none select-none items-center data-[orientation=vertical]:h-full data-[orientation=vertical]:min-h-44 data-[orientation=vertical]:w-auto data-[orientation=vertical]:flex-col data-[disabled]:opacity-50",
        className,
      )}
      {...props}
    >
      {children === undefined ? (
        <>
          <SliderPrimitive.Track
            data-slot="slider-track"
            className={cn(SLIDER_TRACK_CLASSES)}
          >
            <SliderPrimitive.Range
              data-slot="slider-range"
              className={cn(SLIDER_RANGE_CLASSES)}
            />
          </SliderPrimitive.Track>
          {Array.from({ length: vals.length }, (_, index) => (
            <SliderPrimitive.Thumb
              data-slot="slider-thumb"
              key={index}
              aria-labelledby={ariaLabelledBy}
              aria-label={
                vals.length === 1
                  ? ariaLabel
                  : vals.length === 2
                    ? `${index === 0 ? "Minimum" : "Maximum"} ${ariaLabel ?? "value"}`
                    : `${ariaLabel ?? "Slider value"} ${index + 1} of ${vals.length}`
              }
              className={cn(
                "block size-4 shrink-0 rounded-full border border-primary-1 bg-primary-12 shadow-sm transition-[color,box-shadow] hover:ring-4",
                INTERACTIVE_CONTROL_VARIANTS(),
              )}
            />
          ))}
        </>
      ) : (
        children
      )}
    </SliderPrimitive.Root>
  );
}

/**
 * Slider track primitive container.
 *
 */
const SliderTrack = Object.assign(
  React.forwardRef<
    React.ElementRef<typeof SliderPrimitive.Track>,
    React.ComponentPropsWithoutRef<typeof SliderPrimitive.Track>
  >(({ className, ...props }, ref): React.JSX.Element => (
    <SliderPrimitive.Track
      ref={ref}
      className={cn(SLIDER_TRACK_CLASSES, className)}
      {...props}
    />
  )),
  { displayName: SliderPrimitive.Track.displayName },
);

/**
 * Slider range primitive fill indicator.
 *
 */
const SliderRange = Object.assign(
  React.forwardRef<
    React.ElementRef<typeof SliderPrimitive.Range>,
    React.ComponentPropsWithoutRef<typeof SliderPrimitive.Range>
  >(({ className, ...props }, ref): React.JSX.Element => (
    <SliderPrimitive.Range
      ref={ref}
      className={cn(SLIDER_RANGE_CLASSES, className)}
      {...props}
    />
  )),
  { displayName: SliderPrimitive.Range.displayName },
);

/**
 * Slider thumb primitive handle.
 *
 */
const SliderThumb = Object.assign(
  React.forwardRef<
    React.ElementRef<typeof SliderPrimitive.Thumb>,
    React.ComponentPropsWithoutRef<typeof SliderPrimitive.Thumb>
  >(({ className, ...props }, ref): React.JSX.Element => (
    <SliderPrimitive.Thumb
      ref={ref}
      className={cn(
        "block size-4 shrink-0 rounded-full border border-primary-1 bg-primary-12 shadow-sm transition-[color,box-shadow] hover:ring-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-9 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
        className,
      )}
      {...props}
    />
  )),
  { displayName: SliderPrimitive.Thumb.displayName },
);

Slider.displayName = SliderPrimitive.Root.displayName;

export { Slider, SliderTrack, SliderRange, SliderThumb };
