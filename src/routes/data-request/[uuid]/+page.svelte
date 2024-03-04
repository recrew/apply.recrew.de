<script lang="ts">
    import {onMount} from "svelte";
    import {get} from "$lib/api";
    import {page} from "$app/stores";
    import {Alert, Avatar, Heading, Hr, P, Spinner} from "flowbite-svelte";
    import {InfoCircleSolid} from "flowbite-svelte-icons";
    import BaseData from "$lib/partials/BaseData.svelte";
    import AddressData from "$lib/partials/AddressData.svelte";
    import TaxData from "$lib/partials/TaxData.svelte";
    import HealthInsuranceData from "$lib/partials/HealthInsuranceData.svelte";
    import BankData from "$lib/partials/BankData.svelte";
    import QualificationData from "$lib/partials/QualificationData.svelte";

    let error = false;
    let employee:any;

    onMount(() => {
        get('/hr/applicant/' + $page.params.uuid + '/data-sheet').then((res) => {
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
        <Heading class="dark:text-white text-neutral-700" tag="h1">Hallo, {employee.name}</Heading>
        <P class="my-5">
            Schön, dass du dich für RECREW bewirbst. Im nächsten Schritt brauchen wir die nötigen Daten, um den Papierkram erledigen zu können.
        </P>
        <div class="flex gap-5">
            {#if employee.avatarFile}
                <Avatar src={employee.avatarFile} rounded size="xl" />
            {/if}
            <BaseData bind:employee/>
        </div>
        <div class="grid md:grid-cols-2 gap-3 mt-2">
            <AddressData bind:employee/>
            <BankData bind:employee/>
            <TaxData bind:employee/>
            <HealthInsuranceData bind:employee/>
        </div>
        <Hr/>
        <QualificationData bind:employee/>

    {:else}
        <Spinner /> <span class="dark:text-white text-lg pl-3">Loading ...</span>
    {/if}
</div>
