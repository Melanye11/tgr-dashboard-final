'use client';

import { useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { formatoMoneda, formatearFecha } from '@/lib/formatters';

export default function TablaEntidadesMp({
  filasIniciales = [],
  tituloContador = 'registros',
  onVerDetalle,
  mostrarFiltroEstado = false,
  variante = 'completa',
}) {
  // 'licitaciones' muestra columna de cierre; 'completa' agrega organismo y monto (OC, compra ágil)
  const esLicitaciones = variante === 'licitaciones';
  const esCompleta = variante === 'completa';

  const [textoBusqueda, setTextoBusqueda] = useState('');
  const [filtroEstado, setFiltroEstado] = useState('TODOS');
  const [paginaActual, setPaginaActual] = useState(1);
  const resultadosPorPagina = 5;

  const estadosUnicos = useMemo(() => {
    if (!mostrarFiltroEstado) return [];
    const estados = filasIniciales.map((f) => f.statusLabel || 'Sin estado');
    return ['TODOS', ...new Set(estados)];
  }, [filasIniciales, mostrarFiltroEstado]);

  const filasVisibles = useMemo(() => {
    const q = textoBusqueda.toLowerCase();
    return filasIniciales.filter((fila) => {
      const coincideTexto =
        fila.title?.toLowerCase().includes(q) ||
        fila.externalCode?.toLowerCase().includes(q);

      const coincideEstado =
        !mostrarFiltroEstado ||
        filtroEstado === 'TODOS' ||
        fila.statusLabel === filtroEstado;

      return coincideTexto && coincideEstado;
    });
  }, [filasIniciales, textoBusqueda, filtroEstado, mostrarFiltroEstado]);

  const indiceUltimo = paginaActual * resultadosPorPagina;
  const indicePrimero = indiceUltimo - resultadosPorPagina;
  const filasPagina = filasVisibles.slice(indicePrimero, indiceUltimo);
  const totalPaginas = Math.ceil(filasVisibles.length / resultadosPorPagina);

  const resetPagina = () => setPaginaActual(1);

  return (
    <div className="space-y-6">
      <div className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col md:flex-row gap-4">
        <input
          value={textoBusqueda}
          onChange={(e) => { setTextoBusqueda(e.target.value); resetPagina(); }}
          placeholder="Buscar por código o título..."
          className="flex-1 border border-slate-200 rounded-lg px-4 py-2.5 text-sm"
        />

        {mostrarFiltroEstado && (
          <select
            value={filtroEstado}
            onChange={(e) => { setFiltroEstado(e.target.value); resetPagina(); }}
            className="flex-1 border border-slate-200 rounded-lg px-4 py-2.5 text-sm"
          >
            {estadosUnicos.map((estado) => (
              <option key={estado} value={estado}>{estado}</option>
            ))}
          </select>
        )}
      </div>

      <p className="text-sm text-slate-500">
        {filasVisibles.length} {tituloContador} · Página {paginaActual} de{' '}
        {Math.max(1, totalPaginas)}
      </p>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left table-fixed min-w-[500px] text-sm">
            <thead>
              <tr className="bg-[#f4f7fa] text-[#2b4c7e] font-bold border-b border-slate-200">
                <th className="px-6 py-4 w-28">Código</th>
                <th className="px-6 py-4">Título</th>
                <th className="px-6 py-4 w-36">Estado</th>
                {esLicitaciones && (
                  <th className="px-6 py-4 w-36">Fecha cierre</th>
                )}
                {esCompleta && (
                  <>
                    <th className="px-6 py-4">Organismo</th>
                    <th className="px-6 py-4 w-32 text-right">Monto</th>
                  </>
                )}
                <th className="px-6 py-4 w-32 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody className="text-slate-600 divide-y divide-slate-200">
              {filasPagina.map((fila) => (
                <tr
                  key={fila.externalCode}
                  className="hover:bg-slate-50 transition-colors cursor-pointer"
                  onClick={() => onVerDetalle?.(fila)}
                >
                  <td className="px-6 py-4 font-mono text-xs truncate" title={fila.externalCode}>
                    {fila.externalCode}
                  </td>
                  <td className="px-6 py-4 font-medium truncate" title={fila.title}>
                    {fila.title}
                  </td>
                  <td className="px-6 py-4 truncate">{fila.statusLabel}</td>
                  {esLicitaciones && (
                    <td className="px-6 py-4 whitespace-nowrap">
                      {formatearFecha(fila.closingAt)}
                    </td>
                  )}
                  {esCompleta && (
                    <>
                      <td className="px-6 py-4 truncate" title={fila.buyerName}>
                        {fila.buyerName}
                      </td>
                      <td className="px-6 py-4 font-medium whitespace-nowrap text-right">
                        {formatoMoneda(fila.amount)}
                      </td>
                    </>
                  )}
                  <td className="px-6 py-4">
                    <div className="flex justify-center">
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); onVerDetalle?.(fila); }}
                        className="px-4 py-1.5 border border-blue-600 text-blue-600 rounded flex items-center gap-2 hover:bg-blue-50 hover:border-blue-200 transition-colors text-sm font-bold bg-white shadow-sm"
                      >
                        Ver <ChevronRight size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="bg-white border-t border-slate-200 px-6 py-4 flex justify-between items-center">
          <span className="text-sm font-medium text-slate-500">
            Página {paginaActual} de {Math.max(1, totalPaginas)}
          </span>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setPaginaActual((p) => Math.max(1, p - 1))}
              disabled={paginaActual === 1}
              className="p-1.5 rounded-md bg-slate-50 border border-slate-200 text-slate-600 disabled:opacity-40 hover:bg-slate-100 transition-colors"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              type="button"
              onClick={() => setPaginaActual((p) => Math.min(totalPaginas, p + 1))}
              disabled={paginaActual === totalPaginas || totalPaginas === 0}
              className="p-1.5 rounded-md bg-slate-50 border border-slate-200 text-slate-600 disabled:opacity-40 hover:bg-slate-100 transition-colors"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}