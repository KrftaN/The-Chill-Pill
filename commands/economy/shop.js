const Discord = require("discord.js");
const items = require("../../jsonFiles/items.json");
const functions = require("../../utility/functions.js");

module.exports = {
	name: "shop",
	aliases: [],
	description: "Epic shop!",
	args: false,
	minArgs: 0,
	cooldown: 1,
	execute(message, args, ) {
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

		let itemName =
			allItemsArr.indexOf(args[0]) !== -1 ? "bruh I wish I could do this better" : undefined; //Checks if the argument includes an item of the list of items.

		if (itemName) {
			itemName = functions.findItemName(args[0]);

			const itemPath = items[itemName];

			const embedItemInfo = new Discord.MessageEmbed()
				.setTitle(`${itemPath.emoji}${itemPath.name}`)
				.setColor("#DC143C")
				.addField(
					"Description:",
					`${itemPath.description}

							**Price:** *${itemPath.price}*
							**Sell:** *${itemPath.sell}*
							**Type:** *${itemPath.type}*
												`
				);
			message.channel.send(embedItemInfo);
		} else {
			let currentPage = !args[0] ? 1 : functions.validType(args[0]) === true ? args[0] : 1;

			let pages = Math.ceil(Object.keys(items).length / 5); //good code must not fix

			if (currentPage > pages) return message.channel.send(`The Farmacy only has ${pages} pages?!`);

			let x = currentPage * 5 - 5;

			//let x = i;
			let lenObj = 0 - 1;
			for (var k in items) if (items.hasOwnProperty(k)) ++lenObj;

			const embedShop = new Discord.MessageEmbed()
				.setTitle("The Farmacy")
				.setColor("#DC143C")
				.setFooter(`Page ${currentPage} - ${pages}`);

			for (let i = x; i < x + 5; i++) {
				let decleration = Object.keys(items)[i];

				if (items[decleration].isHidden === true) {
					break;
				}

				embedShop.addField(
					`  ​${items[decleration].emoji}${items[decleration].name} — ${functions.commafy(
						items[decleration].price
					)} GP`,
					`ID: *${items[decleration].id.join(", ")}* 
							Type: *${items[decleration].type}*`
				);

				if (i >= lenObj) {
					//Very strange bug. There are two phantom fields. Fuck yeah bug do be gone doe
					embedShop.setFooter(`Your items - Page ${currentPage} - ${pages}`);
					return message.channel.send(embedShop);
				}
			}

			embedShop.setFooter(`Your items - Page ${currentPage} - ${pages}`);
			message.channel.send({ embeds: [embedShop] });
		}
	},
};
