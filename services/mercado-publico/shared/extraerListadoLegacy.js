function esDetalleLegacy(respuestaApi) {
  return !!(
    respuestaApi?.CodigoExterno ||
    respuestaApi?.Licitacion ||
    respuestaApi?.licitacion ||
    respuestaApi?.OrdenCompra ||
    respuestaApi?.ordenCompra
  );
}

export function extraerListadoLegacy(respuestaApi) {
  if (!respuestaApi) return [];

  const candidatos = [
    respuestaApi?.Listado,
    respuestaApi?.listado,
    respuestaApi?.payload?.items,
  ];

  for (const candidato of candidatos) {
    if (Array.isArray(candidato)) return candidato;
  }

  if (esDetalleLegacy(respuestaApi)) {
    return [respuestaApi];
  }

  return [];
}

export function extraerDetalleLegacy(respuestaApi) {
  const lista = extraerListadoLegacy(respuestaApi);
  return lista[0] ?? null;
}