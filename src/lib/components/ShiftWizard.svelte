<script lang="ts">
  import dayjs from "dayjs";
  import { Checkbox, Label } from "flowbite-svelte";
  import type { Shift } from "$lib/types/evaluationTypes";

  export let shifts: Shift[] = [];
  export let selected: Shift[] = [];

  function toggle(shift: Shift) {
    const idx = selected.findIndex((s) => s.id === shift.id);
    if (idx >= 0) {
      selected = [...selected.slice(0, idx), ...selected.slice(idx + 1)];
    } else {
      selected = [...selected, shift];
    }
  }
</script>

<div class="md:col-span-2">
  <Label class="text-gray-900">
    Auf welche Schichten bezieht sich die Bewertung?
  </Label>
  <div class="mt-4">
    {#if shifts && shifts.length > 0}
      {#each shifts as shift, index}
        <button
          type="button"
          on:click={() => toggle(shift)}
          class="w-full grid grid-cols-[auto_1fr_1fr] items-center {index !==
          shifts.length - 1
            ? 'border-b border-gray-200'
            : ''} py-3 text-left"
        >
          <Checkbox
            checked={selected.some((s) => s.id === shift.id)}
            class="mr-3"
          />
          <div class="text-gray-700 font-medium">{shift.name}</div>
          <div class="text-gray-600 ml-auto">
            {dayjs(shift.date).format("DD.MM.YYYY")}
          </div>
        </button>
      {/each}
    {/if}
  </div>
</div>
