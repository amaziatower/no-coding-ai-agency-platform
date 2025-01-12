import { Pinecone } from '@pinecone-database/pinecone'
import { NextResponse } from 'next/server'

const apiKey = process.env.PINECONE_API_KEY
const indexName = process.env.PINECONE_INDEX_NAME

export async function DELETE(req: Request) {
  const body = await req.json()
  const { namespace } = body

  console.log('Namespace', namespace)

  if (!namespace) {
    return NextResponse.json(
      { error: 'Namespace is required' },
      { status: 400 },
    )
  }

  try {
    const pc = new Pinecone({ apiKey: apiKey })
    const index = pc.Index(indexName)
    await index.namespace(namespace).deleteAll()

    return NextResponse.json(
      { message: 'Knowledge base reset successfully' },
      { status: 200 },
    )
  } catch (error) {
    console.error('Error resetting knowledge base:', error)
    return NextResponse.json(
      { error: 'Failed to reset knowledge base' },
      { status: 500 },
    )
  }
}
