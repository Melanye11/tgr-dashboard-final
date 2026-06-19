import { URL_FICHA_COMPRA_AGIL } from '@/config/mercado-publico';

export function urlFichaCompraAgil(codigo) {
  const codigoLimpio = String(codigo ?? '').trim();
  if (!codigoLimpio) return null;
  return `${URL_FICHA_COMPRA_AGIL}${encodeURIComponent(codigoLimpio)}`;
}