'use client';

import { useState } from 'react';
import TablaEntidadesMp from '../shared/TablaEntidadesMp';
import EntidadMpDetalleModal from '../shared/EntidadMpDetalleModal';
import AvisoSnapshotMp from '../shared/AvisoSnapshotMp';

async function obtenerDetalleOrdenCompra(codigo) {
  const respuesta = await fetch(
    `/api/mercado-publico/ordenes-compra/${encodeURIComponent(codigo)}`
  );
  const json = await respuesta.json();
  return json.success ? json.data : null;
}

export default function OrdenesCompraDashboard({
  filasIniciales = [],
  fechaUsada = '',
  desdeCache = false,
}) {
  const [filaSeleccionada, setFilaSeleccionada] = useState(null);
  const [cargandoDetalle, setCargandoDetalle] = useState(false);

  async function verDetalle(fila) {
    // Mismo patrón que licitaciones 
    // fila liviana en tabla 
    // detalle bajo demanda
    setFilaSeleccionada(fila);
    setCargandoDetalle(true);

    try {
      const detalle = await obtenerDetalleOrdenCompra(fila.externalCode);
      if (detalle) setFilaSeleccionada(detalle);
    } catch (error) {
      console.error('Error al cargar detalle de orden de compra:', error);
    } finally {
      setCargandoDetalle(false);
    }
  }

  return (
    <>
      <AvisoSnapshotMp
        desdeCache={desdeCache}
        fechaUsada={fechaUsada}
        hayFilas={filasIniciales.length > 0}
        modulo="órdenes de compra"
      />

      <TablaEntidadesMp
        filasIniciales={filasIniciales}
        tituloContador="órdenes de compra"
        variante="ordenes-compra"
        mostrarFiltroEstado
        onVerDetalle={verDetalle}
      />

      <EntidadMpDetalleModal
        fila={filaSeleccionada}
        cargando={cargandoDetalle}
        onCerrar={() => {
          setFilaSeleccionada(null);
          setCargandoDetalle(false);
        }}
      />
    </>
  );
}