<script context="module" lang="ts">
  export interface Shift {
    name: string;
    date: string;
    together: boolean;
  }
</script>

<script lang="ts">
  import dayjs from "dayjs";
  import { Input, Button, Checkbox, Toggle, Label } from "flowbite-svelte";

  export let shifts: Shift[] = [];

  let shiftWizard = { name: "", date: "", together: false };
  let hasError = false;

  function removeShift(index: number) {
    shifts = shifts.filter((_, i) => i !== index);
    console.log("Shift removed:", shifts);
  }

  function addShift() {
    if (!shiftWizard.name || !shiftWizard.date) {
      hasError = true;
      return;
    } else {
      hasError = false;
    }

    shifts = [
      ...(shifts || []),
      {
        name: shiftWizard.name,
        date: shiftWizard.date,
        together: shiftWizard.together,
      },
    ];
    console.log("Shift added:", shifts);
    shiftWizard = { name: "", date: "", together: false };
  }
</script>

<div class="space-y-4">
  {#if hasError}
    <div class="text-red-700 text-xs">Bitte fülle alle Felder aus.</div>
  {/if}
  <div class="flex flex-col md:flex-row gap-4">
    <Input
      bind:value={shiftWizard.name}
      type="text"
      placeholder="Schichtname"
    />
    <Input bind:value={shiftWizard.date} type="date" />
    <Button type="button" class="mt-2 md:mt-0" on:click={addShift}>+</Button>
  </div>

  {#each shifts as shift, index}
    <div
      class="grid grid-cols-[1fr_1fr_1fr_auto] items-center {index !==
      shifts.length - 1
        ? 'border-b border-gray-200'
        : ''} pb-2"
    >
      <div class="text-gray-900 text-sm">{shift.name}</div>
      <div class="text-gray-900 text-sm">
        {dayjs(shift.date).format("DD.MM.YYYY")}
      </div>
      <div class="flex items-center">
        <Label class="text-gray-900 font-normal text-sm">Gemeinsam</Label>
        <Toggle class="ms-4" label="Erledigt" bind:checked={shift.together} />
      </div>
      <Button type="button" on:click={() => removeShift(index)}>-</Button>
    </div>
  {/each}
</div>
