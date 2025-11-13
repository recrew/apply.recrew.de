<script lang="ts">
  import Tesseract from "$lib/components/Tesseract.svelte";
  import { Label, Input, Helper, Alert } from "flowbite-svelte";
  import { fileNameGenerator } from "$lib/utils/fileNameGenerator";
  import { createEventDispatcher } from "svelte";
  import dayjs from "dayjs";
  import customParseFormat from "dayjs/plugin/customParseFormat";

  export let employee: any;
  export let kind: 'id' | 'license' | 'student-verification' | 'health-certificate';
  export let blocked: boolean = false; // bindable completeness flag for parent

  const dispatch = createEventDispatcher();

  // Constants and small helpers
  const idOptions = [
    { name: 'Personalausweis Vorderseite', value: 'id-card' },
    { name: 'Reisepass Vorderseite', value: 'passport' }
  ];
  const isIdTag = (t: string) => t === 'id-card' || t === 'passport';

  // Ensure images array exists
  $: if (!employee.images) employee.images = [];

  // Reactive indexes for cleaner template logic
  $: idFrontIndex = employee.images.findIndex((n) => isIdTag(n.imageTag) && !!n.documentNumber);
  $: idBackIndex = employee.images.findIndex((n) => isIdTag(n.imageTag) && !n.documentNumber);
  $: licenseIndex = employee.images.findIndex((n) => n.imageTag === 'license' && !!n.documentNumber);
  $: healthCertificateIndex = employee.images.findIndex((i) => i.imageTag === 'health-certificate');

  // Derived completeness for ID documents
  $: idFrontComplete = idFrontIndex > -1 && !!(employee.images[idFrontIndex]?.file || employee.images[idFrontIndex]?.location);
  $: idBackComplete = idBackIndex > -1 && !!(employee.images[idBackIndex]?.file || employee.images[idBackIndex]?.location);
  $: if (kind === 'id') blocked = !(idFrontComplete && idBackComplete);

  // License completeness
  $: licenseFrontComplete = licenseIndex > -1 && !!(employee.images[licenseIndex]?.file || employee.images[licenseIndex]?.location);
  $: licenseBackComplete = !!employee.images.find((n) => n.imageTag === 'license' && !n.documentNumber && (n.file || n.location));
  $: if (kind === 'license') blocked = !(licenseFrontComplete && licenseBackComplete);

  // Student verification completeness
  $: studentIndex = employee.images.findIndex((n) => n.imageTag === 'student-verification');
  $: studentComplete = studentIndex > -1 && !!(employee.images[studentIndex]?.file || employee.images[studentIndex]?.location);
  $: if (kind === 'student-verification') blocked = !studentComplete;

  // ID logic
  function ensureIdSlot(tag: string, isBack: boolean): number {
    if (isBack) {
      let idx = idBackIndex;
      if (idx === -1) {
        employee.images = [...employee.images, { documentNumber: null, imageTag: tag, file: null }];
        idx = employee.images.length - 1;
      }
      return idx;
    } else {
      let idx = idFrontIndex;
      if (idx === -1) {
        employee.images = [...employee.images, { documentNumber: '', imageTag: tag, file: null }];
        idx = employee.images.length - 1;
      }
      return idx;
    }
  }

  function onIdOcr(detail: { text: string; file: File; type: string }, isBack: boolean) {
    const preExistingIdCount = employee.images.filter((n) => isIdTag(n.imageTag)).length;
    const idx = ensureIdSlot(detail.type, isBack);
    const side = isBack ? 'Rückseite' : 'Vorderseite';
    employee.images[idx].name = fileNameGenerator(detail.file, employee, detail.type, side);
    employee.images[idx].file = detail.file;
    employee.images[idx].imageTag = detail.type;

    if (!isBack) {
      const unreadable = preExistingIdCount < 1 && detail.text.length < 1;
      employee.images[idx].documentNumber = unreadable ? 'nicht lesbar' : detail.text;
    }
    employee.images = [...employee.images];
    dispatch('change', { employee });
  }

  // License logic
  function ensureLicenseFront(): number {
    let idx = licenseIndex;
    if (idx < 0) {
      employee.images = [...employee.images, { documentNumber: '', imageTag: 'license', file: null }];
      idx = employee.images.length - 1;
    }
    return idx;
  }

  function onLicenseFront(ev: CustomEvent) {
    const idx = ensureLicenseFront();
    employee.images[idx].name = fileNameGenerator(ev.detail.file, employee, 'license', 'Vorderseite');
    employee.images[idx].file = ev.detail.file;
    employee.images[idx].documentNumber = ev.detail.text;
    employee.images = [...employee.images];
    dispatch('change', { employee });
  }

  function onLicenseBack(ev: CustomEvent) {
    const preExisting = employee.images.filter((n) => n.imageTag === 'license').length > 1;
    const name = fileNameGenerator(ev.detail.file, employee, 'license', 'Rückseite');
    if (!preExisting) {
      employee.images = [...employee.images, { documentNumber: null, imageTag: 'license', file: null, name }];
    }
    const index = employee.images.findIndex((n) => n.imageTag === 'license' && n.documentNumber === null);
    employee.images[index].name = name;
    employee.images[index].file = ev.detail.file;
    employee.images = [...employee.images];
    dispatch('change', { employee });
  }

  // Student verification
  function onStudentVerification(ev: CustomEvent) {
    const preExisting = employee.images.findIndex((n) => n.imageTag === 'student-verification');
    const name = fileNameGenerator(ev.detail.file, employee, 'student-verification');
    if (preExisting < 0) {
      employee.images = [...employee.images, { documentNumber: null, imageTag: 'student-verification', file: ev.detail.file, name }];
    } else {
      employee.images[preExisting].name = name;
      employee.images[preExisting].file = ev.detail.file;
    }
    employee.images = [...employee.images];
    dispatch('change', { employee });
  }

  // Health certificate
  let healthCertificateError = false;
  dayjs.extend(customParseFormat);

  function ensureHealthCert(): number {
    let idx = healthCertificateIndex;
    if (idx === -1) {
      employee.images = [...employee.images, { imageTag: 'health-certificate', file: null, issueDate: '' }];
      idx = employee.images.length - 1;
    }
    return idx;
  }

  function onHealthCert(ev: CustomEvent) {
    const idx = ensureHealthCert();
    employee.images[idx].name = fileNameGenerator(ev.detail.file, employee, 'health-certificate');
    employee.images[idx].file = ev.detail.file;
    employee.images[idx].issueDate = ev.detail.text;
    employee.images = [...employee.images];
    recomputeHealthCertState();
    dispatch('change', { employee });
  }

  function recomputeHealthCertState() {
    if (healthCertificateIndex >= 0 && employee.images[healthCertificateIndex]?.issueDate) {
      const dateString = employee.images[healthCertificateIndex].issueDate;
      const issueDate = dayjs(dateString, 'DD.MM.YYYY', true);
      const threeMonthsAgo = dayjs().subtract(3, 'month');
      healthCertificateError = !!(dateString.length === 10 && issueDate.isValid() && issueDate.isBefore(threeMonthsAgo));
    } else {
      healthCertificateError = false;
    }
  }

  $: kind === 'health-certificate' && recomputeHealthCertState();
</script>

{#if kind === 'id'}
  <div class="grid md:grid-cols-2 gap-3 mt-2">
    <div>
      <Tesseract
        value={employee.images[idFrontIndex]}
        options={idOptions}
        on:ocr={(ev) => onIdOcr(ev.detail, false)}
      />
    </div>

    {#if idFrontIndex > -1 && (employee.images[idFrontIndex]?.file || employee.images[idFrontIndex]?.location)}
      <div>
        <Tesseract
          value={employee.images[idBackIndex]}
          options={idOptions
            .filter((n) => n.value === employee.images[idFrontIndex].imageTag)
            .map((n) => ({ ...n, name: n.name.replace('Vorderseite', 'Rückseite') }))}
          noRead={true}
          on:ocr={(ev) => onIdOcr(ev.detail, true)}
        />
      </div>
    {/if}

    {#if employee.images.find((n) => (n.imageTag === 'id-card' || n.imageTag === 'passport')) && idFrontIndex > -1}
      <div>
        <Label for="id" class="mb-2">{employee.images[idFrontIndex]?.imageTag === 'id-card' ? 'Personalausweis' : 'Reisepass'}nummer *</Label>
        <Input placeholder="{employee.images[idFrontIndex]?.imageTag === 'id-card' ? 'XY1234A12' : 'ABC456789'}" bind:value={employee.images[idFrontIndex].documentNumber} type="text" id="id" required />
        <Helper class="mt-2" color="green">Bitte maschinell gescanntes Ergebnis überprüfen!</Helper>
      </div>
    {/if}
  </div>
{/if}

{#if kind === 'license'}
  <div class="grid md:grid-cols-2 gap-y-3 gap-x-4 mt-2">
    <Tesseract value={employee.images[licenseIndex]} options={[{ name: 'Führerschein Vorderseite', value: 'license' }]} on:ocr={onLicenseFront} />
    {#if licenseIndex > -1}
      <div>
        <Label class="mb-2" for="license">Führerscheinnummer *</Label>
        <Input id="license" bind:value={employee.images[licenseIndex].documentNumber} required />
        <Helper class="mt-2" color="green">Bitte maschinell gescanntes Ergebnis überprüfen!</Helper>
      </div>
      <Tesseract value={employee.images.find((n) => n.imageTag === 'license' && !n.documentNumber)} options={[{ name: 'Führerschein Rückseite', value: 'license' }]} noRead={true} on:ocr={onLicenseBack} />
    {/if}
  </div>
{/if}

{#if kind === 'student-verification'}
  <Tesseract value={employee.images.find((n) => n.imageTag === 'student-verification')} options={[{ name: 'Immatrikulationsbescheinigung', value: 'student-verification' }]} noRead={true} on:ocr={onStudentVerification} />
{/if}

{#if kind === 'health-certificate'}
  <div class="mt-2">
    <Tesseract
      value={employee.images[healthCertificateIndex]}
      options={[{ name: 'Gesundheitszeugnis', value: 'health-certificate' }]}
      on:ocr={onHealthCert}
    />

    {#if healthCertificateIndex >= 0 && employee.images[healthCertificateIndex]?.file}
      <div class="mt-3">
        <Label for="certificateDate" class="mb-2">Ausstellungsdatum</Label>
        <Input
          id="certificateDate"
          bind:value={employee.images[healthCertificateIndex].issueDate}
          placeholder="DD.MM.YYYY"
          on:input={() => recomputeHealthCertState()}
        />
        <Helper class="mt-2" color="green">Bitte maschinell gescanntes Ergebnis überprüfen!</Helper>
      </div>
    {/if}

    {#if healthCertificateError}
      <Alert color="red" class="mt-3">
        <p class="text-sm">
          Das Ausstellungsdatum des Gesundheitszeugnisses darf maximal 3 Monate zurück liegen.
        </p>
      </Alert>
    {/if}
  </div>
{/if}
