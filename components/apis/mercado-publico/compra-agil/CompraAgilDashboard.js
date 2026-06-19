'use client';

import { useState } from 'react';
import TablaEntidadesMp from '../shared/TablaEntidadesMp';
import AvisoSnapshotMp from '../shared/AvisoSnapshotMp';
import CompraAgilDetalleModal from './CompraAgilDetalleModal';

async function obtenerDetalleCompraAgil(codigo) {
  const respuesta = await fetch(
    `/api/mercado-publico/compra-agil/${encodeURIComponent(codigo)}`
  );
  const json = await respuesta.json();
  return json.success ? json.data : null;
}

export default function CompraAgilDashboard({
  filasIniciales = [],
  fechaUsada = '',
  desdeCache = false,
}) {
  const [detalle, setDetalle] = useState(null);
  const [cargandoDetalle, setCargandoDetalle] = useState(false);

  async function verDetalle(fila) {
    setDetalle(null);
    setCargandoDetalle(true);

    try {
      const detalleCompleto = await obtenerDetalleCompraAgil(fila.externalCode);
      if (detalleCompleto) setDetalle(detalleCompleto);
    } catch (error) {
      console.error('Error al cargar detalle de compra ágil:', error);
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
        modulo="compras ágiles"
      />

      <TablaEntidadesMp
        filasIniciales={filasIniciales}
        tituloContador="compras ágiles"
        mostrarFiltroEstado
        onVerDetalle={verDetalle}
      />

      <CompraAgilDetalleModal
        detalle={detalle}
        cargando={cargandoDetalle}
        onCerrar={() => {
          setDetalle(null);
          setCargandoDetalle(false);
        }}
      />
    </>
  );
}