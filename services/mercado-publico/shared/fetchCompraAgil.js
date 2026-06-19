// Cliente HTTP para Compra Ágil api2.mercadopublico.c

import { leerTicketMercadoPublico } from './ticketMercadoPublico';
import { lanzarErrorMercadoPublico } from './erroresMercadoPublico';

const BASE_COMPRA_AGIL = 'https://api2.mercadopublico.cl';

export async function fetchCompraAgil(rutaRelativa, { cacheTag, parametros = {} } = {}) {
  const ticket = leerTicketMercadoPublico();
  const url = new URL(`${BASE_COMPRA_AGIL}${rutaRelativa}`);

  Object.entries(parametros).forEach(([clave, valor]) => {
    if (valor !== undefined && valor !== null && valor !== '') {
      url.searchParams.set(clave, String(valor));
    }
  });

  const respuesta = await fetch(url.toString(), {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      ticket,
      'User-Agent': 'Mozilla/5.0 (compatible; EstadoHUB/1.0)',
    },
    next: cacheTag ? { tags: [cacheTag] } : undefined,
  });

  if (!respuesta.ok) {
    lanzarErrorMercadoPublico(respuesta.status, url.toString());
  }

  const json = await respuesta.json();

  if (json?.success === 'NOK') {
    const mensaje = json?.errors?.[0]?.mensaje ?? 'Error de Mercado Público';
    throw new Error(mensaje);
  }

  return json;
}