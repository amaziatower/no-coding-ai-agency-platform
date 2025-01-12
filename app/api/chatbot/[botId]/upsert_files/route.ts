// app/api/upsert_docs.ts
import axios from 'axios'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

export async function POST(request: Request, context) {
  const apiKey = process.env.SERVER_API_KEY
  const apiUrl = process.env.OLLABOT_SERVER
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
  formData.append('use_metadata', 'true')

  try {
    // Fetch the current data_sources_counter and data_sources_limit for the bot
    const { data: botData, error: fetchError } = await supabase
      .from('chatbot')
      .select('data_sources_counter, data_sources_limit')
      .eq('id', botId)
      .single()

    if (fetchError) {
      console.error('Error fetching bot data:', fetchError)
      return new Response(
        JSON.stringify({ error: 'Error fetching bot data' }),
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

    const response = await axios.post(`${apiUrl}/upsert_docs`, formData, {
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
    })

    // const response = await axios.post(`${apiUrl}/start_task`, formData, {
    //   headers: {
    //     Authorization: `Bearer ${apiKey}`,
    //     'Content-Type': 'multipart/form-data',
    //   },
    // });

    console.log("response", response.data);

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


