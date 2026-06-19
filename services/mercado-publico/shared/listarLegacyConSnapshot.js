import { fetchMercadoPublicoLegacy } from './fetchMercadoPublicoLegacy';
import { obtenerFechaLegacy } from './fechaLegacy';
import { extraerListadoLegacy } from './extraerListadoLegacy';
import { leerSnapshotMp, actualizarSnapshotMp } from './snapshotMp';
import { limitarFilasRecientes, LIMITE_FILAS_LEGACY } from '@/lib/mercado-publico/limitarFilasMp';
import { filtrarFilasValidas } from '@/lib/mercado-publico/fusionarFilasMp';

export async function listarLegacyConSnapshot({
  modulo,
  ruta,
  cacheTag,
  fecha,
  parametrosBase = {},
  normalizarLista,
  limite = LIMITE_FILAS_LEGACY,
}) {
  const fechaConsulta = fecha ?? obtenerFechaLegacy();

  try {
    const respuestaApi = await fetchMercadoPublicoLegacy(ruta, {
      cacheTag,
      parametros: { ...parametrosBase, fecha: fechaConsulta },
    });

    const filasNuevas = filtrarFilasValidas(
      normalizarLista(extraerListadoLegacy(respuestaApi))
    );

    if (filasNuevas.length > 0) {
      const snapshot = await actualizarSnapshotMp(modulo, {
        filasNuevas,
        fechaUsada: fechaConsulta,
      });

      const filasUi = limitarFilasRecientes(snapshot.filas, limite);

      return {
        filas: filasUi,
        totalRegistros: snapshot.totalRegistros,
        fechaUsada: fechaConsulta,
        desdeCache: false,
        limite,
      };
    }
  } catch (error) {
    console.warn(`[${modulo}] API sin datos o error:`, error.message);
  }

  const snapshot = await leerSnapshotMp(modulo);
  const filas = limitarFilasRecientes(snapshot.filas, limite);

  return {
    filas,
    totalRegistros: snapshot.totalRegistros ?? snapshot.filas.length,
    fechaUsada: snapshot.fechaUsada || fechaConsulta,
    desdeCache: filas.length > 0,
    limite,
  };
}