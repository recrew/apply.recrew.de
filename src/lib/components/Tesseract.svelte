<script lang="ts">
    import {createWorker, PSM} from 'tesseract.js';
    import {Button, Fileupload, Label, Modal, Select, Spinner, Tooltip} from "flowbite-svelte";
    import {createEventDispatcher, onMount} from "svelte";
    import {CloseCircleSolid, ImageOutline, QuestionCircleOutline} from "flowbite-svelte-icons";
    import {modalStore} from "$lib/stores/modal";
    import UploadTips from "$lib/partials/UploadTips.svelte";
    import ImageCropper from "$lib/components/ImageCropper.svelte";

    export let options = [{
        name: 'Personalausweis',
        value: 'id-card'
    }, {
        name: 'Reisepass',
        value: 'passport'
    }, {
        name: 'Führerschein',
        value: 'license'
    }]

    export let value: string;

    export let noRead = false;

    let text = '';
    let input;
    let files: FileList;
    let preview: any;
    let type: string;
    let loading = false;
    let cropperModal = false

    let expressions = {
        'passport': /^(?=.*\d)[A-Z0-9]+(?=<)/,
        'id-card': /^(?=.*\d)[A-Z0-9]+$/,
        'license': /^\s*(?=.*\d)[A-Z0-9]+$/
    }

    const dispatch = createEventDispatcher();

    const readFile = async () => {
        const reader = new FileReader();
        reader.readAsDataURL(files[0]);
        reader.onload = () => {
            preview = reader.result
            if(noRead) {
                dispatch('ocr', {
                    text: '',
                    file: files[0],
                    type
                })
            } else {
                readOcr()
            }

        }
    }

    const readOcr = async () => {
        loading = true;
        const worker = await createWorker('deu', 1);
        await worker.setParameters({
            tessedit_pageseg_mode: PSM.SPARSE_TEXT_OSD,
            tessedit_char_whitelist: '<0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZÜÄÖß.- ',
        })
        const ret = await worker.recognize(preview);
        text = '';
        ret.data.paragraphs.forEach((p) => {
            const clean = p.text.replace('\n', '').trim()
            const match = clean.match(expressions[type])
            if (match && clean.length > 4 && text.length === 0) {
                text = match[0]
                dispatch('ocr', {
                    text,
                    file: files[0],
                    type
                })
            }
        })
        if(text === ''){
            dispatch('ocr', {
                text,
                file: files[0],
                type
            })
        }
        await worker.terminate();
        loading = false;
    }
    const showHelp = () => {
        $modalStore.registerConfig({
            component: UploadTips,
            title: ""
        })
        $modalStore.toggle()
    }

    const showPreviewLightbox = () => {
        $modalStore.registerConfig({
            content: '<img src="' + preview + '"/>',
            title: "Vorschau",

        })
        $modalStore.toggle()
    }

    $: {
        if (files) {
            readFile()
        }

    }
    onMount(() => {
        if(options.length > 0){
            type = options[0].value
        }
        if(value && value.location) {
            preview = value.location
        }
    })

</script>
<article>
    {#if !preview}
    <div>
        {#if options.length > 1}
            <div class="mb-2">
                <Label for="type" class="mb-2">Dokumenttyp *</Label>
                <Select require bind:value={type} items={options} placeholder="Typ"/>
            </div>

        {/if}
        {#if type}
            <div class="mb-2">
                <Label  class="mb-2">{options.find(x => x.value === type)?.name || 'Dokument'} <QuestionCircleOutline size="xs" class="inline cursor-pointer" on:click={showHelp}/></Label>
                <Button on:click={() => cropperModal = true}>Hochladen</Button>
                <Modal title="Hochladen" bind:open={cropperModal} autoclose={false}>
                    <div class="my-5">
                        <ImageCropper aspect={type === 'passport'? 1.53 : 1.6} on:cropped={({detail}) => {
                            files = detail.files
                            cropperModal = false
                        }}/>
                    </div>
                </Modal>
<!--                <Fileupload accept="image/*, application/pdf" bind:files  bind:value={input}/>-->
            </div>
        {/if}
    </div>
    {/if}
    {#if preview && !loading}
        <Label  class="mb-2">{options.find(x => x.value === type)?.name || 'Dokument'} <QuestionCircleOutline size="xs" class="inline cursor-pointer" on:click={showHelp}/></Label>
        <div class="flex gap-3 relative max-w-full">
            {#if files}
            <p class="truncate">{files[0].name}</p>
            {/if}
            <Button pill={true} class="right-0 !p-2"  on:click={() => showPreviewLightbox()}><ImageOutline class="w-4"/></Button>
            <Tooltip>Vorschau</Tooltip>
            <Button pill={true} class="!p-2" color="red" on:click={() => {files = null; preview = null}}><CloseCircleSolid class="w-4"/></Button>
            <Tooltip>Löschen</Tooltip>

        </div>

    {:else if loading}
        <Spinner class="m-5"/>
    {/if}
</article>

