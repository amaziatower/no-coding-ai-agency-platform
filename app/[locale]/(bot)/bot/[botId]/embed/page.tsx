import { getTranslations, unstable_setRequestLocale } from 'next-intl/server'
import { DashboardShell } from '@/components/shell'
import { DashboardHeader } from '@/components/header'
import EmbedPageClient from './_components/embed'

type Props = {
  params: { locale: string }
}

export default async function EmbedPage({ params: { locale } }: Props) {
  unstable_setRequestLocale(locale)
  const t = await getTranslations('EmbedPage')

  const translations = {
    heading: t('heading'),
    text: t('text'),
    embedScriptTitle: t('embedScriptTitle'),
    embedScriptDescription: t('embedScriptDescription'),
    copied: t('copied'),
    copyScript: t('copyScript'),
    embedIframeTitle: t('embedIframeTitle'),
    embedIframeDescription: t('embedIframeDescription'),
    embedTelegramDescription: t('embedTelegramDescription'),
    start: t("start"),
    embedTelegramPlaceholder: t("embedTelegramPlaceholder"),
    copyIframe: t('copyIframe'),
  }

  return (
    <DashboardShell>
      <DashboardHeader
        heading={translations.heading}
        text={translations.text}
      />
      <EmbedPageClient translations={translations} />
    </DashboardShell>
  )
}
