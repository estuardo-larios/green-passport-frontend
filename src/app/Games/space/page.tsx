'use client'
import { useEffect, useRef, useState } from "react";
import { useRouter } from 'next/navigation';
import { fetchUserByEmail } from "@/actions/user.action";
import { useAppDispatch } from "@/hooks/hook";
import CookieManager from "@/lib/cookies";
import { updateUserItemCompleted } from "@/actions/userItems.action";
import { IUser } from "@/interfaces/user.interface";

export default function JuegoNave() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [mensaje, setMensaje] = useState<string | null>(null);
  const [mostrarInfo, setMostrarInfo] = useState(false);
  const [key, setKey] = useState(0);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const cookieManager = new CookieManager();
  const userEmail = cookieManager.getCookie("email_cookie") || "";


  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = 1000;
    canvas.height = 800;

    const naveImg = new Image();
    naveImg.src = "/xwing.svg";

    const imgOrg = new Image();
    imgOrg.src = "/banana.svg";

    const imgRec = new Image();
    imgRec.src = "/crumpledPaper.svg";

    const imgPeli = new Image();
    imgPeli.src = "/cigarette.svg";


    let naveX = canvas.width / 2 - 35;
    const balas: { x: number; y: number }[] = [];
    const residuos: { x: number; y: number; tipo: string }[] = [];



    let left = false;
    let right = false;

    let totalResiduosGenerados = 0;
    let residuosDestruidos = 0;

    const duracionJuego = 60000;
    let juegoTerminado = false;

    const keyDownHandler = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft" || e.key === "a") left = true;
      if (e.key === "ArrowRight" || e.key === "d") right = true;
      if ((e.key === " " || e.key === "Spacebar") && !juegoTerminado) {
        balas.push({ x: naveX + 30, y: canvas.height - 70 });
      }
    };

    const keyUpHandler = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft" || e.key === "a") left = false;
      if (e.key === "ArrowRight" || e.key === "d") right = false;
    };

    document.addEventListener("keydown", keyDownHandler);
    document.addEventListener("keyup", keyUpHandler);

    const velocidadCaida = 1;

    const loop = () => {
      if (juegoTerminado) return;

      ctx.fillStyle = "black";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      if (left) naveX -= 7;
      if (right) naveX += 7;
      naveX = Math.max(0, Math.min(canvas.width - 70, naveX)); // 70 ancho nave

      ctx.drawImage(naveImg, naveX, canvas.height - 50, 70, 50);

      ctx.fillStyle = "red";
      balas.forEach((b, i) => {
        b.y -= 12;
        ctx.fillRect(b.x, b.y, 6, 12);
        if (b.y < 0) balas.splice(i, 1);
      });

      if (Math.random() < 0.015) {
        const tipos = ["orgánico", "reciclable", "peligroso"];
        residuos.push({
          x: Math.random() * (canvas.width - 50),
          y: 0,
          tipo: tipos[Math.floor(Math.random() * tipos.length)],
        });
        totalResiduosGenerados++;
      }

      residuos.forEach((r, i) => {
        let imgToDraw: HTMLImageElement | null = null;
        if (r.tipo === "orgánico") imgToDraw = imgOrg;
        else if (r.tipo === "reciclable") imgToDraw = imgRec;
        else if (r.tipo === "peligroso") imgToDraw = imgPeli;

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

        r.y += velocidadCaida;

        if (r.y > canvas.height) residuos.splice(i, 1);
      });

      balas.forEach((b, bi) => {
        residuos.forEach((r, ri) => {
          if (
            b.x < r.x + 50 &&
            b.x + 6 > r.x &&
            b.y < r.y + 50 &&
            b.y + 12 > r.y
          ) {
            residuos.splice(ri, 1);
            balas.splice(bi, 1);
            residuosDestruidos++;
          }
        });
      });

      requestAnimationFrame(loop);
    };

    const terminarJuego = () => {
      juegoTerminado = true;
      const porcentajeDestruido = totalResiduosGenerados
        ? (residuosDestruidos / totalResiduosGenerados) * 100
        : 0;
    
      if (porcentajeDestruido >= 80) {
        setMensaje(`Gamer, ¡GANASTE! Destruiste ${porcentajeDestruido.toFixed(2)}% de los residuos.`);
    
        dispatch(fetchUserByEmail(userEmail)).then((user: IUser | null) => {
          console.log("User fetched:", user);
          if (user?.id) {
            dispatch(updateUserItemCompleted(user.id, 1, porcentajeDestruido));
          } else {
            console.warn("User ID no encontrado");
          }
        }).catch((error) => {
          console.error("Error fetching user:", error);
        });
    
      } else {
        setMensaje(`Perdiste. Destruiste solo ${porcentajeDestruido.toFixed(2)}% de los residuos.`);
      }
      setMostrarInfo(true);
    };
    

    const checkImagesLoaded = () => {
      if (
        naveImg.complete &&
        imgOrg.complete &&
        imgRec.complete &&
        imgPeli.complete
      ) {
        loop();
        setTimeout(terminarJuego, duracionJuego);
      } else {
        setTimeout(checkImagesLoaded, 100);
      }
    };
    checkImagesLoaded();

    return () => {
      juegoTerminado = true;
      setMensaje(null);
      setMostrarInfo(false);
      document.removeEventListener("keydown", keyDownHandler);
      document.removeEventListener("keyup", keyUpHandler);
    };
  }, [key, dispatch, userEmail]);

  // Listener para reiniciar con Enter solo si hay mensaje visible y cerrar info
  useEffect(() => {
    const handleEnter = (e: KeyboardEvent) => {
      if (mensaje && e.key === "Enter") {
        setMensaje(null);
        setMostrarInfo(false);
        setKey((prev) => prev + 1);
      }
    };
    document.addEventListener("keydown", handleEnter);
    return () => document.removeEventListener("keydown", handleEnter);
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
