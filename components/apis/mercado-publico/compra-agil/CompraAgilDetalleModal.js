'use client';

import { X, ExternalLink } from 'lucide-react';
import { formatoMoneda, formatearFecha } from '@/lib/formatters';

export default function CompraAgilDetalleModal({
  detalle,
  cargando = false,
  onCerrar,
}) {
  if (!detalle && !cargando) return null;

  return (
    <div
      className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex justify-center items-center z-50 p-4"
      onClick={onCerrar}
    >
      <div
        className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Cabecera */}
        <div className="px-6 pt-5 pb-4 border-b border-slate-100 shrink-0">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              {cargando ? (
                <p className="text-slate-500">Cargando detalle...</p>
              ) : (
                <>
                  <span className="text-xs font-mono bg-slate-100 text-slate-600 px-2 py-1 rounded">
                    {detalle.codigo}
                  </span>
                  <h2 className="text-xl font-black text-slate-900 mt-2 leading-snug">
                    {detalle.nombre}
                  </h2>
                  <p className="text-sm text-emerald-700 font-semibold mt-1">
                    {detalle.estado?.glosa}
                  </p>
                </>
              )}
            </div>
            <button
              onClick={onCerrar}
              className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg shrink-0"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Cuerpo */}
        <div className="px-6 py-5 space-y-6 overflow-y-auto text-sm">
          {cargando ? null : (
            <>
              {detalle.descripcion && (
                <Seccion titulo="Descripción">
                  <p className="text-slate-700 whitespace-pre-wrap">{detalle.descripcion}</p>
                </Seccion>
              )}

              <Seccion titulo="Fechas">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <Campo label="Publicación" valor={formatearFecha(detalle.fechas?.publicacion)} />
                  <Campo label="Cierre" valor={formatearFecha(detalle.fechas?.cierre)} />
                  <Campo label="Último cambio" valor={formatearFecha(detalle.fechas?.ultimoCambio)} />
                </div>
              </Seccion>

              <Seccion titulo="Entrega">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Campo label="Dirección" valor={detalle.entrega?.direccion || '—'} />
                  <Campo
                    label="Plazo de entrega"
                    valor={
                      detalle.entrega?.plazoDias != null
                        ? `${detalle.entrega.plazoDias} días`
                        : '—'
                    }
                  />
                </div>
              </Seccion>

              <Seccion titulo="Presupuesto">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Campo
                    label="Monto disponible (CLP)"
                    valor={formatoMoneda(detalle.presupuesto?.montoDisponibleClp)}
                  />
                  <Campo label="Moneda" valor={detalle.presupuesto?.moneda || 'CLP'} />
                </div>
              </Seccion>

              <Seccion titulo="Institución">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Campo label="Organismo comprador" valor={detalle.institucion?.organismoComprador || '—'} />
                  <Campo label="RUT" valor={detalle.institucion?.rut || '—'} />
                  <Campo label="Unidad de compra" valor={detalle.institucion?.unidadCompra || '—'} />
                  <Campo label="Región" valor={detalle.institucion?.nombreRegion || '—'} />
                </div>
              </Seccion>

              <Seccion titulo="Productos solicitados">
                {detalle.productos?.length > 0 ? (
                  <ul className="space-y-3">
                    {detalle.productos.map((producto, i) => (
                      <li
                        key={`${producto.codigoProducto}-${i}`}
                        className="border border-slate-200 rounded-lg p-3 bg-slate-50"
                      >
                        <p className="font-semibold text-slate-800">{producto.nombre}</p>
                        <p className="text-xs text-slate-500 mt-1">
                          Código: {producto.codigoProducto ?? '—'}
                          {producto.cantidad != null && ` · Cantidad: ${producto.cantidad}`}
                          {producto.unidadMedida && ` ${producto.unidadMedida}`}
                        </p>
                        {producto.descripcion && (
                          <p className="text-slate-600 mt-2 text-xs leading-relaxed">
                            {producto.descripcion}
                          </p>
                        )}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-slate-500">Sin productos registrados.</p>
                )}
              </Seccion>

              <Seccion titulo="Proveedores cotizando">
                {detalle.proveedoresCotizando?.length > 0 ? (
                  <ul className="list-disc pl-5 space-y-1">
                    {detalle.proveedoresCotizando.map((proveedor, i) => (
                      <li key={`${proveedor.rut}-${i}`}>
                        {proveedor.nombre}
                        {proveedor.rut && ` (${proveedor.rut})`}
                        {proveedor.estado && ` — ${proveedor.estado}`}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-slate-500">Ningún proveedor cotizando por ahora.</p>
                )}
              </Seccion>

              <Seccion titulo="Resumen">
                <Campo
                  label="Total ofertas recibidas"
                  valor={String(detalle.resumen?.totalOfertasRecibidas ?? 0)}
                />
              </Seccion>

              <Seccion titulo="Documentos">
                {detalle.documentos?.length > 0 ? (
                  <ul className="list-disc pl-5 space-y-1 mb-4">
                    {detalle.documentos.map((doc) => (
                      <li key={doc.id}>
                        <span className="font-mono text-xs text-slate-500">{doc.id}</span>
                        {' — '}
                        {doc.nombre}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-slate-500 mb-4">Sin documentos adjuntos.</p>
                )}

                {detalle.urlFichaMercadoPublico && (
                  <a
                    href={detalle.urlFichaMercadoPublico}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg transition-colors"
                  >
                    <ExternalLink size={16} />
                    Ir a Mercado Público para descargar documentos/anexos
                  </a>
                )}
              </Seccion>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function Seccion({ titulo, children }) {
  return (
    <section>
      <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">
        {titulo}
      </h3>
      {children}
    </section>
  );
}

function Campo({ label, valor }) {
  return (
    <div>
      <p className="text-xs text-slate-400 uppercase">{label}</p>
      <p className="font-medium text-slate-800 mt-0.5">{valor}</p>
    </div>
  );
}