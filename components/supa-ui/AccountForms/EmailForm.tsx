'use client'

import Button from '@/components/supa-ui/Button'
import Card from '@/components/supa-ui/Card'
import { updateEmail } from '@/utils/auth-helpers/server'
import { handleRequest } from '@/utils/auth-helpers/client'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function EmailForm({
  userEmail,
  translations,
}: {
  userEmail: string | undefined
  translations: {
    description: string
    footer: string
    title: string
    updateEmail: string
  }
}) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    setIsSubmitting(true)
    // Check if the new email is the same as the old email
    if (e.currentTarget.newEmail.value === userEmail) {
      e.preventDefault()
      setIsSubmitting(false)
      return
    }
    handleRequest(e, updateEmail, router)
    setIsSubmitting(false)
  }

  return (
    <Card
      description={translations.description}
      footer={
        <div className="flex flex-col items-start justify-between sm:flex-row sm:items-center">
          <p className="pb-4 text-white sm:pb-0">{translations.footer}</p>
          <Button
            form="emailForm"
            loading={isSubmitting}
            type="submit"
            variant="slim"
          >
            {translations.updateEmail}
          </Button>
        </div>
      }
      title={translations.title}
    >
      <div className="mb-4 mt-8 text-xl font-semibold">
        <form id="emailForm" onSubmit={(e) => handleSubmit(e)}>
          <input
            className="w-1/2 rounded-md bg-zinc-800 p-3 text-sm text-zinc-300"
            defaultValue={userEmail ?? ''}
            maxLength={64}
            name="newEmail"
            placeholder="Your email"
            type="text"
          />
        </form>
      </div>
    </Card>
  )
}
