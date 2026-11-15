---
name: ui
description: Review Terra UI clarity, accessibility, and responsiveness.
metadata:
  related-files:
    - src/components/ui/variants.ts
---

# UI

Use this skill for interface design, styling, interaction, and responsive review.

## Workflow

1. Read repository UI guidance. Inspect owning components, routes, and shared patterns.
2. Preserve the product's design language unless redesign is requested.
3. Build hierarchy with layout, spacing, size, weight, and contrast.
4. Use semantic controls and accessible names. Preserve keyboard order and visible focus.
5. Check states, breakpoints, overflow, clipping, and content density.
6. Verify the actual route in a browser when visual behavior matters.

For Styling browser evidence follow [accessibility](references/browser-accessibility.md).
For responsive layout changes, screenshot-led audits, and mobile review follow
[responsive layout](references/responsive-layout.md). Identify the actual route,
owning components, viewport matrix, and browser evidence before claiming visual
completion; source checks alone cannot establish rendered geometry.

## Report

State the route, viewport, evidence, checks, and gaps. Separate browser evidence from source checks.
