import { toDateTime } from '@/utils/helpers'
import { stripe } from '@/utils/stripe/config'
import { createClient } from '@supabase/supabase-js'
import Stripe from 'stripe'

import type { Database, Tables, TablesInsert } from '@/types_db'

type Product = Tables<'products'>
type Price = Tables<'prices'>
interface LocaleFeatures {
  monthlyPrice: string
  yearlyPrice: string
  features: string[]
}

interface Features {
  locale: {
    en: LocaleFeatures
    fr: LocaleFeatures
  }
}
// Change to control trial period length
const TRIAL_PERIOD_DAYS = 0

// Note: supabaseAdmin uses the SERVICE_ROLE_KEY which you must only use in a secure server-side context
// as it has admin privileges and overwrites RLS policies!
const supabaseAdmin = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || '',
)

const adaptFeaturesToLocaleFeatures = (features: any): Features => {
  if (Array.isArray(features)) {
    // Assuming you need to extract or build `LocaleFeatures` from an array
    // This is just a placeholder logic. Adjust it according to actual data structure.
    const localeFeatures: LocaleFeatures = {
      monthlyPrice: features.find((f) => f.type === 'monthly')?.price || '',
      yearlyPrice: features.find((f) => f.type === 'yearly')?.price || '',
      features: features.map((f) => f.description),
    }
    return {
      locale: {
        en: localeFeatures, // Assuming default to English
        fr: localeFeatures, // You might need separate logic if data is locale-specific
      },
    }
  } else if (features && features.locale) {
    return features // already in the correct format
  } else {
    // Default empty structure if features is neither array nor correct object
    return {
      locale: {
        en: { monthlyPrice: '', yearlyPrice: '', features: [] },
        fr: { monthlyPrice: '', yearlyPrice: '', features: [] },
      },
    }
  }
}

const upsertProductRecord = async (product: Stripe.Product) => {
  const features: Features = adaptFeaturesToLocaleFeatures(product.features)

  const productData: Product = {
    id: product.id,
    active: product.active,
    name: product.name,
    description: product.description ?? null,
    image: product.images?.[0] ?? null,
    metadata: product.metadata,
    features: features ?? null,
    data_sources_limit: null,
    questions_limit: null,
  }

  const { error: upsertError } = await supabaseAdmin
    .from('products')
    .upsert([productData])
  if (upsertError)
    throw new Error(`Product insert/update failed: ${upsertError.message}`)
  console.log(`Product inserted/updated: ${product.id}`)
}

const upsertPriceRecord = async (
  price: Stripe.Price,
  retryCount = 0,
  maxRetries = 3,
) => {
  const priceData: Price = {
    id: price.id,
    product_id: typeof price.product === 'string' ? price.product : '',
    active: price.active,
    currency: price.currency,
    type: price.type,
    unit_amount: price.unit_amount ?? null,
    interval: price.recurring?.interval ?? null,
    interval_count: price.recurring?.interval_count ?? null,
    trial_period_days: price.recurring?.trial_period_days ?? TRIAL_PERIOD_DAYS,
    description: null,
    metadata: null,
  }

  const { error: upsertError } = await supabaseAdmin
    .from('prices')
    .upsert([priceData])

  if (upsertError?.message.includes('foreign key constraint')) {
    if (retryCount < maxRetries) {
      console.log(`Retry attempt ${retryCount + 1} for price ID: ${price.id}`)
      await new Promise((resolve) => setTimeout(resolve, 2000))
      await upsertPriceRecord(price, retryCount + 1, maxRetries)
    } else {
      throw new Error(
        `Price insert/update failed after ${maxRetries} retries: ${upsertError.message}`,
      )
    }
  } else if (upsertError) {
    throw new Error(`Price insert/update failed: ${upsertError.message}`)
  } else {
    console.log(`Price inserted/updated: ${price.id}`)
  }
}

const deleteProductRecord = async (product: Stripe.Product) => {
  const { error: deletionError } = await supabaseAdmin
    .from('products')
    .delete()
    .eq('id', product.id)
  if (deletionError)
    throw new Error(`Product deletion failed: ${deletionError.message}`)
  console.log(`Product deleted: ${product.id}`)
}

const deletePriceRecord = async (price: Stripe.Price) => {
  const { error: deletionError } = await supabaseAdmin
    .from('prices')
    .delete()
    .eq('id', price.id)
  if (deletionError)
    throw new Error(`Price deletion failed: ${deletionError.message}`)
  console.log(`Price deleted: ${price.id}`)
}

const upsertCustomerToSupabase = async (uuid: string, customerId: string) => {
  const { data, error: upsertError } = await supabaseAdmin
    .from('customers')
    .upsert([{ id: uuid, stripe_customer_id: customerId }])
  console.log('Upserting customer to supabase', data)

  if (upsertError)
    throw new Error(
      `Supabase customer record creation failed: ${upsertError.message}`,
    )

  return customerId
}

const createCustomerInStripe = async (uuid: string, email: string) => {
  const customerData = { metadata: { supabaseUUID: uuid }, email }
  const newCustomer = await stripe.customers.create(customerData)
  if (!newCustomer) throw new Error('Stripe customer creation failed.')

  return newCustomer.id
}

const createOrRetrieveCustomer = async ({
  email,
  uuid,
}: {
  email: string
  uuid: string
}) => {
  // Check if the customer already exists in Supabase
  const { data: existingSupabaseCustomer, error: queryError } =
    await supabaseAdmin
      .from('customers')
      .select('*')
      .eq('id', uuid)
      .maybeSingle()

  if (queryError) {
    throw new Error(`Supabase customer lookup failed: ${queryError.message}`)
  }

  // Retrieve the Stripe customer ID using the Supabase customer ID, with email fallback
  let stripeCustomerId: string | undefined
  if (existingSupabaseCustomer?.stripe_customer_id) {
    const existingStripeCustomer = await stripe.customers.retrieve(
      existingSupabaseCustomer.stripe_customer_id,
    )
    stripeCustomerId = existingStripeCustomer.id
  } else {
    // If Stripe ID is missing from Supabase, try to retrieve Stripe customer ID by email
    const stripeCustomers = await stripe.customers.list({ email })
    stripeCustomerId =
      stripeCustomers.data.length > 0 ? stripeCustomers.data[0].id : undefined
  }

  // If still no stripeCustomerId, create a new customer in Stripe
  const stripeIdToInsert = stripeCustomerId
    ? stripeCustomerId
    : await createCustomerInStripe(uuid, email)
  if (!stripeIdToInsert) throw new Error('Stripe customer creation failed.')

  if (existingSupabaseCustomer && stripeCustomerId) {
    // If Supabase has a record but doesn't match Stripe, update Supabase record
    if (existingSupabaseCustomer.stripe_customer_id !== stripeCustomerId) {
      const { error: updateError } = await supabaseAdmin
        .from('customers')
        .update({ stripe_customer_id: stripeCustomerId })
        .eq('id', uuid)

      if (updateError)
        throw new Error(
          `Supabase customer record update failed: ${updateError.message}`,
        )
      console.warn(
        `Supabase customer record mismatched Stripe ID. Supabase record updated.`,
      )
    }
    // If Supabase has a record and matches Stripe, return Stripe customer ID
    return stripeCustomerId
  } else {
    console.warn(
      `Supabase customer record was missing. A new record was created.`,
    )

    console.log('No supabase record')
    console.log('UUID', uuid)
    console.log('stripe id', stripeIdToInsert)

    // If Supabase has no record, create a new record and return Stripe customer ID
    const upsertedStripeCustomer = await upsertCustomerToSupabase(
      uuid,
      stripeIdToInsert,
    )
    if (!upsertedStripeCustomer)
      throw new Error('Supabase customer record creation failed.')

    return upsertedStripeCustomer
  }
}

/**
 * Copies the billing details from the payment method to the customer object.
 */
const copyBillingDetailsToCustomer = async (
  uuid: string,
  payment_method: Stripe.PaymentMethod,
) => {
  // Todo: check this assertion
  const customer = payment_method.customer as string
  const { address, name, phone } = payment_method.billing_details
  if (!name || !phone || !address) return
  // @ts-ignore
  await stripe.customers.update(customer, { name, phone, address })
  const { error: updateError } = await supabaseAdmin
    .from('users')
    .update({
      billing_address: { ...address },
      payment_method: { ...payment_method[payment_method.type] },
    })
    .eq('id', uuid)
  if (updateError)
    throw new Error(`Customer update failed: ${updateError.message}`)
}

const updateChatbotLimit = async (uuid: string) => {
  // This function assumes that after a successful subscription, you want to set the chatbot limit to 1.
  const { data, error } = await supabaseAdmin
    .from('users')
    .update({ chatbot_limit: 1 }) // Assuming the initial limit needs to be set to 1.
    .eq('id', uuid)

  if (error) {
    console.error(`Error updating chatbot limit for user ${uuid}:`, error)
    throw new Error(`Failed to update chatbot limit: ${error.message}`)
  }

  console.log(`Chatbot limit updated successfully for user ${uuid}`)
}

const manageSubscriptionStatusChange = async (
  subscriptionId: string,
  customerId: string,
  createAction = false,
) => {
  // Get customer's UUID from mapping table.
  const { data: customerData, error: noCustomerError } = await supabaseAdmin
    .from('customers')
    .select('id')
    .eq('stripe_customer_id', customerId)
    .single()

  if (noCustomerError)
    throw new Error(`Customer lookup failed: ${noCustomerError.message}`)

  const { id: uuid } = customerData!

  const subscription = await stripe.subscriptions.retrieve(subscriptionId, {
    expand: ['default_payment_method'],
  })

  console.log('Supposed Product ID', subscription.items.data[0].price.product)

  // Fetch data_sources_limit and questions_limit from the products table
  const { data: productData, error: productError } = await supabaseAdmin
    .from('products')
    .select('data_sources_limit, questions_limit')
    .eq('id', subscription.items.data[0].price.product)
    .single()

  if (productError) {
    console.error('Error fetching product data:', productError)
    throw new Error(`Product lookup failed: ${productError.message}`)
  }

  const { data_sources_limit, questions_limit } = productData

  console.log('Data Sources Limit', data_sources_limit)
  console.log('Questions Limit', questions_limit)

  // Upsert the latest status of the subscription object.
  const subscriptionData: TablesInsert<'subscriptions'> = {
    id: subscription.id,
    user_id: uuid,
    metadata: subscription.metadata,
    status: subscription.status,
    price_id: subscription.items.data[0].price.id,
    // TODO check quantity on subscription
    // @ts-ignore
    quantity: subscription.quantity,
    cancel_at_period_end: subscription.cancel_at_period_end,
    cancel_at: subscription.cancel_at
      ? toDateTime(subscription.cancel_at).toISOString()
      : null,
    canceled_at: subscription.canceled_at
      ? toDateTime(subscription.canceled_at).toISOString()
      : null,
    current_period_start: toDateTime(
      subscription.current_period_start,
    ).toISOString(),
    current_period_end: toDateTime(
      subscription.current_period_end,
    ).toISOString(),
    created: toDateTime(subscription.created).toISOString(),
    ended_at: subscription.ended_at
      ? toDateTime(subscription.ended_at).toISOString()
      : null,
    trial_start: subscription.trial_start
      ? toDateTime(subscription.trial_start).toISOString()
      : null,
    trial_end: subscription.trial_end
      ? toDateTime(subscription.trial_end).toISOString()
      : null,
    data_sources_limit: data_sources_limit,
    questions_limit: questions_limit,
  }

  const { error: upsertError } = await supabaseAdmin
    .from('subscriptions')
    .upsert([subscriptionData])
  if (upsertError)
    throw new Error(`Subscription insert/update failed: ${upsertError.message}`)
  console.log(
    `Inserted/updated subscription [${subscription.id}] for user [${uuid}]`,
  )

  const { data, error } = await supabaseAdmin.storage.createBucket(
    `users/${uuid}`,
    {
      public: true,
      allowedMimeTypes: ['image/*'],
      fileSizeLimit: '2MB',
    },
  )

  if (error)
    console.log(
      `Creation of Bucket for user [${uuid}] failed. Please create bucket manually.`,
    )
  await updateChatbotLimit(uuid) // Call the chatbot limit update function with the UUID.

  // For a new subscription copy the billing details to the customer object.
  // NOTE: This is a costly operation and should happen at the very end.
  if (createAction && subscription.default_payment_method && uuid)
    // @ts-ignore
    await copyBillingDetailsToCustomer(
      uuid,
      subscription.default_payment_method as Stripe.PaymentMethod,
    )
  if (createAction && subscription.default_payment_method && uuid) {
    await updateChatbotLimit(uuid) // Call the chatbot limit update function with the UUID.
    // @ts-ignore
    await copyBillingDetailsToCustomer(
      uuid,
      subscription.default_payment_method as Stripe.PaymentMethod,
    )
    console.log(
      `Chatbot limit updated and billing details copied for customer [${customerId}] with UUID [${uuid}].`,
    )
  }
}

export {
  upsertProductRecord,
  upsertPriceRecord,
  deleteProductRecord,
  deletePriceRecord,
  createOrRetrieveCustomer,
  manageSubscriptionStatusChange,
}
