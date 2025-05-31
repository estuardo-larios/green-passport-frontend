'use client';

import { SunIcon, MoonIcon } from '@heroicons/react/24/outline';
import { useEffect, useState, useMemo } from 'react';
import CookieManager from '../lib/cookies';

/**
 * Componente que permite alternar entre modo oscuro y modo claro
 * utilizando una cookie para persistir la preferencia del usuario.
 *
 * Utiliza el hook useMemo para evitar recrear la instancia de CookieManager
 * en cada renderizado.
 *
 * El modo seleccionado se aplica añadiendo o removiendo la clase 'dark'
 * en el elemento raíz del documento.
 */
const ThemeToggleButton = () => {
  // Estado local para controlar si el modo oscuro está activado
  const [isDarkMode, setIsDarkMode] = useState(false);
  console.log('ThemeToggleButton rendered', isDarkMode);

  // Instancia de CookieManager creada solo una vez para evitar recreaciones innecesarias
  const cookieManager = useMemo(() => new CookieManager(), []);

  /**
   * Efecto que se ejecuta al montar el componente para leer
   * la preferencia almacenada en la cookie y aplicar el tema correspondiente.
   */
  useEffect(() => {
    const storedTheme = cookieManager.getCookie('theme'); // Leer cookie 'theme'
    if (storedTheme === 'dark') {
      document.documentElement.classList.add('dark'); // Activar modo oscuro en el DOM
      setIsDarkMode(true);
    } else {
      document.documentElement.classList.remove('dark'); // Activar modo claro en el DOM
      setIsDarkMode(false);
    }
  }, [cookieManager]); // Ejecutar solo cuando cambia cookieManager (una vez)

  /**
   * Función que alterna el tema entre oscuro y claro,
   * actualizando la clase en el DOM y guardando la preferencia en la cookie.
   */
  const toggleTheme = () => {
    if (isDarkMode) {
      document.documentElement.classList.remove('dark');
      cookieManager.setCookie('theme', 'light', 15); // Guardar cookie por 15 días
    } else {
      document.documentElement.classList.add('dark');
      cookieManager.setCookie('theme', 'dark', 15);
    }
    setIsDarkMode(!isDarkMode);
  };

  return (
    <button
      onClick={toggleTheme}
      className="p-2 bg-[#3730a3] rounded-full transition-all duration-300 z-50 fixed bottom-4 right-4"
      aria-label="Toggle dark mode"
    >
      {isDarkMode ? (
        <SunIcon className="h-8 w-8 text-white" />
      ) : (
        <MoonIcon className="h-8 w-8 text-white" />
      )}
    </button>
  );
};

export default ThemeToggleButton;
