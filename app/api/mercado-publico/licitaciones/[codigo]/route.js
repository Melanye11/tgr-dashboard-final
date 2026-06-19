import { NextResponse } from 'next/server';
import { obtenerDetalleLicitacion } from '@/services/mercado-publico/licitaciones';

export async function GET(_request, { params }) {
  try {
    const detalle = await obtenerDetalleLicitacion(params.codigo);

    if (!detalle) {
      return NextResponse.json(
        { success: false, error: 'Licitación no encontrada' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: detalle });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message || 'Error interno' },
      { status: 500 }
    );
  }
}