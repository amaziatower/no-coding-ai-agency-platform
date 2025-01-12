import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { Database } from '@/types_db'

export async function POST(req: Request) {
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

    // Get the user by secret key
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('id, chatbot_limit')
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

    // Retrieve user's subscription details
    const { data: subscription, error: subscriptionError } = await supabase
      .from('subscriptions')
      .select('price_id, questions_limit')
      .eq('user_id', userId)
      .single()

    if (subscriptionError || !subscription) {
      console.log('Subscription not found')
      return new Response(
        JSON.stringify({ message: 'Subscription not found' }),
        { status: 404 },
      )
    }

    console.log('Subscription data', subscription)

    const questionLimit = subscription.questions_limit

    // Check the user's chatbot creation limit
    const { data: userChatbots, error: userChatbotsError } = await supabase
      .from('chatbot')
      .select('id', { count: 'exact' })
      .eq('user_id', userId)

    if (userChatbotsError) {
      console.log("Failed to fetch user's chatbots")
      return new Response(
        JSON.stringify({ message: "Failed to fetch user's chatbots" }),
        { status: 500 },
      )
    }

    if (userChatbots?.length >= user.chatbot_limit) {
      console.log('Chatbot creation limit reached')
      return new Response(
        JSON.stringify({ message: 'Chatbot creation limit reached' }),
        { status: 403 },
      )
    }

    // Insert a new chatbot with default settings and the question limit
    const { data: newChatbot, error: insertError } = await supabase
      .from('chatbot')
      .insert([{ user_id: userId, questions_limit: questionLimit }])
      .select('id') // Request to return the 'id' of the newly created chatbot

    if (insertError) {
      console.log('Failed to create chatbot', insertError)
      return new Response(
        JSON.stringify({ message: 'Failed to create chatbot' }),
        { status: 500 },
      )
    }

    console.log('New chatbot created', newChatbot)
    return new Response(JSON.stringify(newChatbot), { status: 201 })
  } catch (error) {
    console.log('Server error', error)
    return new Response(
      JSON.stringify({ message: 'Server error', details: error.toString() }),
      { status: 500 },
    )
  }
}
