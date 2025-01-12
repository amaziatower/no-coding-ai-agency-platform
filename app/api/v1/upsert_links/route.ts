// app/api/upsert_links.ts
import { NextRequest, NextResponse } from 'next/server'
import axios from 'axios'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { Database } from '@/types_db'

export async function POST(request: NextRequest, context) {
  const supabase = createRouteHandlerClient<Database>({ cookies })

  // Retrieve the user's API key from the Authorization header
  const authHeader = request.headers.get('Authorization')
  const userApiKey = authHeader ? authHeader.split('Bearer ')[1] : null

  if (!userApiKey) {
    console.error('Unauthorized: API key is missing')
    return new NextResponse(
      JSON.stringify({ error: 'Unauthorized: API key is missing' }),
      { status: 401 },
    )
  }

  // Get the botId from the URL parameters
  const { params } = context
  const botId = params.botId

  try {
    // Validate the API key and get the user
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('id')
      .eq('secret_key', userApiKey)
      .single()

    if (userError || !user) {
      console.error('Unauthorized: Invalid API key', userError)
      return new NextResponse(
        JSON.stringify({ error: 'Unauthorized: Invalid API key' }),
        { status: 401 },
      )
    }

    const userId = user.id

    // Fetch the current data_sources_counter and data_sources_limit for the bot
    const { data: botData, error: fetchError } = await supabase
      .from('chatbot')
      .select('data_sources_counter, data_sources_limit')
      .eq('id', botId)
      .eq('user_id', userId) // Ensure the bot belongs to the user
      .single()

    if (fetchError || !botData) {
      console.error('Error fetching bot data or bot not found', fetchError)
      return new NextResponse(
        JSON.stringify({ error: 'Error fetching bot data or bot not found' }),
        { status: 500 },
      )
    }

    const { data_sources_counter, data_sources_limit } = botData

    // Check if the data_sources_counter is less than the data_sources_limit
    if (data_sources_counter >= data_sources_limit) {
      return new NextResponse(
        JSON.stringify({ error: 'Data sources limit reached' }),
        { status: 403 },
      )
    }

    const body = await request.json()

    const upsertBody = {
      ...body, // Spread the original body
      botId: botId, // Add botId to the request body
    }

    const apiUrl = process.env.OLLABOT_SERVER
    const apiKey = process.env.SERVER_API_KEY

    // Make the request to the external API
    const response = await axios.post(`${apiUrl}/upsert_links`, upsertBody, {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
    })

    // Call the RPC function to increment the data_sources_counter
    const { error: rpcError } = await supabase.rpc(
      'increment_data_sources_counter',
      {
        bot_id: botId,
      },
    )

    if (rpcError) {
      console.error('Error updating data_sources_counter:', rpcError)
      return new NextResponse(
        JSON.stringify({ error: 'Error updating data_sources_counter' }),
        { status: 500 },
      )
    }

    return new NextResponse(JSON.stringify(response.data), { status: 200 })
  } catch (error) {
    console.error('Error in scraping and upserting:', error)
    return new NextResponse(
      JSON.stringify({ error: 'Error in scraping and upserting' }),
      { status: 500 },
    )
  }
}
