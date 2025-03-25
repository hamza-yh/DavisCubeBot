/**
 * Main entry point for the Discord bot.
 * - Logs in using credentials from `bot_creds.json`.
 * - Deploys slash commands when the bot is ready.
 * - Handles incoming commands and interactions.
 */

import { client, deployCommands } from './client.js';
import { Events } from 'discord.js';
import bot_creds from '../bot_creds.json' with { type: 'json' };

client.once(Events.ClientReady, async () => {
    await deployCommands();
    console.log(`Logged in as ${client.user!.username}!\n`);
});

client.on(Events.InteractionCreate, async interaction => {
    // handles interactions when a user enters a slash command
    if (interaction.isChatInputCommand()) {
        try {
            const command = client.commands.get(interaction.commandName);
            if (!command) {
                throw new Error(`Received slash command "${interaction.commandName}" but can't find command info.`);
            }
            await command.execute(interaction);
        } catch (error) {
            console.error(error);
            await interaction.reply({
                content: `The following error occured during the execution of this command:\n ${error as Error}`,
                ephemeral: true,
            });
        }
    }
});

client.login(bot_creds.token).catch(err => {
    console.error('Login Unsuccessful. Make sure bot_creds.json exists and is valid.\n');
    throw err;
});
