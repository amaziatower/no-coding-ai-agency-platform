import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { Database } from '@/types_db'
import { createClient } from '@supabase/supabase-js'

export async function DELETE(req: Request) {
  const supabase = createRouteHandlerClient<Database>({
    cookies,
  })

  try {
    // Get the user session
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session?.user) {
      console.log('Unauthorized')
      return new Response(JSON.stringify({ message: 'Unauthorized' }), {
        status: 401,
      })
    }
    // Parse the request body to get the chatbot ID
    const { chatbotId } = await req.json()
    console.log('Chatbot ID, ', chatbotId)

    if (!chatbotId) {
      console.log('Chatbot ID not provided')
      return new Response(
        JSON.stringify({ message: 'Chatbot ID not provided' }),
        {
          status: 400,
        },
      )
    }

    // Check if the chatbot belongs to the user
    const { data: chatbot, error: chatbotError } = await supabase
      .from('chatbot')
      .select('id')
      .eq('id', chatbotId)
      .eq('user_id', session.user.id)
      .single()

    if (chatbotError || !chatbot) {
      console.log('Chatbot not found or does not belong to user')
      return new Response(
        JSON.stringify({
          message: 'Chatbot not found or does not belong to user',
        }),
        { status: 404 },
      )
    }

    console.log('Chatbot', chatbot)

    // Delete the chatbot
    const { data: deleteData, error: deleteError } = await supabase
      .from('chatbot')
      .delete()
      .eq('id', chatbotId)

    if (deleteError) {
      console.log('Failed to delete chatbot', deleteError)
      return new Response(
        JSON.stringify({ message: 'Failed to delete chatbot' }),
        { status: 500 },
      )
    }

    console.log('deleteData', deleteData)

    console.log('Chatbot deleted', chatbotId)
    return new Response(
      JSON.stringify({ message: 'Chatbot deleted successfully' }),
      { status: 200 },
    )
  } catch (error) {
    console.log('Server error', error)
    return new Response(
      JSON.stringify({ message: 'Server error', details: error.toString() }),
      { status: 500 },
    )
  }
}
