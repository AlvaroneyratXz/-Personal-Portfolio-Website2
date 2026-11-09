import { contenido, type Idioma } from "./contenido";

export type TextosHero = {
  saludo: string;
  titulo: string;
  subtitulo: string;
  lema: string;
  bio: string;
};

export type HeroDatos = {
  nombre: string;
  telefono: string;
  linkedin: string;
  correo: string;
  en: TextosHero;
  es: TextosHero;
};

function base(idioma: Idioma, lema: string): TextosHero {
  const t = contenido[idioma];
  return {
    saludo: t.heroSaludo,
    titulo: t.heroTitulo,
    subtitulo: t.heroSubtitulo,
    lema,
    bio: t.heroBio,
  };
}

export const HERO_BASE: HeroDatos = {
  nombre: "Alvaro Jose Neyra Sáenz",
  telefono: "+51 912 921 771",
  linkedin: "https://www.linkedin.com/in/alvaroneyra",
  correo: "neyra11423@hotmail.com",
  en: base("en", "Six Eyes precision. Sharingan foresight. One clean strike."),
  es: base("es", "Precisión de los Seis Ojos. Visión del Sharingan. Un solo corte limpio."),
};

const CLAVE_HERO = "portafolio-hero";

export function cargarHero(): HeroDatos {
  if (typeof window === "undefined") return HERO_BASE;
  try {
    const guardado = window.localStorage.getItem(CLAVE_HERO);
    if (!guardado) return HERO_BASE;
    const datos = JSON.parse(guardado) as Partial<HeroDatos> | null;
    if (!datos || typeof datos !== "object") return HERO_BASE;
    return {
      nombre: datos.nombre ?? HERO_BASE.nombre,
      telefono: datos.telefono ?? HERO_BASE.telefono,
      linkedin: urlSegura(datos.linkedin, HERO_BASE.linkedin),
      correo: typeof datos.correo === "string" ? datos.correo : HERO_BASE.correo,
      en: { ...HERO_BASE.en, ...(datos.en ?? {}) },
      es: { ...HERO_BASE.es, ...(datos.es ?? {}) },
    };
  } catch {
    return HERO_BASE;
  }
}

// Solo se aceptan enlaces http(s): evita "javascript:" y otros esquemas peligrosos.
export function urlSegura(valor: unknown, respaldo: string): string {
  if (typeof valor !== "string") return respaldo;
  try {
    const u = new URL(valor.trim());
    return u.protocol === "https:" || u.protocol === "http:" ? u.href : respaldo;
  } catch {
    return respaldo;
  }
}

export function guardarHero(datos: HeroDatos): boolean {
  try {
    window.localStorage.setItem(
      CLAVE_HERO,
      JSON.stringify({ ...datos, linkedin: urlSegura(datos.linkedin, HERO_BASE.linkedin) }),
    );
    return true;
  } catch {
    return false;
  }
}

export function restablecerHero(): void {
  window.localStorage.removeItem(CLAVE_HERO);
}

export function enlaceTelefono(telefono: string): string {
  return telefono.replace(/[^\d+]/g, "");
}

export function linkedinVisible(url: string): string {
  return url.replace(/^https?:\/\/(www\.)?/i, "").replace(/\/$/, "");
}
