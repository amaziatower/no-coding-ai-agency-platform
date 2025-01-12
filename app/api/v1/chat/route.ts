import { NextRequest, NextResponse } from 'next/server'
import axios from 'axios'
import { createClient } from '@supabase/supabase-js'
import { Database } from '@/types_db'

export async function OPTIONS(request: NextRequest) {
  const headers = new Headers({
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  })
  return new Response(null, { headers })
}

export async function POST(request: NextRequest, { params }) {
  const { botId } = params
  const supabase = createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  )

  try {
    const formData = await request.formData()
    const message = formData.get('message') as string
    const description = formData.get('description') as string | null
    const file = formData.get('file') as File | null

    // Check API Key
    const apiKey = request.headers.get('Authorization')?.split('Bearer ')[1]
    if (!apiKey) {
      return new NextResponse(
        JSON.stringify({ error: 'Unauthorized: API key missing' }),
        { status: 401 },
      )
    }

    // Validate the user's API key
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('id')
      .eq('secret_key', apiKey)
      .single()

    if (userError || !user) {
      console.error('Unauthorized: Invalid API key', userError)
      return new NextResponse(
        JSON.stringify({ error: 'Unauthorized: Invalid API key' }),
        { status: 401 },
      )
    }

    const userId = user.id

    // Fetch the current questions_counter and questions_limit for the bot
    const { data: botData, error: fetchError } = await supabase
      .from('chatbot')
      .select('questions_counter, questions_limit')
      .eq('id', botId)
      .eq('user_id', userId)
      .single()

    if (fetchError) {
      console.error('Error fetching bot data:', fetchError)
      return new NextResponse(
        JSON.stringify({ error: 'Error fetching bot data' }),
        { status: 500 },
      )
    }

    const { questions_counter, questions_limit } = botData

    console.log('questions_counter:', questions_counter)
    console.log('questions_limit:', questions_limit)

    // Check if the questions_counter is less than the questions_limit
    if (questions_counter >= questions_limit) {
      return new NextResponse(
        JSON.stringify({ error: 'Questions limit reached' }),
        { status: 403 },
      )
    }

    const data = new FormData()
    data.append('bot_id', botId)
    data.append('message', message)
    if (description) {
      data.append('description', description)
    }
    if (file) {
      data.append('file', file)
    }

    // Send the message to the chatbot server using the user's API key
    const response = await axios.post(
      `${process.env.OLLABOT_SERVER}/chat`,
      data,
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'multipart/form-data',
        },
      },
    )

    const { data: rpcData, error: rpcError } = await supabase.rpc(
      'increment_questions_counter',
      { chatbot_id: botId },
    )

    console.log('rpcData:', rpcData)

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
