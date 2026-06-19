import { NextResponse } from 'next/server';
import { listarLicitaciones } from '@/services/mercado-publico/licitaciones';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);

    const resultado = await listarLicitaciones({
      fecha: searchParams.get('fecha') ?? undefined,
      estado: searchParams.get('estado') ?? undefined,
      codigoOrganismo: searchParams.get('codigoOrganismo') ?? undefined,
    });

    return NextResponse.json({
      success: true,
      count: resultado.filas.length,
      data: resultado.filas,
      meta: {
        totalRegistros: resultado.totalRegistros,
        fechaUsada: resultado.fechaUsada,
        // true cuando el listado viene del JSON en data/cache
        //  no de la API del día
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