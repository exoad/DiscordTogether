const Discord = require('discord.js');
const bot = new Discord.Client();
//bot private info
const token = require('./token.json');
const { DiscordTogether } = require('discord-together');

bot.on('ready', () => {
  console.info("Ready");
})

bot.on('message', async(message) => {
    if (message.content === ';start') {
        if(message.member.voice.channel) {
            bot.discordTogether.createTogetherCode(message.member.voice.channelID, 'poker').then(async invite => {
                return message.channel.send(`${invite.code}`);
            });
        };
    };
})

bot.login(token.t);