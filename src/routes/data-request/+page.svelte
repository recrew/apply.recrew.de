<script lang="ts">
    import {onMount} from "svelte";
    import {get, formDataPost} from "$lib/api";
    import {page} from "$app/stores";
    import {Alert, Button, Heading, Hr, P, Spinner} from "flowbite-svelte";
    import {InfoCircleSolid} from "flowbite-svelte-icons";
    import TaxData from "$lib/partials/TaxData.svelte";
    import HealthInsuranceData from "$lib/partials/HealthInsuranceData.svelte";
    import BankData from "$lib/partials/BankData.svelte";
    import QualificationData from "$lib/partials/QualificationData.svelte";
    import BaseData from "$lib/partials/BaseData.svelte";

    let error = false;
    let employee:any;

    const update = async () => {
        await formDataPost('/hr/application', employee)
        console.log({employee})
    }

    onMount(() => {
        get('/hr/applicant/' + $page.url.searchParams.get('sheet') + '/data-sheet').then((res) => {
            employee = res
            console.log({employee})
        }).catch((e) => {
            error = true;
        })
    })

</script>
<div class="my-8 w-4/5 mx-auto">
    {#if error}
        <Alert border color="red">
            <InfoCircleSolid slot="icon" class="w-4 h-4" />
            <p class="font-medium text-lg">Fehler!</p>
            <p>Dieser Link ist entweder ungültig oder nicht mehr verfügbar.</p>
        </Alert>
        <p class="mt-3 dark:text-white">
            Diese Meldung wird auch dann angezeigt, wenn du alle nötigen Daten bereits angegeben hast und diese vom Team
            bestätigt wurden. Solltest du von uns auf diesen Link geschickt worden sein, bitte melde dich bei work@recrew.de.
        </p>
    {/if}
    {#if employee && !error}
        <form on:submit|preventDefault={() => update()}>
            <Heading class="dark:text-white text-neutral-700" tag="h1">Hallo, {employee.name}</Heading>
            <P class="my-5">
                Schön, dass du dich für RECREW bewirbst. Im nächsten Schritt brauchen wir die nötigen Daten, um den Papierkram erledigen zu können.
            </P>
            <BaseData bind:employee/>
            <QualificationData bind:employee/>

            <TaxData bind:employee/>
            <Hr/>
            <BankData bind:employee/>
            <HealthInsuranceData bind:employee/>
            <div class="grid mt-3">
                <Button type="submit">Speichern</Button>
            </div>
        </form>
    {:else}
        <Spinner /> <span class="dark:text-white text-lg pl-3">Loading ...</span>
    {/if}
</div>
