// import Logo from '@/components/icons/Logo';
import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import {
  getAuthTypes,
  getViewTypes,
  getDefaultSignInView,
  getRedirectMethod,
} from '@/utils/auth-helpers/settings'
import Card from '@/components/supa-ui/Card'
import PasswordSignIn from '@/components/supa-ui/AuthForms/PasswordSignIn'
import EmailSignIn from '@/components/supa-ui/AuthForms/EmailSignIn'
import Separator from '@/components/supa-ui/AuthForms/Separator'
import OauthSignIn from '@/components/supa-ui/AuthForms/OauthSignIn'
import ForgotPassword from '@/components/supa-ui/AuthForms/ForgotPassword'
import UpdatePassword from '@/components/supa-ui/AuthForms/UpdatePassword'
import SignUp from '@/components/supa-ui/AuthForms/Signup'
import Image from 'next/image'
import Link from 'next/link'
import { Icons } from '@/components/icons'
import { Button as StyledButton, buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export default async function SignIn({
  params,
  searchParams,
}: {
  params: { id: string }
  searchParams: { disable_button: boolean }
}) {
  const { allowEmail, allowOauth, allowPassword } = getAuthTypes()
  const viewTypes = getViewTypes()
  const redirectMethod = getRedirectMethod()

  // Declare 'viewProp' and initialize with the default value
  let viewProp: string

  // Assign url id to 'viewProp' if it's a valid string and ViewTypes includes it
  if (typeof params.id === 'string' && viewTypes.includes(params.id)) {
    viewProp = params.id
  } else {
    const preferredSignInView =
      cookies().get('preferredSignInView')?.value || null
    viewProp = getDefaultSignInView(preferredSignInView)
    return redirect(`/signin/${viewProp}`)
  }

  // Check if the user is already logged in and redirect to the account page if so
  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (user && viewProp !== 'update_password') {
    console.log('User', user)
    return redirect('/')
  } else if (!user && viewProp === 'update_password') {
    return redirect('/signin')
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
      <div className="m-auto flex w-full max-w-lg flex-col items-center justify-center p-3 ">
        <Image
          alt="Ollabot"
          height={45}
          src="/images/ollabot-small.png"
          width={45}
        />
        <h1 className="text-2xl font-semibold tracking-tight">Welcome back</h1>
        <Card
          title={
            viewProp === 'forgot_password'
              ? 'Reset Password'
              : viewProp === 'update_password'
                ? 'Update Password'
                : viewProp === 'signup'
                  ? 'Sign Up'
                  : 'Sign In'
          }
        >
          {viewProp === 'password_signin' && (
            <PasswordSignIn
              allowEmail={allowEmail}
              redirectMethod={redirectMethod}
            />
          )}
          {viewProp === 'email_signin' && (
            <EmailSignIn
              allowPassword={allowPassword}
              disableButton={searchParams.disable_button}
              redirectMethod={redirectMethod}
            />
          )}
          {viewProp === 'forgot_password' && (
            <ForgotPassword
              allowEmail={allowEmail}
              disableButton={searchParams.disable_button}
              redirectMethod={redirectMethod}
            />
          )}
          {viewProp === 'update_password' && (
            <UpdatePassword redirectMethod={redirectMethod} />
          )}
          {viewProp === 'signup' && (
            <SignUp allowEmail={allowEmail} redirectMethod={redirectMethod} />
          )}
          {viewProp !== 'update_password' &&
            viewProp !== 'signup' &&
            allowOauth && (
              <>
                <Separator text="Third-party sign-in" />
                <OauthSignIn />
              </>
            )}
        </Card>
      </div>
    </div>
  )
}
