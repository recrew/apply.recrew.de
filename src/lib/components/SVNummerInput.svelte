<script lang="ts">
    import {Input, Label, Helper} from "flowbite-svelte";
    import {createEventDispatcher} from "svelte";
    import {validateSVNummer as validate} from "$lib/utils/svNummerValidation";

    export let value: string = ''
    export let id: string = 'sv'
    export let required: boolean = true
    export let isValid: boolean = false
    export let employee: any = null

    let error = ''

    const dispatch = createEventDispatcher()

    // Reactive validation - run whenever value or employee data changes
    $: {
        const birthDate = employee?.dateOfBirth?.value || null
        const surname = employee?.lastName || null
        const gender = employee?.gender || null

        const result = validate(value, required, birthDate, surname, gender)
        isValid = result.isValid
        error = result.error
        dispatch('validate', { isValid, error })
    }
</script>

<div>
    <Label class="mb-2" for={id}>
        SV-Nummer (Sozialversicherungsnummer)
    </Label>
    <Input
        {id}
        placeholder=""
        bind:value
        color={error ? 'red' : 'base'}
        {required}
        on:input
        on:blur
        on:focus
    />
    {#if error}
        <Helper class="mt-2" color="red">{error}</Helper>
    {/if}
</div>
