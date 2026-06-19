import { fetchMercadoPublicoLegacy } from '../shared/fetchMercadoPublicoLegacy';
import { extraerDetalleLegacy } from '../shared/extraerListadoLegacy';
import { listarLegacyConSnapshot } from '../shared/listarLegacyConSnapshot';
import {
  normalizarLicitacion,
  normalizarListaLicitaciones,
} from '@/lib/mercado-publico/normalizarLicitacion';

const CACHE_TAG = 'mp-licitaciones';

export async function listarLicitaciones({ fecha, estado, codigoOrganismo } = {}) {
  return listarLegacyConSnapshot({
    modulo: 'licitaciones',
    ruta: '/licitaciones.json',
    cacheTag: CACHE_TAG,
    fecha,
    parametrosBase: { estado, codigoOrganismo },
    normalizarLista: normalizarListaLicitaciones,
  });
}

export async function obtenerDetalleLicitacion(codigo) {
  // Detalle siempre en vivo el snapshot solo guarda filas de listado
  const respuestaApi = await fetchMercadoPublicoLegacy('/licitaciones.json', {
    cacheTag: CACHE_TAG,
    parametros: { codigo },
  });

  const itemCrudo = extraerDetalleLegacy(respuestaApi);
  if (!itemCrudo) return null;

  return normalizarLicitacion(itemCrudo);
}