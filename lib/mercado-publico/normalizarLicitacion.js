import { crearEntidadMp } from './entidadMp';

// Códigos numéricos según documentación MP; si falta glosa en la respuesta, resolvemos acá
const ESTADOS_LICITACION = {
  5: 'Publicada',
  6: 'Cerrada',
  7: 'Desierta',
  8: 'Adjudicada',
  18: 'Revocada',
  19: 'Suspendida',
};

function desempaquetarItemLicitacion(itemCrudo) {
  // En listados viene { Licitacion: {...} }; en detalle por código a veces viene plano
  return itemCrudo?.Licitacion ?? itemCrudo?.licitacion ?? itemCrudo;
}

function etiquetaEstadoLicitacion(itemCrudo) {
  const texto =
    itemCrudo?.Estado ??
    itemCrudo?.estado ??
    itemCrudo?.EstadoLicitacion;

  if (texto) return texto;

  const codigo = itemCrudo?.CodigoEstado ?? itemCrudo?.codigoEstado;
  if (codigo == null || codigo === '') return '';

  const codigoNumerico = Number(codigo);
  return (
    ESTADOS_LICITACION[codigoNumerico] ??
    ESTADOS_LICITACION[String(codigo)] ??
    `Estado ${codigo}`
  );
}

export function normalizarLicitacion(itemCrudo) {
  const item = desempaquetarItemLicitacion(itemCrudo);
  const comprador = item?.Comprador ?? item?.comprador ?? {};
  const fechas = item?.Fechas ?? {};
  const itemsCrudos = item?.Items?.Listado ?? item?.items ?? [];

  return crearEntidadMp({
    module: 'licitaciones',
    externalCode: item?.CodigoExterno ?? item?.codigo,
    title: item?.Nombre ?? item?.nombre,
    description: item?.Descripcion ?? item?.descripcion,
    statusCode: item?.CodigoEstado ?? item?.codigoEstado,
    statusLabel: etiquetaEstadoLicitacion(item),
    buyerName: comprador?.NombreOrganismo ?? comprador?.nombreOrganismo,
    buyerRut: comprador?.RutUnidad ?? comprador?.rutUnidad,
    buyerRegion: comprador?.RegionUnidad ?? comprador?.regionUnidad,
    amount: item?.MontoEstimado ?? item?.montoEstimado ?? 0,
    currency: item?.Moneda ?? item?.moneda ?? 'CLP',
    publishedAt:
      fechas?.FechaPublicacion ??
      item?.FechaPublicacion ??
      item?.fechaPublicacion ??
      null,
    closingAt:
      fechas?.FechaCierre ??
      item?.FechaCierre ??
      item?.fechaCierre ??
      null,
    items: itemsCrudos,
    raw: item, // se usa en detalle/modal; se strippea al guardar snapshot
  });
}

export function normalizarListaLicitaciones(lista = []) {
  if (!Array.isArray(lista)) return [];
  return lista.map(normalizarLicitacion);
}