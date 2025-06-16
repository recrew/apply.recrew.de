// +page.server.ts
import { get } from 'svelte/store';
import template from './template.json';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url, fetch }) => {
    const token = url.searchParams.get('token');
    if (!token) {
        return {
            token: null,
            errorMessage: 'Kein Token übergeben.',
            template
        };
    }

    try {
        const rebuddyData = await getRebuddyDataFromToken(token);

        return {
            token,
            rebuddyData,
            template
        };
    } catch (err) {
        console.error('API-Fehler:', err);
        return {
            token,
            errorMessage: 'Unerwarteter Fehler beim Laden der Daten.',
            template
        };
    }
};

async function getRebuddyDataFromToken(token: string) {
    if (!token) {
        return null;
    }

    return {
        rebuddyName: 'Leonie Müller',
        starterName: 'Max Mustermann',
        shifts: [
            { date: '2025-06-01', name: 'Dallmayr', id: 'shift1' },
            { date: '2025-06-01', name: 'Dallmayr', id: 'shift2' },
            { date: '2025-06-02', name: 'Recrew', id: 'shift3' },
        ]
    };
}