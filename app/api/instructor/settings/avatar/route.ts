import { NextResponse } from 'next/server'

import { getPlatformSettings } from '@/lib/platform-settings'
import { getPrisma } from '@/lib/prisma'
import { getCurrentUserId } from '@/lib/route-guards'
import { createSupabaseAdminClient } from '@/lib/supabase/admin'

const allowedTypes = ['image/png', 'image/jpeg', 'image/webp']

export async function POST(request: Request) {
  try {
    const userId = await getCurrentUserId()
    if (!userId) return NextResponse.json({ error: 'Authentication required.' }, { status: 401 })

    const formData = await request.formData().catch(() => null)
    const file = formData?.get('file')
    if (!(file instanceof File)) return NextResponse.json({ error: 'No image file was provided.' }, { status: 400 })
    if (!allowedTypes.includes(file.type)) return NextResponse.json({ error: 'Only PNG, JPEG, or WebP images are allowed.' }, { status: 400 })

    const platformSettings = await getPlatformSettings()
    if (file.size > platformSettings.maxUploadSizeMb * 1024 * 1024) {
      return NextResponse.json({ error: `Image must be under ${platformSettings.maxUploadSizeMb}MB.` }, { status: 400 })
    }

    const extension = file.type === 'image/png' ? 'png' : file.type === 'image/webp' ? 'webp' : 'jpg'
    const path = `${userId}/instructor-avatar.${extension}`
    const storage = createSupabaseAdminClient().storage.from('avatars')
    const { error: uploadError } = await storage.upload(path, await file.arrayBuffer(), { contentType: file.type, upsert: true })
    if (uploadError) return NextResponse.json({ error: `Unable to upload image: ${uploadError.message}` }, { status: 500 })

    const { data } = storage.getPublicUrl(path)
    const avatarUrl = `${data.publicUrl}?v=${Date.now()}`
    await getPrisma().user.update({ where: { id: userId }, data: { avatarUrl } })
    return NextResponse.json({ avatarUrl })
  } catch (error) {
    console.error('Instructor avatar upload failed:', error)
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Unable to upload image.' }, { status: 500 })
  }
}
