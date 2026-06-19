import { NextResponse } from 'next/server';
import { getRematesActivos } from '@/services/tgr';
import { filtrarRematesTGR } from '@/lib/filters';

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const comuna = searchParams.get('comuna');
        const busqueda = searchParams.get('busqueda');
    
        const datos = filtrarRematesTGR(await getRematesActivos(), {
          comuna,
          busqueda,
        });


        return NextResponse.json({
            success: true,
            count: datos.length,
            data: datos,
          }, { status: 200 });


        } catch (error) {
            return NextResponse.json({
              success: false,
              error: 'Error interno en el servidor',
            }, { status: 500 });
          }
        }