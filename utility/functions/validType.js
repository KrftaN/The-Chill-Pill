module.exports.validType = (str) => {
	const matches = str.match(/^[0-9]+$/);

	return !matches ? false : true;
};
