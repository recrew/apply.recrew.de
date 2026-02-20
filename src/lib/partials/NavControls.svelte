<script lang="ts">
    import { goto } from "$app/navigation";
    import { Button } from "flowbite-svelte";

    export let steps: {
        label: string;
        route: string;
    }[];
    export let currentStep: number = 0;

    //Disables if the user doesn't have all fields completed
    export let mode: boolean = false;
</script>

<div class="flex items-center justify-between">
    <Button
        color="alternative"
        on:click={() => {
            currentStep > 0 ? currentStep-- : (currentStep = 0);
            goto(steps[currentStep].route);
        }}
    >
        Zurück
    </Button>
    <Button
        disabled={!mode}
        on:click={() => {
            currentStep >= 0 ? currentStep++ : (currentStep = 0);
            goto(steps[currentStep].route);
        }}
    >
        {#if currentStep < 4}
            Weiter
        {:else}
            Absenden
        {/if}
    </Button>
</div>
