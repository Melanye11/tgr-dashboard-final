import { NextResponse } from 'next/server';
import { listarOrdenesCompra } from '@/services/mercado-publico/ordenes-compra';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);

    const resultado = await listarOrdenesCompra({
      fecha: searchParams.get('fecha') ?? undefined,
      estado: searchParams.get('estado') ?? undefined,
      codigoOrganismo: searchParams.get('codigoOrganismo') ?? undefined,
      codigoProveedor: searchParams.get('codigoProveedor') ?? undefined,
    });

    return NextResponse.json({
      success: true,
      count: resultado.filas.length,
      data: resultado.filas,
      meta: {
        totalRegistros: resultado.totalRegistros,
        fechaUsada: resultado.fechaUsada,
        desdeCache: resultado.desdeCache,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message || 'Error interno' },
      { status: 500 }
    );
  }
}