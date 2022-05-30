module.exports.getCharacterCount = (str) => {
	const arrayafy = str.split(" ").join(" ");

	const amountOfLetters = arrayafy.split("").length;

	return amountOfLetters;
};