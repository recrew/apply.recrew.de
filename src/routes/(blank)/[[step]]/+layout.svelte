<script lang="ts">
  import Steps from "$lib/components/Steps.svelte";
  import NavControls from "$lib/partials/NavControls.svelte";
  import { formComplete } from "$lib/stores/formComplete";

  export let data: any;

  $: steps = [
    {
      label: "Enter Photo Identification",
      route: "/",
      state: data.step > 0 ? -1 : 0,
    },
    {
      label: "Enter Passport",
      route: "/passport",
      state: data.step > 1 ? -1 : data.step === 1 ? 0 : 1,
    },
    {
      label: "Review Application",
      route: "/review-application",
      state: data.step > 2 ? -1 : data.step === 2 ? 0 : 1,
    },
  ];
</script>

<main class="md:w-4/5 px-2 lg:max-w-screen-lg mx-auto mb-24">
  <Steps {steps} classList="mt-8" />
  <section class="mt-8">
    <slot />
  </section>

  <NavControls {steps} currentStep={data.step} mode={$formComplete} />
</main>

<style>
  .banner {
    background-image: url("/barkeeper-1400x600.jpg");
    background-size: cover;
    background-position: bottom left;
    background-repeat: no-repeat;
    height: 50vh;
  }
</style>
