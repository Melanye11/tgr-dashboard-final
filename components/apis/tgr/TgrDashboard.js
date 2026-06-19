'use client';

import { useState, useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { TrendingUp, Building2, Wallet, Search, Filter, ChevronRight, ChevronLeft, Download, X, AlertCircle, Home, Scale, Calendar, Shield, Clock } from 'lucide-react';
import { formatoMoneda, formatoMonedaCompacto, formatearFecha } from '@/lib/formatters';
import { extraerValoresUnicos, filtrarRematesTGR } from '@/lib/filters';

export default function TgrDashboard({ datosIniciales = [] }) {
  // Estados de la interfaz
  const [busqueda, setBusqueda] = useState('');
  const [filtroComuna, setFiltroComuna] = useState('TODAS');
  const [paginaActual, setPaginaActual] = useState(1);
  const [detalle, setDetalle] = useState(null);
  
  const resultadosPorPagina = 5;

  // Lógica de memorización para rendimiento
  const comunasUnicas = useMemo(
    () => extraerValoresUnicos(datosIniciales, 'comunaJuzgado'),
    [datosIniciales]
  );

  const datosFiltrados = useMemo(
    () => filtrarRematesTGR(datosIniciales, { busqueda, comuna: filtroComuna }),
    [datosIniciales, busqueda, filtroComuna]
  );

  const metricas = useMemo(() => {
    const total = datosFiltrados.length;
    const sumaTasaciones = datosFiltrados.reduce((acc, curr) => acc + (Number(curr.tasacion) || 0), 0);
    const maxTasacion = Math.max(...datosFiltrados.map(d => Number(d.tasacion) || 0), 0);
    const promedio = total > 0 ? sumaTasaciones / total : 0;
    return { total, sumaTasaciones, promedio, maxTasacion };
  }, [datosFiltrados]);

  const datosGrafico = useMemo(() => {
    const conteo = {};
    datosFiltrados.forEach(d => {
      const c = d.comunaJuzgado || 'N/A';
      conteo[c] = (conteo[c] || 0) + 1;
    });
    return Object.entries(conteo)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 10);
  }, [datosFiltrados]);

  // Paginación
  const indiceUltimo = paginaActual * resultadosPorPagina;
  const indicePrimero = indiceUltimo - resultadosPorPagina;
  const registrosActuales = datosFiltrados.slice(indicePrimero, indiceUltimo);
  const totalPaginas = Math.ceil(datosFiltrados.length / resultadosPorPagina);

  // Exportación comercial de datos
  const exportarCSV = () => {
    if (datosFiltrados.length === 0) {
      alert("No hay datos para exportar con los filtros actuales.");
      return;
    }

    const cabeceras = ["Deudor", "Ubicación", "Comuna", "Rol", "Tribunal", "Expediente", "Tasación", "Avalúo", "Fecha Remate"];
    const filas = datosFiltrados.map(item => [
      `"${(item.nombreDuegno || '').replace(/"/g, '""')}"`,
      `"${(item.direccionRol || '').replace(/"/g, '""')}"`,
      `"${item.comunaJuzgado || ''}"`,
      `"${item.rol || ''}"`,
      `"${item.nombreJuzgado || ''}"`,
      `"${item.identificacionExpedienteAdm || item.codDemanda || ''}"`,
      item.tasacion || 0,
      item.avaluo || 0,
      `"${formatearFecha(item.fechaRemate)}"`
    ]);

    const contenidoCSV = [cabeceras.join(";"), ...filas.map(fila => fila.join(";"))].join("\n");
    const blob = new Blob(["\uFEFF" + contenidoCSV], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `Reporte_Remates_TGR_${new Date().toLocaleDateString('es-CL')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-8 font-sans text-slate-800">

      {/* Título de la sección TGR */}
      <div className="mb-8">
        <h1 className="text-3xl font-black text-slate-900">TGR - Remates Activos</h1>
        <p className="text-slate-500 mt-1">
          Propiedades en remate judicial publicadas por la TGR
        </p>
      </div>

      {/* Filtros TGR */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 mb-8 shadow-sm flex flex-col md:flex-row md:items-end gap-4">
        <div className="flex-1">
          <label className="flex items-center gap-2 text-sm font-bold text-slate-700 mb-2">
            <Search size={16} /> Búsqueda  
          </label>
          <input
            type="text"
            placeholder="Deudor o Dirección..."
            value={busqueda}
            onChange={(e) => { setBusqueda(e.target.value); setPaginaActual(1); }}
            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
          />
        </div>

        <div className="flex-1">
          <label className="flex items-center gap-2 text-sm font-bold text-slate-700 mb-2">
            <Filter size={16} /> Comuna
          </label>
          <select
            value={filtroComuna}
            onChange={(e) => { setFiltroComuna(e.target.value); setPaginaActual(1); }}
            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
          >
            {comunasUnicas.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        <button
          onClick={exportarCSV}
          className="bg-slate-900 hover:bg-slate-800 transition-colors text-white flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg text-sm font-bold shadow-md hover:shadow-lg whitespace-nowrap"
        >
          <Download size={16} /> Exportar Excel
        </button>
      </div>
            
      <div className="relative">
        
        {/* Tarjetas de Métricas (KPIs) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4 transition-transform hover:-translate-y-1">
            <div className="bg-blue-50 p-3 rounded-lg text-blue-600 shrink-0"><Building2 size={24} /></div>
            <div className="w-full">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Propiedades Únicas</p>
              <h3 className="text-2xl font-black text-slate-800">{metricas.total}</h3>
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4 transition-transform hover:-translate-y-1">
            <div className="bg-emerald-50 p-3 rounded-lg text-emerald-600 shrink-0"><Wallet size={24} /></div>
            <div className="w-full">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Volumen Real</p>
              <h3 className="text-xl lg:text-2xl font-black text-slate-800 tracking-tight leading-none break-words" title={formatoMoneda(metricas.sumaTasaciones)}>
                {formatoMonedaCompacto(metricas.sumaTasaciones)}
              </h3>
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4 transition-transform hover:-translate-y-1">
            <div className="bg-amber-50 p-3 rounded-lg text-amber-600 shrink-0"><TrendingUp size={24} /></div>
            <div className="w-full">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Promedio</p>
              <h3 className="text-xl lg:text-2xl font-black text-slate-800 tracking-tight leading-none break-words" title={formatoMoneda(metricas.promedio)}>
                {formatoMonedaCompacto(metricas.promedio)}
              </h3>
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4 transition-transform hover:-translate-y-1">
            <div className="bg-purple-50 p-3 rounded-lg text-purple-600 shrink-0"><TrendingUp size={24} /></div>
            <div className="w-full">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Valor Máximo</p>
              <h3 className="text-xl lg:text-2xl font-black text-blue-600 tracking-tight leading-none break-words" title={formatoMoneda(metricas.maxTasacion)}>
                {formatoMonedaCompacto(metricas.maxTasacion)}
              </h3>
            </div>
          </div>
        </div>

        {/* ── NUEVO LAYOUT: Gráfico 1/3 + Tabla 2/3 en la misma fila ── */}
        <div className="flex flex-col lg:flex-row gap-6 items-start mb-8">

          {/* Tabla  */}
          <div className="flex-1 min-w-0">
            {registrosActuales.length === 0 ? (
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-16 flex flex-col items-center justify-center text-center">
                <div className="bg-slate-50 p-4 rounded-full mb-4">
                  <AlertCircle className="w-10 h-10 text-slate-400" />
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-2">No se encontraron resultados</h3>
                <p className="text-slate-500 max-w-md">No hay remates activos que coincidan con "{busqueda}" en la comuna seleccionada. Intenta ajustar tus filtros de búsqueda.</p>
                <button 
                  onClick={() => { setBusqueda(''); setFiltroComuna('TODAS'); }}
                  className="mt-6 px-6 py-2.5 bg-blue-50 text-blue-600 font-bold rounded-lg hover:bg-blue-100 transition-colors"
                >
                  Limpiar filtros
                </button>
              </div>
            ) : (
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left table-fixed min-w-[500px]">
                    <thead>
                      <tr className="bg-[#f4f7fa] text-[#2b4c7e] text-sm font-bold border-b border-slate-200">
                        <th className="px-6 py-4 w-1/4">Deudor</th>
                        <th className="px-6 py-4 w-2/5">Ubicación</th>
                        <th className="px-6 py-4 w-1/5 text-right">Tasación</th>
                        <th className="px-6 py-4 w-32 text-center">Acciones</th>
                      </tr>
                    </thead>
                    <tbody className="text-sm text-slate-600 divide-y divide-slate-200">
                      {registrosActuales.map((item, i) => (
                        <tr key={i} className="hover:bg-slate-50 transition-colors">
                          <td className="px-6 py-4 font-medium truncate" title={item.nombreDuegno}>{item.nombreDuegno || 'N/A'}</td>
                          <td className="px-6 py-4 truncate" title={item.direccionRol}>{item.direccionRol || 'N/A'}</td>
                          <td className="px-6 py-4 font-medium whitespace-nowrap text-right">{formatoMoneda(item.tasacion)}</td>
                          <td className="px-6 py-4 flex justify-center">
                            <button 
                              onClick={() => setDetalle(item)} 
                              className="px-4 py-1.5 border border-blue-600 text-blue-600 rounded flex items-center gap-2 hover:bg-blue-50 hover:border-blue-200 transition-colors text-sm font-bold bg-white shadow-sm"
                            >
                              Ver <ChevronRight size={14}/>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                
                {/* Paginador */}
                <div className="bg-white border-t border-slate-200 px-6 py-4 flex justify-between items-center">
                  <span className="text-sm font-medium text-slate-500">Página {paginaActual} de {Math.max(1, totalPaginas)}</span>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => setPaginaActual(p => Math.max(1, p - 1))} 
                      disabled={paginaActual === 1} 
                      className="p-1.5 rounded-md bg-slate-50 border border-slate-200 text-slate-600 disabled:opacity-40 hover:bg-slate-100 transition-colors"
                    >
                      <ChevronLeft size={18}/>
                    </button>
                    <button 
                      onClick={() => setPaginaActual(p => Math.min(totalPaginas, p + 1))} 
                      disabled={paginaActual === totalPaginas || totalPaginas === 0} 
                      className="p-1.5 rounded-md bg-slate-50 border border-slate-200 text-slate-600 disabled:opacity-40 hover:bg-slate-100 transition-colors"
                    >
                      <ChevronRight size={18}/>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Gráfico */}
           <div className="w-full lg:w-1/3 shrink-0">
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm h-full">
              <h3 className="text-lg font-bold text-slate-800 mb-6">
                Concentración Geográfica <span className="text-amber-500 font-bold text-s">(Top 10)</span>
              </h3>
              <div className="h-80 min-h-[320px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={datosGrafico} layout="vertical" margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#6baafd" />
                    <XAxis type="number" tickFormatter={(value) => value} tick={{ fontSize: 11, fill: '#37404d' }} />
                    <YAxis dataKey="name" type="category" width={110} tick={{ fontSize: 11, fill: '#37404d' }} />
                    <Tooltip cursor={{ fill: '#f1f5f9' }} formatter={(value) => [`${value} Propiedades`, 'Cantidad']} />
                    <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={20}>
                      {datosGrafico.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={index === 0 ? '#f59e0b' : '#0369a1'}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

        </div>
        

        {/* Modal Ficha Técnica */}
        {detalle && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex justify-center items-center z-50 p-4">
            <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl flex flex-col overflow-hidden">

              {/* Cabecera */}
              <div className="px-6 pt-5 pb-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Ficha Técnica del Remate</span>
                    <span className="text-xs font-mono bg-slate-100 text-slate-600 px-2.5 py-1 rounded-md border border-slate-200">
                      Exp. {detalle.identificacionExpedienteAdm || detalle.codDemanda || 'N/A'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block"></span>
                      Remate activo
                    </span>
                    <button
                      onClick={() => setDetalle(null)}
                      className="text-slate-400 hover:text-slate-700 hover:bg-slate-100 p-1.5 rounded-lg transition-colors"
                    >
                      <X size={18} />
                    </button>
                  </div>
                </div>

                <h2 className="text-2xl font-black text-slate-900 leading-tight">
                  {detalle.direccionRol || 'Sin dirección'}
                </h2>
                <p className="text-sm text-slate-500 mt-1">
                  {detalle.comunaJuzgado || 'N/A'} &bull; Inmueble territorial
                </p>
              </div>

              {/* Métricas principales */}
              <div className="mx-6 mb-5 grid grid-cols-3 divide-x divide-slate-200 border border-slate-200 rounded-xl overflow-hidden">
                <div className="px-5 py-4">
                  <p className="text-xl font-black text-slate-800">{formatoMoneda(detalle.avaluo)}</p>
                  <p className="text-xs text-slate-500 mt-1">Valor de referencia</p>
                </div>
                <div className="px-5 py-4">
                  <p className="text-xl font-black text-emerald-600">{formatoMoneda(detalle.tasacion)}</p>
                  <p className="text-xs text-emerald-600 font-semibold mt-1">▲ Tasación mínima</p>
                </div>
                <div className="px-5 py-4">
                  <p className="text-xl font-black text-blue-700">{formatearFecha(detalle.fechaRemate)}</p>
                  <p className="text-xs text-blue-500 mt-1 flex items-center gap-1">
                    <Calendar size={16} /> Fecha del remate
                  </p>
                </div>
              </div>

              <div className="px-6 pb-5 overflow-y-auto max-h-[50vh] space-y-4">

                {/* Identificación + Antecedentes judiciales */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="border border-slate-200 rounded-xl p-4">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                      <Home size={16} /> Identificación del Activo
                    </p>
                    <div className="space-y-3 text-sm">
                      <div>
                        <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Deudor / Propietario</p>
                        <p className="font-bold text-slate-800 mt-0.5">{detalle.nombreDuegno || 'No especificado'}</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Ubicación del Inmueble</p>
                        <p className="text-slate-700 mt-0.5">{detalle.direccionRol || 'No disponible'}</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Comuna / Sector</p>
                        <p className="text-slate-700 mt-0.5">{detalle.comunaJuzgado || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Rol Propiedad · SII</p>
                        <p className="font-mono text-slate-700 mt-0.5">{detalle.rol || 'N/A'}</p>
                      </div>
                    </div>
                  </div>

                  <div className="border border-slate-200 rounded-xl p-4">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                      <Scale size={18} /> Antecedentes Judiciales
                    </p>
                    <div className="space-y-3 text-sm">
                      <div>
                        <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Juzgado</p>
                        <p className="text-slate-700 mt-0.5">{detalle.nombreJuzgado || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Dirección del Juzgado</p>
                        <p className="text-slate-700 mt-0.5">{detalle.direccionJuzgado || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Rol Judicial · Causa</p>
                        <p className="font-mono text-slate-700 mt-0.5">{detalle.codDemanda || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Tipo de Deuda</p>
                        <span className="inline-block mt-0.5 bg-red-100 text-red-700 px-2.5 py-0.5 rounded text-xs font-semibold uppercase tracking-wider">
                          {detalle.tipoDeuda || 'Territorial'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Períodos del impuesto */}
                <div className="border border-slate-200 rounded-xl p-4">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                    <Clock size={16} /> Períodos del Impuesto Adeudado
                  </p>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Desde</p>
                      <p className="font-bold text-slate-800 mt-0.5">{detalle.periodoPublicacionI || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Hasta</p>
                      <p className="font-bold text-slate-800 mt-0.5">{detalle.periodoPublicacionF || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Extensión</p>
                      <p className="font-bold text-slate-800 mt-0.5">—</p>
                    </div>
                  </div>
                </div>

                {/* Condiciones de subasta */}
                <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 text-sm text-amber-900">
                  <AlertCircle className="text-amber-500 mt-0.5 shrink-0" size={18} />
                  <p>
                    <strong>Condiciones de subasta no publicadas.</strong>{' '}
                    {detalle.datosSubasta || 'Garantía, modalidad y bases se detallan en el edicto judicial. Descárgalo para conocer los requisitos de participación.'}
                  </p>
                </div>

              </div>

              {/* Footer */}
              <div className="px-6 py-4 border-t border-slate-200 flex justify-between items-center">
                <p className="text-xs text-slate-400 flex items-center gap-1">
                  <Shield size={16} /> Fuente: TGR · actualizado hoy
                </p>
                <div className="flex gap-3">
                  <button className="flex items-center gap-2 px-4 py-2.5 border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors">
                    <Download size={15} /> Descargar edicto
                  </button>
                  <button
                    onClick={() => setDetalle(null)}
                    className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-sm font-bold transition-colors shadow-md"
                  >
                    Cerrar ficha
                  </button>
                </div>
              </div>

            </div>
          </div>
        )}
      </div>
    </div>
  );
}
