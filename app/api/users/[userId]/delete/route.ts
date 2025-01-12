import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { z } from 'zod'
import { Database } from '@/types/db'
import { createClient } from '@supabase/supabase-js'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || '',
)
const routeContextSchema = z.object({
  params: z.object({
    userId: z.string(),
  }),
})

export async function POST(
  req: Request,
  context: z.infer<typeof routeContextSchema>,
) {
  const supabase = createRouteHandlerClient<Database>({
    cookies,
  })

  try {
    // Validate the route context.
    const { params } = routeContextSchema.parse(context)

    // Ensure user is authenticated and has access to this user.
    const {
      data: { session },
    } = await supabase.auth.getSession()
    if (!session?.user || params.userId !== session?.user.id) {
      return new Response(null, { status: 403 })
    }

    // Delete the user from the 'public.users' table.
    const { error: deleteUserError } = await supabaseAdmin
      .from('users')
      .delete()
      .eq('id', params.userId)

    if (deleteUserError) {
      console.error('Error deleting user from public schema:', deleteUserError)
      throw deleteUserError
    }

    // Sign out the user
    const { error: signOutError } = await supabase.auth.signOut()
    if (signOutError) {
      console.error('Error signing out user:', signOutError)
      throw signOutError
    }

    // // Optionally, handle related entries in the 'public' schema
    // await supabaseAdmin.from('chatbot').delete().eq('user_id', params.userId);
    // await supabaseAdmin.from('customers').delete().eq('id', params.userId);
    // await supabaseAdmin.from('subscriptions').delete().eq('user_id', params.userId);

    return new Response(
      JSON.stringify({ message: 'Account deleted successfully' }),
      { status: 200 },
    )
  } catch (error) {
    console.error('Unexpected error:', error)
    if (error instanceof z.ZodError) {
      return new Response(JSON.stringify(error.issues), { status: 422 })
    }

    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    })
  }
}
