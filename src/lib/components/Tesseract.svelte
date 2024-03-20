<script lang="ts">
    import {createWorker, PSM} from 'tesseract.js';
    import {Button, Fileupload, Label, Select, Spinner, Tooltip} from "flowbite-svelte";
    import {createEventDispatcher, onMount} from "svelte";
    import {CloseCircleSolid, QuestionCircleOutline} from "flowbite-svelte-icons";
    import {modalStore} from "$lib/stores/modal";
    import UploadTips from "$lib/partials/UploadTips.svelte";

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

    export let noRead = false;

    let text = '';
    let input;
    let files: FileList;
    let preview: any;
    let type: string;
    let loading = false;

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

    $: {
        if (files) {
            readFile()
        }
    }
    onMount(() => {
        if(options.length === 1){
            type = options[0].value
        }
    })

</script>
<article>
    {#if !preview}
    <div>
        {#if options.length > 1}
            <div class="mb-2">
                <Label for="type" class="mb-2">Dokumenttyp</Label>
                <Select bind:value={type} items={options} placeholder="Typ"/>
            </div>

        {/if}
        {#if type}
            <div class="mb-2">
                <Label for="type" class="mb-2">{options[0].name} <QuestionCircleOutline size="sm" class="inline cursor-pointer" on:click={showHelp}/></Label>
                <Fileupload accept="image/*, application/pdf" bind:files  bind:value={input}/>
            </div>
        {/if}
    </div>
    {/if}
    {#if preview && !loading}
        <div class="flex justify-end relative pr-4">
            <Button pill={true} class="absolute top-0 right-0 !p-2" color="red" on:click={() => {files = null; preview = null}}><CloseCircleSolid class="w-4"/></Button>
            <Tooltip>Löschen</Tooltip>
            <img class="py-2 max-h-24" src={preview} alt="preview"/>
        </div>

    {:else if loading}
        <Spinner class="m-5"/>
    {/if}
</article>

