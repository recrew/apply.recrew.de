<script lang="ts">
    import Cropper from "svelte-easy-crop";
    import {Avatar, Button, Fileupload, Heading} from "flowbite-svelte";
    import getCroppedImg from "$lib/utils/canvasUtils.js";
    import {createEventDispatcher} from "svelte";

    export let aspect:number = 1.6;
    export let name = 'avatar';


    const dispatch = createEventDispatcher();

    let files: FileList;
    let image: string;
    let crop = {x: 0, y: 0};
    let zoom = 1;
    let croppedImage: Blob | null;
    let preview: string;

    function onFileSelected() {
        // 1 MB
        if (files[0].size > (1048576 * 4)) {
            alert('Die Datei ist zu groß!');
            return;
        }
        let reader = new FileReader();
        reader.onload = e => {
            image = e.target.result;
        };
        reader.readAsDataURL(files[0]);
    }

    async function saveCroppedFile(e: CustomEvent<{
        pixels: { x: number, y: number, width: number, height: number }
    }>) {
        croppedImage = await getCroppedImg(image, e.detail.pixels);
        preview = URL.createObjectURL(croppedImage)
        // Convert Blob into File
        const fileNameParts = files[0].name.split('.')
        const fileName = (fileNameParts[0].includes('-cropped') ? fileNameParts[0] : fileNameParts[0] + '-cropped') + '.' + fileNameParts[fileNameParts.length -1];
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
    <Fileupload bind:files accept="image/*" {name}/>
    <Button type="button"
            on:click={() => {
                onFileSelected()
            }}>Zuschneiden
    </Button>
    {/if}
</div>

{#if image}
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
    <Heading tag="h3" class="text-neutral-600 font-lg">Vorschau</Heading>
    <div class="grid place-items-center my-3">
        <img src={preview} alt="preview" class="w-3/4"/>
    </div>
    <div class="grid place-items-end">
        <Button type="button" on:click={submit}>Übernehmen</Button>
    </div>
{/if}
