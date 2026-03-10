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
    import dayjs from "dayjs";
    import customParseFormat from "dayjs/plugin/customParseFormat";
    import updateCall from "$lib/utils/updateCall";
    import DocumentWizard from "$lib/components/DocumentWizard.svelte";
    import { formComplete } from "$lib/stores/formComplete";
    import Typeahead from "$lib/components/Typeahead.svelte";
    import AddressData from "./AddressData.svelte";

    export let employee: any;

    dayjs.extend(customParseFormat);

    let nationalities: any[] = [];
    let countries: any[] = [];
    let avatarFiles: FileList | any;
    let loading = false;

    let idOption: string = "id-card";
    let documentNumber: string;
    let currentFile: File;

    let initialValues: any = {};
    let changedFields: Set<string> = new Set();

    const buildChangedFields = (): Set<string> => {
        const next = new Set<string>();

        const fieldsToCheck = [
            {
                current: documentNumber,
                initial: initialValues.documentNumber,
                name: "documentNumber",
            },
            {
                current: employee.firstName,
                initial: initialValues.firstName,
                name: "firstName",
            },
            {
                current: employee.lastName,
                initial: initialValues.lastName,
                name: "lastName",
            },
            {
                current: employee.cv.nationality,
                initial: initialValues.nationality,
                name: "nationality",
            },
            {
                current: employee.gender,
                initial: initialValues.gender,
                name: "gender",
            },
            {
                current: employee.cv.placeOfBirth,
                initial: initialValues.placeOfBirth,
                name: "placeOfBirth",
            },
            {
                current: employee.cv.countryOfBirth,
                initial: initialValues.countryOfBirth,
                name: "countryOfBirth",
            },
            {
                current: employee.dateOfBirth.value,
                initial: initialValues.dateOfBirth,
                name: "dateOfBirth",
            },
            {
                current: employee.maidenName,
                initial: initialValues.maidenName,
                name: "maidenName",
            },
            {
                current: employee.address?.country,
                initial: initialValues.country,
                name: "country",
            },
            {
                current: employee.address?.place,
                initial: initialValues.place,
                name: "place",
            },
            {
                current: employee.address?.street,
                initial: initialValues.street,
                name: "street",
            },
            {
                current: employee.address?.number,
                initial: initialValues.number,
                name: "number",
            },
            {
                current: employee.address?.zip,
                initial: initialValues.zip,
                name: "zip",
            },
            {
                current: employee.address?.addressAddendum,
                initial: initialValues.addressAddendum,
                name: "addressAddendum",
            },
        ];

        for (const { current, initial, name } of fieldsToCheck) {
            if (current !== initial) {
                next.add(name);
            }
        }

        return next;
    };

    const getInputClass = (fieldName: string) =>
        changedFields.has(fieldName)
            ? "ring-2 ring-blue-500 ring-offset-1 ring-offset-white"
            : "";

    $: initialReady = initialValues && Object.keys(initialValues).length > 0;

    $: if (initialReady) {
        documentNumber;
        employee.firstName;
        employee.lastName;
        employee.cv.nationality;
        employee.gender;
        employee.cv.placeOfBirth;
        employee.cv.countryOfBirth;
        employee.dateOfBirth.value;
        employee.maidenName;
        employee.address?.country;
        employee.address?.place;
        employee.address?.street;
        employee.address?.number;
        employee.address?.zip;
        employee.address?.addressAddendum;

        changedFields = buildChangedFields();
    } else {
        changedFields = new Set();
    }

    const sendIdImage = async (
        payload: any,
        type: string = "id-card",
        front: boolean = true,
    ): Promise<void> => {
        const side = front ? "Vorderseite" : "Rückseite";
        const imageTag = type === "passport" ? "passport" : "id-card";

        employee.images = employee.images.filter((n: any) => {
            if (n.imageTag !== imageTag) return true;
            const encodedSide = encodeURIComponent(side);
            const matchesName = n.name?.includes(`_${side}`);
            const matchesLocation = n.location?.includes(`_${side}`) || n.location?.includes(`_${encodedSide}`);
            return !(matchesName || matchesLocation);
        });

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

    const sexToGender = (sex: string): "female" | "male" | "divers" => {
        if (!sex) return "divers";
        const s = sex.toLowerCase();
        if (["f", "female"].includes(s)) return "female";
        if (["m", "male"].includes(s)) return "male";
        return "divers";
    };

    const applyCommonOcrFields = (detail: any): void => {
        if (detail.idNumber) documentNumber = detail.idNumber;
        if (detail.firstName) employee.firstName = detail.firstName;
        if (detail.lastName) employee.lastName = detail.lastName;
        const dob = parseDateOfBirth(detail.dateOfBirth);
        if (dob) employee.dateOfBirth.value = dob;
        if (detail.placeOfBirth) employee.cv.placeOfBirth = detail.placeOfBirth;
        if (detail.sex) {
            employee.gender = sexToGender(detail.sex);
        }
    };

    const handleOCRInfoId = async (
        payload: CustomEvent,
        front: boolean = true,
    ): Promise<void> => {
        const docType = payload.detail.docType ?? idOption;
        if (payload.detail.docType) idOption = payload.detail.docType;

        if (front) {
            if (payload.detail.maidenName) employee.maidenName = payload.detail.maidenName;
            applyCommonOcrFields(payload.detail);
        } else {
            if (payload.detail.country) employee.cv.countryOfBirth = payload.detail.country;
            employee.address = {
                country: payload.detail.address?.country || employee.address?.country || "Deutschland",
                place: payload.detail.address?.place || employee.address?.place || null,
                street: payload.detail.address?.street || employee.address?.street || null,
                number: payload.detail.address?.number ?? employee.address?.number ?? null,
                zip: payload.detail.address?.zip || employee.address?.zip || null,
            };
        }

        currentFile = payload.detail.file;
        await sendIdImage(payload.detail, docType, front);
        await updateCall(employee);
    };

    const handleOCRInfo = async (payload: CustomEvent): Promise<void> => {
        const docType = payload.detail.docType ?? idOption;
        if (payload.detail.docType) idOption = payload.detail.docType;

        const { firstName, lastName } = payload.detail.passportBio ?? {};
        applyCommonOcrFields({ ...payload.detail, firstName, lastName });

        currentFile = payload.detail.file;
        await sendIdImage(payload.detail, docType);
        await updateCall(employee);
    };

    let dataComplete = false;
    let docsComplete = false;

    // 1. Calculate document completeness
    $: {
        const idImages = (employee.images ?? []).filter(img => img.imageTag === idOption);
        
        const isIdCard = idOption === "id-card";
        const isPassport = idOption === "passport";
        
        const checkSide = (img: any, side: string) => {
            const encodedSide = encodeURIComponent(side);
            return img.name?.includes(`_${side}`) || 
                   img.location?.includes(`_${side}`) || 
                   img.location?.includes(`_${encodedSide}`) ||
                   img.location?.includes(`%20${encodedSide}`);
        };

        const hasFront = isPassport ? idImages.length > 0 : idImages.some(img => checkSide(img, "Vorderseite"));
        const hasBack = isIdCard ? idImages.some(img => checkSide(img, "Rückseite")) : true;

        docsComplete = !!(hasFront && hasBack);
    }

    // 2. Calculate data completeness
    $: dataComplete =
        !!(employee.firstName &&
        employee.lastName &&
        employee.cv.nationality &&
        employee.gender &&
        employee.cv.placeOfBirth &&
        employee.cv.countryOfBirth &&
        employee.dateOfBirth.value &&
        employee.address?.country &&
        employee.address?.place &&
        employee.address?.street &&
        employee.address?.number &&
        employee.address?.zip);

    // 3. Update stores based on calculated completeness
    $: $blocked = !dataComplete || !docsComplete;
    $: formComplete.set(docsComplete);

    // 4. Handle avatar files separately
    $: if (avatarFiles && avatarFiles.length > 0) {
        employee.avatarFile = avatarFiles[0];
    }

    const proceed = async () => {
        if (!dataComplete || !docsComplete) {
            console.log("not complete or missing images");
            markEmptyFields();
        } else {
            await updateCall(employee);
            currentStep.update((n) => n + 1);
        }
    };

    onMount(async () => {
        // Initialize documentNumber from the latest relevant images
        const idImages = (employee.images ?? []).filter(img => img.imageTag === "id-card" || img.imageTag === "passport");

        const latestWithId = [...idImages]
            .filter(img => img.documentNumber)
            .sort((a, b) => (b.id ?? 0) - (a.id ?? 0))[0];

        if (latestWithId) {
            documentNumber = latestWithId.documentNumber;
        }

        initialValues = {
            documentNumber,
            firstName: employee.firstName,
            lastName: employee.lastName,
            nationality: employee.cv.nationality,
            gender: employee.gender,
            placeOfBirth: employee.cv.placeOfBirth,
            countryOfBirth: employee.cv.countryOfBirth,
            dateOfBirth: employee.dateOfBirth.value,
            maidenName: employee.maidenName,
            country: employee.address?.country,
            place: employee.address?.place,
            street: employee.address?.street,
            number: employee.address?.number,
            zip: employee.address?.zip,
            addressAddendum: employee.address?.addressAddendum,
        };

        nationalities = (await get("/hr/reference/Staatsangehoerigkeiten"))
            .map((n: any) => ({ ...n, name: n.value }))
            .sort((a: any, b: any) => a.name.localeCompare(b.name));

        countries = (await get("/hr/reference/Staaten"))
            .map((n: any) => ({ ...n, name: n.value }))
            .sort((a: any, b: any) => a.name.localeCompare(b.name));
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
    <DocumentWizard
        bind:selectedType={idOption}
        images={employee.images ?? []}
        on:formCompleted={() => formComplete.set(true)}
        on:ocrFrontRead={handleOCRInfoId}
        on:ocrBackRead={(e) => handleOCRInfoId(e, false)}
        on:ocrRead={handleOCRInfo}
    />

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
                        >Staatsanghörigkeit *</Label
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
            <Heading class="text-neutral-600 pt-9" tag="h5">Adresse</Heading>
            <AddressData bind:employee {changedFields} {getInputClass} />
        </div>
    {/if}

    <Button on:click={() => proceed()} class="mt-5 w-full">Weiter</Button>
</Box>
