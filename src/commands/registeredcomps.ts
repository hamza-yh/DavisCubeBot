import { ChatInputCommandInteraction, EmbedBuilder, SlashCommandBuilder } from 'discord.js';
import pLimit from 'p-limit';

import { fetchPerson, fetchCompetitions, isRegistered } from '../helper-functions/wca-api-functions.js';
import { Competition } from '../types/wca-api-types.js';

const data = new SlashCommandBuilder()
    .setName('registeredcomps')
    .setDescription('Check which comps someone is signed up for.')
    .addStringOption(option =>
        option.setName('wca_id').setDescription('Enter the WCA ID of the person').setRequired(true)
    );

async function execute(interaction: ChatInputCommandInteraction) {
    await interaction.deferReply();

    // const comps = await fetchCompetitions(
    //     'include_cancelled=false&sort=start_date%2Cend_date%2Cname&ongoing_and_future=2025-03-25'
    // );
    const comps = await fetchCompetitions('');
    const wca_id = interaction.options.getString('wca_id');

    if (!wca_id) {
        await interaction.editReply('Unable to find WCA ID');
        return;
    }

    const person = await fetchPerson(wca_id);
    if (!person) {
        await interaction.editReply('Invalid WCA ID');
        return;
    }
    let id = person.id;

    const limit = pLimit(25);
    const compRegistrations: { comp: Competition; registered: boolean | null }[] = await Promise.all(
        comps.map(comp => limit(async () => ({ comp: comp, registered: await isRegistered(comp.id, id) })))
    );

    const registeredComps = compRegistrations.filter(result => result.registered).map(result => result.comp.name);

    const embed = new EmbedBuilder()
        .setColor(0x0099ff)
        .setTitle(`${person.name} is registered for ${registeredComps.length} competitions`)
        .setURL(person.url)
        .setDescription(registeredComps.length > 0 ? registeredComps.join('\n') : 'No registered competitions');

    if (!person.avatar.is_default) {
        embed.setThumbnail(person.avatar.thumb_url);
    }

    await interaction.editReply({ embeds: [embed] });
}

export default { data, execute };
