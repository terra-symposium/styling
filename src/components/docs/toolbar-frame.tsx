/**
 * src/components/docs/toolbar-frame.tsx
 * Shared sticky toolbar wrapper used across Docs hosts.
 * https://ui.shadcn.com/docs/components
 */

/*//////////////////////////////////////////////////
IMPORTS
//////////////////////////////////////////////////*/

// TYPES
import type { ReactNode } from 'react';

/*//////////////////////////////////////////////////
COMPONENTS
//////////////////////////////////////////////////*/

// DOCS TOOLBAR
/**
 * Provides the shared sticky frame for toolbars in all Docs hosts.
 *
 * @param children - Toolbar content to place inside the frame.
 *
 * @return A sticky, print-hidden toolbar frame.
 */
export function DocsToolbarFrame({ children }: { children: ReactNode }) {
	return (
		<div
			className='docs-toolbar-scroll not-prose pointer-events-auto sticky top-10 isolate z-50 -mx-3 -mt-5 mb-5 w-[calc(100%+1.5rem)] max-w-[calc(100%+1.5rem)] overflow-visible text-primary-12 print:hidden'
			data-docs-toolbar-frame
			data-docs-toolbar-scroll
		>
			<div aria-hidden='true' className='docs-toolbar-backdrop pointer-events-none absolute -inset-x-4 -bottom-12 -top-16 z-0' />
			<div className='relative z-10 rounded-lg border border-primary-6 bg-primary-3'>
				<div
					className='mdxeditor-toolbar not-prose relative z-10 box-border flex w-full min-w-0 flex-wrap items-center justify-between gap-1.5 gap-x-3 px-2 py-1 text-primary-12 print:hidden'
					data-docs-main-toolbar
				>
					{children}
				</div>
			</div>
		</div>
	);
}
