<script lang="ts">
    import Tesseract from "$lib/components/Tesseract.svelte";
    import { Label, Input, Helper, Alert } from "flowbite-svelte";
    import { fileNameGenerator } from "$lib/utils/fileNameGenerator";
    import { createEventDispatcher } from "svelte";
    import dayjs from "dayjs";
    import customParseFormat from "dayjs/plugin/customParseFormat";
    import type LenkradDate from "$lib/_types/LenkradDate";
    import {InfoCircleSolid} from "flowbite-svelte-icons";

    dayjs.extend(customParseFormat);

    type Kind = "id" | "license" | "student-verification" | "health-certificate";
    type Side = "front" | "back";

    interface EmployeeImage {
        imageTag: string;
        documentNumber?: string | null;
        issueDate?: string | LenkradDate | Date | null;
        name?: string;
        file?: File;
        location?: string;
        [key: string]: unknown;
    }

    interface Employee {
        images?: EmployeeImage[];
        [key: string]: unknown;
    }

    export let employee: Employee;
    export let kind: Kind;
    export let blocked: boolean = false;

    const dispatch = createEventDispatcher<{ change: { employee: Employee } }>();

    // --- small helpers --------------------------------------------------------

    const ensureImagesArray = () => {
        if (!employee.images) employee.images = [];
    };

    function notifyChange() {
        // trigger Svelte reactivity + inform parent
        employee.images = [...(employee.images ?? [])];
        dispatch("change", { employee });
    }

    function isLenkradDate(value: unknown): value is LenkradDate {
        return (
            typeof value === "object" &&
            value !== null &&
            "value" in value &&
            typeof (value as any).value === "string"
        );
    }

    function normalizeToString(value: unknown): string {
        if (value == null) return "";
        if (typeof value === "string") return value;

        if (isLenkradDate(value)) {
            const d = dayjs(value.value);
            return d.isValid() ? d.format("DD.MM.YYYY") : value.value;
        }

        if (value instanceof Date) {
            return dayjs(value).format("DD.MM.YYYY");
        }

        return String(value);
    }

    const hasDocumentNumber = (value: unknown) =>
        normalizeToString(value).trim() !== "";

    const noDocumentNumber = (value: unknown) => !hasDocumentNumber(value);

    const hasFileOrLocation = (doc?: EmployeeImage | null) =>
        !!(doc?.file || doc?.location);

    const parseStrictDate = (value: unknown) =>
        dayjs(normalizeToString(value), "DD.MM.YYYY", true);

    const isOlderThanMonths = (value: unknown, months: number) => {
        const date = parseStrictDate(value);
        return date.isValid() && date.isBefore(dayjs().subtract(months, "month"));
    };

    // --- config ---------------------------------------------------------------

    const configs: any = {
        id: {
            options: [
                { name: "Personalausweis Vorderseite", value: "id-card" },
                { name: "Reisepass Vorderseite", value: "passport" }
            ],
            needsBack: true,
            needsNumber: true,
            placeholder: (tag?: string) =>
                tag === "id-card" ? "XY1234A12" : "ABC456789",
            label: (tag?: string) =>
                tag === "id-card"
                    ? "Personalausweis"
                    : tag === "passport"
                        ? "Reisepass"
                        : "Dokument"
        },
        license: {
            options: [{ name: "Führerschein Vorderseite", value: "license" }],
            needsBack: true,
            needsNumber: true,
            placeholder: () => "",
            label: () => "Führerschein"
        },
        "student-verification": {
            options: [{ name: "Immatrikulationsbescheinigung", value: "student-verification" }],
            needsBack: false,
            needsNumber: false
        },
        "health-certificate": {
            options: [{ name: "Gesundheitszeugnis", value: "health-certificate" }],
            needsBack: false,
            needsNumber: false,
            needsDate: true
        }
    };

    // --- document helpers -----------------------------------------------------

    function getIdFront(): EmployeeImage | undefined {
        const tags = ["id-card", "passport"];
        return employee.images?.find(
            (img) => tags.includes(img.imageTag) && hasDocumentNumber(img.documentNumber)
        );
    }

    function getIdBack(): EmployeeImage | undefined {
        const tags = ["id-card", "passport"];
        const front = getIdFront();
        if (!front) return undefined;

        return employee.images?.find(
            (img) =>
                tags.includes(img.imageTag) &&
                img.imageTag === front.imageTag &&
                noDocumentNumber(img.documentNumber)
        );
    }

    function getDocument(tag: string, side: Side = "front"): EmployeeImage | undefined {
        ensureImagesArray();

        // special rules for ID-documents
        if (kind === "id") {
            return side === "front" ? getIdFront() : getIdBack();
        }

        if (!employee.images) return undefined;

        const config = configs[kind];

        if (side === "front") {
            return employee.images.find(
                (img) =>
                    img.imageTag === tag &&
                    (!config.needsNumber || hasDocumentNumber(img.documentNumber))
            );
        }

        // side === 'back'
        return employee.images.find(
            (img) => img.imageTag === tag && noDocumentNumber(img.documentNumber)
        );
    }

    function setDocument(tag: string, data: Partial<EmployeeImage>, side: Side = "front") {
        ensureImagesArray();

        // For ID: if front type changes, remove all old ID images
        if (kind === "id" && side === "front") {
            const currentFront = getIdFront();
            if (currentFront && currentFront.imageTag !== tag && employee.images) {
                employee.images = employee.images.filter(
                    (img) => img.imageTag !== "id-card" && img.imageTag !== "passport"
                );
            }
        }

        const existing = getDocument(tag, side);

        if (existing) {
            Object.assign(existing, data);
        } else {
            employee.images!.push({
                imageTag: tag,
                documentNumber: side === "front" ? (data.documentNumber ?? "") : null,
                ...data
            });
        }

        notifyChange();
    }

    function removeDocument(tag: string, side: Side = "front") {
        ensureImagesArray();
        if (!employee.images) return;

        if (kind === "id") {
            const isIdTag = (img: EmployeeImage) =>
                img.imageTag === "id-card" || img.imageTag === "passport";

            if (side === "front") {
                // remove both sides for ID
                employee.images = employee.images.filter((img) => !isIdTag(img));
            } else {
                // remove only back side
                const backIndex = employee.images.findIndex(
                    (img) => isIdTag(img) && noDocumentNumber(img.documentNumber)
                );
                if (backIndex > -1) employee.images.splice(backIndex, 1);
            }
        } else {
            const index = employee.images.findIndex(
                (img) =>
                    img.imageTag === tag &&
                    (side === "front"
                        ? hasDocumentNumber(img.documentNumber)
                        : noDocumentNumber(img.documentNumber))
            );
            if (index > -1) employee.images.splice(index, 1);
        }

        notifyChange();
    }

    // --- event handlers -------------------------------------------------------

    function handleUpload(detail: any, docType: string, side: Side = "front") {
        if (!detail.file) {
            removeDocument(docType, side);
            return;
        }

        const config = configs[kind];
        const sideName = side === "back" ? "Rückseite" : "Vorderseite";

        setDocument(
            docType,
            {
                name: fileNameGenerator(detail.file, employee, docType, sideName),
                file: detail.file,
                ...(side === "front" &&
                    config.needsNumber && {
                        documentNumber: detail.text || "nicht lesbar"
                    }),
                ...(config.needsDate && {
                    issueDate: detail.text || ""
                })
            },
            side
        );
    }

    function handleClear(docType: string, side: Side = "front") {
        updateDocumentNumber("");
        updateIssueDate("");
        removeDocument(docType, side);
    }

    function updateFrontField<K extends keyof EmployeeImage>(field: K, value: EmployeeImage[K]) {
        if (!front) return;
        front[field] = value;
        notifyChange();
    }

    function updateDocumentNumber(value: string) {
        updateFrontField("documentNumber", value);
    }

    function updateIssueDate(value: string) {
        updateFrontField("issueDate", value);
    }

    function getBackLabel(): string {
        if (!activeTag) return "Dokument Rückseite";

        if (kind === "id") {
            return activeTag === "id-card"
                ? "Personalausweis Rückseite"
                : "Reisepass Rückseite";
        }

        const labelFn = configs[kind]?.label;
        return (labelFn ? labelFn(activeTag) : "Dokument") + " Rückseite";
    }

    // --- reactive derived state ----------------------------------------------

    // ensure images always exists
    $: ensureImagesArray();

    $: config = configs[kind];

    $: front =
        employee.images &&
        getDocument(kind === "id" ? "id-card" : config.options[0]?.value, "front");

    $: back =
        employee.images &&
        front &&
        getDocument(front.imageTag || config.options[0]?.value, "back");

    $: activeTag = front?.imageTag || config.options[0]?.value;

    // health certificate date warning (older than 3 months)
    $: dateError =
        kind === "health-certificate" &&
        hasFileOrLocation(front) &&
        !!normalizeToString(front?.issueDate) &&
        isOlderThanMonths(front?.issueDate, 3);

    // validation / blocked
    $: {
        const hasFront = hasFileOrLocation(front);

        if (!config) {
            blocked = false;
        } else if (kind === "health-certificate") {
            // optional: only block if uploaded and date invalid/missing/too old
            if (!hasFront) {
                blocked = false;
            } else {
                const dateStr = normalizeToString(front?.issueDate).trim();
                const hasDate = !!dateStr;
                const validFormat = hasDate && parseStrictDate(dateStr).isValid();

                blocked = !hasDate || !validFormat || !!dateError;
            }
        } else {
            const hasBack =
                config.needsBack ? hasFileOrLocation(back) : true;
            const hasNumber =
                config.needsNumber ? hasDocumentNumber(front?.documentNumber) : true;
            const hasDate =
                config.needsDate ? !!normalizeToString(front?.issueDate).trim() : true;

            blocked = !(hasFront && hasBack && hasNumber && hasDate);
        }
    }
</script>

<div class="grid md:grid-cols-2 gap-3 mt-2">
    <!-- Front side upload -->
    <div>
        <Tesseract
                value={front}
                options={config.options}
                on:ocr={(ev) =>
        handleUpload(ev.detail, ev.detail.type || activeTag, "front")}
                on:clear={(ev) => handleClear(ev.detail?.type || activeTag, "front")}
                noRead={kind === "student-verification"}
        />
    </div>

    <!-- Back side upload -->
    {#if config.needsBack && hasFileOrLocation(front)}
        <div>
            <Tesseract
                    value={back}
                    options={[
          {
            name: getBackLabel(),
            value: activeTag
          }
        ]}
                    noRead={true}
                    on:ocr={(ev) => handleUpload(ev.detail, activeTag, "back")}
                    on:clear={() => handleClear(activeTag, "back")}
            />
        </div>
    {/if}

    <!-- Document number input -->
    {#if config.needsNumber && hasFileOrLocation(front)}
        <div>
            <Label for="docNumber" class="mb-2">
                {configs[kind].label?.(activeTag) ?? "Dokument"}nummer *
            </Label>
            <Input
                    id="docNumber"
                    placeholder={config.placeholder?.(activeTag)}
                    value={normalizeToString(front?.documentNumber)}
                    on:input={(e) => updateDocumentNumber(e.target.value)}
                    required
            />
            <Helper class="mt-2" color="green">
                Bitte maschinell gescanntes Ergebnis überprüfen!
            </Helper>
        </div>
    {/if}

    <!-- Issue date input -->
    {#if config.needsDate && hasFileOrLocation(front)}
        <div>
            <Label for="issueDate" class="mb-2">Ausstellungsdatum</Label>
            <Input
                    id="issueDate"
                    placeholder="DD.MM.YYYY"
                    value={normalizeToString(front?.issueDate)}
                    on:input={(e) => updateIssueDate(e.target.value)}
            />
            <Helper class="mt-2" color="green">
                Bitte maschinell gescanntes Ergebnis überprüfen!
            </Helper>
        </div>
    {/if}
</div>

<!-- Date warning -->
{#if dateError}
    <Alert color="red" class="mt-3">
        <p class="text-sm">
            Das Ausstellungsdatum des Gesundheitszeugnisses darf maximal 3 Monate zurück
            liegen.
        </p>
    </Alert>
{/if}

<!-- Health Certificate note -->
{#if kind === "health-certificate" && !hasFileOrLocation(front)}
    <Alert border color="yellow" class="mt-3">
        <InfoCircleSolid slot="icon" class="w-5 h-5" />
        <p class="text-sm">
            Du kannst das Gesundheitszeugnis nachreichen, musst es jedoch <strong>spätestens</strong> zum Get-to-Know-Treffen vorlegen.<br>
            Das Gesundheitszeugnis lässt sich schnell und unkompliziert online beantragen.<br>
            <a
                    href="https://www.google.com/search?q=gesundheitszeugnis+online"
                    class="text-primary-800 hover:text-primary-900 underline"
                    target="_blank"
                    rel="noopener noreferrer">
                Eine passende Stelle findest du hier!
            </a>
        </p>
    </Alert>
{/if}