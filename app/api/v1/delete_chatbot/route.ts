import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { Database } from '@/types_db'

export async function DELETE(req: Request) {
  const supabase = createRouteHandlerClient<Database>({ cookies })

  try {
    // Extract the API key from the Authorization header
    const apiKey = req.headers.get('Authorization')?.split('Bearer ')[1]
    if (!apiKey) {
      console.log('Unauthorized: Missing API key')
      return new Response(
        JSON.stringify({ message: 'Unauthorized: Missing API key' }),
        { status: 401 },
      )
    }

    const { chatbot_id } = await req.json()

    // Get the user by secret key
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('id')
      .eq('secret_key', apiKey)
      .single()

    if (userError || !user) {
      console.log('Unauthorized: Invalid secret key')
      return new Response(
        JSON.stringify({ message: 'Unauthorized: Invalid secret key' }),
        { status: 401 },
      )
    }

    const userId = user.id

    // Check if the chatbot exists and belongs to the user
    const { data: chatbot, error: chatbotError } = await supabase
      .from('chatbot')
      .select('id')
      .eq('id', chatbot_id)
      .eq('user_id', userId)
      .single()

    if (chatbotError || !chatbot) {
      console.log('Chatbot not found or does not belong to the user')
      return new Response(
        JSON.stringify({
          message: 'Chatbot not found or does not belong to the user',
        }),
        { status: 404 },
      )
    }

    // Delete the chatbot
    const { error: deleteError } = await supabase
      .from('chatbot')
      .delete()
      .eq('id', chatbot_id)

    if (deleteError) {
      console.log('Failed to delete chatbot', deleteError)
      return new Response(
        JSON.stringify({ message: 'Failed to delete chatbot' }),
        { status: 500 },
      )
    }

    console.log('Chatbot deleted successfully')
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
