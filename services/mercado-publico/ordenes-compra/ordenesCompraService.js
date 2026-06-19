import { fetchMercadoPublicoLegacy } from '../shared/fetchMercadoPublicoLegacy';
import { extraerDetalleLegacy } from '../shared/extraerListadoLegacy';
import { listarLegacyConSnapshot } from '../shared/listarLegacyConSnapshot';
import {
  normalizarOrdenCompra,
  normalizarListaOrdenesCompra,
} from '@/lib/mercado-publico/normalizarOrdenCompra';

const CACHE_TAG = 'mp-ordenes-compra';

export async function listarOrdenesCompra({
  fecha,
  estado,
  codigoOrganismo,
  codigoProveedor,
} = {}) {
  return listarLegacyConSnapshot({
    modulo: 'ordenes-compra',
    ruta: '/ordenesdecompra.json',
    cacheTag: CACHE_TAG,
    fecha,
    parametrosBase: {
      // Sin 'todos' la API legacy devuelve error en algunos entornos
      estado: estado ?? 'todos',
      codigoOrganismo,
      codigoProveedor,
    },
    normalizarLista: normalizarListaOrdenesCompra,
  });
}

export async function obtenerDetalleOrdenCompra(codigo) {
  // Igual que licitaciones 
  // snapshot no incluye detalle por código
  const respuestaApi = await fetchMercadoPublicoLegacy('/ordenesdecompra.json', {
    cacheTag: CACHE_TAG,
    parametros: { codigo },
  });

  const itemCrudo = extraerDetalleLegacy(respuestaApi);
  if (!itemCrudo) return null;

  return normalizarOrdenCompra(itemCrudo);
}