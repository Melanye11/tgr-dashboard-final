// La API legacy puede devolver cientos de filas en UI y snapshot quedan los mas recientes
export const LIMITE_FILAS_LEGACY = 50;

function parsearFecha(fila) {
  const candidatos = [fila?.closingAt, fila?.publishedAt];

  for (const valor of candidatos) {
    if (!valor) continue;
    const ms = new Date(valor).getTime();
    if (!Number.isNaN(ms)) return ms;
  }

  return 0;
}

export function ordenarFilasRecientes(filas = []) {
  return [...filas].sort((a, b) => {
    const diff = parsearFecha(b) - parsearFecha(a);
    if (diff !== 0) return diff;
    return String(b.externalCode ?? '').localeCompare(String(a.externalCode ?? ''));
  });
}

export function limitarFilasRecientes(filas = [], limite = LIMITE_FILAS_LEGACY) {
  return ordenarFilasRecientes(filas).slice(0, limite);
}