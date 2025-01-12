// global.d.ts
interface EmbeddedChatbotConfig {
  componentId: string;
  domain: string;
  bgColor: string;
  avatarImg: string;
  chatbotName: string;
  companyLogo: string;
  companyName: string;
  description: string;
  tone: string;
  temperature: number;
  isVisible: boolean;
  lang: string;
  botId: string;
  onClose: () => void;
}

declare global {
  interface Window {
    embeddedChatbotConfig: EmbeddedChatbotConfig;
  }
}

declare module 'react-dom/client';
