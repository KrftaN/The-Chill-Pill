module.exports.onlyNumbers = (str) => {
	return /^[0-9]+$/.test(str);
};