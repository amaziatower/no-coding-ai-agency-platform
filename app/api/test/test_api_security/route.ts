// src/app/api/test/test_api_key.ts

import { NextResponse } from 'next/server'
import axios from 'axios'

export async function GET() {
  const apiKey = process.env.SERVER_API_KEY
  try {
    const response = await axios.get('http://127.0.0.1:8080/test_api_key', {
      headers: {
        Authorization: `Bearer ${apiKey}`, // Using Authorization header with Bearer token
      },
    })
    console.log('Response returned.')
    return NextResponse.json(response.data)
  } catch (error) {
    console.error('Failed to fetch API key:', error)
    return NextResponse.json(
      { error: 'Failed to fetch API key' },
      { status: 500 },
    )
  }
}
