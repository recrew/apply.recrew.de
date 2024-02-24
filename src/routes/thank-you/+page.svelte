<script>
    import {Card, Heading, Hr} from "flowbite-svelte";
    import QrCode from "svelte-qrcode"
    import {FacebookSolid, NewspaperSolid, TwitterSolid} from "flowbite-svelte-icons";

    let link = "https://sroehrl.github.io/apply.recrew.de/";
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

        <a href="https://twitter.com/intent/tweet?text=Habe%20mich%20gerade%20bei%20RECREW%20beworben:%20{link}" class="flex justify-center items-center mb-4 w-10 h-10 rounded-full bg-primary-100 lg:h-12 lg:w-12 dark:bg-primary-900">
            <TwitterSolid class="w-6 h-6 inline"/>
        </a>
        <QrCode value={link} class="mt-3 "/>
        <a href="https://www.facebook.com/sharer/sharer.php?u={link}" class="flex justify-center items-center mb-4 w-10 h-10 rounded-full bg-primary-100 lg:h-12 lg:w-12 dark:bg-primary-900">
            <FacebookSolid class="w-6 h-6 inline"/>
        </a>
    </div>
</div>

