import Image from 'next/image'
import Link from 'next/link'
import { useTheme } from 'next-themes'
import * as React from 'react'
import { cn } from '@/lib/utils'
import { Icons } from '@/components/icons'
import { siteConfig } from '@/config/site'
import { useLockBody } from '@/hooks/use-lock-body'
import { MainNavItem } from '../types'

interface MobileNavProps {
  items: Array<MainNavItem>
  children?: React.ReactNode
}

export function MobileNav({ children, items }: MobileNavProps) {
  useLockBody()
  const { setTheme, theme } = useTheme()

  return (
    <div
      className={cn(
        'fixed inset-0 top-16 z-50 grid h-[calc(100vh-4rem)] grid-flow-row auto-rows-max overflow-auto p-6 pb-32 shadow-md animate-in slide-in-from-bottom-80 md:hidden',
      )}
    >
      <div className="relative z-20 grid gap-6 rounded-md bg-popover p-4 text-popover-foreground shadow-md">
        <Link className="flex size-auto items-center gap-2" href="/">
          <Image
            alt="Logo"
            height={32} // Replace 100 with the desired height value
            src={
              theme === 'dark'
                ? '/images/ollabot-small.png'
                : '/images/ollabot-small.png'
            }
            width={32} // Replace 100 with the desired width value
          />
          <span className="font-bold">BotGenerator</span>
        </Link>
        <nav className="grid grid-flow-row auto-rows-max text-sm">
          {items.map((item, index) => (
            <Link
              key={index}
              className={cn(
                'flex w-full items-center rounded-md p-2 text-sm font-medium hover:underline',
                item.disabled && 'cursor-not-allowed opacity-60',
              )}
              href={item.disabled ? '#' : item.href}
            >
              {item.title}
            </Link>
          ))}
        </nav>
        {children}
      </div>
    </div>
  )
}
