const isBrowser = typeof window !== "undefined";

class LocalStorage {
  static get(key) {
    if (!isBrowser) return;
    return JSON.parse(localStorage.getItem(key));
  }

  static set(key, value) {
    if (!isBrowser) return;

    return localStorage.setItem(key, JSON.stringify(value));
  }

  static remove(key) {
    if (!isBrowser) return;

    return localStorage.removeItem(key);
  }

  static clear() {
    if (!isBrowser) return;

    return localStorage.clear();
  }
}

export { LocalStorage };
