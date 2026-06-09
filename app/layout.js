import './globals.css';

export const metadata = {
  title: 'EstadoHUB — APIs Públicas',
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body className="bg-slate-50 text-slate-900 antialiased">
        {children}
      </body>
    </html>
  );
}
