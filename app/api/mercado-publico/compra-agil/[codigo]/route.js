import { NextResponse } from 'next/server';
import { obtenerDetalleCompraAgil } from '@/services/mercado-publico/compra-agil';

export async function GET(_request, { params }) {
  try {
    const detalle = await obtenerDetalleCompraAgil(params.codigo);

    if (!detalle) {
      return NextResponse.json(
        { success: false, error: 'Compra ágil no encontrada' },
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