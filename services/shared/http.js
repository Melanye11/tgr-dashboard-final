export async function fetchJson(url, { cacheTag } = {}) {
    const respuesta = await fetch(url, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'User-Agent': 'Mozilla/5.0 (compatible; EstadoHUB/1.0)',
      },
      next: cacheTag ? { tags: [cacheTag] } : undefined,
    });
    if (!respuesta.ok) {
      throw new Error(`Error HTTP ${respuesta.status} al consultar ${url}`);
    }
    return respuesta.json();
  }