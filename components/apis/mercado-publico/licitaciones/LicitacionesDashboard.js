'use client';

import { useState } from 'react';
import TablaEntidadesMp from '../shared/TablaEntidadesMp';
import EntidadMpDetalleModal from '../shared/EntidadMpDetalleModal';
import AvisoSnapshotMp from '../shared/AvisoSnapshotMp';

async function obtenerDetalleLicitacion(codigo) {
  const respuesta = await fetch(
    `/api/mercado-publico/licitaciones/${encodeURIComponent(codigo)}`
  );
  const json = await respuesta.json();
  return json.success ? json.data : null;
}

export default function LicitacionesDashboard({
  filasIniciales = [],
  fechaUsada = '',
  desdeCache = false,
}) {
  const [filaSeleccionada, setFilaSeleccionada] = useState(null);
  const [cargandoDetalle, setCargandoDetalle] = useState(false);

  async function verDetalle(fila) {
    // La lista trae datos resumidos
    // por lo que al abrir el modal pedimos el JSON completo por codigo
    setFilaSeleccionada(fila);
    setCargandoDetalle(true);

    try {
      const detalle = await obtenerDetalleLicitacion(fila.externalCode);
      if (detalle) setFilaSeleccionada(detalle);
    } catch (error) {
      console.error('Error al cargar detalle de licitación:', error);
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
        modulo="licitaciones"
      />

      <TablaEntidadesMp
        filasIniciales={filasIniciales}
        tituloContador="licitaciones"
        variante="licitaciones"
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