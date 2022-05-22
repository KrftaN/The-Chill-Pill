const mongoDB = require("../../utility/mongodbFramework");
const Discord = ({ Client, Intents } = require("discord.js"));

module.exports = {
	name: "setwelcomemessage",
	aliases: ["setwelcome"],
	description: "Server config",
	args: true,
	maxArgs: 2,
	minArgs: 2,
	cooldown: 1,
	permissions: "ADMINISTRATOR",
	usage: "<channelId> <message>",
	async execute(message, args) {
		const { client, guild } = message;

		if (!client.channels.cache.get(args[0]))
			return message.channel.send(
				"Send a valid channel ID. (You can use the `.id` command. Or you could use the Discord developer tools)"
			);

		const channelId = args[0];

		args.shift();
		welcomeMessage = args.join(" ");

	/* 	module.exports.validationJoinCache = {};

		validationJoinCache[guild.id] = [channelId, welcomeMessage]; */

		await mongoDB.setWelcome(guild.id, guild.name, channelId, welcomeMessage);

		const embed = new Discord.MessageEmbed()
			.setTitle("Set Welcome")
			.setDescription("**You successfully set up a welcome message!**")
			.setColor("#DC143C")
			.addFields(
				{
					name: `Channel ID:`,
					value: `\`${channelId}\``,
					inline: true,
				},
				{
					name: `Welcome Message:`,
					value: welcomeMessage,
					inline: true,
				}
			)
			.setFooter(
				"You can also set up a message when someones leaves. Do this with the command **.setleavemessage** or **.setleave**"
			)
			.setTimestamp(new Date());

		message.channel.send(embed);
	},
};
