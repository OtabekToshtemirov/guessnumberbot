const { Telegraf } = require('telegraf');
const { gameState, generateRandomNumber, getBotGuess, compareResults, initializeGame } = require('../game.logic');

// Initialize bot
const bot = new Telegraf(process.env.BOT_TOKEN);

// Webhook handler
module.exports = async (request, response) => {
    try {
        // Register bot commands and middleware
        bot.command('start', async (ctx) => {
            const userId = ctx.from.id.toString();
            initializeGame(userId);
            const game = gameState.get(userId);
            
            await ctx.reply(
                "🎮 Raqamni topish o'yiniga xush kelibsiz!\n\n" +
                "Men 1 dan 10 gacha bo'lgan raqamni o'yladim.\n" +
                "Uni topishga harakat qiling! 🎯",
                {
                    reply_markup: {
                        keyboard: [
                            ['1', '2', '3', '4', '5'],
                            ['6', '7', '8', '9', '10']
                        ],
                        resize_keyboard: true
                    }
                }
            );
        });

        // Handle number inputs
        bot.hears(/^([1-9]|10)$/, async (ctx) => {
            const userId = ctx.from.id.toString();
            let game = gameState.get(userId);
            
            if (!game) {
                game = initializeGame(userId);
            }

            if (game.gamePhase === 'userGuessing') {
                const userGuess = parseInt(ctx.match[1]);
                game.userAttempts++;

                if (userGuess === game.botNumber) {
                    game.gamePhase = 'botGuessing';
                    await ctx.reply(
                        "🎉 Tabriklayman! Siz to'g'ri topdingiz!\n\n" +
                        "Endi siz 1 dan 10 gacha son o'ylang,\n" +
                        "men topishga harakat qilaman! 🤖\n\n" +
                        "O'ylagan soningizni menga ayting:",
                        {
                            reply_markup: {
                                keyboard: [
                                    ['1', '2', '3', '4', '5'],
                                    ['6', '7', '8', '9', '10']
                                ],
                                resize_keyboard: true
                            }
                        }
                    );
                } else {
                    const hint = userGuess < game.botNumber ? "⬆️ Kattaroq son" : "⬇️ Kichikroq son";
                    await ctx.reply(hint);
                }
            }
        });

        // Process webhook update
        if (request.method === 'POST') {
            const { body } = request;
            await bot.handleUpdate(body);
            response.status(200).json({ ok: true });
        } else {
            response.status(200).json({ ok: true });
        }
    } catch (error) {
        console.error('Error in webhook handler:', error);
        response.status(500).json({ ok: false, error: error.message });
    }
};
