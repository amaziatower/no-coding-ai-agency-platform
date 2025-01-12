import { NextApiRequest } from 'next';
import TelegramBot from 'node-telegram-bot-api';

let bot;

export async function POST(req: Request, res) {
  const { botToken } = await req.json()
  console.log(botToken)

  if (!botToken) {
    return new Response(JSON.stringify({ message: 'Bot token is required' }));
  }

  // Initialize the bot if not already initialized
  if (!bot || bot.options.token !== botToken) {
    bot = new TelegramBot(botToken, { polling: true });

    bot.on('message', (msg) => {
      const chatId = msg.chat.id;
      console.log
      bot.sendMessage(chatId, 'Hello! I am your bot.');
    });
  }

  return new Response(JSON.stringify({ message: 'Bot started successfully' }));
}
