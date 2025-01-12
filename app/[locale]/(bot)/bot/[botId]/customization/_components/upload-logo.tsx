import { createClient } from '@supabase/supabase-js'
import type { Database, Tables, TablesInsert } from '@/types_db'

// Note: supabaseAdmin uses the SERVICE_ROLE_KEY which you must only use in a secure server-side context
// as it has admin privileges and overwrites RLS policies!
const supabaseAdmin = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
)

const supabase_url = process.env.NEXT_PUBLIC_SUPABASE_URL

async function uploadLogo(file, userId) {
  const filePath = `${userId}/logo.png` // Construct the file path in the bucket
  // Log the file name
  console.log('File Name:', file.name)

  console.log('File Path:', filePath)
  // Upload file to Supabase Storage
  const { data, error: uploadError } = await supabaseAdmin.storage
    .from('users')
    .upload(filePath, file, {
      upsert: true, // Optional: Allows overwriting of existing files
    })
  if (uploadError) {
    console.error('Error uploading file:', uploadError.message)

    throw new Error(uploadError.message)
  }

  const url =
    supabase_url + `/storage/v1/object/public/users/${userId}/logo.png` // Get the URL of the uploaded file

  console.log(`File uploaded successfully. ${url}`)
  return url // Return the URL to be used elsewhere in your application
}

export default uploadLogo
