import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'
import fs from 'fs'
import path from 'path'

// Handle preflight requests for CORS
export async function OPTIONS(request: NextRequest) {
  return new Response(null, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  })
}

const openai_api_key = process.env.OPENAI_API_KEY

const openai = new OpenAI({
  apiKey: openai_api_key,
})

export async function POST(
  request: NextRequest,
  { params }: { params: { botId: string } },
) {
  const { botId } = params

  try {
    const { audio } = await request.json()
    const audioBuffer = Buffer.from(audio, 'base64')

    const filePath = path.join('/tmp', 'input.wav')
    fs.writeFileSync(filePath, audioBuffer)

    const readStream = fs.createReadStream(filePath)

    const transcription = await openai.audio.transcriptions.create({
      model: 'whisper-1',
      file: readStream,
    })

    fs.unlinkSync(filePath)

    return NextResponse.json({ transcription: transcription.text }, {
      headers: {
        'Access-Control-Allow-Origin': '*', // Allow all origins
      },
    })
  } catch (error) {
    console.error('Error transcribing audio:', error)
    return NextResponse.json(
      { error: 'Error transcribing audio' },
      { status: 500 }
    )
  }
}
