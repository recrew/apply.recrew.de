<script lang="ts">
    import {Heading, Input, Label, Select} from "flowbite-svelte";
    import {get} from "$lib/api";
    import {onMount} from "svelte";
    import Box from "$lib/components/Box.svelte";
    import {GlobeSolid} from "flowbite-svelte-icons";
    import Typeahead from "$lib/components/Typeahead.svelte";

    export let employee: any

    let countries: any[] = []

    onMount(async () => {
        if(typeof employee.address === 'undefined') employee.address = {}

        countries = (await get('/hr/reference/Staaten')).map((n) => ({...n, name: n.value})).sort((a,b) => a.name.localeCompare(b.name));
    })
</script>
<div title="Adresse">
    {#if employee.address}
    <div class="grid grid-cols-3 gap-3 mt-2">
        <div class="col-span-2 ">
            <Label for="street" class="mb-2">Straße *</Label>
            <Input type="text" bind:value={employee.address.street} id="street" required/>
        </div>
        <div>
            <Label for="number" class="mb-2">Hausnummer *</Label>
            <Input type="text" bind:value={employee.address.number} pattern="[0-9]*" id="number" required/>
        </div>
        <div class="col-span-2 ">
            <Label for="addressAddendum" class="mb-2">Zusatz</Label>
            <Input type="text" bind:value={employee.address.addressAddendum} id="addressAddendum" />
        </div>
        <div class="col-span-2 ">
            <Label for="place" class="mb-2">Ort *</Label>
            <Input type="text" bind:value={employee.address.place} id="place" required/>
        </div>
        <div>
            <Label for="plz" class="mb-2">PLZ *</Label>
            <Input type="text" bind:value={employee.address.zip} id="plz" required/>
        </div>
        <div class="col-span-3">
            <Label for="country" class="mb-2">Land *</Label>
            <Typeahead bind:value={employee.address.country} id="country" data={countries} icon={GlobeSolid} required/>
        </div>
    </div>
    {/if}
</div>