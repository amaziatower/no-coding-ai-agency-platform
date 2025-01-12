import type { Icon } from 'lucide-react'
import { Icons } from '@/components/icons'
import { User } from './main'

export interface NavItem {
  title: string
  href: string
  external?: boolean
  disabled?: boolean
}

export type MainNavItem = NavItem

export type SidebarNavItem = {
  title: string
  disabled?: boolean
  external?: boolean
  icon?: keyof typeof Icons
  requiresActiveSubscription?: boolean // Optional flag to indicate active subscription requirement
} & (
  | {
      href: string
      items?: never
    }
  | {
      href?: string
      items: Array<NavLink>
    }
)

export type SiteConfig = {
  name: string
  description: string
  url: string
  ogImage: string
  links: {
    twitter: string
    github: string
  }
}

export type DocsConfig = {
  mainNav: Array<MainNavItem>
  sidebarNav: Array<SidebarNavItem>
}

export type IntegrationsConfig = {
  mainNav: Array<MainNavItem>
  sidebarNav: Array<SidebarNavItem>
}

export type MarketingConfig = {
  mainNav: Array<MainNavItem>
}

export type DashboardConfig = {
  locales: {
    en: {
      mainNav: Array<MainNavItem>
      sidebarNav: Array<SidebarNavItem>
      sidebarNavCreateBot: Array<SidebarNavCreateBotItem>
    }
    fr: {
      mainNav: Array<MainNavItem>
      sidebarNav: Array<SidebarNavItem>
      sidebarNavCreateBot: Array<SidebarNavCreateBotItem>
    }
  }
}

export type SubscriptionPlan = {
  name: string
  description: string
  stripe_price_id: string
}

export type UserSubscriptionPlan = SubscriptionPlan &
  Pick<User, 'stripe_customer_id' | 'stripe_subscription_id'> & {
    stripe_current_period_end: number
    isPro: boolean
  }
