'use client';

import { useState } from 'react';
import TablaEntidadesMp from '../shared/TablaEntidadesMp';
import EntidadMpDetalleModal from '../shared/EntidadMpDetalleModal';
import AvisoSnapshotMp from '../shared/AvisoSnapshotMp';

export default function CompraAgilDashboard({
  filasIniciales = [],
  fechaUsada = '',
  desdeCache = false,
}) {
  const [filaSeleccionada, setFilaSeleccionada] = useState(null);

  return (
    <>
      <AvisoSnapshotMp
        desdeCache={desdeCache}
        fechaUsada={fechaUsada}
        hayFilas={filasIniciales.length > 0}
        modulo="compras ágiles"
      />

      <TablaEntidadesMp
        filasIniciales={filasIniciales}
        tituloContador="compras ágiles"
        mostrarFiltroEstado
        onVerDetalle={setFilaSeleccionada}
      />

      <EntidadMpDetalleModal
        fila={filaSeleccionada}
        onCerrar={() => setFilaSeleccionada(null)}
      />
    </>
  );
}
