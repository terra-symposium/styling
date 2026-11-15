# Terra Styling and Accessibility

This adds Terra Symposium's headed-browser evidence requirement to the shared `ui` skill. Follow the shared skill for general hierarchy, accessibility, and interaction guidance; use this for the repository's visual verification bar.

## Required browser evidence

1. Open the affected route in a headed browser. Wait for data and media to settle, inspect the requested desktop size and every affected responsive transition, then inspect the accessibility tree.
2. Interact with a representative control or navigation path when the UI is interactive.
3. Reject overlap, clipping, hidden or unreachable controls, unreadable labels, colour-only status, or mismatches between visual and accessible states. For graph/canvas views, inspect both fit-to-view and readable zoom.
4. Run narrow relevant checks and `git diff --check`.

If a headed browser is unavailable, report the exact gap; source checks or a loading/error screenshot do not prove visual completion.

## Handoff

State the route, viewport, screenshot findings, accessibility findings, checks run, and remaining runtime constraints. Separate browser evidence from source and type checks.
