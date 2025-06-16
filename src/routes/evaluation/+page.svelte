<script lang="ts">
    import { Input, Button, Radio, Alert, Label } from "flowbite-svelte";
    import { InfoCircleSolid } from "flowbite-svelte-icons";
    import StarRating from "$lib/components/StarRating.svelte";
    import type {
        EvaluationTemplate,
        EvaluationSection,
        ChoiceGroupSection,
        Shift,
    } from "$lib/types/evaluationTypes";
    import Section from "$lib/components/Section.svelte";
    import ShiftWizard from "$lib/components/ShiftWizard.svelte";

    export let data: {
        token: string | null;
        rebuddyData?: {
            rebuddyName: string;
            starterName: string;
            shifts: Shift[];
        };
        errorMessage?: string;
        template: EvaluationTemplate[];
    };

    function capitalize(str: string): string {
        return str.trim().length === 0
            ? "Keine Angabe"
            : str.charAt(0).toUpperCase() + str.slice(1);
    }

    const baseTemplate: EvaluationTemplate = structuredClone(data.template[0]);
    baseTemplate.submittedBy.uuid = data.token ?? "";
    baseTemplate.shifts = data.rebuddyData?.shifts ?? [];
    baseTemplate.shifts = baseTemplate.shifts;

    let evaluation: EvaluationTemplate = structuredClone(baseTemplate);

    let traitSection: ChoiceGroupSection | undefined;
    let positiveCount = 0;
    let negativeCount = 0;

    $: traitSection = evaluation.sections.find(
        (s): s is ChoiceGroupSection => s.type === "choice-group",
    );

    $: if (traitSection) {
        positiveCount = traitSection.items.filter(
            (i) => i.value === traitSection.options[0],
        ).length;
        negativeCount = traitSection.items.filter(
            (i) => i.value === traitSection.options[1],
        ).length;
    }

    function getCleanCopy(src: EvaluationTemplate): EvaluationTemplate {
        const copy = structuredClone(src);

        copy.sections = copy.sections
            .map((section) => {
                switch (section.type) {
                    case "rating-group": {
                        section.items = section.items.filter(
                            (item) =>
                                item.value !== "" &&
                                item.value !== 0 &&
                                item.value !== null,
                        );
                        return section.items.length ? section : null;
                    }
                    case "choice-group": {
                        section.items = section.items.filter(
                            (item) => item.value !== "",
                        );
                        return section.items.length ? section : null;
                    }
                    case "text": {
                        section.value = section.value.trim();
                        return section.value ? section : null;
                    }
                }
            })
            .filter(Boolean) as EvaluationSection[];

        return copy;
    }

    async function submit() {
        const cleaned = getCleanCopy(evaluation);

        console.log("Submitting evaluation", cleaned);
    }
</script>

<svelte:head>
    <title
        >Bewertung {data.rebuddyData?.starterName || "Starter"} | ReCrew</title
    >
</svelte:head>

{#if data.errorMessage}
    <div class="my-8 px-2 max-w-screen-lg mx-auto">
        <Alert border color="red">
            <InfoCircleSolid slot="icon" class="w-4 h-4" />
            <p class="font-medium text-lg">Fehler!</p>
            <p>Dieser Link ist entweder ungültig oder nicht mehr verfügbar.</p>
        </Alert>
        <p class="mt-3 dark:text-white">
            Diese Meldung wird auch dann angezeigt, wenn du die Bewertung
            bereits abgegeben hast. Solltest du von uns auf diesen Link
            geschickt worden sein, bitte melde dich bei work@recrew.de.
        </p>
    </div>
{:else}
    <!-- BANNER -->
    <div class="w-full banner" />

    <div class="md:w-4/5 px-2 lg:max-w-screen-lg mx-auto my-24">
        {#if evaluation.title}
            <h1
                class="text-center mb-10 text-2xl font-extrabold tracking-tight leading-none text-gray-700 md:text-4xl lg:text-5xl dark:text-white"
            >
                {evaluation.title}
            </h1>
        {/if}
        <div class="rounded-lg shadow shadow-primary-400 py-3 px-4">
            <form on:submit|preventDefault={submit} class="mt-4">
                <Section title="Allgemeine Infos">
                    <div
                        class="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6 p-4 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded mb-6"
                    >
                        <div>
                            <Label class="text-gray-500">Bewertender</Label>
                            <div
                                class="mt-1 text-gray-900 dark:text-gray-300 font-medium"
                            >
                                {data.rebuddyData?.rebuddyName || ""}
                            </div>
                        </div>
                        <div>
                            <Label class="text-gray-500">Zu bewerten</Label>
                            <div
                                class="mt-1 text-gray-900 dark:text-gray-300 font-medium"
                            >
                                {data.rebuddyData?.starterName || ""}
                            </div>
                        </div>
                    </div>
                    <div class="md:col-span-2">
                        <Label class="text-gray-900">
                            Auf welche Schichten bezieht sich die Bewertung von
                            {data.rebuddyData?.starterName}?
                        </Label>
                        <ShiftWizard
                            bind:shifts={evaluation.shifts}
                        />
                    </div>
                </Section>
                {#each evaluation.sections as section}
                    <Section
                        title={section.title || ""}
                        helpText={section.description}
                    >
                        {#if section.type === "rating-group"}
                            {#each section.items as item}
                                <StarRating
                                    label={item.label}
                                    bind:rating={item.value}
                                    total={item.max}
                                />
                            {/each}
                        {:else if section.type === "choice-group"}
                            <div class="md:col-span-2">
                                <div
                                    class="grid grid-cols-[4fr_1fr_1fr_1fr] items-center font-semibold text-gray-600 bg-gray-50 mb-3"
                                >
                                    <div />
                                    {#each section.options as option}
                                        <div class="text-center">
                                            {capitalize(option)}
                                        </div>
                                    {/each}
                                </div>
                                <div class="divide-y divide-gray-200">
                                    {#each section.items as trait}
                                        <div
                                            class="grid grid-cols-[4fr_1fr_1fr_1fr] items-center py-3"
                                        >
                                            <div class="text-gray-700">
                                                {trait.label}
                                            </div>
                                            {#each section.options as option}
                                                <div class="text-center">
                                                    <Radio
                                                        bind:group={trait.value}
                                                        value={option}
                                                        id={`radio-${trait.id}-${option}`}
                                                        class="mx-auto"
                                                        disabled={(option ===
                                                            section
                                                                .options[0] &&
                                                            positiveCount >=
                                                                3 &&
                                                            trait.value !==
                                                                section
                                                                    .options[0]) ||
                                                            (option ===
                                                                section
                                                                    .options[1] &&
                                                                negativeCount >=
                                                                    3 &&
                                                                trait.value !==
                                                                    section
                                                                        .options[1])}
                                                    />
                                                </div>
                                            {/each}
                                        </div>
                                    {/each}
                                </div>
                            </div>
                        {:else if section.type === "text"}
                            <div class="md:col-span-2">
                                <Input bind:value={section.value} type="text" />
                            </div>
                        {/if}
                    </Section>
                {/each}

                <div class="grid gap-3">
                    <Button type="submit">ABSCHICKEN</Button>
                </div>
            </form>
        </div>
    </div>
{/if}

<style>
    .banner {
        background-image: url("/barkeeper-1400x600.jpg");
        background-size: cover;
        background-position: bottom left;
        background-repeat: no-repeat;
        height: 50vh;
    }
</style>
