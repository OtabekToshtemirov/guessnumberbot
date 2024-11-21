Guess The Number Bot
This project is a simple Telegram bot, built using the Telegraf framework for Node.js. The bot generates a random number between 1 and 10, and users are invited to guess this number.

Features
The bot generates a random number between 1 and 10.
The bot provides hints to the user if their guess is too high or too low.
The bot keeps track of the number of attempts made by the user.

# Telegram Number Guessing Game Bot

A fun and interactive Telegram bot where users can play a number guessing game against the bot.

## Features

- Two-player number guessing game (user vs bot)
- Interactive button-based interface
- Emoji-enhanced user experience
- Optimal bot guessing strategy
- Multi-language support (Uzbek)

## Prerequisites

- Node.js v16.x
- Telegram Bot Token (from [@BotFather](https://t.me/botfather))

## Installation

1. Clone the repository:
```bash
git clone <your-repository-url>
cd guessnumberbot
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file in the root directory:
```env
BOT_TOKEN=your_telegram_bot_token_here
```

## Deployment Steps

1. **Prepare for Production**
   - Make sure all dependencies are listed in `package.json`
   - Ensure `.env` file is properly configured
   - Test the bot locally: `npm start`

2. **Deploy to Server**
   - SSH into your server
   - Install Node.js v16.x
   - Clone the repository
   - Install dependencies: `npm install --production`
   - Set up environment variables
   - Start the bot using PM2:
   ```bash
   npm install -g pm2
   pm2 start index.js --name "guessnumberbot"
   pm2 save
   pm2 startup
   ```

3. **Monitor the Bot**
   ```bash
   pm2 status
   pm2 logs guessnumberbot
   ```

## Development

- Start in development mode: `npm run dev`
- Run tests: `npm test`

## Project Structure

```
guessnumberbot/
├── index.js           # Main bot file
├── game.logic.js      # Game logic
├── __tests__/         # Test files
├── .env              # Environment variables
├── package.json      # Dependencies
└── README.md         # Documentation
```

## Commands

- `/start` - Start new game
- Use number buttons (1-10) to make guesses
- Use response buttons (✅, ⬆️, ⬇️) during bot's turn
- "🎮 Yangi o'yin" to start a new game

## Maintenance

1. **Update Dependencies**
```bash
npm update
```

2. **Monitor Logs**
```bash
pm2 logs guessnumberbot
```

3. **Restart Bot**
```bash
pm2 restart guessnumberbot
```

## Troubleshooting

1. If bot doesn't respond:
   - Check if bot is running: `pm2 status`
   - Check logs: `pm2 logs guessnumberbot`
   - Verify TOKEN in .env file

2. If you get "409 Conflict":
   - Stop all other instances: `pm2 delete all`
   - Restart bot: `pm2 start index.js`

## License

ISC
