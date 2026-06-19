import { revalidateTag } from 'next/cache';
import { NextResponse } from 'next/server';
import { getApiById } from '@/config/apis';


export async function GET(request) {
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ success: false, error: 'No autorizado' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const apiId = searchParams.get('api') || 'tgr';
    const api = getApiById(apiId);

    if (!api) {
      return NextResponse.json({ success: false, error: 'API no encontrada' }, { status: 404 });
    }

    revalidateTag(api.cacheTag);
    return NextResponse.json({
      success: true,
      message: `Caché de ${api.name} sincronizada correctamente`,
    });

  } catch (error) {
    return NextResponse.json({ success: false, error: 'Error al sincronizar' }, { status: 500 });
  }
}
