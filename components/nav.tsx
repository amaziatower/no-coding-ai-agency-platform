'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Icons } from '@/components/icons'
import { cn } from '@/lib/utils'
import { SidebarNavItem } from '../types'
import { Tables } from '@/types_db'

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
}

// Update your DashboardNavProps type to make subscription optional
interface DashboardNavProps {
  items: Array<SidebarNavItem>
  subscription?: SubscriptionWithPriceAndProduct | null
}

export function DashboardSidebar({ items, subscription }: DashboardNavProps) {
  const isActiveSubscription =
    subscription && ['trialing', 'active'].includes(subscription.status)
  const pathname = usePathname()
  const botIdMatch = pathname.match(/\/bot\/([^/]+)/)
  const botId = botIdMatch ? botIdMatch[1] : null

  if (!items?.length) {
    return null
  }

  return (
    <nav className="grid items-start gap-2">
      {items.map((item, index) => {
        const Icon = Icons[item.icon || 'arrowRight']
        // Check both item.disabled and subscription status
        const isDisabled =
          (item.requiresActiveSubscription && !isActiveSubscription) ||
          item.disabled

        let href = item.href

        // If the path should dynamically include the bot ID and one is present
        if (botId && !item.href.includes('/dashboard')) {
          href = `/bot/${botId}${item.href.substring(4)}` // Adjust path dynamically
        }

        return (
          <Link key={index} href={!isDisabled ? href : '#'}>
            <span
              className={cn(
                'group flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground',
                item.href === '#' && 'cursor-not-allowed opacity-50',
                isDisabled && 'cursor-not-allowed opacity-50',
              )}
            >
              <Icon className="mr-2 size-4" />
              {item.title}
            </span>
          </Link>
        )
      })}
    </nav>
  )
}
