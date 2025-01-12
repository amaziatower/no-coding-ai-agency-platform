// src/types/settings.ts

import { z } from 'zod';

// Define the schema using Zod
export const settingsSchema = z.object({
  botName: z.string().min(1, 'Bot name is required'),
  companyName: z.string().min(1, 'Company name is required'),
  description: z.string().optional(),
  companyLogo: z.any().optional().refine((file) => file instanceof global.FileList, {
    message: 'Company logo is required',
  }),
  avatarImg: z.any().optional().refine((file) => file instanceof global.FileList, {
    message: 'Bot avatar is required',
  }),
  chatBubbleIcon: z.enum([
    'Bot',
    'BotIcon',
    'BotMessageSquare',
    'MessageCircleQuestion',
    'MessageSquareHeart',
    'MessageSquareMore',
    'MessageSquareQuote',
    'MessageCircleCode',
  ]).optional(),
  bgColor: z.string().optional(),
  welcomeMessage: z.string().optional(),
  tone: z.enum([
    'Professional/Academic',
    'Casual/Friendly',
    'Instructive/Authoritative',
    'Conversational/Engaging',
    'Inspirational/Motivational',
  ]).optional(),
  temperature: z.number().min(0).max(1).optional().default(0.3),
  includeWatermark: z.boolean().default(true).optional(),
});

// Define TypeScript types based on the schema
export type SettingsFormData = z.infer<typeof settingsSchema>;

// Define the translations type
export type Translations = {
  heading: string;
  text: string;
  lang: string;
  saveChanges: string;
  savingChanges: string;
  reset: string;
  botNameLabel: string;
  botNamePlaceholder: string;
  companyNameLabel: string;
  companyNamePlaceholder: string;
  descriptionLabel: string;
  descriptionPlaceholder: string;
  toneLabel: string;
  tonePlaceholder: string;
  temperatureLabel: string;
  temperaturePlaceholder: string;
  companyLogoLabel: string;
  botAvatarLabel: string;
  chatBubbleIconLabel: string;
  bgColorLabel: string;
  welcomeMessageLabel: string;
  includeWatermarkLabel: string;
  forUnlimitedUsersOnly: string;
  errorFetchingData: string;
  settingsUpdating: string;
  settingsUpdatedSuccessfully: string;
  errorUpdatingSettings: string;
  optional: string;
  cancel: string;
  editChatbotSettings: string;
  tooltip: string;
  settingsResetSuccessfully: string;
  errorResettingSettings: string;
  resetConfirmationTitle: string;
  resetConfirmationDescription: string;
  typeToConfirm: string;
  confirmReset: string;
  resetting: string;
  errorResetConfirmation: string;
};
