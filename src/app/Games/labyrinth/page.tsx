/* eslint-disable */
'use client'
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppDispatch } from "@/hooks/hook";
import CookieManager from "@/lib/cookies";
import { updateUserItemCompleted } from "@/actions/userItems.action";
import { fetchUserByEmail } from "@/actions/user.action";

interface Residuo {
  x: number;
  y: number;
  tipo: 'reciclable' | 'organico' | 'peligroso';
}


export default function LaberintoReciclaje() {
  const canvasRef = useRef(null);
  const [gameWon, setGameWon] = useState(false);
  const router = useRouter();
  const cookieManager = new CookieManager();
  const dispatch = useAppDispatch();
  const userEmail = cookieManager.getCookie("email_cookie") || "";

  const closeModal = () => {
    dispatch(fetchUserByEmail(userEmail)).then((user: any) => {
      console.log("User fetched:", user);
      if (user?.id) {
        dispatch(updateUserItemCompleted(user.id, 3, 10));
      } else {
        console.warn("User ID no encontrado");
      }
    setGameWon(false);
    router.push('/')
    }

    ).catch((error) => {
      console.error("Error fetching user:", error);
    });
  
  };

  useEffect(() => {
    const canvas: any = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const TILE_SIZE = 32;
    const MAP_ROWS = 20;
    const MAP_COLS = 30;

    canvas.width = TILE_SIZE * MAP_COLS;
    canvas.height = TILE_SIZE * MAP_ROWS;

    const map = [
      // 20x30 mapa (0 = libre, 1 = pared, 2 = reciclable, 3 = organico, 4 = peligroso)
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

    let player = { x: 1, y: 1 };
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
      
    let carrying: any = null;

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

    const drawPlayer = () => {
      ctx.drawImage(images.player, player.x * TILE_SIZE, player.y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
    };

    const drawResiduos = () => {
      residuos.forEach((r) => {
        if (carrying !== r) {
          const img = images[r.tipo];
          ctx.drawImage(img, r.x * TILE_SIZE, r.y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
        }
      });
    };

    const drawCarrying = () => {
      if (carrying) {
        ctx.fillStyle = 'black';
        ctx.font = '16px Arial';
        ctx.fillText(`Llevando: ${carrying.tipo}`, 10, canvas.height - 10);
      }
    };

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      drawMap();
      drawResiduos();
      drawPlayer();
      drawCarrying();
    };

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
