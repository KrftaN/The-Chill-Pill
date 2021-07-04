module.exports = {
	name: "clear",
	aliases: ["clear"],
	description: "You pretending to be a maid be like",
	args: false,
	guildOnly: true,
	permissions: "ADMINISTRATOR",
	minArgs: 1,
	maxArgs: 1,
	cooldown: 1,
	usage: "<amount of messages you want to delete>", //`You successfully deleted ${args[0]} messages!`
	execute(message, args) {
		try {
			message.channel.bulkDelete(+args[0] + 1).then(() => {
				message.reply(`You successfully deleted ${args[0]} messages!`).then((msg) =>
					msg.delete({
						timeout: 2000,
					})
				);
			});
		} catch (err) {
			message.channel.send("Something went wrong. You ain't no maid. Can't clean shit.");
			console.log(err);
		}
	},
};