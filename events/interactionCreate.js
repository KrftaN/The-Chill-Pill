const Discord = require("discord.js");

module.exports = {
	name: "interactionCreate",
	async execute(interaction, bot) {
		if (!interaction.isCommand()) return;
		const { commandName } = interaction;

		const slashCommand = bot.slashCommands.get(commandName);

		if (!slashCommand) return;

		if (slashCommand.permissions) {
			const authorPerms = interaction.channel.permissionsFor(interaction.user);
			if (!authorPerms || !authorPerms.has(slashCommand.permissions)) {
				if (interaction.user.id !== "344834268742156298") {
					return interaction.reply({
						content: "YOU DO NOT HAVE PERMISSION (git gud scrub)",
						ephemeral: true,
					});
				}
			}
		}

		if (slashCommand.voiceChannel === true) {
			if (!interaction.member.voice.channel)
				return interaction.reply({
					content: `You are not connected to an audio channel. ❌`,
					ephemeral: true,
				});
			if (
				interaction.guild.me.voice.channel &&
				interaction.member.voice.channel.id !== interaction.guild.me.voice.channel.id
			)
				return interaction.reply({
					content: `You are not on the same audio channel as me. ❌`,
					ephemeral: true,
				});
		}

		if (slashCommand.creator === true && interaction.user.id !== "344834268742156298")
			return interaction.reply({
				content: "Wait what, you are not creator man, you cannot use the slashCommand!!!!!",
				ephemeral: true,
			});

		const { cooldowns } = bot;

		if (!cooldowns.has(slashCommand.name)) {
			cooldowns.set(slashCommand.name, new Discord.Collection());
		}

		const now = Date.now();
		const timestamps = cooldowns.get(slashCommand.name);
		const cooldownAmount = (slashCommand.cooldown ?? 1) * 1000;

		if (timestamps.has(interaction.user.id)) {
			const expirationTime = timestamps.get(interaction.user.id) + cooldownAmount;

			if (now < expirationTime) {
				const timeLeft = (expirationTime - now) / 1000;
				return interaction.reply({
					content: `please wait ${timeLeft.toFixed(1)} more second(s) before reusing the \`${
						slashCommand.name
					}\` command.`,
					ephemeral: true,
				});
			}
		}

		timestamps.set(interaction.user.id, now);
		setTimeout(() => timestamps.delete(interaction.user.id), cooldownAmount);

		try {
			await slashCommand.execute(interaction, bot);
		} catch (error) {
			console.error(error);
			await interaction.reply({
				content: "There was an error while executing this slashCommand!",
				ephemeral: true,
			});
		}
	},
};
