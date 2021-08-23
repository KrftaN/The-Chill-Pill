const Discord = ({ Client, Intents } = require("discord.js"));
const intents = new Discord.Intents(32767);
const bot = new Client({ intents });

const puppeteer = require("puppeteer");

module.exports = {
	name: "log",
	aliases: ["logmonster", "log"],
	description: "This is a description",
	creator: true,
	args: false,
	maxArgs: 1,
	cooldown: 1,
	async execute(message, args) {
		const browser = await puppeteer.launch({ headless: false });
		const page = await browser.newPage();
		await page.setViewport({ width: 1100, height: 768 });
		await page.goto("https://www.dndbeyond.com/");

		await page.waitForSelector(".js-strip-link");
		await page.click(".js-strip-link");

		/* await page.waitForSelector("#login-link");
		await page.click("#login-link"); */

		await browser.close();
	},
};
