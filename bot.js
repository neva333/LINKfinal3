require('dotenv').config();
const { Client, GatewayIntentBits } = require('discord.js');
const express = require('express');
const app = express();
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });

const SOURCE_CHANNEL_ID = process.env.SOURCE_CHANNEL_ID;
const URL_TARGET_CHANNEL_ID = process.env.URL_TARGET_CHANNEL_ID; // URLを送信するチャンネル
const IMAGE_TARGET_CHANNEL_ID = process.env.IMAGE_TARGET_CHANNEL_ID; // 画像を送信するチャンネル
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
            console.log(`URLs detected: ${urls}`); // デバッグログ追加
            const messageWithoutUrls = message.content.replace(urlRegex, '').trim();
            const urlTargetChannel = client.channels.cache.get(URL_TARGET_CHANNEL_ID);

            if (urlTargetChannel) {
                for (const url of urls) {
                    await urlTargetChannel.send(url).catch(console.error);
                }

                // メッセージを編集してURLを削除
                if (messageWithoutUrls) {
                    await message.edit(messageWithoutUrls).catch(console.error);
                } else {
                    // メッセージが空になった場合、削除する
                    await message.delete().catch(console.error);
                }
            } else {
                console.error(`URL target channel not found: ${URL_TARGET_CHANNEL_ID}`); // デバッグログ追加
            }
        } else {
            console.log('No URLs detected'); // デバッグログ追加
        }

        // 画像の転送
        if (message.attachments.size > 0) {
            const imageTargetChannel = client.channels.cache.get(IMAGE_TARGET_CHANNEL_ID);
            if (imageTargetChannel) {
                message.attachments.forEach(attachment => {
                    if (attachment.contentType.startsWith('image/')) {
                        imageTargetChannel.send({ files: [attachment.url] }).catch(console.error);
                    }
                });
            } else {
                console.error(`Image target channel not found: ${IMAGE_TARGET_CHANNEL_ID}`); // デバッグログ追加
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
