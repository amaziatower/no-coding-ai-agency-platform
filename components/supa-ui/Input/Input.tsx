import React, { InputHTMLAttributes, ChangeEvent } from 'react'
import { cn } from '@/lib/utils'

import s from './Input.module.css'

interface Props extends Omit<InputHTMLAttributes<any>, 'onChange'> {
  className?: string
  onChange(value: string): void
}
const Input = (props: Props) => {
  const { children, className, onChange, ...rest } = props

  const rootClassName = cn(s.root, {}, className)

  const handleOnChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (onChange) {
      onChange(e.target.value)
    }
    return null
  }

  return (
    <label>
      <input
        autoCapitalize="off"
        autoComplete="off"
        autoCorrect="off"
        className={rootClassName}
        onChange={handleOnChange}
        spellCheck="false"
        {...rest}
      />
    </label>
  )
}

export default Input
