export function formatoMoneda(monto) {
    return new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(monto || 0);
}


export function formatoMonedaCompacto(monto) {
    return new Intl.NumberFormat('es-CL', {
        style: 'currency',
        currency: 'CLP',
        notation: 'compact',
        maximumFractionDigits: 1,
      }).format(monto || 0);
    }

export function formatearFecha(fechaStr) {
    if (!fechaStr) return 'Por confirmar';
    try {
      const f = new Date(fechaStr);
      if (isNaN(f)) return fechaStr;
      const dia = String(f.getDate()).padStart(2, '0');
      const mes = String(f.getMonth() + 1).padStart(2, '0');
      const anio = f.getFullYear();
      const hora = String(f.getHours()).padStart(2, '0');
      const min = String(f.getMinutes()).padStart(2, '0');
      return `${dia}-${mes}-${anio} ${hora}:${min} hrs.`;
    } catch {
      return fechaStr;
    }
  }