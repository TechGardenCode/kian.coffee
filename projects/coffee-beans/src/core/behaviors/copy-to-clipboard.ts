/* =====================================================================
   copy-to-clipboard — copy text with a fallback for non-secure contexts.
   Framework-agnostic; no @angular imports.

   Side effects:
   - Uses navigator.clipboard.writeText() in secure contexts.
   - Falls back to a transient <textarea> + document.execCommand('copy'),
     removing the textarea before the promise resolves.
   ===================================================================== */

export interface CopyResult {
  readonly ok: boolean;
  readonly method: 'clipboard' | 'execCommand' | 'none';
}

export async function copyText(text: string): Promise<CopyResult> {
  if (
    typeof navigator !== 'undefined' &&
    navigator.clipboard?.writeText &&
    typeof window !== 'undefined' &&
    window.isSecureContext
  ) {
    try {
      await navigator.clipboard.writeText(text);
      return { ok: true, method: 'clipboard' };
    } catch {
      // fall through to execCommand
    }
  }

  if (typeof document === 'undefined') {
    return { ok: false, method: 'none' };
  }

  const ta = document.createElement('textarea');
  ta.value = text;
  ta.setAttribute('readonly', '');
  ta.style.position = 'fixed';
  ta.style.top = '0';
  ta.style.left = '0';
  ta.style.opacity = '0';
  ta.style.pointerEvents = 'none';
  document.body.appendChild(ta);

  let ok = false;
  try {
    ta.select();
    ta.setSelectionRange(0, text.length);
    ok = document.execCommand('copy');
  } catch {
    ok = false;
  } finally {
    document.body.removeChild(ta);
  }

  return ok
    ? { ok: true, method: 'execCommand' }
    : { ok: false, method: 'none' };
}
