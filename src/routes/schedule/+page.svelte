<script lang="ts">
    import {onMount} from "svelte";
    import {get, post} from "$lib/api";
    import {page} from "$app/stores";
    import {Heading} from "flowbite-svelte";
    import {PUBLIC_CALENDLY_TELEPHONE, PUBLIC_CALENDLY_TRAINING} from "$env/static/public";

    let serverData: any;
    let error = false;
    let container;
    const Calendly = window.Calendly
    

    function inform(event){
        if(event.origin === "https://calendly.com" && event.data.event && event.data.event.indexOf("calendly.event_scheduled") === 0){
            post('/calendly/schedule-event', {
                employeeUuid: $page.url.searchParams.get('sheet'),
                calendlyEventUuid: event.data.payload.event.uri.split('/').pop(),
                calendlyInviteeUuid: event.data.payload.invitee.uri.split('/').pop()
            })
            console.log({event})
        }
    }

    onMount(async () => {
        try{
            serverData = await get('/hr/applicant/' + $page.url.searchParams.get('sheet') + '/phone-appointment');

            let url = serverData.status === 'data-verified' ? serverData['get-to-know'] : PUBLIC_CALENDLY_TELEPHONE;


            Calendly.initInlineWidget({
                url: url + '?hide_landing_page_details=1&primary_color=82cff2',
                parentElement: container,
                prefill: {
                    name: serverData.name,
                    email: serverData.email,
                    location: serverData.mobile.replace(/\D/g, '')
                },
                utm: {
                    utmContent: serverData.uuid,
                    utmSource: 'apply.recrew.de'
                }
            });
        } catch (e) {
            error = true;
        }

    })
</script>
<svelte:window on:message={inform} />
{#if error}
    <div class="text-center">
        <Heading class="text-red-600" tag="h2">Fehler</Heading>
        <p>Dieser Link ist ungültig oder nicht mehr verfügbar.</p>
        <p>Melde dich unter +49 (0) 89 2555 757 96, wenn du von uns hierher geschickt worden bist.</p>
    </div>

{/if}
<div class="w-full" bind:this={container} style="height:700px;"></div>
