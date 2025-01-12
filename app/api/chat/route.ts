// pages/api/chatbot/[botId]/chat.ts
import { NextRequest, NextResponse } from 'next/server'
import axios from 'axios'

export async function POST(request: Request, { params }) {
  const apiKey = process.env.SERVER_API_KEY
  const apiUrl = process.env.OLLABOT_SERVER

  const formData = new FormData()
  const body = await request.formData()
  const markdownContent = `

  ### Key Features

  1. **Answer Questions**: Get information about our services and features.
  2. **Guidance**: Assist users through setup and usage.
  3. **Troubleshooting**: Help resolve issues and challenges.
  4. **Tips & Best Practices**: Offer advice for optimal use.
  5. **Resources**: Direct users to [Ollabot Documentation](https://app.ollabot.com/docs).
  6. **Account Management**: Update profiles and manage subscriptions.
  7. **General Support**: Ensure a smooth and enjoyable experience.
  8. https://app.ollabot.com/docs
  `
  formData.append('bot_id', 'ollabot-services')
  formData.append('message', body.get('message'))
  formData.append('description', body.get('description'))
  formData.append('company_name', body.get('company_name'))

  const file = body.get('file')
  if (file) {
    formData.append('file', file)
  }
  try {
    console.log(apiUrl)
    console.log(apiKey)
    console.log(formData)
    const response = await axios.post(`${apiUrl}/chat`, formData, {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'multipart/form-data',
      },
    })
    // const response = { data: { content: markdownContent } }

    return new Response(JSON.stringify(response.data), { status: 200 })
  } catch (error) {
    console.error('Error sending message:', error)
    return new Response(JSON.stringify({ error: 'Error sending message' }), {
      status: 500,
    })
  }
}
