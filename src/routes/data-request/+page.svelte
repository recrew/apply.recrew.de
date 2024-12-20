<script lang="ts">
    import {onMount} from "svelte";
    import {get, formDataPost} from "$lib/api";
    import {page} from "$app/stores";
    import {Alert, Button, Heading, Hr, P, Spinner, StepIndicator, Tooltip} from "flowbite-svelte";
    import {InfoCircleSolid} from "flowbite-svelte-icons";
    import TaxData from "$lib/partials/TaxData.svelte";
    import HealthInsuranceData from "$lib/partials/HealthInsuranceData.svelte";
    import BankData from "$lib/partials/BankData.svelte";
    import QualificationData from "$lib/partials/QualificationData.svelte";
    import BaseData from "$lib/partials/BaseData.svelte";
    import {modalStore} from "$lib/stores/modal";
    import DatasheetSaved from "$lib/partials/DatasheetSaved.svelte";
    import {currentStep} from "$lib/stores/currentStep";
    import {blocked} from "$lib/stores/blocked";

    let error = false;
    let employee:any;

    let loading = false

    let test = (e) => {
        console.log(e)
    }

    const update = async () => {
        loading = true;
        let updateObject = {
            healthInsurance: employee.healthInsurance || {},
            ...employee
        };
        if(employee.avatarFile && typeof employee.avatarFile === 'string'){
            delete updateObject.avatarFile;
        }
        try{
            await formDataPost('/hr/application/' + $page.url.searchParams.get('sheet') + '/update', updateObject)
            for (let i = 0; i < updateObject.images.length; i++) {
                if(!updateObject.images[i].file) {
                    continue
                }
                await formDataPost('/hr/application/' + $page.url.searchParams.get('sheet') + '/image', updateObject.images[i])
            }

            $modalStore.registerConfig({
                component: DatasheetSaved,
                title: 'Erfolgreich gespeichert',
            })
        } catch (e) {
            console.log(e)
            $modalStore.registerConfig({
                content: 'Ein Fehler ist aufgetreten.',
                title: 'Ups...',
            })
        }
        loading = false;

        $modalStore.toggle()

    }

    let steps = ['Persönliche Daten', 'Qualifikationen', 'Lohnsteuer', 'Bankdaten', 'Krankenversicherung']
    currentStep.set(1)

    onMount(() => {
        get('/hr/applicant/' + $page.url.searchParams.get('sheet') + '/data-sheet').then((res) => {
            employee = res
            if(employee.cv.motorVehicleLicense === '0'){
                employee.cv.motorVehicleLicense = false;
            }
            if(employee.dateOfBirth.value){
                employee.dateOfBirth.value = employee.dateOfBirth.value.split(' ')[0]
            }
        }).catch((e) => {
            error = true;
        })

    })

</script>
<div class="my-8 px-2 max-w-screen-lg mx-auto">
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

        <form on:submit|preventDefault={() => update()} >
            <Heading class="dark:text-white text-neutral-700" tag="h1">Hallo, {employee.name}</Heading>
            {#if employee.employmentStatus === 'data-re-requested' || employee.employmentStatus === 'data-re-provided'}
                <P class="my-5">
                    Bevor du wieder ins Team zurückkehrst, kannst du bitte sorgfältig deine Daten prüfen?
                </P>
            {:else}
                <P class="my-5">
                    Schön, dass du dich für RECREW bewirbst. Im nächsten Schritt brauchen wir die nötigen Daten, um den Papierkram erledigen zu können.
                </P>
            {/if}

            <StepIndicator currentStep={$currentStep} {steps} />
            <BaseData bind:employee />
            <QualificationData bind:employee/>

            <TaxData bind:employee/>
            <BankData bind:employee/>
            <HealthInsuranceData bind:employee/>

            <div class="grid mt-3">
                {#if loading}
                    <Spinner class="place-self-center" />
                {:else}
                    <Button disabled={$blocked} type="submit">Speichern</Button>
                    {#if $blocked}
                    <Tooltip>Bitte markierte Felder ausfüllen</Tooltip>
                    {/if}
                {/if}
            </div>
        </form>
    {:else if !error}
        <Spinner /> <span class="dark:text-white text-lg pl-3">Loading ...</span>
    {/if}
</div>
