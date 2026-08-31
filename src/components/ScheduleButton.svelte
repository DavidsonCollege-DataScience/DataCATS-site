<script>
  import ScheduleModal from './ScheduleModal.svelte';

  export let consultantName = '';
  export let zoomSchedulerUrl = '';

  let modalOpen = false;
</script>

{#if zoomSchedulerUrl}
  <button
    on:click={() => (modalOpen = true)}
    class="mt-4 block w-full rounded-md bg-davidson-red px-4 py-2.5 text-center text-sm font-semibold text-white hover:bg-davidson-red-deep"
  >
    Schedule an Appointment
  </button>

  <ScheduleModal
    open={modalOpen}
    {zoomSchedulerUrl}
    {consultantName}
    onClose={() => (modalOpen = false)}
  />
{:else}
  <!-- No Zoom Scheduler set up for this person — show it as an inert state rather
       than omitting the button, so it's clear they're drop-in-only, not unbookable. -->
  <button
    type="button"
    disabled
    aria-disabled="true"
    class="mt-4 block w-full cursor-not-allowed rounded-md bg-slate-200 px-4 py-2.5 text-center text-sm font-semibold text-slate-500 dark:bg-neutral-700 dark:text-neutral-400"
  >
    Drop-in visits only
  </button>
{/if}
