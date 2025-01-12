'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import Card from '@/components/supa-ui/Card'
import { useRouter } from 'next/navigation'
import { toast } from 'react-hot-toast'

export default function DeleteAccountForm({
  userId,
  translations,
}: {
  userId: string
  translations: {
    description: string
    footer: string
    title: string
    deleteAccount: string
    typeToConfirm: string
    errorOccured: string
  }
}) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [confirmationText, setConfirmationText] = useState('')

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault() // Prevent default form submission behavior
    setIsSubmitting(true)

    try {
      const response = await fetch(`/api/users/${userId}/delete`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error('Failed to delete account')
      }

      toast.success(translations.deleteAccount)

      // Redirect or update UI after successful deletion
      router.push('/') // Redirect to home or login page
    } catch (error) {
      console.error('Error during account deletion:', error)
      toast.error(translations.errorOccured)

      alert(`Error: ${error.message || 'An unexpected error occurred'}`)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card
      description={translations.description}
      footer={
        <div className="flex flex-col items-start justify-between sm:flex-row sm:items-center">
          <p className="pb-4 text-white sm:pb-0">{translations.footer}</p>
          <Button
            form="deleteAccountForm"
            type="submit"
            variant="destructive"
            disabled={
              confirmationText !== translations.deleteAccount || isSubmitting
            }
          >
            {translations.deleteAccount}
          </Button>
        </div>
      }
      title={translations.title}
    >
      <div className="mb-4 mt-8 text-xl font-semibold">
        <form id="deleteAccountForm" onSubmit={handleSubmit}>
          <input
            className="w-full rounded-md bg-zinc-800 p-3 text-sm text-zinc-300"
            value={confirmationText}
            onChange={(e) => setConfirmationText(e.target.value)}
            placeholder={translations.typeToConfirm}
            type="text"
          />
        </form>
      </div>
    </Card>
  )
}
