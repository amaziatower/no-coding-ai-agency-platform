import { redirect } from 'next/navigation'
import { getTranslations, unstable_setRequestLocale } from 'next-intl/server'
import { DashboardSidebar } from '@/components/nav'
import { DashboardNavbar } from '@/components/navbar-dashboard'
import { UserAccountNav } from '@/components/user-account-nav'
import { dashboardConfig } from '@/config/dashboard'
import { createClient } from '@/utils/supabase/server'
import Navigation from '@/components/Navigation'
import { headers } from 'next/headers'

interface DashboardLayoutProps {
  children: React.ReactNode
  params: {
    locale: string
  }
}

export default async function DashboardLayout({
  children,
  params: { locale },
}: DashboardLayoutProps) {
  unstable_setRequestLocale(locale)

  // Use the x-current-path header to get the current path
  const headerList = headers()
  const pathname = headerList.get('x-current-path') || ''

  const pathSegments = pathname.split('/')
  const botIndex = pathSegments.indexOf('bot')
  const botId = botIndex !== -1 ? pathSegments[botIndex + 1] : null

  // Only use dynamic logic if a botId is present in the URL
  const useDynamic =
    botIndex !== -1 &&
    botId &&
    !(pathname.includes('integrations') && pathSegments.includes('docs'))

  const t = await getTranslations('IndexPage')

  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return redirect('/signin')
  }

  const { data: userDetails } = await supabase
    .from('users')
    .select('*')
    .single()

  const { data: subscription, error } = await supabase
    .from('subscriptions')
    .select('*, prices(*, products(*))')
    .in('status', ['trialing', 'active'])
    .maybeSingle()

  if (error) {
    console.log(error)
  }

  if (!subscription) {
    return redirect('/pricing')
  }

  // Select the appropriate sidebar config based on the locale
  const selectedConfig = dashboardConfig.locales[locale]

  // Sidebar config dynamically based on botId
  const dynamicSidebarNav = selectedConfig.sidebarNavCreateBot.map((item) => ({
    ...item,
    href:
      useDynamic && typeof item.href === 'function'
        ? item.href(botId)
        : item.href,
  }))

  return (
    <div className="flex min-h-screen flex-col space-y-6">
      <header className="sticky top-0 z-40 border-b bg-background">
        <nav className="container flex h-20 items-center justify-between py-4">
          <DashboardNavbar lang={t('lang')} />
          <div className="w-25 flex items-center gap-4">
            <Navigation />
            <UserAccountNav
              user={{
                name: user.user_metadata.full_name,
                image: user.user_metadata.avatar_url,
                email: user.email,
              }}
            />
          </div>
        </nav>
      </header>
      <div className="container grid flex-1 gap-12 md:grid-cols-[200px_1fr]">
        <aside className="hidden w-[200px] flex-col md:flex">
          <DashboardSidebar items={dynamicSidebarNav} />
        </aside>
        <main className="flex w-full flex-1 flex-col overflow-hidden">
          {children}
        </main>
      </div>
    </div>
  )
}
