const items = require("../jsonFiles/items.json");
const Discord = require("discord.js");

module.exports.findItemName = (name) => {
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

function balRemove(amount) {
	data[msgSenderID].bal -= amount;
}

function balAdd(amount) {
	data[msgSenderID].bal += amount;
}

function effectAdd(itemName) {
	effects[itemName]();
}

function useItem(itemName) {
	// Worked first try!

	if (items[itemName].type !== "Consumable") {
		doNotSendMessage = true;
		return message.reply("This is not a consumable item. Like are you dumb or something?");
	}

	if (!inventory[msgSenderID][itemName]) {
		doNotSendMessage = true;
		return message.channel.send("You do not have this item.");
	} else {
		effectAdd(itemName);

		inventory[msgSenderID][itemName] -= 1;
		if (inventory[msgSenderID][itemName] <= 0) {
			delete inventory[msgSenderID][itemName];
		}
	}
}

function buyItem(itemName, price, amount) {
	// Worked first try!
	const totalPrice = price * amount;
	if (items[itemName].isPurchasable === false) {
		doNotSendMessage = true;
		return message.reply("This item is not purchasable!");
	}
	if (totalPrice > data[msgSenderID].bal) {
		doNotSendMessage = true;
		return message.channel.send("You do not have the necessary funds to buy this item!");
	}
	balRemove(totalPrice);
	if (!inventory[msgSenderID][itemName]) {
		inventory[msgSenderID][itemName] = amount;
	} else {
		inventory[msgSenderID][itemName] += +amount;
	}
}

function sellItem(itemName, price, amount) {
	// Worked first try!
	const totalPayback = price * amount;
	if (amount > inventory[msgSenderID][itemName]) {
		doNotSendMessage = true;
		return message.reply(`You don't have that many items!`);
	}

	if (!inventory[msgSenderID][itemName]) {
		doNotSendMessage = true;
		return message.channel.send("You do not have this item.");
	}

	if (items[itemName].isSellable === false) {
		doNotSendMessage = true;
		return message.reply(`You cannot sell this item!`);
	}

	balAdd(totalPayback);

	inventory[msgSenderID][itemName] -= +amount;
	if (inventory[msgSenderID][itemName] <= 0) {
		delete inventory[msgSenderID][itemName];
	}
}

module.exports.validType = (str) => {
	const matches = str.match(/^[0-9]+$/);

	return !matches ? false : true;
};
