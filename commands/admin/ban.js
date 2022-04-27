const Discord = ({ Client, Intents } = require("discord.js"));

const intents = new Discord.Intents(32767);
const bot = new Client({ intents });

module.exports = {
	name: "ban",
	aliases: ["b"],
	description: "BAN naughty users!",
	args: true,
	guildOnly: true,
	permissions: "ADMINISTRATOR",
	cooldown: 0,
	minArgs: 2,
	usage: " <user> <reason for ban>",
	async execute(message, args, guild, bot, folders) {
		

		/* 	const Guild = bot.guilds.cache.get(guild.id);

		const mentionedUser = message.mentions.users.first();

		const Member = Guild.members.cache.get(message.author.id);

		if (mentionedUser) {
			if (Member) {
				Member.ban({
					reason: args.join(" "),
				})
					.then(() => {
						message.reply(`Sucessfully banned ${mentionedUser.tag}`);
					})
					.catch((err) => {
						message.reply(`I was unable to ban ${mentionedUser.tag}`);
						console.log(err);
					});
			}
		} */
	},
};
