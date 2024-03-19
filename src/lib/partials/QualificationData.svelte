<script lang="ts">
    import Box from "$lib/components/Box.svelte";
    import {Helper, Input, Label, Select, Toggle} from "flowbite-svelte";
    import {onMount} from "svelte";
    import {get} from "$lib/api";
    import Tesseract from "$lib/components/Tesseract.svelte";
    export let employee: any;

    let graduations : any[] = [];
    let licenseIndex = 0;

    let degrees = [
        'Ohne beruflichen Ausbildungsabschluss', 'Abschluss einer anerkannten Berufsausbildung',
        'Meister-/Techniker- oder gleichwertiger Fachschulabschluss', 'Bachelor', 'Diplom/Magister/Master/Staatsexamen',
        'Promotion', 'Abschluss unbekannt'
    ].map((n) => ({name: n, value: n}));

    let stati = [
        'Umschüler/in', 'Schüler/in', 'Schulentlassen mit Studienabsicht', 'Student/in',
        'abgeschl. Studium mit Masterplan', 'Praktikant/in', 'Auszubildende/r', 'Freiwilliger Wehrdienst',
        'Hausfrau/-mann', 'beschäftigungslos', 'arbeitslos bei Agentur für Arbeit gemeldet', 'sozialversichert hauptbeschäftigt',
        'selbständig', 'Sonstiges', 'Wiederaufnahme Studium geplant'
    ].map((n) => ({name: n, value: n}));

    let experiences = [
        'Promoter', 'Kundenservice', 'Rezeption', 'sonstiger Job', 'Servicekraft',
        'Barkeeper', 'Koch', 'Barista', 'Model', 'Messehost/ess',
        'Eventhelfer', 'Verkäufer', 'keine Erfahrung', 'Logistik', 'Einzelhandel'
    ].sort().map((n) => ({name: n, value: n}));

    let shirtSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'].map((n) => ({name: n, value: n}));
    let pantSizesWoman = [32, 34, 36, 38, 40, 42, 44, 46, 48].map((n) => ({name: n, value: n}));
    let pantSizesMan = [46, 48, 50, 52, 54].map((n) => ({name: n, value: n}));

    const bindLicensee = (ev: CustomEvent) => {
        employee.images[licenseIndex].file = ev.detail.file
        employee.images[licenseIndex].documentNumber = ev.detail.text
        employee.images[licenseIndex].imageTag = ev.detail.type
        console.log(employee.images)
    }

    $: {
        if(employee.cv.motorvehicleLicense) {
            licenseIndex = employee.images.findIndex((n) => n.imageTag === 'license');
            if(licenseIndex < 0) {
                employee.images = [...employee.images, {documentNumber: '', imageTag: 'license', file: null}]
                licenseIndex = employee.images.length - 1
            }
        }
    }


    onMount(async() => {

        graduations = (await get('/hr/reference/Schulabschluss')).map((n) => ({...n, name: n.value}));
    })


</script>

<Box title="Qualifikationen">
    <div class="grid grid-cols-2 gap-3 mt-2">
        <div>
            <Label class="mb-2" for="graduation">Schulabschluss</Label>
            <Select id="graduation" bind:value={employee.cv.graduation} items={graduations} />
        </div>
        <div>
            <Label class="mb-2" for="graduation">Ausbildung</Label>
            <Select id="graduation" bind:value={employee.cv.degree} items={degrees} />
        </div>
        <div>
            <Label class="mb-2" for="graduation">Aktueller Status</Label>
            <Select id="graduation" bind:value={employee.cv.currentStatus} items={stati} />
        </div>
        <div>
            <Label class="mb-2" for="experience">Erfahrung</Label>
            <Select id="experience" bind:value={employee.cv.workExperiences} items={experiences} />
        </div>
        <div>
            <Label class="mb-2" for="shirt">Hemdgröße</Label>
            <Select id="shirt" bind:value={employee.cv.shirtSize} items={shirtSizes} />
        </div>
        <div>
            <div class="mt-6">
                <Toggle bind:checked={employee.cv.motorvehicleLicense} >Führerschein</Toggle>
            </div>
        </div>
        {#if employee.cv.motorvehicleLicense}
        <Tesseract options={[{name: 'Führerschein', value: 'license'}]} on:ocr={bindLicensee} />
        <div>
            <Label class="mb-2" for="license">Führerscheinnummer</Label>
            <Input id="license" bind:value={employee.images[licenseIndex].documentNumber} />
            <Helper class="mt-2" color="green">
                Bitte maschinell gescanntes Ergebnis überprüfen!
            </Helper>
        </div>
        {/if}
        <div>
            <Label class="mb-2" for="pants">Hosengröße</Label>
            <Select id="pants" bind:value={employee.cv.pantsSize} items={employee.gender === 'male' ? pantSizesMan : pantSizesWoman} />
        </div>
        <div>
            <Label class="mb-2" for="shoe">Schuhgröße (EU)</Label>
            <Select id="shoe" bind:value={employee.cv.shoeSize} >
                {#each [36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49] as size}
                    <option value={size}>{size}</option>
                {/each}
            </Select>
        </div>
        <div>
            <Label class="mb-2" for="graduation">Körpergröße (cm)</Label>
            <Input type="number" id="graduation" bind:value={employee.cv.height} />
        </div>
        <div>
            <Label class="mb-2" for="graduation">Haarfarbe</Label>
            <Input id="graduation" bind:value={employee.cv.hairColor} />
        </div>

    </div>
</Box>