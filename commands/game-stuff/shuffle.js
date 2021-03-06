const Discord = require("discord.js");

module.exports = {
	name: "shuffle",
	aliases: [],
	description: "This is something which will probably never be used again!",
	args: true,
	minArgs: 1,
	maxArgs: 1,
	cooldown: 1,
	usage: "<gm1 or gm2>",
	execute(message, args) {
		const classes = [
			"Solider",
			"Spy",
			"Sniper",
			"Pyro",
			"Scout",
			"Heavy",
			"Medic",
			"Engineer",
			"Demoman",
		];
		const pickedclassesRed = classes.sort((a, b) => 0.5 - Math.random()).slice(0, 4); //Psudo randomness!

		switch (args[0]) {
			case "gm1":
				{
					const pickedclassesBlue = classes.sort((a, b) => 0.5 - Math.random()).slice(0, 4);

					const shuffleembedgm1 = new Discord.MessageEmbed()
						.setColor("#DC143C")
						.setTitle("TF2 Classes per teams")
						.addField("Red", pickedclassesRed.join("\n"))
						.addField("Blue", pickedclassesBlue.join("\n"));

					message.channel.send({ embeds: [shuffleembedgm1] });
				}
				break;
			case "gm2":
				{
					const shuffleembedgm2 = new Discord.MessageEmbed()
						.setColor("#DC143C")
						.setTitle("TF2 Classes per teams")
						.addField("Classes", pickedclassesRed.join("\n"));

					message.channel.send({ embeds: [shuffleembedgm2] });
				}

				break;
		}
	},
};
