'use client';

import { useState, useEffect, useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { MapPin, TrendingUp, Building2, Wallet, Search, Filter, ChevronRight, ChevronLeft, Download } from 'lucide-react';

export default function InvestorDashboard() {
  const [datos, setDatos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [busqueda, setBusqueda] = useState('');
  const [filtroComuna, setFiltroComuna] = useState('TODAS');
  const [paginaActual, setPaginaActual] = useState(1);
  const resultadosPorPagina = 5;

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const res = await fetch('/api/remates');
        const data = await res.json();
        setDatos(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Error:", err);
      } finally {
        setCargando(false);
      }
    };
    cargarDatos();
  }, []);

  const comunasUnicas = useMemo(() => {
    const comunas = datos.map(d => d.comunaJuzgado || 'Desconocida');
    return ['TODAS', ...new Set(comunas)].sort();
  }, [datos]);

  const datosFiltrados = useMemo(() => {
    return datos.filter(item => {
      const b = busqueda.toLowerCase();
      const cumpleBusqueda = (item.direccionRol || '').toLowerCase().includes(b) || (item.nombreDuegno || '').toLowerCase().includes(b);
      const cumpleComuna = filtroComuna === 'TODAS' || item.comunaJuzgado === filtroComuna;
      return cumpleBusqueda && cumpleComuna;
    });
  }, [datos, busqueda, filtroComuna]);

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
    return Object.entries(conteo).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value).slice(0, 5);
  }, [datosFiltrados]);

  const indiceUltimo = paginaActual * resultadosPorPagina;
  const indicePrimero = indiceUltimo - resultadosPorPagina;
  const registrosActuales = datosFiltrados.slice(indicePrimero, indiceUltimo);
  const totalPaginas = Math.ceil(datosFiltrados.length / resultadosPorPagina);

  const formatoMoneda = (monto) => new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(monto || 0);

  if (cargando) {
    return <div className="flex h-screen items-center justify-center bg-slate-50"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-900"></div></div>;
  }

  return (
    <div className="flex min-h-screen bg-[#f4f7f6] font-sans text-slate-800">
      <aside className="w-72 bg-white border-r border-slate-200 p-6 flex flex-col hidden md:flex shadow-sm z-10">
        <div className="mb-8">
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">RealEstate<span className="text-blue-600">HUB</span></h2>
          <p className="text-xs text-slate-500 font-medium mt-1 uppercase tracking-wider">Inteligencia de Remates</p>
        </div>
        <div className="space-y-6 flex-1">
          <div>
            <label className="flex items-center gap-2 text-sm font-bold text-slate-700 mb-2"><Search size={16} /> Búsqueda Global</label>
            <input type="text" placeholder="Deudor o Dirección..." value={busqueda} onChange={(e) => {setBusqueda(e.target.value); setPaginaActual(1);}} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-sm outline-none" />
          </div>
          <div>
            <label className="flex items-center gap-2 text-sm font-bold text-slate-700 mb-2"><Filter size={16} /> Comuna</label>
            <select value={filtroComuna} onChange={(e) => {setFiltroComuna(e.target.value); setPaginaActual(1);}} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-sm outline-none">
              {comunasUnicas.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>
        <button className="w-full bg-slate-900 text-white flex items-center justify-center gap-2 py-3 rounded-lg text-sm font-bold"><Download size={16} /> Exportar</button>
      </aside>

      <main className="flex-1 p-8 overflow-y-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
            <div className="bg-blue-50 p-3 rounded-lg text-blue-600"><Building2 size={24} /></div>
            <div><p className="text-sm font-semibold text-slate-500">Activas</p><h3 className="text-2xl font-black">{metricas.total}</h3></div>
          </div>
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
            <div className="bg-emerald-50 p-3 rounded-lg text-emerald-600"><Wallet size={24} /></div>
            <div><p className="text-sm font-semibold text-slate-500">Volumen</p><h3 className="text-xl font-black">{formatoMoneda(metricas.sumaTasaciones)}</h3></div>
          </div>
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
            <div className="bg-amber-50 p-3 rounded-lg text-amber-600"><TrendingUp size={24} /></div>
            <div><p className="text-sm font-semibold text-slate-500">Promedio</p><h3 className="text-xl font-black">{formatoMoneda(metricas.promedio)}</h3></div>
          </div>
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
            <div className="bg-purple-50 p-3 rounded-lg text-purple-600"><TrendingUp size={24} /></div>
            <div><p className="text-sm font-semibold text-slate-500">Máximo</p><h3 className="text-xl font-black">{formatoMoneda(metricas.maxTasacion)}</h3></div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm col-span-1 lg:col-span-2">
            <h3 className="text-lg font-bold text-slate-800 mb-6">Top Comunas</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={datosGrafico} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#e2e8f0" />
                  <XAxis type="number" />
                  <YAxis dataKey="name" type="category" width={100} tick={{fontSize: 12}} />
                  <Tooltip cursor={{fill: '#f1f5f9'}} />
                  <Bar dataKey="value" fill="#0369a1" radius={[0, 4, 4, 0]} barSize={24} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col">
            <h3 className="text-lg font-bold text-slate-800 mb-4">Mapa</h3>
            <div className="flex-1 bg-slate-100 rounded-lg flex items-center justify-center text-center p-6"><MapPin size={48} className="text-blue-500 mx-auto" /></div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-[#f4f7fa] text-[#2b4c7e] text-sm font-bold border-b border-slate-200">
                <th className="px-6 py-4">Deudor</th><th className="px-6 py-4">Ubicación</th><th className="px-6 py-4">Tasacion</th><th className="px-6 py-4">Acciones</th>
              </tr>
            </thead>
            <tbody className="text-sm text-slate-600 divide-y divide-slate-200">
              {registrosActuales.map((item, i) => (
                <tr key={i} className="hover:bg-slate-50">
                  <td className="px-6 py-4 font-medium max-w-[200px] truncate">{item.nombreDuegno || 'N/A'}</td>
                  <td className="px-6 py-4 truncate">{item.direccionRol || 'N/A'}</td>
                  <td className="px-6 py-4">{formatoMoneda(item.tasacion)}</td>
                  <td className="px-6 py-4"><button className="px-4 py-1.5 border border-slate-300 text-blue-600 rounded flex items-center gap-2">Ver <ChevronRight size={14}/></button></td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="bg-white border-t border-slate-200 px-6 py-4 flex justify-between">
            <span className="text-sm text-slate-600">Página {paginaActual} de {Math.max(1, totalPaginas)}</span>
            <div className="flex gap-2">
              <button onClick={() => setPaginaActual(p => Math.max(1, p - 1))} disabled={paginaActual === 1} className="p-1 rounded bg-slate-100 disabled:opacity-30"><ChevronLeft size={18}/></button>
              <button onClick={() => setPaginaActual(p => Math.min(totalPaginas, p + 1))} disabled={paginaActual === totalPaginas || totalPaginas === 0} className="p-1 rounded bg-slate-100 disabled:opacity-30"><ChevronRight size={18}/></button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
