import { NextResponse } from 'next/server';
import { listarComprasAgiles } from '@/services/mercado-publico/compra-agil';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);

    const resultado = await listarComprasAgiles({
      estado: searchParams.get('estado') ?? '',
      region: searchParams.get('region') ?? '',
      textoBusqueda: searchParams.get('q') ?? '',
      pagina: Number(searchParams.get('pagina') ?? 1),
      tamanoPagina: Number(searchParams.get('tamano') ?? 50),
    });

    return NextResponse.json({
      success: true,
      count: resultado.filas.length,
      data: resultado.filas,
      meta: {
        paginaActual: resultado.paginaActual,
        tamanoPagina: resultado.tamanoPagina,
        totalRegistros: resultado.totalRegistros,
        paginacion: resultado.paginacion,
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