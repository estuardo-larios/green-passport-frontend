"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useAppDispatch, useAppSelector } from "@/hooks/hook";
import { RootState } from "@/redux/store";
import { fetchUserItemsByEmail } from "@/actions/userItems.action";
import CookieManager from "@/lib/cookies";

const initialLevels = [
  { id: 1, name: "Sapce Residuals", unlocked: true, url: "/Games/space" },
  { id: 2, name: "Residuals", unlocked: false, url: "/Games/residuals" },
  { id: 3, name: "Labyrinth", unlocked: false, url: "/Games/labyrinth" },
  { id: 4, name: "Papel", unlocked: false, url: "/Games/pacman" },
  { id: 5, name: "Metales", unlocked: false, url: "/Games/platafforms" },
  { id: 0, name: "Trophy", unlocked: true, isTrophy: true, url: "/" },
];

const levelPositions = [
  { top: "83%", left: "70%" },
  { top: "36%", left: "62%" },
  { top: "44%", left: "41%" },
  { top: "9%", left: "10%" },
  { top: "70%", left: "18%" },
  { top: "90%", left: "93%" },
];

/**
 * Componente que maneja la ruta de niveles del juego,
 * controla desbloqueo de niveles según progreso del usuario,
 * muestra animaciones de hojas y modales.
 * @returns JSX.Element
 */
export default function LevelPath() {
  /** Estado para nivel activo seleccionado */
  const [activeLevel, setActiveLevel] = useState<number | null>(null);
  /** Estado para mostrar el trofeo animado */
  const [showTrophy, setShowTrophy] = useState(false);
  /** Estado para niveles con su estado de desbloqueo */
  const [levels, setLevels] = useState(initialLevels);
  /** Estado para mostrar modal final al completar todos los niveles */
  const [showModal, setShowModal] = useState(false);
  /** Estado para mostrar modal inicial del trofeo */
  const [showInitialModal, setShowInitialModal] = useState(false);
  /** Estado para animación de hojas */
  const [leaves, setLeaves] = useState<
    { id: number; emoji: string; left: string; size: string; duration: number }[]
  >([]);

  const dispatch = useAppDispatch();
  const { items } = useAppSelector((state: RootState) => state.userItems);

  useEffect(() => {
    const cookieManeger = new CookieManager();
    const userEmail = cookieManeger.getCookie("email_cookie") || null;
    if (!userEmail) return;
    dispatch(fetchUserItemsByEmail(userEmail));
  }, [dispatch]);

  useEffect(() => {
    if (!items?.length) return;

    const completedIds = items
      .filter((item) => item.completed === true)
      .map((item) => item.itemId);

    const maxCompletedId = completedIds.length > 0 ? Math.max(...completedIds) : 0;

    const updatedLevels = initialLevels.map((level) => {
      if (level.isTrophy) return level;
      if (level.id === 1) return { ...level, unlocked: true };

      const unlocked = completedIds.includes(level.id) || level.id === maxCompletedId + 1;

      return { ...level, unlocked };
    });

    setLevels(updatedLevels);

    const allCompleted = items.length > 0 && items.every((item) => item.completed === true);
    if (allCompleted) setShowModal(true);
  }, [items]);

  useEffect(() => {
    const timer = setTimeout(() => setShowTrophy(true), 3000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setLeaves((prev) => [
        ...prev,
        {
          id: Date.now(),
          emoji: Math.random() > 0.3 ? "🌿" : "🍂",
          left: `${Math.random() * 100}%`,
          size: `${Math.random() * 20 + 20}px`,
          duration: Math.random() * 8 + 8,
        },
      ]);
    }, 800);

    return () => clearInterval(interval);
  }, []);

  /**
   * Maneja el clic en un nivel:
   * navega si está desbloqueado,
   * muestra modal si es trofeo,
   * alerta si está bloqueado.
   * @param level Nivel seleccionado
   */
  const handleLevelClick = (level: typeof levels[number]) => {
    if (level.unlocked && !level.isTrophy) {
      setActiveLevel(level.id);
      window.location.href = level.url;
    } else if (level.isTrophy) {
      setShowInitialModal(true);
    } else {
      alert("Este nivel está bloqueado. Completa el nivel anterior para desbloquearlo.");
    }
  };

  return (
    <div className="relative w-full h-screen bg-gradient-to-b from-[#FFFFFF] to-[#FFFFFF] animate-gradient-slow rounded-xl p-4 overflow-hidden">
      <svg viewBox="0 0 2500 1600" className="absolute w-full h-full z-[2]">
        <motion.path
          d="
          M -276 72 
          Q -209 334 88 223 
          Q 1004 -169 423 721 
          Q -74 1667 1095 680 
          Q 2021 -226 1725 510 
          Q 997 1935 1998 1324 
          Q 2428 1159 2645 1589
          "
          stroke="#1F8505"
          strokeWidth="150"
          fill="none"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 3, ease: "easeInOut" }}
        />
      </svg>

      {showTrophy && (
        <div className="absolute inset-0 z-10">
          {levels.map((level, i) => {
            const pos = levelPositions[i];
            const isActive = level.id === activeLevel;

            return (
              <motion.div
                key={level.id}
                className="absolute flex flex-col items-center"
                style={{
                  top: pos.top,
                  left: pos.left,
                  transform: "translate(-50%, -50%)",
                }}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.3, duration: 0.5 }}
              >
                <motion.button
                  onClick={() => handleLevelClick(level)}
                  className={`w-24 h-24 rounded-full flex items-center justify-center text-white text-xl font-bold shadow-xl transition-all duration-300
                              ${level.unlocked ? "bg-[#70e000] hover:scale-110 border-yellow-400 border-4" : "bg-gray-400 cursor-not-allowed border-4 border-gray-300"}
                            `}
                  whileTap={{ scale: 0.95 }}
                  animate={isActive ? { scale: [1, 1.1, 1] } : undefined}
                  transition={isActive ? { repeat: Infinity, duration: 1.5 } : undefined}
                >
                  {level.unlocked ? level.id : "🔒"}
                </motion.button>
                <span className="mt-1 text-xs text-center text-gray-700"></span>
              </motion.div>
            );
          })}
        </div>
      )}

      <div className="absolute inset-0 z-[1] pointer-events-none">
        {leaves.map((leaf) => (
          <motion.div
            key={leaf.id}
            className="absolute pointer-events-none"
            style={{
              left: leaf.left,
              width: leaf.size,
              height: leaf.size,
              fontSize: leaf.size,
            }}
            initial={{ y: -50, opacity: 0, rotate: 0 }}
            animate={{ y: "110vh", opacity: [0, 1, 0.9, 0], rotate: 360 }}
            transition={{
              duration: leaf.duration,
              ease: "linear",
            }}
            onAnimationComplete={() => setLeaves((prev) => prev.filter((l) => l.id !== leaf.id))}
          >
            <span>{leaf.emoji}</span>
          </motion.div>
        ))}
      </div>

      {activeLevel && <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-20 bg-white rounded-lg shadow-lg px-4 py-3 border border-green-300"></motion.div>}
      {showModal && (
        <motion.div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-b from-white/30 via-white/20 to-white/10 backdrop-blur-md p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <motion.div className="bg-white rounded-xl p-8 max-w-md text-center shadow-lg" initial={{ scale: 0.7 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 260, damping: 20 }}>
            <h2 className="text-3xl font-bold mb-4 text-green-700">¡Gracias por jugar! 🌱</h2>
            <p className="mb-6 text-gray-700 leading-relaxed">
              Tu compromiso con el cuidado del ambiente hace la diferencia en Guatemala. <br />
              <br />
              Recuerda que cada pequeño acto de conciencia es un paso hacia un país más limpio y verde. <br />
              <br />
              ¡Sigamos cuidando nuestras montañas, ríos y bosques con amor y respeto!
              <br />
              <br />
              Gracias por ser parte de este cambio positivo.
              <br />
            </p>
            <button className="bg-green-600 text-white rounded-md px-6 py-2 hover:bg-green-700 transition" onClick={() => setShowModal(false)}>
              Cerrar
            </button>
          </motion.div>
        </motion.div>
      )}
      {showInitialModal && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-b from-white/30 via-white/20 to-white/10 backdrop-blur-md p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-white rounded-xl p-8 max-w-md text-center shadow-lg text-green-900"
            initial={{ scale: 0.7 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
          >
            <h2 className="text-2xl font-bold mb-4">Gracias por jugar 🌿</h2>
            <p className="mb-4 leading-relaxed">
              Este proyecto nace del corazón de Guatemala, inspirado por el <strong>Acuerdo Gubernativo 164-2021</strong> que marca el camino hacia una gestión responsable de nuestros residuos.
            </p>
            <p className="mb-4 leading-relaxed">
              Como guatemaltecos, esta responsabilidad está entre nuestras manos. Cada acción, cada esfuerzo, es un paso para cuidar nuestra tierra, preservar nuestras montañas, ríos y el aire que respiramos.
            </p>
            <p className="mb-4 leading-relaxed italic">
              Este juego es más que entretenimiento: es un recordatorio íntimo y urgente de que juntos podemos hacer la diferencia, que la protección del ambiente es un legado que debemos honrar y proteger para las futuras generaciones.
            </p>
            <button
              onClick={() => setShowInitialModal(false)}
              className="mt-2 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
            >
              Cerrar
            </button>
          </motion.div>
        </motion.div>
      )}

    </div>
  );
}
