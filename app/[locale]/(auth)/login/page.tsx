import { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { Icons } from '@/components/icons'
import { buttonVariants } from '@/components/ui/button'
import UserAuthForm from '@/components/user-auth-form'
import { cn } from '@/lib/utils'
import { getAuthUser } from '@/supabase-server'

export const metadata: Metadata = {
  title: 'Login',
  description: 'Login to your account',
}

export default async function LoginPage() {
  const user = await getAuthUser()
  console.log('User:', user)

  if (user) {
    redirect('/dashboard')
  }

  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <Link
        className={cn(
          buttonVariants({ variant: 'ghost' }),
          'absolute left-4 top-4 md:left-8 md:top-8',
        )}
        href="/"
      >
        <>
          <Icons.chevronLeft className="mr-2 size-4" />
          Back
        </>
      </Link>
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-center">
          <div className="mx-auto size-10">
            <Image
              alt="Ollabot"
              height={350}
              src="/images/ollabot-small.png"
              width={350}
            />
          </div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Welcome back
          </h1>
        </div>
        <UserAuthForm />
      </div>
    </div>
  )
}
