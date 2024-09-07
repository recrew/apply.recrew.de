<script lang="ts">
    import Box from "$lib/components/Box.svelte";
    import {Input, Label, Select, Toggle} from "flowbite-svelte";
    import {onMount} from "svelte";
    import {get} from "$lib/api";
    import Typeahead from "$lib/components/Typeahead.svelte";
    export let employee: any
    let insurances: any[] = []
    onMount(async() => {
        if(!employee.healthInsurance){
            employee.healthInsurance = {}
        }
        insurances = (await get('/hr/reference/Krankenkassen')).map((n) => ({...n, name: n.value})).sort((a,b) => a.name.localeCompare(b.name))
    })
</script>

<Box title="Krankenversicherung">
    {#if employee.healthInsurance}
        <div class="my-2">
            <Toggle bind:checked={employee.healthInsurance.isPublic}>Gesetzlich versichert?</Toggle>
        </div>
        <div class="grid md:grid-cols-2 gap-3 mt-2">
            <div>
                <Label for="insurance-name" class="mb-2">{employee.healthInsurance.isPublic ? '' : 'Private '} Krankenversicherung *</Label>
                {#if employee.healthInsurance.isPublic}
                    <Typeahead bind:value={employee.healthInsurance.insuranceName} id="insurance-name" data={insurances} required/>
<!--                    <Select bind:value={employee.healthInsurance.insuranceName} id="insurance-name" items={insurances} />-->
                {:else}
                    <Input type="text" bind:value={employee.healthInsurance.insuranceName} id="insurance-name" required/>
                {/if}

            </div>
            <div>
                <Label for="insurance-number" class="mb-2">Versicherungsnummer *</Label>
                <Input type="text" bind:value={employee.healthInsurance.insuranceNumber} id="insurance-number" required/>
            </div>
        </div>
        {#if employee.healthInsurance.isPublic}
            <div class="mt-2">
                <Label for="insurance-place" class="mb-2">Ort gesetzliche KV *</Label>
                <Input type="text" bind:value={employee.healthInsurance.insurancePlace} id="insurance-place" required/>
            </div>
        {/if}
    {/if}
</Box>