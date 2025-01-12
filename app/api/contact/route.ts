// pages/api/chatbot/[botId]/chat.ts
import { NextRequest, NextResponse } from 'next/server'
import axios from 'axios'

export async function POST(request: Request, { params }) {
  const apiKey = process.env.SERVER_API_KEY
  const apiUrl = process.env.OLLABOT_SERVER

  const formData = new FormData()
  const body = await request.formData()

  formData.append('bot_id', body.get('botId'))
  formData.append('message', body.get('message'))
  formData.append('description', body.get('description'))

  const file = body.get('file')
  if (file) {
    formData.append('file', file)
  }

  try {
    const response = await axios.post(`${apiUrl}/chat`, formData, {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'multipart/form-data',
      },
    })

    return new Response(JSON.stringify(response.data), { status: 200 })
  } catch (error) {
    console.error('Error sending message:', error)
    return new Response(JSON.stringify({ error: 'Error sending message' }), {
      status: 500,
    })
  }
}
