<script>
import {Heading} from "flowbite-svelte";
import {AngleDownOutline, AngleTopOutline} from "flowbite-svelte-icons";
export let title = 'Titel'
export let open = true;
</script>

<section class="border border-primary shadow-primary-400 rounded-lg mt-3 w-full">
    <div class="bg-primary-200/30 px-3 py-2 flex justify-between">
        <Heading class="dark:text-white text-neutral-700 text-lg" tag="h2">{title}</Heading>
        <button type="button" on:click={() => open = !open}>
            {#if !open}
            <AngleDownOutline class="w-6 h-6 dark:text-white"/>
            {:else}
            <AngleTopOutline class="w-6 h-6 dark:text-white"/>
            {/if}
        </button>
    </div>
    {#if open}
    <div class="px-3 py-4">
        <slot/>
    </div>
    {/if}

</section>