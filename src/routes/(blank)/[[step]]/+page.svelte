<script lang="ts">
  import IdWizard from "$lib/components/IdWizard.svelte";
  import PassportWizard from "$lib/components/PassportWizard.svelte";
  import ReviewApplication from "$lib/partials/ReviewApplication.svelte";
  import { formComplete } from "$lib/stores/formComplete";

  export let data: any;
  let stepLabel: { [key: number]: string };
  $: stepLabel = {
    0: "Enter Photo Identification",
    1: "Enter Passport",
    2: "Review Application",
  };
</script>

<div class="flex flex-col items-center justify-center">
  <h1 class="text-3xl font-bold mb-4 text-white">
    Application Step {stepLabel[data.step]}
  </h1>

  {#if data.step === 0}
    <p class="text-lg text-white">Please enter your photo identification</p>
    <IdWizard on:formCompleted={() => formComplete.set(true)} />
  {:else if data.step === 1}
    <p class="text-lg text-white">Please enter your passport</p>
    <PassportWizard />
  {:else if data.step === 2}
    <ReviewApplication />
  {/if}
</div>
