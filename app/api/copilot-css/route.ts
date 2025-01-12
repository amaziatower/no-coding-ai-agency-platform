import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

export async function GET(request: NextRequest) {
  const cssFilePath = path.join(process.cwd(), 'public', 'copilot.css')

  try {
    const data = fs.readFileSync(cssFilePath, 'utf8')
    return new NextResponse(data, {
      headers: {
        'Content-Type': 'text/css',
        'Access-Control-Allow-Origin': '*',
      },
    })
  } catch (err) {
    return new NextResponse('Failed to read CSS file', { status: 500 })
  }
}