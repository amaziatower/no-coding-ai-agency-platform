import { createServerSupabaseClient } from '@/supabase-server'

const defaultSettings = {
  chainlitServer: 'https://chatbotdashboard-2kg4j2lj7a-od.a.run.app/',
  showCot: true,
  theme: 'light',
  logoUrl:
    'https://hpogngdwousevnyrnmew.supabase.co/storage/v1/object/public/demo/logo_light.png',
  fontFamily: 'Inter, sans-serif',
  headerText: 'Chatbot',
  button: {
    containerId: 'copilot',
    imageUrl: 'Bot',
    style: {
      size: '4rem',
      bgcolor: '#007BFF',
      bgcolorHover: '#659492',
    },
  },
}

export async function fetchChatbotSettings(chatbotId) {
  'use server'
  const supabase = createServerSupabaseClient()
  const { data, error } = await supabase
    .from('chatbot')
    .select('settings')
    .eq('id', chatbotId)
    .single()

  if (error) {
    console.error('Error fetching chatbot settings:', error)
    return defaultSettings // Return default settings in case of an error
  }

  return deepMerge(defaultSettings, data.settings)
}

// Helper function for deep merging objects
function deepMerge(target, source) {
  Object.keys(source).forEach((key) => {
    if (source[key] && typeof source[key] === 'object') {
      target[key] = deepMerge(target[key] || {}, source[key])
    } else {
      target[key] = source[key]
    }
  })
  return target
}
