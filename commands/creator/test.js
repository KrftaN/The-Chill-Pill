//const data = reactionRoleInformation();
module.exports.test = () => {
	cache.push("test");
};

module.exports = {
	name: "test",
	aliases: ["t"],
	description: "testing!",
	creator: true,
	args: false,
	execute(message, args, bot) {
		const dataBase = [{ foo: "bar" }];
		global.cache = global.cache || dataBase;

		console.log(cache);
	},
};
