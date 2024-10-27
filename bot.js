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

client.on('messageCreate', async message => {
    if (message.channel.id === SOURCE_CHANNEL_ID && !message.author.bot) {
        const urlRegex = /(https?:\/\/[^\s]+)/g;
        const urls = message.content.match(urlRegex);

        // URLの転送
        if (urls) {
            const messageWithoutUrls = message.content.replace(urlRegex, '').trim();
            const targetChannel = client.channels.cache.get(TARGET_CHANNEL_ID);

            if (targetChannel) {
                for (const url of urls) {
                    await targetChannel.send(url).catch(console.error);
                }

                // メッセージを編集してURLを削除
                if (messageWithoutUrls) {
                    await message.edit(messageWithoutUrls).catch(console.error);
                } else {
                    // メッセージが空になった場合、削除する
                    await message.delete().catch(console.error);
                }
            }
        }

        // 画像の転送
        if (message.attachments.size > 0) {
            const targetChannel = client.channels.cache.get(TARGET_CHANNEL_ID);
            if (targetChannel) {
                message.attachments.forEach(attachment => {
                    if (attachment.contentType.startsWith('image/')) {
                        targetChannel.send({ files: [attachment.url] }).catch(console.error);
                    }
                });
            }
        }
    }
});

client.login(process.env.DISCORD_BOT_TOKEN);

// Expressサーバーを起動して、0.0.0.0:3000でリッスン
app.get('/', (req, res) => res.send('Bot is running'));
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on http://0.0.0.0:${PORT}`);
});
