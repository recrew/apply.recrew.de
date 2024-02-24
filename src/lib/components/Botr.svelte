<script lang="ts">
import {onMount} from "svelte";
import {Heading} from "flowbite-svelte";

export let valid = false;

let wabe = "";

let boxes = [
    {value: false},
    {value: false},
    {value: false},
    {value: false},
    {value: false},
    {value: false},
    {value: false},
    {value: false},
    {value: false},
];

let solution:any = [];

const onClick = (i: number) => {
    boxes[i].value =! boxes[i].value
    let correct = true;
    for(let j = 0; j < boxes.length; j++) {
        if(boxes[j].value !== solution[j].value) {
            correct = false
            break;
        }
    }
    if(wabe !== "") {
        correct = false
    }
    valid = correct;
}

onMount(() => {
    solution = boxes.map(box => ({...box}))
    solution.forEach(box => box.value = Math.random() > 0.5);

})


</script>
<Heading tag="h5">Spam Schutz</Heading>
<input on:input={() => onClick(0)} name="wabe" type="text" style="height: 1px; opacity: 0" bind:value={wabe}>
<div class="mb-3 flex gap-3">
    <div>
        <p class="dark:text-white">Generiert</p>
        <div class="grid grid-cols-3 grid-rows-3 w-[60px]">
            {#each solution as item,i}
                <div class="border h-[20px] {item.value?'bg-neutral-300':'bg-neutral-100'}">
                </div>
            {/each}
        </div>
    </div>

    <div class="min-w-[100px]">
        <p class="dark:text-white">Deine Kopie</p>
        <div class="grid grid-cols-3 grid-rows-3 w-[60px]">
            {#each boxes as item,i}
                <div class="border h-[20px] {item.value?'bg-neutral-300':'bg-neutral-100'}"
                     role="button"
                     tabindex="0"
                     on:keypress={() => onClick(i)}
                     on:click={() => onClick(i)}>

                </div>
            {/each}
        </div>
    </div>
    <div class="pt-6">
        <p class="dark:text-white">
            <span class="font-medium">Hilfe:</span>
            Erzeuge das genaue Abbild von "Generiert", indem du im zweiten Feld ("Deine Kopie") die jeweiligen Kästchen klickst.
        </p>
    </div>


</div>
