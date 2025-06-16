<script lang="ts">
    import { onMount } from "svelte";
    import { Input, Button, Radio, Alert, Label } from "flowbite-svelte";
    import { InfoCircleSolid } from "flowbite-svelte-icons";
    import Section from "$lib/components/Section.svelte";
    import ShiftWizard from "$lib/components/ShiftWizard.svelte";
    import StarRating from "$lib/components/StarRating.svelte";

    import type {
        EvaluationSection,
        ChoiceGroupSection,
        Shift,
    } from "$lib/types/evaluationTypes";
    import { put } from "$lib/api";

    export let data: {
        errorMessage?: string;
        evaluation: {
            id: string;
            uuid: string;
            employeeId: number;
            ratingEmployeeId: number;
            employeeData: {
                id: number;
                uuid: string;
                name: string;
            };
            ratingEmployeeData: {
                id: number;
                uuid: string;
                name: string;
            };
            shifts: Shift[];
            ratingJson: string | null;
            rating: EvaluationSection[];
            title: string | null;
            createdAt: string;
            updatedAt: string;
            deletedAt: string | null;
        };
    };

    const { errorMessage, evaluation: initialEval } = data;
    let evaluation = structuredClone(initialEval);
    let selectedShifts: Shift[] = [];

    function optionCount(section: ChoiceGroupSection, option: string): number {
        return section.items.filter((i) => i.value === option).length;
    }

    function maxPerOption(section: ChoiceGroupSection): number {
        return (section as any).maxPerOption ?? 3;
    }

    async function submit() {
        try {
            const payload = {
                employeeUuid: evaluation.employeeData.uuid,
                ratingEmployeeUuid: evaluation.ratingEmployeeData.uuid,
                ratingUuid: evaluation.uuid,
                ratingJson: evaluation.rating,
            };

            const result = await put(
                `/employee/${payload.employeeUuid}/rating/${payload.ratingUuid}`,
                payload,
            );
            console.log("Bewertung erfolgreich übermittelt", result);
        } catch (err) {
            console.error("Fehler beim Absenden der Bewertung:", err);
            alert(
                "Fehler beim Absenden der Bewertung. Bitte versuche es später erneut.",
            );
        }
    }

    function capitalize(str: string): string {
        return str.trim().length === 0
            ? "Keine Angabe"
            : str.charAt(0).toUpperCase() + str.slice(1);
    }
</script>

<svelte:head>
    <title>Bewertung | ReCrew</title>
</svelte:head>

{#if errorMessage}
    <div class="my-8 px-2 max-w-screen-lg mx-auto">
        <Alert color="red" border>
            <InfoCircleSolid slot="icon" class="w-4 h-4" />
            <p class="font-medium text-lg">Fehler!</p>
            <p>
                Der Link ist ungültig oder abgelaufen. Falls die Bewertung
                bereits erfolgt ist, bitte work@recrew.de kontaktieren.
            </p>
        </Alert>
    </div>
{:else if evaluation.doneAt.value !== null}
<div class="my-8 px-2 max-w-screen-lg mx-auto">
    <Alert color="green" border>
        <InfoCircleSolid slot="icon" class="w-4 h-4" />
        <p class="font-medium text-lg">Bewertung erfolgreich!</p>
        <p>
            Vielen Dank für deine Bewertung! Sie wurde erfolgreich übermittelt.
        </p>
    </Alert>
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
                        class="md:col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-6 p-4 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded mb-6"
                    >
                        <div>
                            <Label class="text-gray-500">Bewertende(r)</Label>
                            <div
                                class="mt-1 text-gray-900 dark:text-gray-300 font-medium"
                            >
                                {evaluation.ratingEmployeeData?.name || ""}
                            </div>
                        </div>
                        <div class="flex items-center justify-center">
                            <div
                                class="w-12 h-12 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    class="h-5 w-5 text-gray-500"
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                >
                                    <path
                                        fill-rule="evenodd"
                                        d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                                        clip-rule="evenodd"
                                    />
                                </svg>
                            </div>
                        </div>
                        <div>
                            <Label class="text-gray-500">Zu bewerten</Label>
                            <div
                                class="mt-1 text-gray-900 dark:text-gray-300 font-medium"
                            >
                                {evaluation.employeeData?.name || ""}
                            </div>
                        </div>
                    </div>

                    <ShiftWizard
                        shifts={evaluation.shifts}
                        bind:selected={selectedShifts}
                    />
                </Section>
                {#each evaluation.rating as section}
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
                                    class="font-semibold text-gray-600 bg-gray-50 mb-3"
                                    style={`display:grid;grid-template-columns:4fr repeat(${section.options.length},1fr);`}
                                >
                                    <div />
                                    {#each section.options as option}
                                        <div class="text-center">
                                            {#if option}
                                                {capitalize(option)}
                                                <span class="text-gray-500">
                                                    ({optionCount(
                                                        section,
                                                        option,
                                                    )}/{maxPerOption(section)})
                                                </span>
                                            {:else}
                                                {capitalize(option)}
                                            {/if}
                                        </div>
                                    {/each}
                                </div>

                                <div class="divide-y divide-gray-200">
                                    {#each section.items as trait}
                                        <div
                                            class="py-3"
                                            style={`display:grid;grid-template-columns:4fr repeat(${section.options.length},1fr);`}
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
                                                        disabled={optionCount(
                                                            section,
                                                            option,
                                                        ) >=
                                                            maxPerOption(
                                                                section,
                                                            ) &&
                                                            trait.value !==
                                                                option}
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
