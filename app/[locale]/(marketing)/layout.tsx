import Link from 'next/link'
import { getTranslations, unstable_setRequestLocale } from 'next-intl/server'
import { MdOutlineKeyboardDoubleArrowUp } from 'react-icons/md'
import { marketingConfig, marketingConfigFr } from '@/config/marketing'
import { cn } from '@/lib/utils'
import Navigation from '@/components/Navigation'
import { MainNav } from '@/components/main-nav'
import { SiteFooter } from '@/components/site-footer'
import { buttonVariants } from '@/components/ui/button'
import { createClient } from '@/utils/supabase/server'
import { UserAccountNav } from '@/components/user-account-nav'
import Script from 'next/script'

interface MarketingLayoutProps {
  children: React.ReactNode
  params: {
    locale: string
  }
}

export default async function MarketingLayout({
  children,
  params: { locale },
}: MarketingLayoutProps) {
  unstable_setRequestLocale(locale)
  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { data: subscription, error } = await supabase
    .from('subscriptions')
    .select('*, prices(*, products(*))')
    .in('status', ['trialing', 'active'])
    .maybeSingle()

  if (error) {
    console.log(error)
  }

  const isSubscribed = subscription !== null

  const t = await getTranslations('IndexPage')

  return (
    <div className="flex size-auto min-h-screen flex-col">
      <header className="container z-40 bg-background">
        <div className="flex h-20 items-center justify-between py-6">
          <MainNav lang={t('lang')} />
          <nav className="ml-10 flex items-center justify-between gap-2">
            <Navigation />
            <Link
              className={cn(
                buttonVariants({ variant: 'secondary', size: 'xl' }),
                'px-7',
              )}
              href={
                user ? (isSubscribed ? '/dashboard' : '/pricing') : '/signin'
              }
            >
              {user
                ? isSubscribed
                  ? t('dashboard')
                  : t('subscribe')
                : t('login')}
            </Link>
            {user && (
              <UserAccountNav
                user={{
                  name: user.user_metadata.full_name,
                  image: user.user_metadata.avatar_url,
                  email: user.email,
                }}
              />
            )}
          </nav>
        </div>
      </header>
      <main className="flex-1">{children}</main>
      <SiteFooter lang={t('lang')} />

    </div>
  )
}
