<script lang="ts">
    import { Heading, Modal, Spinner } from "flowbite-svelte";
    import ImageCropper from "./ImageCropper.svelte";
    import { post } from "$lib/api";
    import { createEventDispatcher } from "svelte";
    export let type: string;
    export let cropperModal = true;
    export let title: string;
    export let skipOcr = false;
    let files: File[];
    let loading = false;
    let imageCropper: any;
    let dispatch = createEventDispatcher();
    const getAspect = (): number => {
        if (type === "passport") {
            return 1.53;
        }
        if (type === "id-card") {
            return 1.6;
        }
        // DIN A4
        return 0.707;
    };
    let ocrError: string | null = null;

    const readFileAsDataURL = (file: File): Promise<string> =>
        new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = () => reject(reader.error);
            reader.readAsDataURL(file);
        });

    const readOcr = async (): Promise<void> => {
        loading = true;
        ocrError = null;
        try {
            const dataUrl = await readFileAsDataURL(files[0]);
            const result = await post("/ocr/parse", { base64Image: dataUrl });
            const parsed = result.ParsedResults[0];
            dispatch("ocr", {
                text: parsed.ParsedText,
                lines: parsed.TextOverlay?.Lines ?? [],
                file: files[0],
            });
            cropperModal = false;
        } catch (error) {
            ocrError = "OCR-Erkennung fehlgeschlagen. Bitte versuche es erneut.";
        } finally {
            loading = false;
        }
    };

    const acceptWithoutOcr = (): void => {
        dispatch("ocr", {
            text: "",
            lines: [],
            file: files[0],
        });
        cropperModal = false;
    };

    $: if (!cropperModal) {
        imageCropper?.cleanup();
    }
</script>

<slot></slot>

<Modal bind:open={cropperModal} autoclose={false}>
    <svelte:fragment slot="header">
        <Heading class="text-xl font-semibold text-gray-900 dark:text-white">{title}</Heading>
    </svelte:fragment>
    <div class="my-5">
        {#if ocrError}
            <p class="mb-4 text-sm text-red-600">{ocrError}</p>
        {/if}
        {#if loading}
            <Spinner />
        {:else}
            <ImageCropper
                bind:this={imageCropper}
                previewOnly={type === "health-certificate"}
                aspect={getAspect()}
                on:cropped={({ detail }) => {
                    files = detail.files;

                    if (skipOcr) acceptWithoutOcr();
                    else readOcr();
                }}
            />
        {/if}
    </div>
</Modal>
