import { writable, type Writable } from "svelte/store";

export type ApplicationFormData = {
    firstname: string;
    lastname: string;
    email: string;
    facebook: string;
    instagram: string;
    letter_motivation: string;
    mobile: string;
    photo: File | null;
    referer: string;
    region: string;
    address: {
        name: string;
        street: string;
        number: number;
        place: string;
        state: string;
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
    mobile: "",
    photo: null,
    referer: "",
    region: "",
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
