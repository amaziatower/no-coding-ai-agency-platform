'use client'

import { Button } from '@/components/ui/button'
import { signInWithOAuth } from '@/utils/auth-helpers/client'
import { type Provider } from '@supabase/supabase-js'
import { Github } from 'lucide-react'
import { useState } from 'react'
import { FcGoogle } from 'react-icons/fc'
import { FaGithub } from 'react-icons/fa'

type OAuthProviders = {
  name: Provider
  displayName: string
  icon: JSX.Element
}

export default function OauthSignIn() {
  const oAuthProviders: Array<OAuthProviders> = [
    {
      name: 'github',
      displayName: 'GitHub',
      icon: <FaGithub className="size-5" />,
    },
    {
      name: 'google',
      displayName: 'Google',
      icon: <FcGoogle className="size-5" />,
    },
    /* Add desired OAuth providers here */
  ]
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    setIsSubmitting(true) // Disable the button while the request is being handled
    await signInWithOAuth(e)
    setIsSubmitting(false)
  }

  return (
    <div className="mt-8">
      {oAuthProviders.map((provider) => (
        <form
          key={provider.name}
          className="pb-2"
          onSubmit={(e) => handleSubmit(e)}
        >
          <input name="provider" type="hidden" value={provider.name} />
          <Button
            type="submit"
            variant="outline"
            className="w-full"
            // loading={isSubmitting}
          >
            <span className="mr-2">{provider.icon}</span>
            <span>{provider.displayName}</span>
          </Button>
        </form>
      ))}
    </div>
  )
}
