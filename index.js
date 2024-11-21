const {Telegraf, Markup} = require("telegraf");
require('dotenv').config();

const bot = new Telegraf(process.env.BOT_TOKEN);

let gameState = new Map();

function generateRandomNumber() {
    return Math.floor(Math.random() * 10) + 1;
}

function createNumberKeyboard() {
    return Markup.keyboard([
        ['1', '2', '3'],
        ['4', '5', '6'],
        ['7', '8', '9'],
        ['10'],
        ['🎮 Yangi o\'yin']
    ]).resize();
}

function createResponseKeyboard() {
    return Markup.keyboard([
        ['✅ To\'g\'ri'],
        ['⬆️ Katta', '⬇️ Kichik'],
        ['🎮 Yangi o\'yin']
    ]).resize();
}

function createReadyKeyboard() {
    return Markup.keyboard([
        ['✅ Tayyor'],
        ['🎮 Yangi o\'yin']
    ]).resize();
}

function initializeGame(userId) {
    gameState.set(userId, {
        userNumber: null,
        botNumber: generateRandomNumber(),
        userAttempts: 0,
        botAttempts: 0,
        botGuessMin: 1,
        botGuessMax: 10,
        gamePhase: 'userGuessing'
    });
    return gameState.get(userId);
}

function getBotGuess(min, max) {
    return Math.floor((min + max) / 2);
}

bot.command('start', async (ctx) => {
    const userId = ctx.from.id;
    const game = initializeGame(userId);
    
    const greeting = ctx.from.first_name
        ? `Salom ${ctx.from.first_name}! 🎮\nKeling son topish o'yinini o'ynaymiz!\n\nMen 1 dan 10 gacha son o'yladim, topishga harakat qiling!`
        : `Salom! 🎮\nKeling son topish o'yinini o'ynaymiz!\n\nMen 1 dan 10 gacha son o'yladim, topishga harakat qiling!`;

    await ctx.reply(greeting, createNumberKeyboard());
});

bot.hears('🎮 Yangi o\'yin', async (ctx) => {
    const userId = ctx.from.id;
    const game = initializeGame(userId);
    await ctx.reply('Yangi o\'yin boshlandi! Men 1 dan 10 gacha son o\'yladim, topishga harakat qiling! 🎲', createNumberKeyboard());
});

bot.on('text', async (ctx) => {
    const userId = ctx.from.id;
    const userInput = ctx.message.text;
    
    if (!gameState.has(userId)) {
        const game = initializeGame(userId);
        await ctx.reply('Keling, yangi o\'yinni boshlaymiz! 🎲', createNumberKeyboard());
        return;
    }
    
    const game = gameState.get(userId);
    
    if (game.gamePhase === 'userGuessing') {
        await handleUserGuessing(ctx, game, userInput);
    } else if (game.gamePhase === 'botGuessing') {
        await handleBotGuessing(ctx, game, userInput);
    }
});

async function handleUserGuessing(ctx, game, userInput) {
    if (userInput === '🎮 Yangi o\'yin') return;

    const userGuess = parseInt(userInput);

    if (isNaN(userGuess) || userGuess < 1 || userGuess > 10) {
        await ctx.reply('Iltimos, tugmalardan foydalaning! 1 dan 10 gacha sonlarni tanlang 🎯', createNumberKeyboard());
        return;
    }

    game.userAttempts++;

    if (userGuess > game.botNumber) {
        await ctx.reply('Noto\'g\'ri! Kichikroq son ayting ⬇️', createNumberKeyboard());
    } else if (userGuess < game.botNumber) {
        await ctx.reply('Noto\'g\'ri! Kattaroq son ayting ⬆️', createNumberKeyboard());
    } else {
        game.gamePhase = 'botGuessing';
        await ctx.reply(
            `🎉 Tabriklayman! ${game.userAttempts} ta urinishda topdingiz!\n\nEndi siz 1 dan 10 gacha son o'ylang, men topishga harakat qilaman.\nO'ylab bo'lgach "✅ Tayyor" tugmasini bosing.`,
            createReadyKeyboard()
        );
    }
}

async function handleBotGuessing(ctx, game, userInput) {
    if (userInput === '🎮 Yangi o\'yin') return;

    if (userInput === '✅ Tayyor') {
        const botGuess = getBotGuess(game.botGuessMin, game.botGuessMax);
        game.botAttempts++;
        await ctx.reply(
            `Men ${botGuess} deb o'yladim 🤔\n\nAgar to'g'ri bo'lsa ✅\nKatta bo'lsa ⬆️\nKichik bo'lsa ⬇️ tugmasini bosing`,
            createResponseKeyboard()
        );
        return;
    }

    if (userInput === '✅ To\'g\'ri') {
        const result = compareResults(game.userAttempts, game.botAttempts);
        await ctx.reply(result, createNumberKeyboard());
        initializeGame(ctx.from.id);
        return;
    }

    if (!['⬆️ Katta', '⬇️ Kichik'].includes(userInput)) {
        await ctx.reply('Iltimos, tugmalardan foydalaning! ✅, ⬆️ yoki ⬇️ tugmalarini bosing', createResponseKeyboard());
        return;
    }

    game.botAttempts++;
    const currentGuess = getBotGuess(game.botGuessMin, game.botGuessMax);
    
    if (userInput === '⬆️ Men o\'ylagan son katta') {
        game.botGuessMin = currentGuess + 1;
    } else if (userInput === '⬇️ Men o\'ylagan son kichik') {
        game.botGuessMax = currentGuess - 1;
    }

    if (game.botGuessMin > game.botGuessMax || game.botGuessMin > 10 || game.botGuessMax < 1) {
        await ctx.reply(
            'Siz adashdingiz shekilli! 🤔 Qaytadan o\'ynaymiz.\n\nYangi o\'yin boshlash uchun "🎮 Yangi o\'yin" tugmasini bosing!',
            createNumberKeyboard()
        );
        initializeGame(ctx.from.id);
        return;
    }

    const nextGuess = getBotGuess(game.botGuessMin, game.botGuessMax);
    await ctx.reply(
        `Men ${nextGuess} deb o'yladim 🤔\n\nAgar to'g'ri bo'lsa ✅\n Men o\'ylagan son katta bo\'lsa  ⬆️\nMen o\'ylagan son kichik bo\'lsa ⬇️ tugmasini bosing`,
        createResponseKeyboard()
    );
}

function compareResults(userAttempts, botAttempts) {
    let result = `🎯 O'yin yakunlandi!\n\n`;
    result += `👤 Siz: ${userAttempts} ta urinish\n`;
    result += `🤖 Men: ${botAttempts} ta urinish\n\n`;

    if (userAttempts < botAttempts) {
        result += '🏆 Tabriklayman! Siz yutdingiz!';
    } else if (botAttempts < userAttempts) {
        result += '🎖 Men yutdim!';
    } else {
        result += '🤝 Durrang!';
    }

    result += '\n\nYangi o\'yin boshlash uchun "🎮 Yangi o\'yin" tugmasini bosing!';
    return result;
}

bot.catch((err, ctx) => {
    console.error(`Bot xatosi yuz berdi: ${err}`);
    ctx.reply(
        'Xatolik yuz berdi. Iltimos, "🎮 Yangi o\'yin" tugmasini bosib, qaytadan urinib ko\'ring.',
        createNumberKeyboard()
    ).catch(console.error);
});

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));

bot.launch().then(() => console.log('Bot ishga tushdi 🚀'));
