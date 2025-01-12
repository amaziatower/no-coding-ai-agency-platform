export const dynamic = 'force-dynamic'
export const dynamicParams = true

import { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { getTranslations, unstable_setRequestLocale } from 'next-intl/server'
import { posts as postsRaw, postsFr as postsFrRaw } from '@/.velite'
import { PostItem } from '@/components/post-item'
import { QueryPagination } from '@/components/query-pagination'
import { sortPosts } from '@/lib/utils'

const POSTS_PER_PAGE = 5

interface BlogPageProps {
  params: {
    locale: string
  }
  searchParams: {
    page?: string
  }
}

interface Post {
  slug: string
  slugAsParams: string
  title: string
  description?: string
  date: string
  published: boolean
  image?: string
}

export default async function BlogPage({
  params: { locale },
  searchParams,
}: BlogPageProps) {
  unstable_setRequestLocale(locale)
  const t = await getTranslations('Blog')
  const lang = t('lang')

  const posts: Array<Post> = (lang === 'fr' ? postsFrRaw : postsRaw).map(
    (post) => ({
      ...post,
      slugAsParams: `blog/${post.slug.split('/').slice(2).join('/')}`, // Remove locale part but retain "blog"
    }),
  ) as Array<Post>

  const currentPage = Number(searchParams?.page) || 1
  const sortedPosts = sortPosts(posts.filter((post: Post) => post.published))
  const totalPages = Math.ceil(sortedPosts.length / POSTS_PER_PAGE)

  const displayPosts = sortedPosts.slice(
    POSTS_PER_PAGE * (currentPage - 1),
    POSTS_PER_PAGE * currentPage,
  )

  return (
    <div className="container max-w-4xl py-6 lg:py-10">
      <div className="flex flex-col items-start gap-4 md:flex-row md:justify-between md:gap-8">
        <div className="flex-1 space-y-4">
          <h1 className="inline-block text-4xl font-black lg:text-5xl">
            {t('title')}
          </h1>
          <p className="text-xl text-muted-foreground">{t('description')}</p>
        </div>
      </div>
      <hr className="mt-8" />
      {displayPosts?.length > 0 ? (
        <ul className="flex flex-col">
          {displayPosts.map((post: Post) => {
            const { date, description, image, slugAsParams, title } = post
            return (
              <li key={slugAsParams}>
                <PostItem
                  date={date}
                  description={description}
                  image={image}
                  slug={slugAsParams} // Ensure "blog" part is included here
                  title={title}
                />
              </li>
            )
          })}
        </ul>
      ) : (
        <p>{t('nothing')}</p>
      )}
      <QueryPagination className="mt-4 justify-end" totalPages={totalPages} />
    </div>
  )
}
