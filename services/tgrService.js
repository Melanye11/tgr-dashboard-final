export async function getRematesActivos() {
  const url = "https://remates.tgr.cl/v1/getListaRematesActivos";
  
  try {
    const respuesta = await fetch(url, {
      method: "GET",
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        "Accept": "application/json"
      },
      next: { tags: ['datos-tgr'] }
    });

    if (!respuesta.ok) {
      throw new Error(`Error HTTP de TGR: ${respuesta.status}`);
    }

    const datosJSON = await respuesta.json();
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
