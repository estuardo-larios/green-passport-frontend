'use client'
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppDispatch } from "@/hooks/hook";
import CookieManager from "@/lib/cookies";
import { updateUserItemCompleted } from "@/actions/userItems.action";
import { fetchUserByEmail } from "@/actions/user.action";

/**
 * Componente principal del juego de residuos.
 * Renderiza el canvas donde se juega y controla la lógica principal.
 * @returns JSX.Element
 */
export default function JuegoResiduos() {
  /** Referencia al canvas del juego */
  const canvasRef = useRef<HTMLCanvasElement>(null);

  /** Estado para controlar la visibilidad del modal de felicitación */
  const [showModal, setShowModal] = useState<boolean>(false);

  /** Hook para redireccionar rutas */
  const router = useRouter();

  /** Instancia para gestión de cookies */
  const cookieManager = new CookieManager();

  /** Hook de redux para despachar acciones */
  const dispatch = useAppDispatch();

  /** Email del usuario obtenido de cookies */
  const userEmail: string = cookieManager.getCookie("email_cookie") || "";

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = 1000;
    canvas.height = 800;

    // Imágenes para los tipos de residuos y jugador
    const imgOrganico = new Image();
    imgOrganico.src = '/APPLE.svg';

    const imgReciclable = new Image();
    imgReciclable.src = '/SODA.svg';

    const imgPeligroso = new Image();
    imgPeligroso.src = '/BATTERY.svg';

    const imgCamion = new Image();
    imgCamion.src = '/trashTruck.svg';

    const sueloY = 700;

    /**
     * Objeto jugador con posición, tamaño y estado de salto
     */
    let player = {
      x: 50,
      y: sueloY - 80,
      width: 80,
      height: 80,
      yVelocity: 0,
      gravity: 0.8,
      jumping: false,
    };

    /** Arreglo de residuos que aparecen en el juego */
    let residuos: { x: number; y: number; width: number; height: number; tipo: string }[] = [];

    let frames: number = 0;
    let gameOver: boolean = false;
    let gameWon: boolean = false;

    const TIME_TO_WIN = 30 * 60; // tiempo para ganar (frames)
    let timeElapsed: number = 0;

    /**
     * Inicializa el estado del juego
     */
    const initGame = (): void => {
      player = {
        x: 50,
        y: sueloY - 80,
        width: 80,
        height: 80,
        yVelocity: 0,
        gravity: 0.8,
        jumping: false,
      };
      residuos = [];
      frames = 0;
      gameOver = false;
      gameWon = false;
      timeElapsed = 0;
      setShowModal(false);
    };

    initGame();

    /**
     * Dibuja el jugador en el canvas
     */
    const drawPlayer = (): void => {
      if (imgCamion.complete) {
        ctx.drawImage(imgCamion, player.x, player.y, player.width, player.height);
      } else {
        ctx.fillStyle = 'green';
        ctx.fillRect(player.x, player.y, player.width, player.height);
      }
    };

    /**
     * Dibuja el suelo en el canvas
     */
    const drawSuelo = (): void => {
      ctx.fillStyle = '#888';
      ctx.fillRect(0, sueloY, canvas.width, canvas.height - sueloY);
    };

    /**
     * Dibuja los residuos en el canvas
     */
    const drawResiduos = (): void => {
      residuos.forEach((r) => {
        let img: HTMLImageElement | null = null;
        if (r.tipo === 'orgánico') img = imgOrganico;
        else if (r.tipo === 'reciclable') img = imgReciclable;
        else if (r.tipo === 'peligroso') img = imgPeligroso;

        if (img && img.complete) {
          ctx.drawImage(img, r.x, r.y, r.width, r.height);
        } else {
          ctx.fillStyle =
            r.tipo === 'orgánico'
              ? 'yellow'
              : r.tipo === 'reciclable'
              ? 'blue'
              : 'red';
          ctx.fillRect(r.x, r.y, r.width, r.height);
        }
      });
    };

    /**
     * Lógica principal del juego que se ejecuta en cada frame
     */
    const update = (): void => {
      if (gameOver) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawSuelo();
        ctx.fillStyle = 'black';
        ctx.font = '30px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('Game Over! Press Space to Restart', canvas.width / 2, canvas.height / 2);
        return;
      }

      if (gameWon) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawSuelo();
        ctx.fillStyle = 'green';
        ctx.font = '40px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('¡Felicidades, ganaste! 🎉', canvas.width / 2, canvas.height / 2);
        ctx.font = '20px Arial';
        ctx.fillText('Presiona Espacio para jugar de nuevo', canvas.width / 2, canvas.height / 2 + 40);
        return;
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      drawSuelo();

      // Física del salto
      if (player.jumping) {
        player.yVelocity -= player.gravity;
        player.y -= player.yVelocity;

        if (player.y >= sueloY - player.height) {
          player.y = sueloY - player.height;
          player.jumping = false;
          player.yVelocity = 0;
        }
      }

      // Generación de residuos cada 100 frames
      if (frames % 100 === 0) {
        const tipos = ['orgánico', 'reciclable', 'peligroso'];
        residuos.push({
          x: canvas.width,
          y: sueloY - 30,
          width: 30,
          height: 30,
          tipo: tipos[Math.floor(Math.random() * tipos.length)],
        });
      }

      // Mover residuos y limpiar los que salieron de pantalla
      residuos = residuos.filter((r) => r.x + r.width > 0);
      residuos.forEach((r) => {
        r.x -= 5;
      });

      // Detectar colisiones jugador-residuo
      residuos.forEach((r) => {
        if (
          player.x < r.x + r.width &&
          player.x + player.width > r.x &&
          player.y < r.y + r.height &&
          player.y + player.height > r.y
        ) {
          gameOver = true;
        }
      });

      drawPlayer();
      drawResiduos();

      timeElapsed++;
      if (timeElapsed >= TIME_TO_WIN) {
        gameWon = true;
        setShowModal(true);
      }

      frames++;
      requestAnimationFrame(update);
    };

    update();

    /**
     * Controla eventos del teclado para salto y reinicio
     * @param e Evento de teclado
     */
    const handleKeyDown = (e: KeyboardEvent): void => {
      if (!gameOver && !gameWon) {
        if ((e.key === ' ' || e.key === 'ArrowUp') && !player.jumping) {
          player.jumping = true;
          player.yVelocity = 14;
        }
      } else {
        if (e.key === ' ') {
          initGame();
          update();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  /**
   * Confirma la victoria y actualiza el estado del usuario en el backend
   */
  const confirmWin = (): void => {
    dispatch(fetchUserByEmail(userEmail))
      .then((user: any) => {
        console.log("User fetched:", user);
        if (user?.id) {
          dispatch(updateUserItemCompleted(user.id, 2, 10));
        } else {
          console.warn("User ID no encontrado");
        }
        router.push('/');
      })
      .catch((error) => {
        console.error("Error fetching user:", error);
      });
  };

  /**
   * Modal de felicitación que explica sobre residuos orgánicos y muestra puntaje
   * @param props Propiedades del componente Modal
   * @param props.setShowModal Función para controlar visibilidad del modal
   * @param props.premio Texto del premio otorgado
   */
  const Modal = ({ setShowModal, premio }: { setShowModal: (show: boolean) => void; premio: string }) => {
    return (
      <div
        className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
        onClick={() => setShowModal(false)}
      >
        <div
          className="bg-white p-6 rounded shadow-lg max-w-lg text-black"
          onClick={(e) => e.stopPropagation()}
        >
          <h2 className="text-xl font-bold mb-4">¡Aprendamos sobre Residuos Orgánicos!</h2>
          <p>
            Según el Acuerdo Gubernativo 164-2021, los residuos orgánicos incluyen restos de alimentos,
            frutas, verduras, cáscaras, restos de jardín, entre otros.
            Estos residuos son biodegradables y su correcta gestión ayuda a reducir la contaminación,
            fomenta el compostaje y mejora la calidad del suelo.
          </p>
          <p className="mt-4 font-semibold">
            ¡Recuerda separar tus residuos y contribuir a un ambiente más limpio y saludable!
          </p>

          <div className="mt-6 p-4 bg-green-100 rounded border border-green-400 flex items-center space-x-3">
            <span className="text-3xl">🎉</span>
            <div>
              <p className="font-bold text-green-800">¡Felicidades!</p>
              <p className="text-green-700">Has ganado puntos evitando los residuos</p>
            </div>
          </div>

          <button
            className="mt-6 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 w-full font-semibold"
            onClick={() => confirmWin()}
          >
            Entendido, cerrar
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="flex justify-center items-center h-screen bg-white relative">
      <canvas ref={canvasRef} className="border border-black" />
      {showModal && <Modal setShowModal={setShowModal} premio="10 puntos extra" />}
    </div>
  );
}
