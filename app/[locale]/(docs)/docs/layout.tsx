import { DocsSidebarNav } from '@/components/sidebar-nav'
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
    <div className="flex-1 md:grid md:grid-cols-[220px_1fr] md:gap-6 lg:grid-cols-[240px_1fr] lg:gap-10">
      <aside className="fixed top-14 z-30 hidden h-[calc(100vh-3.5rem)] w-full shrink-0 overflow-y-auto border-r py-6 pr-2 md:sticky md:block lg:py-10">
        <DocsSidebarNav items={docsConfig.sidebarNav} />
      </aside>
      {children}
    </div>
  )
}
