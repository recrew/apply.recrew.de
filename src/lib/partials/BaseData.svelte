<script lang="ts">
    import {
        Alert, Avatar, Button,
        Heading,
        Input,
        Label,
        Modal,
        P,
        Select
    } from "flowbite-svelte";
    import {get} from "$lib/api";
    import {onMount} from "svelte";
    import Box from "$lib/components/Box.svelte";
    import AddressData from "$lib/partials/AddressData.svelte";
    import Typeahead from "$lib/components/Typeahead.svelte";
    import {
        ArrowUpOutline,
        BellRingOutline,
        CheckCircleOutline,
        GlobeSolid
    } from "flowbite-svelte-icons";
    import {reactToBoxInteraction} from "$lib/utils/openStep";
    import {currentStep} from "$lib/stores/currentStep";
    import markEmptyFields from "$lib/utils/markEmptyFields";
    import {blocked} from "$lib/stores/blocked";
    import {page} from "$app/stores";
    import uploadImages from "$lib/utils/uploadImages";
    import dayjs from "dayjs";
    import updateCall from "$lib/utils/updateCall";
    import DocumentUpload from "$lib/components/DocumentUpload.svelte";

    export let employee: any

    let nationalities: any[] = [];
    let countries: any[] = [];
    let avatarFiles: FileList;
    let loading = false;

    let idBlocked = true;

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

    let dataComplete = false;
    $: {
        dataComplete = employee.firstName && employee.lastName && employee.gender && employee.dateOfBirth.value && employee.cv.countryOfBirth && employee.cv.nationality && !idBlocked && employee.address.country

        /*if(employee) {
            markEmptyFields();
        }*/

        $blocked = !dataComplete

        if(avatarFiles && avatarFiles.length > 0){
            employee.avatarFile = avatarFiles[0]
        }
    }
    const generateBlob = () => {
        if(typeof employee.avatarFile === 'string'){
            return employee.avatarFile
        }
        return URL.createObjectURL(employee.avatarFile)
    }

    const saveImages = async () => {
        loading = true;
        try{
            await uploadImages(employee, $page.url.searchParams.get('sheet'))
            currentStep.update((n) => n + 1)
        } catch (e) {
            alert('Fehler beim Hochladen der Bilder. Bitte prüfen Sie Ihren Browser, ob alle Dateien nicht zu groß sind. ')
        } finally {
            loading = false
        }
    }

    const proceed = async () => {
        if(!dataComplete){
            markEmptyFields()
        } else {
            await saveImages()
            await updateCall(employee)
        }

    }

    //$:dataComplete = employee.firstName && employee.lastName && employee.gender && employee.dateOfBirth.value && employee.cv.countryOfBirth && employee.cv.nationality && (employee.images[0]?.file || employee.images[0]?.location) && employee.address.country

    onMount(async () => {
        if(!employee.images){
            employee.images = []
        }
        nationalities = (await get('/hr/reference/Staatsangehoerigkeiten')).map((n) => ({...n, name: n.value})).sort((a,b) => a.name.localeCompare(b.name))
        countries = (await get('/hr/reference/Staaten')).map((n) => ({...n, name: n.value})).sort((a,b) => a.name.localeCompare(b.name))

    })



</script>
<Modal open={loading} title="Upload">
    <p>Bitte warten...</p>
</Modal>
<Box disabled={!dataComplete} title="Persönliche Daten" open={$currentStep === 1} on:open={ev => reactToBoxInteraction(ev, 1)} icon={dataComplete ? CheckCircleOutline : BellRingOutline}>
    <Label for="avatarFile">
        <div class="text-sm rtl:text-right font-medium block text-gray-900 dark:text-gray-300 mb-2">Profilbild</div>
        <Avatar src={employee.avatarFile ? generateBlob() : ''} rounded size="xl" >{employee.firstName.charAt(0)+employee.lastName.charAt(0)}</Avatar>
    </Label>
    <input bind:files={avatarFiles} class="hidden" type="file" id="avatarFile"/>
    <div class="grid md:grid-cols-2 gap-3 mt-8">
        <div>
            <Label for="firstName" class="mb-2">Vorname *</Label>
            <Input type="text" bind:value={employee.firstName} id="firstName" required/>
        </div>
        <div>
            <Label for="lastName" class="mb-2">Nachname *</Label>
            <Input type="text" bind:value={employee.lastName} id="lastName" required/>
        </div>

        <div>
            <Label for="gender" class="mb-2">Geschlecht *</Label>
            <Select bind:value={employee.gender} id="gender" required>
                <option value="female">Frau</option>
                <option value="male">Herr</option>
                <option value="diverse">Divers</option>
            </Select>
        </div>
        <div>
            <Label for="placeOfBirth" class="mb-2">Geburtsort *</Label>
            <Input type="text" bind:value={employee.cv.placeOfBirth} id="placeOfBirth" required/>
        </div>
        <div>
            <Label for="countryOfBirth" class="mb-2">Geburtsland *</Label>
            <Typeahead required bind:value={employee.cv.countryOfBirth} id="countryOfBirth" data={countries} icon={GlobeSolid} />
        </div>
        <div>
            <Label for="dob" class="mb-2">Geburtsdatum *</Label>
            <Input type="date" bind:value={employee.dateOfBirth.value} id="dob" required/>
            {#if employee.dateOfBirth?.value && dayjs().diff(dayjs(employee.dateOfBirth.value), 'years') < 18}
                <Alert class="mt-2" color="yellow">Hinweis: Unter 18!</Alert>
            {/if}
        </div>
        <div>
            <Label for="maidenName" class="mb-2">Geburtsname *</Label>
            <Input pattern="[A-Z][A-Za-z-]+" bind:value={employee.maidenName} placeholder="Nachname" type="text" id="maidenName" required/>
        </div>
        <div>
            <Label for="familyStatus" class="mb-2">Familienstand *</Label>
            <Select bind:value={employee.cv.familyStatus} id="familyStatus" required>
                <option value="single">ledig / single</option>
                <option value="married">verheiratet</option>
                <option value="registered_partnership">eingetragene Lebenspartnerschaft</option>
                <option value="divorced">geschieden</option>
                <option value="widowed">verwitwet</option>
                <option value="other">nicht bekannt</option>
            </Select>
        </div>
        <div class="md:col-span-2">
            <Label for="nationality" class="mb-2">Staatsanghörigkeit *</Label>
            <Typeahead bind:value={employee.cv.nationality} id="nationality" data={nationalities} icon={GlobeSolid} required/>
        </div>

    </div>
    {#if employee.cv.nationality && !isEu(employee.cv.nationality)}
        <Alert class="mt-3" border color="red">
            <Heading tag="h4">Staatsangehörigkeit außerhalb EWR</Heading>
            <P class="dark:text-white">Die Bearbeitung geht schneller, wenn du erforderliche Dokumente (Aufenthaltserlaubnis, Arbeitserlaubnis, etc) schon bereit stellst. Aber keine Sorge, du kannst diese Nachweise auch später nachreichen.</P>
            <div class="mt-2">
                <Label class="pb-2" for="non_eea_upload">Datei hochladen</Label>
                <DocumentUpload bind:employee kind="non-eea" />
            </div>
        </Alert>
    {/if}
    {#if employee.cv.nationality}
        <div class="md:col-span-2">
            <DocumentUpload bind:employee kind="id" bind:blocked={idBlocked}/>
        </div>
        {#if idBlocked}
            <Alert class="mt-3" border color="red">
                <div class="flex gap-3">
                    <ArrowUpOutline /> Bitte Dokument hochladen
                </div>
            </Alert>
        {/if}

        <!--<div class="grid md:grid-cols-2 gap-3 mt-2">

            <div>
                <Tesseract value={employee.images.find((n) => (n.imageTag === 'id-card' || n.imageTag === 'passport') && n.documentNumber)} options={idOptions} on:ocr={ev => idReader(ev.detail, idIndex > -1 ? idIndex : 0)}/>
            </div>
            {#if idIndex > -1 && (employee.images[idIndex]?.file || employee.images[idIndex]?.location)}
            <div>
                <Tesseract
                        value={employee.images.find((n) => (n.imageTag === 'id-card' || n.imageTag === 'passport') && !n.documentNumber)}
                        options={idOptions.filter((n) => n.value === employee.images[0].imageTag).map((n) => ({...n, name: n.name.replace('Vorderseite', 'Rückseite')}))}
                        noRead={true}
                        on:ocr={ev => idReader(ev.detail, 1)}/>
            </div>

            {/if}
            {#if employee.images.find((n) => (n.imageTag === 'id-card' || n.imageTag === 'passport')) && idIndex > -1}
            <div>
                <Label for="id" class="mb-2">{employee.images.find((n) => (n.imageTag === 'id-card' || n.imageTag === 'passport') && n.documentNumber)?.imageTag === 'id-card' ? 'Personalausweis' : 'Reisepass'}nummer *</Label>
                <Input placeholder="{employee.images.find((n) => (n.imageTag === 'id-card' || n.imageTag === 'passport') && n.documentNumber)?.imageTag === 'id-card' ? 'XY1234A12' : 'ABC456789'}" bind:value={employee.images[idIndex].documentNumber} type="text" id="id" required />
                <Helper class="mt-2" color="green">
                    Bitte maschinell gescanntes Ergebnis überprüfen!
                </Helper>
            </div>
            {/if}
        </div>-->
    {/if}


    <AddressData bind:employee/>

    <Button on:click={() => proceed()} class="mt-5 w-full">Weiter</Button>
</Box>
