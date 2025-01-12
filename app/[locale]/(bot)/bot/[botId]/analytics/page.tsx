// app/[locale]/(bot)/bot/[botId]/analytics/page.tsx
import { headers } from 'next/headers'
import { getTranslations, unstable_setRequestLocale } from 'next-intl/server'
import { createServerSupabaseClient } from '@/supabase-server'
import { z } from 'zod'
import AnalyticsChart from './_components/AnalyticsChart'
import { useTranslations } from 'next-intl'

const analyticsDataSchema = z.object({
  day: z.string(),
  total_questions: z.number(),
})

const getAnalyticsDataResponseSchema = z.array(analyticsDataSchema)

type Props = {
  params: { locale: string }
}

export const revalidate = 0 // Disables caching

export default async function AnalyticsPage({ params: { locale } }: Props) {
  unstable_setRequestLocale(locale)
  const t = await getTranslations('AnalyticsPage')

  const supabase: any = createServerSupabaseClient()
  const headerList = headers()
  const pathname = headerList.get('x-current-path') || ''
  const pathSegments = pathname.split('/')
  const botIndex = pathSegments.indexOf('bot')
  const botId = botIndex !== -1 ? pathSegments[botIndex + 1] : null

  let analyticsData: Array<any> = []

  if (botId) {
    const { data, error } = await supabase.rpc('get_analytics_data', {
      bot_id: botId,
    })

    if (error) {
      console.error('Error fetching analytics data:', error)
    } else {
      try {
        analyticsData = getAnalyticsDataResponseSchema.parse(data)
      } catch (e) {
        console.error('Validation error:', e)
      }
    }
  }

  const translations = {
    title: t('title'),
    description: t('description'),
    questionsAsked: t('questionsAsked'),
    lastUpdated: t('lastUpdated'),
  }

  return <AnalyticsChart data={analyticsData} translations={translations} />
}
