<script lang="ts">
    import {Button, Checkbox, Dropzone, Heading, Helper, Input, Label, Select, Textarea} from "flowbite-svelte";
    import {goto} from "$app/navigation";
    import {
        NewspaperSolid, UserCircleSolid,
    } from "flowbite-svelte-icons";
    import Botr from "$lib/components/Botr.svelte";

    import {formDataPost} from "$lib/api";
    import {page} from "$app/stores";
    import {modalStore} from "$lib/stores/modal";
    import {base} from "$app/paths";
    import {onMount} from "svelte";

    let preview = null;
    let form;
    let valid = false;

    let candidate = {
        firstname:'',
        lastname:'',
        email:'',
        mobile:'',
        region: $page.url.searchParams.get('region') || '',
        application_field: $page.url.searchParams.get('application') || 'Service',
        letter_motivation:'',
        photo: null,
        reCapRes:'',
        application_source: 'Recruiting-Formular',
        facebook: undefined,
        instagram: undefined,
        referer: null
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

    const dropHandle = (event: DragEvent) => {
        candidate.photo = null;
        event.preventDefault();
        if (event.dataTransfer.items) {
            [...event.dataTransfer.items].forEach((item, i) => {
                if (item.kind === 'file') {
                    candidate.photo = item.getAsFile();
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
        if(!candidate.photo){
            delete candidate.photo
        }
        try{
            const res = await formDataPost('/hr/application', candidate)
            goto(base + '/thank-you' + '?ref=' + res.employee.uuid)

        }
        catch (e){
            $modalStore.content = "Es ist ein Fehler aufgetreten: " + e;
            $modalStore.toggle()
        }
        valid = true;
    }
    onMount(() => {
        if($page.url.searchParams.get('ref')) {
            candidate.referer = $page.url.searchParams.get('ref');
        }
    })



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

<div class="md:w-4/5 px-2 lg:max-w-screen-lg mx-auto mb-24">
    <section>
        <div class="py-8 px-4 mx-auto max-w-screen-xl text-center lg:py-16 lg:px-12">

            <p class="mb-4 text-2xl font-normal tracking-tight leading-none text-gray-900 md:text-4xl lg:text-5xl dark:text-white">
                Wir bieten:</p>
            <h1 class="mb-4 text-3xl font-extrabold tracking-tight leading-none text-gray-700 md:text-4xl lg:text-5xl dark:text-white">
                Den flexibelsten Nebenjob der Stadt</h1>
            <p class="font-semibold mb-2 dark:text-white">
                Täglich neue Jobs und Aufgaben als Teil einer familiären Crew meistern:
            </p>
            <p class=" dark:text-white">
                Werde ein Teil unserer Crew und bewirb dich noch heute bei uns! Wir freuen uns auf deine (Schnell)
                Bewerbung.
            </p>
        </div>
        <div class="rounded-lg shadow shadow-primary-400 py-3 px-4">
            <Heading class="text-neutral-600" tag="h3">Schnellbewerbung</Heading>
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
                        <Label for="email" class="mb-2">E-Mail</Label>
                        <Input bind:value={candidate.email} type="email" id="email" placeholder="max.mustermann@googlemail.com" required />
                    </div>
                    <div>
                        <Label for="mobile" class="mb-2">Handynummer</Label>
                        <Input bind:value={candidate.mobile} pattern={'[\\+]\\d{1,3}\\s*\\d{3,4}\\s*\\d{4,8}'} type="text" id="mobile" placeholder="+49 161 123456" required />
                        <div class="relative">
                            {#if candidate.mobile.length > 3 && !candidate.mobile.match(/\+\d{1,3}\s*\d{3,4}\s*\d{4,8}/)}
                                <Helper class="absolute" color="yellow">Formatierung beachten: +[Land] [Vorwahl] [Nummer] <span class="text-[11px]">(z.B. +49 161 123456)</span></Helper>
                            {:else if candidate.mobile.length > 0 && !candidate.mobile.match(/\+\d{1,3}/)}
                                <Helper class="absolute" color="red">Bitte Ländervorwahl angeben <span class="text-[11px]">(z.B. +49)</span></Helper>
                            {/if}
                        </div>

                    </div>
                    <div>
                        <Label for="region" class="mb-2">Region</Label>
                        <Select bind:value={candidate.region} id="region" required items={regions} />
                    </div>
                    <div>
                        <Label for="application_field" class="mb-2">Einsatzbereich</Label>
                        <Select bind:value={candidate.application_field} id="application_field" required items={application_fields} />
                    </div>
                    <div>
                        <Label for="facebook" class="mb-2">Facebook Profil</Label>
                        <Input bind:value={candidate.facebook} type="text" id="facebook" placeholder="https://www.facebook.com/hans.mustermann"  />
                        <Helper class="mt-0.5 pl-1">Optional</Helper>
                    </div>
                    <div>
                        <Label for="insta" class="mb-2">Instagram Profil</Label>
                        <Input bind:value={candidate.instagram} type="text" id="insta" placeholder="https://www.instagram.com/mustermann/"  />
                        <Helper class="mt-0.5 pl-1">Optional</Helper>
                    </div>
                    <div>
                        <Label for="letter_motivation" class="mb-2">Du willst ins Team weil...</Label>
                        <Textarea minlength="5" maxlength="700" bind:value={candidate.letter_motivation} rows="9" id="letter_motivation" required />
                        <Helper class="mt-1" color={(candidate.letter_motivation.length < 5 || candidate.letter_motivation.length > 700)  ? 'red' : 'green'}>{candidate.letter_motivation.length}/700</Helper>
                    </div>

                    <div class="mt-2">
                        <Dropzone on:drop={dropHandle}
                                  on:dragover={(event) => {
                                        event.preventDefault();
                                      }}
                                  on:change={handleChange}>
                            {#if !candidate.photo}
                                <UserCircleSolid class="w-12 h-12 text-primary-800/70 dark:text-white"/>
                                <Heading class="text-neutral-600" tag="h4">Bild hochladen</Heading>
                                <p class="mb-2 text-sm text-gray-500 dark:text-gray-400"><span class="font-semibold">Klicken</span> oder drag & drop</p>
                                <p class="text-xs text-gray-500 dark:text-gray-400">PNG oder JPG</p>
                            {:else}
                                <img class="max-h-full max-w-full" src={preview} alt="profile-pic">
                            {/if}

                        </Dropzone>
                    </div>

                </div>
                <div class="grid gap-3">
                    <Botr bind:valid/>
                    <Checkbox required>Ich bin mit der Verarbeitung meiner Daten einverstanden <span class="text-xs pl-2">(<a class="visited:text-blue-600 hover:text-blue-600 text-blue-500" rel="nofollow noopener" target="_blank" href="https://www.recrew.info/kopie-von-dsgvo">Datenschutzerklärung</a>)</span></Checkbox>
                    <Button disabled={!valid} type="submit">BEWERBEN</Button>

                </div>
            </form>
        </div>

    </section>
</div>

