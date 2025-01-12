'use client'
import Image from 'next/image'
import Link from 'next/link'
import { useSelectedLayoutSegment } from 'next/navigation'
import { useTheme } from 'next-themes'
import * as React from 'react'
import { marketingConfig, marketingConfigFr } from '@/config/marketing'
import { cn } from '@/lib/utils'
import { Icons } from '@/components/icons'
import { MobileNav } from '@/components/mobile-nav'
import { ModeToggle } from '@/components/mode-toggle'
import { MainNavItem } from '../types'

interface MainNavProps {
  items?: Array<MainNavItem>
  children?: React.ReactNode
}

export function MainNav(
  { lang }: { lang: string },
  {
    children,
    items = lang === 'en' ? marketingConfig.mainNav : marketingConfigFr.mainNav,
  }: MainNavProps,
) {
  const segment = useSelectedLayoutSegment()
  const [showMobileMenu, setShowMobileMenu] = React.useState<boolean>(false)
  const { setTheme, theme } = useTheme()
  return (
    <div className="flex items-center gap-6 md:gap-10 ">
      <div className="flex items-center">
        <Link
          className="hidden size-full items-start space-x-2 md:flex"
          href="/"
        >
          <Image
            alt="Logo"
            className="size-1/2"
            height={137} // Replace 100 with the desired height value
            src="/images/ollabot.png"
            width={250} // Replace 100 with the desired width value
          />
        </Link>
      </div>
      {items?.length ? (
        <nav className="hidden gap-6 md:flex ">
          {items?.map((item, index) => (
            <Link
              key={index}
              className={cn(
                'sm:text-md flex w-full items-center whitespace-nowrap text-lg font-bold transition-colors hover:text-primary/70',
                item.href.startsWith(`/${segment}`)
                  ? 'text-primary/60'
                  : 'text-primary',
                item.disabled && 'cursor-not-allowed opacity-80',
              )}
              href={item.disabled ? '#' : item.href}
            >
              {item.title}
            </Link>
          ))}
          <ModeToggle />
        </nav>
      ) : null}

      <button
        className="flex items-center space-x-2 md:hidden"
        onClick={() => setShowMobileMenu(!showMobileMenu)}
      >
        {showMobileMenu ? (
          <Icons.close />
        ) : (
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
        )}
        <span className="font-bold">Menu</span>
      </button>
      {showMobileMenu && items && (
        <MobileNav items={items}>{children}</MobileNav>
      )}
    </div>
  )
}
