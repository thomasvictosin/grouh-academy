import { NextResponse } from 'next/server'
import { getCurrentUserId } from '@/lib/route-guards'
import { getPrisma } from '@/lib/prisma'
import { createSupabaseAdminClient } from '@/lib/supabase/admin'
import { getPlatformSettings } from '@/lib/platform-settings'

const ALLOWED_TYPES = ['image/png', 'image/jpeg', 'image/webp']

export async function POST(request: Request) {
  try {
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

    const settings = await getPlatformSettings()
    const maxBytes = settings.maxUploadSizeMb * 1024 * 1024

    if (file.size > maxBytes) {
      return NextResponse.json({ error: `Image must be under ${settings.maxUploadSizeMb}MB.` }, { status: 400 })
    }

    const extension = file.type === 'image/png' ? 'png' : file.type === 'image/webp' ? 'webp' : 'jpg'
    const path = `${userId}/avatar.${extension}`

    // Creating the admin client can throw if env vars are missing — now
    // safely inside the try block so it always returns JSON, never crashes
    // into an empty response body.
    const supabaseAdmin = createSupabaseAdminClient()
    const arrayBuffer = await file.arrayBuffer()

    const { error: uploadError } = await supabaseAdmin.storage
      .from('avatars')
      .upload(path, arrayBuffer, { contentType: file.type, upsert: true })

    if (uploadError) {
      console.error('Avatar upload failed:', uploadError)
      return NextResponse.json({ error: `Unable to upload image: ${uploadError.message}` }, { status: 500 })
    }

    const { data: publicUrlData } = supabaseAdmin.storage.from('avatars').getPublicUrl(path)
    const avatarUrl = `${publicUrlData.publicUrl}?v=${Date.now()}`

    const prisma = getPrisma()
    await prisma.user.update({ where: { id: userId }, data: { avatarUrl } })

    return NextResponse.json({ avatarUrl })
  } catch (error) {
    console.error('Unhandled error in avatar upload route:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unable to upload image.' },
      { status: 500 },
    )
  }
}