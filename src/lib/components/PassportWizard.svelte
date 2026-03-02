<script lang="ts">
    import { BookOpenOutline } from "flowbite-svelte-icons";
    import { convertPdfToImageFromFileInput } from "$lib/utils/convertPdfToImage";
    import { createEventDispatcher } from "svelte";
    import OCRWrapper from "./OCRWrapper.svelte";
    import { type ApplicationFormData } from "$lib/stores/application";
    import { readPassport } from "$lib/utils/readPassport";

    let cropperModal: boolean = false;

    const dispatch = createEventDispatcher();
    let passportPreview: string | null = null;

    let candidate: {
        passportPhoto: File | Blob | null;
    } = {
        passportPhoto: null,
    };

    const ocrBinding = async (detail: any) => {
        let {
            passportBio,
            idNumber,
            dateOfBirth,
            placeOfBirth,
            sex,
        }: Partial<ApplicationFormData> = readPassport(detail.text);

        dispatch("ocrRead", {
            passportBio,
            idNumber,
            dateOfBirth,
            placeOfBirth,
            sex,
            file: detail.file,
        });
        await handleFile(detail.file);
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

    async function handleFile(file: File | null): Promise<void> {
        candidate.passportPhoto = null;
        passportPreview = null;
        if (!file) return;

        try {
            if (file.type === "application/pdf") {
                // returns Blob (per your updated util)
                const blob = (await convertPdfToImageFromFileInput(
                    [file],
                    "blob",
                )) as Blob;
                candidate.passportPhoto = blob;
                setPreviewFromBlobOrFile(blob, (v) => (passportPreview = v));
            } else {
                candidate.passportPhoto = file;
                setPreviewFromBlobOrFile(file, (v) => (passportPreview = v));
            }
        } catch (err) {
            console.error(err);
            candidate.passportPhoto = null;
            passportPreview = null;
        }
    }

    $: {
        if (passportPreview) {
            dispatch("formCompleted", true);
        }
    }
</script>

<div class="md:w-4/5 px-2 lg:max-w-screen-lg mx-auto my-12 flex flex-col">
    <h5
        class="mb-4 text-lg font-extrabold tracking-tight leading-none text-gray-700 dark:text-white"
    >
        Passport
    </h5>

    <OCRWrapper
        type="passport"
        title="Reisepass"
        bind:cropperModal
        value="passport"
        on:ocr={(ev) => {
            ocrBinding(ev.detail);
        }}
    >
        {#if !candidate.passportPhoto}
            <div
                class="flex flex-col justify-center items-center w-full h-96 bg-gray-50 rounded-lg border-2 border-gray-300 border-dashed cursor-pointer dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
                on:click={() => (cropperModal = true)}
                on:keydown={() => (cropperModal = true)}
                aria-hidden="true"
            >
                <BookOpenOutline class="mb-3 w-10 h-10 text-gray-400" />
                <p class="mb-2 text-sm text-gray-500 dark:text-gray-400">
                    <span class="font-semibold">Klicken Sie hier</span>
                </p>
                <p class="text-xs text-gray-500 dark:text-gray-400">
                    JPG, JPEG, PNG, PDF
                </p>
            </div>
        {:else}
            <img
                on:click={() => (cropperModal = true)}
                on:keydown={() => (cropperModal = true)}
                aria-hidden="true"
                class="max-h-full max-w-full"
                src={passportPreview ?? ""}
                alt="passport"
            />
        {/if}
    </OCRWrapper>
</div>
