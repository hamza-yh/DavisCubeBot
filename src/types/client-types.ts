import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';

type CommandData = {
    data: SlashCommandBuilder;
    execute: (interaction: ChatInputCommandInteraction) => Promise<void>;
};

export { CommandData };
