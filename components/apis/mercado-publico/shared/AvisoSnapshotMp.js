function formatearFechaUsada(fechaUsada) {
  if (!fechaUsada) return '';
  if (/^\d{8}$/.test(fechaUsada)) {
    return `${fechaUsada.slice(0, 2)}-${fechaUsada.slice(2, 4)}-${fechaUsada.slice(4)}`;
  }
  const fecha = new Date(fechaUsada);
  if (!Number.isNaN(fecha.getTime())) {
    return fecha.toLocaleDateString('es-CL');
  }
  return fechaUsada;
}

export default function AvisoSnapshotMp({
  desdeCache = false,
  fechaUsada = '',
  hayFilas = false,
  modulo = 'registros',
}) {
  const fechaLegible = formatearFechaUsada(fechaUsada);

  if (desdeCache && hayFilas) {
    return (
      <p className="text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-4 py-2 mb-4">
        Mostrando {modulo} en caché del {fechaLegible}. La API no devolvió registros hoy.
      </p>
    );
  }

  if (!hayFilas) {
    return (
      <p className="text-sm text-slate-500 mb-4">
        No hay {modulo} ni en la API ni en caché.
      </p>
    );
  }

  return null;
}
