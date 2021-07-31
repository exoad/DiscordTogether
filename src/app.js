/*
 * MIT License
 *
 * Copyright (c) 2021 Jack Meng
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

const Discord = require("discord.js");
const { MessageEmbed } = require("discord.js");
const bot = new Discord.Client();
//bot private info
const token = require("./json/token.json");
const assets = require("./json/assets.json");
const { DiscordTogether } = require("discord-together");
const { MessageButton, MessageActionRow } = require("discord-buttons");
const express = require("express");
const app = express();
const port = 3000;
app.get("/", (req, res) => res.send("Request"));

app.listen(port, () => console.log(`Listening on ${port}\nhttp://localhost:${port}`));

require("discord-buttons")(bot);

let ytButton = new MessageButton()
  .setStyle("red")
  .setLabel("YouTube")
  .setID("yt_btn");

let pokerButton = new MessageButton()
  .setStyle("blurple")
  .setLabel("Poker")
  .setID("pker_btn");

let chessButton = new MessageButton()
  .setStyle("grey")
  .setLabel("Chess")
  .setID("chess_btn");

let row = new MessageActionRow().addComponents(ytButton, pokerButton, chessButton);

bot.on("ready", () => {
  console.info("Ready");
});
bot.discordTogether = new DiscordTogether(bot);
bot.on("message", async (message) => {
  let prefix = assets.prefix;
  try {
    if (!message.content.startsWith(prefix) || message.author.bot) return;
    const args = message.content.slice(prefix.length).trim().split(" ");
    const cmd = args.shift().toLowerCase();
    if (cmd == "start") {
      if (!args.length) {
        const embed = new MessageEmbed()
          .setTitle('Argument Error - parameter at arg[0] returned "null"')
          .setDescription(
            "This command requires certain arguments to run properly, check below for such properties"
          )
          .addField("Usage", "`" + prefix + "start <action_type>`")
          .addField(
            "action_type",
            "**youtube** = Launch a YouTube Activity\n**chess** = Launch a Chess Activity\n**poker** = Launch a poker activity"
          )
          .addField(
            "Example Usage",
            "`" + prefix + "start youtube` => Launches a YouTube activity"
          )
          .setColor("RANDOM");
        message.channel.send({ embed });
      } else {
        if (message.member.voice.channel) {
          if (args[0] == "poker") {
            bot.discordTogether
              .createTogetherCode(message.member.voice.channelID, "poker")
              .then(async (invite) => {
                const embed = new MessageEmbed()
                  .setTitle("Created Poker Activity!")
                  .setDescription(
                    "[Invite Link Click Here](" + invite.code + ")"
                  );
                message.channel.send({ embed });
              });
          } else if (args[0] == "youtube" || args[0] == "yt") {
            bot.discordTogether
              .createTogetherCode(message.member.voice.channelID, "youtube")
              .then(async (invite) => {
                const embed = new MessageEmbed()
                  .setTitle("Created YouTube Activity!")
                  .setDescription(
                    "[Invite Link Click Here](" + invite.code + ")"
                  );
                message.channel.send({ embed });
              });
          } else if (args[0] == "chess") {
            bot.discordTogether
              .createTogetherCode(message.member.voice.channelID, "chess")
              .then(async (invite) => {
                const embed = new MessageEmbed()
                  .setTitle("Created Chess Activity!")
                  .setDescription(
                    "[Invite Link Click Here](" + invite.code + ")"
                  );
                message.channel.send({ embed });
              });
          } else {
            const embed = new MessageEmbed()
              .setTitle("Argument Error - parameter invalid")
              .setDescription(
                "This command requires certain arguments to run properly, check below for such properties"
              )
              .addField("Usage", "`" + prefix + "start <action_type>`")
              .addField(
                "action_type",
                "**youtube** = Launch a YouTube Activity\n**chess** = Launch a Chess Activity\n**poker** = Launch a poker activity"
              )
              .addField(
                "Example Usage",
                "`" + prefix + "start youtube` => Launches a YouTube activity"
              )
              .setColor("RANDOM");
            message.channel.send({ embed });
          }
        } else {
          message.reply(
            "**You are not in a voice channel!**\nPlease join a voice channel in order to start an activity!"
          );
        }
      }
    } else if (cmd == "ping") {
      const embed = new MessageEmbed()
        .setTitle("Pong!")
        .addField(
          ":globe_with_meridians: Bot Latency",
          Date.now() - message.createdTimestamp
        )
        .addField(":globe_with_meridians: API Latency", Math.round(bot.ws.ping))
        .setColor("RANDOM")
        .setFooter("Server Location: US/EST");
      message.channel.send({ embed });
    } else if(cmd == "create") {
      const err = new MessageEmbed()
        .setTitle("Create an Activity!")
        .setDescription("Click one of the buttons to generate an activity for this server!")
        .setFooter("To prevent overload, this message will be deleted in 1 minute or when an activity is selected");
      message.channel.send(err, row).then(m => {
        setTimeout(() => m.delete(), 60000)
      });
    }
  } catch (e) {
    console.error(e);
  }
});

bot.login(token.t);
