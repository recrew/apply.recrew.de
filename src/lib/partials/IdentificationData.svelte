<script lang="ts">
    import { Button, Label, Modal, Select } from "flowbite-svelte";
    import { formDataPost, get } from "$lib/api";
    import { onMount } from "svelte";
    import Box from "$lib/components/Box.svelte";
    import { BellRingOutline, CheckCircleOutline } from "flowbite-svelte-icons";
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
    import { readIdFrontCard, readPassport } from "$lib/utils/readPassport";
    import OCRWrapper from "$lib/components/OCRWrapper.svelte";

    export let employee: any;

    dayjs.extend(customParseFormat);

    let nationalities: any[] = [];
    let countries: any[] = [];
    let avatarFiles: FileList;
    let loading = false;

    let idOption: string;
    let idOptions = [
        { name: "Personalausweis Vorderseite", value: "id-card" },
        { name: "Reisepass Vorderseite", value: "passport" },
    ];

    let cropperModal = false;

    const orcBinding = (detail: any, which: "front" | "back") => {
        let image;

        if (which === "front") {
            let reader;
            if (idOption === "passport") {
                reader = readPassport(detail.text);
            } else if (idOption === "id-card") {
                reader = readIdFrontCard(detail.text);
            }

            // remove existing passport
            employee.images = employee.images.filter(
                (n) => n.imageTag !== idOption,
            );
            image = {
                documentNumber: reader?.passportNumber || "",
                imageTag: idOption,
                file: detail.file,
                name: fileNameGenerator(
                    detail.file,
                    employee,
                    "passport",
                    "Vorderseite",
                ),
            };
            formDataPost(
                "/hr/application/" +
                    $page.url.searchParams.get("sheet") +
                    "/image",
                image,
            ).then((res) => {
                employee.images = [...employee.images, res];
            });

            employee.firstName = reader?.firstName || "";
            employee.lastName = reader?.lastName || "";
            employee.dateOfBirth.value = dayjs(
                reader.dateOfBirth,
                "DD.MM.YYYY",
            ).format("YYYY-MM-DD");
            employee.cv.placeOfBirth = reader?.placeOfBirth || "";
            employee.maidenName = reader?.maidenName || "";
            employee.gender = reader?.sex.trim() === "M" ? "male" : "female";
            console.log({ reader, employee });
        }
    };

    const idReader = (detail: any, index?: number) => {
        employee.images[index ?? 0].name = fileNameGenerator(
            detail.file,
            employee,
            detail.type,
            index ? "Rückseite" : "Vorderseite",
        );
        employee.images[index ?? 0].file = detail.file;
        employee.images[index ?? 0].documentNumber =
            employee.images.filter(
                (n) => n.imageTag === "id-card" || n.imageTag === "passport",
            ).length < 1 && detail.text.length < 1
                ? "nicht lesbar"
                : detail.text;
        employee.images[index ?? 0].imageTag = detail.type;
        employee.images = [...employee.images];
        idIndex = employee.images.findIndex(
            (n) =>
                (n.imageTag === "id-card" || n.imageTag === "passport") &&
                n.documentNumber,
        );
    };

    let idIndex = employee.images.findIndex(
        (n) =>
            (n.imageTag === "id-card" || n.imageTag === "passport") &&
            n.documentNumber,
    );

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
    const generateBlob = () => {
        if (typeof employee.avatarFile === "string") {
            return employee.avatarFile;
        }
        return URL.createObjectURL(employee.avatarFile);
    };

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
        } else {
            await saveImages();
            await updateCall(employee);
        }
    };

    $: idImages = employee.images.filter((n: any) => n.imageTag === idOption);

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
        <Select
            bind:value={idOption}
            id="idOption"
            required
            on:change={() => {
                cropperModal = true;
            }}
        >
            <option value="id-card">Personalausweis</option>
            <option value="passport">Reisepass</option>
        </Select>
    </div>
    <OCRWrapper
        type={idOption}
        title={idOption === "id-card" ? "Personalausweis" : "Reisepass"}
        bind:cropperModal
        value={employee.images.find(
            (n) => n.imageTag === idOption && n.documentNumber,
        )}
        on:ocr={(ev) => {
            orcBinding(ev.detail, "front");
        }}
    />
    <Button on:click={() => proceed()} class="mt-5 w-full">Weiter</Button>
</Box>
