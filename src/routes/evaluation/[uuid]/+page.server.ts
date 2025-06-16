// +page.server.ts
import template from './template.json';
import type { PageServerLoad } from '../$types';
import { get } from '$lib/api';

export const load: PageServerLoad = async ({ url, fetch }) => {
    const evaluationUuid = url.pathname.split('/').pop();

    if (!evaluationUuid) {
        return {
            errorMessage: 'Ungültige Evaluation ID.'
        };
    }

    try {
        const evaluation = await getEvaluation(evaluationUuid);
        console.log('Evaluation geladen:', evaluation);

        if (!evaluation) {
            return {
                errorMessage: 'Evaluation nicht gefunden.'
            };
        }

        return {
            evaluation
        };
    } catch (err) {
        console.error('API-Fehler:', err);
        return {
            errorMessage: 'Unerwarteter Fehler beim Laden der Daten.',
        };
    }
};

async function getEvaluation(uuid: string) {
    try {
        const evaluation = await get(`/rating/${uuid}`);
        return evaluation;
    } catch (error) {
        console.error('Fehler beim Abrufen der Evaluation:', error);
        return null;
    }
}