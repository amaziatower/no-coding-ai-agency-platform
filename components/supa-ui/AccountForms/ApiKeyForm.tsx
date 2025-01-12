'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Tables } from '@/types_db'
import { Button, buttonVariants } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from '@/components/ui/use-toast'
import { Eye, EyeOff, Trash2, Loader2 } from 'lucide-react'

type User = Tables<'users'>

interface Props extends React.HTMLAttributes<HTMLFormElement> {
  userId: string
  apiKey: string | null
  translations: {
    description: string
    title: string
    generateKey: string
    deleteKey: string
    keyGenerated: string
    keyDeleted: string
    loading: string
  }
}

export function ApiKeyForm({ userId, apiKey, translations, className, ...props }: Props) {
  const [currentApiKey, setCurrentApiKey] = React.useState(apiKey)
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [message, setMessage] = React.useState('')
  const [showApiKey, setShowApiKey] = React.useState(false)
  const router = useRouter()

  const handleGenerateApiKey = async () => {
    setIsSubmitting(true)
    console.log('Generating API key...')
    try {
      const response = await fetch('/api/generate_api_key', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ user_id: userId }),
      })
      console.log('API response received:', response)
      const data = await response.json()
      console.log('API response data:', data)
      if (response.ok) {
        setCurrentApiKey(data.api_key)
        setMessage(translations.keyGenerated)
        toast({ description: translations.keyGenerated })
      } else {
        setMessage(data.message || 'Error generating API key')
        toast({ title: 'Error', description: data.message || 'Error generating API key', variant: 'destructive' })
      }
    } catch (error) {
      console.error('Error generating API key:', error)
      setMessage('Error generating API key')
      toast({ title: 'Error', description: 'Error generating API key', variant: 'destructive' })
    }
    setIsSubmitting(false)
    console.log('API key generation process completed')
  }

  const handleDeleteApiKey = async () => {
    setIsSubmitting(true)
    console.log('Deleting API key...')
    try {
      const response = await fetch('/api/delete_api_key', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ user_id: userId }),
      })
      console.log('API response received:', response)
      if (response.ok) {
        setCurrentApiKey(null)
        setMessage(translations.keyDeleted)
        toast({ description: translations.keyDeleted })
      } else {
        const data = await response.json()
        console.log('API response data:', data)
        setMessage(data.message || 'Error deleting API key')
        toast({ title: 'Error', description: data.message || 'Error deleting API key', variant: 'destructive' })
      }
    } catch (error) {
      console.error('Error deleting API key:', error)
      setMessage('Error deleting API key')
      toast({ title: 'Error', description: 'Error deleting API key', variant: 'destructive' })
    }
    setIsSubmitting(false)
    console.log('API key deletion process completed')
  }

  return (
    <form className={cn(className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>{translations.title}</CardTitle>
          <CardDescription>{translations.description}</CardDescription>
        </CardHeader>
        <CardContent>
          {currentApiKey ? (
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <p className="font-semibold">SECRET KEY</p>
                <p className="font-mono text-sm">
                  {showApiKey ? currentApiKey : '********************************'}
                </p>
                <button
                  type="button"
                  className="focus:outline-none"
                  onClick={() => setShowApiKey(!showApiKey)}
                >
                  {showApiKey ? (
                    <EyeOff className="h-5 w-5 text-gray-500" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-500" />
                  )}
                </button>
              </div>
              <button
                type="button"
                className="focus:outline-none"
                onClick={handleDeleteApiKey}
                disabled={isSubmitting}
              >
                <Trash2 className="h-5 w-5 text-red-500" />
              </button>
            </div>
          ) : (
            <Button onClick={handleGenerateApiKey} disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {translations.loading}
                </>
              ) : (
                translations.generateKey
              )}
            </Button>
          )}
        </CardContent>
        {message && <CardFooter className="text-red-500">{message}</CardFooter>}
      </Card>
    </form>
  )
}
