const mongoDB = require("../../utility/mongodbFramework");
const Discord = ({ Client, Intents } = require("discord.js"));

const intents = new Discord.Intents(32767);
const bot = new Client({ intents });

module.exports = {
	name: "leave",
	aliases: ["setleavemessage", "setleave"],
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
		leaveMessage = args.join(" ");

		await mongoDB.setLeave(guild.id, guild.name, channelId, leaveMessage);

		const embed = new Discord.MessageEmbed()
			.setTitle("Set Leave Message")
			.setDescription("**You successfully set up a leave message!**")
			.setColor("#DC143C")
			.addFields(
				{
					name: `Channel ID:`,
					value: `\`${channelId}\``,
					inline: true,
				},
				{
					name: `Leave Message:`,
					value: leaveMessage,
					inline: true,
				}
			)
			.setFooter(
				"You can also set up a message when someones joins. Do this with the command `.setwelcome` or `.setleave`"
			)
			.setTimestamp(new Date());

		message.channel.send(embed);
	},
};
