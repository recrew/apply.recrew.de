<script lang="ts">
  /* --------------------------------------------------------------------
   * Imports & types
   * ------------------------------------------------------------------*/
  import dayjs from "dayjs";
  import { Checkbox } from "flowbite-svelte";
  import type { Shift } from "$lib/types/evaluationTypes";

  /* --------------------------------------------------------------------
   * Props
   * ------------------------------------------------------------------*/
  /**
   * Vollständige Liste aller Schichten (für das UI).
   * Wird vom Parent ebenso als Input genutzt.
   */
  export let shifts: Shift[] = [];

  /**
   * Gefilterte Liste (nur together === true)
   * Wird automatisch abgeleitet und kann im Parent via `bind:selected` gelesen werden.
   */
  export let selected: Shift[] = [];

  /* --------------------------------------------------------------------
   * Reactive derivation – whenever `shifts` changes, update `selected`.
   * ------------------------------------------------------------------*/
  $: selected = shifts.filter((s) => s.together);

  /* --------------------------------------------------------------------
   * Event helpers
   * ------------------------------------------------------------------*/
  function toggle(shift: Shift) {
    shift.together = !shift.together;
    // Reassign with a fresh array reference so the `$:` block runs again
    shifts = [...shifts];
  }
</script>

<div class="mt-4">
  {#each shifts as shift, index}
    <button
      type="button"
      on:click={() => toggle(shift)}
      class="w-full grid grid-cols-[auto_1fr_1fr] items-center {index !== shifts.length - 1 ? 'border-b border-gray-200' : ''} py-3 text-left"
    >
      <Checkbox bind:checked={shift.together} class="mr-3" />
      <div class="text-gray-700 font-medium">{shift.name}</div>
      <div class="text-gray-600 ml-auto">
        {dayjs(shift.date).format("DD.MM.YYYY")}
      </div>
    </button>
  {/each}
</div>
