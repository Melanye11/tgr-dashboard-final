'use client';

import { X } from 'lucide-react';
import { formatoMoneda, formatearFecha } from '@/lib/formatters';

export default function EntidadMpDetalleModal({ fila, cargando = false, onCerrar }) {
  if (!fila) return null;

  const esOrdenCompra = fila.module === 'ordenes-compra';
  const esLicitacion = fila.module === 'licitaciones';

  return (
    <div
      className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex justify-center items-center z-50 p-4"
      onClick={onCerrar}
    >
      <div
        className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-6 pt-5 pb-4 border-b border-slate-100">
          <div className="flex items-start justify-between gap-4">
            <div>
              <span className="text-xs font-mono bg-slate-100 text-slate-600 px-2 py-1 rounded">
                {fila.externalCode}
              </span>
              <h2 className="text-xl font-black text-slate-900 mt-2">{fila.title}</h2>
              <p className="text-sm text-slate-500 mt-1">{fila.statusLabel}</p>
            </div>
            <button onClick={onCerrar} className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg">
              <X size={18} />
            </button>
          </div>
        </div>

        <div className="px-6 py-5 space-y-4 max-h-[60vh] overflow-y-auto text-sm">
          {cargando ? (
            <p className="text-slate-500">Cargando detalle...</p>
          ) : esOrdenCompra ? (
            // OC trae proveedor, impuestos y licitación origen
            // layout distinto al de licitaciones
            <DetalleOrdenCompra fila={fila} />
          ) : (
            <DetalleGenerico fila={fila} esLicitacion={esLicitacion} />
          )}
        </div>
      </div>
    </div>
  );
}

function DetalleOrdenCompra({ fila }) {
  return (
    <>
      <div className="grid grid-cols-2 gap-4">
        <Campo label="Organismo comprador" valor={fila.buyerName || '—'} />
        <Campo label="RUT comprador" valor={fila.buyerRut || '—'} />
        <Campo label="Proveedor" valor={fila.supplierName || '—'} />
        <Campo label="RUT proveedor" valor={fila.supplierRut || '—'} />
        <Campo label="Licitación origen" valor={fila.relatedCode || '—'} />
        <Campo label="Tipo OC" valor={fila.orderType || '—'} />
        <Campo label="Estado proveedor" valor={fila.supplierStatusLabel || '—'} />
        <Campo label="Región" valor={fila.buyerRegion || '—'} />
        <Campo label="Total" valor={formatoMoneda(fila.amount)} />
        <Campo label="Total neto" valor={formatoMoneda(fila.amountNet)} />
        <Campo label="Impuestos" valor={formatoMoneda(fila.taxes)} />
        <Campo label="Moneda" valor={fila.currency || 'CLP'} />
        <Campo label="Fecha envío" valor={formatearFecha(fila.publishedAt)} />
        <Campo label="Fecha aceptación" valor={formatearFecha(fila.closingAt)} />
      </div>

      {fila.description && (
        <div>
          <p className="text-xs text-slate-400 uppercase mb-1">Descripción</p>
          <p>{fila.description}</p>
        </div>
      )}

      {Array.isArray(fila.items) && fila.items.length > 0 && (
        <div>
          <p className="text-xs text-slate-400 uppercase mb-2">Ítems</p>
          <ul className="list-disc pl-5 space-y-1">
            {fila.items.map((item, i) => (
              <li key={item?.Correlativo ?? i}>
                {item?.Producto ??
                  item?.producto ??
                  item?.EspecificacionComprador ??
                  'Ítem'}
                {item?.Cantidad != null && ` · Cant: ${item.Cantidad}`}
                {item?.Total != null && ` · ${formatoMoneda(item.Total)}`}
              </li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
}

function DetalleGenerico({ fila, esLicitacion }) {
  return (
    <>
      <div className="grid grid-cols-2 gap-4">
        <Campo label="Organismo" valor={fila.buyerName || '—'} />
        <Campo label="Monto" valor={formatoMoneda(fila.amount)} />
        <Campo
          label={esLicitacion ? 'Publicación' : 'Fecha publicación'}
          valor={formatearFecha(fila.publishedAt)}
        />
        <Campo
          label={esLicitacion ? 'Cierre' : 'Fecha cierre'}
          valor={formatearFecha(fila.closingAt)}
        />
        <Campo label="Región" valor={fila.buyerRegion || '—'} />
        <Campo label="RUT comprador" valor={fila.buyerRut || '—'} />
      </div>

      {fila.description && (
        <div>
          <p className="text-xs text-slate-400 uppercase mb-1">Descripción</p>
          <p>{fila.description}</p>
        </div>
      )}

      {Array.isArray(fila.items) && fila.items.length > 0 && (
        <div>
          <p className="text-xs text-slate-400 uppercase mb-2">
            {fila.module === 'compra-agil' ? 'Documentos' : 'Ítems'}
          </p>
          <ul className="list-disc pl-5 space-y-1">
            {fila.items.map((item, i) => (
              <li key={item?.id ?? item?.Correlativo ?? i}>
                {item?.nombre ??
                  item?.Nombre ??
                  item?.NombreProducto ??
                  item?.Descripcion ??
                  'Ítem'}
              </li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
}

function Campo({ label, valor }) {
  return (
    <div>
      <p className="text-xs text-slate-400 uppercase">{label}</p>
      <p className="font-medium">{valor}</p>
    </div>
  );
}