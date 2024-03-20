<script lang="ts">
    import Box from "$lib/components/Box.svelte";
    import {Helper, Input, Label, Select} from "flowbite-svelte";
    import {onMount} from "svelte";
    import {get} from "$lib/api";
    import Typeahead from "$lib/components/Typeahead.svelte";
    import {MountainSunSolid} from "flowbite-svelte-icons";
    export let employee: any

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

    onMount(async() =>{
        taxClasses = (await get('/hr/reference/Steuerklassen')).map((n) => ({...n, name: n.key + ': ' + n.value, value: parseInt(n.key)}))
            .sort((a,b) => a.key - b.key)
            .filter(n => n.key < 8);
        religiousAffiliations = (await get('/hr/reference/Kirchensteuer')).map((n) => ({...n, name: n.value})).sort((a,b) => a.key - b.key);
    })
</script>

<Box title="Lohnsteuer">
    <div class="grid gap-3 mt-2">
        <div>
            <Label class="mb-2" for="taxId">SV-Nummer <span class="text-xs">(Sozialversicherungsnummer)</span></Label>
            <Input id="taxId" bind:value={employee.cv.socialSecurityNumber} />
        </div>
        <div>
            <Label class="mb-2" for="taxId">Steuer ID</Label>
            <Input id="taxId" bind:value={employee.taxId} />
        </div>
        <div>
            <Label class="mb-2" for="allowance">Kinderfreibetrag</Label>
            <Input type="number" step="0.5" id="allowance" bind:value={employee.cv.childAllowance} />
        </div>
    </div>
    <div class="grid grid-cols-2 gap-3 mt-2">
        <div>
            <Label class="mb-2" for="taxClass">Steuerklasse</Label>
            <Select id="taxClass" bind:value={employee.cv.taxationClass} items={taxClasses} />
        </div>
        <div>
            <Label class="mb-2" for="religion">Religionszugehörigkeit</Label>
            <Typeahead icon={MountainSunSolid} bind:value={employee.cv.religiousAffiliation} id="religion" data={religiousAffiliations} />
        </div>
    </div>

</Box>