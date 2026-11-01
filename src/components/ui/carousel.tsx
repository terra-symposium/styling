/**
 * astro/src/components/ui/carousel.tsx
 * https://ui.shadcn.com/docs/components/carousel
 */

/*//////////////////////////////////////////////////
IMPORTS
//////////////////////////////////////////////////*/

// API
import useEmblaCarousel from "embla-carousel-react";
import { cn } from "../../lib/cn.js";

// COMPONENTS
import * as React from "react";
import {
  ArrowLeft as ArrowLeftIcon,
  ArrowRight as ArrowRightIcon,
} from "@carbon/icons-react";
import { Button } from "./button.js";

// TYPES
import type { CarouselApi, CarouselCtxProps, CarouselProps } from "./types.js";

/*//////////////////////////////////////////////////
LOCAL TYPES
//////////////////////////////////////////////////*/

const CarouselCtx = React.createContext<CarouselCtxProps | null>(null);
CarouselCtx.displayName = "CarouselContext";
/**
 * Accessible carousel region with Embla navigation state and left/right arrow-key controls.
 *
 * @param orientation - Scroll axis, either horizontal or vertical.
 * @param opts - Embla carousel options.
 * @param setApi - Optional callback to expose the Embla API to callers.
 * @param plugins - Optional list of Embla plugins.
 * @param className - Optional style overrides for the root element.
 *
 * @returns A carousel region that provides navigation state to its children.
 */
const Carousel = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & CarouselProps
>(
  (
    {
      orientation = "horizontal",
      opts,
      setApi,
      plugins,
      className,
      children,
      ...props
    },
    ref,
  ): React.JSX.Element => {
    const [carouselRef, api] = useEmblaCarousel(
      { ...opts, axis: orientation === "horizontal" ? "x" : "y" },
      plugins,
    );
    const [canScrollPrev, setCanScrollPrev] = React.useState(false);
    const [canScrollNext, setCanScrollNext] = React.useState(false);
    const onSelect = React.useCallback((api: CarouselApi) => {
      if (!api) return;
      setCanScrollPrev(api.canScrollPrev());
      setCanScrollNext(api.canScrollNext());
    }, []);
    const scrollPrev = React.useCallback(() => {
      api?.scrollPrev();
    }, [api]);
    const scrollNext = React.useCallback(() => {
      api?.scrollNext();
    }, [api]);
    React.useEffect(() => {
      if (!api || !setApi) return;
      setApi(api);
    }, [api, setApi]);
    React.useEffect(() => {
      if (!api) return;
      onSelect(api);
      api.on("reInit", onSelect);
      api.on("select", onSelect);
      return () => {
        api?.off("select", onSelect);
      };
    }, [api, onSelect]);
    return (
      <CarouselCtx.Provider
        value={{
          carouselRef,
          api,
          opts,
          orientation:
            orientation || (opts?.axis === "y" ? "vertical" : "horizontal"),
          scrollPrev,
          scrollNext,
          canScrollPrev,
          canScrollNext,
        }}
      >
        <div
          ref={ref}
          onKeyDownCapture={React.useCallback(
            (e: React.KeyboardEvent<HTMLDivElement>) => {
              if (e.key === "ArrowLeft") {
                e.preventDefault();
                scrollPrev();
              } else if (e.key === "ArrowRight") {
                e.preventDefault();
                scrollNext();
              }
            },
            [scrollPrev, scrollNext],
          )}
          className={cn("relative", className)}
          role="region"
          aria-roledescription="carousel"
          aria-label={props["aria-label"] ?? "Carousel"}
          {...props}
        >
          {children}
        </div>
      </CarouselCtx.Provider>
    );
  },
);
/**
 * Container for all carousel items, responsible for overflow and track layout.
 *
 * @returns A scrollable track region controlled by Embla.
 */
const CarouselContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref): React.JSX.Element => {
  const { carouselRef, orientation } = useCarousel();
  return (
    <div
      ref={carouselRef}
      className={cn(
        orientation === "horizontal"
          ? "overflow-x-clip overflow-y-visible"
          : "overflow-y-clip overflow-x-visible",
      )}
    >
      <div
        ref={ref}
        className={cn(
          "flex",
          orientation === "horizontal" ? "-ml-4" : "-mt-4 flex-col",
          className,
        )}
        {...props}
      />
    </div>
  );
});
/**
 * Single slide within the carousel.
 *
 * @returns A group element representing an individual slide.
 */
const CarouselItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref): React.JSX.Element => {
  const { orientation } = useCarousel();
  return (
    <div
      ref={ref}
      role="group"
      aria-roledescription="slide"
      className={cn(
        "min-w-0 shrink-0 grow-0 basis-full",
        orientation === "horizontal" ? "pl-4" : "pt-4",
        className,
      )}
      {...props}
    />
  );
});
/**
 * Button control for navigating to the prev carousel slide.
 *
 * @param className - Optional style overrides for the button.
 * @param variant - Button variant used for the control.
 * @param size - Button size used for the control.
 *
 * @returns A button that moves the carousel to the previous slide.
 */
const CarouselPrevious = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<typeof Button>
>(
  (
    {
      className,
      variant = "outline",
      size = "icon",
      "aria-label": ariaLabel = "Previous slide",
      ...props
    },
    ref,
  ): React.JSX.Element => {
    const { orientation, scrollPrev, canScrollPrev } = useCarousel();
    return (
      <Button
        ref={ref}
        variant={variant}
        size={size}
        className={cn(
          "absolute size-8 rounded-lg",
          orientation === "horizontal"
            ? "-left-12 top-1/2 -translate-y-1/2"
            : "-top-12 left-1/2 -translate-x-1/2 rotate-90",
          className,
        )}
        disabled={!canScrollPrev}
        onClick={scrollPrev}
        aria-label={ariaLabel}
        {...props}
      >
        <ArrowLeftIcon className="size-4" aria-hidden="true" />
      </Button>
    );
  },
);
/**
 * Button control for navigating to the next carousel slide.
 *
 * @param className - Optional style overrides for the button.
 * @param variant - Button variant used for the control.
 * @param size - Button size used for the control.
 *
 * @returns A button that moves the carousel to the next slide.
 */
const CarouselNext = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<typeof Button>
>(
  (
    {
      className,
      variant = "outline",
      size = "icon",
      "aria-label": ariaLabel = "Next slide",
      ...props
    },
    ref,
  ): React.JSX.Element => {
    const { orientation, scrollNext, canScrollNext } = useCarousel();
    return (
      <Button
        ref={ref}
        variant={variant}
        size={size}
        className={cn(
          "absolute size-8 rounded-lg",
          orientation === "horizontal"
            ? "-right-12 top-1/2 -translate-y-1/2"
            : "-bottom-12 left-1/2 -translate-x-1/2 rotate-90",
          className,
        )}
        disabled={!canScrollNext}
        onClick={scrollNext}
        aria-label={ariaLabel}
        {...props}
      >
        <ArrowRightIcon className="size-4" aria-hidden="true" />
      </Button>
    );
  },
);

/*//////////////////////////////////////////////////
COMPONENTS
//////////////////////////////////////////////////*/

/**
 * Shared hook for accessing the current carousel context.
 *
 * @return The active carousel API, navigation state, and scroll helpers.
 *
 * @throws If used outside of a mounted `Carousel` provider.
 */
function useCarousel(): CarouselCtxProps {
  const ctx = React.useContext(CarouselCtx);
  if (!ctx) throw new Error("useCarousel must be used within a <Carousel />");
  return ctx;
}
Carousel.displayName = "Carousel";
CarouselContent.displayName = "CarouselContent";
CarouselItem.displayName = "CarouselItem";
CarouselPrevious.displayName = "CarouselPrevious";
CarouselNext.displayName = "CarouselNext";
export {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
  useCarousel,
};
