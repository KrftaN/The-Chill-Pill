module.exports = {
	name: "immigrant",
	aliases: ["immigrantgamemode"],
	description: "This is a description",
	args: true,
	cooldown: 1,
	execute(message, args) {
		function shuffleArray(array) {
			for (let i = array.length - 1; i > 0; i--) {
				const j = Math.floor(Math.random() * (i + 1));
				[array[i], array[j]] = [array[j], array[i]];
			}
		}

		let ids = new Array();

		const random = Math.floor(Math.random() * 100 + 1);

		const {
			mentions: { users },
		} = message;

		users.forEach((user) => {
			ids.push(user.id);
		});

		shuffleArray(ids);

		if (random <= 50) {
			bot.users.fetch(ids[0]).then((user) => {
				user.send(
					"You are sus. You are big sussy sussy. You are the imposter, which means that you are meant to sabotage the rest of the immigrants! You can do this by infiltrating the other immagrants and even killing them. **DO NOT DISCLOSE THIS INFORMATION TO ANYONE ELSE**"
				);
			});
		}

		bot.users.fetch(ids[1]).then((user) => {
			user.send("You are the first border patrol member!");
		});
	},
};
