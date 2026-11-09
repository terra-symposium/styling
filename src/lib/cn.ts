/**
 * src/lib/cn.ts
 */

/*//////////////////////////////////////////////////
IMPORTS
//////////////////////////////////////////////////*/

// API
import { clsx } from 'clsx';
import { isValidElement } from 'react';
import { twMerge } from 'tailwind-merge';

// COMPONENTS
import { Children } from 'react';

// TYPES
import type { ClassValue } from 'clsx';
import type { ReactNode } from 'react';

/*//////////////////////////////////////////////////
HELPERS
//////////////////////////////////////////////////*/

/**
 * Combines conditional class names and resolves conflicting Tailwind utilities.
 *
 * @param inputs - Class values to combine.
 * @return A merged class string with conflicting utilities resolved.
 */
export function cn(...inputs: ClassValue[]): string {
	return twMerge(clsx(inputs));
}

/**
 * Converts nested React children into a plain text string.
 *
 * @param children - React children to traverse.
 * @return The concatenated text content, excluding rendered elements without text children.
 */
export function transformChildrenToString(children: ReactNode | ReactNode[]): string {
  if (!Array.isArray(children) && !isValidElement(children)) return childToString(children);
  return Children.toArray(children).reduce((text: string, child: ReactNode) => text.concat(isValidElement<{ children?: ReactNode | ReactNode[] }>(child) && Boolean(child.props.children) ? transformChildrenToString(child.props.children) : isValidElement(child) ? '' : childToString(child)), '');
}

/**
 * Converts a primitive React child to text.
 *
 * @param child - Optional child value to convert.
 * @return The child's text, or an empty string for unsupported values.
 */
function childToString(child?: ReactNode): string {
  if (typeof child === 'string') return child;
  if (typeof child === 'number' || typeof child === 'bigint') return child.toString();
  return '';
}
