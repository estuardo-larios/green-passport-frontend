'use client';

import { SunIcon, MoonIcon } from '@heroicons/react/24/outline';
import { useEffect, useState, useMemo } from 'react';
import CookieManager from '../lib/cookies';

const ThemeToggleButton = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  console.log('ThemeToggleButton rendered', isDarkMode);
  
  // Usar useMemo para evitar que cookieManager cambie en cada render
  const cookieManager = useMemo(() => new CookieManager(), []);

  useEffect(() => {
    const storedTheme = cookieManager.getCookie('theme'); // Mover aquí
    if (storedTheme === 'dark') {
      document.documentElement.classList.add('dark');
      setIsDarkMode(true);
    } else {
      document.documentElement.classList.remove('dark');
      setIsDarkMode(false);
    }
  }, [cookieManager]); // Ahora cookieManager no cambia en cada render

  const toggleTheme = () => {
    if (isDarkMode) {
      document.documentElement.classList.remove('dark');
      cookieManager.setCookie('theme', 'light', 15);
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
    >
      {isDarkMode ? <SunIcon className="h-8 w-8 text-white"/> : <MoonIcon className='h-8 w-8 text-white'/>}
    </button>
  );
};

export default ThemeToggleButton;
