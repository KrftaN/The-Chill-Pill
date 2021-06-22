module.exports = {
	name: "test1",
	aliases: ["tes1", "1"],
	description: "This is a description",
	args: false,
	execute(message, args) {
		let config = new Array();
		const configQuestions = [
			"What do you want the description to be?",
			"What campaign are you playing?",
			"Who is the DM?",
			"What is the whereabout of the session?",
		];
		let i = 0;
		message.author.send(configQuestions[i]).then((m) => {
			var collector = m.channel.createMessageCollector(
				(me) => me.author.id === message.author.id && me.channel === m.channel,
				{ max: configQuestions.length - 1, time: 120 * 1000 }
			);
			collector.on("collect", (collected) => {
				if (collected.content === "end") return collector.stop();
				//basically if you want to stop all the prompts and do nothing
				i += 1;
				config.push(collected.content);


				return collected.channel.send(configQuestions[i]); //next prompt
			});
			collector.on("end", (collected) => {
				if (collected.size < configQuestions.length) {
					return collected.first().channel.send("Ended early, nothing was done.");
				}
				console.log(config);
			});
		});
	},
};
