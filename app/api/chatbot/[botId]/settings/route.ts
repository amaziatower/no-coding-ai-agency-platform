import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

const defaultBotConfig = {
  botName: 'Assistant',
  companyName: 'Chatbot',
  description: '',
  logoUrl: '',
  chatBubbleIcon: 'MessageCircle',
  bgColor: '#007BFF',
  welcomeMessage: '',
  tone: 'Professional/Academic',
  temperature: 0.7,
}

export async function GET(req, context) {
  const supabase = createRouteHandlerClient({ cookies })
  const { params } = context
  const botId = params.botId

  try {
    // Fetch current botConfig
    const { data, error } = await supabase
      .from('chatbot')
      .select('botConfig')
      .eq('id', botId)
      .single()

    if (error) {
      throw new Error(error.message)
    }

    const botConfig = data?.botConfig ?? defaultBotConfig

    const headers = new Headers({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*', // Allow all origins
      'Access-Control-Allow-Methods': 'GET', // Allow specific methods
    })

    return new Response(JSON.stringify(botConfig), { status: 200, headers })
  } catch (error) {
    console.log('error: ', error.message)
    return new Response(JSON.stringify({ message: error.message }), {
      status: 400,
    })
  }
}
