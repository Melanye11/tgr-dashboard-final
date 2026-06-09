import { Construction } from 'lucide-react';

export default function MercadoPublicoPage() {
    return (
        <div className="p-8 font-sans text-slate-800">

<div className="mb-8">
        <h1 className="text-3xl font-black text-slate-900">Mercado Público — Licitaciones</h1>
        <p className="text-slate-500 mt-1">
          Compras y licitaciones del Estado de Chile
        </p>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl p-16 shadow-sm flex flex-col items-center justify-center text-center max-w-2xl">
        <div className="bg-amber-50 p-4 rounded-full mb-6">
          <Construction className="w-12 h-12 text-amber-600" />
        </div>
        <h2 className="text-2xl font-bold text-slate-800 mb-3">Sección en construcción</h2>
        <p className="text-slate-500 leading-relaxed">
          Estamos preparando la integración con la API de Mercado Público.
          Próximamente podrás ver licitaciones, filtros y gráficos aquí.
        </p>
        <p className="text-xs text-slate-400 mt-6 uppercase tracking-wider font-semibold">
          EstadoHUB · Próxima actualización
        </p>
      </div>

      </div>
  );
}