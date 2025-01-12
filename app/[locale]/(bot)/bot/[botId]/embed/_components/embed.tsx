'use client'
import * as React from 'react'
import { Clipboard } from 'lucide-react'
import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { usePathname } from 'next/navigation'

type Translations = {
  heading: string
  text: string
  embedScriptTitle: string
  embedScriptDescription: string
  embedTelegramDescription: string
  start: string
  embedTelegramPlaceholder: string

  copied: string
  copyScript: string
  embedIframeTitle: string
  embedIframeDescription: string
  copyIframe: string
}

export default function EmbedPageClient({
  translations,
}: {
  translations: Translations
}) {
  const [iframeCopied, setIframeCopied] = useState(false)
  const [scriptCopied, setScriptCopied] = useState(false)
  const [botConfig, setBotConfig] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [botToken, setBotToken] = useState('')
  const [isStart, setIsStart] = useState(false)
  const [lastBotToken, setLastBotToken] = useState(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault() // Prevent default form submission behavior
    if (isStart && lastBotToken === botToken) {
      alert('Please disconnect and run again with the same botToken.')
      return
    } else {
      setIsStart(true)
      setLastBotToken(botToken)
    }

    try {
      const response = await fetch('/api/tg-bot', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ botToken: botToken, isStart: true }),
      })

      const result = await response.json()
      console.log(result) // Handle the response as needed
    } catch (error) {
      console.error('Error submitting bot token:', error)
    }
  }

  const pathname = usePathname()
  const pathSegments = pathname.split('/')
  const botIndex = pathSegments.indexOf('bot')
  const botId = botIndex !== -1 ? pathSegments[botIndex + 1] : null

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const response = await fetch(
          `https://ollabot-frontend-nine.vercel.app/api/chatbot/${botId}/settings`
        )
        if (response.ok) {
          const data = await response.json()
          setBotConfig(data)
        } else {
          console.error('Failed to fetch bot config:', response.statusText)
        }
      } catch (error) {
        console.error('Error fetching bot config:', error)
      } finally {
        setIsLoading(false)
      }
    }
    if (botId) {
      fetchConfig()
    }
  }, [botId])

  if (isLoading) {
    return <div>Loading...</div>
  }

  const iframeCode = `<iframe
src="https://ollabot-frontend-nine.vercel.app/chatbot-iframe/${botId}"
title="Chatbot"
width="100%"
style="height: 100%; min-height: 700px"
frameborder="0"
></iframe>`

  const scriptCode = `<script>
window.embeddedChatbotConfig = {
  domain: "https://app.ollabot.com",
  botId: "${botId}",
};
</script>
<script 
src="https://app.ollabot.com/scripts/embed.min.js" defer>
</script>`

  const copyToClipboard = (
    text: string,
    setCopied: React.Dispatch<React.SetStateAction<boolean>>,
  ) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="flex flex-col items-center space-y-4 rounded-md p-6">
      <div className="w-full max-w-4xl space-y-8">
        <Card>
          <CardContent className="m-5">
            <h2 className="my-4 text-center text-xl font-bold text-card-foreground">
              {translations.embedIframeTitle}
            </h2>
            <div className="my-2 text-center">
              <p className="text-gray-500">
                {translations.embedIframeDescription}
              </p>
            </div>
            <pre className="m-2 overflow-x-auto whitespace-pre-wrap break-all rounded-md bg-gray-200 p-4">
              <code className="text-black">{iframeCode}</code>
            </pre>
            <div className="flex justify-center">
              <Button
                onClick={() => copyToClipboard(iframeCode, setIframeCopied)}
                variant="outline"
                className="mt-2"
              >
                <Clipboard className="mr-2 size-4" />
                {iframeCopied ? translations.copied : translations.copyIframe}
              </Button>
            </div>
            <h2 className="my-4 text-center text-xl font-bold text-card-foreground">
              {translations.embedScriptTitle}
            </h2>
            <div className="my-2 text-center">
              <p className="text-gray-500">
                {translations.embedScriptDescription}
              </p>
            </div>
            <pre className="m-2 overflow-x-auto whitespace-pre-wrap break-all rounded-md bg-gray-200 p-4">
              <code className="text-black">{scriptCode}</code>
            </pre>
            <div className="flex justify-center">
              <Button
                onClick={() => copyToClipboard(scriptCode, setScriptCopied)}
                variant="outline"
                className="mt-2"
              >
                <Clipboard className="mr-2 size-4" />
                {scriptCopied ? translations.copied : translations.copyScript}
              </Button>
            </div>
            <h2 className="my-4 text-center text-xl font-bold text-card-foreground">
              {translations.embedTelegramDescription}
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="flex justify-between mb-4">
                <input
                  type="text"
                  placeholder={translations.embedTelegramPlaceholder}
                  value={botToken}
                  onChange={(e) => setBotToken(e.target.value)}
                  required
                  className="flex-grow p-2 mr-2 border rounded form-input"
                />
                <Button type="submit" className="w-1/3 text-white btn btn-primary">
                  {translations.start}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}