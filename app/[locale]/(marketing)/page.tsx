'use server'
import Link from 'next/link'
import { getTranslations, unstable_setRequestLocale } from 'next-intl/server'
import { cn } from '@/lib/utils'
import { FAQSection } from '@/components/FAQSection'
import { Brands } from '@/components/brands'
import { FeatureSection } from '@/components/feature-section'
import HeaderSection from '@/components/headerSection'
import { HowItWorks } from '@/components/how-it-works'
import Stats from '@/components/stats'
import { buttonVariants } from '@/components/ui/button'
import VideoPlayer from '@/components/video-player'
import { createClient } from '@/utils/supabase/server'
import SupaPricingPage from '@/components/supa-ui/Pricing/PricingPage'
import ChatbotPage from '@/components/chatbot/chatbot'
import Script from 'next/script'

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
      <HeaderSection />

      <section className="space-y-6 pb-8 pt-6 md:pb-12 md:pt-10 lg:py-32">
        <div className="container flex max-w-5xl flex-col items-center gap-4 text-center">
          <h1 className="font-heading sm:text-2xl md:text-3xl lg:text-4xl">
            {t('title')}
          </h1>
          <p className="sm:text-md max-w-3xl font-semibold leading-normal text-muted-foreground sm:leading-8">
            {t('description')}
          </p>
          <VideoPlayer lang={t('lang')} />
        </div>
        <div className="container flex max-w-5xl flex-col items-center gap-4 text-center">
          <div className="space-x-4">
            <h2 className="max-w-[38rem] font-heading text-xl sm:text-2xl md:text-3xl lg:text-4xl">
              {t('sub-description')}
            </h2>
            <div className="mt-8">
              <Link
                className={cn(
                  buttonVariants({ variant: 'secondary', size: 'xxl' }),
                  'px-20',
                )}
                href="/#pricing"
              >
                <h2 className="text-md sm:text-md md:text-lg lg:text-xl">
                  {t('tryit')}
                </h2>
              </Link>
            </div>
          </div>
        </div>
      </section>
      <Stats />
      <FeatureSection />
      <section className="container" id="howitworks">
        <hr className="mx-auto my-8 max-w-[1300px] items-center border-t border-white/50" />
        <h1 className="text-center font-heading text-2xl sm:text-4xl md:text-5xl lg:text-3xl">
          {t('HowItWorks')}
        </h1>
        <HowItWorks />
      </section>
      <Brands />
      <section className="container bg-pricingBackground" id="pricing">
        <SupaPricingPage lang={locale} />
        {/* <PricingPage lang={t('lang')} /> */}
      </section>

      <section className="container py-8 md:py-12 lg:py-24" id="open-source">
        <FAQSection lang={t('lang')} />
        <div className="mx-auto my-10 flex w-4/5 flex-col rounded-lg border-2 bg-secondary p-8 text-center text-footer">
          <h3 className="text-md mb-2 font-semibold sm:text-xl">
            {t('pricing-title')}
          </h3>
          <p className="text-md font-semibold text-footer ">
            {t('pricing-description')}
          </p>
        </div>
      </section>
      {/* <Script
        id="embeddedChatbotConfig"
        strategy="beforeInteractive"
      >
        {`
          window.embeddedChatbotConfig = {
            domain: "https://app.ollabot.com",
            botId: "37d53386-7312-4243-b9a0-6a339e48e893",
          };
        `}
      </Script>
      <Script src="https://app.ollabot.com/scripts/embed.min.js" strategy="afterInteractive" /> */}
      <ChatbotPage
        bgColor="#1f85ea"
        avatarImg="/images/ollabot-small.png"
        botName="Assistant"
        companyLogo="/images/ollabot.png"
        companyName=""
        description="You are Ollabot Assistant. Your primary goal is to use the context provided to you to answer user queries. Always act to politely tell users what to do within the application. All context given to you is a service of Ollabot, no matter which context it is. Use that context to extrapolate between the lines to help the user."
        tone="Informative"
        temperature={0.3}
        lang={locale}
        botId="ollabot-services"
        chatBubbleIcon="Bot"
        watermark={false}
        welcomeMessage=""
      />
    </>
  )
}
