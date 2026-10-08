# Styling rules

## Ownership

Use token-driven SCSS. `src/styles/tokens.scss` centralizes color, typography, spacing, breakpoint, radius, effect, and component tokens. `src/styles/base.scss` exposes semantic custom properties and base element rules. `src/styles/grid.scss` owns wrapper widths; layout, patterns, utilities, fonts, and mixins remain in their existing global files. Colocated SCSS modules own component and page internals.

Use explicit existing Sass imports and helpers. Keep the global foundation small. Reuse current components and patterns rather than importing the historical ABCDE blueprint or adding a utility framework.

## Spacing and sizing

- Use `tokens.fluid()` for fluid clamp values; keep the approved 767px–1366px interpolation range.
- Reuse top-level variables for section spacing, chrome/header/footer spacing, card, button, pill/tag and form padding, grid gaps, and content measures before adding local values.
- During CSS cleanup, snap to the nearest established `--space-*` or semantic spacing variable rather than preserving arbitrary pixel values.
- Keep wrapper widths owned by `.sm-wrapper`, `.md-wrapper`, and `.lg-wrapper`; do not duplicate wrapper `max-width` rules in modules.
- Structural sizing is valid when it expresses layout intent: `width: 100%`, `height: 100%`, `min-width: 0`, image sizing, accessibility-only sizing, text measures in `ch`, and grid wrapper max-widths.
- Use the existing breakpoint tokens and mixins. Keep container rhythm in gap/spacing rules rather than restoring inconsistent user-agent margins.

## Color, typography, and motion

Use semantic color properties and type roles from the existing token system. The [Figma variable export](portfolio-project-design-variables.json) supplies design input; the implemented Sass tokens control the site. Use the existing color-token check for changes.

Preserve keyboard focus, readable text, responsive behavior, and reduced-motion handling when changing animation or presentation. Check rendered results at the affected viewport sizes as required by [development](development.md).

The spacing-token cleanup baseline is commit `7489841` (`refactor(styles): consolidate spacing tokens`). Older [ABCDE SCSS research](../agent-generated-docs/project-scss-reference.md), migration plans, and Figma task notes are background references, not a competing architecture or mandatory backlog.
