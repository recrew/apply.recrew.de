<script lang="ts">
    // states
    // -1: Completed
    // 0: Current
    // 1: Upcoming
    export let steps = [
        {
            label: "One",
            route: "/",
            state: 0,
        },
    ];

    export let allowForward = false;
    export let classList = "";
</script>

<nav aria-label="Progress" class={classList}>
    <ol
        role="list"
        class="divide-y divide-gray-300 rounded-md border border-gray-300 md:flex md:divide-y-0"
    >
        <li class="relative md:flex md:flex-1">
            {#if steps[0].state === -1}
                <!-- Completed Step -->
                <a href={steps[0].route} class="group flex w-full items-center">
                    <span
                        class="flex items-center px-6 py-4 text-sm font-medium"
                    >
                        <span
                            class="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-primary-600 group-hover:bg-primary-800"
                        >
                            <svg
                                class="h-6 w-6 text-white"
                                viewBox="0 0 24 24"
                                fill="currentColor"
                                aria-hidden="true"
                            >
                                <path
                                    fill-rule="evenodd"
                                    d="M19.916 4.626a.75.75 0 01.208 1.04l-9 13.5a.75.75 0 01-1.154.114l-6-6a.75.75 0 011.06-1.06l5.353 5.353 8.493-12.739a.75.75 0 011.04-.208z"
                                    clip-rule="evenodd"
                                />
                            </svg>
                        </span>
                        <span class="ml-4 text-sm font-medium text-gray-900"
                            >{steps[0].label}</span
                        >
                    </span>
                </a>
            {:else}
                <a
                    href={steps[0].route}
                    class="flex items-center px-6 py-4 text-sm font-medium"
                    aria-current="step"
                >
                    <span
                        class="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border-2 border-primary-600"
                    >
                        <span class="text-primary-600">1</span>
                    </span>
                    <span class="ml-4 text-sm font-medium text-primary-600"
                        >{steps[0].label}</span
                    >
                </a>
            {/if}
            <!-- Arrow separator for lg screens and up -->
            <div
                class="absolute right-0 top-0 hidden h-full w-5 md:block"
                aria-hidden="true"
            >
                <svg
                    class="h-full w-full text-gray-300"
                    viewBox="0 0 22 80"
                    fill="none"
                    preserveAspectRatio="none"
                >
                    <path
                        d="M0 -2L20 40L0 82"
                        vector-effect="non-scaling-stroke"
                        stroke="currentcolor"
                        stroke-linejoin="round"
                    />
                </svg>
            </div>
        </li>
        {#each steps as step, index}
            {#if index > 0}
                <li class="relative md:flex md:flex-1">
                    {#if step.state === -1}
                        <!-- Completed Step -->
                        <a
                            href={step.route}
                            class="group flex w-full items-center"
                        >
                            <span
                                class="flex items-center px-6 py-4 text-sm font-medium"
                            >
                                <span
                                    class="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-primary-600 group-hover:bg-primary-800"
                                >
                                    <svg
                                        class="h-6 w-6 text-white"
                                        viewBox="0 0 24 24"
                                        fill="currentColor"
                                        aria-hidden="true"
                                    >
                                        <path
                                            fill-rule="evenodd"
                                            d="M19.916 4.626a.75.75 0 01.208 1.04l-9 13.5a.75.75 0 01-1.154.114l-6-6a.75.75 0 011.06-1.06l5.353 5.353 8.493-12.739a.75.75 0 011.04-.208z"
                                            clip-rule="evenodd"
                                        />
                                    </svg>
                                </span>
                                <span
                                    class="ml-4 text-sm font-medium text-gray-900"
                                    >{step.label}</span
                                >
                            </span>
                        </a>
                    {:else if step.state === 0}
                        <!-- Current Step -->
                        <a
                            href={step.route}
                            class="flex items-center px-6 py-4 text-sm font-medium"
                            aria-current="step"
                        >
                            <span
                                class="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border-2 border-primary-600"
                            >
                                <span class="text-primary-600">{index + 1}</span
                                >
                            </span>
                            <span
                                class="ml-4 text-sm font-medium text-primary-600"
                                >{step.label}</span
                            >
                        </a>
                    {:else}
                        <a
                            href={allowForward ? step.route : "#"}
                            class="group flex items-center"
                        >
                            <span
                                class="flex items-center px-6 py-4 text-sm font-medium"
                            >
                                <span
                                    class="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border-2 border-gray-300 group-hover:border-gray-400"
                                >
                                    <span
                                        class="text-gray-500 group-hover:text-gray-900"
                                        >{index + 1}</span
                                    >
                                </span>
                                <span
                                    class="ml-4 text-sm font-medium text-gray-500 group-hover:text-gray-900"
                                    >{step.label}</span
                                >
                            </span>
                        </a>
                    {/if}

                    {#if index < steps.length - 1}
                        <!-- Arrow separator for lg screens and up -->
                        <div
                            class="absolute right-0 top-0 hidden h-full w-5 md:block"
                            aria-hidden="true"
                        >
                            <svg
                                class="h-full w-full text-gray-300"
                                viewBox="0 0 22 80"
                                fill="none"
                                preserveAspectRatio="none"
                            >
                                <path
                                    d="M0 -2L20 40L0 82"
                                    vector-effect="non-scaling-stroke"
                                    stroke="currentcolor"
                                    stroke-linejoin="round"
                                />
                            </svg>
                        </div>
                    {/if}
                </li>
            {/if}
        {/each}
    </ol>
</nav>
