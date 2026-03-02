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
        let side = front ? "Vorderseite" : "Rückseite";

        employee.images = employee.images.filter(
            (n: any) => n.imageTag !== idOption,
        );

        const image = {
            documentNumber: payload.idNumber ?? null,
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

    const handleOCRInfoId = (
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
            employee.cv.placeOfBirth =
                payload.detail.placeOfBirth || employee.cv.countryOfBirth;
            employee.maidenName =
                payload.detail.maidenName || employee.maidenName;
            employee.gender = payload.detail.sex === "F" ? "female" : "male";
        } else {
            employee.cv.countryOfBirth =
                payload.detail.country || employee.cv.countryOfBirth;
            employee.address = {
                country: payload.detail.country || employee.address?.country,
                place: payload.detail.address.place || employee.address?.place,
                street:
                    payload.detail.address.street || employee.address?.street,
                number:
                    payload.detail.address.number || employee.address?.number,
                zip: payload.detail.address.zip || employee.address?.zip,
            };
        }

        currentFile = payload.detail.file;
        sendIdImage(payload.detail, idOption, front);
    };

    const handleOCRInfo = (payload: CustomEvent): void => {
        const { firstName, lastName } = payload.detail.passportBio;

        employee.firstName = firstName || employee.firstName;
        employee.lastName = lastName || employee.lastName;

        employee.images[0].documentNumber = payload.detail.idNumber;
        documentNumber = payload.detail.idNumber;

        employee.dateOfBirth.value =
            dayjs(payload.detail.dateOfBirth, "DD.MM.YYYY").format(
                "YYYY-MM-DD",
            ) || employee.dateOfBirth.value;

        employee.cv.placeOfBirth =
            payload.detail.placeOfBirth || employee.cv.countryOfBirth;

        employee.gender = payload.detail.sex === "F" ? "female" : "male";

        currentFile = payload.detail.file;
        sendIdImage(payload.detail, idOption);
    };

    let dataComplete = false;

    $: {
        const idFront =
            employee.images[0]?.file || employee.images[0]?.location;
        const idBack = employee.images[1]?.file || employee.images[1]?.location;
        const isIdCard = employee.images[0]?.imageTag === "id-card";

        dataComplete =
            employee.firstName &&
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
            employee.address?.zip;

        $blocked = !dataComplete;

        if (avatarFiles && avatarFiles.length > 0) {
            employee.avatarFile = avatarFiles[0];
        }
    }

    const proceed = async () => {
        if (!dataComplete) {
            console.log("not complete");
            markEmptyFields();
        } else {
            await updateCall(employee);
            currentStep.update((n) => n + 1);
        }
    };

    onMount(async () => {
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
            on:ocrFrontRead={handleOCRInfoId}
            on:ocrBackRead={(e) => handleOCRInfoId(e, false)}
        />
    {:else if idOption === "passport"}
        <PassportWizard
            on:formCompleted={() => formComplete.set(true)}
            on:ocrRead={handleOCRInfo}
        />
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
