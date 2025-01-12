'use client'
import { useState, useEffect, useRef } from 'react'
import { Send, Paperclip, Mic, MicOff } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import MessageBubble from './messages'
import { Button } from '@/components/ui/button'
import { ReloadIcon, Cross2Icon } from '@radix-ui/react-icons'
import { useRecordVoice } from '@/hooks/use-record-voice'
import Link from 'next/link'

interface ChatboxProps {
  bgColor: string
  avatarImg: string
  chatbotName: string
  companyLogo: string
  companyName: string
  description: string
  lang: string
  botId: string
  watermark: boolean
  welcomeMessage: string
}

interface Message {
  text: string
  sender: 'user' | 'bot'
  name: string
  avatar: string
  isThinking?: boolean
}

const SimpleMarkdown = ({ content }) => (
  <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
)

const Chatbox = ({
  bgColor,
  avatarImg,
  chatbotName,
  companyLogo,
  companyName,
  description,
  lang,
  botId,
  watermark,
  welcomeMessage,
}: ChatboxProps) => {
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(false)
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const messageInputRef = useRef<HTMLTextAreaElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const chatboxRef = useRef<HTMLDivElement>(null)
  const { recording, startRecording, stopRecording, text } =
    useRecordVoice(botId)

  const ai_message =
    lang === 'en'
      ? "Hello! I'm an AI Agent. How may I help you?"
      : 'Bonjour! Je suis un agent IA. Comment puis-je vous aider?'

  useEffect(() => {
    setMessages([
      {
        text: welcomeMessage || ai_message,
        sender: 'bot',
        name: chatbotName,
        avatar: avatarImg,
      },
    ])
  }, [chatbotName, avatarImg, ai_message, welcomeMessage])

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    setUploadedFile(file || null)
  }

  const handleSendMessage = async () => {
    stopRecording() // Ensure recording stops when sending a message
    const message = messageInputRef.current?.value || ''
    if (message.trim()) {
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: message, sender: 'user', name: 'You', avatar: '' },
        {
          text: `${chatbotName} is thinking...`,
          sender: 'bot',
          name: chatbotName,
          avatar: avatarImg,
          isThinking: true,
        },
      ])
      setLoading(true)

      try {
        const formData = new FormData()
        formData.append('message', message)
        if (uploadedFile) {
          formData.append('file', uploadedFile)
        }
        if (description) {
          formData.append('description', description)
        }
        formData.append('company_name', companyName)

        const response = await fetch(`/api/chatbot/${botId}/chat`, {
          method: 'POST',
          body: formData,
        })

        const data = await response.json()
        setMessages((prevMessages) => {
          const updatedMessages = prevMessages.filter(
            (msg) => !(msg.isThinking && msg.sender === 'bot'),
          )
          console.log('Updated messages:', updatedMessages)
          return [
            ...updatedMessages,
            {
              text: data.content,
              sender: 'bot',
              name: chatbotName,
              avatar: avatarImg,
            },
          ]
        })
        setUploadedFile(null) // Reset uploadedFile after sending the message
      } catch (error) {
        console.error('Error sending message:', error)
      } finally {
        setLoading(false)
      }

      if (messageInputRef.current) {
        messageInputRef.current.value = ''
      }
      adjustTextAreaHeight() // Adjust the height after sending
    }
  }

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()
      handleSendMessage()
    }
  }

  const handleRemoveFile = () => {
    setUploadedFile(null)
  }

  useEffect(() => {
    if (text) {
      handleSendMessageWithTranscription(text)
    }
  }, [text])

  const handleSendMessageWithTranscription = async (transcription: string) => {
    const message = transcription
    if (message.trim()) {
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: message, sender: 'user', name: 'You', avatar: '' },
        {
          text: `${chatbotName} is thinking...`,
          sender: 'bot',
          name: chatbotName,
          avatar: avatarImg,
          isThinking: true,
        },
      ])
      setLoading(true)

      try {
        const formData = new FormData()
        formData.append('message', message)
        if (uploadedFile) {
          formData.append('file', uploadedFile)
        }
        if (description) {
          console.log('Adding description', description)
          formData.append('description', description)
        }
        formData.append('company_name', companyName)

        const response = await fetch(`/api/chatbot/${botId}/chat`, {
          method: 'POST',
          body: formData,
        })

        const data = await response.json()
        setMessages((prevMessages) => {
          const updatedMessages = prevMessages.filter(
            (msg) => !(msg.isThinking && msg.sender === 'bot'),
          )
          return [
            ...updatedMessages,
            {
              text: data.content,
              sender: 'bot',
              name: chatbotName,
              avatar: avatarImg,
            },
          ]
        })
        setUploadedFile(null) // Reset uploadedFile after sending the message
      } catch (error) {
        console.error('Error sending message:', error)
      } finally {
        setLoading(false)
      }
    }
  }

  const adjustTextAreaHeight = () => {
    if (messageInputRef.current) {
      const textarea = messageInputRef.current
      textarea.style.height = 'auto'
      textarea.style.height = `${Math.min(textarea.scrollHeight, 3 * textarea.scrollHeight)}px`
    }
  }

  return (
    <div
      ref={chatboxRef}
      className="flex size-full flex-col justify-between overflow-hidden rounded-lg bg-background p-1"
    >
      <div className="max-h-full w-full grow flex-col overflow-y-auto">
        {messages.map((msg, index) => (
          <div key={index} className="mt-3 flex gap-1 space-x-2">
            <div
              className="relative flex size-8 items-center justify-center rounded-full p-2 font-medium"
              style={{
                backgroundColor: msg.avatar ? 'transparent' : bgColor,
                color: 'white',
              }}
            >
              {msg.avatar ? (
                <img
                  alt={msg.name}
                  className="absolute inset-0 size-full rounded-full object-cover"
                  src={msg.avatar}
                />
              ) : (
                <span>{msg.sender === 'bot' ? 'A' : 'Y'}</span>
              )}
            </div>
            <div className="ml-2 w-full flex-row text-wrap">
              <p className="text-md mb-1 font-bold">{msg.name}</p>
              <div
                className={`prose overflow-y-auto break-normal rounded-lg bg-accent p-2 text-primary ${msg.isThinking ? 'animate-pulse' : ''}`}
              >
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    // Override the default heading rendering to apply custom styles
                    h1: ({ node, ...props }) => (
                      <h1 {...props} className="text-primary">
                        {props.children}
                      </h1>
                    ),
                    h2: ({ node, ...props }) => (
                      <h2 {...props} className="text-primary">
                        {props.children}
                      </h2>
                    ),
                    h3: ({ node, ...props }) => (
                      <h3 {...props} className="text-primary">
                        {props.children}
                      </h3>
                    ),
                    h4: ({ node, ...props }) => (
                      <h4 {...props} className="text-primary">
                        {props.children}
                      </h4>
                    ),
                    h5: ({ node, ...props }) => (
                      <h5 {...props} className="text-primary">
                        {props.children}
                      </h5>
                    ),
                    h6: ({ node, ...props }) => (
                      <h6 {...props} className="text-primary">
                        {props.children}
                      </h6>
                    ),
                    // Override the default paragraph rendering to apply custom styles
                    p: ({ node, ...props }) => (
                      <p {...props} className="text-primary">
                        {props.children}
                      </p>
                    ),
                    // Override the default strong tag rendering to apply custom styles
                    strong: ({ node, ...props }) => (
                      <strong {...props} className="font-bold text-primary">
                        {props.children}
                      </strong>
                    ),
                    // Override the default anchor tag rendering to apply custom styles
                    a: ({ node, ...props }) => (
                      <a {...props} className="text-sky-500 hover:underline">
                        {props.children}
                      </a>
                    ),
                  }}
                >
                  {msg.text}
                </ReactMarkdown>
              </div>
            </div>
          </div>
        ))}
      </div>
      {uploadedFile && (
        <div className="mt-1 flex gap-1 space-x-2">
          <div className="mx-1 flex w-full flex-col text-wrap">
            <p className="mb-1 flex-col text-sm font-semibold">
              Uploaded File:
              <span className="flex justify-between overflow-y-auto break-normal rounded-lg text-xs text-muted">
                {uploadedFile.name}
                <Cross2Icon
                  className="ml-2 size-4 cursor-pointer"
                  onClick={handleRemoveFile}
                />
              </span>
            </p>
          </div>
        </div>
      )}
      <div className="mt-auto max-h-full shrink-0">
        <hr className="my-2" />
        <div className="flex items-center">
          <button className="p-2" onClick={() => fileInputRef.current?.click()}>
            <Paperclip
              className="size-5"
              style={{ transform: 'rotate(-45deg)' }}
            />
          </button>
          <textarea
            ref={messageInputRef}
            className="ml-2 max-h-24 grow resize-none overflow-y-auto rounded-lg bg-accent p-2 focus:outline-none"
            onKeyDown={handleKeyDown}
            onInput={adjustTextAreaHeight}
            placeholder="Send message here..."
            rows={1}
            style={{ height: 'auto' }}
          />
          <Button onClick={handleSendMessage} size="icon" variant="ghost">
            {loading ? (
              <ReloadIcon className="mr-2 size-4 animate-spin" />
            ) : (
              <Send className="size-5" />
            )}
          </Button>
          <Button
            onClick={recording ? stopRecording : startRecording}
            size="icon"
            variant="ghost"
          >
            {recording ? (
              <MicOff className="size-5 text-red-600" />
            ) : (
              <Mic className="size-5" />
            )}
          </Button>
        </div>
        <input
          ref={fileInputRef}
          style={{ display: 'none' }}
          type="file"
          onChange={handleFileUpload}
        />
        <div className="ml-3 mt-3 flex w-full justify-center">
          {watermark ? (
            <div className="flex items-center gap-2 text-sm font-medium">
              <a
                href="https://ollabot-frontend-nine.vercel.app"
                target="_blank"
                rel="noopener noreferrer"
              >
                Built with Ollabot
              </a>
              <img
                alt="Ollabot"
                className="size-5 rounded-full"
                height={24}
                src="https://hpogngdwousevnyrnmew.supabase.co/storage/v1/object/public/demo/ollabot-small.png?t=2024-05-28T04%3A19%3A32.271Z"
                width={24}
              />
            </div>
          ) : (
            <div />
          )}
        </div>
      </div>
    </div>
  )
}

export default Chatbox
