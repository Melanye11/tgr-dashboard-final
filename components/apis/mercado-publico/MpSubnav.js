'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { MP_SUBMODULOS } from '@/config/mercado-publico';

export default function MpSubnav() {
  const rutaActual = usePathname();

  return (
    <div className="flex flex-wrap gap-2 mb-8">
      {MP_SUBMODULOS.map((submodulo) => {
        const estaActivo = rutaActual.startsWith(submodulo.href);

        if (!submodulo.activo) {
          return (
            <span
              key={submodulo.id}
              className="px-4 py-2 rounded-lg text-sm bg-slate-100 text-slate-400 cursor-not-allowed"
            >
              {submodulo.nombre} · Próximamente
            </span>
          );
        }

        return (
          <Link
            key={submodulo.id}
            href={submodulo.href}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
              estaActivo
                ? 'bg-blue-600 text-white'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            {submodulo.nombre}
          </Link>
        );
      })}
    </div>
  );
}