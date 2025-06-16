<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import { StarSolid, StarOutline } from "flowbite-svelte-icons";
  import { Label } from "flowbite-svelte";

  export let label = "";
  export let rating: number = 0;
  export let total: number = 5;
  export let size: any = "xl";
  const dispatch = createEventDispatcher<{ change: number }>();

  function setRating(value: number) {
    rating = value;
    dispatch("change", rating);
  }
</script>

<div>
  {#if label}
    <Label class="mb-2 text-gray-700">{label}</Label>
  {/if}
  <div class="flex items-center">
    {#each Array(total) as _, i}
      {#if i < rating}
        <StarSolid
          {size}
          class="cursor-pointer text-yellow-400"
          on:click={() => setRating(i + 1)}
        />
      {:else}
        <StarOutline
          {size}
          class="cursor-pointer text-gray-300"
          on:click={() => setRating(i + 1)}
        />
      {/if}
    {/each}
    <span class="ms-2 text-lg text-gray-700">
      {rating ? rating : 0} / {total}
    </span>
  </div>
</div>
