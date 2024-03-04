<script lang="ts">
    import {Fileupload, Heading, Input, Label, Listgroup, ListgroupItem, P, Select} from "flowbite-svelte";
    import {get} from "$lib/api";
    import {onMount} from "svelte";
    import Box from "$lib/components/Box.svelte";

    let items: any[] = [];
    let files: File[];

    const isEu = (key) => {
        return [
            'deutsch', 'bulgarisch', 'kroatisch',
            'liechtensteinisch', 'slowenisch', 'slowakisch', 'bosnien-herzegowinisch',
            'belgisch', 'dänisch', 'finnisch', 'französisch',
            'griechisch', 'irisch', 'isländisch', 'italienisch',
            'lettisch', 'litauisch', 'luxemburgisch', 'maltesisch',
            'niederländisch', 'norwegisch', 'österreichisch', 'polnisch',
            'portugiesisch', 'rumänisch', 'schwedisch', 'spanisch',
            'tschechisch', 'ungarisch', 'zyprisch'
        ].includes(key)
    }
    onMount(async () => {
        items = await get('/hr/reference/Staatsangehoerigkeiten')
        items = items.map((n) => ({...n, name: n.key})).sort((a,b) => a.name.localeCompare(b.name))
    })


    export let employee: any
</script>
<Box title="Personenbezogene Daten">
    <div class="grid grid-cols-2 md:grid-cols-3 gap-3 mt-2">
        <div>
            <Label for="gender" class="mb-2">Geschlecht</Label>
            <Select bind:value={employee.gender} id="gender">
                <option value="female">Frau</option>
                <option value="male">Herr</option>
                <option value="diverse">Divers</option>
            </Select>
        </div>
        <div>
            <Label for="placeOfBirth" class="mb-2">Geburtsort</Label>
            <Input type="text" bind:value={employee.cv.placeOfBirth} id="placeOfBirth"/>
        </div>
        <div>
            <Label for="dob" class="mb-2">Geburtsdatum</Label>
            <Input type="date" bind:value={employee.dateOfBirth.value} id="dob"/>
        </div>
        <div>
            <Label for="maidenName" class="mb-2">Geburtsname</Label>
            <Input bind:value={employee.maidenName} type="text" id="maidenName" required />
        </div>
        <div>
            <Label for="familyStatus" class="mb-2">Familienstand</Label>
            <Select bind:value={employee.familyStatus} id="familyStatus">
                <option value="single">ledig</option>
                <option value="married">verheiratet</option>
                <option value="registered_partnership">eingetragene Lebenspartnerschaft</option>
                <option value="divorced">geschieden</option>
                <option value="widowed">verwitwet</option>
                <option value="other">nicht bekannt</option>
            </Select>
        </div>
        <div>
            <Label for="nationality" class="mb-2">Staatsanghörigkeit</Label>
            <Select bind:value={employee.nationality} id="nationality" {items} required />
        </div>


    </div>
    {#if employee.nationality && !isEu(employee.nationality)}
        <Heading class="mt-3" tag="h4">Staatsangehörigkeit außerhalb EWR</Heading>
        <P class="dark:text-white">Die Bearbeitung geht schneller, wenn du erforderliche Dokumente (Aufenthaltserlaubnis, Arbeitserlaubnis, etc) schon bereit stellst. Aber keine Sorge, du kannst diese Nachweise auch später nachreichen.</P>
        <div class="mt-2">
            <Label class="pb-2" for="multiple_files">Datei(en) hochladen</Label>
            <Fileupload accept="image/*,application/pdf" id="multiple_files" multiple bind:files />
            <Listgroup items={files} let:item class="mt-2">
                {#if item}
                    {item.name}
                {:else}
                    <ListgroupItem>Keine Dateien</ListgroupItem>
                {/if}
            </Listgroup>
        </div>
    {/if}

</Box>