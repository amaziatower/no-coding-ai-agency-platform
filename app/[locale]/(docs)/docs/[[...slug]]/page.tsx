export const dynamic = 'force-dynamic'
export const dynamicParams = true
import { unstable_setRequestLocale } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { docs as rawDocs, docsFr as rawDocsFr } from '@/.velite'

import { Mdx } from '@/components/content/mdx-components'
import { DocsPageHeader } from '@/components/page-header'
import { DocsPager } from '@/components/pager'
import { DashboardTableOfContents } from '@/components/toc'

import '@/styles/mdx.css'
import { Metadata } from 'next'
import { env } from '@/env.mjs'
import { absoluteUrl } from '@/lib/utils'

interface DocPageProps {
  params: {
    slug: string[]
    locale?: string
  }
}

interface Doc {
  slug: string
  slugAsParams: string
  title: string
  description?: string
  toc: any
  body: any
}

const docs: Array<Doc> = rawDocs.map((doc) => ({
  ...doc,
  slugAsParams: doc.slug.split('/').slice(2).join('/'), // Remove locale part
})) as Array<Doc>

const docsFr: Array<Doc> = rawDocsFr.map((doc) => ({
  ...doc,
  slugAsParams: doc.slug.split('/').slice(2).join('/'), // Remove locale part
})) as Array<Doc>

async function getDocFromParams(params: {
  slug: string[]
  locale?: string
}): Promise<Doc | null> {
  const locale = params.locale || 'en'
  const slug = params.slug?.join('/') || ''
  const docList = locale === 'fr' ? docsFr : docs
  const doc = docList.find((doc) => doc.slugAsParams === slug) as
    | Doc
    | undefined
  return doc || null
}

export async function generateMetadata({
  params,
}: DocPageProps): Promise<Metadata> {
  const doc = await getDocFromParams(params)
  if (!doc) {
    return {}
  }

  let baseUrl = env.NEXT_PUBLIC_APP_URL
  if (!baseUrl.startsWith('http://') && !baseUrl.startsWith('https://')) {
    baseUrl = `https://${baseUrl}`
  }
  const ogUrl = new URL(`${baseUrl}/api/og`)
  ogUrl.searchParams.set('heading', doc.description ?? doc.title)
  ogUrl.searchParams.set('type', 'Documentation')
  ogUrl.searchParams.set('mode', 'dark')

  return {
    title: doc.title,
    description: doc.description,
    openGraph: {
      title: doc.title,
      description: doc.description,
      type: 'article',
      url: absoluteUrl(doc.slug),
      images: [
        {
          url: ogUrl.toString(),
          width: 1200,
          height: 630,
          alt: doc.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: doc.title,
      description: doc.description,
      images: [ogUrl.toString()],
    },
  }
}

export async function generateStaticParams(): Promise<
  DocPageProps['params'][]
> {
  const params = [
    ...docs.map((doc) => ({ slug: doc.slugAsParams.split('/'), locale: 'en' })),
    ...docsFr.map((doc) => ({
      slug: doc.slugAsParams.split('/'),
      locale: 'fr',
    })),
  ]
  return params
}

export default async function DocPage({ params }: DocPageProps) {
  const { locale } = params

  unstable_setRequestLocale(locale)
  const doc = await getDocFromParams(params)
  if (!doc) {
    notFound()
    return null
  }

  return (
    <main className="relative py-6 lg:gap-10 lg:py-10 xl:grid xl:grid-cols-[1fr_300px]">
      <div className="mx-auto w-full min-w-0">
        <DocsPageHeader heading={doc.title} text={doc.description} />
        <Mdx code={doc.body} />
        <hr className="my-4 md:my-6" />
        <DocsPager doc={doc} />
      </div>
      <div className="hidden text-sm xl:block">
        <div className="sticky top-16 -mt-10 max-h-[calc(var(--vh)-4rem)] overflow-y-auto pt-10">
          <DashboardTableOfContents toc={doc.toc} />
        </div>
      </div>
    </main>
  )
}
