"use client";

import "./globals.css";
import { Provider } from 'react-redux';
import store from "@/redux/store";

/**
 * Componente RootLayout que envuelve toda la aplicación.
 * 
 * Provee el store de Redux a toda la aplicación mediante el componente Provider,
 * asegurando que cualquier componente pueda acceder al estado global.
 * 
 * Recibe como prop los hijos que serán renderizados dentro del body del HTML.
 * 
 * @param children - Contenido o componentes hijos que se renderizarán dentro del layout.
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <Provider store={store}>
      <html lang="en">
        <body>
          {children}
        </body>
      </html>
    </Provider>
  );
}
