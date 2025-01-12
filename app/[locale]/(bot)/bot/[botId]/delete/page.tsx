// app/delete-chatbot/page.tsx
import { createServerSupabaseClient } from '@/supabase-server'
import { getTranslations, unstable_setRequestLocale } from 'next-intl/server'
import DeleteChatbotForm from '@/components/DeleteChatbotForm'

export const metadata = {
  title: 'Delete Chatbot',
}

type Props = {
  params: { locale: string }
}

export default async function DeleteChatbotPage({ params: { locale } }: Props) {
  unstable_setRequestLocale(locale)
  const t = await getTranslations('DeleteChatbotPage')
  const translations = {
    description: t('description'),
    footer: t('footer'),
    title: t('title'),
    deleteChatbot: t('deleteChatbot'),
    typeToConfirm: t('typeToConfirm'),
    errorOccured: t('errorOccured'),
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

  return <DeleteChatbotForm userId={userId} translations={translations} />
}
