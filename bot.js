require('dotenv').config();
const { Client, GatewayIntentBits } = require('discord.js');
const express = require('express');
const app = express();
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });

const SOURCE_CHANNEL_ID = process.env.SOURCE_CHANNEL_ID;
const TARGET_CHANNEL_ID = process.env.TARGET_CHANNEL_ID;
const PORT = process.env.PORT || 3000;

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

// Expressサーバーを起動して、0.0.0.0:3000でリッスン
app.get('/', (req, res) => res.send('Bot is running'));
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on http://0.0.0.0:${PORT}`);
});
