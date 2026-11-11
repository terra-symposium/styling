/**
 * Scrolling marquee text component.
 */

import { useLayoutEffect, useMemo, useRef, useState } from "react";
import type { ElementType, KeyboardEvent } from "react";
import { cn } from "../../lib/cn.js";

const COPIES = 8;
const SPEEDS = [0.86, 1.08, 0.93, 1.17, 0.98, 1.12, 0.9, 1.04];

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
 * Repeats text in animated rows, with optional pointer pause and auto sizing.
 *
 * @param props - Text, animation, interaction, and row layout options.
 *
 * @return A marquee that repeats the supplied terms across animated rows.
 */
export function Marquee(props: MarqueeProps): React.JSX.Element {
  const {
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
  } = props;
  const root = useRef<HTMLDivElement>(null);
  const [count, setCount] = useState(
    rows ?? (measureBeforeShow || randomizeDelay ? 1 : 100),
  );
  const [itemsPerSet, setItemsPerSet] = useState(COPIES);
  const [measured, setMeasured] = useState(false);
  const [randomOffsets, setRandomOffsets] = useState<number[]>([]);
  const randomOffsetsRef = useRef<number[]>([]);
  const [paused, setPaused] = useState(false);

  useLayoutEffect(() => {
    if (!root.current) return;
    const node = root.current;
    const update = (): void => {
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
      const item = node.querySelector<HTMLElement>("[data-marquee-item]");
      const itemWidth = item?.getBoundingClientRect().width ?? 0;
      const containerWidth = node.getBoundingClientRect().width;
      if (rowHeight <= 0 || itemWidth <= 0 || containerWidth <= 0) return;

      const nextCount =
        rows ??
        Math.max(
          1,
          Math.floor(containerHeight / rowHeight) + (fit ? 0 : 2),
        );
      const nextItemsPerSet = Math.max(
        2,
        Math.ceil(containerWidth / itemWidth) + 1,
      );

      setCount((current) => (current === nextCount ? current : nextCount));
      setItemsPerSet((current) =>
        current === nextItemsPerSet ? current : nextItemsPerSet,
      );
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
    };
    update();
    let active = true;
    requestAnimationFrame(() => {
      if (active) update();
    });
    const resize = new ResizeObserver(update);
    resize.observe(node);
    window.addEventListener("resize", update);
    void document.fonts?.ready.then(update);
    return () => {
      active = false;
      resize.disconnect();
      window.removeEventListener("resize", update);
    };
  }, [duration, fit, randomizeDelay, rows, separator, size, terms]);

  const rowTerms = useMemo(
    () =>
      Array.from({ length: count }, (_, index) => {
        const shuffled = [...terms];
        let state = (index + 1) * 0x9e3779b1;
        for (let j = shuffled.length - 1; j > 0; j--) {
          state = Math.imul(state ^ (state >>> 16), 0x45d9f3b);
          const k = (state >>> 0) % (j + 1);
          [shuffled[j], shuffled[k]] = [shuffled[k], shuffled[j]];
        }
        return shuffled.join(separator);
      }),
    [count, separator, terms],
  );

  const togglePaused = (): void => {
    if (pauseOnClick) setPaused((current) => !current);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>): void => {
    if (!pauseOnClick || (event.key !== "Enter" && event.key !== " ")) return;
    event.preventDefault();
    togglePaused();
  };

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
      {rowTerms.map((joinedTerms, index) => {
        const speed = Math.round(
          duration * itemsPerSet * SPEEDS[index % SPEEDS.length],
        );
        const rowReverse = reverse !== (alternate && index % 2 === 1);
        const rowDelay = randomizeDelay
          ? randomOffsets[index] ?? 0
          : ((index * 37) % 100) * speed / 100;
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
              {Array.from({ length: itemsPerSet * 2 }, (_, copy) => (
                <AsComp key={copy} className="inline">
                  <span data-marquee-item="true">
                    {"\u00a0"}
                    {joinedTerms}
                    {separator}
                  </span>
                </AsComp>
              ))}
            </span>
          </div>
        );
      })}
    </div>
  );
}
