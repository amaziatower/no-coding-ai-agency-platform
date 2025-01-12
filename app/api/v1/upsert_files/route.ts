// app/api/upsert_files.ts
import axios from 'axios'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

export async function POST(request: Request, context) {
  const { params } = context
  const botId = params.botId

  const supabase = createRouteHandlerClient({ cookies })

  const formData = new FormData()

  // Assume files are sent as a Blob or similar object; you'll need to adapt based on your client-side implementation
  const files = await request.formData()
  for (const file of files.getAll('files')) {
    formData.append('files', file)
  }
  formData.append('botId', botId)

  // Extract API key from Authorization header
  const authHeader = request.headers.get('Authorization')
  const userApiKey = authHeader ? authHeader.split('Bearer ')[1] : null

  if (!userApiKey) {
    console.error('Unauthorized: API key is missing')
    return new Response(
      JSON.stringify({ error: 'Unauthorized: API key is missing' }),
      { status: 401 },
    )
  }

  // Validate the API key
  const { data: user, error: userError } = await supabase
    .from('users')
    .select('id')
    .eq('secret_key', userApiKey)
    .single()

  if (userError || !user) {
    console.error('Unauthorized: Invalid API key', userError)
    return new Response(
      JSON.stringify({ error: 'Unauthorized: Invalid API key' }),
      { status: 401 },
    )
  }
  const userId = user.id

  try {
    // Fetch the current data_sources_counter and data_sources_limit for the bot
    const { data: botData, error: fetchError } = await supabase
      .from('chatbot')
      .select('data_sources_counter, data_sources_limit')
      .eq('id', botId)
      .eq('user_id', userId) // Ensure the bot belongs to the user
      .single()

    if (fetchError || !botData) {
      console.error('Error fetching bot data or bot not found', fetchError)
      return new Response(
        JSON.stringify({ error: 'Error fetching bot data or bot not found' }),
        { status: 500 },
      )
    }

    const { data_sources_counter, data_sources_limit } = botData

    // Check if the data_sources_counter is less than the data_sources_limit
    if (data_sources_counter >= data_sources_limit) {
      return new Response(
        JSON.stringify({ error: 'Data sources limit reached' }),
        { status: 403 },
      )
    }

    const apiUrl = process.env.OLLABOT_SERVER
    const apiKey = process.env.SERVER_API_KEY

    const response = await axios.post(`${apiUrl}/upsert_docs`, formData, {
      headers: {
        Authorization: `Bearer ${apiKey}`,
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
      return new Response(
        JSON.stringify({ error: 'Error updating data_sources_counter' }),
        { status: 500 },
      )
    }

    return new Response(JSON.stringify(response.data), { status: 200 })
  } catch (error) {
    console.error('Error in upserting documents:', error)
    return new Response(
      JSON.stringify({ error: 'Error in upserting documents' }),
      { status: 500 },
    )
  }
}
