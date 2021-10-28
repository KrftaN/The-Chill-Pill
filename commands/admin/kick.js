const Discord = ({ Client, Intents } = require("discord.js"));
const intents = new Discord.Intents(32767);
const bot = new Client({ intents });

module.exports = {
	name: "kick",
	description: "Kicking naughty users!",
	args: false,
	aliases: ["k"],
	guildOnly: true,
	cooldown: 0,
	maxArgs: 1,
	//minArgs: 1,
	permissions: "ADMINISTRATOR",
	usage: " <user>",
	execute(message, args) {
		const target = message.mentions.members.first();
		const targetUsername = target.username;
		if (!target) {
			message.channel.send("That user does not exist in this server!");
		}

		target
			.kick("not cool man")
			.then(async (target) => {
				message.channel.send("Successfully kicked ", "**", targetUsername, "**");
			})
			.catch(() => {
				message.channel.send("Couldn't kick ", "**", targetUsername, "**");
			});
	},
};
