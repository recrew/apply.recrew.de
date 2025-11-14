<script lang="ts">
import Box from "$lib/components/Box.svelte";
import {Button, Input, Label, Modal, Select, Toggle, Alert} from "flowbite-svelte";
import {onMount} from "svelte";
import {get} from "$lib/api";
import DocumentUpload from "$lib/components/DocumentUpload.svelte";
import {reactToBoxInteraction} from "$lib/utils/openStep";
import {currentStep} from "$lib/stores/currentStep";
import {BellRingOutline, CheckCircleOutline, InfoCircleSolid} from "flowbite-svelte-icons";
    import {blocked} from "$lib/stores/blocked";
    import markEmptyFields from "$lib/utils/markEmptyFields";
    import uploadImages from "$lib/utils/uploadImages";
    import updateCall from "$lib/utils/updateCall";
    export let employee: any;


    let graduations : any[] = [];
    let loading = false;
    let licenseBlocked = false;
    let studentBlocked = false;

    let degrees = [
        'Ohne beruflichen Ausbildungsabschluss', 'Abschluss einer anerkannten Berufsausbildung',
        'Meister-/Techniker- oder gleichwertiger Fachschulabschluss', 'Bachelor', 'Diplom/Magister/Master/Staatsexamen',
        'Promotion', 'Abschluss unbekannt'
    ].map((n) => ({name: n, value: n}));

    let stati = [
        'Umschüler(in)', 'Schüler(in)', 'Schulentlassen mit Studienabsicht', 'Student(in)',
        'abgeschl. Studium mit Masterplan', 'Praktikant(in)', 'Auszubildende(r)', 'Freiwilliger Wehrdienst',
        'Hausfrau/-mann', 'beschäftigungslos', 'arbeitslos bei Agentur für Arbeit gemeldet', 'sozialversichert hauptbeschäftigt',
        'selbständig', 'Sonstiges', 'Wiederaufnahme Studium geplant'
    ].map((n) => ({name: n, value: n}));

    let experiences = [
        'Promoter', 'Kundenservice', 'Rezeption', 'sonstiger Job', 'Servicekraft',
        'Barkeeper', 'Koch', 'Barista', 'Model', 'Messehost/ess',
        'Eventhelfer', 'Verkäufer', 'keine Erfahrung', 'Logistik', 'Einzelhandel'
    ].sort().map((n) => ({name: n, value: n}));

    let shirtSizes = ['XXS', 'XS', 'S', 'M', 'L', 'XL', 'XXL'].map((n) => ({name: n, value: n}));
    let pantSizesWoman = [32, 34, 36, 38, 40, 42, 44, 46, 48].map((n) => ({name: n, value: "" + n}));
    let pantSizesMan = [46, 48, 50, 52, 54, 56].map((n) => ({name: n, value: "" + n}));

    // Upload bindings handled by DocumentUpload
    $: hasHealthCertUploaded = employee.images.some(i => i.imageTag === 'health-certificate' && (i.file || i.location));

    $: dataComplete = employee.status && employee.cv.graduation && employee.cv.degree && employee.cv.workExperiences && employee.cv.shirtSize && employee.cv.pantsSize && employee.cv.shoeSize && employee.cv.height && employee.cv.hairColor;
    $: $blocked = !dataComplete;
    const proceed = async () => {
        if(!markEmptyFields()){
            return;
        }
        loading = true;
        try{
            await uploadImages(employee, employee.uuid)
            await updateCall(employee)
            currentStep.update((n) => n + 1)
        } catch (e) {
            alert('Fehler beim Hochladen der Bilder. Bitte prüfen Sie Ihren Browser, ob alle Dateien nicht zu groß sind. ')
        } finally {
            loading = false
        }
    }

    onMount(async() => {
        //markEmptyFields();


        if (!employee.healthCertificates) {
            employee.healthCertificates = [];
        }
        graduations = (await get('/hr/reference/Schulabschluss')).map((n) => ({...n, name: n.value}));
        stati = (await get('/hr/references/stati')).map((n) => ({name: n, value: n}));
    })


</script>
<Modal open={loading} title="Upload">
    <p>Bitte warten...</p>
</Modal>
<Box disabled={$blocked} title="Qualifikationen" open={$currentStep === 2} on:open={ev => reactToBoxInteraction(ev, 2)} icon={dataComplete ? CheckCircleOutline : BellRingOutline}>
    <div class="grid md:grid-cols-2 gap-y-3 gap-x-4 mt-2">
        <div>
            <Label class="mb-2" for="graduation">Schulabschluss *</Label>
            <Select id="graduation" bind:value={employee.cv.graduation} items={graduations} required/>
        </div>
        <div>
            <Label class="mb-2" for="edu">Ausbildung *</Label>
            <Select id="edu" bind:value={employee.cv.degree} items={degrees} required/>
        </div>
        <div>
            <Label class="mb-2" for="status">Aktueller Status *</Label>
            <Select id="status" bind:value={employee.status} items={stati} required/>
        </div>
        {#if employee.status === 'Student'}
            <div class="md:col-span-1">
                <DocumentUpload kind="student-verification" bind:employee bind:blocked={studentBlocked} />
            </div>
        {/if}
        <div>
            <Label class="mb-2" for="experience">Erfahrung *</Label>
            <Select id="experience" bind:value={employee.cv.workExperiences} items={experiences} required/>
        </div>
        <div>
            <Label class="mb-2" for="shirt">Hemdgröße *</Label>
            <Select id="shirt" bind:value={employee.cv.shirtSize} items={shirtSizes} required/>
        </div>
        <div class="mt-8">
            <Toggle bind:checked={employee.cv.motorVehicleLicense} >Führerschein</Toggle>
        </div>
        {#if employee.cv.motorVehicleLicense}
            <div class="md:col-span-2">
                <DocumentUpload kind="license" bind:employee bind:blocked={licenseBlocked} />
            </div>
        {/if}
        <div>
            <Label class="mb-2" for="pants">Hosengröße *</Label>
            <Select id="pants" bind:value={employee.cv.pantsSize} items={employee.gender === 'male' ? pantSizesMan : pantSizesWoman} required/>
        </div>
        <div>
            <Label class="mb-2" for="shoe">Schuhgröße (EU) *</Label>
            <Select id="shoe" bind:value={employee.cv.shoeSize} required>
                {#each [36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53] as size}
                    <option value={size}>{size}</option>
                {/each}
            </Select>
        </div>
        <div>
            <Label class="mb-2" for="graduation">Körpergröße (cm) *</Label>
            <Input type="number" id="graduation" bind:value={employee.cv.height} required/>
        </div>
        <div>
            <Label class="mb-2" for="graduation">Haarfarbe *</Label>
            <Input id="graduation" bind:value={employee.cv.hairColor} required/>
        </div>
    </div>

    <!-- Gesundheitszeugnis Upload -->
    <div class="mt-6">
        <DocumentUpload
            kind="health-certificate"
            bind:employee
        />
    </div>

    <Button on:click={() => proceed()} class="mt-5 w-full">Weiter</Button>
</Box>
