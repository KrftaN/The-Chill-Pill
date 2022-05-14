const Discord = require("discord.js");

module.exports.getCharacterCount = (str) => {
	const arrayafy = str.split(" ").join(" ");

	const amountOfLetters = arrayafy.split("").length;

	return amountOfLetters;
};

module.exports.onlyNumbers = (str) => {
	return /^[0-9]+$/.test(str);
};

module.exports.commafy = (num) => {
	//I have no idea how any of this code fucking works
	let str = num.toString().split(".");
	if (str[0].length >= 5) {
		str[0] = str[0].replace(/(\d)(?=(\d{3})+$)/g, "$1,");
	}
	if (str[1] && str[1].length >= 5) {
		str[1] = str[1].replace(/(\d{3})/g, "$1 ");
	}
	return str.join(".");
};

module.exports.embedify = (str) => {
	const embed = new Discord.MessageEmbed().setDescription(str).setColor("DC143C");

	return embed;
};

module.exports.validType = (str) => {
	const matches = str.match(/^[0-9]+$/);

	return !matches ? false : true;
};
