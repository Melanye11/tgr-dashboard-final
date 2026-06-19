// Lee env y valida que exista el ticket

export function leerTicketMercadoPublico() {
    const ticket = process.env.MERCADO_PUBLICO_TICKET;
  
    if (!ticket) {
      throw new Error('Falta MERCADO_PUBLICO_TICKET en variables de entorno');
    }
  
    return ticket;
  }