<script lang="ts">
    import { page } from "$app/stores";
    import {
        Heading,
        Label,
        Input,
        Button,
        Star,
        Radio,
    } from "flowbite-svelte";
    import StarRating from "$lib/components/StarRating.svelte";
    import ShiftWizard from "$lib/components/ShiftWizard.svelte";
    import type { Shift } from "$lib/components/ShiftWizard.svelte";

    export let data: {
        token: string | null;
        rebuddyData?: {
            rebuddyName: string;
            starterName: string;
            shifts: any[];
        };
        errorMessage?: string;
    };

    const characterTraitsList = [
        "Umgangsformen (Höflichkeit, Respekt)",
        "Teamfähigkeit",
        "Selbstbewusstsein",
        "Auftreten",
        "Motivation",
        "Selbstständigkeit / Eigeninitiative",
        "Engagement im Allgemeinen",
        "Kritikfähigkeit",
        "Zuverlässigkeit",
        "Organisation & Struktur",
        "Lernbereitschaft & Auffassungsgabe",
        "Belastbarkeit / Stressresistenz",
    ];
    // Use numeric codes for analysis: 1=Positiv, -1=Negativ; empty value (not stored)
    const characterTraitOptions = [
        { label: "Positiv", value: "1" },
        { label: "", value: "" },
        { label: "Negativ", value: "-1" },
    ];

    let evaluation = {
        generalInfo: {
            rebuddyName: data.rebuddyData?.rebuddyName || "",
            starterName: data.rebuddyData?.starterName || "",
            shifts: data.rebuddyData?.shifts as Shift[],
        },
        recrewBasics: {
            beingPrepared: 0,
            beingOnTime: 0,
            showAttitude: 0,
            controlBodyLanguage: 0,
            keepCalmInMind: 0,
            showEffort: 0,
            beCoachable: 0,
            doingExtra: 0,
            workEthic: 0,
            sendEnergy: 0,
        },
        communication: {
            starterResponse: 0,
            additionalComments: 0,
        },
        characterTraits: Object.fromEntries(
            characterTraitsList.map((trait) => [trait, ""]),
        ),
        additional: {
            crewFit: 0,
            additionalComments: "",
        },
    };

    function submit() {
        // normalize character traits: only include answered traits and cast to Number
        const normalizedTraits = Object.fromEntries(
            Object.entries(evaluation.characterTraits)
                .filter(([, val]) => val !== "")
                .map(([trait, val]) => [trait, Number(val)]),
        );
        const payload = { ...evaluation, characterTraits: normalizedTraits };
        console.log("Evaluation submitted:", payload);
    }

    // derived counts to limit number of Positiv/Negativ selections
    $: positiveCount = Object.values(evaluation.characterTraits).filter(
        (v) => v === "1",
    ).length;
    $: negativeCount = Object.values(evaluation.characterTraits).filter(
        (v) => v === "-1",
    ).length;
</script>

<div class="w-full banner"></div>

{#if data.errorMessage}
    <p class="text-center my-10 text-red-500">{data.errorMessage}</p>
{:else}
    <div class="md:w-4/5 px-2 lg:max-w-screen-lg mx-auto mb-24">
        <section>
            <div
                class="py-8 px-4 mx-auto max-w-screen-xl text-center lg:py-16 lg:px-12"
            >
                <h1
                    class="mb-4 text-3xl font-extrabold tracking-tight leading-none text-gray-700 md:text-4xl lg:text-5xl dark:text-white"
                >
                    Bewerte {data.rebuddyData?.starterName || "deinen ReBuddy"}!
                </h1>
            </div>
            <div class="rounded-lg shadow shadow-primary-400 py-3 px-4">
                <form on:submit|preventDefault={submit} class="mt-4">
                    <div class="grid gap-6 mb-6 md:grid-cols-2">
                        <h2
                            class="text-gray-800 text-xl font-bold md:col-span-2"
                        >
                            Allgemeine Infos
                        </h2>
                        <div
                            class="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6 p-4 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded mb-6"
                        >
                            <div>
                                <Label class="text-gray-500">ReBuddy (du)</Label
                                >
                                <div
                                    class="mt-1 text-gray-900 dark:text-gray-300 font-medium"
                                >
                                    {evaluation.generalInfo.rebuddyName}
                                </div>
                            </div>
                            <div>
                                <Label class="text-gray-500">Starter</Label>
                                <div
                                    class="mt-1 text-gray-900 dark:text-gray-300 font-medium"
                                >
                                    {evaluation.generalInfo.starterName}
                                </div>
                            </div>
                        </div>
                        <div class="md:col-span-2">
                            <Label>
                                Welche Schichten hattest du gemeinsam mit {evaluation
                                    .generalInfo.starterName}?
                            </Label>
                            <p class="text-xs text-gray-500 mb-2">
                                Wähle aus, welche Schichten ihr zusammen hattet.
                            </p>
                            <ShiftWizard
                                bind:shifts={evaluation.generalInfo.shifts}
                            />
                        </div>
                        <hr class="md:col-span-2 my-4" />
                        <div class="md:col-span-2">
                            <h2 class="text-gray-800 text-xl font-bold">
                                Bewertung der Umsetzung der recrew Basics
                            </h2>
                            <p class="text-sm text-gray-500 mb-4">
                                Bitte bewerte alles, was geht und gib eventuelle
                                Anmerkungen unten an.
                            </p>
                        </div>
                        <StarRating
                            label="'Being Prepared'"
                            bind:rating={evaluation.recrewBasics.beingPrepared}
                        />
                        <StarRating
                            label="'Being on time'"
                            bind:rating={evaluation.recrewBasics.beingOnTime}
                        />
                        <StarRating
                            label="'Show Attitude' (respektvoll und aufmerksam)"
                            bind:rating={evaluation.recrewBasics.showAttitude}
                        />
                        <StarRating
                            label="'Control Body language' (Aufrechte Haltung, positive Ausstrahlung, nicht den Clown spielen, selbstbewusst sein)"
                            bind:rating={
                                evaluation.recrewBasics.controlBodyLanguage
                            }
                        />
                        <StarRating
                            label="'Keep Calm in mind' (Ruhe bewahren)"
                            bind:rating={evaluation.recrewBasics.keepCalmInMind}
                        />
                        <StarRating
                            label="'Show Effort' (Eigeninitiative)"
                            bind:rating={evaluation.recrewBasics.showEffort}
                        />
                        <StarRating
                            label="'Be Coachable'"
                            bind:rating={evaluation.recrewBasics.beCoachable}
                        />
                        <StarRating
                            label="'Doing extra' (Mitdenken, Kollegen helfen)"
                            bind:rating={evaluation.recrewBasics.doingExtra}
                        />
                        <StarRating
                            label="'Work Ethic' (Selbstbewusst &
                                Verantwortungsbewusst arbeiten, Handy weg)"
                            bind:rating={evaluation.recrewBasics.workEthic}
                        />
                        <StarRating
                            label="'Send Energy' (Motivation, Aktiv auf Gäste
                                zugehen, Kommunikation mit der Crew)"
                            bind:rating={evaluation.recrewBasics.sendEnergy}
                        />
                        <hr class="md:col-span-2 my-4" />
                        <h2
                            class="md:col-span-2 text-gray-800 text-xl font-bold"
                        >
                            Kommunikation (WhatsApp, Email, etc.)
                        </h2>

                        <StarRating
                            label="Freundlichkeit"
                            bind:rating={
                                evaluation.communication.starterResponse
                            }
                        />

                        <StarRating
                            label="Zuverlässigkeit/ Schnelligkeit"
                            bind:rating={
                                evaluation.communication.additionalComments
                            }
                        />

                        <hr class="md:col-span-2 my-4" />

                        <div class="md:col-span-2">
                            <h2 class="text-gray-800 text-xl font-bold">
                                Charakter & Verhalten
                            </h2>
                            <p class="text-sm text-gray-500 mb-4">
                                Bitte wähle bis zu 3 positive und bis zu 3
                                negative Eigenschaften aus, die dir <span
                                    >besonders</span
                                > aufgefallen sind.
                            </p>

                            <div
                                class="grid grid-cols-[4fr_1fr_1fr_1fr] items-center font-semibold text-gray-600 bg-gray-50 mb-3"
                            >
                                <div></div>
                                <div class="text-center">
                                    Positiv ({positiveCount}/3)
                                </div>
                                <div class="text-center">Keine Angabe</div>
                                <div class="text-center">
                                    Negativ ({negativeCount}/3)
                                </div>
                            </div>

                            <div class="divide-y divide-gray-200">
                                {#each characterTraitsList as trait}
                                    <div
                                        class="grid grid-cols-[4fr_1fr_1fr_1fr] items-center py-3"
                                    >
                                        <div class="text-gray-700">{trait}</div>
                                        {#each characterTraitOptions as option}
                                            <div class="text-center">
                                                <Radio
                                                    bind:group={
                                                        evaluation
                                                            .characterTraits[
                                                            trait
                                                        ]
                                                    }
                                                    name={trait}
                                                    value={option.value}
                                                    id={"radio-" +
                                                        trait +
                                                        "-" +
                                                        option.value}
                                                    class="mx-auto"
                                                    disabled={(option.value ===
                                                        "1" &&
                                                        positiveCount >= 3 &&
                                                        evaluation
                                                            .characterTraits[
                                                            trait
                                                        ] !== "1") ||
                                                        (option.value ===
                                                            "-1" &&
                                                            negativeCount >=
                                                                3 &&
                                                            evaluation
                                                                .characterTraits[
                                                                trait
                                                            ] !== "-1")}
                                                />
                                            </div>
                                        {/each}
                                    </div>
                                {/each}
                            </div>
                        </div>

                        <hr class="md:col-span-2 my-4" />

                        <h2
                            class="text-gray-800 text-xl font-bold md:col-span-2"
                        >
                            Abschließende Bewertung
                        </h2>

                        <StarRating
                            label="Wie gut passt {evaluation.generalInfo
                                .starterName} in die Crew?"
                            bind:rating={evaluation.additional.crewFit}
                        />
                        <div class="md:col-span-2">
                            <Label class="mb-2"
                                >Weitere Bemerkungen / Freundesgruppe
                            </Label>
                            <Input
                                bind:value={
                                    evaluation.additional.additionalComments
                                }
                                type="text"
                            />
                        </div>
                    </div>

                    <div class="grid gap-3">
                        <Button type="submit">Submit</Button>
                    </div>
                </form>
            </div>
        </section>
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
