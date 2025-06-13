<script lang="ts">
    import { Label, Input, Button, Radio, Alert, StepIndicator } from "flowbite-svelte";
    import { InfoCircleSolid } from "flowbite-svelte-icons";
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
    // Use numeric codes for analysis: 1=Positiv, -1=Negativ; empty = Keine Angabe (not stored)
    const characterTraitOptions = [
        { label: "Positiv", value: "1" },
        { label: "Keine Angabe", value: "" },
        { label: "Negativ", value: "-1" },
    ];

    // List of recrew basics fields to DRY up the StarRating section
    const recrewBasicsList = [
        { key: "beingPrepared", label: "'Being Prepared'" },
        { key: "beingOnTime", label: "'Being on time'" },
        {
            key: "showAttitude",
            label: "'Show Attitude' (respektvoll und aufmerksam)",
        },
        {
            key: "controlBodyLanguage",
            label: "'Control Body language' (Aufrechte Haltung, positive Ausstrahlung, nicht den Clown spielen, selbstbewusst sein)",
        },
        { key: "keepCalmInMind", label: "'Keep Calm in mind' (Ruhe bewahren)" },
        { key: "showEffort", label: "'Show Effort' (Eigeninitiative)" },
        { key: "beCoachable", label: "'Be Coachable'" },
        {
            key: "doingExtra",
            label: "'Doing extra' (Mitdenken, Kollegen helfen)",
        },
        {
            key: "workEthic",
            label: "'Work Ethic' (Selbstbewusst & Verantwortungsbewusst arbeiten, Handy weg)",
        },
        {
            key: "sendEnergy",
            label: "'Send Energy' (Motivation, Aktiv auf Gäste zugehen, Kommunikation mit der Crew)",
        },
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
    <div class="w-full banner"></div>
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
                        {#each recrewBasicsList as { key, label }}
                            <StarRating
                                {label}
                                bind:rating={evaluation.recrewBasics[key]}
                            />
                        {/each}
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
                                Welche Eigenschaften sind dir besonders
                                aufgefallen? Wähle bis zu 3 positive und bis zu
                                3 negative.
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
                        <Button type="submit">Abschicken</Button>
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
