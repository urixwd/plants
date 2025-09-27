import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    const plantInstanceId = formData.get('plantInstanceId') as string
    const caption = formData.get('caption') as string
    const isMainPhoto = formData.get('isMainPhoto') === 'true'

    if (!file || !plantInstanceId) {
      return NextResponse.json(
        { error: 'File and plantInstanceId are required' },
        { status: 400 }
      )
    }

    const supabaseAdmin = getSupabaseAdmin()

    // Generate unique filename
    const fileExt = file.name.split('.').pop()
    const fileName = `${plantInstanceId}/${Date.now()}.${fileExt}`

    // Upload to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabaseAdmin.storage
      .from('plant-photos')
      .upload(fileName, file)

    if (uploadError) {
      console.error('Storage upload error:', uploadError)
      return NextResponse.json(
        { error: 'Failed to upload file to storage' },
        { status: 500 }
      )
    }

    // Get public URL
    const { data: urlData } = supabaseAdmin.storage
      .from('plant-photos')
      .getPublicUrl(uploadData.path)

    // If this is a main photo, unset any existing main photo first
    if (isMainPhoto) {
      await supabaseAdmin
        .from('plant_photos')
        .update({ is_main_photo: false })
        .eq('plant_instance_id', plantInstanceId)
        .eq('is_main_photo', true)
    }

    // Save photo record to database
    const photoRecord = {
      plant_instance_id: plantInstanceId,
      photo_url: urlData.publicUrl,
      caption: caption || null,
      is_main_photo: isMainPhoto,
    }

    const { data, error } = await supabaseAdmin
      .from('plant_photos')
      .insert(photoRecord)
      .select()
      .single()

    if (error) {
      console.error('Database insert error:', error)
      return NextResponse.json(
        { error: 'Failed to save photo record' },
        { status: 500 }
      )
    }

    // Transform response to camelCase
    const transformedPhoto = {
      idAuto: data.id_auto,
      id: data.id,
      plantInstanceId: data.plant_instance_id,
      photoUrl: data.photo_url,
      caption: data.caption,
      photoDate: data.photo_date,
      isMainPhoto: data.is_main_photo,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    }

    return NextResponse.json({ photo: transformedPhoto })
  } catch (error) {
    console.error('Photo upload error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}