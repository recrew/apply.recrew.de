<script lang="ts">
    import Box from "$lib/components/Box.svelte";
    import {Button, Helper, Input, Label, Select, Tooltip} from "flowbite-svelte";
    import {onMount} from "svelte";
    import {get} from "$lib/api";
    import Typeahead from "$lib/components/Typeahead.svelte";
    import {BellRingOutline, CheckCircleOutline, MountainSunSolid, QuestionCircleOutline} from "flowbite-svelte-icons";
    import {currentStep} from "$lib/stores/currentStep";
    import {reactToBoxInteraction} from "$lib/utils/openStep";
    export let employee: any
    import {blocked} from "$lib/stores/blocked";
    import markEmptyFields from "$lib/utils/markEmptyFields";


    let taxClasses: any[] = []
    let religiousAffiliations: any[] = []
    let familyStati: any = {
        single: 'ledig',
        married: 'verheiratet',
        registered_partnership: 'eingetragene Lebenspartnerschaft',
        divorced: 'geschieden',
        widowed: 'verwitwet',
        other: 'nicht bekannt'
    }

    $: dataComplete = employee.cv && employee.taxId && employee.cv.taxationClass && employee.cv.religiousAffiliation

    $:{
        if($currentStep === 3) {
            markEmptyFields();
        }
    }

    onMount(async() =>{
        taxClasses = (await get('/hr/reference/Steuerklassen')).map((n) => ({...n, name: n.key + ': ' + n.value, value: parseInt(n.key)}))
            .sort((a,b) => a.key - b.key)
            .filter(n => n.key < 7);
        religiousAffiliations = (await get('/hr/reference/Kirchensteuer')).map((n) => ({...n, name: n.value})).sort((a,b) => a.key - b.key);
    })
</script>

<Box disabled={$blocked} title="Lohnsteuer" open={$currentStep === 3} on:open={ev => reactToBoxInteraction(ev, 3)} icon={dataComplete ? CheckCircleOutline : BellRingOutline}>
    <div class="grid gap-3 mt-2">
        <div>
            <Label class="mb-2" for="taxId">
                SV-Nummer <span class="text-xs">(Sozialversicherungsnummer)</span>
                <QuestionCircleOutline size="xs" class="inline cursor-pointer"/>
                <Tooltip>Wenn nicht vorhanden, bitte leer lassen</Tooltip>
            </Label>
            <Input id="taxId" bind:value={employee.cv.socialSecurityNumber}/>
        </div>
        <div>
            <Label class="mb-2" for="taxId">Steuer ID *</Label>
            <Input id="taxId" bind:value={employee.taxId} required/>
        </div>
        <div>
            <Label class="mb-2" for="allowance">Kinderfreibetrag *</Label>
            <Input type="number" step="0.5" id="allowance" bind:value={employee.cv.childAllowance} />
        </div>
    </div>
    <div class="grid grid-cols-2 gap-3 mt-2">
        <div>
            <Label class="mb-2" for="taxClass">Steuerklasse *</Label>
            <Select id="taxClass" bind:value={employee.cv.taxationClass} items={taxClasses} required/>
        </div>
        <div>
            <Label class="mb-2" for="religion">Religionszugehörigkeit *</Label>
            <Typeahead icon={MountainSunSolid} bind:value={employee.cv.religiousAffiliation} id="religion" data={religiousAffiliations} required/>
        </div>
    </div>
    <Button on:click={() => currentStep.update((n) => n + 1)} class="mt-5 w-full">Weiter</Button>
</Box>