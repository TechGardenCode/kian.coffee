# @kian.coffee/beans

Design system for kian.coffee. Tokens, styles, framework-agnostic core, and Angular components.

Class prefix: `kc-`. CSS-tier components must render correctly as bare HTML before Angular wraps them.

See `docs/design-system/Components.html` § 14 for the package layout spec, and `docs/design-system/Design System.html` for the visual reference.

## Layout

- `src/tokens/` — `tokens.css` (the source of truth) and `tokens.ts` (TS export for runtime reads — charts, canvas).
- `src/styles/` — per-component `.css` files plus `index.css`.
- `src/core/` — framework-agnostic TS. No Angular imports. Houses `defineVariants()` and behaviors.
- `src/components/` — Angular components and directives that wrap the CSS-tier styles.

## Consume

Import the styles entry once at the consumer's global stylesheet — it cascades tokens, then every component CSS that has shipped:

```css
@import "@kian.coffee/beans/styles/index.css";
```

Then use either layer:

```html
<!-- bare HTML, no Angular -->
<button class="kc-btn kc-btn--primary">Save</button>
```

```ts
// Angular sugar over the class contract
import { ButtonComponent } from "@kian.coffee/beans";
```

## Build

```sh
npm run build:lib
```

Output lands in `dist/coffee-beans/`.
