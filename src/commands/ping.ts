// to test if your bot is working. use this as a template for other commands.

import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';

const data = new SlashCommandBuilder().setName('ping').setDescription('Replies with Pong!');

async function execute(interaction: ChatInputCommandInteraction) {
    const timeDelay = Date.now() - interaction.createdTimestamp;
    await interaction.reply(`Pong! ${timeDelay}ms`);
}

export default { data: data, execute };
