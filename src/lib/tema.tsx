export type Tema = "gojo" | "itachi" | "yoriichi";
export const TEMAS: Tema[] = ["gojo", "itachi", "yoriichi"];

export const IMAGENES_TEMA: Record<Tema, string> = {
  gojo: "/subida-70b837ce.png",
  itachi: "/subida-92e3830b.png",
  yoriichi: "/subida-4187590f.png",
};

export const POSICION_TEMA: Record<Tema, string> = {
  gojo: "50% 30%",
  itachi: "55% 25%",
  yoriichi: "50% 35%",
};

export const NOMBRES_TEMA: Record<Tema, string> = {
  gojo: "Gojo",
  itachi: "Itachi",
  yoriichi: "Yoriichi",
};
