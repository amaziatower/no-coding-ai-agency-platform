import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { Database } from '@/types_db'
import crypto from 'crypto'

function generateApiKey() {
  return `sk-v1-${crypto.randomBytes(32).toString('hex')}`
}

export async function POST(req: Request) {
  const supabase = createRouteHandlerClient<Database>({ cookies })

  try {
    console.log('Attempting to get user session...')
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session?.user) {
      console.log('Unauthorized access attempt.')
      return new Response(JSON.stringify({ message: 'Unauthorized' }), {
        status: 401,
      })
    }

    const newApiKey = generateApiKey()
    console.log('Generated new API key:', newApiKey)

    console.log('Updating user record with new API key...')
    const { error: updateError } = await supabase
      .from('users')
      .update({ secret_key: newApiKey })
      .eq('id', session.user.id)

    if (updateError) {
      console.log('Failed to update user record:', updateError.message)
      return new Response(
        JSON.stringify({ message: 'Failed to generate API key' }),
        { status: 500 },
      )
    }

    console.log('API key generated and saved successfully.')
    return new Response(JSON.stringify({ api_key: newApiKey }), { status: 201 })
  } catch (error) {
    console.error('Server error:', error)
    return new Response(
      JSON.stringify({ message: 'Server error', details: error.toString() }),
      { status: 500 },
    )
  }
}
