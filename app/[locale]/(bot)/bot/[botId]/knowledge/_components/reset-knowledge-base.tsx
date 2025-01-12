'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import Card from '@/components/supa-ui/Card'
import { useRouter, usePathname } from 'next/navigation'
import { toast } from 'react-hot-toast'

export default function ResetKnowledgeBaseForm({
  translations,
}: {
  translations: {
    description: string
    footer: string
    title: string
    resetKnowledgeBase: string
    typeToConfirm: string
    errorOccured: string
    successMessage: string
    resetKnowledgeBaseDescription: string
  }
}) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [confirmationText, setConfirmationText] = useState('')
  const [chatbotId, setChatbotId] = useState('')

  const pathname = usePathname()
  const router = useRouter()

  // Extracting botId from the pathname
  useEffect(() => {
    const pathSegments = pathname.split('/')
    const botIndex = pathSegments.indexOf('bot')
    const extractedBotId = botIndex !== -1 ? pathSegments[botIndex + 1] : null
    if (extractedBotId) setChatbotId(extractedBotId)
  }, [pathname])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault() // Prevent default form submission behavior
    setIsSubmitting(true)

    try {
      const response = await fetch(
        `/api/chatbot/${chatbotId}/reset_knowledge_base`,
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ namespace: chatbotId }),
        },
      )

      if (!response.ok) {
        throw new Error('Failed to reset knowledge base')
      }

      toast.success(translations.successMessage)

      // Wait for 3 seconds before redirecting
      setTimeout(() => {
        // Redirect or update UI after successful reset
        router.push('/dashboard') // Redirect to home or any other page
      }, 1000)
    } catch (error) {
      console.error('Error during knowledge base reset:', error)
      toast.error(translations.errorOccured)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card
      description={translations.resetKnowledgeBaseDescription}
      footer={
        <div className="flex flex-col items-start justify-between sm:flex-row sm:items-center">
          <p className="pb-4 text-white sm:pb-0">{translations.footer}</p>
          <Button
            form="resetKnowledgeBaseForm"
            type="submit"
            variant="destructive"
            disabled={
              confirmationText !== translations.resetKnowledgeBase ||
              isSubmitting
            }
          >
            {translations.resetKnowledgeBase}
          </Button>
        </div>
      }
      title={translations.title}
    >
      <div className="mb-4 mt-8 text-xl font-semibold">
        <form id="resetKnowledgeBaseForm" onSubmit={handleSubmit}>
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
