<script lang="ts">
    import Box from "$lib/components/Box.svelte";
    import {Button, Input, Label, P} from "flowbite-svelte";
    import {onMount} from "svelte";
    import {currentStep} from "$lib/stores/currentStep";
    import {reactToBoxInteraction} from "$lib/utils/openStep";
    import {BellRingOutline, CheckCircleOutline} from "flowbite-svelte-icons";
    export let employee: any;
    import {blocked} from "$lib/stores/blocked";
    import markEmptyFields from "$lib/utils/markEmptyFields";
    import updateCall from "$lib/utils/updateCall";


    let bankDetails = null;

    function getBankDetails() {
        if(! employee.bankAccount) {
            employee.bankAccount = {};
        }
        if(typeof employee.bankAccount.iban === 'undefined') {
            return;
        }
        fetch(`https://openiban.com/validate/${employee.bankAccount.iban}?getBIC=true&validateBankCode=true`).then(j => j.json()).then(j => {
            bankDetails = j
            employee.bankAccount.bankName = j.bankData.name
            employee.bankAccount.bicSwift = j.bankData.bic

        })
    }
    $: dataComplete = employee.bankAccount && employee.bankAccount.iban && employee.bankAccount.accountName
    onMount(() => {
        getBankDetails()
    })


    const proceed = async () => {
        if(!dataComplete){
            return markEmptyFields()
        }
        updateCall(employee)
        currentStep.update((n) => n + 1)

    }
</script>

<Box disabled={$blocked} title="Bankdaten" open={$currentStep === 4} on:open={ev => reactToBoxInteraction(ev, 4)} icon={dataComplete ? CheckCircleOutline : BellRingOutline}>
    {#if employee.bankAccount}
    <div class="grid md:grid-cols-2 gap-3 mt-2">
        <div>
            <Label class="mb-2" for="accountName">Kontoinhaber *</Label>
            <Input id="accountName" bind:value={employee.bankAccount.accountName} required/>
        </div>
        <div>
            <Label class="mb-2" for="iban">IBAN *</Label>
            <Input on:blur={getBankDetails} id="iban" bind:value={employee.bankAccount.iban} required/>
        </div>
        <div>
            <Label class="mb-2" for="bic">BIC *</Label>
            <Input id="bic" bind:value={employee.bankAccount.bicSwift} required/>
        </div>
        <div>
            <Label class="mb-2" for="bank">Bankname</Label>
            <Input id="bank" bind:value={employee.bankAccount.bankName} />
        </div>
    </div>
    {/if}
    <Button on:click={() => proceed()} class="mt-5 w-full">Weiter</Button>
</Box>