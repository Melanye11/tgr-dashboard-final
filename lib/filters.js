export function extraerValoresUnicos(items, campo, valorTodos = 'TODAS') {
    const valores = items.map((item) => item[campo] || 'Desconocida');
    return [valorTodos, ...new Set(valores)].sort();
  }

export function filtrarPorTexto(items, texto, campos = []) {
    if (!texto) return items;
    const b = texto.toLowerCase();
    return items.filter((item) =>
      campos.some((campo) =>
        String(item[campo] ?? '').toLowerCase().includes(b)
      )
    );
  }

export function filtrarPorCampo(items, campo, valor, valorTodos = 'TODAS') {
    if (!valor || valor === valorTodos) return items;
    return items.filter((item) => item[campo] === valor);
  }


export function filtrarRematesTGR(items, { busqueda = '', comuna = 'TODAS' } = {}) {
    let resultado = filtrarPorCampo(items, 'comunaJuzgado', comuna);
    resultado = filtrarPorTexto(resultado, busqueda, ['direccionRol', 'nombreDuegno']);
    return resultado;
  }
