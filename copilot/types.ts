export interface PopoverConfig {
  bgColor?: string;
  avatarImg?: string;
  chatbotName?: string;
  companyLogo?: string;
  companyName?: string;
  description?: string;
  tone?: string;
  temperature?: number;
  isVisible?: boolean;
  lang?: string;
  botId?: string;
  onClose?: () => void;
}