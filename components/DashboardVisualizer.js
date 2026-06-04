'use client';

import { useState, useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, Building2, Wallet, Search, Filter, ChevronRight, ChevronLeft, Download, X, AlertCircle } from 'lucide-react';

export default function DashboardVisualizer({ datosIniciales = [] }) {
  // Estados de la interfaz
  const [busqueda, setBusqueda] = useState('');
  const [filtroComuna, setFiltroComuna] = useState('TODAS');
  const [paginaActual, setPaginaActual] = useState(1);
  const [detalle, setDetalle] = useState(null);
  
  const resultadosPorPagina = 5;

  // Lógica de memorización para rendimiento (evita recalcular en cada render)
  const comunasUnicas = useMemo(() => {
    const comunas = datosIniciales.map(d => d.comunaJuzgado || 'Desconocida');
    return ['TODAS', ...new Set(comunas)].sort();
  }, [datosIniciales]);

  const datosFiltrados = useMemo(() => {
    return datosIniciales.filter(item => {
      const b = busqueda.toLowerCase();
      const cumpleBusqueda = (item.direccionRol || '').toLowerCase().includes(b) || (item.nombreDuegno || '').toLowerCase().includes(b);
      const cumpleComuna = filtroComuna === 'TODAS' || item.comunaJuzgado === filtroComuna;
      return cumpleBusqueda && cumpleComuna;
    });
  }, [datosIniciales, busqueda, filtroComuna]);

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
    // Retorna el top 10 comunas con más remates
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

  // Utilidades de formato
  const formatoMoneda = (monto) => new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(monto || 0);

  const formatearFecha = (fechaStr) => {
    if (!fechaStr) return 'Por confirmar';
    try {
      const f = new Date(fechaStr);
      if (isNaN(f)) return fechaStr;
      const dia = String(f.getDate()).padStart(2, '0');
      const mes = String(f.getMonth() + 1).padStart(2, '0');
      const anio = f.getFullYear();
      const hora = String(f.getHours()).padStart(2, '0');
      const min = String(f.getMinutes()).padStart(2, '0');
      return `${dia}-${mes}-${anio} ${hora}:${min} hrs.`;
    } catch (e) {
      return fechaStr;
    }
  };

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
    <div className="flex min-h-screen bg-[#f4f7f6] font-sans text-slate-800">
      
      {/* Sidebar de Filtros */}
      <aside className="w-72 bg-white border-r border-slate-200 p-6 flex flex-col hidden md:flex shadow-sm z-10">
        <div className="mb-8">
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">RealEstate<span className="text-blue-600">HUB</span></h2>
          <p className="text-xs text-slate-500 font-medium mt-1 uppercase tracking-wider">Inteligencia de Remates</p>
        </div>
        <div className="space-y-6 flex-1">
          <div>
            <label className="flex items-center gap-2 text-sm font-bold text-slate-700 mb-2"><Search size={16} /> Búsqueda Global</label>
            <input 
              type="text" 
              placeholder="Deudor o Dirección..." 
              value={busqueda} 
              onChange={(e) => {setBusqueda(e.target.value); setPaginaActual(1);}} 
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all" 
            />
          </div>
          <div>
            <label className="flex items-center gap-2 text-sm font-bold text-slate-700 mb-2"><Filter size={16} /> Comuna</label>
            <select 
              value={filtroComuna} 
              onChange={(e) => {setFiltroComuna(e.target.value); setPaginaActual(1);}} 
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
            >
              {comunasUnicas.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>
        <button 
          onClick={exportarCSV} 
          className="w-full bg-slate-900 hover:bg-slate-800 transition-colors text-white flex items-center justify-center gap-2 py-3 rounded-lg text-sm font-bold shadow-md hover:shadow-lg"
        >
          <Download size={16} /> Exportar Excel
        </button>
      </aside>

      {/* Contenido Principal */}
      <main className="flex-1 p-8 overflow-y-auto relative">
        
        {/* Tarjetas de Métricas (KPIs) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4 transition-transform hover:-translate-y-1">
            <div className="bg-blue-50 p-3 rounded-lg text-blue-600 shrink-0"><Building2 size={24} /></div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-slate-500 truncate">Propiedades Únicas</p>
              <h3 className="text-2xl font-black text-slate-800 truncate">{metricas.total}</h3>
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4 transition-transform hover:-translate-y-1">
            <div className="bg-emerald-50 p-3 rounded-lg text-emerald-600 shrink-0"><Wallet size={24} /></div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-slate-500 truncate">Volumen Real</p>
              <h3 className="text-xl font-black text-slate-800 truncate">{formatoMoneda(metricas.sumaTasaciones)}</h3>
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4 transition-transform hover:-translate-y-1">
            <div className="bg-amber-50 p-3 rounded-lg text-amber-600 shrink-0"><TrendingUp size={24} /></div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-slate-500 truncate">Promedio</p>
              <h3 className="text-xl font-black text-slate-800 truncate">{formatoMoneda(metricas.promedio)}</h3>
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4 transition-transform hover:-translate-y-1">
            <div className="bg-purple-50 p-3 rounded-lg text-purple-600 shrink-0"><TrendingUp size={24} /></div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-slate-500 truncate">Valor Máximo</p>
              <h3 className="text-xl font-black text-slate-800 truncate">{formatoMoneda(metricas.maxTasacion)}</h3>
            </div>
          </div>
        </div>

        {/* Gráfico Dinámico (Con altura fija protegida) */}
        <div className="mb-8">
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm w-full">
            <h3 className="text-lg font-bold text-slate-800 mb-6">Concentración Geográfica (Top 10 Comunas)</h3>
            <div className="h-80 min-h-[320px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={datosGrafico} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#e2e8f0" />
                  <XAxis type="number" tickFormatter={(value) => value} />
                  <YAxis dataKey="name" type="category" width={120} tick={{fontSize: 12, fill: '#64748b'}} />
                  <Tooltip cursor={{fill: '#f1f5f9'}} formatter={(value) => [`${value} Propiedades`, 'Cantidad']} />
                  <Bar dataKey="value" fill="#0369a1" radius={[0, 4, 4, 0]} barSize={24} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Tabla con manejo de "Empty State" */}
        {registrosActuales.length === 0 ? (
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-16 flex flex-col items-center justify-center text-center">
            <div className="bg-slate-50 p-4 rounded-full mb-4">
              <AlertCircle className="w-10 h-10 text-slate-400" />
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">No se encontraron resultados</h3>
            <p className="text-slate-500 max-w-md">No hay remates activos que coincidan con "{busqueda}" en la comuna seleccionada. Intenta ajustar tus filtros de búsqueda.</p>
            <button 
              onClick={() => {setBusqueda(''); setFiltroComuna('TODAS');}}
              className="mt-6 px-6 py-2.5 bg-blue-50 text-blue-600 font-bold rounded-lg hover:bg-blue-100 transition-colors"
            >
              Limpiar filtros
            </button>
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left table-fixed min-w-[800px]">
                <thead>
                  <tr className="bg-[#f4f7fa] text-[#2b4c7e] text-sm font-bold border-b border-slate-200">
                    <th className="px-6 py-4 w-1/4">Deudor</th>
                    <th className="px-6 py-4 w-2/5">Ubicación</th>
                    {/* Alineación estricta para columnas financieras */}
                    <th className="px-6 py-4 w-1/5 text-right">Tasación</th>
                    <th className="px-6 py-4 w-32 text-center">Acciones</th>
                  </tr>
                </thead>
                <tbody className="text-sm text-slate-600 divide-y divide-slate-200">
                  {registrosActuales.map((item, i) => (
                    <tr key={i} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4 font-medium truncate" title={item.nombreDuegno}>{item.nombreDuegno || 'N/A'}</td>
                      <td className="px-6 py-4 truncate" title={item.direccionRol}>{item.direccionRol || 'N/A'}</td>
                      {/* whitespace-nowrap evita que el número se rompa en dos líneas */}
                      <td className="px-6 py-4 font-medium whitespace-nowrap text-right">{formatoMoneda(item.tasacion)}</td>
                      <td className="px-6 py-4 flex justify-center">
                        <button 
                          onClick={() => setDetalle(item)} 
                          className="px-4 py-1.5 border border-slate-300 text-blue-600 rounded flex items-center gap-2 hover:bg-blue-50 hover:border-blue-200 transition-colors text-xs font-semibold bg-white shadow-sm"
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

        {/* Modal Interactivo de Detalles del Remate */}
        {detalle && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex justify-center items-center z-50 p-4">
            <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in duration-200">
              <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-bold text-slate-800">Ficha Técnica del Remate</h3>
                  <p className="text-xs text-slate-500 font-medium mt-1">Expediente TGR: {detalle.identificacionExpedienteAdm || 'N/A'}</p>
                </div>
                <button 
                  onClick={() => setDetalle(null)} 
                  className="text-slate-400 hover:text-slate-700 hover:bg-slate-200 p-2 rounded-full transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="p-6 overflow-y-auto max-h-[70vh]">
                <div className="grid grid-cols-2 gap-6 mb-6">
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 shadow-sm">
                    <span className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Avalúo Fiscal</span>
                    <span className="text-2xl font-black text-slate-800 truncate block" title={formatoMoneda(detalle.avaluo)}>{formatoMoneda(detalle.avaluo)}</span>
                  </div>
                  <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-100 shadow-sm">
                    <span className="block text-xs font-bold text-emerald-600 uppercase tracking-wider mb-1">Tasación Mínima</span>
                    <span className="text-2xl font-black text-emerald-700 truncate block" title={formatoMoneda(detalle.tasacion)}>{formatoMoneda(detalle.tasacion)}</span>
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <span className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Identificación del Activo</span>
                    <div className="p-4 bg-slate-50 rounded-lg text-sm text-slate-700 border border-slate-100 space-y-2">
                      <p><strong className="text-slate-900">Deudor / Propietario:</strong> {detalle.nombreDuegno || 'No especificado'}</p>
                      <p><strong className="text-slate-900">Ubicación del Inmueble:</strong> {detalle.direccionRol || 'No disponible'}</p>
                      <p><strong className="text-slate-900">Comuna / Sector:</strong> {detalle.comunaJuzgado || 'N/A'}</p>
                      <p><strong className="text-slate-900">Rol Propiedad (SII):</strong> {detalle.rol || 'N/A'}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <span className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Antecedentes Judiciales</span>
                      <div className="p-4 bg-slate-50 rounded-lg text-sm text-slate-700 border border-slate-100 space-y-2 h-full">
                        <p><strong className="text-slate-900">Juzgado:</strong> {detalle.nombreJuzgado || 'N/A'}</p>
                        <p><strong className="text-slate-900">Dirección Juzgado:</strong> {detalle.direccionJuzgado || 'N/A'}</p>
                        <p><strong className="text-slate-900">Rol Judicial (Causa):</strong> {detalle.codDemanda || 'N/A'}</p>
                        <p><strong className="text-slate-900">Tipo de Deuda:</strong> <span className="bg-red-100 text-red-700 px-2 py-0.5 rounded text-xs font-bold uppercase ml-1">{detalle.tipoDeuda || 'Territorial'}</span></p>
                      </div>
                    </div>
                    
                    <div>
                      <span className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Fechas y Períodos</span>
                      <div className="p-4 bg-slate-50 rounded-lg text-sm text-slate-700 border border-slate-100 space-y-2 h-full">
                        <p><strong className="text-slate-900">Fecha del Remate:</strong> <span className="font-bold text-blue-600 ml-1">{formatearFecha(detalle.fechaRemate)}</span></p>
                        <p><strong className="text-slate-900">Período Impuesto Desde:</strong> {detalle.periodoPublicacionI || 'N/A'}</p>
                        <p><strong className="text-slate-900">Período Impuesto Hasta:</strong> {detalle.periodoPublicacionF || 'N/A'}</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <span className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Condiciones de Subasta</span>
                    <div className="p-4 bg-amber-50 rounded-lg text-sm text-amber-900 border border-amber-100 leading-relaxed">
                      {detalle.datosSubasta || 'No hay detalles específicos de la subasta cargados en el sistema central en este momento.'}
                    </div>
                  </div>
                </div>
              </div>

              <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex justify-end">
                <button 
                  onClick={() => setDetalle(null)} 
                  className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold transition-all shadow-md hover:shadow-lg"
                >
                  Cerrar Ficha
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
