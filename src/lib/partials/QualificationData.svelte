<script lang="ts">
    import Box from "$lib/components/Box.svelte";
    import {Input, Label, Select, Toggle} from "flowbite-svelte";
    export let employee: any;
</script>

<Box title="Qualifikationen">
    <div class="grid grid-cols-2 gap-3 mt-2">
        <div>
            <Label class="mb-2" for="graduation">Schulabschluss</Label>
            <Select id="graduation" bind:value={employee.graduation} />
        </div>
        <div>
            <Label class="mb-2" for="graduation">Ausbildung</Label>
            <Select id="graduation" bind:value={employee.taxId} />
        </div>
        <div>
            <Label class="mb-2" for="graduation">Aktueller Status</Label>
            <Select id="graduation" bind:value={employee.taxId} />
        </div>
        <div>
            <Label class="mb-2" for="graduation">Erfahrung</Label>
            <Select id="graduation" bind:value={employee.taxId} />
        </div>
        <div>
            <Toggle bind:checked={employee.cv.isCurrentlyEmployed} >Führerschein</Toggle>
        </div>
        <div>
            <Label class="mb-2" for="graduation">Hemdgröße</Label>
            <Input id="graduation" bind:value={employee.taxId} />
        </div>
        <div>
            <Label class="mb-2" for="graduation">Hosengröße</Label>
            <Input id="graduation" bind:value={employee.taxId} />
        </div>
        <div>
            <Label class="mb-2" for="graduation">Schuhgröße</Label>
            <Input id="graduation" bind:value={employee.taxId} />
        </div>
        <div>
            <Label class="mb-2" for="graduation">Körpergröße (cm)</Label>
            <Input id="graduation" bind:value={employee.taxId} />
        </div>
        <div>
            <Label class="mb-2" for="graduation">Haarfarbe</Label>
            <Input id="graduation" bind:value={employee.taxId} />
        </div>
        <div>
            <Label class="mb-2" for="graduation">Sonstige Besonderheiten</Label>
            <Input id="graduation" bind:value={employee.taxId} />
        </div>
    </div>
</Box>