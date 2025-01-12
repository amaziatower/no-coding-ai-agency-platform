'use client'

import * as React from 'react'
import { useMounted } from '@/hooks/use-mounted'
import { cn } from '@/lib/utils'

interface TOCItem {
  title: string
  url: string
  items?: TOCItem[]
}

interface TocProps {
  toc: TOCItem[]
}

export function DashboardTableOfContents({ toc }: TocProps) {
  const itemIds = React.useMemo(
    () =>
      toc
        ? toc
            .flatMap((item) => [item.url, item?.items?.map((item) => item.url)])
            .flat()
            .filter(Boolean)
            .map((id) => id?.split('#')[1])
        : [],
    [toc],
  )
  const activeHeading = useActiveItem(itemIds)
  const mounted = useMounted()

  if (!toc) {
    return null
  }

  return mounted ? (
    <div className="space-y-2">
      <p className="font-medium">On This Page</p>
      <Tree activeItem={activeHeading} level={1} tree={toc} />
    </div>
  ) : null
}

function useActiveItem(itemIds: Array<string | undefined>) {
  const [activeId, setActiveId] = React.useState<string>('')

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id)
          }
        })
      },
      { rootMargin: `0% 0% -80% 0%` },
    )

    itemIds?.forEach((id) => {
      if (!id) {
        return
      }

      const element = document.getElementById(id)
      if (element) {
        observer.observe(element)
      }
    })

    return () => {
      itemIds?.forEach((id) => {
        if (!id) {
          return
        }

        const element = document.getElementById(id)
        if (element) {
          observer.unobserve(element)
        }
      })
    }
  }, [itemIds])

  return activeId
}

interface TreeProps {
  tree: TOCItem[]
  level?: number
  activeItem?: string | null
}

function Tree({ activeItem, level = 1, tree }: TreeProps) {
  return tree.length > 0 && level < 3 ? (
    <ul className={cn('m-0 list-none', { 'pl-4': level !== 1 })}>
      {tree.map((item, index) => (
        <li key={index} className={cn('mt-0 pt-2')}>
          <a
            className={cn(
              'inline-block no-underline',
              item.url === `#${activeItem}`
                ? 'font-medium text-primary'
                : 'text-sm text-muted-foreground',
            )}
            href={item.url}
          >
            {item.title}
          </a>
          {item.items?.length > 0 ? (
            <Tree activeItem={activeItem} level={level + 1} tree={item.items} />
          ) : null}
        </li>
      ))}
    </ul>
  ) : null
}