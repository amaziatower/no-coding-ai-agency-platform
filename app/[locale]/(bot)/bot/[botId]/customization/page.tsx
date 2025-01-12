import { redirect } from 'next/navigation'
import { getTranslations, unstable_setRequestLocale } from 'next-intl/server'
import { DashboardHeader } from '@/components/header'
import { DashboardShell } from '@/components/shell'
import { getUser, createServerSupabaseClient } from '@/supabase-server'
import SettingsForm from './_components/settingsForm'
import { headers } from 'next/headers'

export const metadata = {
  title: 'Settings',
  description: 'Manage account and website settings.',
}

type Props = {
  params: { locale: string }
}

export default async function SettingsPage({ params: { locale } }: Props) {
  unstable_setRequestLocale(locale)
  const t = await getTranslations('SettingsPage')
  const user = await getUser()

  if (!user) {
    redirect('/login')
  }

  // Use the x-current-path header to get the current path
  const headerList = headers()
  const pathname = headerList.get('x-current-path') || ''

  const pathSegments = pathname.split('/')
  const botIndex = pathSegments.indexOf('bot')
  const botId = botIndex !== -1 ? pathSegments[botIndex + 1] : null

  const supabase = createServerSupabaseClient()

  const { data: userDetails } = await supabase
    .from('users')
    .select('*')
    .single()

  const userId = userDetails?.id

  const { data: bots, error } = await supabase
    .from('chatbot') // Ensuring we use the correct table name
    .select('questions_limit, botConfig') // Fetch botConfig
    .eq('user_id', userId)
    .single()

  if (error) {
    console.error('Error fetching questions_limit:', error)
    // Optionally handle error in the UI
  }

  const allowWatermarkRemove = bots?.questions_limit >= 7000

  const translations = {
    heading: t('heading'),
    text: t('text'),
    lang: t('lang'),
    saveChanges: t('saveChanges'),
    savingChanges: t('savingChanges'),
    reset: t('reset'),
    botNameLabel: t('botNameLabel'),
    botNamePlaceholder: t('botNamePlaceholder'),
    companyNameLabel: t('companyNameLabel'),
    companyNamePlaceholder: t('companyNamePlaceholder'),
    descriptionLabel: t('descriptionLabel'),
    descriptionPlaceholder: t('descriptionPlaceholder'),
    toneLabel: t('toneLabel'),
    tonePlaceholder: t('tonePlaceholder'),
    temperatureLabel: t('temperatureLabel'),
    temperaturePlaceholder: t('temperaturePlaceholder'),
    companyLogoLabel: t('companyLogoLabel'),
    botAvatarLabel: t('botAvatarLabel'),
    chatBubbleIconLabel: t('chatBubbleIconLabel'),
    bgColorLabel: t('bgColorLabel'),
    welcomeMessageLabel: t('welcomeMessageLabel'),
    includeWatermarkLabel: t('includeWatermarkLabel'),
    forUnlimitedUsersOnly: t('forUnlimitedUsersOnly'),
    errorFetchingData: t('errorFetchingData'),
    settingsUpdating: t('settingsUpdating'),
    settingsUpdatedSuccessfully: t('settingsUpdatedSuccessfully'),
    errorUpdatingSettings: t('errorUpdatingSettings'),
    cancel: t('cancel'),
    optional: t('optional'),
    editChatbotSettings: t('editChatbotSettings'),
    tooltip: t('tooltip'),
    settingsResetSuccessfully: t('settingsResetSuccessfully'),
    errorResettingSettings: t('errorResettingSettings'),
    resetConfirmationTitle: t('resetConfirmationTitle'),
    resetConfirmationDescription: t('resetConfirmationDescription'),
    typeToConfirm: t('typeToConfirm'),
    confirmReset: t('confirmReset'),
    resetting: t('resetting'),
    errorResetConfirmation: t('errorResetConfirmation'),
  }
  const botConfig = bots?.botConfig || {}

  console.log("BG COLOR", botConfig.bgColor);

  return (
    <DashboardShell>
      <DashboardHeader
        heading={translations.heading}
        text={translations.text}
      />
      <SettingsForm
        lang={translations.lang}
        userId={user.id}
        allowWatermarkRemove={allowWatermarkRemove}
        translations={translations}
        initialConfig={botConfig}
      />
    </DashboardShell>
  )
}
