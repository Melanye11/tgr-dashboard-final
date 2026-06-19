import { leerTicketMercadoPublico } from './ticketMercadoPublico';
import { lanzarErrorMercadoPublico } from './erroresMercadoPublico';

const BASE_LEGACY = 'https://api.mercadopublico.cl/servicios/v1/publico';

function urlSinTicket(urlString) {
  // Para logs de error: el ticket no debería quedar en consola ni en respuestas
  const url = new URL(urlString);
  url.searchParams.delete('ticket');
  return url.toString();
}

export async function fetchMercadoPublicoLegacy(rutaRelativa, { cacheTag, parametros = {} } = {}) {
  const ticket = leerTicketMercadoPublico();
  const url = new URL(`${BASE_LEGACY}${rutaRelativa}`);

  url.searchParams.set('ticket', ticket);

  Object.entries(parametros).forEach(([clave, valor]) => {
    if (valor !== undefined && valor !== null && valor !== '') {
      url.searchParams.set(clave, String(valor));
    }
  });

  const respuesta = await fetch(url.toString(), {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'User-Agent': 'Mozilla/5.0 (compatible; EstadoHUB/1.0)',
    },
    next: cacheTag ? { tags: [cacheTag] } : undefined,
  });

  if (!respuesta.ok) {
    lanzarErrorMercadoPublico(respuesta.status, urlSinTicket(url.toString()));
  }

  return respuesta.json();
}