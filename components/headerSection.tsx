import Image from 'next/image'
import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { cn } from '@/lib/utils'
import { buttonVariants } from '@/components/ui/button'

function HeaderSection() {
  const t = useTranslations('IndexPage')
  const lang = t('lang')

  return (
    <section className="space-y-6 pb-8 pt-6 md:pb-12 md:pt-10 lg:py-32">
      <div className="max-w-8xl container flex flex-col-reverse items-center justify-between md:flex-row">
        <div className="flex size-full max-w-3xl flex-col justify-around text-left">
          <h1 className="my-7 max-w-xl text-4xl font-bold sm:text-5xl md:text-6xl lg:text-7xl">
            {t('headerTitle')}
          </h1>
          <p className="sm:text-md my-7 max-w-2xl font-semibold leading-normal sm:leading-8">
            {t('headerDescription')}
          </p>
          <Link
            className={cn(
              buttonVariants({ variant: 'secondary' }),
              'max-w-xs p-7',
            )}
            href="/#pricing"
          >
            <h2 className="sm:text-md text-sm font-medium tracking-[-.075em] md:text-lg lg:text-xl">
              {t('headerButton')}
            </h2>
          </Link>
          {/* {lang === 'en' && (
            <Link
              className={cn(
                buttonVariants({variant: 'secondary'}),
                'max-w-xs p-7'
              )}
              href="/#pricing"
            >
              <h2 className="sm:text-md text-sm font-medium tracking-[-.075em] md:text-lg lg:text-xl">
                {t('headerButton')}
              </h2>
            </Link>
          )} */}
        </div>
        <div className="text-uppercase mx-20 flex size-auto max-w-3xl flex-col items-center text-center">
          <Image
            alt="Ollabot"
            height={350}
            src="/images/ollabot-small.png"
            width={350}
          />
          <Image
            alt="Ollabot"
            height={200}
            src="/images/ollabot.png"
            width={400}
          />
          <h1 className="sm:text-md max-w-3xl text-center font-medium tracking-wider md:text-lg lg:text-xl">
            {t('headerSubDescription')}
          </h1>
        </div>
      </div>
    </section>
  )
}

export default HeaderSection
