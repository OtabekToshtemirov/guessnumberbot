Guess The Number Bot
This project is a simple Telegram bot, built using the Telegraf framework for Node.js. The bot generates a random number between 1 and 10, and users are invited to guess this number.

Features
The bot generates a random number between 1 and 10.
The bot provides hints to the user if their guess is too high or too low.
The bot keeps track of the number of attempts made by the user.
Installation
Clone this repository.
Run npm install to install the necessary dependencies.
Create a .env file in the root directory of the project, and add your bot token like so: BOT_TOKEN=your_bot_token_here.
Run node index.js to start the bot.
Usage
Start a chat with the bot on Telegram.
The bot will greet you and ask you to guess a number between 1 and 10.
Enter your guess into the chat.
The bot will tell you if your guess is too high or too low.
Keep guessing until you find the correct number!
Dependencies
Telegraf: Modern Telegram bot framework for Node.js.
dotenv: Zero-dependency module that loads environment variables from a .env file into process.env.
Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

License
MIT
