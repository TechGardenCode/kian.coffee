/* =====================================================================
   tooltip-position — pure DOM math for placing a floating element next to
   an anchor with side preference and viewport collision flipping.
   Framework-agnostic; no @angular imports.

   Side effects: none. positionTooltip() reads getBoundingClientRect on
   anchor + tooltip and returns the placement; the caller is responsible
   for applying the result via style.transform / style.top + left.
   ===================================================================== */

export type TooltipSide = 'top' | 'right' | 'bottom' | 'left';

export interface PositionOptions {
  readonly anchor: HTMLElement;
  readonly tooltip: HTMLElement;
  readonly side?: TooltipSide;
  readonly offset?: number;
  readonly viewportPadding?: number;
}

export interface PositionResult {
  readonly x: number;
  readonly y: number;
  readonly side: TooltipSide;
}

const OPPOSITE: Record<TooltipSide, TooltipSide> = {
  top: 'bottom',
  bottom: 'top',
  left: 'right',
  right: 'left',
};

export function positionTooltip(opts: PositionOptions): PositionResult {
  const offset = opts.offset ?? 6;
  const padding = opts.viewportPadding ?? 8;
  const preferred = opts.side ?? 'top';

  const a = opts.anchor.getBoundingClientRect();
  const t = opts.tooltip.getBoundingClientRect();

  const vw = typeof window !== 'undefined' ? window.innerWidth : 0;
  const vh = typeof window !== 'undefined' ? window.innerHeight : 0;

  const side = pickSide(preferred, a, t, offset, padding, vw, vh);
  const placement = compute(side, a, t, offset);
  const clamped = clampToViewport(placement, t, padding, vw, vh);

  return { x: clamped.x, y: clamped.y, side };
}

function pickSide(
  preferred: TooltipSide,
  a: DOMRect,
  t: DOMRect,
  offset: number,
  padding: number,
  vw: number,
  vh: number,
): TooltipSide {
  if (fits(preferred, a, t, offset, padding, vw, vh)) return preferred;
  const flipped = OPPOSITE[preferred];
  if (fits(flipped, a, t, offset, padding, vw, vh)) return flipped;
  return preferred;
}

function fits(
  side: TooltipSide,
  a: DOMRect,
  t: DOMRect,
  offset: number,
  padding: number,
  vw: number,
  vh: number,
): boolean {
  switch (side) {
    case 'top':
      return a.top - t.height - offset >= padding;
    case 'bottom':
      return a.bottom + t.height + offset + padding <= vh;
    case 'left':
      return a.left - t.width - offset >= padding;
    case 'right':
      return a.right + t.width + offset + padding <= vw;
  }
}

function compute(
  side: TooltipSide,
  a: DOMRect,
  t: DOMRect,
  offset: number,
): { x: number; y: number } {
  switch (side) {
    case 'top':
      return {
        x: a.left + a.width / 2 - t.width / 2,
        y: a.top - t.height - offset,
      };
    case 'bottom':
      return {
        x: a.left + a.width / 2 - t.width / 2,
        y: a.bottom + offset,
      };
    case 'left':
      return {
        x: a.left - t.width - offset,
        y: a.top + a.height / 2 - t.height / 2,
      };
    case 'right':
      return {
        x: a.right + offset,
        y: a.top + a.height / 2 - t.height / 2,
      };
  }
}

function clampToViewport(
  p: { x: number; y: number },
  t: DOMRect,
  padding: number,
  vw: number,
  vh: number,
): { x: number; y: number } {
  return {
    x: Math.max(padding, Math.min(vw - t.width - padding, p.x)),
    y: Math.max(padding, Math.min(vh - t.height - padding, p.y)),
  };
}
