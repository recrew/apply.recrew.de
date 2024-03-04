<script lang="ts">
    import {Heading, Input, Label, Select} from "flowbite-svelte";
    import {get} from "$lib/api";
    import {onMount} from "svelte";
    import Box from "$lib/components/Box.svelte";

    export let employee: any

    let countries: any[] = []

    onMount(async () => {
        if(typeof employee.address === 'undefined') employee.address = {}

        countries = (await get('/hr/reference/Staaten')).map((n) => ({...n, name: n.key})).sort((a,b) => a.name.localeCompare(b.name));
    })
</script>
<Box title="Adresse">
    {#if employee.address}
    <div class="grid grid-cols-3 gap-3 mt-2">
        <div class="col-span-2 ">
            <Label for="street" class="mb-2">Straße</Label>
            <Input type="text" bind:value={employee.address.street} id="street"/>
        </div>
        <div>
            <Label for="number" class="mb-2">Hausnummer</Label>
            <Input type="text" bind:value={employee.address.number} id="number"/>
        </div>
        <div class="col-span-2 ">
            <Label for="place" class="mb-2">Ort</Label>
            <Input type="text" bind:value={employee.address.place} id="place"/>
        </div>
        <div>
            <Label for="plz" class="mb-2">PLZ</Label>
            <Input type="text" bind:value={employee.address.zip} id="plz"/>
        </div>
        <div class="col-span-3">
            <Label for="country" class="mb-2">Land</Label>
            <Select bind:value={employee.address.country} items={countries} id="country"/>
        </div>
    </div>
    {/if}
</Box>