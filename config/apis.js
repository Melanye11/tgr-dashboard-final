import { Building2, ShoppingCart } from 'lucide-react';

export const APIS = [
    {
        id:'tgr',
        slug:'tgr',
        name: 'TGR',
        subtitle: 'Remates judiciales',
        href: '/dashboard/tgr',
        icon: Building2,
        activa: true,
        cacheTag: 'datos-tgr',

    },

    {
        id: 'mercado-publico',
        slug:'mercado-publico',
        name: 'Mercado Público',
        subtitle: 'Compras del Estado (3 módulos)',
        href: '/dashboard/mercado-publico',
        icon: ShoppingCart,
        activa: true, 
        cacheTag: 'datos-mercado-publico',
    },
];

export function getApiBySlug(slug) {
    return APIS.find((api) => api.slug === slug) ?? null;
  }
  
  export function getApiById(id) {
    return APIS.find((api) => api.id === id) ?? null;
  }