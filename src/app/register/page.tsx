"use client";

import validator from "validator";
import { useState } from "react";
import { registerUser } from "@/actions/user.action";
import { useRouter } from "next/navigation";
import { useAppDispatch } from "@/hooks/hook";

/**
 * Componente funcional Register para el registro de usuarios.
 * 
 * Gestiona el estado del formulario de registro, incluyendo validación
 * en el cliente para usuario, correo electrónico, contraseña y confirmación.
 * Envía los datos para registrar un nuevo usuario y redirige al login en caso de éxito.
 * 
 * @returns JSX.Element - Formulario de registro con validaciones y manejo de errores.
 */
export default function Register() {
  // Hook para despachar acciones de Redux
  const dispatch = useAppDispatch();
  // Hook para navegación en Next.js
  const router = useRouter();

  // Estados para los valores de los campos del formulario
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Estados para errores específicos de cada campo
  const [error, setError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [usernameError, setUsernameError] = useState("");

  // Estado para mostrar indicador de carga mientras se procesa el registro
  const [loading, setLoading] = useState(false);

  /**
   * Valida el formato del correo electrónico al perder el foco.
   * Actualiza el estado emailError en caso de formato inválido.
   */
  const handleEmailBlur = () => {
    if (!validator.isEmail(email)) {
      setEmailError("Correo electrónico no válido");
    } else {
      setEmailError("");
    }
  };

  /**
   * Valida que la contraseña tenga al menos 8 caracteres al perder el foco.
   * Actualiza el estado passwordError en caso de incumplimiento.
   */
  const handlePasswordBlur = () => {
    if (password.length < 8) {
      setPasswordError("La contraseña debe tener al menos 8 caracteres");
    } else {
      setPasswordError("");
    }
  };

  /**
   * Verifica que la confirmación de contraseña coincida con la contraseña.
   * Actualiza el estado confirmPasswordError en caso de no coincidencia.
   */
  const handleConfirmPasswordBlur = () => {
    if (confirmPassword !== password) {
      setConfirmPasswordError("Las contraseñas no coinciden");
    } else {
      setConfirmPasswordError("");
    }
  };

  /**
   * Valida que el nombre de usuario no esté vacío.
   * Actualiza el estado usernameError en caso de estar vacío.
   */
  const handleUsernameBlur = () => {
    if (!username.trim()) {
      setUsernameError("El nombre de usuario es obligatorio");
    } else {
      setUsernameError("");
    }
  };

  /**
   * Manejador del envío del formulario.
   * Valida que los campos no tengan errores y que estén completos.
   * Despacha la acción de registro y redirige al login si es exitoso.
   * Maneja errores mostrando mensajes al usuario.
   * 
   * @param e - Evento de formulario
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !email ||
      !password ||
      !confirmPassword ||
      !username ||
      emailError ||
      passwordError ||
      confirmPasswordError ||
      usernameError
    ) {
      setError("Por favor, complete todos los campos correctamente.");
      return;
    }

    setLoading(true);

    try {
      const role: string = "user";

      await dispatch(registerUser(username, email, password, role));
      router.push("/login");
    } catch (err) {
      setError("Error al registrar el usuario.");
      console.error("Error al registrar el usuario:", err);
    } finally {
      setLoading(false);
    }
  };

  // Determina si el botón de registro debe estar deshabilitado
  const isButtonDisabled =
    !username ||
    !email ||
    !password ||
    !confirmPassword ||
    Boolean(emailError) ||
    Boolean(passwordError) ||
    Boolean(confirmPasswordError) ||
    Boolean(usernameError);

  if (loading) {
    return <div>Loading...</div>;
  }


  return (
    <div className="flex items-center justify-center">
      <div className="grid place-items-center basis-3/5 min-h-screen bg-[#ffffff] dark:bg-[#031C30]">
        <div className="w-full flex items-center justify-center">
          <div className="bg-[#ffffff] dark:bg-[#031C30] p-8 w-full max-w-lg">
            <div className="flex items-center justify-left space-x-2 h-20">
              <h1 className="mt-2 text-left text-2xl md:text-3xl lg:text-4xl font-bold text-[#020617] dark:text-[#ffffff]">
                GREEN PASSPORT
              </h1>
            </div>
            <h4 className="my-1 text-left text-[#A0AEC0]">
              Regístrate con tu correo electrónico y contraseña.
            </h4>

            <form onSubmit={handleSubmit}>
              {/* Nombre de usuario */}
              <div className="my-7">
                <label className="block text-[#020617] dark:text-[#ffffff] text-sm font-bold mb-2">
                  Nombre de usuario
                  <span className="text-[#4f46e5] dark:text-[#818cf8]">*</span>
                </label>
                <input
                  className="w-full p-2 border-2 border-[#cbd5e1] rounded-lg focus:outline-none text-black"
                  id="username"
                  type="text"
                  value={username}
                  placeholder="Usuario"
                  onChange={(e) => setUsername(e.target.value)}
                  onBlur={handleUsernameBlur}
                />
                {usernameError && (
                  <div className="my-4">
                    <p className="text-[#b91c1c] mb-4">{usernameError}</p>
                  </div>
                )}
              </div>

              {/* Correo electrónico */}
              <div className="my-7">
                <label className="block text-[#020617] dark:text-[#ffffff] text-sm font-bold mb-2">
                  Correo electrónico
                  <span className="text-[#4f46e5] dark:text-[#818cf8]">*</span>
                </label>
                <input
                  className="w-full p-2 border-2 border-[#cbd5e1] rounded-lg focus:outline-none text-black"
                  id="email"
                  type="email"
                  value={email}
                  placeholder="mail@gmail.com"
                  onChange={(e) => setEmail(e.target.value)}
                  onBlur={handleEmailBlur}
                />
                {emailError && (
                  <div className="my-4">
                    <p className="text-[#b91c1c] mb-4">{emailError}</p>
                  </div>
                )}
              </div>

              {/* Contraseña */}
              <div className="my-7">
                <label className="block text-[#020617] dark:text-[#ffffff] text-sm font-bold mb-2">
                  Contraseña
                  <span className="text-[#4f46e5] dark:text-[#818cf8]">*</span>
                </label>
                <input
                  className="w-full p-2 border-2 border-[#cbd5e1] rounded-lg focus:outline-none text-black"
                  id="password"
                  type="password"
                  value={password}
                  placeholder="Min. 8 caracteres"
                  onChange={(e) => setPassword(e.target.value)}
                  onBlur={handlePasswordBlur}
                />
                {passwordError && (
                  <div className="my-4">
                    <p className="text-[#b91c1c] mb-4">{passwordError}</p>
                  </div>
                )}
              </div>

              {/* Confirmar Contraseña */}
              <div className="my-7">
                <label className="block text-[#020617] dark:text-[#ffffff] text-sm font-bold mb-2">
                  Confirmar Contraseña
                  <span className="text-[#4f46e5] dark:text-[#818cf8]">*</span>
                </label>
                <input
                  className="w-full p-2 border-2 border-[#cbd5e1] rounded-lg focus:outline-none text-black"
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  placeholder="Confirma tu contraseña"
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  onBlur={handleConfirmPasswordBlur}
                />
                {confirmPasswordError && (
                  <div className="my-4">
                    <p className="text-[#b91c1c] mb-4">{confirmPasswordError}</p>
                  </div>
                )}
              </div>

              {error && (
                <div className="my-4">
                  <p className="text-[#b91c1c] mb-4">{error}</p>
                </div>
              )}

              <button
                type="submit"
                className={`${
                  isButtonDisabled
                    ? "bg-[#475569] cursor-not-allowed"
                    : "bg-[#4f46e5] dark:bg-[#A5B4FC]"
                } w-full h-12 text-[#ffffff] font-bold py-2 px-4 rounded-lg hover:bg-[#A5B4FC] focus:outline-none focus:bg-[#1d4ed8] mb-4`}
                disabled={isButtonDisabled}
              >
                Registrarse
              </button>
            </form>
          </div>
        </div>
        <div className="w-full flex items-center justify-center text-[#020617] dark:text-[#ffffff]">
          © 2024 ISFT. Todos los derechos reservados. GREEN PASSPORT
        </div>
      </div>
      <div className="w-2/5 flex items-center justify-center h-screen">
        <div className="bg-gradient-to-b from-[#ffffff] to-[#022c22] w-full h-full rounded-bl-full relative"></div>
      </div>
    </div>
  );
}