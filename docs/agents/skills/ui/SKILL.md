---
name: ui
description: Review Terra UI clarity, accessibility, and responsiveness.
metadata:
  related-files:
    - src/components/ui/variants.ts
skill: true
---

# UI

Use this skill for interface design, styling, interaction, and responsive review.

## Workflow

1. Read [Terra design language](references/terra-design-language.md) before designing any Terra surface or artifact. Inspect owning components, routes, and shared patterns.
2. Preserve the product's design language unless redesign is requested.
3. Build hierarchy with layout, spacing, size, weight, and contrast.
4. Use semantic controls and accessible names. Preserve keyboard order and visible focus.
5. Check states, breakpoints, overflow, clipping, and content density.
6. Verify the actual route in a browser when visual behavior matters. For Office templates, render every page or slide and check the file in a compatible editor.

For Styling browser evidence follow [accessibility](references/browser-accessibility.md). For responsive layout changes, screenshot-led audits, and mobile review follow [responsive layout](references/responsive-layout.md). Identify the actual route, owning components, viewport matrix, and browser evidence before claiming visual completion; source checks alone cannot establish rendered geometry.

## Report

State the route, viewport, evidence, checks, and gaps. Separate browser evidence from source checks.
