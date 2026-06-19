import { listarComprasAgiles } from '@/services/mercado-publico/compra-agil';
import CompraAgilDashboard from '@/components/apis/mercado-publico/compra-agil/CompraAgilDashboard';
import ErrorView from '@/components/shared/ErrorView';

export const revalidate = 1800;

export default async function CompraAgilPage() {
  try {
    const resultado = await listarComprasAgiles({ tamanoPagina: 50 });

    return (
      <CompraAgilDashboard
        filasIniciales={resultado.filas}
        fechaUsada={resultado.fechaUsada}
        desdeCache={resultado.desdeCache}
      />
    );
  } catch (error) {
    return (
      <ErrorView
        titulo="Error al cargar Compra Ágil"
        mensaje={error.message || 'No se pudo consultar Mercado Público.'}
      />
    );
  }
}
