const {
    generateRandomNumber,
    getBotGuess,
    compareResults,
    initializeGame,
    gameState
} = require('../game.logic');

describe('Number Guessing Game Tests', () => {
    describe('generateRandomNumber', () => {
        test('should generate number between 1 and 10', () => {
            for (let i = 0; i < 100; i++) {
                const num = generateRandomNumber();
                expect(num).toBeGreaterThanOrEqual(1);
                expect(num).toBeLessThanOrEqual(10);
            }
        });
    });

    describe('getBotGuess', () => {
        test('should return middle number between min and max', () => {
            expect(getBotGuess(1, 10)).toBe(5);
            expect(getBotGuess(1, 5)).toBe(3);
            expect(getBotGuess(6, 10)).toBe(8);
        });
    });

    describe('compareResults', () => {
        test('should correctly determine winner when user wins', () => {
            const result = compareResults(2, 3);
            expect(result).toContain('Tabriklayman');
            expect(result).toContain('Siz yutdingiz');
        });

        test('should correctly determine winner when bot wins', () => {
            const result = compareResults(4, 2);
            expect(result).toContain('Men yutdim');
        });

        test('should correctly determine draw', () => {
            const result = compareResults(3, 3);
            expect(result).toContain('Durrang');
        });
    });

    describe('Game State Management', () => {
        test('should initialize new game state correctly', () => {
            const userId = '12345';
            const game = initializeGame(userId);
            
            expect(game).toBeDefined();
            expect(game.userNumber).toBeNull();
            expect(game.botNumber).toBeGreaterThanOrEqual(1);
            expect(game.botNumber).toBeLessThanOrEqual(10);
            expect(game.userAttempts).toBe(0);
            expect(game.botAttempts).toBe(0);
            expect(game.botGuessMin).toBe(1);
            expect(game.botGuessMax).toBe(10);
            expect(game.gamePhase).toBe('userGuessing');
        });

        test('should maintain separate game states for different users', () => {
            const userId1 = '12345';
            const userId2 = '67890';
            
            const game1 = initializeGame(userId1);
            const game2 = initializeGame(userId2);
            
            expect(game1.botNumber).not.toBe(game2.botNumber);
            
            game1.userAttempts = 2;
            expect(game2.userAttempts).toBe(0);
        });
    });

    describe('Bot Guessing Strategy', () => {
        test('should find number in optimal steps', () => {
            const min = 1;
            const max = 10;
            const target = 7;
            
            let steps = 0;
            let currentMin = min;
            let currentMax = max;
            
            while (true) {
                steps++;
                const guess = getBotGuess(currentMin, currentMax);
                
                if (guess === target) break;
                
                if (guess < target) {
                    currentMin = guess + 1;
                } else {
                    currentMax = guess - 1;
                }
                
                // Prevent infinite loop in test
                if (steps > 10) throw new Error('Too many steps');
            }
            
            // For numbers 1-10, should never take more than 4 steps
            expect(steps).toBeLessThanOrEqual(4);
        });
    });
});
