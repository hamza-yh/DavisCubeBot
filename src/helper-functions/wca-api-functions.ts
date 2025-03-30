import { PersonalInfo, Competition } from '../types/wca-api-types.js';
import { Competition as wcif } from '@wca/helpers';
import { dateToUnix } from './utility-functions.js';
async function fetchPerson(wcaId: string): Promise<PersonalInfo | null> {
    try {
        const response = await fetch(`https://www.worldcubeassociation.org/api/v0/users/${wcaId}`);
        const json = await response.json();

        return json.user ?? null;
    } catch (error) {
        console.error('Error fetching user:', error);
        return null;
    }
}
async function fetchCompetitions(queryParams: string): Promise<Competition[]> {
    let comps: Competition[] = [];
    let page = 1;

    while (true) {
        try {
            const response = await fetch(
                `https://www.worldcubeassociation.org/api/v0/competition_index?${queryParams}&page=${page}`
            );
            const json: Competition[] = await response.json();
            if (json.length == 0) {
                return comps;
            }
            const trimmed_comps = json.map(comp => ({
                id: comp.id,
                name: comp.name,
                short_display_name: comp.short_display_name,
                registration_open: comp.registration_open,
                registration_close: comp.registration_close,
                announced_at: comp.announced_at,
                start_date: comp.start_date,
                end_date: comp.end_date,
                event_ids: comp.event_ids,
                latitude_degrees: comp.latitude_degrees,
                longitude_degrees: comp.longitude_degrees,
            }));

            comps.push(...trimmed_comps);
            page++;
        } catch (error) {
            console.error('Error fetching competitions:', error);
            return comps;
        }
    }
}

async function isRegistered(compId: string, personId: string): Promise<boolean | null> {
    try {
        const response = await fetch(
            `https://www.worldcubeassociation.org/api/v0/competitions/${compId}/registrations`
        );
        if (!response.ok) {
            return null;
        }
        const json = await response.json();
        const isRegistered = json.some((person: { user_id: string }) => person.user_id == personId);
        return isRegistered;
    } catch (error) {
        console.error(`Error fetching registration data for ${compId}:`, error);
        return null;
    }
}

async function registrations(compId: string) {
    try {
        const response = await fetch(`https://www.worldcubeassociation.org/api/v0/competitions/${compId}/wcif/public`);
        if (!response.ok) {
            return null;
        }
        const json: wcif = await response.json();
        const registrations = json.persons.filter(person => person.registration && person.registration.isCompeting);
        return registrations;
    } catch (error) {
        console.error(`Error fetching registration data for ${compId}:`, error);
        return null;
    }
}

function getRegistrationState(comp: Competition): 'notOpen' | 'open' | 'closed' {
    const now = new Date();
    const registrationOpen = new Date(comp.registration_open);
    const registrationClose = new Date(comp.registration_close);

    if (now < registrationOpen) {
        return 'notOpen';
    }
    if (now < registrationClose) {
        return 'open';
    }
    return 'closed';
}

function registrationBlurb(comp: Competition): string {
    const state = getRegistrationState(comp);
    const registrationOpen = new Date(comp.registration_open);
    const registrationClose = new Date(comp.registration_close);

    let compDeadline = '';

    if (state === 'notOpen') {
        compDeadline = `Registration opens <t:${dateToUnix(registrationOpen)}:R>`;
    } else if (state === 'open') {
        compDeadline = `Registration closes <t:${dateToUnix(registrationClose)}:R>`;
    } else if (state === 'closed') {
        compDeadline = `Registration closed <t:${dateToUnix(registrationClose)}:R>`;
    }

    return compDeadline;
}

export { fetchPerson, fetchCompetitions, isRegistered, registrations, getRegistrationState, registrationBlurb };
