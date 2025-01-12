import { useTranslations } from 'next-intl'
import * as React from 'react'
import LocaleSwitcher from './LocaleSwitcher'

export default function LocaleNav() {
  const t = useTranslations('Navigation')

  return (
    <div className="flex items-center p-1">
      <LocaleSwitcher />
    </div>
  )
}
