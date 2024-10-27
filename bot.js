require('dotenv').config();
const { Client, GatewayIntentBits } = require('discord.js');
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });

const SOURCE_CHANNEL_ID = process.env.SOURCE_CHANNEL_ID;
const TARGET_CHANNEL_ID = process.env.TARGET_CHANNEL_ID;

client.once('ready', () => {
    console.log(`Logged in as ${client.user.tag}`);
});

client.on('messageCreate', message => {
    if (message.channel.id === SOURCE_CHANNEL_ID && message.content.includes('http')) {
        const targetChannel = client.channels.cache.get(TARGET_CHANNEL_ID);
        if (targetChannel) {
            targetChannel.send(message.content);
        }
    }
});

client.login(process.env.DISCORD_BOT_TOKEN);
