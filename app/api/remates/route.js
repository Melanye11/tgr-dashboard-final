import { NextResponse } from 'next/server';
import { getRematesActivos} from '@/services/tgrService;

export async function GET() {
  try {
    const datosLimpios = await getRematesActivos();
    
      return NextResponse.json({
        sucess: true,
        count: datosLimpios.length,
        data: datosLimpios
      }, {status: 200 });

  } catch (error) {
    return NextResponse.json({ 
      success: false,
      error: " Error al intentar obtener los remates "
    }, { satus: 500 });
  }
}
