// app/api/chatbot/[botId]/chat/route.ts
import { NextRequest, NextResponse } from 'next/server'
import axios from 'axios'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { createClient } from '@supabase/supabase-js'

export async function OPTIONS(request: NextRequest) {
  const headers = new Headers({
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  })
  return new Response(null, { headers })
}

export async function POST(request: NextRequest, { params }) {
  const apiKey = process.env.SERVER_API_KEY
  const apiUrl = process.env.OLLABOT_SERVER
  const { botId } = params

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  )

  // const supabase = createRouteHandlerClient({ cookies });

  // Fetch the current questions_counter and questions_limit for the bot
  const { data: botData, error: fetchError } = await supabase
    .from('chatbot')
    .select('questions_counter, questions_limit')
    .eq('id', botId)
    .single()

  if (fetchError) {
    console.error('Error fetching bot data:', fetchError)
    return new NextResponse(
      JSON.stringify({ error: 'Error fetching bot data' }),
      { status: 500 },
    )
  }

  const { questions_counter, questions_limit } = botData

  // Check if the questions_counter is less than the questions_limit
  if (questions_counter >= questions_limit) {
    return new NextResponse(
      JSON.stringify({ error: 'Questions limit reached' }),
      { status: 403 },
    )
  }

  try {
    const formData = await request.formData()
    const message = formData.get('message')
    const description = formData.get('description')
    const file = formData.get('file')
    const company_name = formData.get('company_name')

    const data = new FormData()
    data.append('bot_id', botId)
    data.append('message', message)
    if (description) {
      data.append('description', description)
    }
    if (file) {
      data.append('file', file)
    }
    data.append('company_name', company_name)

    const response = await axios.post(`${apiUrl}/chat`, data, {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'multipart/form-data',
      },
    })

    // const response = { data: { content: 'Hello, how can I help you?' } }

    const { data: rpcData, error: rpcError } = await supabase.rpc(
      'increment_questions_counter',
      {
        chatbot_id: botId,
      },
    )

    if (rpcError) {
      console.error('Error updating questions_counter:', rpcError)
      return new NextResponse(
        JSON.stringify({ error: 'Error updating questions_counter' }),
        { status: 500 },
      )
    }

    const headers = new Headers({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    })

    return new Response(JSON.stringify(response.data), { status: 200, headers })
  } catch (error) {
    console.error('Error sending message:', error)
    return new Response(JSON.stringify({ error: 'Error sending message' }), {
      status: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
    })
  }
}
