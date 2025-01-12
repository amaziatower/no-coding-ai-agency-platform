import { MainNav } from '@/components/content/main-nav'
import { DocsSidebarNav } from '@/components/sidebar-nav'
import { SiteFooter } from '@/components/site-footer'
import Navigation from '@/components/Navigation'
import { CommandMenu } from '@/components/content/command-menu'
import { unstable_setRequestLocale } from 'next-intl/server'

import { docsConfig as docsConfigEn, docsConfigFr } from '@/config/docs'

interface DocsLayoutProps {
  children: React.ReactNode
  params: {
    locale: string
  }
}

export default function DocsLayout({
  children,
  params: { locale },
}: DocsLayoutProps) {
  unstable_setRequestLocale(locale)

  const docsConfig = locale === 'fr' ? docsConfigFr : docsConfigEn

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-40 w-full border-b bg-background">
        <div className="container flex h-16 items-center space-x-4 sm:justify-between sm:space-x-0">
          <MainNav items={docsConfig.mainNav}>
            <DocsSidebarNav items={docsConfig.sidebarNav} />
          </MainNav>

          <div className="flex flex-1 items-center space-x-4 sm:justify-end">
            <div className="flex-1 sm:grow-0">
              <CommandMenu />
            </div>
            <nav className="flex items-center space-x-4">
              <Navigation />
            </nav>
          </div>
        </div>
      </header>
      <div className="container flex-1">{children}</div>
      <SiteFooter lang={locale} />
    </div>
  )
}
