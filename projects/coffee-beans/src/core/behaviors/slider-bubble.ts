/* =====================================================================
   slider-bubble — value-bubble UI for a native <input type="range">.
   Tracks the thumb position and renders a small floating value indicator.
   Framework-agnostic; no @angular imports.

   Side effects:
   - Mutates `bubble.style.left` and `bubble.textContent` on update().
   - Adds an `input` listener on the input element. Caller MUST call
     destroy() to remove it.
   ===================================================================== */

export interface SliderBubbleOptions {
  readonly input: HTMLInputElement;
  readonly bubble: HTMLElement;
  readonly format?: (value: number) => string;
}

export interface SliderBubbleHandle {
  update(): void;
  destroy(): void;
}

export function createSliderBubble(opts: SliderBubbleOptions): SliderBubbleHandle {
  const { input, bubble, format } = opts;

  function update() {
    const value = Number(input.value);
    const min = Number(input.min || 0);
    const max = Number(input.max || 100);
    const range = max - min || 1;
    const percent = ((value - min) / range) * 100;
    bubble.style.left = `${clamp(percent, 0, 100)}%`;
    bubble.textContent = format ? format(value) : String(value);
  }

  update();
  input.addEventListener('input', update);

  return {
    update,
    destroy() {
      input.removeEventListener('input', update);
    },
  };
}

function clamp(n: number, lo: number, hi: number): number {
  return Math.max(lo, Math.min(hi, n));
}
