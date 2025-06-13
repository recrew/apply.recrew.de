<script context="module" lang="ts">
  export interface Shift {
    name: string;
    date: string;
    together: boolean;
  }
</script>

<script lang="ts">
  import dayjs from "dayjs";
  import { Toggle, Label } from "flowbite-svelte";

  export let shifts: Shift[] = [];
</script>

<div class="space-y-4 mt-4">
  {#each shifts as shift, index}
    <div
      class="grid grid-cols-3 items-end {index !==
      shifts.length - 1
        ? 'border-b border-gray-200'
        : ''} pb-3"
    >
      <div class="text-gray-900 text-sm">{shift.name}</div>
      <div class="text-gray-900 text-sm">
        {dayjs(shift.date).format("DD.MM.YYYY")}
      </div>
      <div class="flex">
        <Label class="text-gray-900 font-normal text-sm">Gemeinsam</Label>
        <Toggle class="ms-4" label="Erledigt" bind:checked={shift.together} />
      </div>
    </div>
  {/each}
</div>
