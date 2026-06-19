import { listarLicitaciones } from '@/services/mercado-publico/licitaciones';
import LicitacionesDashboard from '@/components/apis/mercado-publico/licitaciones/LicitacionesDashboard';
import ErrorView from '@/components/shared/ErrorView';

export const revalidate = 1800;

export default async function LicitacionesPage() {
  try {
    const resultado = await listarLicitaciones();

    return (
      <LicitacionesDashboard
        filasIniciales={resultado.filas}
        fechaUsada={resultado.fechaUsada}
        desdeCache={resultado.desdeCache}
      />
    );
  } catch (error) {
    return (
      <ErrorView
        titulo="Error al cargar Licitaciones"
        mensaje={error.message || 'No se pudo consultar Mercado Público.'}
      />
    );
  }
}

