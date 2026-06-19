import { listarOrdenesCompra } from '@/services/mercado-publico/ordenes-compra';
import OrdenesCompraDashboard from '@/components/apis/mercado-publico/ordenes-compra/OrdenesCompraDashboard';
import ErrorView from '@/components/shared/ErrorView';

export const revalidate = 1800; // 30 min, mismo criterio que licitaciones

export default async function OrdenesCompraPage() {
  try {
    const resultado = await listarOrdenesCompra();
    
    return (
      <OrdenesCompraDashboard
        filasIniciales={resultado.filas}
        fechaUsada={resultado.fechaUsada}
        desdeCache={resultado.desdeCache}
      />
    );
  } catch (error) {
    return (
      <ErrorView
        titulo="Error al cargar Órdenes de Compra"
        mensaje={error.message || 'No se pudo consultar Mercado Público.'}
      />
    );
  }
}