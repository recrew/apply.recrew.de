<script lang="ts">
    import { onMount } from "svelte";
    import { page } from "$app/stores";
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
    import { get, put } from "$lib/api";

    let evaluation: any = null;
    let selectedShifts: Shift[] = [];
    let loading = true;
    let submitting = false;
    let error = false;

    onMount(() => {
        fetchEvaluation();
    });

    async function fetchEvaluation() {
        loading = true;
        error = false;
        try {
            const uuid = $page.url.searchParams.get('evaluation');
            evaluation = await get(`/rating/${uuid}`);
        } catch (err) {
            console.error(err);
            error = true;
        } finally {
            loading = false;
        }
    }

    function optionCount(section: ChoiceGroupSection, option: string): number {
        return section.items.filter((i) => i.value === option).length;
    }

    function maxPerOption(section: ChoiceGroupSection): number {
        return (section as any).maxPerOption ?? 3;
    }

    function capitalize(str: string): string {
        return str.trim()
            ? str[0].toUpperCase() + str.slice(1)
            : "Keine Angabe";
    }

    async function submit() {
        if (!evaluation) return;
        submitting = true;
        try {
            const payload = {
                employeeUuid: evaluation.employeeData.uuid,
                ratingEmployeeUuid: evaluation.ratingEmployeeData.uuid,
                ratingUuid: evaluation.uuid,
                ratingJson: evaluation.rating,
            };
            await put(
                `/employee/${payload.employeeUuid}/rating/${payload.ratingUuid}`,
                payload,
            );
            evaluation.doneAt.value = new Date().toISOString();
        } catch (err) {
            console.error(err);
            alert("Fehler beim Absenden. Bitte später erneut versuchen.");
        } finally {
            submitting = false;
        }
    }
</script>

<svelte:head>
    <title>Bewertung | ReCrew</title>
</svelte:head>

{#if loading}
    <div class="w-full banner" />
    <div class="p-4 max-w-screen-lg mx-auto my-8">
        <div class="animate-pulse space-y-4">
            <div class="h-8 bg-gray-200 rounded w-2/5"></div>
            <div class="h-6 bg-gray-200 rounded"></div>
            <div class="h-6 bg-gray-200 rounded"></div>
            <div class="h-6 bg-gray-200 rounded"></div>
            <div class="h-10 bg-gray-200 rounded w-1/3"></div>
        </div>
    </div>
{:else if error}
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
{:else if evaluation && evaluation.doneAt.value !== null}
    <div class="my-8 px-2 max-w-screen-lg mx-auto">
        <Alert color="green" border>
            <InfoCircleSolid slot="icon" class="w-4 h-4" />
            <p class="font-medium text-lg">Bewertung erfolgreich!</p>
            <p>Vielen Dank für deine Bewertung!</p>
        </Alert>
    </div>
{:else if evaluation}
    <div class="w-full banner" />
    <div class="md:w-4/5 px-2 lg:max-w-screen-lg mx-auto my-12">
        {#if evaluation.title}
            <h1 class="text-center text-3xl font-extrabold mb-8">
                {evaluation.title}
            </h1>
        {/if}

        <form on:submit|preventDefault={submit} class="space-y-6">
            <Section title="Allgemeine Infos">
                <div
                    class="md:col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-6 p-4 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded mb-6"
                >
                    <div>
                        <Label class="text-gray-500">Bewertende(r)</Label>
                        <div class="mt-1 font-medium">
                            {evaluation.ratingEmployeeData.name}
                        </div>
                    </div>
                    <div class="flex justify-center items-center">
                        <div class="w-12 h-12 bg-gray-200 rounded-full">
                            <div
                                class="flex items-center justify-center h-full w-full"
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
                                                        maxPerOption(section) &&
                                                        trait.value !== option}
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
                <Button type="submit" disabled={submitting}>
                    {submitting ? "Sende..." : "Absenden"}
                </Button>
            </div>
        </form>
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
