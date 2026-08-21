import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getTenantContext } from '@/lib/tenant';
import { vinAuditClient } from '@/lib/providers/vinaudit/client';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const tenant = await getTenantContext();
    const { id } = await params;

    const photos = await prisma.vehiclePhoto.findMany({
      where: { vehicleId: id, vehicle: { organizationId: tenant.organizationId } },
      orderBy: { orderIndex: 'asc' },
    });

    return NextResponse.json(photos);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const tenant = await getTenantContext();
    const { id } = await params;
    const body = await req.json();
    const { action, url, caption, photoId } = body;

    const vehicle = await prisma.vehicle.findUnique({
      where: { id },
    });

    if (!vehicle || vehicle.organizationId !== tenant.organizationId) {
      return NextResponse.json({ error: 'Vehicle not found' }, { status: 404 });
    }

    // Action: ADD
    if (action === 'ADD' || !action) {
      if (!url) {
        return NextResponse.json({ error: 'Photo URL is required' }, { status: 400 });
      }

      const count = await prisma.vehiclePhoto.count({ where: { vehicleId: id } });
      const photo = await prisma.vehiclePhoto.create({
        data: {
          vehicleId: id,
          url,
          caption: caption || null,
          isCover: count === 0,
          orderIndex: count,
        },
      });

      return NextResponse.json({ success: true, photo });
    }

    // Action: SET_COVER
    if (action === 'SET_COVER') {
      if (!photoId) return NextResponse.json({ error: 'photoId is required' }, { status: 400 });

      await prisma.vehiclePhoto.updateMany({
        where: { vehicleId: id },
        data: { isCover: false },
      });

      const updated = await prisma.vehiclePhoto.update({
        where: { id: photoId },
        data: { isCover: true },
      });

      return NextResponse.json({ success: true, photo: updated });
    }

    // Action: DELETE
    if (action === 'DELETE') {
      if (!photoId) return NextResponse.json({ error: 'photoId is required' }, { status: 400 });

      await prisma.vehiclePhoto.delete({
        where: { id: photoId },
      });

      return NextResponse.json({ success: true });
    }

    // Action: REMOVE_BACKGROUND
    if (action === 'REMOVE_BACKGROUND') {
      if (!photoId) return NextResponse.json({ error: 'photoId is required' }, { status: 400 });

      const photo = await prisma.vehiclePhoto.findUnique({ where: { id: photoId } });
      if (!photo) return NextResponse.json({ error: 'Photo not found' }, { status: 404 });

      const bgResult = await vinAuditClient.removeBackground({
        imageUrl: photo.url,
        organizationId: tenant.organizationId,
      });

      const updated = await prisma.vehiclePhoto.update({
        where: { id: photoId },
        data: {
          thumbnailUrl: bgResult.processedImageUrl,
          caption: `${photo.caption || 'Studio Enhanced'} (Background Processed)`,
        },
      });

      return NextResponse.json({ success: true, photo: updated, bgResult });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
