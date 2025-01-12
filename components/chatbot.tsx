// Chatbot.tsx
'use client'
import Head from 'next/head'
import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { IWidgetConfig } from '@/types_widget'
import Script from 'next/script'

interface ChatbotProps {
  botId: string
  botName: string
  config: IWidgetConfig
  lang: string
  welcomeMessage?: string
}

const Chatbot = ({
  botId,
  botName,
  config,
  lang,
  welcomeMessage,
}: ChatbotProps) => {
  const pathname = usePathname()

  useEffect(() => {
    const shouldMountChatbot =
      pathname.endsWith('/chat') || pathname.endsWith('/chattest')
    if (shouldMountChatbot) {
      const script = document.createElement('script')
      script.src = config.chainlitServer + 'copilot/index.js'
      script.async = true
      document.body.appendChild(script)

      console.log('Logo URL', config.logoUrl)

      const handleEvent = (e: any) => {
        const { args, callback, name } = e.detail
        if (name === 'test') {
          callback('You sent: ' + args.msg)
        }
        if (name === 'stripe_redirect') {
          window.location.href = args.msg
        }
        if (name === 'init') {
          callback({ lang, botId, botName, welcomeMessage })
          // Emulate here that we pass back in the chatbotId
        }
      }

      window.addEventListener('chainlit-call-fn', handleEvent)

      script.onload = () => {
        if ((window as any).mountChainlitWidget) {
          ;(window as any).mountChainlitWidget({
            ...config,
            chainlitServer: config.chainlitServer,
            logoUrl: config.logoUrl,
            headerText: config.headerText,
            fontFamily: config.fontFamily,
            theme: config.theme,
            button: config.button,
          })
        }
      }

      script.onerror = () => {
        console.error('Error loading the script')
      }

      return () => {
        document.body.removeChild(script)
        window.removeEventListener('chainlit-call-fn', handleEvent)
      }
    }
  }, [pathname, lang, config, botId, welcomeMessage])

  return (
    <>
      {/* <Head>
        <meta charSet="UTF-8" />
        <style>{`
          .MuiStack-root.watermark {
              visibility: hidden !important;
          }

          .MuiStack-root.watermark::after {
              content:  "Built with Ollabot" url('favicon.ico');
              visibility: visible !important;
              font-size: medium;
              display: inline-flex;
              align-items: center;
              margin-right: 5px;
          }
        `}</style>
      </Head> */}

      {!pathname.endsWith('/chat') && !pathname.endsWith('/chattest') && (
        <Script id="remove-copilot" strategy="afterInteractive">
          {`
            document.addEventListener('DOMContentLoaded', function () {
              const copilotElement = document.getElementById('copilot');
              if (copilotElement) {
                copilotElement.remove();
              }
            });
          `}
        </Script>
      )}
    </>
  )
}

export default Chatbot
