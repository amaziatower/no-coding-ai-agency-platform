'use client'

import clsx from 'clsx'
import { useSelectedLayoutSegment } from 'next/navigation'
import { ComponentProps } from 'react'
import type { AppPathnames } from '../config'
import { Link } from '../navigation'

export default function NavigationLink<Pathname extends AppPathnames>({
  href,
  ...rest
}: ComponentProps<typeof Link<Pathname>>) {
  const selectedLayoutSegment = useSelectedLayoutSegment()
  const pathname = selectedLayoutSegment ? `/${selectedLayoutSegment}` : '/'
  const isActive = pathname === href

  return (
    <Link
      aria-current={isActive ? 'page' : undefined}
      className={clsx(
        'sm:text-md flex w-full items-center whitespace-nowrap text-lg font-bold transition-colors hover:text-primary/70',
        isActive ? 'text-primary/60' : 'text-primary',
      )}
      href={href}
      {...rest}
    />
  )
}
