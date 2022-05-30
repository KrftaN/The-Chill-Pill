module.exports.registerPlayerEvents = (bot) => {
	const player = bot.player;

	player.on("error", (queue, error) => {
		console.log(`There was a problem with the song queue => ${error.message}`);
	});

	player.on("connectionError", (queue, error) => {
		console.log(`I'm having trouble connecting => ${error.message}`);
	});

	player.on("trackStart", (queue, track) => {
		if (!bot.config.opt.loopMessage && queue.repeatMode !== 0) return;
		queue.metadata.send(
			`🎵 Music started playing: **${track.title}** -> Channel: **${queue.connection.channel.name}** 🎧`
		);
	});

	player.on("trackAdd", (queue, track) => {
		queue.metadata.send(`**${track.title}** added to playlist. ✅`);
	});

	player.on("botDisconnect", (queue) => {
		queue.metadata.send("I got kicked, the whole playlist has been cleared! ❌");
	});

	player.on("channelEmpty", (queue) => {
		queue.metadata.send("I left due to inactivity ❌");
	});

	player.on("queueEnd", (queue) => {
		queue.metadata.send("Queue is finished. ✅");
	});

	return player;
};
