// Mercado Pubblico legacy espera DDMMAAAA (ej. 11062026), no ISO ni timestamps
export function obtenerFechaLegacy(fecha = new Date()) {
    const dia = String(fecha.getDate()).padStart(2, '0');
    const mes = String(fecha.getMonth() + 1).padStart(2, '0');
    const anio = String(fecha.getFullYear());
    return `${dia}${mes}${anio}`;
  }