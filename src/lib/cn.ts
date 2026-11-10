/**
 * src/lib/cn.ts
 * Shared Tailwind class merging and primitive React-child text helpers.
 */

/*//////////////////////////////////////////////////
IMPORTS
//////////////////////////////////////////////////*/

// API
import { clsx } from "clsx";
import { Children, isValidElement } from "react";
import { twMerge } from "tailwind-merge";

// TYPES
import type { ClassValue } from "clsx";
import type { ReactNode } from "react";

/*//////////////////////////////////////////////////
HELPERS
//////////////////////////////////////////////////*/

/**
 * Merges conditional class values and resolves conflicting Tailwind utilities.
 *
 * @param inputs - Class values accepted by `clsx`.
 * @return A class string with conflicting Tailwind utilities resolved.
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

/**
 * Converts primitive React children to text and descends into elements with truthy children.
 *
 * @param children - React children whose text should be collected.
 * @return Concatenated primitive text; non-text nodes and elements without truthy children contribute an empty string.
 */
export function transformChildrenToString(
  children: ReactNode | ReactNode[],
): string {
  if (!Array.isArray(children) && !isValidElement(children))
    return childToString(children);
  return Children.toArray(children).reduce(
    (t: string, c: ReactNode) =>
      t.concat(
        isValidElement<{ children?: ReactNode | ReactNode[] }>(c) &&
          Boolean(c.props.children)
          ? transformChildrenToString(c.props.children)
          : isValidElement(c)
            ? ""
            : childToString(c),
      ),
    "",
  );
}

/**
 * Converts a primitive React child to text.
 *
 * @param child - Child value to convert.
 * @return The text for a string, number, or bigint; an empty string otherwise.
 */
function childToString(child?: ReactNode): string {
  if (typeof child === "string") return child;
  if (typeof child === "number" || typeof child === "bigint")
    return child.toString();
  return "";
}
