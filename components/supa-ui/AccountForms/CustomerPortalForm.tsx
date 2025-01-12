'use client'

import Button from '@/components/supa-ui/Button'
import { useRouter, usePathname } from 'next/navigation'
import { useState } from 'react'
import Link from 'next/link'
import Card from '@/components/supa-ui/Card'
import { Tables } from '@/types_db'
import { createStripePortal } from '@/utils/stripe/server'

type Subscription = Tables<'subscriptions'>
type Price = Tables<'prices'>
type Product = Tables<'products'>

type SubscriptionWithPriceAndProduct = Subscription & {
  prices:
    | (Price & {
        products: Product | null
      })
    | null
}

interface Props {
  subscription: SubscriptionWithPriceAndProduct | null
  translations: {
    description: string
    footer: string
    title: string
    manageSubscription: string
    openCustomerPortal: string
  }
}

export default function CustomerPortalForm({
  subscription,
  translations,
}: Props) {
  const router = useRouter()
  const currentPath = usePathname()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const subscriptionPrice =
    subscription &&
    new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: subscription?.prices?.currency!,
      minimumFractionDigits: 0,
    }).format((subscription?.prices?.unit_amount || 0) / 100)

  const handleStripePortalRequest = async () => {
    setIsSubmitting(true)
    const redirectUrl = await createStripePortal(currentPath)
    setIsSubmitting(false)
    return router.push(redirectUrl)
  }

  return (
    <Card
      description={
        subscription
          ? `${translations.description} ${subscription?.prices?.products?.name} plan.`
          : translations.description
      }
      footer={
        <div className="flex flex-col items-start justify-between sm:flex-row sm:items-center">
          <p className="pb-4 text-white sm:pb-0">
            {translations.manageSubscription}
          </p>
          <Button
            loading={isSubmitting}
            onClick={handleStripePortalRequest}
            variant="slim"
          >
            {translations.openCustomerPortal}
          </Button>
        </div>
      }
      title={translations.title}
    >
      <div className="mb-4 mt-8 text-xl font-semibold">
        {subscription ? (
          `${subscriptionPrice}/${subscription?.prices?.interval}`
        ) : (
          <Link href="/#pricing">{translations.footer}</Link>
        )}
      </div>
    </Card>
  )
}
