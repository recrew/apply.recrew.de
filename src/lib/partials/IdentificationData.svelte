<script lang="ts">
    import {
        Alert,
        Button,
        Heading,
        Input,
        Label,
        Modal,
        Select,
        Fileupload,
        Listgroup,
        ListgroupItem,
        P
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
    import dayjs from "dayjs";
    import { latestImageByTag, imageHasSide } from "$lib/utils/imageUtils";
    import customParseFormat from "dayjs/plugin/customParseFormat";
    import updateCall from "$lib/utils/updateCall";
    import DocumentWizard from "$lib/components/DocumentWizard.svelte";
    import { formComplete } from "$lib/stores/formComplete";
    import Typeahead from "$lib/components/Typeahead.svelte";
    import { isEu } from "$lib/utils/isEu";

    export let employee: any;

    dayjs.extend(customParseFormat);

    let nationalities: any[] = [];
    let countries: any[] = [];
    let loading = false;
    let nonEuFiles: File[] = [];

    let idOption: string = "id-card";
    let documentNumber: string;
    let currentFile: File;
    let pendingFrontPayload: any = null;

    let initialValues: any = {};

    const getInputClass = (fieldName: string) =>
        changedFields.has(fieldName)
            ? "ring-2 ring-blue-500 ring-offset-1 ring-offset-white"
            : "";

    // Einzige Quelle der überwachten Felder — initialValues in onMount wird
    // aus demselben Objekt gebaut.
    $: currentValues = <Record<string, any>>{
        documentNumber,
        firstName: employee.firstName,
        lastName: employee.lastName,
        nationality: employee.cv.nationality,
        gender: employee.gender,
        placeOfBirth: employee.cv.placeOfBirth,
        countryOfBirth: employee.cv.countryOfBirth,
        dateOfBirth: employee.dateOfBirth.value,
        maidenName: employee.maidenName,
    };

    $: initialReady = Object.keys(initialValues).length > 0;

    $: changedFields = new Set(
        initialReady
            ? Object.keys(currentValues).filter(
                  (name) => currentValues[name] !== initialValues[name],
              )
            : [],
    );

    const sendIdImage = async (
        payload: any,
        type: string = "id-card",
        front: boolean = true,
    ): Promise<void> => {
        const side = front ? "Vorderseite" : "Rückseite";
        const imageTag = type;

        employee.images = employee.images.filter(
            (n: any) => n.imageTag !== imageTag || !imageHasSide(n, side),
        );

        const image = {
            documentNumber: payload.idNumber ?? null,
            employeeUuid: employee.uuid,
            imageTag,
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

    const parseDateOfBirth = (raw: string): string => {
        const parsed = dayjs(raw, "DD.MM.YYYY");
        return parsed.isValid() ? parsed.format("YYYY-MM-DD") : "";
    };

    const sexToGender = (sex: string): "female" | "male" | "diverse" => {
        if (!sex) return "diverse";
        const s = sex.toLowerCase();
        if (["f", "female"].includes(s)) return "female";
        if (["m", "male"].includes(s)) return "male";
        return "diverse";
    };

    const applyCommonOcrFields = (detail: any): void => {
        if (detail.idNumber) documentNumber = detail.idNumber;
        if (detail.firstName) employee.firstName = detail.firstName;
        if (detail.lastName) employee.lastName = detail.lastName;
        if (detail.maidenName) employee.maidenName = detail.maidenName;
        const dob = parseDateOfBirth(detail.dateOfBirth);
        if (dob) employee.dateOfBirth.value = dob;
        if (detail.placeOfBirth) employee.cv.placeOfBirth = detail.placeOfBirth;
        if (detail.nationality) employee.cv.nationality = detail.nationality;
        if (detail.sex) {
            employee.gender = sexToGender(detail.sex);
        }
    };

    let streetMissingWarning = false;

    const handleOCRInfoId = async (
        payload: CustomEvent,
        front: boolean = true,
    ): Promise<void> => {
        const docType = payload.detail.docType ?? idOption;
        if (payload.detail.docType) idOption = payload.detail.docType;

        if (front) {
            applyCommonOcrFields(payload.detail);
            pendingFrontPayload = { ...payload.detail, docType };
            await updateCall(employee);
        } else {
            if (payload.detail.idNumber) documentNumber = payload.detail.idNumber;
            if (payload.detail.country) employee.cv.countryOfBirth = payload.detail.country;
            if (payload.detail.height) employee.cv.height = payload.detail.height;
            employee.address = {
                country: payload.detail.address?.country || employee.address?.country || "Deutschland",
                place: payload.detail.address?.place || employee.address?.place || null,
                street: payload.detail.address?.street || employee.address?.street || null,
                number: payload.detail.address?.number ?? employee.address?.number ?? null,
                zip: payload.detail.address?.zip || employee.address?.zip || null,
            };
            streetMissingWarning = !!payload.detail.streetMissingOcrLines;

            // Upload front with corrected documentNumber from back MRZ
            if (pendingFrontPayload) {
                currentFile = pendingFrontPayload.file;
                await sendIdImage({ ...pendingFrontPayload, idNumber: documentNumber }, docType, true);
                pendingFrontPayload = null;
            }

            currentFile = payload.detail.file;
            await sendIdImage({ ...payload.detail, idNumber: documentNumber }, docType, false);
            syncDocumentNumberToImage();
            await updateCall(employee);
        }
    };

    const handleOCRInfo = async (payload: CustomEvent): Promise<void> => {
        const docType = payload.detail.docType ?? idOption;
        const ocrDocumentNumber = payload.detail.idNumber;
        if (payload.detail.docType) idOption = payload.detail.docType;

        const { firstName, lastName, maidenName } = payload.detail.passportBio ?? {};
        applyCommonOcrFields({ ...payload.detail, firstName, lastName, maidenName });

        currentFile = payload.detail.file;
        await sendIdImage(payload.detail, docType);
        if (ocrDocumentNumber) documentNumber = ocrDocumentNumber;
        syncDocumentNumberToImage();
        await updateCall(employee);
    };

    let dataComplete = false;
    let docsComplete = false;

    // 1. Calculate document completeness
    $: {
        const idImages = (employee.images ?? []).filter(img => img.imageTag === idOption);
        
        const isIdCard = idOption === "id-card";

        const hasFront = isIdCard
            ? idImages.some(img => imageHasSide(img, "Vorderseite"))
            : idImages.length > 0;
        const hasBack = isIdCard ? idImages.some(img => imageHasSide(img, "Rückseite")) : true;

        docsComplete = !!(hasFront && hasBack);
    }

    // 2. Calculate data completeness (removed address fields)
    $: dataComplete =
        !!(documentNumber &&
        employee.firstName &&
        employee.lastName &&
        employee.maidenName &&
        employee.cv.nationality &&
        employee.gender &&
        employee.cv.placeOfBirth &&
        employee.cv.countryOfBirth &&
        employee.dateOfBirth.value);

    // 3. Update stores based on calculated completeness
    $: if ($currentStep === 1) {
        $blocked = !dataComplete || !docsComplete;
    }
    $: formComplete.set(docsComplete);

    // 4. Sync documentNumber back to the images array for persistence
    $: loadDocumentNumber(idOption);

    function loadDocumentNumber(type: string) {
        const latest = latestImageByTag(employee.images ?? [], type);
        documentNumber = latest?.documentNumber ?? "";
    }

    function syncDocumentNumberToImage() {
        if (!documentNumber || !employee.images) return;
        const tag = idOption;
        let changed = false;
        for (const img of employee.images) {
            if (img.imageTag === tag && img.documentNumber !== documentNumber) {
                img.documentNumber = documentNumber;
                changed = true;
            }
        }
        if (changed) employee.images = [...employee.images];
    }

    // Keep manual corrections in the persisted image records as well.
    $: if (documentNumber && employee.images) {
        syncDocumentNumberToImage();
    }

    const proceed = async () => {
        if (!dataComplete || !docsComplete) {
            markEmptyFields();
        } else {
            // Upload Non-EU files if any
            if (nonEuFiles && nonEuFiles.length > 0) {
                loading = true;
                for (const file of nonEuFiles) {
                    if (file) {
                        try {
                            const image = {
                                employeeUuid: employee.uuid,
                                imageTag: "work-permit",
                                file: file,
                                name: fileNameGenerator(file, employee, "work-permit", ""),
                            };
                            const res = await formDataPost(
                                "/hr/application/" + $page.url.searchParams.get("sheet") + "/image",
                                image
                            );
                            employee.images = [...employee.images, res];
                        } catch (e) {
                            console.error("Error uploading non-eu file", e);
                        }
                    }
                }
                nonEuFiles = []; // clear after upload
                loading = false;
            }
            await updateCall(employee);
            currentStep.update((n) => n + 1);
        }
    };

    onMount(async () => {
        // Initialize documentNumber from the latest relevant images
        const idImages = (employee.images ?? []).filter(img => img.imageTag === "id-card" || img.imageTag === "passport" || img.imageTag === "other");

        const latestWithId = [...idImages]
            .filter(img => img.documentNumber)
            .sort((a, b) => (b.id ?? 0) - (a.id ?? 0))[0];

        if (latestWithId) {
            documentNumber = latestWithId.documentNumber;
        }

        // documentNumber explizit: currentValues wurde vor der Zuweisung oben berechnet
        initialValues = { ...currentValues, documentNumber };

        const byName = (list: any[]) =>
            list
                .map((n: any) => ({ ...n, name: n.value }))
                .sort((a: any, b: any) => a.name.localeCompare(b.name));

        const [nationalityList, countryList] = await Promise.all([
            get("/hr/reference/Staatsangehoerigkeiten"),
            get("/hr/reference/Staaten"),
        ]);
        nationalities = byName(nationalityList);
        countries = byName(countryList);
    });
</script>

<Modal open={loading} title="Upload">
    <p>Bitte warten...</p>
</Modal>
<Box
    disabled={!dataComplete}
    title="Identifikation & Verifikation"
    open={$currentStep === 1}
    on:open={(ev) => reactToBoxInteraction(ev, 1)}
    icon={dataComplete ? CheckCircleOutline : BellRingOutline}
>
    <DocumentWizard
        bind:selectedType={idOption}
        images={employee.images ?? []}
        on:formCompleted={() => formComplete.set(true)}
        on:ocrFrontRead={handleOCRInfoId}
        on:ocrBackRead={(e) => handleOCRInfoId(e, false)}
        on:ocrRead={handleOCRInfo}
    />

    {#if streetMissingWarning}
        <p class="mt-3 text-sm text-yellow-700 bg-yellow-50 border border-yellow-200 rounded px-3 py-2">
            Straße konnte nicht erkannt werden — bitte manuell eingeben.
        </p>
    {/if}

    {#if $formComplete}
        <div class="flex flex-col space-y-3 mt-16">
            <Heading class="text-neutral-600" tag="h5"
                >Basis Informationen</Heading
            >
            <div class="flex-1 space-y-3">
                <Label class="mb-2" for="documentNumber">Dokumentenummer</Label>
                <Input
                    type="text"
                    id="documentNumber"
                    bind:value={documentNumber}
                    class={getInputClass("documentNumber")}
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
                        class={getInputClass("firstName")}
                        required
                    />
                </div>
                <div class="flex-1 space-y-3">
                    <Label class="mb-2" for="lastName">Nachname</Label>
                    <Input
                        type="text"
                        id="lastName"
                        bind:value={employee.lastName}
                        class={getInputClass("lastName")}
                        required
                    />
                </div>
            </div>
            <div class="md:flex space-y-3 md:space-y-0 gap-3 justify-between">
                <div class="flex-1 space-y-3">
                    <Label for="nationality" class="mb-2"
                        >Staatsangehörigkeit *</Label
                    >
                    <Typeahead
                        bind:value={employee.cv.nationality}
                        inputClass={getInputClass("nationality")}
                        id="nationality"
                        data={nationalities}
                        icon={GlobeSolid}
                        required
                    />
                </div>
                <div class="flex-1 space-y-3">
                    <Label for="gender" class="mb-2">Geschlecht *</Label>
                    <Select
                        bind:value={employee.gender}
                        id="gender"
                        required
                        class={getInputClass("gender")}
                    >
                        <option value="female">Frau</option>
                        <option value="male">Herr</option>
                        <option value="diverse">Divers</option>
                    </Select>
                </div>
            </div>

            {#if employee.cv.nationality && !isEu(employee.cv.nationality)}
                <Alert class="mt-3" border color="red">
                    <Heading tag="h4">Staatsangehörigkeit außerhalb EWR</Heading>
                    <P class="dark:text-white"
                        >Die Bearbeitung geht schneller, wenn du erforderliche Dokumente
                        (Aufenthaltserlaubnis, Arbeitserlaubnis, etc) schon bereit
                        stellst. Aber keine Sorge, du kannst diese Nachweise auch später
                        nachreichen.</P
                    >
                    
                    {#if (employee.images ?? []).filter(img => img.imageTag === "work-permit").length > 0}
                        <div class="mt-4 mb-2">
                            <Label class="pb-1 text-xs text-gray-500 uppercase">Bereits hochgeladene Dokumente:</Label>
                            <Listgroup class="bg-white/50 border-dashed">
                                {#each (employee.images ?? []).filter(img => img.imageTag === "work-permit") as img}
                                    <ListgroupItem class="flex justify-between items-center text-sm py-1">
                                        <span class="truncate">{img.name || "Arbeitserlaubnis"}</span>
                                        {#if img.location}
                                            <a href={img.location} target="_blank" class="text-blue-600 hover:underline text-xs">Ansehen</a>
                                        {/if}
                                    </ListgroupItem>
                                {/each}
                            </Listgroup>
                        </div>
                    {/if}

                    <div class="mt-4">
                        <Label class="pb-2" for="multiple_files"
                            >Weitere Datei(en) hochladen</Label
                        >
                        <Fileupload
                            accept="image/*,application/pdf"
                            id="multiple_files"
                            multiple
                            bind:files={nonEuFiles}
                        />
                        <Listgroup items={nonEuFiles} let:item class="mt-2">
                            {#if item}
                                {item.name}
                            {:else}
                                <ListgroupItem>Keine neuen Dateien ausgewählt</ListgroupItem>
                            {/if}
                        </Listgroup>
                    </div>
                </Alert>
            {/if}

            <div class="md:flex space-y-3 md:space-y-0 gap-3 justify-between">
                <div class="flex-1 space-y-3">
                    <Label for="placeOfBirth" class="mb-2">Geburtsort *</Label>
                    <Input
                        type="text"
                        bind:value={employee.cv.placeOfBirth}
                        class={getInputClass("placeOfBirth")}
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
                        inputClass={getInputClass("countryOfBirth")}
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
                        class={getInputClass("dateOfBirth")}
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
                        class={getInputClass("maidenName")}
                        placeholder="Geburtsname"
                        type="text"
                        id="maidenName"
                        required
                    />
                </div>
            </div>
        </div>
    {/if}

    <Button on:click={() => proceed()} class="mt-5 w-full">Weiter</Button>
</Box>
