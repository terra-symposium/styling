/**
 * Scrolling marquee text component.
 */

import { useLayoutEffect, useMemo, useRef, useState } from "react";
import type { ElementType, KeyboardEvent, ReactNode } from "react";
import { cn } from "../../lib/cn.js";

const SPEEDS = [0.86, 1.08, 0.93, 1.17, 0.98, 1.12, 0.9, 1.04];

/** Configuration for repeated text, animation, interaction, and responsive row layout. */
export type MarqueeProps = {
  reverse?: boolean;
  alternate?: boolean;
  duration?: number;
  delay?: number;
  ease?: string | true;
  pauseOnHover?: boolean;
  pauseOnClick?: boolean;
  className?: string;
  rowClassName?: string;
  size?: "sm" | "lg";
  as?: ElementType;
  terms?: string[];
  separator?: string;
  rows?: number;
  fit?: boolean;
  /** Wait to show the marquee until its responsive layout is measured. */
  measureBeforeShow?: boolean;
  /** Give each row a random starting offset that stays fixed as it resizes. */
  randomizeDelay?: boolean;
};

/**
 * Toggles a marquee's paused state using React's state updater contract.
 *
 * @param current - Current paused state.
 * @return The next paused state.
 */
function invertPauseState(current: boolean): boolean {
  return !current;
}

/**
 * Repeats text in animated rows, with optional pointer pause and auto sizing.
 *
 * @param reverse - Runs each row's animation in reverse.
 * @param alternate - Reverses every other row relative to the configured direction.
 * @param duration - Base track duration in milliseconds before row and width scaling.
 * @param delay - Initial animation delay in milliseconds.
 * @param ease - CSS timing function, or `true` to use the component's easing curve.
 * @param pauseOnHover - Pauses a row while the pointer is over it.
 * @param pauseOnClick - Enables click and keyboard pause controls on the root.
 * @param className - Additional classes applied to each row.
 * @param rowClassName - Additional classes applied to each row track container.
 * @param size - Text sizing preset for each row.
 * @param AsComp - Element type used to wrap each repeated term set.
 * @param terms - Text items shuffled deterministically for each row.
 * @param separator - Text inserted between adjacent terms and repeated sets.
 * @param rows - Fixed row count, or an automatically measured count when omitted.
 * @param fit - Uses the exact measured row count without extra overflow rows.
 * @param measureBeforeShow - Hides the marquee until its first layout measurement.
 * @param randomizeDelay - Gives each row a stable randomized animation offset.
 *
 * @return A marquee that repeats the supplied terms across animated rows.
 */
export function Marquee({
  reverse = false,
  alternate = false,
  duration = 400000,
  delay = 0,
  ease = "linear",
  pauseOnHover = false,
  pauseOnClick = true,
  className,
  rowClassName,
  size = "lg",
  as: AsComp = "span",
  terms = [],
  separator = " • ",
  rows,
  fit = false,
  measureBeforeShow = false,
  randomizeDelay = false,
}: MarqueeProps): React.JSX.Element {
  const root = useRef<HTMLDivElement>(null);
  const [count, setCount] = useState(
    rows ?? (measureBeforeShow || randomizeDelay ? 1 : 100),
  );
  const [itemsPerSet, setItemsPerSet] = useState(8);
  const [measured, setMeasured] = useState(false);
  const [randomOffsets, setRandomOffsets] = useState<number[]>([]);
  const randomOffsetsRef = useRef<number[]>([]);
  const [paused, setPaused] = useState(false);

  /**
   * Measures the marquee and keeps its row and item counts aligned with the available space.
   *
   * @return Cleanup for the layout effect, or `undefined` when the root element is not mounted.
   */
  function setupLayoutEffect(): (() => void) | undefined {
    if (!root.current) return;
    const node = root.current;
    /** Recalculates the number of rows, repeated terms, and stable offsets. */
    function updateLayout(): void {
      let containerHeight = node.clientHeight;
      for (
        let ancestor = node.parentElement;
        ancestor;
        ancestor = ancestor.parentElement
      ) {
        if (ancestor.clientHeight > 0) {
          containerHeight = Math.min(containerHeight, ancestor.clientHeight);
          break;
        }
      }
      const firstRow = node.firstElementChild as HTMLElement | null;
      const rowHeight = firstRow
        ? firstRow.getBoundingClientRect().height +
          Number.parseFloat(getComputedStyle(firstRow).marginBottom || "0")
        : 0;
      const itemWidth =
        node
          .querySelector<HTMLElement>("[data-marquee-item]")
          ?.getBoundingClientRect().width ?? 0;
      const containerWidth = node.getBoundingClientRect().width;
      if (rowHeight <= 0 || itemWidth <= 0 || containerWidth <= 0) return;

      const nextCount =
        rows ??
        Math.max(1, Math.floor(containerHeight / rowHeight) + (fit ? 0 : 2));
      const nextItemsPerSet = Math.max(
        2,
        Math.ceil(containerWidth / itemWidth) + 1,
      );

      setCount(nextCount);
      setItemsPerSet(nextItemsPerSet);
      if (randomizeDelay && randomOffsetsRef.current.length !== nextCount) {
        const nextOffsets = randomOffsetsRef.current.slice(0, nextCount);
        while (nextOffsets.length < nextCount) {
          const index = nextOffsets.length;
          const rowDuration =
            duration * nextItemsPerSet * SPEEDS[index % SPEEDS.length];
          nextOffsets.push(Math.random() * rowDuration);
        }
        randomOffsetsRef.current = nextOffsets;
        setRandomOffsets(nextOffsets);
      }
      setMeasured(true);
    }
    /** Runs one post-paint measurement if this effect has not been cleaned up. */
    function updateOnNextFrame(): void {
      if (active) updateLayout();
    }
    /** Disconnects the resize observer and listeners for this component instance. */
    function cleanupLayoutEffect(): void {
      active = false;
      resize.disconnect();
      window.removeEventListener("resize", updateLayout);
    }
    updateLayout();
    let active = true;
    requestAnimationFrame(updateOnNextFrame);
    const resize = new ResizeObserver(updateLayout);
    resize.observe(node);
    window.addEventListener("resize", updateLayout);
    void document.fonts?.ready.then(updateLayout);
    return cleanupLayoutEffect;
  }
  useLayoutEffect(setupLayoutEffect, [
    duration,
    fit,
    randomizeDelay,
    rows,
    separator,
    size,
    terms,
  ]);

  /** Creates deterministic term orderings for each visible marquee row. */
  function createRowTerms(): string[] {
    const rowValues: string[] = [];
    for (let index = 0; index < count; index++) {
      const shuffled = [...terms];
      let state = (index + 1) * 0x9e3779b1;
      for (let j = shuffled.length - 1; j > 0; j--) {
        state = Math.imul(state ^ (state >>> 16), 0x45d9f3b);
        const k = (state >>> 0) % (j + 1);
        [shuffled[j], shuffled[k]] = [shuffled[k], shuffled[j]];
      }
      rowValues.push(shuffled.join(separator));
    }
    return rowValues;
  }
  const rowTerms = useMemo(createRowTerms, [count, separator, terms]);

  /** Pauses or resumes the animation when click interaction is enabled. */
  function togglePaused(): void {
    if (pauseOnClick) setPaused(invertPauseState);
  }

  /** Handles keyboard activation for the marquee's button-like root. */
  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>): void {
    if (!pauseOnClick || (event.key !== "Enter" && event.key !== " ")) return;
    event.preventDefault();
    togglePaused();
  }

  /** Renders one animated track and its repeated term copies. */
  function renderRow(joinedTerms: string, index: number): React.JSX.Element {
    const speed = Math.round(
      duration * itemsPerSet * SPEEDS[index % SPEEDS.length],
    );
    const rowReverse = reverse !== (alternate && index % 2 === 1);
    const rowDelay = randomizeDelay
      ? (randomOffsets[index] ?? 0)
      : (((index * 37) % 100) * speed) / 100;
    const copies: ReactNode[] = [];
    for (let copy = 0; copy < itemsPerSet * 2; copy++) {
      copies.push(
        <AsComp key={copy} className="inline">
          <span data-marquee-item="true">
            {"\u00a0"}
            {joinedTerms}
            {separator}
          </span>
        </AsComp>,
      );
    }
    return (
      <div
        key={index}
        className={cn(
          "group relative shrink-0 select-none overflow-x-clip",
          size === "lg"
            ? "mb-4 text-4xl font-bold leading-normal"
            : "mb-0 text-sm font-semibold leading-tight tracking-tight sm:text-base",
          className,
          rowClassName,
        )}
        aria-hidden="true"
      >
        <span
          className={cn(
            pauseOnHover && "group-hover:[animation-play-state:paused]",
            pauseOnClick && "group-active:!paused",
            rowReverse && "[animation-direction:reverse]",
            "inline-flex whitespace-nowrap [will-change:transform] motion-reduce:[animation-play-state:paused]",
          )}
          data-marquee-track="true"
          style={{
            animation: `styling-marquee-slide ${speed}ms ${delay - rowDelay}ms ${ease === true ? "cubic-bezier(0.46,0.03,0.52,0.96)" : ease} infinite`,
            animationPlayState: paused ? "paused" : undefined,
          }}
        >
          {copies}
        </span>
      </div>
    );
  }

  return (
    <div
      ref={root}
      className="relative flex size-full flex-col"
      style={{
        visibility:
          (measureBeforeShow || randomizeDelay) && !measured
            ? "hidden"
            : undefined,
      }}
      role={pauseOnClick ? "button" : undefined}
      tabIndex={pauseOnClick ? 0 : undefined}
      aria-label={pauseOnClick ? "Toggle marquee animation" : undefined}
      aria-pressed={pauseOnClick ? paused : undefined}
      onClick={togglePaused}
      onKeyDown={handleKeyDown}
    >
      {rowTerms.map(renderRow)}
    </div>
  );
}
