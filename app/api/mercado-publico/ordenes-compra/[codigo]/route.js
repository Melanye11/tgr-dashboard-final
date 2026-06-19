import { NextResponse } from 'next/server';
import { obtenerDetalleOrdenCompra } from '@/services/mercado-publico/ordenes-compra';

export async function GET(_request, { params }) {
  try {
    const detalle = await obtenerDetalleOrdenCompra(params.codigo);

    if (!detalle) {
      return NextResponse.json(
        { success: false, error: 'Orden de compra no encontrada' },
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