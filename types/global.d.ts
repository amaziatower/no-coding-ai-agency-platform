// global.d.ts
interface EmbeddedComponentConfig {
  componentId: string
  domain: string
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
  onClose: () => void
}

declare global {
  interface Window {
    embeddedComponentConfig: EmbeddedComponentConfig
  }
}

declare module 'react-dom/client'

// types/supabase.ts
export type GetAnalyticsDataParams = {
  bot_id: string
}
