import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { Database } from '@/types_db'

export async function POST(req: Request) {
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

    // Retrieve user's subscription details
    const { data: subscription, error: subscriptionError } = await supabase
      .from('subscriptions')
      .select('price_id, questions_limit, data_sources_limit')
      .eq('user_id', session.user.id)
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
    const data_sources_limit = subscription.data_sources_limit

    console.log('Questions Limit', questionLimit)
    // Check the user's chatbot creation limit
    const { data: userChatbots, error: userChatbotsError } = await supabase
      .from('chatbot')
      .select('id', { count: 'exact' })
      .eq('user_id', session.user.id)

    if (userChatbotsError) {
      console.log("Failed to fetch user's chatbots")
      return new Response(
        JSON.stringify({ message: "Failed to fetch user's chatbots" }),
        { status: 500 },
      )
    }

    if (userChatbots?.length >= 1) {
      // Assuming 1 chatbot per user based on chatbot_limit in the users table
      console.log('Chatbot creation limit reached')
      return new Response(
        JSON.stringify({ message: 'Chatbot creation limit reached' }),
        { status: 403 },
      )
    }

    // Insert a new chatbot with default settings and the question limit
    const { data: newChatbot, error: insertError } = await supabase
      .from('chatbot')
      .insert([
        {
          user_id: session.user.id,
          questions_limit: questionLimit,
          data_sources_limit: data_sources_limit,
        },
      ])
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
