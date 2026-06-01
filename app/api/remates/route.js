import { NextResponse } from 'next/server';

export async function GET() {
  const url = "https://remates.tgr.cl/v1/getListaRematesActivos";
  try {
    const respuesta = await fetch(url, {
      method: "GET",
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        "Accept": "application/json"
      },
      next: { revalidate: 3600 } 
    });

    if (!respuesta.ok) return NextResponse.json({ error: "Error API" }, { status: respuesta.status });
    const datos = await respuesta.json();
    return NextResponse.json(datos.data || []);
  } catch (error) {
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
