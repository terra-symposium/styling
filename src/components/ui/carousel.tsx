/**
 * src/components/ui/carousel.tsx
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
/** Renders an accessible Embla carousel and publishes its navigation state.
 * @param carouselProps - Root attributes, orientation, plugins, and API callback.
 * @param ref - Ref forwarded to the outer carousel region.
 * @return A carousel region with context for its child controls.
 */
function CarouselRender(
  carouselProps: React.HTMLAttributes<HTMLDivElement> & CarouselProps,
  ref: React.ForwardedRef<HTMLDivElement>,
): React.JSX.Element {
  const {
    orientation = "horizontal",
    opts,
    setApi,
    plugins,
    className,
    children,
    ...props
  } = carouselProps;
  const [carouselRef, api] = useEmblaCarousel(
    { ...opts, axis: orientation === "horizontal" ? "x" : "y" },
    plugins,
  );
  const [canScrollPrev, setCanScrollPrev] = React.useState(false);
  const [canScrollNext, setCanScrollNext] = React.useState(false);
  /** Updates previous and next availability after Embla selection changes.
   * @param api - Active Embla API.
   * @return Nothing; both control availability states are refreshed.
   */
  function updateCarouselSelection(api: CarouselApi): void {
    if (!api) return;
    setCanScrollPrev(api.canScrollPrev());
    setCanScrollNext(api.canScrollNext());
  }
  const onSelect = React.useCallback(updateCarouselSelection, []);
  /** Moves to the previous slide when Embla is available. */
  function moveToPreviousSlide(): void {
    api?.scrollPrev();
  }
  const scrollPrev = React.useCallback(moveToPreviousSlide, [api]);
  /** Moves to the next slide when Embla is available. */
  function moveToNextSlide(): void {
    api?.scrollNext();
  }
  const scrollNext = React.useCallback(moveToNextSlide, [api]);
  /** Publishes the mounted API to the optional caller callback. */
  function publishCarouselApi(): void {
    if (!api || !setApi) return;
    setApi(api);
  }
  React.useEffect(publishCarouselApi, [api, setApi]);
  /** Subscribes to Embla selection updates and returns listener cleanup.
   * @return A cleanup callback when Embla is available.
   */
  function subscribeToCarouselSelection(): (() => void) | undefined {
    if (!api) return;
    onSelect(api);
    api.on("reInit", onSelect);
    api.on("select", onSelect);
    return removeCarouselSelectionListener;
  }
  /** Removes the Embla selection listener when the carousel unmounts. */
  function removeCarouselSelectionListener(): void {
    api?.off("select", onSelect);
  }
  React.useEffect(subscribeToCarouselSelection, [api, onSelect]);
  /** Handles arrow-key navigation within the carousel region.
   * @param event - Captured keyboard event.
   * @return Nothing; horizontal arrows move the carousel and prevent default.
   */
  function handleCarouselKeyDown(
    event: React.KeyboardEvent<HTMLDivElement>,
  ): void {
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      scrollPrev();
    } else if (event.key === "ArrowRight") {
      event.preventDefault();
      scrollNext();
    }
  }
  const onCarouselKeyDown = React.useCallback(handleCarouselKeyDown, [
    scrollPrev,
    scrollNext,
  ]);
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
        onKeyDownCapture={onCarouselKeyDown}
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
}
/** Accessible carousel region with Embla navigation state and arrow-key controls. */
const Carousel = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & CarouselProps
>(CarouselRender);
/** Renders the scrollable carousel track controlled by Embla.
 * @param contentProps - Track attributes and child slides.
 * @param ref - Ref forwarded to the track element.
 * @return A track inside the Embla viewport wrapper.
 */
function renderCarouselContent(
  contentProps: React.HTMLAttributes<HTMLDivElement>,
  ref: React.ForwardedRef<HTMLDivElement>,
): React.JSX.Element {
  const { className, ...props } = contentProps;
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
}

/**
 * Container for all carousel items, responsible for overflow and track layout.
 *
 * @returns A scrollable track region controlled by Embla.
 */
const CarouselContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(renderCarouselContent);
/** Renders one slide with the current carousel orientation spacing.
 * @param itemProps - Slide attributes and child content.
 * @param ref - Ref forwarded to the slide element.
 * @return A grouped carousel slide.
 */
function renderCarouselItem(
  itemProps: React.HTMLAttributes<HTMLDivElement>,
  ref: React.ForwardedRef<HTMLDivElement>,
): React.JSX.Element {
  const { className, ...props } = itemProps;
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
}

/**
 * Single slide within the carousel.
 *
 * @returns A group element representing an individual slide.
 */
const CarouselItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(renderCarouselItem);
/** Renders the control that moves Embla to its previous slide.
 * @param buttonProps - Button attributes, label, and variant options.
 * @param ref - Ref forwarded to the navigation button.
 * @return A previous-slide button disabled at the start of the carousel.
 */
function renderCarouselPrevious(
  buttonProps: React.ComponentProps<typeof Button>,
  ref: React.ForwardedRef<HTMLButtonElement>,
): React.JSX.Element {
  const {
    className,
    variant = "outline",
    size = "icon",
    "aria-label": ariaLabel = "Previous slide",
    ...props
  } = buttonProps;
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
}

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
>(renderCarouselPrevious);
/** Renders the control that moves Embla to its next slide.
 * @param buttonProps - Button attributes, label, and variant options.
 * @param ref - Ref forwarded to the navigation button.
 * @return A next-slide button disabled at the end of the carousel.
 */
function renderCarouselNext(
  buttonProps: React.ComponentProps<typeof Button>,
  ref: React.ForwardedRef<HTMLButtonElement>,
): React.JSX.Element {
  const {
    className,
    variant = "outline",
    size = "icon",
    "aria-label": ariaLabel = "Next slide",
    ...props
  } = buttonProps;
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
}

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
>(renderCarouselNext);

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
