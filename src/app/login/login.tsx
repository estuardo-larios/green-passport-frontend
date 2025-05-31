import { useState } from "react";
import { useAppDispatch } from "@/hooks/hook";
import { login } from "@/actions/login.action";
import { fetchUserByEmail } from "@/actions/user.action";
import validator from "validator";
import { useRouter } from "next/navigation";
import CookieManager from "@/lib/cookies";

/**
 * Custom hook for handling user login.
 * @returns An object containing the email, password, and a submit handler.
 */
const useUserLogin = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const cookieManeger = new CookieManager();

  const validateEmail = (value: string) => {
    if (!validator.isEmail(value)) {
      setEmailError("Formato del email incorrecto");
      return false;
    }
    setEmailError(null);
    return true;
  };

  const validatePassword = (value: string) => {
    if (value.length < 6) {
      setPasswordError("El password debe contener más de 6 caracteres");
      return false;
    }
    setPasswordError(null);
    return true;
  };

  const handleEmailBlur = () => {
    validateEmail(email);
  };

  const handlePasswordBlur = () => {
    validatePassword(password);
  };

  /**
   * Handles form submission for user login.
   * @param event - The form submission event.
   */
  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    event.preventDefault();
    setLoading(true);

    const isEmailValid = validateEmail(email);
    const isPasswordValid = validatePassword(password);

    if (!isEmailValid || !isPasswordValid) {
      setLoading(false);
      return;
    }

    if (emailError || passwordError) {
      setLoading(false);
      return;
    }

    try {
      await dispatch(login({ email, password }));
      const response = await dispatch(fetchUserByEmail(email));
      cookieManeger.setCookie('email_cookie', email, 1)
      cookieManeger.setCookie('user_role', String(response?.role), 1)

      router.push("/home");
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Fallo al iniciar sesión";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }

    console.log("Email:", email);
    console.log("Password:", password);
  };

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
