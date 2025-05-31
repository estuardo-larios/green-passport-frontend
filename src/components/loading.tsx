import React, { FC } from 'react';

/**
 * Componente que muestra un placeholder de carga animado con efecto pulse.
 */
const Loading: FC = () => {
  return (
    <div className="flex h-screen bg-gray-100">
      <div className="w-64 bg-white shadow-md p-4">
        <div className="space-y-4">
          <div className="h-6 bg-gray-200 rounded w-3/4 animate-pulse"></div>
          <div className="h-6 bg-gray-200 rounded w-3/4 animate-pulse"></div>
          <div className="h-6 bg-gray-200 rounded w-3/4 animate-pulse"></div>
          <div className="h-6 bg-gray-200 rounded w-3/4 animate-pulse"></div>
          <div className="h-6 bg-gray-200 rounded w-3/4 animate-pulse"></div>
          <div className="h-6 bg-gray-200 rounded w-3/4 animate-pulse"></div>
        </div>
      </div>
      <div className="flex-1 p-4"></div>
    </div>
  );
};

export default Loading;
