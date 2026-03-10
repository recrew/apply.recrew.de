<script lang="ts">
    import { Input, Label } from "flowbite-svelte";
    import { get } from "$lib/api";
    import { onMount } from "svelte";
    import { GlobeSolid } from "flowbite-svelte-icons";
    import Typeahead from "$lib/components/Typeahead.svelte";

    export let employee: any;
    export let getInputClass: (fieldName: string) => string = () => "";
    export let changedFields: Set<string> = new Set();

    let countries: any[] = [];

    onMount(async () => {
        if (typeof employee.address === "undefined" || employee.address === null) {
            employee.address = {};
        } else {
            // Filter "0" and "undefined" values to show empty strings in UI
            ["street", "number", "zip", "place", "addressAddendum"].forEach(field => {
                if (employee.address[field] === "0" || employee.address[field] === 0 || employee.address[field] === "undefined") {
                    employee.address[field] = "";
                }
            });
        }

        countries = (await get("/hr/reference/Staaten"))
            .map((n: any) => ({ ...n, name: n.value }))
            .sort((a: any, b: any) => a.name.localeCompare(b.name));
    });
</script>

<div title="Adresse">
    {#if employee.address}
        <div class="grid grid-cols-3 gap-3 mt-2">
            <div class="col-span-1">
                <Label for="street" class="mb-2">Straße *</Label>
                <Input
                    type="text"
                    bind:value={employee.address.street}
                    id="street"
                    class={getInputClass("street")}
                    required
                />
            </div>
            <div>
                <Label for="number" class="mb-2">Hausnummer *</Label>
                <Input
                    type="text"
                    bind:value={employee.address.number}
                    pattern="[0-9]*"
                    id="number"
                    class={getInputClass("number")}
                    required
                />
            </div>
            <div>
                <Label for="addressAddendum" class="mb-2">Zusatz</Label>
                <Input
                    type="text"
                    bind:value={employee.address.addressAddendum}
                    id="addressAddendum"
                    class={getInputClass("addressAddendum")}
                />
            </div>
            <div>
                <Label for="plz" class="mb-2">PLZ *</Label>
                <Input
                    type="text"
                    bind:value={employee.address.zip}
                    id="plz"
                    class={getInputClass("zip")}
                    required
                />
            </div>
            <div class="col-span-2">
                <Label for="place" class="mb-2">Ort *</Label>
                <Input
                    type="text"
                    bind:value={employee.address.place}
                    id="place"
                    class={getInputClass("place")}
                    required
                />
            </div>
            <div class="col-span-3">
                <Label for="country" class="mb-2">Land *</Label>
                <Typeahead
                    bind:value={employee.address.country}
                    id="country"
                    data={countries}
                    icon={GlobeSolid}
                    class={getInputClass("country")}
                    required
                />
            </div>
        </div>
    {/if}
</div>
