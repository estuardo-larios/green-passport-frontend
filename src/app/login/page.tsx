"use client";
import validator from "validator";
import userLogin from "./login";
import { useRouter } from "next/navigation";

export default function Login() {
  const {
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
  } = userLogin();

  // Hook de Next.js para navegación programática entre rutas.
  const router = useRouter();

  // Variable booleana que determina si el botón de envío debe estar deshabilitado.
  // Se deshabilita si email o contraseña están vacíos, o si existen errores de validación.
  const isButtonDisabled =
    !email || !password || Boolean(emailError) || Boolean(passwordError);

  // Renderizado condicional para mostrar un indicador de carga mientras se procesa el login.
  if (loading) {
    return <div>Loading...</div>;
  }

  /**
   * Función que redirige al usuario a la página de registro.
   * Utiliza el router de Next.js para cambiar la ruta a "/register".
   */
  const handleRegisterRedirect = (): void => {
    router.push("/register");
  };


  return (
    <div className="flex items-center justify-center">
      <div
        className="grid place-items-center basis-3/5 min-h-screen"
        style={{ backgroundColor: '#ffffff', color: '#031C30' }} // white / ocean-blue
      >
        <div className="w-full flex items-center justify-center">
          <div
            className="p-8 w-full max-w-lg rounded-lg shadow-md"
            style={{ backgroundColor: '#ffffff', color: '#031C30' }} // white / ocean-blue
          >
            <div className="flex items-center justify-left space-x-2 h-20">
              <h1
                className="mt-2 text-left text-2xl md:text-3xl lg:text-4xl font-bold"
                style={{ color: '#020617' }} // black
              >
                GREEN PASSPORT
              </h1>
            </div>
            <h4
              className="my-1 text-left"
              style={{ color: '#A0AEC0' }} // grey-blue
            >
              Introduce tu correo electrónico y contraseña para iniciar sesión.
            </h4>
            <div className="flex items-center my-7">
              <div
                className="flex-grow border-t"
                style={{ borderColor: '#020617' }} // black
              ></div>
              <span style={{ color: '#020617' /* black */ }} className="mx-4">
                o
              </span>
              <div
                className="flex-grow border-t"
                style={{ borderColor: '#020617' }} // black
              ></div>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="my-7">
                <label
                  className="block text-sm font-bold mb-2"
                  style={{ color: '#020617' }} // black
                >
                  Correo electrónico
                  <span style={{ color: '#4f46e5' }}>*</span> {/* purple */}
                </label>
                <input
                  className="w-full p-2 border-2 rounded-lg focus:outline-none text-black"
                  style={{
                    borderColor: '#cbd5e1', // grey-gum
                    // focus:ring is a Tailwind utility, can't do inline easily, leave as is
                  }}
                  id="username"
                  type="text"
                  value={email}
                  placeholder="mail@gmail.com"
                  onChange={(e) => setEmail(e.target.value)}
                  onBlur={handleEmailBlur}
                />
                {emailError && !validator.isEmail(email) && (
                  <div className="my-4">
                    <p
                      className="mb-4"
                      style={{ color: '#b91c1c' }} // red
                    >
                      {emailError}
                    </p>
                  </div>
                )}
              </div>
              <div className="my-7">
                <label
                  className="block text-sm font-bold mb-2"
                  style={{ color: '#020617' }} // black
                >
                  Contraseña
                  <span style={{ color: '#4f46e5' }}>*</span> {/* purple */}
                </label>
                <input
                  className="w-full p-2 border-2 rounded-lg focus:outline-none text-black"
                  style={{ borderColor: '#cbd5e1' }} // grey-gum
                  id="password"
                  type="password"
                  value={password}
                  placeholder="Min. 8 caracteres"
                  onChange={(e) => setPassword(e.target.value)}
                  onBlur={handlePasswordBlur}
                />
                {passwordError && password.length < 8 && (
                  <div className="my-4">
                    <p
                      className="mb-4"
                      style={{ color: '#b91c1c' }} // red
                    >
                      {passwordError}
                    </p>
                  </div>
                )}
              </div>

              {error && (
                <div className="my-4">
                  <p className="mb-4" style={{ color: '#b91c1c' }}>
                    {error}
                  </p>
                </div>
              )}

              <button
                type="submit"
                disabled={isButtonDisabled}
                className="w-full h-12 text-white font-bold py-2 px-4 rounded-lg mb-4"
                style={{
                  backgroundColor: isButtonDisabled ? '#475569' : '#4f46e5', // grey or purple
                  cursor: isButtonDisabled ? 'not-allowed' : 'pointer',
                }}
                onMouseEnter={(e) => {
                  if (!isButtonDisabled) {
                    (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#A5B4FC'; // light-periwinkle
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isButtonDisabled) {
                    (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#4f46e5'; // purple
                  }
                }}
              >
                Iniciar sesión
              </button>
            </form>

            <div className="mt-4 text-center">
              <button
                onClick={handleRegisterRedirect}
                style={{ color: '#4f46e5' }} // purple
                className="hover:underline"
              >
                ¿No tienes cuenta? Regístrate aquí
              </button>
            </div>
          </div>
        </div>
        <div style={{ color: '#020617' }} className="w-full flex items-center justify-center">
          © 2024 DSOWB. Todos los derechos reservados. GREEN PASSPORT
        </div>
      </div>
      <div className="w-2/5 flex items-center justify-center h-screen">
        <div
          className="w-full h-full rounded-bl-full relative"
          style={{
            background: 'linear-gradient(to bottom, #ffffff, oklch(26.2% 0.051 172.552)',
          }}
        ></div>
      </div>
    </div>
  );
}
