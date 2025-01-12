// utils/urlUtils.ts
'use client'
import { usePathname } from 'next/navigation'

export function useBotIdFromUrl(): string | null {
  const router = usePathname()
  // Assuming your URL structure is `/bot/[botId]/...
  return router
}
