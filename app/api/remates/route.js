import { NextResponse } from 'next/server';
import { getRematesActivos } from '@/services/tgrService';

export async function GET(request) {
  try {
    // Extraer parámetros de búsqueda de la URL
    const { searchParams } = new URL(request.url);
    const comuna = searchParams.get('comuna');
    const busqueda = searchParams.get('busqueda');
    
    let datos = await getRematesActivos();

    // Lógica de filtrado en el servidor (arquitectura REST)
    if (comuna && comuna !== 'TODAS') {
      datos = datos.filter(item => item.comunaJuzgado === comuna);
    }

    if (busqueda) {
      const b = busqueda.toLowerCase();
      datos = datos.filter(item => 
        (item.direccionRol || '').toLowerCase().includes(b) || 
        (item.nombreDuegno || '').toLowerCase().includes(b)
      );
    }

    return NextResponse.json({
      success: true,
      count: datos.length,
      data: datos
    }, { status: 200 });

  } catch (error) {
    return NextResponse.json({ 
      success: false, 
      error: "Error interno en el servidor" 
    }, { status: 500 });
  }
}
