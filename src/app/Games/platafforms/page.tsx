/* eslint-disable */

'use client';
import React, { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAppDispatch } from "@/hooks/hook";
import CookieManager from "@/lib/cookies";
import { updateUserItemCompleted } from "@/actions/userItems.action";
import { fetchUserByEmail } from "@/actions/user.action";

type WasteType = 'orgánico' | 'reciclable' | 'no reciclable';

interface Waste {
  id: number;
  type: WasteType;
  imageSrc: string;
  position: number;
}

const wastesPool: Waste[] = [
  { id: 1, type: 'orgánico', imageSrc: '/APPLE.svg', position: 0 },
  { id: 2, type: 'reciclable', imageSrc: '/SODA.svg', position: 0 },
  { id: 3, type: 'no reciclable', imageSrc: '/glass.svg', position: 0 },
];

const CONVEYOR_SPEED_START = 1;
const TICK_INTERVAL = 30;
const WIN_SCORE = 240;
const MAX_ERRORS = 3;

export default function ConveyorRecycleSimulator() {
  const [currentWaste, setCurrentWaste] = useState<Waste | null>(null);
  const [score, setScore] = useState(0);
  const [speed, setSpeed] = useState(CONVEYOR_SPEED_START);
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState(0);
  const [gameStatus, setGameStatus] = useState<'playing' | 'won' | 'lost'>('playing');
  const [showModal, setShowModal] = useState(false);
  const intervalRef = useRef<number | null>(null);
  const router = useRouter();
  const cookieManager = new CookieManager();
  const dispatch = useAppDispatch();
  const userEmail = cookieManager.getCookie("email_cookie") || "";

  const explanations: Record<WasteType, string> = {
    'orgánico': 'Los residuos orgánicos deben ir al contenedor verde porque se pueden compostar y descomponen rápidamente.',
    'reciclable': 'Los residuos reciclables deben ir al contenedor azul para ser procesados y reutilizados.',
    'no reciclable': 'Los residuos no reciclables deben ir al contenedor gris para su disposición final segura.',
  };

  // Resumen final para modal cuando se gana
  const finalSummary = `
    El Acuerdo Gubernativo 164-2021 establece las directrices para la gestión adecuada de residuos en Guatemala. 
    Clasificar correctamente los residuos orgánicos, reciclables y no reciclables es fundamental para proteger el medio ambiente, 
    reducir la contaminación y fomentar un país más limpio y saludable. ¡Gracias por aprender y contribuir con esta causa!
  `;

  function spawnWaste() {
    const randomWaste = wastesPool[Math.floor(Math.random() * wastesPool.length)];
    setCurrentWaste({ ...randomWaste, position: 0 });
  }

  function resetGame() {
    setScore(0);
    setSpeed(CONVEYOR_SPEED_START);
    setErrors(0);
    setMessage('');
    setGameStatus('playing');
    setShowModal(false);
    spawnWaste();
  }

  useEffect(() => {
    if (gameStatus !== 'playing') {
      if (intervalRef.current) clearInterval(intervalRef.current);
      // Si se ganó, mostrar modal resumen
      if (gameStatus === 'won') {
        setShowModal(true);
      }
      return;
    }

    if (!currentWaste) {
      spawnWaste();
      return;
    }

    intervalRef.current = window.setInterval(() => {
      setCurrentWaste(w => {
        if (!w) return null;

        const newPosition = w.position + speed;
        if (newPosition >= 100) {
          const newErrors = errors + 1;
          setErrors(newErrors);
          setMessage(
            `¡Perdiste un residuo! No clasificaste el residuo ${w.type} a tiempo. ` +
            explanations[w.type]
          );
          if (newErrors >= MAX_ERRORS) {
            setGameStatus('lost');
          }
          spawnWaste();
          return null;
        }
        return { ...w, position: newPosition };
      });
    }, TICK_INTERVAL);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [currentWaste, speed, errors, gameStatus]);

  function handleContainerClick(type: WasteType) {
    if (!currentWaste || gameStatus !== 'playing') return;

    if (type === currentWaste.type) {
      const newScore = score + 10;
      setScore(newScore);
      setMessage('¡Correcto! Residuo clasificado bien.');
      setSpeed(s => s + 0.1);

      if (newScore >= WIN_SCORE) {
        setGameStatus('won');
        setMessage('¡Felicidades! Has alcanzado la puntuación requerida para ganar.');
      }
    } else {
      const newErrors = errors + 1;
      setErrors(newErrors);
      setMessage(
        `Error: Residuo mal clasificado. ${explanations[currentWaste.type]}`
      );
      if (newErrors >= MAX_ERRORS) {
        setGameStatus('lost');
        setMessage(`Has cometido demasiados errores. Juego terminado.`);
      }
    }
    spawnWaste();
  }

  const confirmWin = () => {
    dispatch(fetchUserByEmail(userEmail)).then((user: any) => {
      console.log("User fetched:", user);
      if (user?.id) {
        dispatch(updateUserItemCompleted(user.id, 5, 10));
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
    <div
      style={{
        backgroundColor: 'white',
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        fontFamily: 'Arial, sans-serif',
        color: '#111',
        padding: '1rem',
        boxSizing: 'border-box',
        textAlign: 'center',
      }}
    >
      <h2>Planta de Reciclaje</h2>

      {gameStatus === 'playing' && (
        <>
          <div
            style={{
              position: 'relative',
              height: 60,
              width: 600,
              border: '2px solid #444',
              backgroundColor: '#e6f2e6',
              borderRadius: 10,
              overflow: 'hidden',
              marginBottom: '1rem',
              marginInline: 'auto',
            }}
          >
            {currentWaste && (
              <img
                src={currentWaste.imageSrc}
                alt={currentWaste.type}
                style={{
                  position: 'absolute',
                  left: `${currentWaste.position}%`,
                  top: 10,
                  width: 40,
                  height: 40,
                  borderRadius: 8,
                  transition: 'left 0.03s linear',
                  userSelect: 'none',
                }}
                draggable={false}
              />
            )}
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginBottom: '1rem' }}>
            {['orgánico', 'reciclable', 'no reciclable'].map((type) => {
              let bgColor = '';
              if (type === 'orgánico') bgColor = '#4CAF50';
              else if (type === 'reciclable') bgColor = '#2196F3';
              else if (type === 'no reciclable') bgColor = '#555';

              return (
                <button
                  key={type}
                  onClick={() => handleContainerClick(type as WasteType)}
                  style={{
                    padding: '1rem 2rem',
                    fontSize: '1rem',
                    backgroundColor: bgColor,
                    color: 'white',
                    border: 'none',
                    borderRadius: 8,
                    cursor: 'pointer',
                    boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
                    transition: 'background-color 0.3s ease',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#3a8e40')}
                  onMouseLeave={e => (e.currentTarget.style.backgroundColor = bgColor)}
                >
                  {type}
                </button>
              );
            })}
          </div>
        </>
      )}

      {gameStatus === 'lost' && (
        <div style={{ marginBottom: '1rem', color: '#b71c1c' }}>
          <h3>❌ ¡Perdiste! ❌</h3>
          <p style={{ color: '#111' }}>{message}</p>
          <button
            onClick={resetGame}
            style={{
              padding: '0.75rem 1.5rem',
              fontSize: '1rem',
              backgroundColor: '#b71c1c',
              color: 'white',
              border: 'none',
              borderRadius: 8,
              cursor: 'pointer',
              boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
            }}
          >
            Intentar de nuevo
          </button>
        </div>
      )}

      {gameStatus === 'won' && !showModal && (
        <div style={{ marginBottom: '1rem', color: '#2e7d32' }}>
          <h3>🎉 ¡Ganaste! 🎉</h3>
          <button
            onClick={resetGame}
            style={{
              padding: '0.75rem 1.5rem',
              fontSize: '1rem',
              backgroundColor: '#4CAF50',
              color: 'white',
              border: 'none',
              borderRadius: 8,
              cursor: 'pointer',
              boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
            }}
          >
            Entendido! cerrar
          </button>
        </div>
      )}

      {/* Modal para resumen final */}
      {showModal && (
  <div
    style={{
      position: 'fixed',
      inset: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '1.5rem',
      zIndex: 1000,
      backdropFilter: 'blur(6px)',  // para desenfoque de fondo
    }}
  >
    <div
      style={{
        backgroundColor: '#fff',
        borderRadius: '12px',
        padding: '2.5rem 3rem',
        maxWidth: '600px',
        width: '100%',
        boxShadow: '0 8px 24px rgba(46, 125, 50, 0.3)',
        textAlign: 'left',
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        color: '#2e7d32',
        animation: 'fadeInScale 0.3s ease forwards',
      }}
    >
      <h1 style={{ marginTop: 0, fontSize: '2.25rem', fontWeight: '700', letterSpacing: '0.03em' }}>
        ¡Felicidades 🎉!
      </h1>
      <p style={{ fontSize: '1.125rem', lineHeight: 1.6, marginTop: '1rem', color: '#333' }}>
        {finalSummary}
      </p>
      <button
        onClick={() => { confirmWin() }}
        style={{
          marginTop: '2rem',
          padding: '0.85rem 2rem',
          backgroundColor: '#4caf50',
          color: 'white',
          border: 'none',
          borderRadius: '10px',
          cursor: 'pointer',
          fontSize: '1.125rem',
          fontWeight: '600',
          boxShadow: '0 4px 10px rgba(76, 175, 80, 0.4)',
          transition: 'background-color 0.3s ease',
        }}
        onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#388e3c')}
        onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#4caf50')}
      >
        Entendido!
      </button>
    </div>

    <style jsx>{`
      @keyframes fadeInScale {
        0% {
          opacity: 0;
          transform: scale(0.85);
        }
        100% {
          opacity: 1;
          transform: scale(1);
        }
      }
    `}</style>
  </div>
)}


      <div style={{ minHeight: 24, marginBottom: '1rem', color: '#333' }}>
        {gameStatus === 'playing' && message}
      </div>

      <div style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>
        Puntaje: {score} &nbsp; | &nbsp; Errores: {errors} / {MAX_ERRORS}
      </div>
    </div>
  );
}
