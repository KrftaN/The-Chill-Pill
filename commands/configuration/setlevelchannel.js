const mongoDB = require("../../utility/mongodbFramework");
const Discord = ({ Client, Intents } = require("discord.js"));

module.exports = {
	name: "setlevelchannel",
	aliases: ["setlevel"],
	description: "Server config",
	args: true,
	maxArgs: 2,
	minArgs: 2,
	cooldown: 1,
	permissions: "ADMINISTRATOR",
	usage: "<channelId>",
	async execute(message, args) {
		const { client, guild } = message;

		if (!client.channels.cache.get(args[0]))
			return message.channel.send(
				"Send a valid channel ID. (You can use the `.id` command. Or you could use the Discord developer tools)"
			);

		const channelId = args[0];

		await mongoDB.setLevel(guild.id, guild.name, channelId);

		const embed = new Discord.MessageEmbed()
			.setTitle("Set Welcome")
			.setDescription("**You successfully choosen a level channel!**")
			.setColor("#DC143C")
			.addFields(
				{
					name: `Channel ID:`,
					value: `\`${channelId}\``,
					inline: true,
				},
			)
			.setTimestamp(new Date());

		message.channel.send(embed);
	},
};
