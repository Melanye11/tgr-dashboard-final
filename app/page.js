import { getRematesActivos } from '../services/tgrService';
import DashboardVisualizer from '../components/DashboardVisualizer';

export const revalidate = 3600;

export default async function InverstorDashboardPage() {
  try{
    const datos = await getRematesActivos();

    return <DashboardVisualizer datosIniciales={datos} />;
  } catch (error) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50 text-center p-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Error de Conexión</h2>
          <p className="text-slate-600">No se pudieron cargar los datos desde la TGR en este momento</p>
        </div>
      </div>
    );
  }
}
