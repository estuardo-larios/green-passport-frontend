import Cookies from 'js-cookie';

/**
 * Clase CookieManager para gestionar cookies.
 */
class CookieManager {
  /**
   * Establece una cookie con un nombre, valor y opcionalmente días de expiración.
   * @param name - El nombre de la cookie.
   * @param value - El valor que se almacenará en la cookie.
   * @param days - Número opcional de días durante los cuales la cookie será válida. Si no se proporciona, la cookie será de sesión.
   */
  public setCookie(name: string, value: string, days?: number): void {
    const attributes = { expires: days };
    Cookies.set(name, value, attributes);
  }

  /**
   * Obtiene el valor de una cookie por su nombre.
   * @param name - El nombre de la cookie.
   * @returns El valor de la cookie o undefined si no existe.
   */
  public getCookie(name: string): string | undefined {
    return Cookies.get(name);
  }

  /**
   * Elimina una cookie por su nombre.
   * @param name - El nombre de la cookie.
   */
  public deleteCookie(name: string): void {
    try {
      Cookies.remove(name);
    } catch (error) {
      console.error(`Error al eliminar la cookie "${name}":`, error);
    }
  }
}

export default CookieManager;
