import { readFile, writeFile, mkdir } from 'fs/promises';
import path from 'path';
import { fusionarFilasMp } from '@/lib/mercado-publico/fusionarFilasMp';

const DIR_CACHE = path.join(process.cwd(), 'data', 'cache');

const RUTAS = {
  licitaciones: 'licitaciones.snapshot.json',
  'ordenes-compra': 'ordenes-compra.snapshot.json',
  'compra-agil': 'compra-agil.snapshot.json',
};

function rutaSnapshot(modulo) {
  const archivo = RUTAS[modulo];
  if (!archivo) throw new Error(`Módulo snapshot no soportado: ${modulo}`);
  return path.join(DIR_CACHE, archivo);
}

function filasLigeras(filas = []) {
  return filas.map(({ raw, ...resto }) => resto);
}

export async function leerSnapshotMp(modulo) {
  try {
    const contenido = await readFile(rutaSnapshot(modulo), 'utf-8');
    const snapshot = JSON.parse(contenido);
    return {
      filas: Array.isArray(snapshot.filas) ? snapshot.filas : [],
      fechaUsada: snapshot.fechaUsada ?? '',
      guardadoEn: snapshot.guardadoEn ?? null,
      totalRegistros: snapshot.totalRegistros ?? snapshot.filas?.length ?? 0,
      desdeCache: true,
    };
  } catch {
    return {
      filas: [],
      fechaUsada: '',
      guardadoEn: null,
      totalRegistros: 0,
      desdeCache: true,
    };
  }
}

// Lee lo existente 
// fusiona filas nuevas o actualizadas y guarda sin borrar
export async function actualizarSnapshotMp(modulo, { filasNuevas = [], fechaUsada }) {
  const nuevas = filasLigeras(filasNuevas);
  if (nuevas.length === 0) return null;

  const anterior = await leerSnapshotMp(modulo);
  const fusionadas = fusionarFilasMp(anterior.filas, nuevas);

  await mkdir(DIR_CACHE, { recursive: true });

  const snapshot = {
    modulo,
    fechaUsada: fechaUsada ?? anterior.fechaUsada ?? '',
    guardadoEn: new Date().toISOString(),
    totalRegistros: fusionadas.length,
    filas: fusionadas,
  };

  await writeFile(rutaSnapshot(modulo), JSON.stringify(snapshot, null, 2), 'utf-8');
  return snapshot;
}