import { fetchCompraAgil } from '../shared/fetchCompraAgil';
import { listarCompraAgilConSnapshot } from '../shared/listarCompraAgilConSnapshot';
import { normalizarCompraAgilEntidad } from '@/lib/mercado-publico/normalizarCompraAgilEntidad';

const CACHE_TAG = 'mp-compra-agil';

export async function listarComprasAgiles(opciones = {}) {
  return listarCompraAgilConSnapshot(opciones);
}

export async function obtenerDetalleCompraAgil(codigoCompraAgil) {
  const respuestaApi = await fetchCompraAgil(`/v2/compra-agil/${codigoCompraAgil}`, {
    cacheTag: CACHE_TAG,
  });
  const crudo = respuestaApi?.payload ?? respuestaApi;
  const item = Array.isArray(crudo?.items) ? crudo.items[0] : crudo;
  return normalizarCompraAgilEntidad(item);
}
