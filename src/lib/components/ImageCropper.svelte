<script lang="ts">
    import Cropper from "svelte-easy-crop";
    import { Button, Heading, Hr } from "flowbite-svelte";
    import getCroppedImg from "$lib/utils/canvasUtils.js";
    import { createEventDispatcher, onDestroy, onMount } from "svelte";
    import { convertPdfToImageFromFileInput } from "$lib/utils/convertPdfToImage";
    import { compressImage } from "$lib/utils/imageCompression";
    import { ZoomOutOutline, ZoomInOutline } from "flowbite-svelte-icons";

    export let aspect: number = 1.6;
    export let name = "avatar";
    export let previewOnly = false;

    const dispatch = createEventDispatcher();

    let files: FileList;
    let image: string;
    let crop = { x: 0, y: 0 };
    let zoom = 1;
    let croppedImage: Blob | null;
    let preview: string;

    let rotation = 0;

    let hasCamera = false;
    let cameraActive = false;
    let videoElement: HTMLVideoElement;
    let stream: MediaStream;

    let fileInput: HTMLInputElement;

    const MAX_INPUT_SIZE = 25 * 1024 * 1024;

    function replaceFiles(file: File) {
        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(file);
        files = dataTransfer.files;
    }

    function clearFiles() {
        files = new DataTransfer().files;
        if (fileInput) fileInput.value = "";
    }

    function canvasToBlob(
        canvas: HTMLCanvasElement,
        type: string,
        quality?: number,
    ): Promise<Blob> {
        return new Promise((resolve, reject) => {
            canvas.toBlob(
                (blob) =>
                    blob
                        ? resolve(blob)
                        : reject(new Error("Bild konnte nicht verarbeitet werden.")),
                type,
                quality,
            );
        });
    }

    onMount(async () => {
        try {
            const devices = await navigator.mediaDevices.enumerateDevices();
            hasCamera = devices.some((device) => device.kind === "videoinput");
        } catch (e) {
            console.warn("Error detecting camera", e);
        }
    });

    async function startCamera() {
        try {
            stream = await navigator.mediaDevices.getUserMedia({
                video: {
                    facingMode: "environment",
                    width: { ideal: 1920 },
                    height: { ideal: 1080 },
                },
            });
            cameraActive = true;
            setTimeout(() => {
                if (videoElement) {
                    videoElement.srcObject = stream;
                } else {
                    console.log("videoElement is null");
                }
            }, 10);
        } catch (err) {
            console.error("Camera access denied or failed:", err);
            cameraActive = false;
            hasCamera = false; // Fallback to upload if camera fails
        }
    }

    function stopCamera() {
        if (stream) {
            stream.getTracks().forEach((track) => track.stop());
        }
        cameraActive = false;
    }

    export function cleanup() {
        stopCamera();
    }

    onDestroy(cleanup);

    async function capturePhoto() {
        const canvas = document.createElement("canvas");
        canvas.width = videoElement.videoWidth;
        canvas.height = videoElement.videoHeight;
        const ctx = canvas.getContext("2d");

        try {
            if (!ctx) throw new Error("Canvas wird von diesem Browser nicht unterstützt.");
            ctx.drawImage(videoElement, 0, 0);
            const captured = await canvasToBlob(canvas, "image/jpeg", 0.9);
            const file = await compressImage(
                new File([captured], `capture-${Date.now()}.jpg`, {
                    type: "image/jpeg",
                }),
            );
            replaceFiles(file);
            croppedImage = previewOnly ? file : null;
            image = canvas.toDataURL("image/jpeg", 0.9);
            preview = previewOnly ? URL.createObjectURL(file) : image;
            stopCamera();
        } catch (error) {
            console.error("Camera image processing failed", error);
            alert("Das Foto konnte nicht verarbeitet werden. Bitte versuche es erneut.");
        }
    }

    async function handleFileSelection() {
        if (!files?.[0]) return;

        if (files[0].size === 0) {
            alert("Die ausgewählte Datei ist leer. Bitte wähle sie erneut aus.");
            clearFiles();
            return;
        }

        if (files[0].size > MAX_INPUT_SIZE) {
            alert("Die Datei ist zu groß! (max. 25 MB vor der Kompression)");
            clearFiles();
            return;
        }

        image = "";
        preview = "";
        croppedImage = null;

        let file: File;

        if (files[0].type === "application/pdf") {
            const imgBlob = await convertPdfToImageFromFileInput(files);
            file = new File(
                [imgBlob as any],
                files[0].name.replace(/\.pdf$/i, ".png"),
                { type: "image/png" },
            );
            const dt = new DataTransfer();
            dt.items.add(file);
            files = dt.files;
        } else {
            file = files[0];
        }

        if (file.size === 0) {
            alert("Die ausgewählte Datei ist leer. Bitte wähle sie erneut aus.");
            clearFiles();
            return;
        }

        if (previewOnly) {
            try {
                file = await compressImage(file);
            } catch (error) {
                console.error("Image compression failed", error);
                alert("Das Bild konnte nicht komprimiert werden.");
                clearFiles();
                return;
            }
        }

        replaceFiles(file);
        croppedImage = previewOnly ? file : null;

        const reader = new FileReader();
        reader.onload = (e) => {
            image = e.target?.result as string;
            preview = previewOnly ? image : URL.createObjectURL(file);
        };
        reader.readAsDataURL(file);
    }

    const rotate = () => {
        const interim = new Image();
        const interimCanvas = document.createElement("canvas");
        const ctx = interimCanvas.getContext("2d");

        interim.onload = () => {
            interimCanvas.width = interim.height;
            interimCanvas.height = interim.width;
            ctx?.translate(interimCanvas.width / 2, interimCanvas.height / 2);
            ctx?.rotate((90 * Math.PI) / 180);
            ctx?.drawImage(interim, -interim.width / 2, -interim.height / 2);
            image = interimCanvas.toDataURL();
        };
        interim.src = image;
    };

    async function saveCroppedFile(
        e: CustomEvent<{
            pixels: { x: number; y: number; width: number; height: number };
        }>,
    ) {
        const tempCroppedImage = await getCroppedImg(image, e.detail.pixels, 0);
        if (!tempCroppedImage) {
            return;
        }

        const baseName = files[0].name.split(".")[0];
        const fileName =
            (baseName.includes("-cropped") ? baseName : baseName + "-cropped") +
            ".jpg";

        try {
            const file = await compressImage(
                new File([tempCroppedImage], fileName, {
                    type: tempCroppedImage.type,
                }),
            );
            croppedImage = file;
            preview = URL.createObjectURL(file);
            replaceFiles(file);
        } catch (error) {
            console.error("Cropped image processing failed", error);
            alert("Der Zuschnitt konnte nicht verarbeitet werden.");
        }
    }
    function zoomIn() {
        zoom = Math.min(zoom + 0.1, 3);
    }
    function zoomOut() {
        zoom = Math.max(zoom - 0.1, 1);
    }

    function submit() {
        dispatch("cropped", {
            image: croppedImage,
            files,
        });
    }
</script>

<div class="flex flex-col gap-4">
    {#if !preview}
        {#if cameraActive}
            <div
                class="relative w-full aspect-[4/3] bg-black rounded-lg overflow-hidden"
            >
                <!-- svelte-ignore a11y-media-has-caption -->
                <video
                    bind:this={videoElement}
                    autoplay
                    playsinline
                    class="w-full h-full object-cover"
                ></video>
                <div
                    class="absolute bottom-4 left-0 right-0 flex justify-center gap-2"
                >
                    <Button pill color="red" on:click={stopCamera}
                        >Abbrechen</Button
                    >
                    <Button pill color="blue" on:click={capturePhoto}
                        >Foto aufnehmen</Button
                    >
                </div>
            </div>
        {:else}
            <div class="flex gap-2 place-items-center justify-between">
                {#if hasCamera}
                    <Button
                        class="whitespace-nowrap flex-1"
                        on:click={startCamera}>Kamera starten</Button
                    >
                {/if}
                <input
                    type="file"
                    class="hidden"
                    bind:this={fileInput}
                    bind:files
                    on:change={handleFileSelection}
                    accept="image/*,application/pdf"
                    {name}
                />
                <Button outline color="light" on:click={() => fileInput?.click()}
                    >Datei auswählen</Button
                >

            </div>
        {/if}
    {/if}
</div>

{#if image && !cameraActive}
    {#if !previewOnly}
        <div class="relative">
            <div class="relative w-full h-80 my-3">
                <Cropper
                    {image}
                    bind:crop
                    bind:zoom
                    zoomSpeed={0.5}
                    on:cropcomplete={saveCroppedFile}
                    {aspect}
                    showGrid={true}
                />
            </div>
            <Button
                color="light"
                outline
                class="absolute top-0 right-0"
                on:click={() => rotate()}
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="1em"
                    height="1em"
                    viewBox="0 0 32 32"
                >
                    <path
                        fill="currentColor"
                        d="M15.5 5.27a8.5 8.5 0 0 1 5.09 1.686L18.807 8.74l8.428 2.255l-2.26-8.427l-1.89 1.89A12 12 0 0 0 15.5 1.77C8.827 1.773 3.418 7.18 3.417 13.855c0 4.063 2.012 7.647 5.084 9.838v-4.887a8.55 8.55 0 0 1-1.584-4.952a8.594 8.594 0 0 1 8.584-8.584zm-6 23.96h12V12.355h-12z"
                    />
                </svg>
            </Button>
        </div>

        <Heading tag="h3" class="text-neutral-600 font-lg">Vorschau</Heading>
    {/if}
    <div class="grid place-items-center my-3">
        <img src={preview} alt="preview" class="w-3/4" />
    </div>
    <Hr />
    <div class="flex justify-between w-full mt-2">
        <Button
            outline
            color="red"
            type="button"
            on:click={() => {
                image = "";
                preview = "";
                croppedImage = null;
                clearFiles();
                if (hasCamera) startCamera();
            }}>Reset</Button
        >
        <div class="flex gap-2">
            <button
                type="button"
                on:click|preventDefault={zoomOut}
                color="light"
            >
                <ZoomOutOutline size="md" color="primary" />
            </button>
            <button type="button" on:click|preventDefault={zoomIn} color="dark">
                <ZoomInOutline size="md" color="white" />
            </button>
        </div>
        <Button
            type="button"
            disabled={!previewOnly && !croppedImage}
            on:click={submit}>Übernehmen</Button
        >
    </div>
{/if}
