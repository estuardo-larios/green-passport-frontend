'use client'

import { useEffect, useRef, useState } from "react";
import { useRouter } from 'next/navigation';
import { fetchUserByEmail } from "@/actions/user.action";
import { useAppDispatch } from "@/hooks/hook";
import CookieManager from "@/lib/cookies";
import { updateUserItemCompleted } from "@/actions/userItems.action";
import { IUser } from "@/interfaces/user.interface";

/**
 * Componente principal para el juego de la nave donde el jugador dispara residuos que caen.
 * El juego tiene un tiempo límite y calcula el porcentaje de residuos destruidos.
 * En caso de superar el 80%, se considera victoria y actualiza el progreso del usuario.
 * @returns JSX.Element con el canvas y mensajes de estado del juego.
 */
export default function JuegoNave() {
  /** Referencia al elemento canvas para dibujar el juego */
  const canvasRef = useRef<HTMLCanvasElement>(null);

  /** Estado para mostrar mensajes al usuario (ganó o perdió) */
  const [mensaje, setMensaje] = useState<string | null>(null);

  /** Estado para mostrar el cuadro de información final del juego */
  const [mostrarInfo, setMostrarInfo] = useState(false);

  /** Estado usado para reiniciar el efecto principal y reiniciar el juego */
  const [key, setKey] = useState(0);

  /** Hook para despachar acciones a Redux */
  const dispatch = useAppDispatch();

  /** Hook para navegación (no usado directamente en esta versión) */
  const router = useRouter();

  /** Instancia para manejar cookies */
  const cookieManager = new CookieManager();

  /** Email del usuario extraído de la cookie para identificar progreso */
  const userEmail = cookieManager.getCookie("email_cookie") || "";

  /**
   * Efecto principal que inicializa y ejecuta el juego.
   * Maneja el loop de dibujo, lógica de movimiento, colisiones y finalización.
   * Se reinicia cada vez que cambia 'key'.
   */
  useEffect(() => {
    // Obtener canvas y contexto 2D
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Ajustar tamaño del canvas
    canvas.width = 1000;
    canvas.height = 800;

    // Crear imágenes para la nave y los tipos de residuos
    const naveImg = new Image();
    naveImg.src = "/xwing.svg";

    const imgOrg = new Image();
    imgOrg.src = "/banana.svg";

    const imgRec = new Image();
    imgRec.src = "/crumpledPaper.svg";

    const imgPeli = new Image();
    imgPeli.src = "/cigarette.svg";

    // Posición horizontal inicial de la nave (centrada)
    let naveX = canvas.width / 2 - 35;

    // Arreglo para balas disparadas
    const balas: { x: number; y: number }[] = [];

    // Arreglo para residuos generados en el juego
    const residuos: { x: number; y: number; tipo: string }[] = [];

    // Estados para detectar teclas presionadas para movimiento
    let left = false;
    let right = false;

    // Contadores de residuos generados y destruidos para calcular progreso
    let totalResiduosGenerados = 0;
    let residuosDestruidos = 0;

    // Duración máxima del juego en milisegundos
    const duracionJuego = 60000;

    // Flag para saber si el juego terminó y detener el loop
    let juegoTerminado = false;

    /**
     * Manejador para evento keydown, registra teclas de movimiento y disparo
     * @param e Evento de teclado
     */
    const keyDownHandler = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft" || e.key === "a") left = true;
      if (e.key === "ArrowRight" || e.key === "d") right = true;
      if ((e.key === " " || e.key === "Spacebar") && !juegoTerminado) {
        balas.push({ x: naveX + 30, y: canvas.height - 70 });
      }
    };

    /**
     * Manejador para evento keyup, registra cuándo las teclas de movimiento se sueltan
     * @param e Evento de teclado
     */
    const keyUpHandler = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft" || e.key === "a") left = false;
      if (e.key === "ArrowRight" || e.key === "d") right = false;
    };

    // Agregar listeners globales para teclas
    document.addEventListener("keydown", keyDownHandler);
    document.addEventListener("keyup", keyUpHandler);

    // Velocidad constante de caída de residuos en píxeles por frame
    const velocidadCaida = 1;

    /**
     * Loop principal del juego que actualiza estado, dibuja y calcula colisiones
     */
    const loop = () => {
      if (juegoTerminado) return; // Termina el loop si el juego finalizó

      // Limpiar canvas con fondo negro
      ctx.fillStyle = "black";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Actualizar posición de la nave según teclas presionadas
      if (left) naveX -= 7;
      if (right) naveX += 7;
      naveX = Math.max(0, Math.min(canvas.width - 70, naveX)); // Limitar dentro del canvas

      // Dibujar nave en su posición actual
      ctx.drawImage(naveImg, naveX, canvas.height - 50, 70, 50);

      // Dibujar y actualizar posición de balas disparadas
      ctx.fillStyle = "red";
      balas.forEach((b, i) => {
        b.y -= 12; // Mover bala hacia arriba
        ctx.fillRect(b.x, b.y, 6, 12); // Dibujar bala
        if (b.y < 0) balas.splice(i, 1); // Eliminar balas fuera del canvas
      });

      // Generar residuos al azar con baja probabilidad
      if (Math.random() < 0.015) {
        const tipos = ["orgánico", "reciclable", "peligroso"];
        residuos.push({
          x: Math.random() * (canvas.width - 50),
          y: 0,
          tipo: tipos[Math.floor(Math.random() * tipos.length)],
        });
        totalResiduosGenerados++;
      }

      // Dibujar y actualizar residuos en caída
      residuos.forEach((r, i) => {
        let imgToDraw: HTMLImageElement | null = null;
        if (r.tipo === "orgánico") imgToDraw = imgOrg;
        else if (r.tipo === "reciclable") imgToDraw = imgRec;
        else if (r.tipo === "peligroso") imgToDraw = imgPeli;

        // Dibujar imagen si está cargada, sino rectángulo de color
        if (imgToDraw && imgToDraw.complete) {
          ctx.drawImage(imgToDraw, r.x, r.y, 50, 50);
        } else {
          ctx.fillStyle =
            r.tipo === "orgánico"
              ? "green"
              : r.tipo === "reciclable"
              ? "orange"
              : "purple";
          ctx.fillRect(r.x, r.y, 50, 50);
        }

        // Actualizar posición vertical del residuo para simular caída
        r.y += velocidadCaida;

        // Eliminar residuos que caen fuera del canvas (piso)
        if (r.y > canvas.height) residuos.splice(i, 1);
      });

      // Detectar colisiones entre balas y residuos
      balas.forEach((b, bi) => {
        residuos.forEach((r, ri) => {
          if (
            b.x < r.x + 50 &&
            b.x + 6 > r.x &&
            b.y < r.y + 50 &&
            b.y + 12 > r.y
          ) {
            residuos.splice(ri, 1); // Eliminar residuo destruido
            balas.splice(bi, 1);   // Eliminar bala usada
            residuosDestruidos++;  // Incrementar contador de residuos destruidos
          }
        });
      });

      // Solicitar el siguiente frame para mantener el loop
      requestAnimationFrame(loop);
    };

    /**
     * Función para finalizar el juego, calcular resultados y actualizar backend
     */
    const terminarJuego = () => {
      juegoTerminado = true;

      // Calcular porcentaje de residuos destruidos sobre total generados
      const porcentajeDestruido = totalResiduosGenerados
        ? (residuosDestruidos / totalResiduosGenerados) * 100
        : 0;

      // Condición de victoria: destruir al menos 80% de residuos
      if (porcentajeDestruido >= 80) {
        setMensaje(`Gamer, ¡GANASTE! Destruiste ${porcentajeDestruido.toFixed(2)}% de los residuos.`);

        // Actualizar progreso del usuario en backend
        dispatch(fetchUserByEmail(userEmail)).then((user: IUser | null) => {
          if (user?.id) {
            dispatch(updateUserItemCompleted(user.id, 1, porcentajeDestruido));
          } else {
            console.warn("User ID no encontrado");
          }
        }).catch((error) => {
          console.error("Error fetching user:", error);
        });

      } else {
        // Mostrar mensaje de derrota con porcentaje destruido
        setMensaje(`Perdiste. Destruiste solo ${porcentajeDestruido.toFixed(2)}% de los residuos.`);
      }

      // Mostrar el cuadro de información con mensaje final
      setMostrarInfo(true);
    };

    /**
     * Función para verificar que todas las imágenes estén cargadas antes de iniciar el juego
     * Usa reintentos con setTimeout para esperar que las imágenes terminen de cargar
     */
    const checkImagesLoaded = () => {
      if (
        naveImg.complete &&
        imgOrg.complete &&
        imgRec.complete &&
        imgPeli.complete
      ) {
        loop(); // Iniciar loop principal
        setTimeout(terminarJuego, duracionJuego); // Programar fin del juego
      } else {
        setTimeout(checkImagesLoaded, 100); // Reintentar en 100ms
      }
    };

    checkImagesLoaded();

    /**
     * Función cleanup para remover listeners y limpiar estados al desmontar componente o reiniciar juego
     */
    return () => {
      juegoTerminado = true;
      setMensaje(null);
      setMostrarInfo(false);
      document.removeEventListener("keydown", keyDownHandler);
      document.removeEventListener("keyup", keyUpHandler);
    };
  }, [key, dispatch, userEmail]);

  /**
   * Efecto para escuchar tecla Enter y reiniciar el juego si hay un mensaje visible
   * También oculta el cuadro de información final
   */
  useEffect(() => {
    /**
     * Manejador para reiniciar juego con Enter cuando hay mensaje final visible
     * @param e Evento de teclado
     */
    const handleEnter = (e: KeyboardEvent) => {
      if (mensaje && e.key === "Enter") {
        setMensaje(null);
        setMostrarInfo(false);
        setKey((prev) => prev + 1); // Incrementar key para reiniciar useEffect principal
      }
    };

    document.addEventListener("keydown", handleEnter);
    return () => {
      document.removeEventListener("keydown", handleEnter);
    };
  }, [mensaje]);

  return (
    <div className="flex flex-col justify-center items-center h-screen bg-black text-white gap-4 select-none relative">
      <canvas ref={canvasRef} className="border border-white" />

      {mensaje && (
        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-gray-800 p-4 rounded max-w-xl w-[90vw] text-center z-20 text-white shadow-lg">
          <p className="text-lg font-bold mb-1">{mensaje}</p>
          <p className="italic text-gray-400 text-sm">
            Presiona <span className="font-bold">Enter</span> para reiniciar
          </p>
        </div>
      )}

    {mostrarInfo && (
      <div className="absolute top-1/2 left-1/2 bg-white p-6 rounded max-w-xl w-[90vw] text-black shadow-lg z-30 transform -translate-x-1/2 -translate-y-1/2">
        <div className="flex flex-col items-center mb-6">
          <svg 
            className="w-16 h-16 text-green-500 mb-2" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth={2} 
            viewBox="0 0 24 24" 
            xmlns="http://www.w3.org/2000/svg" 
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h2 className="text-3xl font-extrabold text-green-600">¡Felicidades!</h2>
          <p className="text-lg mt-1 text-center max-w-xs">
            Ganaste el juego destruyendo la mayoría de los residuos. ¡Gracias por ayudar a cuidar el ambiente!
          </p>
        </div>

        <h3 className="text-2xl font-bold mb-4 text-center">Tipos de Residuos según Acuerdo 164-2021</h3>
        <ul className="list-disc list-inside space-y-4 text-left text-lg">
          <li>
            <strong>Residuos Orgánicos:</strong> Son restos naturales como cáscaras de frutas, verduras y sobras de comida. Se pueden convertir en compost para ayudar a las plantas y la tierra.
          </li>
          <li>
            <strong>Residuos Reciclables:</strong> Incluyen papel, cartón, plástico, vidrio y metal. Estos materiales se pueden procesar para hacer nuevos productos y así cuidar el medio ambiente.
          </li>
          <li>
            <strong>Residuos Peligrosos:</strong> Son objetos o sustancias que pueden ser dañinos, como pilas, baterías, medicamentos o químicos. Es muy importante manejar estos residuos con cuidado para evitar contaminar.
          </li>
        </ul>

        <button
          className="mt-6 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded font-semibold w-full"
          onClick={() => router.push('/')}
        >
          Entendido, cerrar
        </button>
      </div>
    )}


    </div>
  );
}
