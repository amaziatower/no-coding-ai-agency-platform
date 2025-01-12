'use client'
import Link from 'next/link'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { useState } from 'react'
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card'

interface BotItemProps {
  bot: {
    id: string
    botConfig?: {
      botName?: string
      companyName?: string
      description?: string
      bgColor?: string
      logoUrl?: string
    }
    questions_counter: number
    data_sources_counter: number
    data_sources_limit: number
    questions_limit: number
    user_id: string
  }
  lang: string
  translations: {
    copied: string
    botId: string
    dataSources: string
    messages: string
    customize: string
  }
}

export default function BotItem({ bot, lang, translations }: BotItemProps) {
  const {
    botName = 'Unnamed Bot',
    companyName = 'Unknown Company',
    description = 'No description available.',
    bgColor = '#ffffff',
    logoUrl = 'https://hpogngdwousevnyrnmew.supabase.co/storage/v1/object/public/demo/logo_light.png?t=2024-05-07T14%3A33%3A14.796Z',
  } = bot.botConfig || {}

  const [copied, setCopied] = useState(false)

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(bot.id)
      setCopied(true)
      setTimeout(() => setCopied(false), 750) // Reset the copied state after 2 seconds
    } catch (error) {
      console.error('Failed to copy: ', error)
    }
  }

  return (
    <div className="flex h-fit w-full justify-center p-4 md:w-1/2">
      <div className="relative flex size-96 flex-col items-center justify-around rounded-lg border-2 border-zinc-400 bg-card p-6 text-center shadow-md">
        <div className="absolute top-0 mt-10 -translate-y-1/2">
          <Avatar className="border-2 border-gray-200 shadow-lg">
            <AvatarImage src={logoUrl} alt="Bot Avatar" />
            <AvatarFallback>Bot</AvatarFallback>
          </Avatar>
        </div>
        <div>
          <h3 className="mt-7 text-lg font-bold">{botName}</h3>
          <p className="text-sm text-gray-500">{companyName}</p>
        </div>

        <div className="m-2">
          <HoverCard>
            <HoverCardTrigger asChild>
              <p className="mt-2 cursor-pointer text-gray-500 text-sm">
                {description.length > 100
                  ? `${description.substring(0, 100)}...`
                  : description}
              </p>
            </HoverCardTrigger>
            <HoverCardContent>
              <p className="text-gray-500 text-sm">{description}</p>
            </HoverCardContent>
          </HoverCard>
          <button
            className="mt-2 cursor-pointer text-xs text-gray-400"
            onClick={copyToClipboard}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                copyToClipboard()
              }
            }}
          >
            {copied ? translations.copied : `${translations.botId}: ${bot.id}`}
          </button>
          <div className="mt-2 flex items-center justify-center">
            <p className="text-xs text-gray-400">
              {translations.dataSources}: {bot.data_sources_counter}/
              {bot.data_sources_limit}
            </p>
            <p className="ml-4 text-xs text-gray-400">
              {translations.messages}: {bot.questions_counter}/
              {bot.questions_limit}
            </p>
          </div>
        </div>
        <Link href={`/bot/${bot.id}/customization`}>
          <Button className="mt-4 px-4 py-2" variant="secondary" size="sm">
            {translations.customize}
          </Button>
        </Link>
        <div
          className="absolute right-0 top-0 mr-4 mt-4 size-6 rounded-full"
          style={{ backgroundColor: bgColor }}
        />
      </div>
    </div>
  )
}
