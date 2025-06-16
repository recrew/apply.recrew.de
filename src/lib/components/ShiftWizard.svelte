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
  /** Alle verfügbaren Schichten für die Auswahl */
  export let shifts: Shift[] = [];

  /** Ausgewählte Schichten (bind:selected) */
  export let selected: Shift[] = [];

  /** Umschalten in der Auswahlliste */
  function toggle(shift: Shift) {
    const idx = selected.findIndex((s) => s.id === shift.id);
    if (idx >= 0) {
      selected = [...selected.slice(0, idx), ...selected.slice(idx + 1)];
    } else {
      selected = [...selected, shift];
    }
  }
</script>

<div class="mt-4">
  {#each shifts as shift, index}
    <button
      type="button"
      on:click={() => toggle(shift)}
      class="w-full grid grid-cols-[auto_1fr_1fr] items-center {index !== shifts.length - 1 ? 'border-b border-gray-200' : ''} py-3 text-left"
    >
      <Checkbox checked={selected.some((s) => s.id === shift.id)} class="mr-3" />
      <div class="text-gray-700 font-medium">{shift.name}</div>
      <div class="text-gray-600 ml-auto">
        {dayjs(shift.date).format("DD.MM.YYYY")}
      </div>
    </button>
  {/each}
</div>
