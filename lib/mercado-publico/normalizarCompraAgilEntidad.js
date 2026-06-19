import { crearEntidadMp } from './entidadMp';

// Compra agil usa la API v2 (snake_case) 
// el resto del front sigue la misma entidad normalizada
export function normalizarCompraAgilEntidad(itemCrudo) {
  const estado = itemCrudo?.estado ?? {};
  const fechas = itemCrudo?.fechas ?? {};
  const montos = itemCrudo?.montos ?? {};
  const institucion = itemCrudo?.institucion ?? {};
  const organismo = institucion.organismo_comprador;

  return crearEntidadMp({
    module: 'compra-agil',
    externalCode: itemCrudo?.codigo,
    title: itemCrudo?.nombre,
    description: itemCrudo?.descripcion,
    statusCode: estado?.codigo,
    statusLabel: estado?.glosa,
    buyerName:
      typeof organismo === 'string' ? organismo : organismo?.nombre,
    buyerRut: institucion?.rut,
    buyerRegion: institucion?.nombre_region ?? institucion?.region,
    amount: montos?.monto_disponible_clp ?? montos?.monto_disponible,
    currency: montos?.moneda,
    publishedAt: fechas?.fecha_publicacion,
    closingAt: fechas?.fecha_cierre,
    items: itemCrudo?.documentos ?? [],
    raw: itemCrudo,
  });
}

export function normalizarListaCompraAgilEntidad(lista = []) {
  if (!Array.isArray(lista)) return [];
  return lista.map(normalizarCompraAgilEntidad);
}