const { Client, GatewayIntentBits } = require('discord.js');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

const timers = new Map();

client.on('ready', () => {
  console.log(`Bot nyala: ${client.user.tag}`);
});

client.on('messageCreate', async (message) => {
  if (message.author.bot) return;

  const args = message.content.split(" ");
  const command = args[0];

  if (command === "!dc") {
    const minutes = parseInt(args[1]);
    const target = message.mentions.members.first() || message.member;

    if (!minutes) {
      return message.reply("pake: !dc 60 atau !dc 60 @orang");
    }

    if (!target.voice.channel) {
      return message.reply("target ga di VC 😭");
    }

    if (timers.has(target.id)) {
      clearTimeout(timers.get(target.id));
    }

    message.reply(`⏳ ${target.user.username} bakal di DC ${minutes} menit lagi`);

    const timeout = setTimeout(() => {
      if (target.voice.channel) {
        target.voice.disconnect();
        message.channel.send(`💀 ${target.user.username} kena DC`);
      }
      timers.delete(target.id);
    }, minutes * 60000);

    timers.set(target.id, timeout);
  }

  if (command === "!cancel") {
    const target = message.mentions.members.first() || message.member;

    if (!timers.has(target.id)) {
      return message.reply("ga ada timer aktif");
    }

    clearTimeout(timers.get(target.id));
    timers.delete(target.id);

    message.reply(`❌ timer ${target.user.username} dibatalin`);
  }
});

client.login(process.env.DISCORD_TOKEN)
