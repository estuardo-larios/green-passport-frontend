import { useState } from "react";
import { useAppDispatch } from "@/hooks/hook";
import { login } from "@/actions/login.action";
import { fetchUserByEmail } from "@/actions/user.action";
import validator from "validator";
import { useRouter } from "next/navigation";
import CookieManager from "@/lib/cookies";

/**
 * Hook personalizado para gestionar el inicio de sesión de usuarios.
 * Controla estados de email, contraseña, errores y carga, además de realizar validaciones y manejo de cookies.
 * @returns Objeto con estados y funciones para manejo de formulario de login.
 */
const useUserLogin = () => {
  // Estado para almacenar el email ingresado por el usuario.
  const [email, setEmail] = useState<string>("");
  // Estado para almacenar la contraseña ingresada.
  const [password, setPassword] = useState<string>("");
  // Estado para manejar errores generales del formulario o backend.
  const [error, setError] = useState<string | null>(null);
  // Estado específico para errores de validación del email.
  const [emailError, setEmailError] = useState<string | null>(null);
  // Estado específico para errores de validación de la contraseña.
  const [passwordError, setPasswordError] = useState<string | null>(null);
  // Estado que indica si el formulario se encuentra en proceso de envío.
  const [loading, setLoading] = useState<boolean>(false);

  // Despachador de acciones para interactuar con el store de Redux.
  const dispatch = useAppDispatch();
  // Router de Next.js para navegación programática.
  const router = useRouter();
  // Instancia para manejar cookies del navegador.
  const cookieManager = new CookieManager();

  /**
   * Valida que el email tenga formato correcto usando la librería validator.
   * En caso de error, actualiza el estado emailError.
   * @param value Email a validar.
   * @returns Booleano que indica si el email es válido.
   */
  const validateEmail = (value: string): boolean => {
    if (!validator.isEmail(value)) {
      setEmailError("Formato del email incorrecto");
      return false;
    }
    setEmailError(null);
    return true;
  };

  /**
   * Valida que la contraseña tenga al menos 6 caracteres.
   * En caso de error, actualiza el estado passwordError.
   * @param value Contraseña a validar.
   * @returns Booleano que indica si la contraseña es válida.
   */
  const validatePassword = (value: string): boolean => {
    if (value.length < 6) {
      setPasswordError("La contraseña debe contener más de 6 caracteres");
      return false;
    }
    setPasswordError(null);
    return true;
  };

  /**
   * Manejador para el evento blur del campo email.
   * Ejecuta la validación del email cuando el usuario sale del input.
   */
  const handleEmailBlur = (): void => {
    validateEmail(email);
  };

  /**
   * Manejador para el evento blur del campo contraseña.
   * Ejecuta la validación de la contraseña cuando el usuario sale del input.
   */
  const handlePasswordBlur = (): void => {
    validatePassword(password);
  };

  /**
   * Manejador para el envío del formulario de inicio de sesión.
   * Realiza validaciones, despacha acciones de login y fetch de usuario,
   * maneja almacenamiento de cookies y redirecciona a la página principal.
   * Controla estados de error y carga durante el proceso.
   * @param event Evento de envío del formulario.
   */
  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    event.preventDefault();

    // Se indica que el proceso de carga inició y se limpia cualquier error previo.
    setLoading(true);
    setError(null);

    // Validar ambos campos antes de continuar.
    const isEmailValid = validateEmail(email);
    const isPasswordValid = validatePassword(password);

    // Si alguna validación falla, se detiene el proceso y se desactiva el loading.
    if (!isEmailValid || !isPasswordValid) {
      setLoading(false);
      return;
    }

    try {
      // Se despacha la acción de login con email y contraseña.
      await dispatch(login({ email, password }));
      // Se obtiene información adicional del usuario para usarla posteriormente.
      const response = await dispatch(fetchUserByEmail(email));

      // Se almacenan en cookies el email y el rol del usuario para sesiones futuras.
      cookieManager.setCookie("email_cookie", email, 1);
      cookieManager.setCookie("user_role", String(response?.role ?? ""), 1);

      // Finalmente se redirige al usuario a la página principal tras login exitoso.
      router.push("/home");
    } catch (err: unknown) {
      // En caso de error, se actualiza el estado error con un mensaje descriptivo.
      const errorMessage =
        err instanceof Error ? err.message : "Fallo al iniciar sesión";
      setError(errorMessage);
    } finally {
      // Se finaliza el estado de carga en todos los casos.
      setLoading(false);
    }

    // Para fines de debugging, se imprime en consola el email y la contraseña.
    console.log("Email:", email);
    console.log("Password:", password);
  };

  // Se retornan todos los estados y manejadores necesarios para el componente que use este hook.
  return {
    email,
    setEmail,
    password,
    setPassword,
    error,
    emailError,
    passwordError,
    loading,
    handleEmailBlur,
    handlePasswordBlur,
    handleSubmit,
  };
};

export default useUserLogin;
