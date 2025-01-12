// /pages/api/embed.js
import { NextResponse } from 'next/server'

export async function GET(request) {
  const htmlContent = `
    <div style="background-color: #f0f0f0; padding: 20px;">
      <h2>Embedded Component</h2>
      <p>This is a dynamically embedded component.</p>
    </div>
  `

  const response = new NextResponse(htmlContent, {
    headers: {
      'Content-Type': 'text/html',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  })

  return response
}

export async function OPTIONS() {
  return new Response(null, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Max-Age': '86400', // Cache preflight response for 1 day
    },
  })
}
