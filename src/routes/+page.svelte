<script lang="ts">
    import {Button, Checkbox, Dropzone, Heading, Input, Label, Select, Textarea} from "flowbite-svelte";
    import {goto} from "$app/navigation";
    import {
        NewspaperSolid, UserCircleSolid,
    } from "flowbite-svelte-icons";
    import Botr from "$lib/components/Botr.svelte";

    import {formDataPost} from "$lib/api";

    let preview = null;
    let form;
    let valid = false;

    let candidate= {
        firstname:'',
        lastname:'',
        email:'',
        mobile:'',
        region:'',
        application_field:'Service',
        letter_motivation:'',
        photo: null,
        reCapRes:'',
        application_source: 'Recruiting-Formular'
    }
    let regions = [
        { value: 'Berlin', name: 'Berlin' },
        { value: 'Hamburg', name: 'Hamburg' },
        { value: 'München', name: 'München' },
    ];
    let application_fields = [
        { value: 'Service', name: 'Service' },
        { value: 'Event', name: 'Event' },
        { value: 'Driver', name: 'Driver' },
        { value: 'Promotion', name: 'Promotion' },
        { value: 'Messe', name: 'Messe' },
        { value: 'Küche', name: 'Küche' },
        { value: 'Logistik', name: 'Logistik' },
        { value: 'Sales', name: 'Sales' },
        { value: 'IT', name: 'IT' },
        { value: 'Consulting', name: 'Consulting' },
        { value: 'Backoffice', name: 'Backoffice' },
    ].sort((a,b) => a.name.localeCompare(b.name));

    const dropHandle = (event) => {
        candidate.photo = null;
        event.preventDefault();
        if (event.dataTransfer.items) {
            [...event.dataTransfer.items].forEach((item, i) => {
                if (item.kind === 'file') {
                    const file = item.getAsFile();
                    candidate.photo = file;
                }
            });
        } else {
            [...event.dataTransfer.files].forEach((file, i) => {
                candidate.photo = file;
            });
        }
        showPreview()
    };

    const handleChange = (event) => {
        const files = event.target.files;
        if (files.length > 0) {
            candidate.photo = files[0];
            showPreview()
        }
    };
    const showPreview = () => {
        const reader = new FileReader();
        reader.onload = (e) => {
            preview = e.target.result;
        }
        reader.readAsDataURL(candidate.photo);
    }

    const submit = async () => {
        valid = false;
        try{
            const res = await formDataPost('/hr/application', candidate)
            goto('/thank-you')

        }
        catch (e){
            alert(e)
        }
    }


</script>
<style>
    .banner {
        background-image: url('/barkeeper-1400x600.jpg');
        background-size: cover;
        background-position: bottom left;
        background-repeat: no-repeat;
        height: 50vh;
    }
</style>
<div class="w-full banner"></div>

<div class="w-4/5 lg:max-w-screen-lg mx-auto mb-24">
    <section>
        <div class="py-8 px-4 mx-auto max-w-screen-xl text-center lg:py-16 lg:px-12">

            <p class="mb-4 text-2xl font-normal tracking-tight leading-none text-gray-900 md:text-4xl lg:text-5xl dark:text-white">
                Wir bieten:</p>
            <h1 class="mb-4 text-3xl font-extrabold tracking-tight leading-none text-gray-700 md:text-4xl lg:text-5xl dark:text-white">
                Den flexibelsten Nebenjob der Stadt</h1>
            <p class="mb-8 text-lg font-normal text-gray-500 lg:text-xl sm:px-16 xl:px-48 dark:text-gray-400">Flexibel,
                jung & dynamisch: Das ist recrew. </p>
        </div>
        <div class="grid grid-cols-3 gap-3">
            <div class="col-span-3 lg:col-span-1 dark:text-white">
                <div class="flex justify-center items-center mb-4 w-10 h-10 rounded-full bg-primary-100 lg:h-12 lg:w-12 dark:bg-primary-900">

                    <NewspaperSolid class="w-6 h-6 inline"/>
                </div>
                <p class="font-semibold mb-2">
                    Täglich neue Jobs und Aufgaben als Teil einer familiären Crew meistern:
                </p>
                <p>
                    Werde ein Teil unserer Crew und bewirb dich noch heute bei uns! Wir freuen uns auf deine (Schnell)
                    Bewerbung.
                </p>

            </div>
            <div class="col-span-3 lg:col-span-2 rounded-lg shadow shadow-primary-400 py-3 px-4">
                <Heading tag="h3">Schnellbewerbung</Heading>
                <form bind:this={form} on:submit|preventDefault={submit} class="mt-4">
                    <div class="grid gap-6 mb-6 md:grid-cols-2">
                        <div>
                            <Label for="first_name" class="mb-2">Vorname</Label>
                            <Input bind:value={candidate.firstname} type="text" id="first_name" placeholder="Max" required />
                        </div>
                        <div>
                            <Label for="last_name" class="mb-2">Nachname</Label>
                            <Input bind:value={candidate.lastname} type="text" id="last_name" placeholder="Mustermann" required />
                        </div>
                        <div>
                            <Label for="mobile" class="mb-2">Handynummer</Label>
                            <Input bind:value={candidate.mobile} type="text" id="mobile" placeholder="+49 161 123456" required />
                        </div>
                        <div>
                            <Label for="region" class="mb-2">Region</Label>
                            <Select bind:value={candidate.region} id="region" required items={regions} />
                        </div>
                        <div class="space-y-6">
                            <div>
                                <Label for="application_field" class="mb-2">Einsatzbereich</Label>
                                <Select bind:value={candidate.application_field} id="application_field" required items={application_fields} />
                            </div>
                            <div>
                                <Label for="letter_motivation" class="mb-2">Du willst ins Team weil...</Label>
                                <Textarea bind:value={candidate.letter_motivation} rows="6" id="letter_motivation" required />
                            </div>
                        </div>
                        <div class="mt-2">
                            <Dropzone on:drop={dropHandle}
                                      on:dragover={(event) => {
                                        event.preventDefault();
                                      }}
                                      on:change={handleChange}>
                                {#if !candidate.photo}
                                    <UserCircleSolid class="w-12 h-12 dark:text-white"/>
                                    <Heading tag="h4">Bild hochladen</Heading>
                                    <p class="mb-2 text-sm text-gray-500 dark:text-gray-400"><span class="font-semibold">Klicken</span> oder drag & drop</p>
                                    <p class="text-xs text-gray-500 dark:text-gray-400">PNG oder JPG</p>
                                {:else}
                                    <img src={preview} alt="">
                                {/if}

                            </Dropzone>
                        </div>

                    </div>
                    <div class="grid gap-3">
                        <Botr bind:valid/>
                        <Checkbox required>Ich bin mit der Verarbeitung meiner Daten einverstanden <span class="text-xs pl-2">(<a class="visited:text-blue-600 hover:text-blue-600 text-blue-500" href="https://www.recrew.info/kopie-von-dsgvo">Datenschutzerklärung</a>)</span></Checkbox>
                        <Button disabled={!valid} type="submit">BEWERBEN</Button>

                    </div>
                </form>
            </div>
        </div>
    </section>
</div>

