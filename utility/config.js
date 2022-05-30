module.exports = {
	opt: {
		maxVol: 200,
		loopMessage: false, //Please don't touch otherwise I will kill you
		discordPlayer: {
			ytdlOptions: {
				quality: "highestaudio", //Please don't touch or I'll touch your baby
				highWaterMark: 1 << 25, //Please don't touch otherwise you'll die
				filter: "audioonly",
			},
		},
	},
};
