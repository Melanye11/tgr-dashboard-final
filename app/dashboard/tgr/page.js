import { getRematesActivos } from '@/services/tgr';
import TgrDashboard from '@/components/apis/tgr/TgrDashboard';
import ErrorView from '@/components/shared/ErrorView';

export const revalidate = 3600;

export default async function TgrPage() {
  try {
    const datos = await getRematesActivos();
    return <TgrDashboard datosIniciales={datos} />;

  } catch {
    return (
      <ErrorView
        titulo="Error de Conexión"
        mensaje="No se pudieron cargar los datos desde la TGR en este momento."
      />
    );
  }
}