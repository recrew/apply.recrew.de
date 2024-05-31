<script lang="ts">
    import Box from "$lib/components/Box.svelte";
    import {Input, Label, P} from "flowbite-svelte";
    import {onMount} from "svelte";
    export let employee: any;

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
    onMount(() => {
        getBankDetails()
    })
</script>

<Box title="Bankdaten">
    {#if employee.bankAccount}
    <div class="grid grid-cols-2 gap-3 mt-2">
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
</Box>