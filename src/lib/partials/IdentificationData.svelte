<script lang="ts">
    import {
        Alert,
        Button,
        Heading,
        Input,
        Label,
        Modal,
        Select,
    } from "flowbite-svelte";
    import { formDataPost, get } from "$lib/api";
    import { onMount } from "svelte";
    import Box from "$lib/components/Box.svelte";
    import {
        BellRingOutline,
        CheckCircleOutline,
        GlobeSolid,
    } from "flowbite-svelte-icons";
    import { reactToBoxInteraction } from "$lib/utils/openStep";
    import { currentStep } from "$lib/stores/currentStep";
    import { fileNameGenerator } from "$lib/utils/fileNameGenerator";
    import markEmptyFields from "$lib/utils/markEmptyFields";
    import { blocked } from "$lib/stores/blocked";
    import { page } from "$app/stores";
    import uploadImages from "$lib/utils/uploadImages";
    import dayjs from "dayjs";
    import customParseFormat from "dayjs/plugin/customParseFormat";

    import updateCall from "$lib/utils/updateCall";
    import IdWizard from "$lib/components/IdWizard.svelte";
    import PassportWizard from "$lib/components/PassportWizard.svelte";
    import { formComplete } from "$lib/stores/formComplete";
    import Typeahead from "$lib/components/Typeahead.svelte";
    import AddressData from "./AddressData.svelte";

    export let employee: any;

    dayjs.extend(customParseFormat);

    let nationalities: any[] = [];
    let countries: any[] = [];
    let avatarFiles: FileList | any;
    let loading = false;

    let idOption: string;
    let documentNumber: string;
    let currentFile: File;

    const sendIdImage = async (
        payload: any,
        type: string = "id-card",
        front: boolean = true,
    ): Promise<void> => {
        let image;
        let side = front ? "Vorderseite" : "Rückseite";
        employee.images = employee.images.filter(
            (n: any) => n.imageTag !== idOption,
        );
        image = {
            employeeUuid: employee.uuid,
            imageTag: idOption,
            file: currentFile,
            name: fileNameGenerator(payload.file, employee, type, side),
        };
        loading = true;
        await formDataPost(
            "/hr/application/" + $page.url.searchParams.get("sheet") + "/image",
            image,
        )
            .then((res) => {
                employee.images = [...employee.images, res];
            })
            .finally(() => {
                loading = false;
            });
    };

    const handleOCRInfo = (
        payload: CustomEvent,
        front: boolean = true,
    ): void => {
        if (front) {
            employee.images[0].documentNumber = payload.detail.idNumber;
            documentNumber = payload.detail.idNumber;
            employee.firstName = payload.detail.firstName || employee.firstName;
            employee.lastName = payload.detail.lastName || employee.lastName;
            employee.dateOfBirth.value =
                dayjs(payload.detail.dateOfBirth, "DD.MM.YYYY").format(
                    "YYYY-MM-DD",
                ) || employee.dateOfBirth.value;
            employee.cv.nationality =
                payload.detail.placeOfBirth || employee.cv.nationality;
            employee.maidenName =
                payload.detail.maidenName || employee.maidenName;
            employee.gender = payload.detail.sex === "M" ? "male" : "female";
            employee.cv.countryOfBirth =
                payload.detail.countryOfBirth || employee.cv.countryOfBirth;
        } else {
            employee.address = {
                country:
                    payload.detail.address.country || employee.address?.country,
                place: payload.detail.address.place || employee.address?.place,
                street:
                    payload.detail.address.street || employee.address?.street,
                number:
                    payload.detail.address.number || employee.address?.number,
                zip: payload.detail.address.postalCode || employee.address?.zip,
            };
        }
        currentFile = payload.detail.file;
        sendIdImage(payload.detail, idOption, front);
    };

    let dataComplete = false;
    $: {
        const idFront =
            employee.images[0]?.file || employee.images[0]?.location;
        const idBack = employee.images[1]?.file || employee.images[1]?.location;
        const isIdCard = employee.images[0]?.imageTag === "id-card";
        const idDocsComplete = isIdCard ? idFront && idBack : idFront;

        dataComplete =
            employee.firstName &&
            employee.lastName &&
            employee.gender &&
            employee.dateOfBirth.value &&
            employee.cv.countryOfBirth &&
            employee.cv.nationality &&
            idDocsComplete &&
            employee.address.country;

        $blocked = !dataComplete;

        if (avatarFiles && avatarFiles.length > 0) {
            employee.avatarFile = avatarFiles[0];
        }
    }

    const saveImages = async () => {
        loading = true;
        try {
            await uploadImages(employee, $page.url.searchParams.get("sheet"));
            currentStep.update((n) => n + 1);
        } catch (e) {
            alert(
                "Fehler beim Hochladen der Bilder. Bitte prüfen Sie Ihren Browser, ob alle Dateien nicht zu groß sind. ",
            );
        } finally {
            loading = false;
        }
    };

    const proceed = async () => {
        if (!dataComplete) {
            markEmptyFields();
            currentStep.update((n) => n + 1);
        } else {
            await updateCall(employee);
        }
    };

    onMount(async () => {
        nationalities = (await get("/hr/reference/Staatsangehoerigkeiten"))
            .map((n: any) => ({ ...n, name: n.value }))
            .sort((a: any, b: any) => a.name.localeCompare(b.name));
        countries = (await get("/hr/reference/Staaten"))
            .map((n: any) => ({ ...n, name: n.value }))
            .sort((a: any, b: any) => a.name.localeCompare(b.name));
        if (
            employee.images.find(
                (n: any) => n.imageTag === "id-card" && n.location,
            )
        ) {
            idOption = "id-card";
        } else if (
            employee.images.find(
                (n: any) => n.imageTag === "passport" && n.location,
            )
        ) {
            idOption = "passport";
        }
    });
</script>

<Modal open={loading} title="Upload">
    <p>Bitte warten...</p>
</Modal>
<Box
    disabled={!dataComplete}
    title="Identifikation Daten"
    open={$currentStep === 1}
    on:open={(ev) => reactToBoxInteraction(ev, 1)}
    icon={dataComplete ? CheckCircleOutline : BellRingOutline}
>
    <div>
        <Label for="idOption" class="mb-2">Ausweisart *</Label>
        <Select bind:value={idOption} id="idOption" required>
            <option value="id-card">Personalausweis</option>
            <option value="passport">Reisepass</option>
        </Select>
    </div>

    {#if idOption === "id-card"}
        <IdWizard
            on:formCompleted={() => formComplete.set(true)}
            on:ocrFrontRead={handleOCRInfo}
            on:ocrBackRead={(e) => handleOCRInfo(e, false)}
        />
    {:else if idOption === "passport"}
        <PassportWizard on:formCompleted={() => formComplete.set(true)} />
    {/if}

    {#if $formComplete}
        <div class="flex flex-col space-y-3 mt-16">
            <Heading class="text-neutral-600" tag="h5"
                >Basic Information</Heading
            >
            <div class="flex-1 space-y-3">
                <Label class="mb-2" for="documentNumber">Dokumentenummer</Label>
                <Input
                    type="text"
                    id="documentNumber"
                    bind:value={documentNumber}
                    required
                />
            </div>
            <div class="md:flex space-y-3 md:space-y-0 gap-3 justify-between">
                <div class="flex-1 space-y-3">
                    <Label class="mb-2" for="firstName">Vorname</Label>
                    <Input
                        type="text"
                        id="firstName"
                        bind:value={employee.firstName}
                        required
                    />
                </div>
                <div class="flex-1 space-y-3">
                    <Label class="mb-2" for="lastName">Nachname</Label>
                    <Input
                        type="text"
                        id="lastName"
                        bind:value={employee.lastName}
                        required
                    />
                </div>
            </div>
            <div class="md:flex space-y-3 md:space-y-0 gap-3 justify-between">
                <div class="flex-1 space-y-3">
                    <Label for="nationality" class="mb-2"
                        >Staatsanghörigkeit *</Label
                    >
                    <Typeahead
                        bind:value={employee.cv.nationality}
                        id="nationality"
                        data={nationalities}
                        icon={GlobeSolid}
                        required
                    />
                </div>
                <div class="flex-1 space-y-3">
                    <Label for="gender" class="mb-2">Geschlecht *</Label>
                    <Select bind:value={employee.gender} id="gender" required>
                        <option value="female">Frau</option>
                        <option value="male">Herr</option>
                        <option value="diverse">Divers</option>
                    </Select>
                </div>
            </div>

            <div class="md:flex space-y-3 md:space-y-0 gap-3 justify-between">
                <div class="flex-1 space-y-3">
                    <Label for="placeOfBirth" class="mb-2">Geburtsort *</Label>
                    <Input
                        type="text"
                        bind:value={employee.cv.placeOfBirth}
                        id="placeOfBirth"
                        required
                    />
                </div>
                <div class="flex-1 space-y-3">
                    <Label for="countryOfBirth" class="mb-2"
                        >Geburtsland *</Label
                    >
                    <Typeahead
                        required
                        bind:value={employee.cv.countryOfBirth}
                        id="countryOfBirth"
                        data={countries}
                        icon={GlobeSolid}
                    />
                </div>
            </div>

            <div class="md:flex space-y-3 md:space-y-0 gap-3 justify-between">
                <div class="flex-1 space-y-3">
                    <Label for="dob" class="mb-2">Geburtsdatum *</Label>
                    <Input
                        type="date"
                        bind:value={employee.dateOfBirth.value}
                        id="dob"
                        required
                    />
                    {#if employee.dateOfBirth?.value && dayjs().diff(dayjs(employee.dateOfBirth.value), "years") < 18}
                        <Alert class="mt-2" color="yellow"
                            >Hinweis: Unter 18!</Alert
                        >
                    {/if}
                </div>
                <div class="flex-1 space-y-3">
                    <Label for="maidenName" class="mb-2">Geburtsname *</Label>
                    <Input
                        pattern="[A-Z][A-Za-z\-]+"
                        bind:value={employee.maidenName}
                        placeholder="Geburtsname"
                        type="text"
                        id="maidenName"
                        required
                    />
                </div>
            </div>
            <Heading class="text-neutral-600 pt-9" tag="h5">Adresse</Heading>
            <AddressData bind:employee />
        </div>
    {/if}

    <Button on:click={() => proceed()} class="mt-5 w-full">Weiter</Button>
</Box>
