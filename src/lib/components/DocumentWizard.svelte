<script lang="ts">
    import { createEventDispatcher, onDestroy } from "svelte";
    import { Alert, Button, Label, Select } from "flowbite-svelte";
    import {
        ProfileCardOutline,
        RectangleListOutline,
        CheckCircleSolid,
        ExclamationCircleOutline,
        QuestionCircleOutline,
    } from "flowbite-svelte-icons";
    import OCRWrapper from "./OCRWrapper.svelte";
    import { convertPdfToImageFromFileInput } from "$lib/utils/convertPdfToImage";
    import {
        detectDocumentType,
        readPassport,
        readIdFrontCard,
        readIdBackCard,
    } from "$lib/utils/readPassport";
    import { latestImageByTag } from "$lib/utils/imageUtils";

    type WizardState = "idle" | "detecting" | "needs-back" | "complete" | "unknown-type" | "other";

    export let images: { id?: number; imageTag: string; name?: string; location?: string }[] = [];
    export let selectedType: "id-card" | "passport" | "other" = "id-card";

    const dispatch = createEventDispatcher();

    let state: WizardState = "idle";
    let cropperModalFront = false;
    let cropperModalBack = false;
    let frontPreview: string | null = null;
    let backPreview: string | null = null;
    const latestByTag = (tag: string) => latestImageByTag(images, tag);

    const idCardHasSide = (img: { name?: string; location?: string }, side: string) => {
        const encodedSide = encodeURIComponent(side);
        return img.name?.includes(`_${side}`) ||
            img.location?.includes(`_${side}`) ||
            img.location?.includes(`_${encodedSide}`);
    };

    const latestIdCardBySide = (side: "Vorderseite" | "Rückseite") =>
        images
            .filter(img => img.imageTag === "id-card" && idCardHasSide(img, side))
            .sort((a, b) => (b.id ?? 0) - (a.id ?? 0))[0] ?? null;

    let initialized = false;

    function syncStateFromImages(forceType?: "id-card" | "passport" | "other") {
        const typeToSync = forceType ?? selectedType;
        
        const latestFrontIdCard = latestIdCardBySide("Vorderseite");
        const latestPassport = latestByTag("passport");
        const latestOther = latestByTag("other");
        const back = latestIdCardBySide("Rückseite");

        const isIdComplete = !!(latestFrontIdCard && back);
        const isPassportComplete = !!latestPassport;
        const isOtherComplete = !!latestOther;

        let front = null;

        if (forceType) {
            if (forceType === "passport") front = latestPassport;
            else if (forceType === "other") front = latestOther;
            else front = latestFrontIdCard;
        } else {
            // Preference logic for initial load:
            if (isPassportComplete) {
                front = latestPassport;
            } else if (isIdComplete) {
                front = latestFrontIdCard;
            } else if (isOtherComplete) {
                front = latestOther;
            } else {
                front = (latestFrontIdCard && latestPassport)
                    ? ((latestFrontIdCard.id ?? 0) > (latestPassport.id ?? 0) ? latestFrontIdCard : latestPassport)
                    : (latestFrontIdCard ?? latestPassport ?? latestOther);
            }
        }

        if (front?.location) {
            frontPreview = front.location;
            selectedType = front.imageTag as "id-card" | "passport" | "other";
            
            if (front.imageTag === "passport" || front.imageTag === "other") {
                state = "complete";
                dispatch("formCompleted");
            } else if (back?.location) {
                backPreview = back.location;
                state = "complete";
                dispatch("formCompleted");
            } else {
                state = "needs-back";
            }
        } else {
            frontPreview = null;
            backPreview = null;
            state = "idle";
        }
        
        initialized = true;
    }

    // Reactive initialization to handle async data
    $: if (images && images.length > 0 && state === "idle" && !initialized) {
        syncStateFromImages();
    }

    $: showBack = (state === "needs-back" || (state === "complete" && selectedType === "id-card")) && selectedType !== "other";

    $: hasDocs = !!(
        frontPreview ||
        backPreview ||
        images.some((img) => img.imageTag === "passport" || img.imageTag === "id-card" || img.imageTag === "other")
    );

    function setPreview(fileOrBlob: File | Blob | null, side: "front" | "back") {
        const oldUrl = side === "front" ? frontPreview : backPreview;
        
        if (!fileOrBlob) {
            if (side === "front") frontPreview = null;
            else backPreview = null;
            if (oldUrl && oldUrl.startsWith("blob:")) URL.revokeObjectURL(oldUrl);
            return;
        }

        const url = URL.createObjectURL(fileOrBlob);
        if (side === "front") frontPreview = url;
        else backPreview = url;
        
        if (oldUrl && oldUrl.startsWith("blob:")) URL.revokeObjectURL(oldUrl);
    }

    onDestroy(() => {
        if (frontPreview && frontPreview.startsWith("blob:")) URL.revokeObjectURL(frontPreview);
        if (backPreview && backPreview.startsWith("blob:")) URL.revokeObjectURL(backPreview);
    });

    async function resolvePreview(file: File): Promise<File | Blob> {
        if (file.type === "application/pdf") {
            return (await convertPdfToImageFromFileInput([file], "blob")) as Blob;
        }
        return file;
    }

    const handleFrontOCR = async (detail: any) => {
        const resolved = await resolvePreview(detail.file);
        setPreview(resolved, "front");

        if (selectedType === "other") {
            dispatch("ocrRead", { file: detail.file, docType: "other" });
            state = "complete";
            dispatch("formCompleted");
            return;
        }

        const docType = detectDocumentType(detail.text);

        if (docType === "passport") {
            selectedType = "passport";
            const parsed = readPassport(detail.text);
            dispatch("ocrRead", { ...parsed, file: detail.file, docType: "passport" });
            state = "complete";
            dispatch("formCompleted");
        } else if (docType === "id-card") {
            selectedType = "id-card";
            const parsed = readIdFrontCard(detail.text);
            dispatch("ocrFrontRead", { ...parsed, file: detail.file, docType: "id-card" });
            state = "needs-back";
        } else {
            state = "unknown-type";
        }
    };

    const handleBackOCR = async (detail: any) => {
        const resolved = await resolvePreview(detail.file);
        setPreview(resolved, "back");

        const parsed = readIdBackCard(detail.text, detail.lines ?? []);
        dispatch("ocrBackRead", { ...parsed, file: detail.file, docType: "id-card" });
        state = "complete";
        dispatch("formCompleted");
    };

    const onManualTypeChange = () => {
        // Cleanup existing blob previews before switching
        setPreview(null, "front");
        setPreview(null, "back");
        syncStateFromImages(selectedType);
    };
</script>

<div class="md:w-4/5 px-2 lg:max-w-screen-lg mx-auto my-12">
        <div class="mb-6">
            {#if hasDocs || selectedType === "other"}
                <div class="mb-4">
                    <Label for="docTypeSelect" class="mb-2">Ausweisart *</Label>
                    <Select
                        id="docTypeSelect"
                        bind:value={selectedType}
                        on:change={onManualTypeChange}
                    >
                        <option value="id-card">Personalausweis / Aufenthaltstitel</option>
                        <option value="passport">Reisepass</option>
                        <option value="other">Sonstiges (Fiktionsbescheinigung / Duldung)</option>
                    </Select>
                </div>
            {/if}

            {#if state === "unknown-type"}
                <div class="mt-3">
                    <Alert color="yellow">
                        <ExclamationCircleOutline slot="icon" class="w-5 h-5" />
                        Dokumenttyp nicht erkannt — bitte oben manuell wählen (z.B. bei ausländischen ID-Karten)
                    </Alert>
                </div>
            {:else if state === "needs-back"}
                <div class="flex items-center gap-2 mt-3 text-blue-600 dark:text-blue-400">
                    <CheckCircleSolid class="w-5 h-5" />
                    <span class="text-sm font-medium">Dokument erkannt — bitte Rückseite hochladen</span>
                </div>
            {:else if state === "complete" && selectedType === "passport"}
                <div class="flex items-center gap-2 mt-3 text-green-600 dark:text-green-400">
                    <CheckCircleSolid class="w-5 h-5" />
                    <span class="text-sm font-medium">Reisepass erkannt ✓</span>
                </div>
            {:else if state === "complete" && selectedType === "id-card"}
                <div class="flex items-center gap-2 mt-3 text-green-600 dark:text-green-400">
                    <CheckCircleSolid class="w-5 h-5" />
                    <span class="text-sm font-medium">Dokument vollständig erkannt ✓</span>
                </div>
            {:else if state === "complete" && selectedType === "other"}
                 <div class="flex items-center gap-2 mt-3 text-green-600 dark:text-green-400">
                    <CheckCircleSolid class="w-5 h-5" />
                    <span class="text-sm font-medium">Dokument hochgeladen ✓</span>
                </div>
            {/if}
        </div>

        <div class="flex flex-row gap-4 items-stretch">
            <!-- Vorderseite / Reisepass / Sonstiges -->
            <div class={showBack ? "w-1/2" : "w-full"}>
                <h5 class="mb-4 text-lg font-extrabold tracking-tight leading-none text-gray-700 dark:text-white">
                    {state === "complete" && selectedType === "passport"
                        ? "Reisepass"
                        : selectedType === "other"
                        ? "Dokument"
                        : state === "needs-back" || (state === "complete" && selectedType === "id-card")
                        ? "Vorderseite"
                        : "Ausweis / Reisepass / eAT"}
                </h5>

                <OCRWrapper
                    type={selectedType === "other" ? "id-card" : selectedType}
                    title="Dokument"
                    bind:cropperModal={cropperModalFront}
                    value="doc-front"
                    on:ocr={(ev) => handleFrontOCR(ev.detail)}
                >
                    <div class={showBack ? "aspect-[1.6] w-full relative" : "w-full relative"}>
                        {#if !frontPreview}
                            <div
                                class="flex flex-col justify-center items-center w-full h-64 bg-gray-50 rounded-lg border-2 border-gray-300 border-dashed cursor-pointer dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
                                on:click={() => (cropperModalFront = true)}
                                on:keydown={() => (cropperModalFront = true)}
                                aria-hidden="true"
                            >
                                <ProfileCardOutline class="mb-3 w-10 h-10 text-gray-400" />
                                <p class="mb-2 text-sm text-gray-500 dark:text-gray-400">
                                    <span class="font-semibold">Klicken Sie hier</span>
                                </p>
                                <p class="text-xs text-gray-500 dark:text-gray-400">JPG, JPEG, PNG, PDF</p>
                            </div>
                        {:else}
                            <img
                                on:click={() => (cropperModalFront = true)}
                                on:keydown={() => (cropperModalFront = true)}
                                aria-hidden="true"
                                class="w-full h-full object-contain rounded"
                                src={frontPreview}
                                alt="Dokument"
                            />
                        {/if}
                    </div>
                </OCRWrapper>
            </div>

            <!-- Rückseite (nur bei Personalausweis) -->
            <div class={`flex flex-col overflow-hidden ${showBack ? "w-1/2" : "w-0 pointer-events-none"}`}>
                <h5 class="mb-4 text-lg font-extrabold tracking-tight leading-none text-gray-700 dark:text-white">
                    Rückseite
                </h5>

                <OCRWrapper
                    type="id-card"
                    title="Dokument Rückseite"
                    bind:cropperModal={cropperModalBack}
                    value="id-card"
                    on:ocr={(ev) => handleBackOCR(ev.detail)}
                >
                    <div class="aspect-[1.6] w-full relative">
                        {#if !backPreview}
                            <div
                                class="absolute inset-0 flex flex-col justify-center items-center bg-gray-50 rounded-lg border-2 border-gray-300 border-dashed cursor-pointer dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
                                on:click={() => (cropperModalBack = true)}
                                on:keydown={() => (cropperModalBack = true)}
                                aria-hidden="true"
                            >
                                <RectangleListOutline class="mb-3 w-10 h-10 text-gray-400" />
                                <p class="mb-2 text-sm text-gray-500 dark:text-gray-400">
                                    <span class="font-semibold">Klicken Sie hier</span>
                                </p>
                                <p class="text-xs text-gray-500 dark:text-gray-400">JPG, JPEG, PNG, PDF</p>
                            </div>
                        {:else}
                            <img
                                on:click={() => (cropperModalBack = true)}
                                on:keydown={() => (cropperModalBack = true)}
                                aria-hidden="true"
                                class="absolute inset-0 w-full h-full object-contain rounded"
                                src={backPreview}
                                alt="Rückseite"
                            />
                        {/if}
                    </div>
                </OCRWrapper>
            </div>
        </div>

        {#if !hasDocs && state === 'idle'}
            <div class="mt-8 flex justify-center">
                <Button 
                    outline 
                    color="light" 
                    size="sm"
                    class="flex items-center gap-2 border-dashed"
                    on:click={() => { selectedType = 'other'; state = 'idle'; initialized = true; }}
                >
                    <QuestionCircleOutline class="w-4 h-4" />
                    Ich habe keines dieser Dokumente
                </Button>
            </div>
        {/if}
</div>
