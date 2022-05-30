const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");

module.exports = {
	name: "roll",
	data: new SlashCommandBuilder()
		.setName("roll")
		.setDescription("Displays a spell from Dungeons and Dragons 5e.")
		.addNumberOption((option) => {
			return (option = option
				.setName("numberofdice")
				.setDescription("Enter the number of dice")
				.setRequired(true));
		})
		.addNumberOption((option) => {
			return (option = option
				.setName("sidesofdice")
				.setDescription("Enter the amount of sides the dice has")
				.setRequired(true));
		}),
	async execute(interaction, bot) {
		const { options } = interaction;

		const amount = options.getNumber("numberofdice");
		const dice = options.getNumber("sidesofdice");

		function add(accumulator, a) {
			return accumulator + a;
		}
		const embed1 = new MessageEmbed()
			.setTitle("❌ Invalid input! ❌")
			.setColor("#FFFF00")
			.setDescription("Example: `roll 4d6 + 5` || `roll 1d20`")
			.setTimestamp(new Date());

		const embed2 = new MessageEmbed()
			.setTitle("❌ Invalid input! ❌")
			.setColor("#FFFF00")
			.setDescription("**Cannot** roll more than 100 dice!")
			.setTimestamp(new Date());

		const embed3 = new MessageEmbed()
			.setTitle("❌ Invalid input! ❌")
			.setColor("#FFFF00")
			.setDescription("**Cannot** roll a die with more than 100 sides!")
			.setTimestamp(new Date());

		if (!amount || !dice)
			return message.channel.send({
				embeds: [embed1],
			});

		if (amount > 100)
			return message.channel.send({
				embeds: [embed2],
			});

		if (dice > 100)
			return message.channel.send({
				embeds: [embed3],
			});

		let result = [...Array(amount)].map(() => Math.floor(Math.random() * dice) + 1);

		let sum = result.reduce(add, 0);

		const embed4 = new MessageEmbed()
			.setTitle("🎲Rolling Dice🎲")
			.setColor("#DC143C")
			.setDescription(`[**${amount}d${dice}** : ${result.join(" | ")}] \n **The Sum: \`${sum}\`**`)
			.setTimestamp(new Date());

		await interaction.reply({ embeds: [embed4] });
	},
};
