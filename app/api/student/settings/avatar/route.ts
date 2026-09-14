import { NextResponse } from 'next/server'
import { getCurrentUserId } from '@/lib/route-guards'
import { getPrisma } from '@/lib/prisma'
import { createSupabaseAdminClient } from '@/lib/supabase/admin'

const ALLOWED_TYPES = ['image/png', 'image/jpeg', 'image/webp']
const MAX_BYTES = 5 * 1024 * 1024 // 5MB

export async function POST(request: Request) {
  const userId = await getCurrentUserId()
  if (!userId) {
    return NextResponse.json({ error: 'Authentication required.' }, { status: 401 })
  }

  const formData = await request.formData().catch(() => null)
  const file = formData?.get('file')

  if (!(file instanceof File)) {
    return NextResponse.json({ error: 'No file provided.' }, { status: 400 })
  }

  if (!ALLOWED_TYPES.includes(file.type)) {
    return NextResponse.json({ error: 'Only PNG, JPEG, or WebP images are allowed.' }, { status: 400 })
  }

  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: 'Image must be under 5MB.' }, { status: 400 })
  }

  const extension = file.type === 'image/png' ? 'png' : file.type === 'image/webp' ? 'webp' : 'jpg'
  const path = `${userId}/avatar.${extension}`

  const supabaseAdmin = createSupabaseAdminClient()
  const arrayBuffer = await file.arrayBuffer()

  const { error: uploadError } = await supabaseAdmin.storage
    .from('avatars')
    .upload(path, arrayBuffer, { contentType: file.type, upsert: true })

  if (uploadError) {
    console.error('Avatar upload failed:', uploadError)
    return NextResponse.json({ error: 'Unable to upload image.' }, { status: 500 })
  }

  const { data: publicUrlData } = supabaseAdmin.storage.from('avatars').getPublicUrl(path)
  const avatarUrl = `${publicUrlData.publicUrl}?v=${Date.now()}` // cache-bust so the new photo shows immediately

  const prisma = getPrisma()

  try {
    await prisma.user.update({ where: { id: userId }, data: { avatarUrl } })
    return NextResponse.json({ avatarUrl })
  } catch (error) {
    console.error('Failed to save avatar URL:', error)
    return NextResponse.json({ error: 'Unable to save avatar.' }, { status: 500 })
  }
}