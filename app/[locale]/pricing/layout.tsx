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
              href={user ? '/dashboard' : '/signin'}
            >
              {user ? t('dashboard') : t('login')}
            </Link>
          </nav>
        </div>
      </header>
      <main className="flex-1">{children}</main>
      <Link
        className="mb-5 mr-5 hidden size-auto w-full flex-row justify-end self-end md:flex"
        href="/"
        style={{
          position: 'fixed',
          bottom: '0',
          right: '0',
        }}
      >
        <div className="flex size-16 items-center justify-center rounded-full bg-ollabot opacity-80 shadow-lg transition-opacity hover:opacity-90">
          <MdOutlineKeyboardDoubleArrowUp className="text-gray/70 text-4xl" />
        </div>
      </Link>
      <SiteFooter lang={t('lang')} />
    </div>
  )
}
