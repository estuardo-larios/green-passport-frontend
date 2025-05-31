import Cookies from 'js-cookie';

/**
 * CookieManager class for managing cookies.
 */
class CookieManager {
  /**
   * Sets a cookie with a name, value, and optionally expiration days.
   * @param name - The name of the cookie.
   * @param value - The value to store in the cookie.
   * @param days - Optional number of days for which the cookie will remain valid. If not provided, the cookie will be a session cookie.
   */
  public setCookie(name: string, value: string, days?: number): void {
    const attributes = { expires: days };
    Cookies.set(name, value, attributes);
  }

  /**
   * Retrieves the value of a cookie by its name.
   * @param name - The name of the cookie.
   * @returns The value of the cookie or undefined if it does not exist.
   */
  public getCookie(name: string): string | undefined {

      return Cookies.get(name);

  }

  /**
   * Deletes a cookie by its name.
   * @param name - The name of the cookie.
   */
  public deleteCookie(name: string): void {
    try {
      Cookies.remove(name);
    } catch (error) {
      console.error(`Error deleting cookie "${name}":`, error);
    }
  }
}

export default CookieManager;
