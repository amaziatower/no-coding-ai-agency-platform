import { NextResponse } from 'next/server'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'


export async function DELETE(request, context) {
  const supabase = createRouteHandlerClient({ cookies })
  const { params } = context
  const botId = params.botId
  console.log('Bot ID', botId)

  if (!botId) {
    return NextResponse.json({ error: 'Bot ID is required' }, { status: 400 })
  }

  try {
    const { error } = await supabase
      .from('chatbot')
      .update({ botConfig: null })
      .eq('id', botId)

    if (error) throw new Error(error.message)

    return NextResponse.json(
      { message: 'Bot configuration reset successfully' },
      { status: 200 },
    )
  } catch (error) {
    console.error('Error resetting bot configuration:', error)
    return NextResponse.json(
      { error: 'Failed to reset bot configuration' },
      { status: 500 },
    )
  }
}
