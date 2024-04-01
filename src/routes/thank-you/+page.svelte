<script>
    import {Card, Heading, Hr} from "flowbite-svelte";
    import QrCode from "svelte-qrcode"
    import {FacebookSolid, NewspaperSolid, ShareAllSolid, ShareNodesSolid, TwitterSolid} from "flowbite-svelte-icons";
    import CopyToClipboard from "$lib/components/CopyToClipboard.svelte";

    let link = "https://apply.recrew.de/";
</script>

<div class="flex items-center justify-center my-10">
    <Card href="/cards">
        <h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Danke!</h5>
        <p class="font-normal text-gray-700 dark:text-gray-400 leading-tight">Deine Anfrage wurde gesendet. Wir melden uns!</p>
    </Card>

</div>
<Hr/>
<div class="w-4/5 mx-auto dark:text-white mb-12">
    <Heading class="mt-3 text-center" tag="h5">Lust mit deinen Freunden zu arbeiten?</Heading>
    <p class="text-center mb-3">Schnellbewerbung teilen:</p>
    <div class="flex gap-8 justify-center">


        <a href="https://www.instagram.com/recrewjobs/" class="flex justify-center items-center mb-4 w-10 h-10 rounded-full bg-primary-100 lg:h-12 lg:w-12 dark:bg-primary-900">
            <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="currentColor" d="M13.028 2c1.125.003 1.696.009 2.189.023l.194.007c.224.008.445.018.712.03c1.064.05 1.79.218 2.427.465c.66.254 1.216.598 1.772 1.153a4.908 4.908 0 0 1 1.153 1.772c.247.637.415 1.363.465 2.428c.012.266.022.487.03.712l.006.194c.015.492.021 1.063.023 2.188l.001.746v1.31a78.831 78.831 0 0 1-.023 2.188l-.006.194c-.008.225-.018.446-.03.712c-.05 1.065-.22 1.79-.466 2.428a4.883 4.883 0 0 1-1.153 1.772a4.915 4.915 0 0 1-1.772 1.153c-.637.247-1.363.415-2.427.465a72.11 72.11 0 0 1-.712.03l-.194.006c-.493.014-1.064.021-2.189.023l-.746.001h-1.309a78.43 78.43 0 0 1-2.189-.023l-.194-.006a63.036 63.036 0 0 1-.712-.031c-1.064-.05-1.79-.218-2.428-.465a4.889 4.889 0 0 1-1.771-1.153a4.904 4.904 0 0 1-1.154-1.772c-.247-.637-.415-1.363-.465-2.428a74.1 74.1 0 0 1-.03-.712l-.005-.194A79.047 79.047 0 0 1 2 13.028v-2.056a78.82 78.82 0 0 1 .022-2.188l.007-.194c.008-.225.018-.446.03-.712c.05-1.065.218-1.79.465-2.428A4.88 4.88 0 0 1 3.68 3.678a4.897 4.897 0 0 1 1.77-1.153c.638-.247 1.363-.415 2.428-.465c.266-.012.488-.022.712-.03l.194-.006a79 79 0 0 1 2.188-.023zM12 7a5 5 0 1 0 0 10a5 5 0 0 0 0-10m0 2a3 3 0 1 1 .001 6a3 3 0 0 1 0-6m5.25-3.5a1.25 1.25 0 0 0 0 2.5a1.25 1.25 0 0 0 0-2.5"/></svg>
        </a>
        <a href="https://www.facebook.com/sharer/sharer.php?u={link}" class="flex justify-center items-center mb-4 w-10 h-10 rounded-full bg-primary-100 lg:h-12 lg:w-12 dark:bg-primary-900">
            <FacebookSolid class="w-6 h-6 inline"/>
        </a>
        <CopyToClipboard textToCopy={link}>
            <div class="flex justify-center items-center mb-4 w-10 h-10 rounded-full bg-primary-100 lg:h-12 lg:w-12 dark:bg-primary-900">
                <ShareNodesSolid/>
            </div>
        </CopyToClipboard>
    </div>
    <div class="grid place-items-center">
        <QrCode value={link} class="mt-3 "/>
    </div>
</div>

