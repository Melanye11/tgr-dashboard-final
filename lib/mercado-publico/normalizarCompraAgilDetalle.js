import { urlFichaCompraAgil } from './urlCompraAgil';

function normalizarDocumentos(documentos = []) {
  if (!Array.isArray(documentos)) return [];
  return documentos.map((doc) => ({
    id: doc?.id ?? null,
    nombre: doc?.nombre ?? 'Documento sin nombre',
  }));
}

function normalizarProductos(productos = []) {
  if (!Array.isArray(productos)) return [];
  return productos.map((producto) => ({
    codigoProducto: producto?.codigo_producto ?? null,
    nombre: producto?.nombre ?? '—',
    descripcion: producto?.descripcion ?? '',
    cantidad: producto?.cantidad ?? null,
    unidadMedida: producto?.unidad_medida ?? '',
  }));
}

function normalizarProveedores(proveedores = []) {
  if (!Array.isArray(proveedores)) return [];
  return proveedores.map((proveedor) => ({
    rut: proveedor?.rut ?? proveedor?.rut_proveedor ?? '',
    nombre: proveedor?.nombre ?? proveedor?.razon_social ?? '—',
    estado: proveedor?.estado ?? proveedor?.glosa ?? '',
  }));
}

/**
 * Detalle completo de Compra Ágil (endpoint por código).
 * Separado del normalizador de listado para no inflar snapshots ni la tabla.
 */
export function normalizarCompraAgilDetalle(respuestaApi) {
  const payload = respuestaApi?.payload ?? respuestaApi ?? {};
  const codigo = payload?.codigo ?? '';

  return {
    module: 'compra-agil',
    codigo,
    nombre: payload?.nombre ?? 'Sin título',
    descripcion: payload?.descripcion ?? '',

    estado: {
      glosa: payload?.estado?.glosa ?? 'Sin estado',
      codigo: payload?.estado?.codigo ?? '',
    },

    fechas: {
      publicacion: payload?.fechas?.fecha_publicacion ?? null,
      cierre: payload?.fechas?.fecha_cierre ?? null,
      ultimoCambio: payload?.fechas?.fecha_ultimo_cambio ?? null,
    },

    entrega: {
      direccion: payload?.entrega?.direccion_entrega ?? '',
      plazoDias: payload?.entrega?.plazo_entrega_dias ?? null,
    },

    documentos: normalizarDocumentos(payload?.documentos),
    urlFichaMercadoPublico: urlFichaCompraAgil(codigo),

    presupuesto: {
      montoDisponibleClp: payload?.presupuesto?.monto_disponible_clp ?? 0,
      montoDisponible: payload?.presupuesto?.monto_disponible ?? 0,
      presupuestoEstimado: payload?.presupuesto?.presupuesto_estimado ?? 0,
      moneda: payload?.presupuesto?.moneda ?? 'CLP',
      tipo: payload?.presupuesto?.tipo_presupuesto ?? '',
    },

    institucion: {
      organismoComprador:
        typeof payload?.institucion?.organismo_comprador === 'string'
          ? payload.institucion.organismo_comprador
          : payload?.institucion?.organismo_comprador?.nombre ?? '',
      rut: payload?.institucion?.rut ?? '',
      unidadCompra: payload?.institucion?.unidad_compra ?? '',
      nombreRegion: payload?.institucion?.nombre_region ?? '',
    },

    productos: normalizarProductos(payload?.productos_solicitados),
    proveedoresCotizando: normalizarProveedores(payload?.proveedores_cotizando),

    resumen: {
      totalOfertasRecibidas: payload?.resumen?.total_ofertas_recibidas ?? 0,
      totalDemandas: payload?.resumen?.total_demandas ?? 0,
      multaSancion: payload?.resumen?.multa_sancion ?? 0,
    },
  };
}