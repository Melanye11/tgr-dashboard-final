import { fetchCompraAgil } from './fetchCompraAgil';
import { leerSnapshotMp, actualizarSnapshotMp } from './snapshotMp';
import { limitarFilasRecientes, LIMITE_FILAS_LEGACY } from '@/lib/mercado-publico/limitarFilasMp';
import { normalizarListaCompraAgilEntidad } from '@/lib/mercado-publico/normalizarCompraAgilEntidad';
import { filtrarFilasValidas } from '@/lib/mercado-publico/fusionarFilasMp';

function extraerListaCompraAgil(respuestaApi) {
  const candidatos = [
    respuestaApi?.payload?.items,
    respuestaApi?.payload?.compras_agiles,
    respuestaApi?.payload?.registros,
    respuestaApi?.payload,
    respuestaApi?.data,
    respuestaApi?.items,
  ];

  for (const candidato of candidatos) {
    if (Array.isArray(candidato)) return candidato;
  }

  return [];
}

function extraerPaginacion(respuestaApi) {
  return respuestaApi?.payload?.paginacion ?? respuestaApi?.paginacion ?? null;
}

function obtenerRangoPublicacion(diasAtras = 7) {
  const hasta = new Date();
  const desde = new Date();
  desde.setDate(hasta.getDate() - diasAtras);
  desde.setUTCHours(0, 0, 0, 0);
  hasta.setUTCHours(23, 59, 59, 0);

  const formatear = (fecha) => fecha.toISOString().replace(/\.\d{3}Z$/, 'Z');

  return {
    publicado_desde: formatear(desde),
    publicado_hasta: formatear(hasta),
  };
}

export async function listarCompraAgilConSnapshot({
  estado = '',
  region = '',
  textoBusqueda = '',
  pagina = 1,
  tamanoPagina = 50,
  diasAtras = 7,
  limite = LIMITE_FILAS_LEGACY,
} = {}) {
  const rango = obtenerRangoPublicacion(diasAtras);
  const fechaUsada = rango.publicado_hasta;

  try {
    const respuestaApi = await fetchCompraAgil('/v2/compra-agil', {
      cacheTag: 'mp-compra-agil',
      parametros: {
        ...rango,
        estado,
        region,
        q: textoBusqueda,
        numero_pagina: pagina,
        tamano_pagina: Math.min(tamanoPagina, 50),
        ordenar_por: 'FechaPublicacion',
      },
    });

    const filasNormalizadas = normalizarListaCompraAgilEntidad(
      extraerListaCompraAgil(respuestaApi)
    );
    const filasNuevas = filtrarFilasValidas(filasNormalizadas);
    const paginacion = extraerPaginacion(respuestaApi);

    if (filasNuevas.length > 0) {
      const snapshot = await actualizarSnapshotMp('compra-agil', {
        filasNuevas,
        fechaUsada,
      });

      const filasUi = limitarFilasRecientes(snapshot.filas, limite);

      return {
        filas: filasUi,
        paginaActual: pagina,
        tamanoPagina,
        totalRegistros: snapshot.totalRegistros,
        paginacion,
        fechaUsada,
        desdeCache: false,
      };
    }
  } catch (error) {
    console.warn('[compra-agil] API sin datos o error:', error.message);
  }

  const snapshot = await leerSnapshotMp('compra-agil');
  const filas = limitarFilasRecientes(snapshot.filas, limite);

  return {
    filas,
    paginaActual: pagina,
    tamanoPagina,
    totalRegistros: snapshot.totalRegistros ?? snapshot.filas.length,
    paginacion: null,
    fechaUsada: snapshot.fechaUsada || fechaUsada,
    desdeCache: filas.length > 0,
  };
}