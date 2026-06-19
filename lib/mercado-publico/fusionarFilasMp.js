// Valida que la fila sea un registro real no un error de la api
// que se enlista
export function esFilaValidaMp(fila) {
    const codigo = String(fila?.externalCode ?? '').trim();
    if (!codigo) return false;
    if (/^\d{1,3}$/.test(codigo)) return false;
    return true;
  }
  
  export function filtrarFilasValidas(filas = []) {
    return filas.filter(esFilaValidaMp);
  }
  
  //agrega nuevos y actualiza existentes sin borrar
  export function fusionarFilasMp(existentes = [], nuevas = []) {
    const mapa = new Map();
  
    for (const fila of existentes) {
      if (esFilaValidaMp(fila)) {
        mapa.set(fila.externalCode, fila);
      }
    }
  
    for (const fila of nuevas) {
      if (esFilaValidaMp(fila)) {
        mapa.set(fila.externalCode, fila);
      }
    }
  
    return Array.from(mapa.values());
  }