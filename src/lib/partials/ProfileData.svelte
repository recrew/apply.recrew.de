<script lang="ts">
    import {
        Avatar,
        Button,
        Heading,
        Label,
        Select,
    } from "flowbite-svelte";
    import { onDestroy } from "svelte";
    import Box from "$lib/components/Box.svelte";
    import AddressData from "$lib/partials/AddressData.svelte";
    import {
        BellRingOutline,
        CheckCircleOutline,
    } from "flowbite-svelte-icons";
    import { reactToBoxInteraction } from "$lib/utils/openStep";
    import { currentStep } from "$lib/stores/currentStep";
    import markEmptyFields from "$lib/utils/markEmptyFields";
    import { blocked } from "$lib/stores/blocked";
    import updateCall from "$lib/utils/updateCall";

    export let employee: any;

    let avatarFiles: FileList;

    let dataComplete = false;
    $: {
        dataComplete =
            !!(employee.cv.familyStatus &&
            employee.address?.country &&
            employee.address?.street &&
            employee.address?.zip &&
            employee.address?.place);

        if ($currentStep === 2) {
            $blocked = !dataComplete;
        }

        if (avatarFiles && avatarFiles.length > 0) {
            employee.avatarFile = avatarFiles[0];
        }
    }

    // Als reaktiver Wert statt Aufruf im Template: dort lief createObjectURL bei
    // jedem Render und die vorherige Blob-URL wurde nie freigegeben.
    let avatarPreview = "";
    $: setAvatarPreview(employee.avatarFile);

    function setAvatarPreview(avatarFile: File | string | null) {
        const previous = avatarPreview;
        if (!avatarFile) avatarPreview = "";
        else if (typeof avatarFile === "string") avatarPreview = avatarFile;
        else avatarPreview = URL.createObjectURL(avatarFile);

        if (previous.startsWith("blob:") && previous !== avatarPreview) {
            URL.revokeObjectURL(previous);
        }
    }

    onDestroy(() => {
        if (avatarPreview.startsWith("blob:")) URL.revokeObjectURL(avatarPreview);
    });

    const proceed = async () => {
        if (!dataComplete) {
            markEmptyFields();
        } else {
            await updateCall(employee);
            currentStep.update((n) => n + 1);
        }
    };
</script>

<Box
    disabled={!dataComplete}
    title="Profil & Kontakt"
    open={$currentStep === 2}
    on:open={(ev) => reactToBoxInteraction(ev, 2)}
    icon={dataComplete ? CheckCircleOutline : BellRingOutline}
>
    <div class="mb-8">
        <Label for="avatarFile" class="inline-block cursor-pointer">
            <div
                class="text-sm rtl:text-right font-medium block text-gray-900 dark:text-gray-300 mb-2"
            >
                Profilbild (Optional)
            </div>
            <Avatar
                src={avatarPreview}
                rounded
                size="xl"
            >{employee.firstName?.charAt(0) || ""}{employee.lastName?.charAt(0) || ""}</Avatar>
        </Label>
        <input
            bind:files={avatarFiles}
            class="hidden"
            type="file"
            id="avatarFile"
            accept="image/*"
        />
    </div>

    <div class="grid md:grid-cols-2 gap-3 mb-8">
        <div>
            <Label for="familyStatus" class="mb-2">Familienstand *</Label>
            <Select
                bind:value={employee.cv.familyStatus}
                id="familyStatus"
                required
            >
                <option value="single">ledig / single</option>
                <option value="married">verheiratet</option>
                <option value="registered_partnership"
                    >eingetragene Lebenspartnerschaft</option
                >
                <option value="divorced">geschieden</option>
                <option value="widowed">verwitwet</option>
                <option value="other">nicht bekannt</option>
            </Select>
        </div>
    </div>

    <Heading class="text-neutral-600 mb-4" tag="h5">Adresse</Heading>
    <AddressData bind:employee />

    <Button on:click={() => proceed()} class="mt-8 w-full">Weiter</Button>
</Box>
