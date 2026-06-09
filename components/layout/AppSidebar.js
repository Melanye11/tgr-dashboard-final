'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { APIS } from '@/config/apis';

export default function AppSidebar() {
    const pathname = usePathname();

    return (
        <aside className="w-72 bg-white border-r border-slate-200 p-6 flex flex-col min-h-screen shadow-sm">
            <div className="mb-8">
                <h2 className="text-2xl font-black text-slate-900">
                    Estado<span className="text-blue-600">HUB</span>
                </h2>
                <p className="text-xs text-slate-500 font-medium mt-1 uppercase tracking-wider">
                    APIs Públicas del Estado
                </p>
            </div>

            <nav className="space-y-2">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                    Fuentes de datos 
                </p>
                {APIS.map((api) => {
                    const Icon = api.icon;
                    const activo = pathname.startsWith(api.href);

                    if (!api.activa) {
                        return (
                            <div
                            key={api.id}
                            className="flex items-center gap-3 px-4 py-3 rounded-lg opacity-50 cursor-not-allowed"
                            title="Próximamente"
                            >
                                <Icon size={18} />
                                <div>
                                    <p className="text-sm font-bold text-slate-600">{api.name}</p>
                                    <p className="text-xs text-slate-400">{api.subtitle} · Próximamente</p>
                                </div>
                            </div>

                        
                        );
                    }

                    return (
                        <Link
                          key={api.id}
                          href={api.href}
                          className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                            activo 
                            ? 'bg-blue-50 text-blue-700 border border-blue-100'
                            : 'text-slate-600 hover:bg-slate-50'
                            
                            }`}

                        > 
                        
                        <Icon size={18} />
                        <div> 
                            <p className="text-sm font-bold">{api.name}</p>
                            <p className="text-xs text-slate-500">{api.subtitle}</p>
                        </div>
                        </Link>
                    );
                })}
            </nav>

        </aside>
    );
}