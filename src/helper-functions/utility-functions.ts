import { Competition } from '../types/wca-api-types';
import tzLookup from 'tz-lookup';
import { toZonedTime, fromZonedTime } from 'date-fns-tz';
import { ChatInputCommandInteraction, CacheType } from 'discord.js';

function crowDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
    function deg2rad(deg: number) {
        return deg * (Math.PI / 180);
    }

    const R = 6371;
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c;
    return d;
}

function compStartTime(comp: Competition): Date {
    const timezone = tzLookup(comp.latitude_degrees, comp.longitude_degrees);

    return fromZonedTime(comp.start_date, timezone);
}
function compUrl(comp: Competition) {
    return 'https://www.worldcubeassociation.org/competitions/' + comp.id;
}
function eventIconString(interaction: ChatInputCommandInteraction<CacheType>, event: string) {
    if (!interaction.guild) {
        return '<could not locate emoji id>';
    }
    const emoji = interaction.guild.emojis.cache.find(emojis => emojis.name === event);
    if (!emoji) {
        return '<unkown event name>';
    }
    return `<:${event}:${emoji.id}>`;
}

function dateToUnix(date: Date) {
    return Math.floor(date.getTime() / 1000);
}

export { crowDistance, compStartTime, eventIconString, compUrl, dateToUnix };
