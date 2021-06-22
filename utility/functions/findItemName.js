const items = require("../../jsonFiles/items.json");

module.exports = (name) => {
	let allItemsObj = new Object();
	let allItemsArr = new Array();

	for (const [key] of Object.entries(items)) {
		const {
			[key]: { id },
		} = items;

		allItemsObj[key] = id;

		allItemsArr.push(...id);
	}
	let lenObjItems = Object.keys(allItemsObj).length;

	for (let i = 0; i < lenObjItems + 1; i++) {
		if (Object.values(allItemsObj)[i].indexOf(name) !== -1) {
			return Object.keys(allItemsObj)[i];
		}
	}
};
