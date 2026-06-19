import { crearEntidadMp } from './entidadMp';

// Misma tabla de codigos que licitaciones, pero con estados propios de OC
const ESTADOS_ORDEN_COMPRA = {
  4: 'Enviada a Proveedor',
  5: 'En proceso',
  6: 'Aceptada',
  9: 'Cancelada',
  12: 'Recepción Conforme',
  13: 'Pendiente de Recepcionar',
  14: 'Recepcionada Parcialmente',
  15: 'Recepción Conforme Incompleta',
};

function desempaquetarItemOrdenCompra(itemCrudo) {
  return itemCrudo?.OrdenCompra ?? itemCrudo?.ordenCompra ?? itemCrudo;
}

function etiquetaEstadoOrdenCompra(item) {
  const texto = item?.Estado ?? item?.estado;
  if (texto) return texto;

  const codigo = item?.CodigoEstado ?? item?.codigoEstado;
  if (codigo == null || codigo === '') return '';

  const codigoNumerico = Number(codigo);
  return (
    ESTADOS_ORDEN_COMPRA[codigoNumerico] ??
    ESTADOS_ORDEN_COMPRA[String(codigo)] ??
    `Estado ${codigo}`
  );
}

export function normalizarOrdenCompra(itemCrudo) {
  const item = desempaquetarItemOrdenCompra(itemCrudo);
  const comprador = item?.Comprador ?? item?.comprador ?? {};
  const proveedor = item?.Proveedor ?? item?.proveedor ?? {};
  const fechas = item?.Fechas ?? {};
  const itemsCrudos = item?.Items?.Listado ?? item?.items ?? [];

  return {
    ...crearEntidadMp({
      module: 'ordenes-compra',
      externalCode: item?.Codigo ?? item?.codigo,
      title: item?.Nombre ?? item?.nombre,
      description: item?.Descripcion ?? item?.descripcion,
      statusCode: item?.CodigoEstado ?? item?.codigoEstado,
      statusLabel: etiquetaEstadoOrdenCompra(item),
      buyerName: comprador?.NombreOrganismo ?? comprador?.nombreOrganismo,
      buyerRut: comprador?.RutUnidad ?? comprador?.rutUnidad,
      buyerRegion: comprador?.RegionUnidad ?? comprador?.regionUnidad,
      amount: item?.Total ?? item?.total ?? item?.TotalNeto ?? 0,
      currency: item?.TipoMoneda ?? item?.tipoMoneda ?? 'CLP',
      publishedAt:
        fechas?.FechaEnvio ??
        item?.FechaEnvio ??
        item?.fechaEnvio ??
        null,
      closingAt:
        fechas?.FechaAceptacion ??
        item?.FechaAceptacion ??
        item?.fechaAceptacion ??
        null,
      items: itemsCrudos,
      raw: item,
    }),
    relatedCode: item?.CodigoLicitacion ?? item?.codigoLicitacion ?? '',
    orderType: item?.Tipo ?? item?.tipo ?? '',
    amountNet: item?.TotalNeto ?? item?.totalNeto ?? 0,
    taxes: item?.Impuestos ?? item?.impuestos ?? 0,
    supplierName: proveedor?.Nombre ?? proveedor?.nombre ?? '',
    supplierRut: proveedor?.RutSucursal ?? proveedor?.rutSucursal ?? '',
    supplierStatusLabel:
      item?.EstadoProveedor ?? item?.estadoProveedor ?? '',
  };
}

export function normalizarListaOrdenesCompra(lista = []) {
  if (!Array.isArray(lista)) return [];
  return lista.map(normalizarOrdenCompra);
}