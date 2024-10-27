require('dotenv').config();
const { Client, GatewayIntentBits } = require('discord.js');
const express = require('express');
const app = express();
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });

const SOURCE_CHANNEL_ID = process.env.SOURCE_CHANNEL_ID;
const TARGET_CHANNEL_ID = process.env.TARGET_CHANNEL_ID;
const PORT = process.env.PORT || 3000;

let processedMessages = new Set();

client.once('ready', () => {
    console.log(`Logged in as ${client.user.tag}`);
});

client.on('messageCreate', message => {
    console.log(`Message received: ${message.content}`); // デバッグログ追加
    if (message.channel.id === SOURCE_CHANNEL_ID && message.content.includes('http') && !message.author.bot) {
        if (!processedMessages.has(message.id)) {
            const targetChannel = client.channels.cache.get(TARGET_CHANNEL_ID);
            if (targetChannel) {
                targetChannel.send(message.content)
                    .then(() => {
                        console.log(`Message sent to ${TARGET_CHANNEL_ID}`);
                        processedMessages.add(message.id); // メッセージIDを保存して重複送信を防ぐ
                    })
                    .catch(console.error);
            }
        } else {
            console.log(`Message already processed: ${message.id}`); // デバッグログ追加
        }
    }
});

client.login(process.env.DISCORD_BOT_TOKEN);

// Expressサーバーを起動して、0.0.0.0:3000でリッスン
app.get('/', (req, res) => res.send('Bot is running'));
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on http://0.0.0.0:${PORT}`);
});
