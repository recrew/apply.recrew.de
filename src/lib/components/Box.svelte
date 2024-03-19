<script>
import {Heading} from "flowbite-svelte";
import {slide} from "svelte/transition";
import {AngleDownOutline, AngleTopOutline} from "flowbite-svelte-icons";
export let title = 'Titel'
export let open = true;
</script>

<section class="border border-primary shadow-primary-400 rounded-lg mt-3 w-full">
    <button  on:click={() => open = !open} type="button" class="bg-primary-200/30 px-3 py-2 flex justify-between w-full">
        <Heading class="dark:text-white text-neutral-700 text-lg" tag="h2">{title}</Heading>
        <span >
            {#if !open}
            <AngleDownOutline class="w-6 h-6 dark:text-white"/>
            {:else}
            <AngleTopOutline class="w-6 h-6 dark:text-white"/>
            {/if}
        </span>
    </button>
    {#if open}
    <div transition:slide class="px-3 py-4">
        <slot/>
    </div>
    {/if}

</section>