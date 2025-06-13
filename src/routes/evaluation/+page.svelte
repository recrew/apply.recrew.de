<script lang="ts">
    import { page } from "$app/stores";
    import { Heading, Label, Input, Button, Star } from "flowbite-svelte";
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

    let evaluation = {
        generalInfo: {
            rebuddyName: "",
            starterName: "",
            shifts: [] as Shift[],
            totalShifts: 0, //computed
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
            additional: "",
        },
        whatsApp: {
            starterResponse: "",
            additionalComments: "",
        },
        additional: {
            friendGroup: "",
            observations: "",
            character: "",
            customerFit: "",
            crewFit: 0, // Star rating
            additionalObservations: "",
        },
    };

    $: evaluation.generalInfo.totalShifts =
        evaluation.generalInfo.shifts.length;

    function submit() {
        console.log("Evaluation submitted:", evaluation);
    }
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
                        <div>
                            <Label for="rebuddyName" class="mb-2"
                                >Dein Name</Label
                            >
                            <Input
                                bind:value={evaluation.generalInfo.rebuddyName}
                                type="text"
                                id="rebuddyName"
                                required
                            />
                        </div>
                        <div>
                            <Label for="starterName" class="mb-2"
                                >Name deines Starters</Label
                            >
                            <Input
                                bind:value={evaluation.generalInfo.starterName}
                                type="text"
                                id="starterName"
                                required
                            />
                        </div>
                        <div class="md:col-span-2">
                            <Label class=""
                                >Welche Schichten hatte dein Starter?</Label
                            >
                            <p class="text-xs mb-2 text-gray-700">
                                Wähle anschließend aus welche Schichten ihr
                                zusammen hattet.
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
                        <div>
                            <Label for="recrewBasicsAdditional" class="mb-2"
                                >Anmwerkungen zu der Bewertung</Label
                            >
                            <Input
                                bind:value={evaluation.recrewBasics.additional}
                                type="text"
                                id="recrewBasicsAdditional"
                                required
                            />
                        </div>
                        <hr class="md:col-span-2 my-4" />
                        <h2
                            class="md:col-span-2 text-gray-800 text-xl font-bold"
                        >
                            {evaluation.generalInfo.starterName ||
                                "Dein Starter"} auf WhatsApp
                        </h2>

                        <div>
                            <Label
                                >Wie hat dein Starter auf deine Nachrichten auf
                                WhatsApp reagiert?</Label
                            >
                            <p class="text-xs mb-2 text-gray-700">
                                (Hat dein Starter reagiert? Was war sein
                                Feedback auf Schichten?)
                            </p>
                            <Input
                                bind:value={evaluation.whatsApp.starterResponse}
                                type="text"
                                required
                            />
                        </div>

                        <div>
                            <Label class="mb-2"
                                >Hat sich dein Starter von sich aus bei dir
                                gemeldet? Wenn ja, gibt es irgendetwas das wir
                                wissen müssten?
                            </Label>
                            <Input
                                bind:value={
                                    evaluation.whatsApp.additionalComments
                                }
                                type="text"
                                required
                            />
                        </div>

                        <hr class="md:col-span-2 my-4" />

                        <h2
                            class="text-gray-800 text-xl font-bold md:col-span-2"
                        >
                            Abschließende Infos
                        </h2>
                        <div>
                            <Label class="mb-2"
                                >Freundesgruppe deines Starter</Label
                            >
                            <Input
                                bind:value={evaluation.additional.friendGroup}
                                type="text"
                            />
                        </div>
                        <div>
                            <Label class="mb-2"
                                >Gab es irgendwelche positiven / negativen
                                Auffälligkeiten?
                            </Label>
                            <Input
                                bind:value={evaluation.additional.observations}
                                type="text"
                            />
                        </div>
                        <div>
                            <Label class="mb-2"
                                >Wie würdest du den Charakter/ das Verhalten
                                deines Starters beschreiben?
                            </Label>
                            <Input
                                bind:value={evaluation.additional.character}
                                type="text"
                            />
                        </div>
                        <div>
                            <Label class="mb-2"
                                >Passt dein Starter zu einem Kunden besonders
                                gut / gar nicht? Wenn ja, warum?
                            </Label>
                            <Input
                                bind:value={evaluation.additional.customerFit}
                                type="text"
                            />
                        </div>
                        <StarRating
                            label="Wie gut passt dein Starter in die Crew?"
                            bind:rating={evaluation.additional.crewFit}
                        />
                        <div class="md:col-span-2">
                            <Label class="mb-2"
                                >Abschließende Bemerkungen zum Starter
                            </Label>
                            <Input
                                bind:value={
                                    evaluation.additional.additionalObservations
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
