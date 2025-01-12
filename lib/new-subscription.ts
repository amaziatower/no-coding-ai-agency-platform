import { subscriptionPlans } from '@/config/new-subscription'
import { createServerSupabaseClient } from '@/supabase-server'
import { UserSubscriptionPlan } from '../types'

export async function getUserSubscriptionPlan(
  userId: string,
): Promise<UserSubscriptionPlan> {
  const supabase = createServerSupabaseClient()
  const { data: user } = await supabase
    .from('users')
    .select(
      'stripe_subscription_id, stripe_current_period_end, stripe_customer_id, stripe_price_id',
    )
    .eq('id', userId)
    .single()

  if (!user) {
    throw new Error('User not found')
  }

  const endDate = user.stripe_current_period_end
    ? new Date(user.stripe_current_period_end)
    : null

  const userPlan =
    Object.values(subscriptionPlans).find(
      (plan) => plan.stripe_price_id === user.stripe_price_id,
    ) || subscriptionPlans.starter

  // Determine if the plan is considered 'Pro'
  const isPro =
    userPlan.name === 'Pro' ||
    userPlan.name === 'Unlimited' ||
    userPlan.name === 'Enterprise'

  return {
    ...userPlan,
    ...user,
    stripe_current_period_end: endDate ? endDate.getTime() : null,
    isPro, // Add this property based on the plan
  }
}
