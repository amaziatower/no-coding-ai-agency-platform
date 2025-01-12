import { Calendar } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { Skeleton } from '@/components/ui/skeleton'
import { cn, formatDate } from '@/lib/utils'
import { buttonVariants } from './ui/button'

interface PostItemProps {
  slug: string
  title: string
  description?: string
  date: string
  image?: string // Add image as an optional prop
}

export function PostItem({
  date,
  description,
  image,
  slug,
  title,
}: PostItemProps) {
  return (
    <article className="flex flex-col gap-2 border-b border-border py-3">
      {image && (
        <div className="mb-2">
          <Link href={slug}>
            <Image
              alt={title}
              className="rounded-md" // Add any additional styling as needed
              height={450} // Set your desired height
              src={image}
              width={800} // Set your desired width
            />
          </Link>
        </div>
      )}
      <div>
        <h2 className="text-2xl font-bold">
          <Link href={slug}>{title}</Link>
        </h2>
      </div>
      <div className="max-w-none text-muted-foreground">{description}</div>
      <div className="flex items-center justify-between">
        <dl>
          <dt className="sr-only">Published On</dt>
          <dd className="flex items-center gap-1 text-sm font-medium sm:text-base">
            <Calendar className="size-4" />
            <time dateTime={date}>{formatDate(date)}</time>
          </dd>
        </dl>
        <Link
          className={cn(buttonVariants({ variant: 'link' }), 'py-0')}
          href={slug}
        >
          Read more →
        </Link>
      </div>
    </article>
  )
}

PostItem.Skeleton = function PostItemSkeleton() {
  return (
    <div className="p-4">
      <div className="space-y-3">
        <Skeleton className="h-5 w-2/5" />
        <Skeleton className="h-4 w-4/5" />
      </div>
    </div>
  )
}
