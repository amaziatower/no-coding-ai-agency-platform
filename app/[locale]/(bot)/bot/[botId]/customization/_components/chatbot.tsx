'use client'
import { Button } from '@/components/ui/button'
import Popover from './popover'
import { useState, useEffect, useRef } from 'react'
import { Bot, MessageSquare, Send, File, MessageCircle } from 'lucide-react'
import { iconMap } from './options'
import styled from 'styled-components'

const ChatbotPage = ({
  bgColor,
  avatarImg,
  botName,
  companyLogo,
  companyName,
  description,
  tone,
  temperature,
  lang,
  botId,
  chatBubbleIcon,
  watermark,
  welcomeMessage,
}: {
  bgColor: string
  avatarImg: string
  botName: string
  companyLogo: string
  companyName: string
  description: string
  tone: string
  temperature: number
  lang: string
  botId: string
  chatBubbleIcon: string
  watermark: boolean
  welcomeMessage: string
}) => {
  const defaultIcon = <MessageCircle />

  const [isPopoverOpen, setPopoverOpen] = useState(false)

  const togglePopover = () => setPopoverOpen(!isPopoverOpen)
  const chatIcon = iconMap[chatBubbleIcon] || defaultIcon

  return (
    <div className="fixed bottom-4 right-4 flex flex-col items-end">
      <Popover
        bgColor={bgColor}
        avatarImg={avatarImg}
        chatbotName={botName}
        companyLogo={companyLogo}
        companyName={companyName}
        isVisible={isPopoverOpen}
        description={description}
        tone={tone}
        temperature={temperature}
        lang={lang}
        botId={botId}
        watermark={watermark}
        welcomeMessage={welcomeMessage}
        onClose={() => setPopoverOpen(false)}
      />
      <Button
        className="rounded-full text-white shadow-lg transition-opacity hover:bg-opacity-90"
        onClick={togglePopover}
        style={{
          width: '60px',
          height: '60px',
          backgroundColor: bgColor,
        }}
      >
        {isPopoverOpen ? 'x' : chatIcon}{' '}
      </Button>
    </div>
  )
}

export default ChatbotPage
