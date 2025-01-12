import { redirect } from 'next/navigation'

import { getUser } from '@/app/supabase-server'
import { DashboardHeader } from '@/components/header'
import { DashboardShell } from '@/components/shell'
import { UserNameForm } from '@/components/user-name-form'
import { getTranslations, unstable_setRequestLocale } from 'next-intl/server'
import { ApiKeyForm } from '@/components/supa-ui/AccountForms/ApiKeyForm'
import { createClient } from '@/utils/supabase/server'

export const metadata = {
  title: 'Settings',
  description: 'Manage account and website settings.',
}

export default async function SettingsPage({ params: { locale } }) {
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

  unstable_setRequestLocale(locale)
  const tApiKeyForm = await getTranslations('ApiKeyForm')

  return (
    <DashboardShell>
      <DashboardHeader
        heading="Settings"
        text="Manage account and website settings."
      />
      <div className="grid gap-10">
        {/* <UserNameForm user={{ id: user.id, name: user.full_name || "" }} /> */}
        <ApiKeyForm
          userId={user.id}
          apiKey={userDetails.secret_key}
          translations={{
            description: tApiKeyForm('description'),
            title: tApiKeyForm('title'),
            generateKey: tApiKeyForm('generateKey'),
            deleteKey: tApiKeyForm('deleteKey'),
            keyGenerated: tApiKeyForm('keyGenerated'),
            keyDeleted: tApiKeyForm('keyDeleted'),
            loading: tApiKeyForm('loading'),
          }}
        />
      </div>
    </DashboardShell>
  )
}
