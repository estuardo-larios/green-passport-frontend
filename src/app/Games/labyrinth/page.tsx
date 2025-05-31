/* eslint-disable */
'use client'
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppDispatch } from "@/hooks/hook";
import CookieManager from "@/lib/cookies";
import { updateUserItemCompleted } from "@/actions/userItems.action";
import { fetchUserByEmail } from "@/actions/user.action";

/**
 * Representa la posición y tipo de un residuo en el mapa del juego.
 * @interface Residuo
 * @property {number} x - Coordenada horizontal en la cuadrícula del mapa.
 * @property {number} y - Coordenada vertical en la cuadrícula del mapa.
 * @property {'reciclable' | 'organico' | 'peligroso'} tipo - Clasificación del residuo según su tipo.
 */
interface Residuo {
  /** Coordenada horizontal en el mapa */
  x: number;
  /** Coordenada vertical en el mapa */
  y: number;
  /** Tipo de residuo para clasificarlo */
  tipo: 'reciclable' | 'organico' | 'peligroso';
}

/**
 * Componente principal del juego "Laberinto de Reciclaje".
 * Renderiza un canvas donde se simula el laberinto con residuos para recolectar.
 * Maneja la lógica de finalización del juego y actualización del estado del usuario.
 *
 * @returns JSX.Element que contiene el canvas del laberinto y la lógica del juego.
 */
export default function LaberintoReciclaje() {
  /**
   * Referencia al elemento canvas donde se dibuja el juego.
   * Se usa useRef para acceder directamente al DOM.
   */
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  /**
   * Estado booleano para controlar si el juego fue ganado.
   */
  const [gameWon, setGameWon] = useState<boolean>(false);

  /**
   * Hook de Next.js para manejar navegación programática.
   */
  const router = useRouter();

  /**
   * Instancia de la clase CookieManager para gestión de cookies.
   */
  const cookieManager = new CookieManager();

  /**
   * Hook de Redux para disparar acciones en el store global.
   */
  const dispatch = useAppDispatch();

  /**
   * Email del usuario extraído de la cookie "email_cookie".
   */
  const userEmail: string = cookieManager.getCookie("email_cookie") || "";

  /**
   * Cierra el modal del juego y actualiza el progreso del usuario.
   * Obtiene los datos del usuario mediante su email y luego
   * actualiza el estado del item completado en el backend.
   * Finalmente redirige a la página principal.
   */
  const closeModal = (): void => {
    dispatch(fetchUserByEmail(userEmail))
      .then((user) => {
        console.log("User fetched:", user);
        if (user?.id) {
          dispatch(updateUserItemCompleted(user.id, 3, 10));
        } else {
          console.warn("User ID no encontrado");
        }
        setGameWon(false);
        router.push('/');
      })
      .catch((error: unknown) => {
        console.error("Error fetching user:", error);
      });
  };

  /**
   * Hook useEffect que configura y dibuja el mapa inicial en el canvas.
   * Define las dimensiones, el mapa de obstáculos y residuos,
   * y prepara el contexto 2D para renderizar.
   */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Tamaño de cada tile en pixeles
    const TILE_SIZE = 32;

    // Número de filas y columnas del mapa
    const MAP_ROWS = 20;
    const MAP_COLS = 30;

    // Ajusta el tamaño del canvas acorde al mapa
    canvas.width = TILE_SIZE * MAP_COLS;
    canvas.height = TILE_SIZE * MAP_ROWS;

    // Matriz que representa el mapa:
    // 0 = libre, 1 = pared, 2 = reciclable, 3 = orgánico, 4 = peligroso, 5 = punto especial
    const map: number[][] = [
      [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
      [1,0,0,0,0,0,1,0,2,0,1,0,0,0,0,1,0,0,0,0,0,1,0,3,0,0,0,0,0,1],
      [1,0,1,1,1,0,1,0,1,0,1,0,1,1,0,1,0,1,1,1,0,1,0,1,0,1,1,1,0,1],
      [1,0,0,0,1,0,0,0,1,0,1,0,0,1,0,0,0,0,0,1,0,0,0,1,0,0,0,1,0,1],
      [1,1,1,0,1,1,1,0,1,0,1,1,0,1,1,1,1,1,0,1,1,1,0,1,1,1,0,1,0,1],
      [1,0,0,0,0,0,1,0,1,0,0,0,0,0,0,0,0,1,0,0,0,1,0,0,0,1,0,1,0,1],
      [1,0,1,1,1,0,1,0,1,1,1,1,1,1,0,1,0,1,1,1,0,1,1,1,0,1,0,1,0,1],
      [1,0,1,0,0,0,1,0,0,0,0,0,0,1,0,1,0,0,0,1,0,0,0,0,0,1,0,1,0,1],
      [1,0,1,0,1,1,1,1,1,1,0,1,0,1,0,1,1,1,0,1,1,1,1,1,0,1,0,1,0,1],
      [1,0,0,0,0,0,0,0,0,1,0,1,0,0,0,0,0,1,0,0,0,0,0,0,0,1,0,1,0,1],
      [1,1,1,1,1,1,1,1,0,1,0,1,1,1,1,1,0,1,1,1,1,1,1,1,0,1,0,1,0,1],
      [1,0,0,0,0,0,0,1,0,1,0,0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0,1,0,1],
      [1,0,1,1,1,1,0,1,0,1,1,1,1,1,0,1,1,1,1,1,1,1,0,1,1,1,0,1,0,1],
      [1,0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0,1,0,0,0,1],
      [1,1,1,1,0,1,1,1,1,1,1,1,0,1,1,1,1,1,1,1,0,1,1,1,0,1,1,1,1,1],
      [1,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0,1,0,0,0,0,0,1],
      [1,0,1,1,1,1,1,1,1,1,0,1,1,1,1,1,1,1,0,1,1,1,1,1,1,1,1,1,0,1],
      [1,0,1,5,0,0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,5,0,1,0,1],
      [1,0,0,0,0,1,1,1,0,1,1,1,1,1,1,1,0,1,1,1,1,1,1,1,0,0,0,1,4,1],
      [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    ];
    /**
     * Representa la posición del jugador en el mapa.
     * @type {{ x: number; y: number }}
     */
    let player = { x: 1, y: 1 };
    /**
     * Lista de residuos dispersos en el mapa del juego.
     * Cada residuo contiene su posición y su tipo específico.
     * @type {Residuo[]}
     */
    let residuos = [
        { x: 6, y: 3, tipo: 'reciclable' },
        { x: 20, y: 3, tipo: 'organico' },
        { x: 24, y: 15, tipo: 'peligroso' },
        { x: 23, y: 13, tipo: 'reciclable' },
        { x: 4, y: 15, tipo: 'peligroso' },
        { x: 14, y: 6, tipo: 'organico' }, 
        { x: 11, y: 5, tipo: 'reciclable' }, 
        { x: 12, y: 11, tipo: 'organico' },
      ];
    /**
     * Objeto que representa el residuo actualmente cargado por el jugador.
     * Puede ser `null` si no se está cargando ningún residuo.
     * @type {Residuo | null}
     */
    let carrying: any = null;

    /**
     * Colección de imágenes utilizadas en el juego, indexadas por un string identificador.
     * Cada imagen corresponde a un elemento visual del juego, como el jugador o los residuos.
     * @type {Record<string, HTMLImageElement>}
     */
    const images: Record<string, HTMLImageElement> = {
        player: new Image(),
        reciclable: new Image(),
        organico: new Image(),
        peligroso: new Image(),
      
        manzana: new Image(),
        lata: new Image(),
        bombilla: new Image(),
      
        binReciclable: new Image(),
        binOrganico: new Image(),
        binPeligroso: new Image(),
      };

    images.player.src = '/trashTruck.svg';
    images.reciclable.src = '/cardboardBox.svg';
    images.organico.src = '/banana.svg';
    images.peligroso.src = '/BATTERY.svg';

    images.binReciclable.src = '/trashRecicle.svg';
    images.binOrganico.src = '/organicTrash.svg';
    images.binPeligroso.src = '/nuclearTrash.svg';

    images.manzana.src = '/APPLE.svg';
    images.lata.src = '/can.svg';
    images.bombilla.src = '/light.svg';

    /**
     * Dibuja el mapa base del juego en el canvas, representando paredes y zonas de depósito.
     * @function drawMap
     */
    const drawMap = () => {
      for (let row = 0; row < MAP_ROWS; row++) {
        for (let col = 0; col < MAP_COLS; col++) {
          const tile = map[row][col];
          ctx.fillStyle = '#eee';
          ctx.fillRect(col * TILE_SIZE, row * TILE_SIZE, TILE_SIZE, TILE_SIZE);

          if (tile === 1) {
            ctx.fillStyle = '#444';
            ctx.fillRect(col * TILE_SIZE, row * TILE_SIZE, TILE_SIZE, TILE_SIZE);
          }

          if (tile === 2) {
            ctx.drawImage(images.binReciclable, col * TILE_SIZE, row * TILE_SIZE, TILE_SIZE, TILE_SIZE);
          } else if (tile === 3) {
            ctx.drawImage(images.binOrganico, col * TILE_SIZE, row * TILE_SIZE, TILE_SIZE, TILE_SIZE);
          } else if (tile === 4) {
            ctx.drawImage(images.binPeligroso, col * TILE_SIZE, row * TILE_SIZE, TILE_SIZE, TILE_SIZE);
          }
        }
      }
    };

    /**
     * Dibuja la representación visual del jugador en el canvas.
     * @function drawPlayer
     */
    const drawPlayer = () => {
      ctx.drawImage(images.player, player.x * TILE_SIZE, player.y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
    };

    /**
     * Dibuja todos los residuos en el mapa, exceptuando el que el jugador esté cargando.
     * @function drawResiduos
     */
    const drawResiduos = () => {
      residuos.forEach((r) => {
        if (carrying !== r) {
          const img = images[r.tipo];
          ctx.drawImage(img, r.x * TILE_SIZE, r.y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
        }
      });
    };

    /**
    * Muestra en el canvas el residuo que el jugador está cargando actualmente.
    * @function drawCarrying
    */
    const drawCarrying = () => {
      if (carrying) {
        ctx.fillStyle = 'black';
        ctx.font = '16px Arial';
        ctx.fillText(`Llevando: ${carrying.tipo}`, 10, canvas.height - 10);
      }
    };


    /**
     * Función principal de renderizado que limpia el canvas y dibuja todos los elementos visibles.
     * @function draw
     */
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      drawMap();
      drawResiduos();
      drawPlayer();
      drawCarrying();
    };
    /**
     * Mueve al jugador en la dirección especificada, valida colisiones y maneja la lógica de recolección y depósito de residuos.
     * @function movePlayer
     * @param {number} dx - Movimiento horizontal (positivo o negativo).
     * @param {number} dy - Movimiento vertical (positivo o negativo).
     */
    const movePlayer = (dx: number, dy: number) => {
      const newX = player.x + dx;
      const newY = player.y + dy;
      if (map[newY][newX] !== 1) {
        player.x = newX;
        player.y = newY;

        if (!carrying) {
          for (const r of residuos) {
            if (r.x === player.x && r.y === player.y) {
              carrying = r;
              break;
            }
          }
        } else {
          const tile = map[player.y][player.x];
          if (
            (tile === 2 && carrying.tipo === 'reciclable') ||
            (tile === 3 && carrying.tipo === 'organico') ||
            (tile === 4 && carrying.tipo === 'peligroso')
          ) {
            residuos = residuos.filter((r) => r !== carrying);
            carrying = null;
            if (residuos.length === 0) setGameWon(true);
          }
        }

        draw();
      }
    };
    
    /**
     * Controlador de eventos para manejar el movimiento del jugador mediante las teclas de flecha o WASD.
     * @function handleKeyDown
     * @param {KeyboardEvent} e - Evento de teclado capturado.
     */
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp':
        case 'w':
          movePlayer(0, -1);
          break;
        case 'ArrowDown':
        case 's':
          movePlayer(0, 1);
          break;
        case 'ArrowLeft':
        case 'a':
          movePlayer(-1, 0);
          break;
        case 'ArrowRight':
        case 'd':
          movePlayer(1, 0);
          break;
      }
    };

    const allImages = Object.values(images);
    let loadedImages = 0;
    allImages.forEach((img) => {
      img.onload = () => {
        loadedImages++;
        if (loadedImages === allImages.length) {
          draw();
        }
      };
    });

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <div className="flex justify-center items-center h-screen bg-white overflow-auto">
      <canvas ref={canvasRef} className="border border-black" />
      {gameWon && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            background: 'linear-gradient(to bottom, rgba(255,255,255,0.3), rgba(255,255,255,0.1))',
            backdropFilter: 'blur(6px)',
            WebkitBackdropFilter: 'blur(6px)',
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
              backgroundColor: '#ffffffee',
              color: '#000000', // color negro para todo el texto por defecto
              padding: '2rem',
              borderRadius: '16px',
              maxWidth: '500px',
              width: '100%',
              textAlign: 'left',
              boxShadow: '0 10px 25px rgba(0,0,0,0.3)',
              maxHeight: '85vh',
              overflowY: 'auto',
              fontFamily: 'sans-serif',
            }}
          >
            <h2
              style={{
                fontSize: '1.75rem',
                fontWeight: '700',
                marginBottom: '1rem',
                color: '#1b4332', // verde solo para el título
              }}
            >
              🌱 ¡Felicidades! Has ganado
            </h2>

            <p style={{ fontSize: '1rem', lineHeight: '1.6', marginBottom: '1rem' }}>
              Los <strong>residuos reciclables</strong>, según el <strong>Acuerdo Gubernativo 164-2021</strong> de Guatemala, son aquellos materiales que pueden ser reprocesados para fabricar nuevos productos.
            </p>

            <p style={{ fontSize: '1rem', lineHeight: '1.6', marginBottom: '1rem' }}>
              Entre ellos se encuentran el papel, cartón, vidrio, metales como aluminio y hierro, plásticos etiquetados para reciclaje, y otros materiales reutilizables.
            </p>

            <p style={{ fontSize: '1rem', lineHeight: '1.6', fontStyle: 'italic' }}>
              Separar y disponer correctamente estos residuos contribuye a la conservación del medio ambiente, la reducción de la contaminación y el aprovechamiento eficiente de los recursos.
            </p>

            <button
              onClick={closeModal}
              style={{
                marginTop: '2rem',
                padding: '0.75rem 1.5rem',
                backgroundColor: '#2d6a4f',
                color: '#fff',
                fontWeight: 'bold',
                fontSize: '1rem',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                transition: 'background 0.3s',
              }}
              onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#1b4332')}
              onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#2d6a4f')}
            >
              Entendido y cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
