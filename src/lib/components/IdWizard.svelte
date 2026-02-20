<script lang="ts">
    import { Dropzone } from "flowbite-svelte";
    import {
        ProfileCardOutline,
        RectangleListOutline,
    } from "flowbite-svelte-icons";
    import { convertPdfToImageFromFileInput } from "$lib/utils/convertPdfToImage";
    import { createEventDispatcher } from "svelte";

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

    function getFirstDroppedFile(event: DragEvent): File | null {
        const dt = event.dataTransfer;
        if (!dt) return null;

        // Prefer DataTransferItemList when available
        if (dt.items && dt.items.length) {
            for (const item of Array.from(dt.items)) {
                if (item.kind === "file") {
                    const f = item.getAsFile();
                    if (f) return f;
                }
            }
            return null;
        }

        if (dt.files && dt.files.length) return dt.files[0];
        return null;
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

    const dropFrontHandle = async (event: DragEvent) => {
        event.preventDefault();
        const file = getFirstDroppedFile(event);
        await handleFrontFile(file);
    };

    const dropBackHandle = async (event: DragEvent) => {
        event.preventDefault();
        const file = getFirstDroppedFile(event);
        await handleBackFile(file);
    };

    const handleFrontChange = async (event: Event) => {
        const input = event.currentTarget as HTMLInputElement | null;
        const file = input?.files?.[0] ?? null;
        await handleFrontFile(file);
    };

    const handleBackChange = async (event: Event) => {
        const input = event.currentTarget as HTMLInputElement | null;
        const file = input?.files?.[0] ?? null;
        await handleBackFile(file);
    };

    $: {
        if (frontIdPreview && backIdPreview) {
            dispatch("formCompleted", true);
            console.log("success");
        } else {
            console.log("failed");
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

        <Dropzone
            on:drop={dropFrontHandle}
            on:change={handleFrontChange}
            on:dragover={(e) => e.preventDefault()}
            on:dragleave={(e) => e.preventDefault()}
        >
            {#if !candidate.frontIdPhoto}
                <div
                    class="flex flex-col items-center justify-center pt-5 pb-6"
                >
                    <ProfileCardOutline class="mb-3 w-10 h-10 text-gray-400" />
                    <p class="mb-2 text-sm text-gray-500 dark:text-gray-400">
                        <span class="font-semibold">Klicken Sie hier</span> oder
                        ziehen Sie eine Datei hierher.
                    </p>
                    <p class="text-xs text-gray-500 dark:text-gray-400">
                        JPG, JPEG, PNG, PDF
                    </p>
                </div>
            {:else}
                <img
                    class="max-h-full max-w-full"
                    src={frontIdPreview ?? ""}
                    alt="front-id"
                />
            {/if}
        </Dropzone>
    </div>

    <div class="w-1/2 pr-4">
        <h5
            class="mb-4 text-lg font-extrabold tracking-tight leading-none text-gray-700 dark:text-white"
        >
            Back of your ID
        </h5>

        <Dropzone
            on:drop={dropBackHandle}
            on:change={handleBackChange}
            on:dragover={(e) => e.preventDefault()}
            on:dragleave={(e) => e.preventDefault()}
        >
            {#if !candidate.backIdPhoto}
                <div
                    class="flex flex-col items-center justify-center pt-5 pb-6"
                >
                    <RectangleListOutline
                        class="mb-3 w-10 h-10 text-gray-400"
                    />
                    <p class="mb-2 text-sm text-gray-500 dark:text-gray-400">
                        <span class="font-semibold">Klicken Sie hier</span> oder
                        ziehen Sie eine Datei hierher.
                    </p>
                    <p class="text-xs text-gray-500 dark:text-gray-400">
                        JPG, JPEG, PNG, PDF
                    </p>
                </div>
            {:else}
                <img
                    class="max-h-full max-w-full"
                    src={backIdPreview ?? ""}
                    alt="back-id"
                />
            {/if}
        </Dropzone>
    </div>
</div>
