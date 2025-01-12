// app/integrations/page.tsx
import { getTranslations, unstable_setRequestLocale } from 'next-intl/server'
import IntegrationsPageClient from './_components/integrations'

type Props = {
  params: { locale: string }
}

export default async function IntegrationsPage({ params: { locale } }: Props) {
  unstable_setRequestLocale(locale)
  const t = await getTranslations('IntegrationsPage')

  const translations = {
    searchPlaceholder: t('searchPlaceholder'),
    viewButton: t('viewButton'),
    integrations: [
      {
        name: t('bubble.name'),
        description: t('bubble.description'),
        logo: '/images/logo/bubble.png',
        link: '/docs/integrations/bubble',
      },
      {
        name: t('framer.name'),
        description: t('framer.description'),
        logo: '/images/logo/framer.png',
        link: '/docs/integrations/framer',
      },
      {
        name: t('shopify.name'),
        description: t('shopify.description'),
        logo: '/images/logo/shopify.png',
        link: '/docs/integrations/shopify',
      },
      {
        name: t('webflow.name'),
        description: t('webflow.description'),
        logo: '/images/logo/webflow.png',
        link: '/docs/integrations/webflow',
      },
      {
        name: t('weebly.name'),
        description: t('weebly.description'),
        logo: '/images/logo/weebly.png',
        link: '/docs/integrations/weebly',
      },
      {
        name: t('wix.name'),
        description: t('wix.description'),
        logo: '/images/logo/wix.png',
        link: '/docs/integrations/wix',
      },
      {
        name: t('wordpress.name'),
        description: t('wordpress.description'),
        logo: '/images/logo/wordpress.png',
        link: '/docs/integrations/wordpress',
      },
    ],
  }

  return <IntegrationsPageClient translations={translations} />
}
