<script lang="ts">
    import {Button, Input, Label} from "flowbite-svelte";
    import {post} from "$lib/api";

    let email = '';
    let loading = false;
    let showDone = false;
    const loginWithMagicLink = async () => {
        loading = true;
        await post('/auth/magic-link', {email, backLink: window.location.href})
        loading = false;
        showDone = true;
    }
</script>
<div class="w-4/5 md:w-1/3 mx-auto my-1/3 rounded border border-neutral-50 shadow p-8">
    <form on:submit|preventDefault={loginWithMagicLink} >
        <div class="grid justify-center mb-5">

            <img class="w-24" src="https://portal.celest.services/img/ci/button_recrew_solid_black.svg" alt="logo">
        </div>
        <h1 class="text-3xl font-bold mb-3 dark:text-white text-center">crew login</h1>
        {#if showDone}
            <p class="dark:text-white">Wenn die E-Mail existiert, senden wir dir einen Link zum Login.</p>
        {:else}
            <Label class="space-y-2">
                <span>Persönliche E-Mail-Adresse</span>
                <Input type="email" bind:value={email}/>
            </Label>
            <div class="mt-5 grid justify-end">

                <Button disabled={loading} type="submit">Send magic login link</Button>
            </div>
        {/if}


    </form>
</div>