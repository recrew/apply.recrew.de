<script lang="ts">
    import {createEventDispatcher, onMount} from "svelte";
    import {Input, Label} from "flowbite-svelte";
    import {CheckOutline, CloseOutline, IconSolid, PenSolid} from "flowbite-svelte-icons";

    export let id = "input-" + Math.random().toString(36);
    export let displayProperty = 'name'
    export let label = ''
    export let value = ''
    export let data;
    export let inputClass = '';

    export let required = false;


    export let icon = PenSolid;

    export let extract = (item) => item;

    const dispatch = createEventDispatcher();

    let searchRef = null;

    let selectedIndex = null;
    let filteredItems = [];
    let showResults = false;
    let valid = false;
    let selectionError = false;

    $: filteredItems = !value || value.length === 0 ? [] : data
        .filter(x => typeof x[displayProperty] === 'string' ? x[displayProperty].toLowerCase().includes(value.toLowerCase()) : x[displayProperty].toString().toLowerCase().includes(value.toLowerCase()))


    /*if(value && data){
        value = data.find(x => x.value === value)[displayProperty] || value
    }*/
    const exactMatch = () => data.find(item =>
        item[displayProperty].toString().trim().toLowerCase() === value.trim().toLowerCase()
    )
    const validateSelection = () => {
        if (!required || !value) return;
        const match = exactMatch();
        if (match) {
            value = match[displayProperty];
            valid = true;
            selectionError = false;
        } else {
            value = '';
            valid = false;
            selectionError = true;
        }
    }
    const select = () => {
        const item = filteredItems[selectedIndex ?? 0];
        if (!item) return;
        value = item[displayProperty]
        extract(item)
        showResults = false
        valid = true
        selectionError = false
    }
    const navigate = pos => {
        if (filteredItems.length < 1) {
            return;
        }
        if (selectedIndex === null && pos > 0) {
            selectedIndex = 0;
        } else if (selectedIndex === null) {
            selectedIndex = filteredItems[filteredItems.length - 1]
        } else {
            selectedIndex = selectedIndex + pos;
        }
        if (typeof filteredItems[selectedIndex] === 'undefined') {
            selectedIndex = 0;
        }
    }

    let onFocus = () => {
        showResults = true;
        selectedIndex = null;
        if (!value || value.length === 0) {
            filteredItems = data;
        }
    }

    let onBlur = () => {
        validateSelection();
        setTimeout(() => {
            showResults = false;
            selectedIndex = null;
        }, 200)
    }

    let onKeydown = (e) => {
        switch (e.key) {
            case "Enter":
                e.preventDefault();
                filteredItems.length > 0 ? select() : validateSelection();
                break;
            case "ArrowDown":
                e.preventDefault();
                navigate(1);
                break;
            case "ArrowUp":
                e.preventDefault();
                navigate(-1);
                break;
            case "Escape":
                e.preventDefault();
                value = "";
                searchRef?.focus();
                showResults = false;
                break;
        }
    }
</script>

<div class="relative w-full">


    <Label for={id} class="space-y-2 relative">
        {#if label}
            <span>
                {label}
            </span>
        {/if}
        <Input
                bind:this={searchRef}
                required={required}
                class={inputClass}
                on:focus={onFocus}
                on:blur={onBlur}
                on:input={() => {showResults = true; selectedIndex = null; valid = false; selectionError = false; dispatch('input', value);}}
                on:keydown={onKeydown}
                bind:value
                id={id}
                type="text" >
            <span slot="left">
                {#if typeof icon === 'string' }
                    <i class="la text-primary-400 text-[24px] {icon}"></i>
                {:else}
                    <IconSolid icon={icon} class="text-primary-400"/>
                {/if}
            </span>
            <div slot="right" class="flex gap-2">
                {#if valid}
                    <CheckOutline class="w-4 text-green-500"></CheckOutline>
                {/if}
                {#if value && value.length > 2}
                    <div on:keydown={onKeydown} on:click={() => {selectedIndex = null; valid = false; value = ''; showResults = true;}}>
                        <CloseOutline class="w-3 cursor-pointer text-red-400" />
                    </div>
                {/if}
            </div>


        </Input>

    </Label>

    {#if selectionError}
        <p class="mt-1 text-sm text-red-600">Bitte einen Wert aus der Liste auswählen.</p>
    {/if}



    {#if showResults}
        <div class="absolute -left-1 -right-1 z-10 mt-1 bg-white/80">
            {#each filteredItems.sort((a, b) => a[displayProperty] < b[displayProperty] ? -1 : 1) as item, index}
                <div
                    class:font-medium={selectedIndex === index} class:ring-1={selectedIndex === index} class="p-2 bg-white m-0.5 text-sm border rounded-md ring-1 ring-inset hover:ring-primary-500"
                    on:mousedown|preventDefault={() => {selectedIndex=index; select()}}
                    on:keydown={() => {selectedIndex=index; select()}}
                    on:click={() => {if (!valid || value !== item[displayProperty]) {selectedIndex=index; select()}}}>
                    <slot {item} {index} {value}>
                        {@html item[displayProperty]}
                    </slot>
                </div>
            {/each}
            {#if $$slots["no-results"] && value && value.length > 0 && filteredItems.length === 0}
                <div class="p-2 my-0.5 border rounded-md bg-red-50">
                    <slot name="no-results" {value} />
                </div>
            {/if}
        </div>
    {/if}
</div>
