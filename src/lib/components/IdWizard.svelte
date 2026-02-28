<script lang="ts">
    import {
        ProfileCardOutline,
        RectangleListOutline,
    } from "flowbite-svelte-icons";
    import { convertPdfToImageFromFileInput } from "$lib/utils/convertPdfToImage";
    import { createEventDispatcher } from "svelte";
    import OCRWrapper from "./OCRWrapper.svelte";
    import {
        patchApplicationStore,
        type ApplicationFormData,
    } from "$lib/stores/application";
    import { readIdBackCard, readIdFrontCard } from "$lib/utils/readPassport";

    let cropperModalFront: boolean = false;
    let cropperModalBack: boolean = false;

    const dispatch = createEventDispatcher();
    let frontIdPreview: string | null = null;
    let backIdPreview: string | null = null;

    let candidate: {
        frontIdPhoto: File | Blob | null;
        backIdPhoto: File | Blob | null;
    } = {
        frontIdPhoto: null,
        backIdPhoto: null,
    };

    const ocrBinding = async (detail: any, which: "front" | "back") => {
        let reader: Partial<ApplicationFormData>;
        if (which === "front") {
            reader = readIdFrontCard(detail.text);
            dispatch("ocrFrontRead", reader);
            await handleFrontFile(detail.file);
        } else {
            reader = readIdBackCard(detail.text);
            dispatch("ocrBackRead", reader);
            await handleBackFile(detail.file);
        }
    };

    function setPreviewFromBlobOrFile(
        fileOrBlob: File | Blob | null,
        set: (v: string | null) => void,
    ) {
        if (!fileOrBlob) {
            set(null);
            return;
        }

        const reader = new FileReader();
        reader.onerror = () => set(null);
        reader.onload = (e: any) => set(e?.target?.result ?? null);
        reader.readAsDataURL(fileOrBlob);
    }

    async function handleFrontFile(file: File | null): Promise<void> {
        candidate.frontIdPhoto = null;
        frontIdPreview = null;
        if (!file) return;

        try {
            if (file.type === "application/pdf") {
                // returns Blob (per your updated util)
                const blob = (await convertPdfToImageFromFileInput(
                    [file],
                    "blob",
                )) as Blob;
                candidate.frontIdPhoto = blob;
                setPreviewFromBlobOrFile(blob, (v) => (frontIdPreview = v));
            } else {
                candidate.frontIdPhoto = file;
                setPreviewFromBlobOrFile(file, (v) => (frontIdPreview = v));
            }
        } catch (err) {
            console.error(err);
            candidate.frontIdPhoto = null;
            frontIdPreview = null;
        }
    }

    async function handleBackFile(file: File | null): Promise<void> {
        candidate.backIdPhoto = null;
        backIdPreview = null;
        if (!file) return;

        try {
            if (file.type === "application/pdf") {
                const blob = (await convertPdfToImageFromFileInput(
                    [file],
                    "blob",
                )) as Blob;
                candidate.backIdPhoto = blob;
                setPreviewFromBlobOrFile(blob, (v) => (backIdPreview = v));
            } else {
                candidate.backIdPhoto = file;
                setPreviewFromBlobOrFile(file, (v) => (backIdPreview = v));
            }
        } catch (err) {
            console.error(err);
            candidate.backIdPhoto = null;
            backIdPreview = null;
        }
    }

    $: {
        if (frontIdPreview && backIdPreview) {
            dispatch("formCompleted", true);
        }
    }
</script>

<div class="md:w-4/5 px-2 lg:max-w-screen-lg mx-auto my-12 flex flex-row">
    <div class="w-1/2 pr-4">
        <h5
            class="mb-4 text-lg font-extrabold tracking-tight leading-none text-gray-700 dark:text-white"
        >
            Front of your ID
        </h5>

        <OCRWrapper
            type="id-card"
            title="Personalausweis"
            bind:cropperModal={cropperModalFront}
            value="id-card-front"
            on:ocr={(ev) => {
                ocrBinding(ev.detail, "front");
            }}
        >
            {#if !candidate.frontIdPhoto}
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
                    <p class="text-xs text-gray-500 dark:text-gray-400">
                        JPG, JPEG, PNG, PDF
                    </p>
                </div>
            {:else}
                <img
                    on:click={() => (cropperModalBack = true)}
                    on:keydown={() => (cropperModalBack = true)}
                    aria-hidden="true"
                    class="max-h-full max-w-full"
                    src={frontIdPreview ?? ""}
                    alt="front-id"
                />
            {/if}
        </OCRWrapper>
    </div>

    <div class="w-1/2 pr-4">
        <h5
            class="mb-4 text-lg font-extrabold tracking-tight leading-none text-gray-700 dark:text-white"
        >
            Back of your ID
        </h5>

        <OCRWrapper
            type="id-card"
            title="Personalausweis"
            bind:cropperModal={cropperModalBack}
            value="id-card-back"
            on:ocr={(ev) => {
                ocrBinding(ev.detail, "back");
            }}
        >
            {#if !candidate.backIdPhoto}
                <div
                    class="flex flex-col justify-center items-center w-full h-64 bg-gray-50 rounded-lg border-2 border-gray-300 border-dashed cursor-pointer dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
                    on:click={() => (cropperModalBack = true)}
                    on:keydown={() => (cropperModalBack = true)}
                    aria-hidden="true"
                >
                    <RectangleListOutline
                        class="mb-3 w-10 h-10 text-gray-400"
                    />
                    <p class="mb-2 text-sm text-gray-500 dark:text-gray-400">
                        <span class="font-semibold">Klicken Sie hier</span>
                    </p>
                    <p class="text-xs text-gray-500 dark:text-gray-400">
                        JPG, JPEG, PNG, PDF
                    </p>
                </div>
            {:else}
                <img
                    on:click={() => (cropperModalBack = true)}
                    on:keydown={() => (cropperModalBack = true)}
                    aria-hidden="true"
                    src={backIdPreview ?? ""}
                    class="max-h-full max-w-full"
                    alt="back-id"
                />
            {/if}
        </OCRWrapper>
    </div>
</div>
