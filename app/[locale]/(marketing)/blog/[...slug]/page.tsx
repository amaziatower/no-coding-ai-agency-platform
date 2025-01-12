export const dynamic = 'force-dynamic'
export const dynamicParams = true

import { notFound } from 'next/navigation'
import { getTranslations, unstable_setRequestLocale } from 'next-intl/server'
import { posts as rawPosts, postsFr as rawPostsFr } from '@/.velite'
import { MDXContent } from '@/components/mdx-components'
import '@/styles/mdx.css'
import { siteConfig } from '@/config/site'

interface PostPageProps {
  params: {
    slug: Array<string>
    locale?: string
  }
}

interface Post {
  slug?: string
  title: string
  description?: string
  date: string
  published: boolean
  image?: string
  body: string
  slugAsParams?: string
}

const posts: Array<Post> = rawPosts.map((post) => ({
  ...post,
  slugAsParams: post.slug.split('/').slice(2).join('/'), // Remove locale part
})) as Array<Post>

const postsFr: Array<Post> = rawPostsFr.map((post) => ({
  ...post,
  slugAsParams: post.slug.split('/').slice(2).join('/'), // Remove locale part
})) as Array<Post>

async function getPostFromParams(
  params: PostPageProps['params'],
): Promise<Post | undefined> {
  const locale = params?.locale || 'en'
  const slug = params.slug.join('/')
  const postList = locale === 'fr' ? postsFr : posts
  return postList.find((post) => post.slugAsParams === slug) as Post | undefined
}

export async function generateStaticParams(): Promise<
  Array<PostPageProps['params']>
> {
  return [
    ...posts.map((post) => ({ slug: post.slugAsParams.split('/') })),
    ...postsFr.map((post) => ({ slug: post.slugAsParams.split('/') })),
  ]
}

export default async function PostPage({ params }: PostPageProps) {
  const { locale, slug } = params
  if (!slug || slug.length === 0) {
    notFound()
    return null
  }

  unstable_setRequestLocale(locale)
  const t = await getTranslations('Blog')

  // Adjust the slug to match the modified slugs in posts and postsFr
  const cleanSlug = slug.join('/')
  const post = await getPostFromParams({ slug: cleanSlug.split('/'), locale })

  if (!post || !post.published) {
    notFound()
    return null
  }

  return (
    <article className="container prose mx-auto max-w-3xl py-6 dark:prose-invert">
      <h1 className="mb-2">{post.title}</h1>
      {post.description ? (
        <p className="mt-0 text-xl text-muted-foreground">{post.description}</p>
      ) : null}
      <hr className="my-4" />
      <MDXContent code={post.body} />
    </article>
  )
}
