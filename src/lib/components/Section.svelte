<script lang="ts">
    export let title: string = "";
    export let helpText: string = "";
</script>

<section class="grid gap-6 mb-6 md:grid-cols-2">
    <div class="flex flex-col md:col-span-2">
        <h2 class="mb-0.5 text-gray-800 text-xl font-bold md:col-span-2">
            {title}
        </h2>
        {#if helpText}
            <p class="text-sm text-gray-500">{helpText}</p>
        {/if}
    </div>
    <slot class="grid gap-6 mb-6 md:grid-cols-2" />

    <hr class="md:col-span-2 my-5" />
</section>
