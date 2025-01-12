// components/Popover.tsx
import { useState, useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import Chatbox from './chatbox' // Import the Chatbox component
import Image from 'next/image'

interface PopoverConfig {
  bgColor: string
  avatarImg: string
  chatbotName: string
  companyLogo: string
  companyName: string
  description: string
  tone: string
  temperature: number
  isVisible: boolean
  lang: string
  botId: string
  welcomeMessage: string
  watermark: boolean
  onClose(): void
}

const Popover = ({
  bgColor,
  avatarImg,
  chatbotName,
  companyLogo,
  companyName,
  description,
  tone,
  temperature,
  welcomeMessage,
  isVisible,
  lang,
  botId,
  onClose,
  watermark,
}: PopoverConfig) => {
  const prompt = `${description} ${tone} ${companyName} ${chatbotName}`

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          animate={{ opacity: 1, y: 0 }}
          className="text-chatbottext absolute bottom-14 right-0 mb-5 rounded-lg border border-gray-300 bg-background p-3 shadow-lg"
          exit={{ opacity: 0, y: 50 }}
          initial={{ opacity: 0, y: 50 }}
          style={{
            display: 'flex',
            flexDirection: 'column',
            inset: 'auto auto 14px -24px !important',
            width: 'min(400px, 80vw)',
            height: '60vh',
            transform: 'translateX(calc(100% - 60px))',
            overflow: 'hidden',
            borderColor: 'black',
          }}
        >
          <div className="flex h-full flex-col">
            <div className="flex items-center p-1">
              {companyLogo && (
                <Image
                  alt={`${companyName} Logo`}
                  className="mr-2 size-8 rounded-full"
                  height={32}
                  src={companyLogo}
                  width={32}
                />
              )}
              <h4 className="text-lg font-semibold"> {companyName} </h4>
            </div>
            <Chatbox
              bgColor={bgColor}
              avatarImg={avatarImg}
              chatbotName={chatbotName}
              companyLogo={companyLogo}
              companyName={companyName}
              description={description}
              lang={lang}
              botId={botId}
              watermark={watermark}
              welcomeMessage={welcomeMessage}
            />
            <Button
              className="absolute right-3 top-3"
              onClick={onClose}
              size="iconsmall"
              variant="ghost"
            >
              x
            </Button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default Popover
