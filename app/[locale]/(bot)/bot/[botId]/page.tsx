// app/dashboard/page.tsx
import { BotCreateButton } from '@/components/bot-create-button'
import BotItem from './_components/bot-item'
import { CreateBot } from '@/components/create-bot'
import { EmptyPlaceholder } from '@/components/empty-placeholder'
import { DashboardHeader } from '@/components/header'
import { PostItem } from '@/components/post-item'
import { DashboardShell } from '@/components/shell'
import { createServerSupabaseClient } from '@/supabase-server'
import { getTranslations, unstable_setRequestLocale } from 'next-intl/server'

export const metadata = {
  title: 'Dashboard',
}

type Props = {
  params: { locale: string }
}

export default async function DashboardPage({ params: { locale } }: Props) {
  unstable_setRequestLocale(locale)
  const t = await getTranslations('DashboardPage')
  const tBotItem = await getTranslations('BotItem')

  const translations = {
    heading: t('heading'),
    text: t('text'),
    noBots: t('noBots'),
    noBotsDescription: t('noBotsDescription'),
    botItem: {
      copied: tBotItem('copied'),
      botId: tBotItem('botId'),
      dataSources: tBotItem('dataSources'),
      messages: tBotItem('messages'),
      customize: tBotItem('customize'),
    },
  }

  const supabase = createServerSupabaseClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { data: userDetails } = await supabase
    .from('users')
    .select('*')
    .single()

  const userId = userDetails?.id

  const { data: bots, error } = await supabase
    .from('chatbot')
    .select(
      'id, user_id, botConfig, questions_counter, data_sources_counter, data_sources_limit, questions_limit',
    )
    .eq('user_id', userId)
    .order('id', { ascending: false })

  if (error) {
    console.error('Error fetching chatbots:', error)
    // Optionally handle error in the UI
  }

  return (
    <DashboardShell>
      <DashboardHeader heading={translations.heading} text={translations.text}>
        {/* <BotCreateButton /> */}
      </DashboardHeader>
      <div className="flex flex-wrap items-stretch justify-center divide-y divide-gray-200 rounded-md border border-gray-200">
        {bots?.length ? (
          bots.map((bot) => (
            <BotItem
              key={bot.id}
              bot={bot}
              lang={locale}
              translations={translations.botItem}
            />
          ))
        ) : (
          <EmptyPlaceholder>
            <EmptyPlaceholder.Icon name="post" />
            <EmptyPlaceholder.Title>
              {translations.noBots}
            </EmptyPlaceholder.Title>
            <EmptyPlaceholder.Description>
              {translations.noBotsDescription}
            </EmptyPlaceholder.Description>
            <BotCreateButton variant="outline" />
          </EmptyPlaceholder>
        )}
      </div>
    </DashboardShell>
  )
}
