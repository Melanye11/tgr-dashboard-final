import { fetchJson } from '../shared/http';

const TGR_URL = 'https://remates.tgr.cl/v1/getListaRematesActivos';
const CACHE_TAG = 'datos-tgr';

export async function getRematesActivos() {
  try {
    const datosJSON = await fetchJson(TGR_URL, { cacheTag: CACHE_TAG });
    const arrayDatos = Array.isArray(datosJSON.data) ? datosJSON.data : [];

    const datosUnicos = arrayDatos.filter((propiedad, index, arreglo) => {
      return arreglo.findIndex(p =>
        p.rol === propiedad.rol &&
        p.nombreDuegno === propiedad.nombreDuegno
      ) === index;
    });

    return datosUnicos;
  } catch (error) {
    console.error("Fallo en el servicio getRematesActivos:", error);
    throw error;
  }
}