import { useTranslations } from 'next-intl'
import React from 'react'

function Stats() {
  const t = useTranslations('IndexPage')

  const statsData = [
    {
      header: '70%',
      paragraph: t('stat1'),
    },
    {
      header: '22%',
      paragraph: t('stat2'),
    },
    {
      header: '2X',
      paragraph: t('stat3'),
    },
    {
      header: '24/7',
      paragraph: t('stat4'),
    },
  ]

  return (
    <section className="flex min-h-20 flex-col items-center justify-between bg-muted p-5">
      <div className="grid text-center lg:mb-0 lg:w-full lg:max-w-5xl lg:grid-cols-4 lg:text-left">
        {statsData.map((data, index) => (
          <div
            key={index}
            className="group rounded-lg border border-transparent px-5 py-4 text-center text-primary-foreground transition-colors hover:border-gray-300 hover:bg-gray-100 hover:text-black hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
          >
            <h2 className="mb-3 text-4xl font-bold">{data.header} </h2>
            <p className="m-0 max-w-[30ch] text-lg font-semibold opacity-50">
              {data.paragraph}
            </p>
          </div>
        ))}
      </div>
    </section>
  )
}

export default Stats
