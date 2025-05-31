/* eslint-disable */

'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAppDispatch } from "@/hooks/hook";
import CookieManager from "@/lib/cookies";
import { updateUserItemCompleted } from "@/actions/userItems.action";
import { fetchUserByEmail } from "@/actions/user.action";

/**
 * Representa un objeto que el jugador debe recoger en el juego.
 * @typedef {Object} Item
 * @property {number} x - Posición X en la cuadrícula.
 * @property {number} y - Posición Y en la cuadrícula.
 * @property {string} type - Tipo de objeto (ej. 'BATTERY', 'glass').
 */
interface Item {
  x: number;
  y: number;
  type: string;
}

/**
 * Representa una pared en el laberinto.
 * @typedef {Object} Wall
 * @property {number} x - Posición X en la cuadrícula.
 * @property {number} y - Posición Y en la cuadrícula.
 */
interface Wall {
  x: number;
  y: number;
}

/**
 * Layout del laberinto representado como arreglo de strings,
 * donde 'W' indica pared y espacios indican camino libre.
 */
const mazeLayout: string[] = [
  'WWWWWWWWWWWWWWWWWWWWWWWWWWWWWW',
  'W            W               W',
  'W WWW WW WW WW WWWWW WWW W W W',
  'W W   W   W    W       W W W W',
  'W WWW WWWWW WW WWWWW WWW W W W',
  'W                          W W',
  'W WWW WW WWWWWWWW WW WWW   W W',
  'W     WW    WW    WW       W W',
  'WWWW WWWWW WW WW WWWWW WWWWW W',
  'W                            W',
  'W WWW WW WW WW WWWWW WWW W W W',
  'W   W W   W        W W   W W W',
  'WWW W WWWWW WW WWWWW W WWW W W',
  'W                          W W',
  'W WWWWWWWWWWWWWWWWWWWWWWWW W W',
  'W                            W',
  'WWWWWWWWWWWWWWWWWWWWWWWWWWWWWW',
];

/** Tamaño de cada tile/cuadro del laberinto en pixeles. */
const TILE_SIZE = 30;

/** Número de columnas del laberinto, calculado desde el layout. */
const mazeCols = mazeLayout[0].length;

/** Número de filas del laberinto, calculado desde el layout. */
const mazeRows = mazeLayout.length;

/** Ancho total del canvas en pixeles. */
const WIDTH = mazeCols * TILE_SIZE;

/** Alto total del canvas en pixeles. */
const HEIGHT = mazeRows * TILE_SIZE;

/** Array que almacena las paredes del laberinto. */
const walls: Wall[] = [];

/**
 * Recorre el layout y llena el arreglo de paredes con
 * las posiciones donde aparece una 'W'.
 */
mazeLayout.forEach((row, y) => {
  row.split('').forEach((cell, x) => {
    if (cell === 'W') {
      walls.push({ x, y });
    }
  });
});

/**
 * Función que verifica si una posición específica es una pared.
 * @param {number} x - Posición X a verificar.
 * @param {number} y - Posición Y a verificar.
 * @returns {boolean} True si la posición es una pared, false si no.
 */
function isWall(x: number, y: number): boolean {
  return walls.some(w => w.x === x && w.y === y);
}

/**
 * Genera una lista de items no reciclables con posiciones aleatorias
 * dentro del laberinto que no colisionen con paredes ni otros items.
 * @param {number} count - Número de items a generar.
 * @returns {Item[]} Arreglo con los items generados.
 */
function generateNonRecyclableItems(count: number): Item[] {
  const items: Item[] = [];
  const types = ['BATTERY', 'glass', 'light', 'cigarette'];

  let attempts = 0;
  while (items.length < count && attempts < 1000) {
    const x = Math.floor(Math.random() * (WIDTH / TILE_SIZE));
    const y = Math.floor(Math.random() * (HEIGHT / TILE_SIZE));

    if (!isWall(x, y) && !items.some(item => item.x === x && item.y === y)) {
      items.push({ x, y, type: types[items.length % types.length] });
    }

    attempts++;
  }

  return items;
}

/**
 * Representa una posición en la cuadrícula.
 */
interface Position {
  x: number;
  y: number;
}

/**
 * Componente principal del juego Pacman para recolectar items no reciclables.
 * Controla la lógica del juego, renderizado y eventos de teclado.
 * @returns JSX.Element
 */
export default function PacmanNonRecyclable() {
  // Referencia al elemento canvas para dibujar el juego.
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Hook para navegación con Next.js
  const router = useRouter();

  // Instancia para manejar cookies (obtener email de usuario).
  const cookieManager = new CookieManager();

  // Hook para ejecutar acciones Redux
  const dispatch = useAppDispatch();

  // Correo del usuario obtenido de cookie, o cadena vacía si no existe.
  const userEmail: string = cookieManager.getCookie("email_cookie") || "";

  // Estado con los items no reciclables generados en el mapa.
  const [nonRecyclableItems, setNonRecyclableItems] = useState<Item[]>([]);

  // Estado con la posición actual del jugador.
  const [playerPos, setPlayerPos] = useState<Position>({ x: 1, y: 1 });

  // Estado que almacena las posiciones de los items ya recolectados.
  const [collected, setCollected] = useState<string[]>([]);

  // Estado que indica si el juego fue ganado.
  const [gameWon, setGameWon] = useState<boolean>(false);

  // Estado que indica si el juego terminó en derrota.
  const [gameOver, setGameOver] = useState<boolean>(false);

  // Estado con posiciones actuales de los fantasmas (enemigos).
  const [ghosts, setGhosts] = useState<Position[]>([
    { x: 10, y: 10 },
    { x: 14, y: 2 },
    { x: 18, y: 12 },
    { x: 22, y: 8 },
    { x: 6, y: 14 },
  ]);

  // Se generan los items no reciclables al montar el componente.
  useEffect(() => {
    setNonRecyclableItems(generateNonRecyclableItems(6));
  }, []);

  /**
   * Ref para almacenar las imágenes usadas en el juego
   * (items, fantasmas y jugador).
   */
  const images = useRef<{ [key: string]: HTMLImageElement }>({});

  /**
   * Carga las imágenes necesarias para el juego y ejecuta
   * callback cuando todas hayan cargado.
   * @param {() => void} onAllLoaded - Función a ejecutar cuando cargan todas las imágenes.
   */
  function loadImages(onAllLoaded: () => void) {
    const types = ['BATTERY', 'glass', 'light', 'cigarette'];
    let loadedCount = 0;
    const totalImages = types.length + 2; // items + fantasma + jugador

    function onLoad() {
      loadedCount++;
      if (loadedCount === totalImages) {
        onAllLoaded();
      }
    }

    // Carga imágenes de los items
    types.forEach(type => {
      const img = new Image();
      img.src = `/${type}.svg`;
      img.onload = onLoad;
      images.current[type] = img;
    });

    // Carga imagen del fantasma
    const ghostImg = new Image();
    ghostImg.src = '/police.svg';
    ghostImg.onload = onLoad;
    images.current['ghost'] = ghostImg;

    // Carga imagen del jugador
    const playerImg = new Image();
    playerImg.src = '/trashTruck.svg';
    playerImg.onload = onLoad;
    images.current['player'] = playerImg;
  }
    
/**
 * Carga las imágenes necesarias y actualiza los items no reciclables
 * para forzar re-render cuando se cargan.
 */
useEffect(() => {
  loadImages(() => {
    setNonRecyclableItems((items) => [...items]);
  });
}, []);

/**
 * Carga las imágenes necesarias solo una vez al montar el componente.
 */
useEffect(() => {
  loadImages(() => {});
}, []);

/**
 * Maneja el evento de teclado para mover al jugador en el laberinto.
 * @param e Evento del teclado con la tecla presionada.
 */
useEffect(() => {
  const handleKeyDown = (e: KeyboardEvent) => {
    if (gameOver || gameWon) return;

    let newPos: Position = { ...playerPos };
    if (e.key === 'ArrowUp') newPos.y -= 1;
    if (e.key === 'ArrowDown') newPos.y += 1;
    if (e.key === 'ArrowLeft') newPos.x -= 1;
    if (e.key === 'ArrowRight') newPos.x += 1;

    // Verifica que la nueva posición esté dentro del área y no sea pared
    if (
      newPos.x >= 0 && newPos.x < WIDTH / TILE_SIZE &&
      newPos.y >= 0 && newPos.y < HEIGHT / TILE_SIZE &&
      !walls.some(w => w.x === newPos.x && w.y === newPos.y)
    ) {
      setPlayerPos(newPos);
    }
  };

  window.addEventListener('keydown', handleKeyDown);
  return () => window.removeEventListener('keydown', handleKeyDown);
}, [playerPos, gameOver, gameWon]);

/**
 * Detecta si el jugador recolecta un item no reciclable.
 * Actualiza la lista de items recolectados y verifica si el juego se gana.
 */
useEffect(() => {
  if (gameOver || gameWon) return;

  const foundItem = nonRecyclableItems.find(
    (item) => item.x === playerPos.x && item.y === playerPos.y &&
    !collected.includes(`${item.x}-${item.y}`) // Verifica que no esté ya recolectado
  );

  if (foundItem) {
    setCollected(prev => [...prev, `${foundItem.x}-${foundItem.y}`]);
    if (collected.length + 1 === nonRecyclableItems.length) {
      setGameWon(true);
    }
  }
}, [playerPos, collected, gameOver, gameWon]);

/**
 * Controla el movimiento de los fantasmas cada 500 ms.
 * Los fantasmas se mueven aleatoriamente evitando paredes.
 */
useEffect(() => {
  if (gameOver || gameWon) return;

  const interval = setInterval(() => {
    setGhosts((prevGhosts) =>
      prevGhosts.map((ghost) => {
        const directions: Position[] = [
          { x: 0, y: -1 },
          { x: 0, y: 1 },
          { x: -1, y: 0 },
          { x: 1, y: 0 },
        ];

        // Filtra las direcciones válidas para moverse
        const validDirections = directions.filter(({ x, y }) => {
          const newX = ghost.x + x;
          const newY = ghost.y + y;
          return (
            newX >= 0 &&
            newX < WIDTH / TILE_SIZE &&
            newY >= 0 &&
            newY < HEIGHT / TILE_SIZE &&
            !walls.some(w => w.x === newX && w.y === newY)
          );
        });

        if (validDirections.length === 0) return ghost;

        // Selecciona aleatoriamente una dirección válida
        const move = validDirections[Math.floor(Math.random() * validDirections.length)];

        return { x: ghost.x + move.x, y: ghost.y + move.y };
      })
    );
  }, 500);

  return () => clearInterval(interval);
}, [gameOver, gameWon]);

/**
 * Detecta colisión entre fantasmas y jugador.
 * Si hay colisión, termina el juego con pérdida.
 */
useEffect(() => {
  if (gameWon || gameOver) return;

  const collision = ghosts.some(g => g.x === playerPos.x && g.y === playerPos.y);
  if (collision) {
    setGameOver(true);
  }
}, [playerPos, ghosts, gameOver, gameWon]);

/**
 * Reinicia el estado del juego a su configuración inicial.
 */
const resetGame = (): void => {
  setGameWon(false);
  setGameOver(false);
  setCollected([]);
  setPlayerPos({ x: 1, y: 1 });
  setGhosts([
    { x: 10, y: 10 },
    { x: 14, y: 2 },
    { x: 18, y: 12 },
    { x: 22, y: 8 },
    { x: 6, y: 14 },
  ]);
  setNonRecyclableItems(generateNonRecyclableItems(6));
};

/**
 * Dibuja el estado actual del juego en el canvas.
 * Limpia y pinta el fondo, paredes, items, fantasmas y jugador.
 */
useEffect(() => {
  const ctx = canvasRef.current?.getContext('2d');
  if (!ctx) return;

  ctx.clearRect(0, 0, WIDTH, HEIGHT);

  // Fondo blanco
  ctx.fillStyle = 'white';
  ctx.fillRect(0, 0, WIDTH, HEIGHT);

  // Dibuja paredes
  ctx.fillStyle = 'black';
  walls.forEach(({ x, y }) => {
    ctx.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
  });

  // Dibuja items no reciclables aún no recolectados
  nonRecyclableItems.forEach(({ x, y, type }) => {
    const id = `${x}-${y}`;
    const img = images.current[type];
    if (!collected.includes(id) && img?.complete) {
      ctx.drawImage(img, x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
    }
  });

  // Dibuja fantasmas
  ghosts.forEach(({ x, y }) => {
    const img = images.current['ghost'];
    if (img?.complete) {
      ctx.drawImage(img, x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
    }
  });

  // Dibuja jugador
  const playerImg = images.current['player'];
  if (playerImg?.complete) {
    ctx.drawImage(playerImg, playerPos.x * TILE_SIZE, playerPos.y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
  }
}, [playerPos, collected, ghosts, nonRecyclableItems]);

/**
 * Estado para el tamaño del canvas en base al tamaño de ventana.
 */
const [canvasSize, setCanvasSize] = useState<{ width: number; height: number }>({
  width: 0,
  height: 0,
});

/**
 * Actualiza el tamaño del canvas cuando cambia el tamaño de la ventana.
 */
useEffect(() => {
  const updateCanvasSize = () => {
    setCanvasSize({ width: window.innerWidth, height: window.innerHeight });
  };

  updateCanvasSize();
  window.addEventListener('resize', updateCanvasSize);
  return () => window.removeEventListener('resize', updateCanvasSize);
}, []);

/**
 * Confirma la victoria actualizando progreso en backend y navegando.
 * Realiza dispatch para actualizar estado del usuario.
 */
const confirmWin = (): void => {
  dispatch(fetchUserByEmail(userEmail))
    .then((user: any) => {
      console.log("User fetched:", user);
      if (user?.id) {
        dispatch(updateUserItemCompleted(user.id, 4, 10));
      } else {
        console.warn("User ID no encontrado");
      }
      router.push('/');
    })
    .catch((error) => {
      console.error("Error fetching user:", error);
    });
};


  return (
    <>
  <div
    style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      width: '100vw',
      height: '100vh',
      backgroundColor: 'white',
      overflow: 'hidden',
    }}
  >
    <canvas
      ref={canvasRef}
      width={WIDTH}
      height={HEIGHT}
      style={{
        backgroundColor: 'white',
        border: '2px solid black',
      }}
    />
  </div>

  {gameWon && (
    <div
        style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        backgroundColor: 'rgba(0,0,0,0.7)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 9999,
        padding: '1rem',
        overflowY: 'auto',
        }}
    >
        <div
        style={{
            backgroundColor: 'white',
            padding: '2rem',
            borderRadius: '8px',
            maxWidth: '400px',
            textAlign: 'center',
            boxShadow: '0 0 10px rgba(0,0,0,0.25)',
            maxHeight: '80vh',
            overflowY: 'auto',
            color: 'black',
            fontFamily: 'sans-serif',
        }}
        >
        <h2
            style={{
            color: '#1b4332',
            fontWeight: '700',
            fontSize: '1.5rem',
            marginBottom: '1rem',
            }}
        >
            ¡Felicidades 🎉! Has recolectado todos los residuos no reciclables
        </h2>
        <p style={{ textAlign: 'justify', marginTop: '1rem' }}>
            Los residuos no reciclables son aquellos que no pueden ser reprocesados para fabricar nuevos productos y requieren una disposición especial para evitar daño ambiental. Ejemplos incluyen pañales, bolsas plásticas contaminadas, vidrios rotos, entre otros.
        </p>
        <button
            onClick={() => confirmWin()}
            style={{
            marginTop: '1.5rem',
            padding: '0.5rem 1rem',
            backgroundColor: '#4caf50',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            }}
        >
            Entendido y cerrar
        </button>
        </div>
    </div>
    )}


    {gameOver && (
    <div
        style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        backgroundColor: 'rgba(0,0,0,0.8)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 9999,
        padding: '1rem',
        }}
    >
        <div
        style={{
            backgroundColor: 'white',
            padding: '2rem',
            borderRadius: '8px',
            maxWidth: '300px',
            textAlign: 'center',
            boxShadow: '0 0 10px rgba(0,0,0,0.25)',
            color: 'black', // Texto general negro
            fontFamily: 'sans-serif',
        }}
        >
        <h2
            style={{
            color: '#1b4332', // Título en verde
            fontWeight: '700',
            fontSize: '1.25rem',
            marginBottom: '1rem',
            }}
        >
            Has sido atrapado por un fantasma
        </h2>
        <button
            onClick={resetGame}
            style={{
            marginTop: '1rem',
            padding: '0.5rem 1rem',
            backgroundColor: '#f44336',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            }}
        >
            Intentar de nuevo
        </button>
        </div>
    </div>
    )}

    </>
  );
}
