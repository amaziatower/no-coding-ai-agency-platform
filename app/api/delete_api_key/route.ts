import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { Database } from '@/types_db'

export async function DELETE(req: Request) {
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

    console.log('Deleting API key from user record...')
    const { error: updateError } = await supabase
      .from('users')
      .update({ secret_key: null })
      .eq('id', session.user.id)

    if (updateError) {
      console.log('Failed to delete API key:', updateError.message)
      return new Response(
        JSON.stringify({ message: 'Failed to delete API key' }),
        { status: 500 },
      )
    }

    console.log('API key deleted successfully.')
    return new Response(
      JSON.stringify({ message: 'API key deleted successfully' }),
      { status: 200 },
    )
  } catch (error) {
    console.error('Server error:', error)
    return new Response(
      JSON.stringify({ message: 'Server error', details: error.toString() }),
      { status: 500 },
    )
  }
}
