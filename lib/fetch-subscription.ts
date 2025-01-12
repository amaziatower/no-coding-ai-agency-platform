// lib/dataFetchers.ts
import { createClient } from '@/utils/supabase/server'

const supabase = createClient()

// Fetch subscription details
export async function fetchSubscription(userId: string) {
  const { data: subscription, error } = await supabase
    .from('subscriptions')
    .select('*, prices(*, products(*))')
    .in('status', ['trialing', 'active'])
    .eq('user_id', userId)
    .maybeSingle()

  if (error) {
    console.error('Error fetching subscription: ', error)
    return null
  }

  return subscription
}

// Fetch chatbots related to a user
export async function fetchChatbots(userId: string) {
  const { data: bots, error } = await supabase
    .from('chatbots')
    .select('id')
    .eq('user_id', userId)

  if (error) {
    console.error('Error fetching chatbots: ', error)
    return []
  }

  return bots
}
