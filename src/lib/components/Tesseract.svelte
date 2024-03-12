<script lang="ts">
    import {createWorker, PSM} from 'tesseract.js';
    import {Fileupload, Label, Select, Spinner} from "flowbite-svelte";
    import {createEventDispatcher, onMount} from "svelte";

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
    let text = '';
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
            loading = true;
            preview = reader.result
            readOcr().then(() => {
                loading = false;
            })
        }
    }

    const readOcr = async () => {
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
<div>
    {#if options.length > 1}
        <div class="mb-2">
            <Label for="type" class="mb-2">Dokumenttyp</Label>
            <Select bind:value={type} items={options} placeholder="Typ"/>
        </div>

    {/if}
    {#if type}
        <div class="mb-2">
            <Label for="type" class="mb-2">Dokument</Label>
            <Fileupload accept="image/*" bind:files/>
        </div>
    {/if}
</div>

{#if preview && !loading}
    <img class="py-2" src={preview} alt="preview"/>
{:else if loading}
    <Spinner class="m-5"/>
{/if}