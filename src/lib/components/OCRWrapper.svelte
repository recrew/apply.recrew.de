<script lang="ts">
    import { Heading, Modal, Spinner } from "flowbite-svelte";
    import ImageCropper from "./ImageCropper.svelte";
    import { post } from "$lib/api";
    import { createEventDispatcher } from "svelte";
    export let type: string;
    export let value: any;
    export let cropperModal = true;
    export let title: string;
    let files: File[];
    let loading = false;
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
    const readOcr = async (): Promise<void> => {
        loading = true;
        const reader = new FileReader();
        reader.onload = async () => {
            const result = await post("/ocr/parse", {
                base64Image: reader.result,
            });
            const parsed = result.ParsedResults[0];
            dispatch("ocr", {
                text: parsed.ParsedText,
                lines: parsed.TextOverlay?.Lines ?? [],
                file: files[0],
            });
            cropperModal = false;
            loading = false;
        };

        reader.readAsDataURL(files[0]);
    };
</script>

<slot></slot>

<Modal bind:open={cropperModal} autoclose={false}>
    <svelte:fragment slot="header">
        <Heading class="text-xl font-semibold text-gray-900 dark:text-white">{title}</Heading>
    </svelte:fragment>
    <div class="my-5">
        {#if loading}
            <Spinner />
        {:else}
            <ImageCropper
                previewOnly={type === "health-certificate"}
                aspect={getAspect()}
                on:cropped={({ detail }) => {
                    files = detail.files;

                    readOcr();
                }}
            />
        {/if}
    </div>
</Modal>
