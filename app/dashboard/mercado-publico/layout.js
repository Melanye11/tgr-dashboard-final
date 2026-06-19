import MpSubnav from '@/components/apis/mercado-publico/MpSubnav';

export default function MercadoPublicoLayout({ children }) {
  return (
    <div className="p-8 font-sans text-slate-800">
      <div className="mb-6">
        <h1 className="text-3xl font-black text-slate-900">Mercado Público</h1>
        <p className="text-slate-500 mt-1">Compras, licitaciones y órdenes del Estado</p>
      </div>

      <MpSubnav />
      {children}
    </div>
  );
}