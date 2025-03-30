import { ChatInputCommandInteraction, EmbedBuilder, SlashCommandBuilder, time } from 'discord.js';
import {
    compStartTime,
    crowDistance,
    eventIconString,
    compUrl,
    dateToUnix,
} from '../helper-functions/utility-functions.js';
import {
    fetchCompetitions,
    fetchPerson,
    getRegistrationState,
    registrationBlurb,
    registrations,
} from '../helper-functions/wca-api-functions.js';
import { Competition, PersonalInfo } from '../types/wca-api-types.js';
import { davisBlue, davisCoords } from '../constants/bot-constants.js';
import wcaIds from '../data/wca-ids.js';

const data = new SlashCommandBuilder().setName('upcomingcomps').setDescription('Check what comps are coming up!');

async function execute(interaction: ChatInputCommandInteraction) {
    await interaction.deferReply();
    console.time('fetch');
    const caliComps = await fetchCompetitions(
        'country_iso2=US&include_cancelled=false&sort=start_date%2Cend_date%2Cname&ongoing_and_future=2025-03-25'
    );
    console.timeEnd('fetch');
    console.time('filter');

    const filteredComps: Competition[] = caliComps.filter(
        comp =>
            crowDistance(davisCoords.latitude, davisCoords.longitude, comp.latitude_degrees, comp.longitude_degrees) <
            600
    );
    console.timeEnd('filter');

    const embed = new EmbedBuilder().setColor(davisBlue).setTitle('Upcoming Comps!');

    console.time('embed');

    const embedFields = await Promise.all(
        filteredComps.map(async comp => {
            const name = `${comp.short_display_name}x`;
            const regs = await registrations(comp.id);
            let names = 'Unable to fetch registrations\n';
            if (regs) {
                names = regs
                    .filter(person => typeof person.wcaId === 'string' && wcaIds.includes(person.wcaId))
                    .map(person => person.name)
                    .join(', ');
            }

            const compDeadline = registrationBlurb(comp);
            const value = `${comp.event_ids.map(event => eventIconString(interaction, event)).join('')} [(open)](${compUrl(comp)})\n-# <t:${dateToUnix(compStartTime(comp))}:R> | ${compDeadline}\n${names}\n\u200B`;

            return { name, value };
        })
    );

    embedFields.forEach(field => {
        embed.addFields(field);
    });

    console.timeEnd('embed');

    await interaction.editReply({ embeds: [embed] });
}

export default { data: data, execute };
