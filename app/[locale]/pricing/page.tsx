'use server'
import { getTranslations, unstable_setRequestLocale } from 'next-intl/server'
import { createClient } from '@/utils/supabase/server'
import SupaPricingPage from '@/components/supa-ui/Pricing/PricingPage'

type Props = {
  params: { locale: string }
}

export default async function IndexPage({ params: { locale } }: Props) {
  unstable_setRequestLocale(locale)
  const t = await getTranslations('IndexPage')
  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  return (
    <>
      <section className="container bg-pricingBackground" id="pricing">
        <SupaPricingPage lang={locale} />
        {/* <PricingPage lang={t('lang')} /> */}
      </section>
    </>
  )
}
