import { createContext, useContext, useEffect, useState, type Context, type ReactNode } from "react";
import { contenido, type Idioma, type Textos } from "./contenido";

interface ValorIdioma {
  idioma: Idioma;
  setIdioma: (i: Idioma) => void;
  t: Textos;
}

const IdiomaContext: Context<ValorIdioma | undefined> =
  (import.meta.hot?.data?.["IdiomaContext"] as Context<ValorIdioma | undefined> | undefined) ??
  createContext<ValorIdioma | undefined>(undefined);
if (import.meta.hot?.data) import.meta.hot.data["IdiomaContext"] = IdiomaContext;

const CLAVE = "portafolio-idioma";

export function ProveedorIdioma({ children }: { children: ReactNode }) {
  const [idioma, setIdiomaEstado] = useState<Idioma>("en");

  useEffect(() => {
    try {
      const guardado = window.localStorage.getItem(CLAVE);
      if (guardado === "en" || guardado === "es") setIdiomaEstado(guardado);
    } catch {
      /* sin acceso a localStorage */
    }
  }, []);

  useEffect(() => {
    document.documentElement.lang = idioma;
  }, [idioma]);

  const setIdioma = (i: Idioma) => {
    setIdiomaEstado(i);
    try {
      window.localStorage.setItem(CLAVE, i);
    } catch {
      /* ignorar */
    }
  };

  return (
    <IdiomaContext.Provider value={{ idioma, setIdioma, t: contenido[idioma] }}>
      {children}
    </IdiomaContext.Provider>
  );
}

export function useIdioma(): ValorIdioma {
  const ctx = useContext(IdiomaContext);
  if (!ctx) throw new Error("useIdioma debe usarse dentro de ProveedorIdioma");
  return ctx;
}
