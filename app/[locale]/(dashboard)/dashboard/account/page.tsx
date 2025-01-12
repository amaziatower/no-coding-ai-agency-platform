import CustomerPortalForm from '@/components/supa-ui/AccountForms/CustomerPortalForm'
import EmailForm from '@/components/supa-ui/AccountForms/EmailForm'
import DeleteAccountForm from '@/components/supa-ui/AccountForms/DeleteForm'
import { createClient } from '@/utils/supabase/server'
import { getTranslations, unstable_setRequestLocale } from 'next-intl/server'
import { redirect } from 'next/navigation'

export default async function Account({ params: { locale } }) {
  unstable_setRequestLocale(locale)

  const tAccountPage = await getTranslations('AccountPage')
  const tCustomerPortalForm = await getTranslations('CustomerPortalForm')
  const tEmailForm = await getTranslations('EmailForm')
  const tDeleteAccountForm = await getTranslations('DeleteAccountForm')

  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { data: userDetails } = await supabase
    .from('users')
    .select('*')
    .single()

  const { data: subscription, error } = await supabase
    .from('subscriptions')
    .select('*, prices(*, products(*))')
    .in('status', ['trialing', 'active'])
    .order('created', { ascending: false })
    .limit(1)
    .maybeSingle()

  if (error) {
    console.log(error)
  }

  if (!user) {
    return redirect('/signin')
  }

  return (
    <section className="mb-32 bg-background">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:pt-24 lg:px-8">
        <div className="sm:align-center sm:flex sm:flex-col">
          <h1 className="text-4xl font-extrabold text-primary sm:text-center sm:text-6xl">
            {tAccountPage('title')}
          </h1>
          <p className="m-auto mt-5 max-w-2xl text-xl text-zinc-500 sm:text-center sm:text-2xl">
            {tAccountPage('description')}
          </p>
        </div>
      </div>
      <div className="p-4">
        <CustomerPortalForm
          subscription={subscription}
          translations={{
            description: tCustomerPortalForm('description'),
            footer: tCustomerPortalForm('footer'),
            title: tCustomerPortalForm('title'),
            manageSubscription: tCustomerPortalForm('manageSubscription'),
            openCustomerPortal: tCustomerPortalForm('openCustomerPortal'),
          }}
        />
        <EmailForm
          userEmail={user.email}
          translations={{
            description: tEmailForm('description'),
            footer: tEmailForm('footer'),
            title: tEmailForm('title'),
            updateEmail: tEmailForm('updateEmail'),
          }}
        />
        <DeleteAccountForm
          userId={user.id}
          translations={{
            description: tDeleteAccountForm('description'),
            footer: tDeleteAccountForm('footer'),
            title: tDeleteAccountForm('title'),
            deleteAccount: tDeleteAccountForm('deleteAccount'),
            typeToConfirm: tDeleteAccountForm('typeToConfirm'),
            errorOccured: tDeleteAccountForm('errorOccured'),
          }}
        />
      </div>
    </section>
  )
}
