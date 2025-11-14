<script lang="ts">
    import Tesseract from "$lib/components/Tesseract.svelte";
    import { Label, Input, Helper, Alert } from "flowbite-svelte";
    import { fileNameGenerator } from "$lib/utils/fileNameGenerator";
    import { createEventDispatcher } from "svelte";
    import dayjs from "dayjs";
    import customParseFormat from "dayjs/plugin/customParseFormat";

    export let employee: any;
    export let kind: 'id' | 'license' | 'student-verification' | 'health-certificate';
    export let blocked: boolean = false;

    const dispatch = createEventDispatcher();
    dayjs.extend(customParseFormat);

    // Initialize
    $: if (!employee.images) employee.images = [];

    // Helper to ensure value is string
    function toString(value: any): string {
        if (value === null || value === undefined) return '';
        if (typeof value === 'string') return value;
        if (value instanceof Date) return dayjs(value).format('DD.MM.YYYY');
        return String(value);
    }

    // Document type configurations
    const configs = {
        'id': {
            options: [
                { name: 'Personalausweis Vorderseite', value: 'id-card' },
                { name: 'Reisepass Vorderseite', value: 'passport' }
            ],
            needsBack: true,
            needsNumber: true,
            placeholder: (tag: string) => tag === 'id-card' ? 'XY1234A12' : 'ABC456789',
            label: (tag: string) => tag === 'id-card' ? 'Personalausweis' : tag === 'passport' ? 'Reisepass' : 'Dokument'
        },
        'license': {
            options: [{ name: 'Führerschein Vorderseite', value: 'license' }],
            needsBack: true,
            needsNumber: true,
            placeholder: () => '',
            label: () => 'Führerschein'
        },
        'student-verification': {
            options: [{ name: 'Immatrikulationsbescheinigung', value: 'student-verification' }],
            needsBack: false,
            needsNumber: false
        },
        'health-certificate': {
            options: [{ name: 'Gesundheitszeugnis', value: 'health-certificate' }],
            needsBack: false,
            needsNumber: false,
            needsDate: true
        }
    };

    // Helper functions
    function getDocument(tag: string, side: 'front' | 'back' = 'front'): any {
        if (kind === 'id') {
            if (side === 'front') {
                // Vorderseite hat documentNumber (nicht null und nicht leer)
                return employee.images.find((img: any) =>
                    (img.imageTag === 'id-card' || img.imageTag === 'passport') &&
                    img.documentNumber !== null &&
                    img.documentNumber !== undefined &&
                    img.documentNumber !== ''
                );
            } else {
                // Rückseite hat KEIN documentNumber oder es ist null/undefined/leer
                const frontDoc = getDocument('', 'front');
                if (!frontDoc) return null;

                // Suche Rückseite mit dem gleichen imageTag wie die Vorderseite
                return employee.images.find((img: any) =>
                    img.imageTag === frontDoc.imageTag &&
                    (img.documentNumber === null || img.documentNumber === undefined || img.documentNumber === '')
                );
            }
        }

        // Für andere Dokumenttypen
        if (side === 'front') {
            return employee.images.find((img: any) =>
                img.imageTag === tag &&
                (configs[kind].needsNumber ? (img.documentNumber !== null && img.documentNumber !== undefined) : true)
            );
        } else {
            return employee.images.find((img: any) =>
                img.imageTag === tag &&
                (img.documentNumber === null || img.documentNumber === undefined)
            );
        }
    }

    function setDocument(tag: string, data: any, side: 'front' | 'back' = 'front') {
        // Bei ID-Dokumenten: Lösche alte Einträge wenn der Typ wechselt
        if (kind === 'id' && side === 'front') {
            const currentFront = getDocument('', 'front');
            if (currentFront && currentFront.imageTag !== tag) {
                // Typ wechselt - lösche ALLE alten ID-Einträge (beide Seiten)
                employee.images = employee.images.filter((img: any) =>
                    img.imageTag !== 'id-card' && img.imageTag !== 'passport'
                );
            }
        }

        const existing = getDocument(tag, side);

        if (existing) {
            Object.assign(existing, data);
        } else {
            employee.images.push({
                imageTag: tag,
                documentNumber: side === 'front' ? (data.documentNumber || '') : null,
                ...data
            });
        }

        employee.images = [...employee.images];
        employee = employee;
        dispatch('change', { employee });
    }

    function removeDocument(tag: string, side: 'front' | 'back' = 'front') {
        if (kind === 'id') {
            if (side === 'front') {
                // Lösche beide Seiten wenn Vorderseite gelöscht wird
                employee.images = employee.images.filter((img: any) =>
                    img.imageTag !== 'id-card' && img.imageTag !== 'passport'
                );
            } else {
                // Nur Rückseite löschen
                const backIndex = employee.images.findIndex((img: any) =>
                    (img.imageTag === 'id-card' || img.imageTag === 'passport') &&
                    (img.documentNumber === null || img.documentNumber === undefined || img.documentNumber === '')
                );
                if (backIndex > -1) {
                    employee.images.splice(backIndex, 1);
                }
            }
        } else {
            const index = employee.images.findIndex((img: any) =>
                img.imageTag === tag &&
                (side === 'front'
                    ? (img.documentNumber !== null && img.documentNumber !== undefined)
                    : (img.documentNumber === null || img.documentNumber === undefined))
            );
            if (index > -1) {
                employee.images.splice(index, 1);
            }
        }

        employee.images = [...employee.images];
        employee = employee;
        dispatch('change', { employee });
    }

    // Upload handler
    function handleUpload(detail: any, docType: string, side: 'front' | 'back' = 'front') {
        if (!detail.file) {
            removeDocument(docType, side);
            return;
        }

        const config = configs[kind];
        const sideName = side === 'back' ? 'Rückseite' : 'Vorderseite';

        setDocument(docType, {
            name: fileNameGenerator(detail.file, employee, docType, sideName),
            file: detail.file,
            ...(side === 'front' && config.needsNumber && { documentNumber: detail.text || 'nicht lesbar' }),
            ...(config.needsDate && { issueDate: detail.text || '' })
        }, side);
    }

    function handleClear(docType: string, side: 'front' | 'back' = 'front') {
        removeDocument(docType, side);
    }

    // Reactive documents
    $: front = employee.images && getDocument(
        kind === 'id' ? 'id-card' : configs[kind]?.options[0]?.value,
        'front'
    );

    $: back = employee.images && front && getDocument(
        front.imageTag || configs[kind]?.options[0]?.value,
        'back'
    );

    // activeTag sollte den tatsächlichen Tag vom front-Dokument verwenden
    $: activeTag = front?.imageTag || configs[kind]?.options[0]?.value;

    // Validation - mit toString für sichere String-Operationen
    $: blocked = (() => {
        const config = configs[kind];
        if (!config) return false;

        const hasFront = !!front?.file || !!front?.location;
        const hasBack = config.needsBack ? (!!back?.file || !!back?.location) : true;
        const hasNumber = config.needsNumber ? !!toString(front?.documentNumber).trim() : true;
        const hasDate = config.needsDate ? !!toString(front?.issueDate).trim() : true;

        return !(hasFront && hasBack && hasNumber && hasDate);
    })();

    // Update functions
    function updateDocumentNumber(value: string) {
        if (front) {
            front.documentNumber = value;
            employee.images = [...employee.images];
            dispatch('change', { employee });
        }
    }

    function updateIssueDate(value: string) {
        if (front) {
            front.issueDate = value;
            employee.images = [...employee.images];
            dispatch('change', { employee });
        }
    }

    // Health certificate date validation - mit toString
    $: dateError = (() => {
        if (kind !== 'health-certificate' || !front?.issueDate) return false;
        const dateString = toString(front.issueDate);
        if (!dateString) return false;

        const date = dayjs(dateString, 'DD.MM.YYYY', true);
        return date.isValid() && date.isBefore(dayjs().subtract(3, 'month'));
    })();

    // Helper für Back-Label
    function getBackLabel(): string {
        if (!activeTag) return 'Dokument Rückseite';

        if (kind === 'id') {
            return activeTag === 'id-card' ? 'Personalausweis Rückseite' : 'Reisepass Rückseite';
        }

        return configs[kind]?.label() + ' Rückseite';
    }
</script>

<div class="grid md:grid-cols-2 gap-3 mt-2">
    <!-- Front side upload -->
    <div>
        <Tesseract
                value={front}
                options={configs[kind].options}
                on:ocr={(ev) => handleUpload(ev.detail, ev.detail.type || activeTag, 'front')}
                on:clear={(ev) => handleClear(ev.detail?.type || activeTag, 'front')}
                noRead={kind === 'student-verification'}
        />
    </div>

    <!-- Back side upload -->
    {#if configs[kind].needsBack && (front?.file || front?.location)}
        <div>
            <Tesseract
                    value={back}
                    options={[{
          name: getBackLabel(),
          value: activeTag
        }]}
                    noRead={true}
                    on:ocr={(ev) => handleUpload(ev.detail, activeTag, 'back')}
                    on:clear={() => handleClear(activeTag, 'back')}
            />
        </div>
    {/if}

    <!-- Document number input -->
    {#if configs[kind].needsNumber && (front?.file || front?.location)}
        <div>
            <Label for="docNumber" class="mb-2">
                {configs[kind].label(activeTag)}nummer *
            </Label>
            <Input
                    id="docNumber"
                    placeholder={configs[kind].placeholder?.(activeTag)}
                    value={toString(front.documentNumber)}
                    on:input={(e) => updateDocumentNumber(e.target.value)}
                    required
            />
            <Helper class="mt-2" color="green">Bitte maschinell gescanntes Ergebnis überprüfen!</Helper>
        </div>
    {/if}

    <!-- Issue date input -->
    {#if configs[kind].needsDate && (front?.file || front?.location)}
        <div>
            <Label for="issueDate" class="mb-2">Ausstellungsdatum</Label>
            <Input
                    id="issueDate"
                    placeholder="DD.MM.YYYY"
                    value={toString(front.issueDate)}
                    on:input={(e) => updateIssueDate(e.target.value)}
            />
            <Helper class="mt-2" color="green">Bitte maschinell gescanntes Ergebnis überprüfen!</Helper>
        </div>
    {/if}
</div>

<!-- Date warning -->
{#if dateError}
    <Alert color="red" class="mt-3">
        <p class="text-sm">
            Das Ausstellungsdatum des Gesundheitszeugnisses darf maximal 3 Monate zurück liegen.
        </p>
    </Alert>
{/if}