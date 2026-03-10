<script lang="ts">
    import Cropper from "svelte-easy-crop";
    import { Button, Heading, Hr } from "flowbite-svelte";
    import getCroppedImg from "$lib/utils/canvasUtils.js";
    import { createEventDispatcher, onMount } from "svelte";
    import { convertPdfToImageFromFileInput } from "$lib/utils/convertPdfToImage";
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

    function capturePhoto() {
        const canvas = document.createElement("canvas");
        canvas.width = videoElement.videoWidth;
        canvas.height = videoElement.videoHeight;
        const ctx = canvas.getContext("2d");
        ctx?.drawImage(videoElement, 0, 0);
        image = canvas.toDataURL("image/png");

        // Create a File object from the captured image
        canvas.toBlob((blob) => {
            if (blob) {
                const file = new File([blob], `capture-${Date.now()}.png`, {
                    type: "image/png",
                });
                const dataTransfer = new DataTransfer();
                dataTransfer.items.add(file);
                files = dataTransfer.files;
                preview = previewOnly ? image : URL.createObjectURL(file);
                stopCamera();
            }
        }, "image/png");
    }

    async function handleFileSelection() {
        if (!files?.[0]) return;

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
        let tempCroppedImage = await getCroppedImg(image, e.detail.pixels, 0);
        if (tempCroppedImage) {
            // Iterative compression logic
            let quality = 0.9;
            const targetSize = 1024 * 1024; // 1024 KB
            let finalBlob = tempCroppedImage;

            if (tempCroppedImage.size > targetSize) {
                const img = await new Promise<HTMLImageElement>((resolve) => {
                    const i = new Image();
                    i.onload = () => resolve(i);
                    i.src = URL.createObjectURL(tempCroppedImage!);
                });

                const canvas = document.createElement("canvas");
                canvas.width = img.width;
                canvas.height = img.height;
                const ctx = canvas.getContext("2d");

                while (quality > 0.1) {
                    ctx?.clearRect(0, 0, canvas.width, canvas.height);
                    ctx?.drawImage(img, 0, 0);
                    finalBlob = await new Promise<Blob>((resolve) => {
                        canvas.toBlob(
                            (b) => resolve(b!),
                            "image/jpeg",
                            quality,
                        );
                    });
                    if (finalBlob.size <= targetSize) break;
                    quality -= 0.1;
                }
            }

            croppedImage = finalBlob;
            preview = URL.createObjectURL(croppedImage);
            // Convert Blob into File
            const fileNameParts = files[0].name.split(".");
            const fileName =
                (fileNameParts[0].includes("-cropped")
                    ? fileNameParts[0]
                    : fileNameParts[0] + "-cropped") + ".jpg";
            const file = new File([croppedImage], fileName, {
                type: croppedImage.type,
            });
            // Create a new DataTransfer instance
            const dataTransfer = new DataTransfer();
            // Add file to DataTransfer
            dataTransfer.items.add(file);
            files = dataTransfer.files;
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
        <Button type="button" on:click={submit}>Übernehmen</Button>
    </div>
{/if}
