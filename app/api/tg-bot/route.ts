import { NextApiRequest } from 'next';
import TelegramBot from 'node-telegram-bot-api';
import axios from 'axios';
import FormData from 'form-data'; // Import FormData
import { createClient } from '@supabase/supabase-js';

let bot;

export async function POST(request: Request) {
  const apiKey = process.env.SERVER_API_KEY;
  const apiUrl = process.env.OLLABOT_SERVER;
  const { botToken, isStart } = await request.json();

  console.log(botToken, ":::", isStart);

  // Check if botToken is provided
  if (!botToken) {
    return new Response(JSON.stringify({ message: 'Bot token is required' }), { status: 400 });
  }

  // Initialize the bot if not already initialized
  if (!bot || bot.options.token !== botToken) {
    bot = new TelegramBot(botToken, { polling: true });

    bot.on('message', async (msg) => {
      const chatId = msg.chat.id;
      const userInput = msg.text;

      const data = new FormData();
      data.append('bot_id', chatId.toString()); // Ensure chatId is a string
      data.append('message', userInput);

      console.log("apiUrl", apiUrl, "userInput", userInput, "chatId", chatId);

      try {
        const response = await axios.post(`${apiUrl}/chat`, data, {
          headers: {
            Authorization: `Bearer ${apiKey}`,
            ...data.getHeaders(), // Include FormData headers
          },
        });

        console.log("response ::: ", response.data);

        // Check if the response contains the expected data
        if (response.data && response.data.content) {
          bot.sendMessage(chatId, response.data.content);
        } else {
          bot.sendMessage(chatId, 'Sorry, I did not understand that.');
        }
      } catch (error) {
        console.error('Error while sending message:', error);
        bot.sendMessage(chatId, 'An error occurred while processing your request.');
      }
    });
  }

  return new Response(JSON.stringify({ message: 'Bot started successfully' }), { status: 200 });
}