const gameState = new Map();

function generateRandomNumber() {
    return Math.floor(Math.random() * 10) + 1;
}

function getBotGuess(min, max) {
    return Math.floor((min + max) / 2);
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

module.exports = {
    generateRandomNumber,
    getBotGuess,
    compareResults,
    initializeGame,
    gameState
};
