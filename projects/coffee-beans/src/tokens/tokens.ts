/**
 * Mirrors `tokens.css` for runtime reads (charts, canvas, JS-driven layout).
 * `tokens.css` is the source of truth for rendered styles — keep this file in sync.
 */

export const palette = {
  cream: {
    50: '#faf3e7',
    100: '#f6ecdc',
    200: '#ece0d1',
    300: '#e4d4ba',
    400: '#d9c4a9',
    500: '#c9b193',
    600: '#b89a78',
  },
  ink: {
    100: '#e8d8c2',
    300: '#b48a64',
    500: '#6b4a2b',
    700: '#4a2e17',
    900: '#2a1a0c',
  },
  roast: {
    700: '#3d3023',
    800: '#2e241a',
    850: '#241d15',
    900: '#1c1612',
    950: '#15100b',
  },
  taupe: {
    300: '#c0a892',
    400: '#a88871',
    500: '#8a6e58',
    600: '#7a6250',
  },
  accent: {
    50: '#f7e8d8',
    100: '#efd0b1',
    200: '#e0a978',
    300: '#d28b4f',
    400: '#c67a3f',
    500: '#a8632b',
    600: '#8d5020',
    700: '#6e3d18',
    800: '#4f2c11',
  },
  espresso: '#38220f',
  foam: '#dfd1b5',
} as const;

export const radii = {
  xs: '4px',
  sm: '6px',
  md: '8px',
  lg: '12px',
  xl: '20px',
  pill: '9999px',
} as const;

export const space = {
  1: '4px',
  2: '8px',
  3: '12px',
  4: '16px',
  5: '24px',
  6: '32px',
  7: '48px',
  8: '64px',
  9: '96px',
  10: '128px',
} as const;

export const fonts = {
  display: '"Fraunces", ui-serif, Georgia, serif',
  sans: '"Inter", ui-sans-serif, system-ui, sans-serif',
  mono: '"JetBrains Mono", ui-monospace, "SFMono-Regular", monospace',
} as const;

export const motion = {
  fast: '150ms',
  normal: '250ms',
} as const;

export const shadows = {
  light: {
    xs: '0 1px 2px rgba(42, 26, 12, 0.06)',
    sm: '0 2px 6px rgba(42, 26, 12, 0.08)',
    md: '0 8px 20px -8px rgba(42, 26, 12, 0.18)',
    lg: '0 24px 48px -16px rgba(42, 26, 12, 0.28)',
    inset: 'inset 0 1px 0 rgba(255, 255, 255, 0.4)',
  },
  dark: {
    xs: '0 1px 2px rgba(0, 0, 0, 0.40)',
    sm: '0 2px 6px rgba(0, 0, 0, 0.45)',
    md: '0 8px 20px -8px rgba(0, 0, 0, 0.55)',
    lg: '0 24px 48px -16px rgba(0, 0, 0, 0.65)',
    inset: 'inset 0 1px 0 rgba(255, 255, 255, 0.04)',
  },
} as const;

export const semantic = {
  light: {
    bgBase: palette.cream[100],
    bgRaised: palette.cream[50],
    bgSunken: palette.cream[200],
    bgInverse: palette.roast[900],

    textPrimary: palette.ink[900],
    textSecondary: palette.ink[700],
    textMuted: palette.ink[500],
    textSubtle: palette.taupe[600],
    textOnAccent: palette.cream[50],
    textInverse: palette.cream[100],

    borderSubtle: 'rgba(42, 26, 12, 0.10)',
    borderDefault: 'rgba(42, 26, 12, 0.18)',
    borderStrong: 'rgba(42, 26, 12, 0.32)',

    accent: palette.accent[500],
    accentHover: palette.accent[600],
    accentTint: 'rgba(168, 99, 43, 0.10)',
    accentRing: 'rgba(168, 99, 43, 0.45)',

    danger: '#cf4b3a',
    dangerRing: 'rgba(207, 75, 58, 0.45)',

    focusRing: 'rgba(168, 99, 43, 0.45)',
    selectionBg: 'rgba(168, 99, 43, 0.25)',
  },
  dark: {
    bgBase: palette.roast[900],
    bgRaised: palette.roast[850],
    bgSunken: palette.roast[950],
    bgInverse: palette.cream[100],

    textPrimary: palette.cream[100],
    textSecondary: palette.cream[200],
    textMuted: palette.taupe[400],
    textSubtle: palette.taupe[600],
    textOnAccent: palette.ink[900],
    textInverse: palette.ink[900],

    borderSubtle: 'rgba(223, 209, 181, 0.08)',
    borderDefault: 'rgba(223, 209, 181, 0.16)',
    borderStrong: 'rgba(223, 209, 181, 0.32)',

    accent: palette.accent[400],
    accentHover: palette.accent[300],
    accentTint: 'rgba(198, 122, 63, 0.16)',
    accentRing: 'rgba(198, 122, 63, 0.55)',

    focusRing: 'rgba(198, 122, 63, 0.55)',
    selectionBg: 'rgba(198, 122, 63, 0.30)',
  },
} as const;

export type ColorMode = keyof typeof semantic;
