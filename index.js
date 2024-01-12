const {Telegraf, Markup} = require("telegraf");
require('dotenv').config();

const bot = new Telegraf(process.env.BOT_TOKEN);

let randomNumber = generateRandomNumber();
let attempt = 0;

function generateRandomNumber() {
    return Math.floor(Math.random() * 10) + 1;
}

bot.start(async (ctx) => {
    const greeting = ctx.from && ctx.from.first_name
        ? `Salom! ${ctx.from.first_name} Men 1 dan 10 gacha son o'yladim. Sonni toping!`
        : "Salom! Men 1 dan 10 gacha son o'yladim. Sonni toping!";

    await ctx.reply(greeting);
});

console.log('Bot is running');

bot.on('text', async (ctx) => {
    let userGuess = parseInt(ctx.message.text);

    if (userGuess > randomNumber) {
        await ctx.reply('Iye buning balandku!');
        attempt++;
    } else if (userGuess < randomNumber) {
        await ctx.reply('Iye buning pastku!');
        attempt++;
    }

    if (attempt >= 3) {
        await ctx.reply('Yeding! Sen 3 ta urinishdan foydalanib bo\'lding' +
            `Men o\'ylagan son ${randomNumber}`, Markup.keyboard([
            ['1', '2', '3'],
            ['4', '5', '6'],
            ['7', '8', '9'],
            ['10']
        ]).resize());
        resetGame(ctx);
    }

    if (userGuess === randomNumber) {
        await ctx.reply('Tavakkal topding!');
        resetGame(ctx);
    }
});

async function resetGame(ctx) {
    await ctx.reply('O\'yin qayta boshlandi. Men yana bir bor 1 dan 10 gacha son o\'yladim. Sonni toping!');
    randomNumber = generateRandomNumber();
    attempt = 0;
}

bot.launch().then(() => console.log('Bot has been started'));
