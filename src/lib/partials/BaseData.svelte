<script lang="ts">
    import {
        Alert, Avatar,
        Fileupload,
        Heading,
        Helper,
        Input,
        Label,
        Listgroup,
        ListgroupItem,
        P,
        Select
    } from "flowbite-svelte";
    import {get} from "$lib/api";
    import {onMount} from "svelte";
    import Box from "$lib/components/Box.svelte";
    import AddressData from "$lib/partials/AddressData.svelte";
    import Tesseract from "$lib/components/Tesseract.svelte";
    import Typeahead from "$lib/components/Typeahead.svelte";
    import {GlobeSolid} from "flowbite-svelte-icons";

    export let employee: any

    let items: any[] = [];
    let files: File[];
    let avatarFiles: FileList;

    let idOptions = [
        {name: "Personalausweis Vorderseite", value: "id-card"},
        {name: "Reisepass Vorderseite", value: "passport"},
    ]

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

    const idReader = (detail: any, index?: number) => {
        employee.images[index ?? 0].file = detail.file
        employee.images[index ?? 0].documentNumber = detail.text
        employee.images[index ?? 0].imageTag = detail.type

    }
    $: {
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
    onMount(async () => {
        if(employee.images.length < 1){
            employee.images = [{documentNumber: '', imageTag: 'id-card', file: null},{documentNumber: '', imageTag: 'id-card', file: null}]
        }
        if(employee.dateOfBirth.value){
            employee.dateOfBirth.value = employee.dateOfBirth.value.split(' ')[0]
        }
        items = await get('/hr/reference/Staatsangehoerigkeiten')
        items = items.map((n) => ({...n, name: n.key})).sort((a,b) => a.name.localeCompare(b.name))
    })



</script>
<Box title="Persönliche Daten">
    <Label for="avatarFile">
        <div class="text-sm rtl:text-right font-medium block text-gray-900 dark:text-gray-300 mb-2">Profilbild</div>
        <Avatar src={employee.avatarFile ? generateBlob() : ''} rounded size="xl" >{employee.firstName.charAt(0)+employee.lastName.charAt(0)}</Avatar>
    </Label>
    <input bind:files={avatarFiles} class="hidden" type="file" id="avatarFile"/>
    <div class="grid grid-cols-2 gap-3 mt-2">
        <div>
            <Label for="firstName" class="mb-2">Vorname</Label>
            <Input type="text" bind:value={employee.firstName} id="firstName" required/>
        </div>
        <div>
            <Label for="lastName" class="mb-2">Nachname</Label>
            <Input type="text" bind:value={employee.lastName} id="lastName" required/>
        </div>

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
            <Input type="text" bind:value={employee.cv.placeOfBirth} id="placeOfBirth" required/>
        </div>
        <div>
            <Label for="dob" class="mb-2">Geburtsdatum</Label>
            <Input type="date" bind:value={employee.dateOfBirth.value} id="dob" required/>
        </div>
        <div>
            <Label for="maidenName" class="mb-2">Geburtsname</Label>
            <Input bind:value={employee.maidenName} type="text" id="maidenName" />
        </div>
        <div>
            <Label for="familyStatus" class="mb-2">Familienstand</Label>
            <Select bind:value={employee.cv.familyStatus} id="familyStatus">
                <option value="single">ledig / single</option>
                <option value="married">verheiratet</option>
                <option value="registered_partnership">eingetragene Lebenspartnerschaft</option>
                <option value="divorced">geschieden</option>
                <option value="widowed">verwitwet</option>
                <option value="other">nicht bekannt</option>
            </Select>
        </div>
        <div>
            <Label for="nationality" class="mb-2">Staatsanghörigkeit</Label>
            <Typeahead bind:value={employee.cv.nationality} id="nationality" data={items} icon={GlobeSolid} />
        </div>

    </div>
    {#if employee.cv.nationality && !isEu(employee.cv.nationality)}
        <Alert class="mt-3" border color="red">
            <Heading tag="h4">Staatsangehörigkeit außerhalb EWR</Heading>
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
        </Alert>
    {:else if employee.cv.nationality}
        <div class="grid grid-cols-2 gap-3 mt-2">
            <div>
                <Tesseract value={employee.images.find((n) => n.imageTag === 'id-card' || n.imageTag === 'passport')} options={idOptions} on:ocr={ev => idReader(ev.detail)}/>
            </div>
            {#if employee.images[0]?.file}
            <div>
                <Tesseract
                        value={employee.images.filter((n) => n.imageTag === 'id-card' || n.imageTag === 'passport')[1]}
                        options={idOptions.filter((n) => n.value === employee.images[0].imageTag).map((n) => ({...n, name: n.name.replace('Vorderseite', 'Rückseite')}))}
                        noRead={true}
                        on:ocr={ev => idReader(ev.detail, 1)}/>
            </div>
            <div>
                <Label for="id" class="mb-2">{employee.images[0].imageTag === 'id-card' ? 'Personalausweis' : 'Reisepass'}nummer</Label>
                <Input bind:value={employee.images[0].documentNumber} type="text" id="id" required />
                <Helper class="mt-2" color="green">
                    Bitte maschinell gescanntes Ergebnis überprüfen!
                </Helper>
            </div>
            {/if}
        </div>
    {/if}


    <AddressData bind:employee/>
</Box>