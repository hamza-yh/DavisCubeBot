import path from 'path';
import fs from 'node:fs';
import os from 'os';
import { fileURLToPath } from 'url';
import { Client, GatewayIntentBits, Collection, Partials, REST, Routes } from 'discord.js';
import { CommandData } from './types/client-types.js';
import bot_creds from '../bot_creds.json' with { type: 'json' };

declare module 'discord.js' {
    interface Client {
        commands: Collection<string, CommandData>;
    }
}

const _filename = fileURLToPath(import.meta.url);
const _src_dirname = path.dirname(_filename);

const client = new Client({
    intents: [GatewayIntentBits.GuildMessages, GatewayIntentBits.Guilds],
    partials: [Partials.Message, Partials.Reaction, Partials.User, Partials.GuildMember, Partials.Channel],
});

client.commands = new Collection();

async function deployCommands() {
    const commands = [];
    const commandsPath = path.join(_src_dirname, './commands');
    const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

    for (const file of commandFiles) {
        const filePath =
            os.type() === 'Windows_NT' ? 'file://' + path.join(commandsPath, file) : path.join(commandsPath, file);
        const command = (await import(filePath)).default as CommandData;
        if (!command) {
            console.warn(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.\n`);
            continue;
        }
        client.commands.set(command.data.name, command);
        commands.push(command.data.toJSON());
    }

    try {
        const rest = new REST({ version: '10' }).setToken(bot_creds.token);
        await rest.put(Routes.applicationCommands(client.user!.id), { body: commands });
        console.log(`Successfully reloaded ${commands.length} application (/) commands.\n`);
    } catch (error) {
        console.error('Caught error loading command\n', error);
    }
}

export { client, deployCommands };
