import { revalidateTag } from 'next/cache';
import { NextResponse } from 'next/server';

export async function GET(request) {
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ success: false, error: 'No autorizado' }, { status: 401 });
  }

  try {
    // Next.js hará una petición real a la TGR.
    revalidateTag('datos-tgr');
    return NextResponse.json({ success: true, message: 'Caché de TGR sincronizada correctamente' });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Error al sincronizar' }, { status: 500 });
  }
}
