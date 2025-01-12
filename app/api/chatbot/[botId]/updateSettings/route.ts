import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { createClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'
import { z } from 'zod'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
)

const supabase_url = process.env.NEXT_PUBLIC_SUPABASE_URL

const schema = z.object({
  botName: z.string().min(1, 'Bot name is required'),
  companyName: z.string().min(1, 'Company name is required'),
  description: z.string().optional().nullable(),
  chatBubbleIcon: z
    .enum([
      'Bot',
      'BotIcon',
      'BotMessageSquare',
      'MessageCircleQuestion',
      'MessageSquareHeart',
      'MessageSquareMore',
      'MessageSquareQuote',
      'MessageCircleCode',
    ])
    .optional()
    .nullable(),
  bgColor: z.string().optional().nullable(),
  welcomeMessage: z.string().optional().nullable(),
  tone: z
    .enum([
      'Professional/Academic',
      'Casual/Friendly',
      'Instructive/Authoritative',
      'Conversational/Engaging',
      'Inspirational/Motivational',
    ])
    .optional()
    .nullable(),
  temperature: z.number().min(0).max(1).optional().nullable(),
})

async function uploadFile(file, filePath) {
  console.log('Uploading file...')
  const { data, error: uploadError } = await supabaseAdmin.storage
    .from('users')
    .upload(filePath, file, {
      upsert: true, // Optional: Allows overwriting of existing files
    })
  if (uploadError) {
    console.error('Error uploading file:', uploadError.message)
    throw new Error(uploadError.message)
  }

  const url = `${supabase_url}/storage/v1/object/public/users/${filePath}`
  console.log('File uploaded successfully:', url)
  return url // Return the URL to be used elsewhere in your application
}

export async function PATCH(req, context) {
  console.log('PATCH request received')
  const supabase = createRouteHandlerClient({ cookies })
  const { params } = context
  const botId = params.botId

  try {
    console.log('Parsing form data...')
    const formData = await req.formData()
    const botName = formData.get('botName')
    const companyName = formData.get('companyName')
    const description = formData.get('description') || null
    const chatBubbleIcon = formData.get('chatBubbleIcon') || null
    const bgColor = formData.get('bgColor') || null
    const welcomeMessage = formData.get('welcomeMessage') || null
    const tone = formData.get('tone') || null
    const temperature = formData.get('temperature')
      ? parseFloat(formData.get('temperature'))
      : null

    console.log('Validating input...')
    // Validate the input using the schema
    schema.parse({
      botName,
      companyName,
      description,
      chatBubbleIcon,
      bgColor,
      welcomeMessage,
      tone,
      temperature,
    })

    console.log('Fetching current bot config...')
    console.log('Replacing bot config with: ', {
      botName,
      companyName,
      description,
      chatBubbleIcon,
      bgColor,
      welcomeMessage,
      tone,
      temperature,
      })

    // Fetch current botConfig
    const { data: currentData, error: fetchError } = await supabase
      .from('chatbot')
      .select('botConfig')
      .eq('id', botId)
      .single()

    if (fetchError) throw new Error(fetchError.message)

    const currentBotConfig = currentData?.botConfig ?? {}

    console.log('Processing files...')
    // Process files if provided
    let logoUrl = currentBotConfig?.logoUrl || null
    let avatarUrl = currentBotConfig?.avatarUrl || null

    const companyLogo = formData.get('companyLogo')
    const avatarImg = formData.get('avatarImg')

    if (companyLogo) {
      const filePath = `${botId}/logo.png`
      logoUrl = await uploadFile(companyLogo, filePath)
    }

    if (avatarImg) {
      const filePath = `${botId}/avatar.png`
      avatarUrl = await uploadFile(avatarImg, filePath)
    }

    console.log('Merging new settings with current settings...')
    // Merge current settings with new settings
    const newBotConfig = {
      ...currentBotConfig,
      botName,
      companyName,
      description,
      welcomeMessage,
      logoUrl,
      avatarUrl,
      chatBubbleIcon,
      bgColor,
      tone,
      temperature,
    }

    console.log('Updating settings in database...')
    // Update settings in database
    const { data, error } = await supabase
      .from('chatbot')
      .update({
        botConfig: newBotConfig,
      })
      .eq('id', botId)

    if (error) throw new Error(error.message)

    console.log('Settings updated successfully')
    return new Response(JSON.stringify(data))
  } catch (error) {
    console.error('Error:', error.message)
    return new Response(JSON.stringify({ message: error.message }), {
      status: 400,
    })
  }
}
