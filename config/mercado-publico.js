// submodulos de mercado publico

export const MP_SUBMODULOS = [
    {
      id: 'compra-agil',
      nombre: 'Compra Ágil',
      descripcion: 'Cotizaciones rápidas del Estado',
      href: '/dashboard/mercado-publico/compra-agil',
      cacheTag: 'mp-compra-agil',
      activo: true,
    },
    {
      id: 'licitaciones',
      nombre: 'Licitaciones',
      descripcion: 'Oportunidades formales de compra',
      href: '/dashboard/mercado-publico/licitaciones',
      cacheTag: 'mp-licitaciones',
      activo: true,
    },
    {
      id: 'ordenes-compra',
      nombre: 'Órdenes de Compra',
      descripcion: 'Compras ya formalizadas',
      href: '/dashboard/mercado-publico/ordenes-compra',
      cacheTag: 'mp-ordenes-compra',
      activo: true, 
    },
  ];
  
  export function obtenerSubmoduloMp(submoduloId) {
    return MP_SUBMODULOS.find((item) => item.id === submoduloId) ?? null;
  }