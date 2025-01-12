import Image from 'next/image'
import * as runtime from 'react/jsx-runtime'
import { cn } from '@/lib/utils'
import { Callout } from './callout'

const useMDXComponent = (code: string) => {
  const fn = new Function(code)
  return fn({ ...runtime }).default
}

const components = {
  Image,
  Callout,
}

interface MdxProps {
  code: string
}

export function MDXContent({ code }: MdxProps) {
  const Component = useMDXComponent(code)
  return <Component components={components} />
}
