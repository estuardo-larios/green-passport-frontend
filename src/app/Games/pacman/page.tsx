/* eslint-disable */

'use client';
import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAppDispatch } from "@/hooks/hook";
import CookieManager from "@/lib/cookies";
import { updateUserItemCompleted } from "@/actions/userItems.action";
import { fetchUserByEmail } from "@/actions/user.action";

interface Item {
  x: number;
  y: number;
  type: string;
}

interface Wall {
  x: number;
  y: number;
}

  
  const mazeLayout = [
    'WWWWWWWWWWWWWWWWWWWWWWWWWWWWWW',
    'W            W               W' ,
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
  const TILE_SIZE = 30;
    const mazeCols = mazeLayout[0].length;
    const mazeRows = mazeLayout.length;
    const WIDTH = mazeCols * TILE_SIZE;
    const HEIGHT = mazeRows * TILE_SIZE;
  const walls: Wall[] = [];
    mazeLayout.forEach((row, y) => {
    row.split('').forEach((cell, x) => {
        if (cell === 'W') {
        walls.push({ x, y });
        }
    });
  });

  function isWall(x: number, y: number): boolean {
    return walls.some(w => w.x === x && w.y === y);
  }  

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

interface Position {
  x: number;
  y: number;
}

export default function PacmanNonRecyclable() {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const router = useRouter();
    const cookieManager = new CookieManager();
    const dispatch = useAppDispatch();
    const userEmail = cookieManager.getCookie("email_cookie") || "";
    const [nonRecyclableItems, setNonRecyclableItems] = useState<Item[]>([]);
    const [playerPos, setPlayerPos] = useState<Position>({ x: 1, y: 1 });
    const [collected, setCollected] = useState<string[]>([]);
    const [gameWon, setGameWon] = useState<boolean>(false);
    const [gameOver, setGameOver] = useState<boolean>(false);
    const [ghosts, setGhosts] = useState<Position[]>([
      { x: 10, y: 10 },
      { x: 14, y: 2 },
      { x: 18, y: 12 },
      { x: 22, y: 8 },
      { x: 6, y: 14 },
    ]);
  
    useEffect(() => {
      setNonRecyclableItems(generateNonRecyclableItems(6));
    }, []);

    const images = useRef<{ [key: string]: HTMLImageElement }>({});

    function loadImages(onAllLoaded: () => void) {
      const types = ['BATTERY', 'glass', 'light', 'cigarette'];
      let loadedCount = 0;
      const totalImages = types.length + 2;
    
      function onLoad() {
        loadedCount++;
        if (loadedCount === totalImages) {
          onAllLoaded();
        }
      }
    
      types.forEach(type => {
        const img = new Image();
        img.src = `/${type}.svg`;
        img.onload = onLoad;
        images.current[type] = img;
      });
    
      const ghostImg = new Image();
      ghostImg.src = '/police.svg';
      ghostImg.onload = onLoad;
      images.current['ghost'] = ghostImg;
    
      const playerImg = new Image();
      playerImg.src = '/trashTruck.svg';
      playerImg.onload = onLoad;
      images.current['player'] = playerImg;
    }
    
    useEffect(() => {
      loadImages(() => {
        setNonRecyclableItems((items) => [...items]);
      });
    }, []);
    

    useEffect(() => {
        loadImages(() => {});
      }, []);
      

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameOver || gameWon) return;

      let newPos: Position = { ...playerPos };
      if (e.key === 'ArrowUp') newPos.y -= 1;
      if (e.key === 'ArrowDown') newPos.y += 1;
      if (e.key === 'ArrowLeft') newPos.x -= 1;
      if (e.key === 'ArrowRight') newPos.x += 1;

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

  useEffect(() => {
    if (gameOver || gameWon) return;
  
    const foundItem = nonRecyclableItems.find(
      (item) => item.x === playerPos.x && item.y === playerPos.y
      && !collected.includes(`${item.x}-${item.y}`) // Verifica por coordenadas
    );
  
    if (foundItem) {
      setCollected(prev => [...prev, `${foundItem.x}-${foundItem.y}`]);
      if (collected.length + 1 === nonRecyclableItems.length) {
        setGameWon(true);
      }
    }
  }, [playerPos, collected, gameOver, gameWon]);

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

          const move = validDirections[Math.floor(Math.random() * validDirections.length)];

          return { x: ghost.x + move.x, y: ghost.y + move.y };
        })
      );
    }, 500);

    return () => clearInterval(interval);
  }, [gameOver, gameWon]);

  useEffect(() => {
    if (gameWon || gameOver) return;

    const collision = ghosts.some(g => g.x === playerPos.x && g.y === playerPos.y);
    if (collision) {
      setGameOver(true);
    }
  }, [playerPos, ghosts, gameOver, gameWon]);

  const resetGame = () => {
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
  

  useEffect(() => {
    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx) return;
  
    ctx.clearRect(0, 0, WIDTH, HEIGHT);
  
    // Fondo blanco
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, WIDTH, HEIGHT);
  
    ctx.fillStyle = 'black';
    walls.forEach(({ x, y }) => {
      ctx.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
    });
  
    nonRecyclableItems.forEach(({ x, y, type }) => {
        const id = `${x}-${y}`;
        const img = images.current[type];
        if (!collected.includes(id) && img?.complete) {
          ctx.drawImage(img, x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
        }
      });
      
      ghosts.forEach(({ x, y }) => {
        const img = images.current['ghost'];
        if (img?.complete) {
          ctx.drawImage(img, x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
        }
      });
      
      const playerImg = images.current['player'];
      if (playerImg?.complete) {
        ctx.drawImage(playerImg, playerPos.x * TILE_SIZE, playerPos.y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
      }
      
  }, [playerPos, collected, ghosts, nonRecyclableItems]);
  

  const [canvasSize, setCanvasSize] = useState<{ width: number; height: number }>({
    width: 0,
    height: 0,
  });
  
  useEffect(() => {
    const updateCanvasSize = () => {
      setCanvasSize({ width: window.innerWidth, height: window.innerHeight });
    };
  
    updateCanvasSize();
    window.addEventListener('resize', updateCanvasSize);
    return () => window.removeEventListener('resize', updateCanvasSize);
  }, []);
  
  const confirmWin = () => {
    dispatch(fetchUserByEmail(userEmail)).then((user: any) => {
      console.log("User fetched:", user);
      if (user?.id) {
        dispatch(updateUserItemCompleted(user.id, 4, 10));
      } else {
        console.warn("User ID no encontrado");
      }
    router.push('/')
    }

    ).catch((error) => {
      console.error("Error fetching user:", error);
    });
  }

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
