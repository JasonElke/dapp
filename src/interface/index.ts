export interface Locales<T = any> {
  /** English */
  EN: T;
}

export type Language = keyof Locales;
