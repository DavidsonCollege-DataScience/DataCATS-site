<script>
  import { fade, scale } from 'svelte/transition';
  import { tick } from 'svelte';
  import { prefersReducedMotion } from '../lib/motion';

  const reduceMotion = prefersReducedMotion();

  export let open = false;
  export let zoomSchedulerUrl = '';
  export let consultantName = '';
  export let onClose = () => {};

  let dialogEl;
  let closeButtonEl;
  let previouslyFocused = null;
  let wasOpen = false;

  function getFocusable() {
    if (!dialogEl) return [];
    return Array.from(
      dialogEl.querySelectorAll('button, [href], input, select, textarea, iframe, [tabindex]:not([tabindex="-1"])'),
    );
  }

  // Escape closes the dialog; Tab/Shift+Tab wrap within it instead of escaping to the page behind.
  function handleKeydown(event) {
    if (!open) return;
    if (event.key === 'Escape') {
      onClose();
      return;
    }
    if (event.key === 'Tab') {
      const focusable = getFocusable();
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
  }

  // Tab/Shift+Tab keydowns that happen while focus is inside the (cross-origin) Zoom
  // iframe never reach this window's keydown listener, so handleKeydown's trap alone
  // can't catch focus escaping via the iframe. This catches it after the fact: any
  // time focus lands outside the dialog while it's open, yank it back in.
  function handleFocusIn(event) {
    if (!open || !dialogEl) return;
    if (!dialogEl.contains(event.target)) {
      closeButtonEl?.focus();
    }
  }

  // Move focus into the dialog when it opens, and back to whatever triggered it when it closes.
  $: {
    if (open && !wasOpen) {
      previouslyFocused = document.activeElement;
      tick().then(() => closeButtonEl?.focus());
    } else if (!open && wasOpen) {
      previouslyFocused?.focus();
      previouslyFocused = null;
    }
    wasOpen = open;
  }
</script>

<svelte:window on:keydown={handleKeydown} on:focusin={handleFocusIn} />

{#if open}
  <div
    class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4"
    transition:fade={{ duration: reduceMotion ? 0 : 150 }}
    on:click={onClose}
    role="presentation"
  >
    <div
      bind:this={dialogEl}
      class="flex max-h-[92vh] w-full max-w-[1100px] flex-col rounded-xl bg-white p-5 shadow-xl dark:bg-neutral-800"
      transition:scale={{ duration: reduceMotion ? 0 : 150, start: 0.96 }}
      on:click|stopPropagation
      role="dialog"
      aria-modal="true"
      aria-label={`Schedule with ${consultantName}`}
    >
      <div class="mb-3 flex items-start justify-between">
        <div>
          <h2 class="text-lg font-semibold text-slate-900 dark:text-neutral-100">Book time with {consultantName}</h2>
        </div>
        <button
          bind:this={closeButtonEl}
          on:click={onClose}
          class="rounded-md p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-neutral-700 dark:hover:text-neutral-200"
          aria-label="Close"
        >
          ✕
        </button>
      </div>
      <iframe
        src={`${zoomSchedulerUrl}?embed=true`}
        title={`Zoom Scheduler for ${consultantName}`}
        frameborder="0"
        class="min-h-[650px] flex-1"
        style="width: 100%; border: none;"
      ></iframe>
    </div>
  </div>
{/if}
