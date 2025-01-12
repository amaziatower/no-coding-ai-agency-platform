import { useTranslations } from 'next-intl'
import * as React from 'react'
import LocaleSwitcher from './LocaleSwitcher'

export default function Navigation() {
  const t = useTranslations('Navigation')

  return (
    <div className="flex size-auto w-full items-center">
      <LocaleSwitcher />
    </div>
  )
}
