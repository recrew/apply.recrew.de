import { writable, type Writable } from "svelte/store";

export type ApplicationFormData = {
    firstname: string;
    lastname: string;
    maidenName?: string | null;
    email?: string | null;
    facebook?: string | null;
    instagram?: string | null;
    letter_motivation?: string | null;
    mobile?: string | null;
    photo?: File | null;
    idFrontPhoto?: File | null;
    idBackPhoto?: File | null;
    passportPhoto?: File | null;
    referer?: string | null;
    region?: string | null;
    idNumber?: string | null;
    passportNumber?: string | null;
    dateOfBirth?: string | null;
    placeOfBirth?: string | null;
    sex?: string | null;
    address: {
        name?: string | null;
        street: string;
        number?: number | null;
        place: string;
        state?: string | null;
        zip: string;
        country: string;
        addressAddendum?: string | null;
    };
};

export const initialApplicationData: ApplicationFormData = {
    firstname: "",
    lastname: "",
    email: "",
    facebook: "",
    instagram: "",
    letter_motivation: "",
    idFrontPhoto: null,
    idBackPhoto: null,
    passportPhoto: null,
    mobile: "",
    photo: null,
    referer: "",
    region: "",
    idNumber: "",
    passportNumber: "",
    dateOfBirth: "",
    address: {
        name: "",
        street: "",
        number: 0,
        place: "",
        state: "",
        zip: "",
        country: "",
    },
};

export const application: Writable<ApplicationFormData> = writable(
    structuredClone(initialApplicationData),
);

export function resetApplicationStore() {
    application.set(structuredClone(initialApplicationData));
}

export function setApplicationStore(data: ApplicationFormData) {
    application.set(data);
}

/** Optional: partial update helper (usually very handy) */
export function patchApplicationStore(patch: Partial<ApplicationFormData>) {
    application.update((curr) => ({ ...curr, ...patch }));
}
