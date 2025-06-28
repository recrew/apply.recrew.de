<script lang="ts">
    import Cropper from "svelte-easy-crop";
    import {Avatar, Button, Fileupload, Heading, Hr} from "flowbite-svelte";
    import getCroppedImg, {createImage} from "$lib/utils/canvasUtils.js";
    import {createEventDispatcher} from "svelte";
    import convertPdfToImage, {convertPdfToImageFromFileInput} from "$lib/utils/convertPdfToImage";
    import {RedoOutline} from "flowbite-svelte-icons";

    export let aspect:number = 1.6;
    export let name = 'avatar';
    export let previewOnly = false;


    const dispatch = createEventDispatcher();

    let files: FileList;
    let image: string;
    let crop = {x: 0, y: 0};
    let zoom = 1;
    let croppedImage: Blob | null;
    let preview: string;

    let rotation = 0;

    async function onFileSelected() {
        // 4 MB
        if (files[0].size > (1048576 * 4)) {
            alert('Die Datei ist zu groß!');
            return;
        }
        let file;

        if(files[0].type === 'application/pdf') {
            file = await convertPdfToImageFromFileInput(files)
        } else {
            file = files[0];

        }
        let reader = new FileReader();
        reader.onload = e => {
            image = e.target.result;
        };
        reader.readAsDataURL(file);

        if (previewOnly) {
            preview = URL.createObjectURL(file);
        }
    }

    const rotate = () => {
        const interim = new Image()
        const interimCanvas = document.createElement('canvas');
        const ctx = interimCanvas.getContext('2d');


        interim.onload = () => {
            interimCanvas.width = interim.height;
            interimCanvas.height = interim.width;
            ctx?.translate(interimCanvas.width / 2, interimCanvas.height / 2);
            ctx?.rotate((90 * Math.PI) / 180);
            ctx?.drawImage(interim, -interim.width / 2, -interim.height / 2);
            image = interimCanvas.toDataURL();
        }
        interim.src = image;
    }

    async function saveCroppedFile(e: CustomEvent<{
        pixels: { x: number, y: number, width: number, height: number }
    }>) {
        croppedImage = await getCroppedImg(image, e.detail.pixels, 0);
        preview = URL.createObjectURL(croppedImage)
        // Convert Blob into File
        const fileNameParts = files[0].name.split('.')
        const fileName = (fileNameParts[0].includes('-cropped') ? fileNameParts[0] : fileNameParts[0] + '-cropped') + '.' + croppedImage.type.split('/')[1];
        const file = new File([croppedImage], fileName, {type: croppedImage.type});
        // Create a new DataTransfer instance
        const dataTransfer = new DataTransfer();
        // Add file to DataTransfer
        dataTransfer.items.add(file);
        files = dataTransfer.files;
    }

    function submit() {
        dispatch('cropped', {
            image: croppedImage,
            files
        })
    }

</script>

<div class="flex gap-2">
    {#if !preview}
    <Fileupload bind:files accept="image/*,application/pdf" {name}/>
    <Button type="button"
            on:click={() => {
                onFileSelected()
            }}>{previewOnly ? 'Vorschau' : 'Zuschneiden'}
    </Button>
    {/if}
</div>

{#if image}
    {#if !previewOnly}
        <div class="relative">

            <div class="relative w-full h-80 my-3">
                <Cropper
                        {image}
                        bind:crop
                        bind:zoom
                        on:cropcomplete={saveCroppedFile}
                        {aspect}
                        showGrid={true}
                />
            </div>
            <Button color="light" outline class="absolute top-0 right-0" on:click={() => rotate()}>
                <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 32 32">
                    <path fill="currentColor" d="M15.5 5.27a8.5 8.5 0 0 1 5.09 1.686L18.807 8.74l8.428 2.255l-2.26-8.427l-1.89 1.89A12 12 0 0 0 15.5 1.77C8.827 1.773 3.418 7.18 3.417 13.855c0 4.063 2.012 7.647 5.084 9.838v-4.887a8.55 8.55 0 0 1-1.584-4.952a8.594 8.594 0 0 1 8.584-8.584zm-6 23.96h12V12.355h-12z" />
                </svg>
            </Button>
        </div>

        <Heading tag="h3" class="text-neutral-600 font-lg">Vorschau</Heading>
    {/if}
    <div class="grid place-items-center my-3">
        <img src={preview} alt="preview" class="w-3/4"/>
    </div>
    <Hr/>
    <div class="flex justify-between w-full mt-2">
        <Button outline color="red" type="button" on:click={() => {image = null; preview = null}}>Reset</Button>
        <Button type="button" on:click={submit}>Übernehmen</Button>
    </div>
{/if}
