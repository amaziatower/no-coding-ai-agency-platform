import Stripe from 'stripe'
import { stripe } from '@/utils/stripe/config'
import {
  upsertProductRecord,
  upsertPriceRecord,
  manageSubscriptionStatusChange,
  deleteProductRecord,
  deletePriceRecord,
} from '@/utils/supabase/admin'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
)

const relevantEvents = new Set([
  'product.created',
  'product.updated',
  'product.deleted',
  'price.created',
  'price.updated',
  'price.deleted',
  'checkout.session.completed',
  'customer.subscription.created',
  'customer.subscription.updated',
  'customer.subscription.deleted',
  'invoice.payment_succeeded', // Added relevant event for subscription renewal
])

export async function POST(req: Request) {
  const body = await req.text()
  const sig = req.headers.get('stripe-signature') as string
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET
  let event: Stripe.Event

  try {
    if (!sig || !webhookSecret)
      return new Response('Webhook secret not found.', { status: 400 })
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret)
    console.log(`🔔  Webhook received: ${event.type}`)
  } catch (err: any) {
    console.log(`❌ Error message: ${err.message}`)
    return new Response(`Webhook Error: ${err.message}`, { status: 400 })
  }

  if (relevantEvents.has(event.type)) {
    try {
      switch (event.type) {
        case 'product.created':
        case 'product.updated':
          await upsertProductRecord(event.data.object as Stripe.Product)
          break
        case 'price.created':
        case 'price.updated':
          await upsertPriceRecord(event.data.object as Stripe.Price)
          break
        case 'price.deleted':
          await deletePriceRecord(event.data.object as Stripe.Price)
          break
        case 'product.deleted':
          await deleteProductRecord(event.data.object as Stripe.Product)
          break
        case 'customer.subscription.created':
        case 'customer.subscription.updated':
        case 'customer.subscription.deleted':
          const subscription = event.data.object as Stripe.Subscription
          await manageSubscriptionStatusChange(
            subscription.id,
            subscription.customer as string,
            event.type === 'customer.subscription.created',
          )
          break
        case 'checkout.session.completed':
          const checkoutSession = event.data.object as Stripe.Checkout.Session
          if (checkoutSession.mode === 'subscription') {
            const subscriptionId = checkoutSession.subscription

            console.log('Managing Subscription Status Change')
            await manageSubscriptionStatusChange(
              subscriptionId as string,
              checkoutSession.customer as string,
              true,
            )
          }
          break
        case 'invoice.payment_succeeded':
          const invoice = event.data.object as Stripe.Invoice

          if (invoice.billing_reason === 'subscription_cycle') {
            const subscriptionId = invoice.subscription
            const customerId = invoice.customer

            // Reset questions_counter for the user associated with the subscription
            const { data, error } = await supabase
              .from('customers')
              .select('id')
              .eq('stripe_customer_id', customerId)
              .single()

            if (error) {
              console.error('Error fetching user:', error)
              return new Response('Internal Server Error', { status: 500 })
            }

            const userId = data.id
            console.log("Renewing subscription cycle for User ID:", userId)

            const { error: resetError } = await supabase
              .from('chatbot')
              .update({ questions_counter: 0 })
              .eq('user_id', userId)

            if (resetError) {
              console.error('Error resetting questions_counter:', resetError)
              return new Response('Internal Server Error', { status: 500 })
            }

            console.log(
              `Successfully reset questions_counter for user ${userId}`,
            )
          }
          break
        default:
          throw new Error('Unhandled relevant event!')
      }
    } catch (error) {
      console.log(error)
      return new Response(
        'Webhook handler failed. View your Next.js function logs.',
        {
          status: 400,
        },
      )
    }
  } else {
    return new Response(`Unsupported event type: ${event.type}`, {
      status: 400,
    })
  }
  return new Response(JSON.stringify({ received: true }))
}
