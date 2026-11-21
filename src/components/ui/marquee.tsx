/**
 * src/components/ui/marquee.tsx
 */
/*//////////////////////////////////////////////////
IMPORTS
//////////////////////////////////////////////////*/

/**
 * Scrolling marquee text component.
 */

import { useLayoutEffect, useMemo, useRef, useState } from 'react';
import type { ElementType, KeyboardEvent, PointerEvent, ReactNode } from 'react';
import { cn } from '../../lib/cn.js';

const SPEEDS = [0.86, 1.08, 0.93, 1.17, 0.98, 1.12, 0.9, 1.04];

/**
 * Configuration for repeated text, animation, interaction, and responsive row layout.
 */
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
	size?: 'sm' | 'lg';
	as?: ElementType;
	terms?: string[];
	separator?: string;
	rows?: number;
	fit?: boolean;
	/**
	 * Wait to show the marquee until its responsive layout is measured.
	 */
	measureBeforeShow?: boolean;
	/**
	 * Give each row a random starting offset that stays fixed as it resizes.
	 */
	randomizeDelay?: boolean;
};

/**
 * Repeats text in animated rows, with optional pointer pause and auto sizing.
 *
 * @param reverse - Runs each row's animation in reverse.
 * @param alternate - Reverses every other row relative to the configured direction.
 * @param duration - Base track duration in milliseconds before row and width scaling.
 * @param delay - Initial animation delay in milliseconds.
 * @param ease - CSS timing function, or `true` to use the component's easing curve.
 * @param pauseOnHover - Pauses a row while the pointer is over it.
 * @param pauseOnClick - Pauses only the pressed row until pointer or keyboard release.
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
	ease = 'linear',
	pauseOnHover = false,
	pauseOnClick = true,
	className,
	rowClassName,
	size = 'lg',
	as: AsComp = 'span',
	terms = [],
	separator = ' • ',
	rows,
	fit = false,
	measureBeforeShow = false,
	randomizeDelay = false,
}: MarqueeProps): React.JSX.Element {
	const root = useRef<HTMLDivElement>(null);
	const [count, setCount] = useState(rows ?? (measureBeforeShow || randomizeDelay ? 1 : 100));
	const [itemsPerSet, setItemsPerSet] = useState(8);
	const [measured, setMeasured] = useState(false);
	const [randomOffsets, setRandomOffsets] = useState<number[]>([]);
	const randomOffsetsRef = useRef<number[]>([]);
	const [heldRow, setHeldRow] = useState<number | null>(null);

	// hygiene-ignore single-use -- Keep setupLayoutEffect as a named declaration so its authored TSDoc stays attached. TSDoc: Measures the marquee and keeps its row and item counts aligned with the available space.
	/**
	 * Measures the marquee and keeps its row and item counts aligned with the available space.
	 *
	 * @return Cleanup for the layout effect, or `undefined` when the root element is not mounted.
	 */
	function setupLayoutEffect(): (() => void) | undefined {
		if (!root.current) return;
		const node = root.current;
		/**
		 * Recalculates the number of rows, repeated terms, and stable offsets.
		 */
		function updateLayout(): void {
			let containerHeight = node.clientHeight;
			for (let ancestor = node.parentElement; ancestor; ancestor = ancestor.parentElement) {
				if (ancestor.clientHeight > 0) {
					containerHeight = Math.min(containerHeight, ancestor.clientHeight);
					break;
				}
			}
			const firstRow = node.firstElementChild as HTMLElement | null;
			const rowHeight = firstRow ? firstRow.getBoundingClientRect().height + Number.parseFloat(getComputedStyle(firstRow).marginBottom || '0') : 0;
			const itemWidth = node.querySelector<HTMLElement>('[data-marquee-item]')?.getBoundingClientRect().width ?? 0;
			const containerWidth = node.getBoundingClientRect().width;
			if (rowHeight <= 0 || itemWidth <= 0 || containerWidth <= 0) return;

			const nextCount = rows ?? Math.max(1, Math.floor(containerHeight / rowHeight) + (fit ? 0 : 2));
			const nextItemsPerSet = Math.max(2, Math.ceil(containerWidth / itemWidth) + 1);

			setCount(nextCount);
			setItemsPerSet(nextItemsPerSet);
			if (randomizeDelay && randomOffsetsRef.current.length !== nextCount) {
				const nextOffsets = randomOffsetsRef.current.slice(0, nextCount);
				while (nextOffsets.length < nextCount) {
					nextOffsets.push(Math.random() * duration * nextItemsPerSet * SPEEDS[nextOffsets.length % SPEEDS.length]);
				}
				randomOffsetsRef.current = nextOffsets;
				setRandomOffsets(nextOffsets);
			}
			setMeasured(true);
		}
		// hygiene-ignore single-use -- Keep updateOnNextFrame as a named declaration so its authored TSDoc stays attached. TSDoc: Runs one post-paint measurement if this effect has not been cleaned up.
		/**
		 * Runs one post-paint measurement if this effect has not been cleaned up.
		 */
		function updateOnNextFrame(): void {
			if (active) updateLayout();
		}
		// hygiene-ignore single-use -- Keep cleanupLayoutEffect as a named declaration so its authored TSDoc stays attached. TSDoc: Disconnects the resize observer and listeners for this component instance.
		/**
		 * Disconnects the resize observer and listeners for this component instance.
		 */
		function cleanupLayoutEffect(): void {
			active = false;
			resize.disconnect();
			window.removeEventListener('resize', updateLayout);
		}
		updateLayout();
		let active = true;
		requestAnimationFrame(updateOnNextFrame);
		const resize = new ResizeObserver(updateLayout);
		resize.observe(node);
		window.addEventListener('resize', updateLayout);
		void document.fonts?.ready.then(updateLayout);
		return cleanupLayoutEffect;
	}
	useLayoutEffect(setupLayoutEffect, [duration, fit, randomizeDelay, rows, separator, size, terms]);

	// hygiene-ignore single-use -- Keep createRowTerms as a named declaration so its authored TSDoc stays attached. TSDoc: Creates a repeatable shuffled term string for each visible marquee row.
	/**
	 * Creates a repeatable shuffled term string for each visible marquee row.
	 *
	 * @return One separator-joined term ordering for every visible row.
	 */
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
	// hygiene-ignore single-use -- Keep row text memoized at this hook position so rerenders preserve shuffled terms.
	const rowTerms = useMemo(createRowTerms, [count, separator, terms]);

	// hygiene-ignore single-use -- Keep holdRow as a named React event handler so pointer capture and held-row updates remain one ordered pointer event boundary.
	/**
	 * Holds the selected row while its pointer is pressed.
	 */
	function holdRow(event: PointerEvent<HTMLDivElement>, index: number): void {
		if (!pauseOnClick || (event.pointerType === 'mouse' && event.button !== 0)) return;
		event.currentTarget.setPointerCapture(event.pointerId);
		setHeldRow(index);
	}

	/**
	 * Releases a row after its pointer is lifted or cancelled.
	 */
	function releaseRow(index: number): void {
		setHeldRow(current => (current === index ? null : current));
	}

	// hygiene-ignore single-use -- Keep holdRowWithKeyboard as a named React event handler so key filtering, default prevention, and held-row updates remain one ordered keyboard event boundary.
	/**
	 * Holds a focused row while Enter or Space is down.
	 */
	function holdRowWithKeyboard(event: KeyboardEvent<HTMLDivElement>, index: number): void {
		if (!pauseOnClick || (event.key !== 'Enter' && event.key !== ' ')) return;
		event.preventDefault();
		setHeldRow(index);
	}

	// hygiene-ignore single-use -- Keep releaseRowWithKeyboard as a named React event handler so key filtering, default prevention, and held-row release remain one ordered keyboard event boundary.
	/**
	 * Releases a focused row when Enter or Space is lifted.
	 */
	function releaseRowWithKeyboard(event: KeyboardEvent<HTMLDivElement>, index: number): void {
		if (event.key !== 'Enter' && event.key !== ' ') return;
		event.preventDefault();
		releaseRow(index);
	}

	/**
	 * Renders one animated track and its repeated term copies.
	 *
	 * @param joinedTerms - Separator-joined terms displayed along this track.
	 * @param index - Zero-based row position used to calculate motion and direction.
	 * @return The animated track for one visible marquee row.
	 */
	function renderRow(joinedTerms: string, index: number): React.JSX.Element {
		const speed = Math.round(duration * itemsPerSet * SPEEDS[index % SPEEDS.length]);
		const copies: ReactNode[] = [];
		for (let copy = 0; copy < itemsPerSet * 2; copy++) {
			copies.push(
				<AsComp key={copy} className='inline'>
					<span data-marquee-item='true'>
						{'\u00a0'}
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
					'group relative shrink-0 select-none overflow-x-clip',
					size === 'lg' ? 'mb-4 text-4xl font-bold leading-normal' : 'mb-0 text-sm font-semibold leading-tight tracking-tight sm:text-base',
					className,
					rowClassName,
				)}
				role={pauseOnClick ? 'button' : undefined}
				tabIndex={pauseOnClick ? 0 : undefined}
				aria-label={pauseOnClick ? `Hold to pause marquee row ${index + 1}` : undefined}
				aria-pressed={pauseOnClick ? heldRow === index : undefined}
				aria-hidden={pauseOnClick ? undefined : true}
				onPointerDown={event => holdRow(event, index)}
				onPointerUp={() => releaseRow(index)}
				onPointerCancel={() => releaseRow(index)}
				onLostPointerCapture={() => releaseRow(index)}
				onKeyDown={event => holdRowWithKeyboard(event, index)}
				onKeyUp={event => releaseRowWithKeyboard(event, index)}
				onBlur={() => releaseRow(index)}
			>
				<span
					className={cn(
						pauseOnHover && 'group-hover:[animation-play-state:paused]',
						reverse !== (alternate && index % 2 === 1) && '[animation-direction:reverse]',
						'inline-flex whitespace-nowrap [will-change:transform] motion-reduce:[animation-play-state:paused]',
					)}
					data-marquee-track='true'
					style={{
						animation: `styling-marquee-slide ${speed}ms ${delay - (randomizeDelay ? (randomOffsets[index] ?? 0) : (((index * 37) % 100) * speed) / 100)}ms ${ease === true ? 'cubic-bezier(0.46,0.03,0.52,0.96)' : ease} infinite`,
						animationPlayState: heldRow === index ? 'paused' : undefined,
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
			className='relative flex size-full flex-col'
			style={{
				visibility: (measureBeforeShow || randomizeDelay) && !measured ? 'hidden' : undefined,
			}}
		>
			{rowTerms.map(renderRow)}
		</div>
	);
}
