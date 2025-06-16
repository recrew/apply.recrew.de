// +page.server.ts
import template from './template.json';
import type { PageServerLoad } from '../$types';

export const load: PageServerLoad = async ({ url, fetch }) => {
    const evaluationUuid = url.pathname.split('/').pop();

    if (!evaluationUuid) {
        return {
            errorMessage: 'Ungültige Evaluation ID.'
        };
    }

    try {
        const evaluation = await getEvaluation(evaluationUuid);

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
    if (!uuid) {
        return null;
    }

    const evalFromServer = {
        ...template,
        id: uuid,
        reviewer: {
            name: 'Max Mustermann',
            uuid: 'reviewer-123',
        },
        reviewee: {
            name: 'Erika Mustermann',
            uuid: 'reviewee-456',
        },
        shifts: [
            { date: '2025-06-01', name: 'Dallmayr', id: 'shift1' },
            { date: '2025-06-01', name: 'Dahlmann', id: 'shift2' },
            { date: '2025-06-02', name: 'Recrew', id: 'shift3' },
        ],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        deletedAt: null
    };
    
    return evalFromServer;
}