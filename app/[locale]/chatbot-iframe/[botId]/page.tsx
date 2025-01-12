'use client'
import React, { useEffect, useState } from 'react'
import Chatbox from './_components/chatbox'

interface ContactPageProps {
  params: {
    locale: string
    botId: string
  }
}

const defaultConfig = {
  bgColor: '#f5f5f5',
  botName: 'Ollabot Assistant',
  companyName: 'Ollabot',
  logoUrl: '/images/ollabot.png',
  avatarImg: '/images/ollabot-small.png',
  description: 'How can I assist you today?',
  tone: 'Professional/Academic',
  temperature: 0.7,
  chatBubbleIcon: 'Bot',
  lang: 'en',
  watermark: true,
  welcomeMessage: 'Hello! How can I help you today?',
}

const fetchConfig = async (botId: string) => {
  try {
    const response = await fetch(`/api/chatbot/${botId}/settings`)
    if (response.ok) {
      const data = await response.json()
      console.log('config', data)
      return {
        ...defaultConfig, // Start with default config
        ...data, // Override with fetched data
      }
    }
  } catch (error) {
    console.error('Error fetching bot config:', error)
  }
  return defaultConfig // Return default config if fetch fails
}

const ContactChat = ({ params: { locale, botId } }: ContactPageProps) => {
  const [config, setConfig] = useState(defaultConfig)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchConfig(botId).then((fetchedConfig) => {
      setConfig({ ...defaultConfig, ...fetchedConfig })
      setIsLoading(false)
    })
  }, [botId])

  if (isLoading) {
    return <div>Loading...</div>
  }

  console.log('Watermark', config.watermark)
  console.log('logo', config.logoUrl)

  return (
    <div className="flex size-full items-center justify-center bg-background p-4">
      <div className="flex h-[80vh] w-full max-w-screen-lg flex-col rounded-lg border p-4 shadow-lg">
        <div className="flex shrink-0 items-center justify-between rounded-t-lg bg-accent p-4">
          <div className="flex items-center">
            {config.logoUrl && (
              <img
                alt={`${config.companyName} Logo`}
                className="mr-2 h-8 w-full"
                src={config.logoUrl}
              />
            )}
            <h4 className="text-lg font-semibold">{config.companyName}</h4>
          </div>
        </div>
        <div className="grow overflow-hidden">
          <Chatbox
            bgColor={config.bgColor}
            avatarImg={config.avatarImg}
            chatbotName={config.botName}
            companyLogo={config.logoUrl}
            companyName={config.companyName}
            description={config.description}
            lang={locale}
            botId={botId}
            watermark={config.watermark}
            welcomeMessage={config.welcomeMessage}
          />
        </div>
      </div>
    </div>
  )
}

export default ContactChat
