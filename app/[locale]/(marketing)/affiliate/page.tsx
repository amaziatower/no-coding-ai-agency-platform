import fs from 'fs/promises'
import path from 'path'
import { compileMDX } from 'next-mdx-remote/rsc'
import { getTranslations, unstable_setRequestLocale } from 'next-intl/server'
import '@/styles/mdx.css'

interface affiliatePageProps {
  params: {
    locale: string
  }
}

interface FrontMatter {
  title: string
  description?: string
}

async function fetchaffiliateContent(locale: string) {
  unstable_setRequestLocale(locale)

  const fileName = locale === 'fr' ? 'affiliate_fr.mdx' : 'affiliate.mdx'
  const filePath = path.join(process.cwd(), 'content', 'affiliate', fileName)
  const fileContents = await fs.readFile(filePath, 'utf8')
  const { frontmatter, content } = await compileMDX<FrontMatter>({
    source: fileContents,
    options: { parseFrontmatter: true },
  })

  return { frontmatter, content }
}

export default async function affiliatePage({
  params: { locale },
}: affiliatePageProps) {
  const { frontmatter, content } = await fetchaffiliateContent(locale)

  return (
    <article className="container prose mx-auto max-w-3xl py-6 dark:prose-invert">
      <h1 className="mb-2">{frontmatter.title}</h1>
      {frontmatter.description ? (
        <p className="mt-0 text-xl text-muted-foreground">
          {frontmatter.description}
        </p>
      ) : null}
      <hr className="my-4" />
      {content}
    </article>
  )
}
