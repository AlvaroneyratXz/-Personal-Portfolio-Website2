/* eslint-disable prettier/prettier */
import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  Briefcase,
  Globe,
  Search,
  ExternalLink,
  GraduationCap,
  Mail,
  Menu,
  Network,
  Phone,
  Send,
  Server,
  Shield,
  Wrench,
  X,
  FolderGit2,
} from "lucide-react";
import { TarjetaCertificado } from "../components/TarjetaCertificado";
import {
  CERTIFICADOS_BASE,
  cargarCertificados,
  ordenarCertificados,
  type Certificado,
} from "../lib/certificados-almacen";
import { ProveedorIdioma, useIdioma } from "../lib/idioma";
import { Companero, Cuervos, MotivoTema } from "../components/ElementosTema";
import { FondoPersonaje, TrioHero } from "../components/FondoPersonaje";
import { TerminalInteractiva } from "../components/TerminalInteractiva";
import { FotoPerfil } from "../components/FotoPerfil";
import { SeisOjos } from "../components/SeisOjos";
import { EfectosCursor } from "../components/EfectosCursor";
import {
  cargarEducacion,
  cargarExperiencia,
  EDUCACION_BASE,
  EXPERIENCIA_BASE,
  type EducacionItem,
  type ExperienciaItem,
} from "../lib/experiencia-almacen";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../components/ui/dialog";
import {
  cargarHero,
  enlaceTelefono,
  HERO_BASE,
  linkedinVisible,
  type HeroDatos,
} from "../lib/hero-almacen";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { name: "google-site-verification", content: "NrP2OcGYDqEq7nHXbNnMhUIC2SgCOaE0tV1Yp38lnSA" },
      { title: "Alvaro Jose Neyra Sáenz | Web Developer & Cybersecurity Specialist" },
      {
        name: "description",
        content:
          "Web Developer & Cybersecurity Specialist. Portfolio of Alvaro Jose Neyra Sáenz.",
      },
      { property: "og:title", content: "Alvaro Jose Neyra Sáenz | Web Developer & Cybersecurity Specialist" },
      {
        property: "og:description",
        content: "Web Developer & Cybersecurity Specialist. Portfolio and projects.",
      },
      { property: "og:image", content: "https://alvaroneyra.vercel.app/portada2.jpeg" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:image", content: "https://alvaroneyra.vercel.app/portada2.jpeg" },
    ],
  }),
  component: Index,
});

const CORREO = "neyra11423@hotmail.com";

function Index() {
  return (
    <ProveedorIdioma>
      <Portafolio />
    </ProveedorIdioma>
  );
}

function Portafolio() {
  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-background font-sans text-foreground">
      <div className="sticky top-0 z-50 w-full">
        <Encabezado />
      </div>
      <main className="w-full">
        <Hero />
        <Experiencia />
        <Habilidades />
        <Proyectos />
        <Servicios />
        <Educacion />
        <Contacto />
      </main>
      <Pie />
      <Companero />
      <EfectosCursor />
    </div>
  );
}

function Encabezado() {
  const { idioma, setIdioma, t } = useIdioma();
  const [abierto, setAbierto] = useState(false);
  const enlaces = [
    { href: "#about", texto: t.nav.about },
    { href: "#experience", texto: t.nav.experience },
    { href: "#skills", texto: t.nav.skills },
    { href: "#projects", texto: t.nav.projects },
    { href: "#services", texto: t.nav.services },
    { href: "#contact", texto: t.nav.contact },
  ];
  const selector = (
    <div className="flex overflow-hidden rounded-md border border-border font-mono text-xs">
      {(["en", "es"] as const).map((i) => (
        <button
          key={i}
          type="button"
          onClick={() => setIdioma(i)}
          className={`px-3 py-1.5 uppercase transition-colors ${
            idioma === i ? "bg-ojos text-background font-bold" : "text-muted-foreground hover:text-foreground"
          }`}
        >
          {i}
        </button>
      ))}
    </div>
  );

  return (
    <header className="relative w-full border-b border-border bg-background/85 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <a
          href="#about"
          className="group min-w-0 font-mono text-lg font-bold text-ojos transition hover:text-destello"
          aria-label="AN"
        >
          <span className="text-sharingan">&gt;</span> AN<span className="animate-pulse">_</span>
        </a>
        <nav className="hidden items-center gap-6 lg:flex">
          {enlaces.map((e) => (
            <a key={e.href} href={e.href} className="text-sm text-muted-foreground transition hover:text-ojos">
              {e.texto}
            </a>
          ))}
        </nav>
        <div className="hidden items-center gap-3 lg:flex">
          {selector}
        </div>
        <button
          type="button"
          className="rounded-md border border-border p-2 lg:hidden"
          onClick={() => setAbierto((v) => !v)}
          aria-label="menu"
          aria-expanded={abierto}
          aria-controls="menu-principal"
        >
          {abierto ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>
      {abierto && (
        <div id="menu-principal" className="flex flex-col gap-4 border-t border-border bg-background px-4 py-4 lg:hidden">
          {enlaces.map((e) => (
            <a
              key={e.href}
              href={e.href}
              onClick={() => setAbierto(false)}
              className="text-sm text-muted-foreground hover:text-ojos"
            >
              {e.texto}
            </a>
          ))}
          <div className="flex items-center pt-2">
            {selector}
          </div>
        </div>
      )}
    </header>
  );
}

function Hero() {
  const { t, idioma } = useIdioma();
  const [hero, setHero] = useState<HeroDatos>(HERO_BASE);
  useEffect(() => {
    setHero(cargarHero());
  }, []);
  const h = hero[idioma];
  return (
    <section id="about" className="relative scroll-mt-16 overflow-hidden px-4 sm:px-6 lg:px-8">
      <div className="pointer-events-none absolute -top-32 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-ojos/10 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 -top-10 h-96 w-96 text-ojos opacity-[0.12]">
        <MotivoTema tema="itachi" className="motivo-giro h-full w-full" />
      </div>
      <Cuervos />
      <div className="pointer-events-none absolute -bottom-32 -left-20 h-72 w-72 rounded-full bg-sharingan/10 blur-3xl" />
      <div className="mx-auto grid max-w-7xl items-center gap-10 py-10 sm:py-16 md:py-20 lg:grid-cols-2 lg:py-24">
        <div className="min-w-0">
          <FotoPerfil className="mb-5" />
          <p className="font-mono text-sm text-destello">{h.saludo}</p>
          <h1 className="mt-2 text-3xl font-extrabold leading-tight sm:text-4xl md:text-5xl wrap-anywhere">
            {hero.nombre}
          </h1>
          <p className="mt-3 text-base font-semibold leading-snug text-ojos sm:text-lg md:text-xl wrap-anywhere">
            {h.titulo}
            <span className="mt-1 block text-sm font-normal text-muted-foreground md:text-base">
              {h.subtitulo}
            </span>
          </p>
          {h.lema && (
            <p className="mt-2 border-l-2 border-sharingan pl-3 font-mono text-xs text-destello wrap-anywhere">
              {h.lema}
            </p>
          )}
          <p className="mt-5 max-w-xl text-sm sm:text-base text-muted-foreground wrap-anywhere">{h.bio}</p>
          <ul className="mt-5 flex flex-col gap-2 font-mono text-xs sm:text-sm">
            <li>
              <a
                href={`tel:${enlaceTelefono(hero.telefono)}`}
                className="inline-flex min-w-0 flex-wrap items-center gap-2 wrap-break-word text-foreground transition hover:text-ojos"
              >
                <Phone className="h-4 w-4 text-destello shrink-0" />
                <span className="text-muted-foreground">{t.llamame}:</span>
                <span className="wrap-anywhere">{hero.telefono}</span>
              </a>
            </li>
            <li>
              <a
                href={hero.linkedin}
                target="_blank"
                rel="noreferrer"
                className="inline-flex min-w-0 flex-wrap items-center gap-2 wrap-break-word text-foreground transition hover:text-ojos"
              >
                <Briefcase className="h-4 w-4 text-destello shrink-0" />
                <span>LinkedIn:</span>
                <span className="wrap-anywhere">{linkedinVisible(hero.linkedin)}</span>
              </a>
            </li>
            <li>
              <a
                href={`mailto:${hero.correo}`}
                className="inline-flex min-w-0 flex-wrap items-center gap-2 wrap-break-word text-foreground transition hover:text-ojos"
              >
                <Mail className="h-4 w-4 text-destello shrink-0" />
                <span className="text-muted-foreground">{t.escribeme}:</span>
                <span className="wrap-anywhere">{hero.correo}</span>
              </a>
            </li>
          </ul>
        </div>
        <div className="relative min-w-0 pt-6 sm:pt-12 lg:pt-14 overflow-hidden">
          <SeisOjos className="pointer-events-none absolute left-2 top-0 h-12 w-12 sm:h-16 sm:w-16 md:h-20 md:w-20" />
          <TrioHero className="absolute right-4 top-0 scale-75 origin-right sm:scale-100" />
          <TerminalInteractiva />
        </div>
      </div>
    </section>
  );
}

function Titulo({ children }: { children: string }) {
  return (
    <h2 className="mb-8 sm:mb-10 flex items-center gap-3 text-xl sm:text-2xl md:text-3xl font-bold">
      <span className="h-6 w-1 rounded bg-sharingan shrink-0" />
      <span className="wrap-anywhere">{children}</span>
    </h2>
  );
}

function Experiencia() {
  const { t, idioma } = useIdioma();
  const [items, setItems] = useState<ExperienciaItem[]>(EXPERIENCIA_BASE);
  useEffect(() => {
    setItems(cargarExperiencia());
  }, []);
  return (
    <section id="experience" className="relative scroll-mt-16 overflow-hidden border-t border-border py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8">
      <FondoPersonaje tema="itachi" lado="right" />
      <div className="mx-auto max-w-4xl xl:max-w-5xl">
        <Titulo>{t.tituloExperiencia}</Titulo>
        <ol className="relative ml-2 sm:ml-3 border-l border-ojos/30">
          {items.map((it) => {
            const x = it[idioma];
            const e = { empresa: it.empresa, periodo: x.periodo, rol: x.rol, detalle: x.detalle };
            const logo = it.logo;
            return (
            <li key={it.id} className="group mb-10 ml-6">
              <span className="absolute -left-1.75 mt-1.5 h-3.5 w-3.5 rounded-full border-2 border-ojos bg-background transition group-hover:bg-destello" />
              <div className="flex flex-col gap-4 rounded-lg border border-border bg-card p-4 sm:p-5 transition group-hover:border-ojos/50 sm:flex-row sm:items-start">
                {logo && (
                  <img
                    src={logo}
                    alt={`Logo ${e.empresa}`}
                    loading="lazy"
                    className="h-14 w-14 sm:h-16 sm:w-16 lg:h-20 lg:w-20 shrink-0 rounded-lg border border-border bg-white object-contain"
                  />
                )}
                <div className="min-w-0 flex-1">
                  <p className="font-mono text-xs text-destello wrap-anywhere">{e.periodo}</p>
                  <h3 className="mt-1 text-base sm:text-lg font-bold wrap-anywhere">{e.empresa}</h3>
                  <p className="text-xs sm:text-sm font-semibold text-ojos wrap-anywhere">{e.rol}</p>
                  <ul className="mt-3 list-disc space-y-2 pl-4 sm:pl-5 text-xs sm:text-sm text-muted-foreground marker:text-ojos">
                    {e.detalle.map((d, n) => (
                      <li key={`${n}-${d}`} className="wrap-anywhere">{d}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}

function Habilidades() {
  const { t } = useIdioma();
  const iconos = [Wrench, Server, Network, Shield];
  return (
    <section id="skills" className="relative scroll-mt-16 overflow-hidden border-t border-border py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8">
      <FondoPersonaje tema="gojo" lado="left" />
      <div className="mx-auto max-w-7xl">
        <Titulo>{t.tituloHabilidades}</Titulo>
        <div className="grid gap-4 sm:gap-6 grid-cols-1 md:grid-cols-2">
          {t.habilidades.map((m, idx) => {
            const Icono = iconos[idx] ?? Shield;
            return (
              <div
                key={m.titulo}
                className="min-w-0 rounded-xl border border-ojos/20 bg-card p-4 sm:p-6 transition hover:border-ojos/60 hover:shadow-[0_0_30px_-10px] hover:shadow-ojos/50"
              >
                <h3 className="mb-4 flex items-center gap-2 font-mono text-xs sm:text-sm font-bold uppercase tracking-wider text-ojos wrap-anywhere">
                  <Icono className="h-4 w-4 shrink-0" />
                  <span className="wrap-anywhere">{m.titulo}</span>
                </h3>
                <div className="flex flex-wrap gap-2">
                  {m.items.map((it) => (
                    <span
                      key={it}
                      className="rounded-md border border-border bg-secondary px-2.5 py-1 text-xs text-secondary-foreground wrap-anywhere"
                    >
                      {it}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function Proyectos() {
  const { t } = useIdioma();
  return (
    <section id="projects" className="relative scroll-mt-16 overflow-hidden border-t border-border py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8">
      <FondoPersonaje tema="yoriichi" lado="right" />
      <div className="mx-auto max-w-7xl">
        <Titulo>{t.tituloProyectos}</Titulo>
        <div className="grid gap-4 sm:gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {t.proyectos.map((p) => (
            <article
              key={p.nombre}
              className="min-w-0 rounded-xl border border-border bg-card p-4 sm:p-6 transition hover:-translate-y-1 hover:border-destello/60 flex flex-col justify-between"
            >
              <div>
                <FolderGit2 className="h-6 w-6 text-destello" />
                <h3 className="mt-3 font-bold text-base sm:text-lg wrap-anywhere">{p.nombre}</h3>
                <p className="mt-2 text-xs sm:text-sm text-muted-foreground wrap-anywhere">{p.descripcion}</p>
              </div>
              <div className="mt-4 flex flex-wrap gap-2 pt-2">
                {p.etiquetas.map((e) => (
                  <span key={e} className="font-mono text-xs text-ojos wrap-anywhere">
                    #{e}
                  </span>
                ))}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function Servicios() {
  const { t } = useIdioma();
  const iconos = [Server, Search, Shield];
  return (
    <section id="services" className="relative scroll-mt-16 overflow-hidden border-t border-border py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <Titulo>{t.servicios.titulo}</Titulo>
        <p className="mb-8 max-w-3xl text-sm sm:text-base text-muted-foreground wrap-anywhere">{t.servicios.intro}</p>
        <div className="grid gap-4 sm:gap-6 grid-cols-1 md:grid-cols-3">
          {t.servicios.items.map((s, i) => {
            const Icono = iconos[i] ?? Globe;
            return (
              <article
                key={s.titulo}
                className="min-w-0 rounded-xl border border-border bg-card p-4 sm:p-6 transition hover:-translate-y-1 hover:border-destello/60"
              >
                <Icono className="h-6 w-6 text-destello shrink-0" />
                <h3 className="mt-3 font-bold text-base sm:text-lg wrap-anywhere">{s.titulo}</h3>
                <p className="mt-2 text-xs sm:text-sm text-muted-foreground wrap-anywhere">{s.descripcion}</p>
              </article>
            );
          })}
        </div>
        <div className="mt-8">
          <a
            href="#contact"
            className="inline-flex items-center gap-2 rounded-md bg-ojos px-5 py-3 text-xs sm:text-sm font-semibold text-background transition hover:opacity-90"
          >
            <Globe className="h-4 w-4 shrink-0" />
            <span className="wrap-anywhere">{t.servicios.cta}</span>
          </a>
        </div>
      </div>
    </section>
  );
}

function VisorPdf({ src, titulo }: { src: string; titulo: string }) {
  const [url, setUrl] = useState("");
  useEffect(() => {
    let revocar = "";
    let activo = true;
    fetch(src)
      .then((r) => r.blob())
      .then((b) => {
        if (!activo) return;
        const pdf = b.type === "application/pdf" ? b : new Blob([b], { type: "application/pdf" });
        revocar = URL.createObjectURL(pdf);
        setUrl(revocar);
      })
      .catch(() => {
        if (activo) setUrl(src);
      });
    return () => {
      activo = false;
      if (revocar) URL.revokeObjectURL(revocar);
    };
  }, [src]);
  if (!url) return null;
  return (
    <div className="space-y-3 w-full min-w-0">
      <iframe src={url} title={titulo} className="h-[60vh] sm:h-[70vh] w-full rounded-md border border-border" />
      <a
        href={url}
        target="_blank"
        rel="noreferrer"
        className="inline-flex items-center gap-2 text-xs sm:text-sm text-ojos hover:underline wrap-anywhere"
      >
        <ExternalLink className="h-4 w-4 shrink-0" />
        Abrir en una pestaña nueva
      </a>
    </div>
  );
}

function Educacion() {
  const { t, idioma } = useIdioma();
  const [lista, setLista] = useState<Certificado[]>(() => ordenarCertificados(CERTIFICADOS_BASE));
  const [estudios, setEstudios] = useState<EducacionItem[]>(EDUCACION_BASE);
  useEffect(() => {
    setLista(ordenarCertificados(cargarCertificados()));
    setEstudios(cargarEducacion());
  }, []);
  return (
    <section className="relative scroll-mt-16 overflow-hidden border-t border-border py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8">
      <FondoPersonaje tema="gojo" lado="right" />
      <div className="mx-auto grid min-w-0 max-w-7xl gap-10">
        <div className="min-w-0">
          <Titulo>{t.tituloEducacion}</Titulo>
          <div className="grid gap-3">
            {estudios.map((x) => {
              const interior = (
                <>
                {x.logo ? (
                  <img
                    src={x.logo}
                    alt={`Logo ${x[idioma].lugar}`}
                    loading="lazy"
                    className="h-14 w-14 sm:h-16 sm:w-16 lg:h-20 lg:w-20 shrink-0 rounded-lg border border-border bg-white object-contain"
                  />
                ) : (
                  <GraduationCap className="h-8 w-8 shrink-0 text-ojos" />
                )}
                <div className="min-w-0 flex-1">
                  <h3 className="font-bold text-sm sm:text-base wrap-anywhere">{x[idioma].titulo}</h3>
                  <p className="text-xs sm:text-sm text-muted-foreground wrap-anywhere">{x[idioma].lugar}</p>
                </div>
                {x.archivo && <ExternalLink className="h-4 w-4 shrink-0 self-center text-ojos" aria-hidden="true" />}
                </>
              );
              if (!x.archivo) {
                return (
                  <div key={x.id} className="flex items-center gap-4 rounded-xl border border-border bg-card p-4 sm:p-6">
                    {interior}
                  </div>
                );
              }
              const titulo = x[idioma].titulo;
              const esPdf = x.archivo.startsWith("data:application/pdf") || x.archivo.toLowerCase().endsWith(".pdf");
              return (
                <Dialog key={x.id}>
                  <DialogTrigger asChild>
                    <button
                      type="button"
                      className="flex w-full items-center gap-4 rounded-xl border border-border bg-card p-4 text-left transition hover:border-ojos sm:p-6"
                    >
                      {interior}
                    </button>
                  </DialogTrigger>
                  <DialogContent className="max-h-[90dvh] w-[95vw] max-w-4xl overflow-y-auto p-4 sm:p-6">
                    <DialogHeader>
                      <DialogTitle className="text-base sm:text-lg wrap-anywhere">{titulo}</DialogTitle>
                    </DialogHeader>
                    {esPdf ? (
                      <VisorPdf src={x.archivo} titulo={titulo} />
                    ) : (
                      <img src={x.archivo} alt={titulo} className="h-auto w-full rounded-md border border-border shadow-lg" />
                    )}
                  </DialogContent>
                </Dialog>
              );
            })}
          </div>
        </div>
        <div className="min-w-0">
          <Titulo>{t.tituloCertificaciones}</Titulo>
          <ul className="grid min-w-0 gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {lista.map((c) => (
              <li key={c.nombre} className="min-w-0">
                <TarjetaCertificado
                  nombre={c.nombre}
                  emisor={c.emisor}
                  imagen={c.imagen}
                  logo={c.logo}
                  vigencia={c.vigencia}
                />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

function Contacto() {
  const { t } = useIdioma();
  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [errores, setErrores] = useState<{ nombre?: string; correo?: string; mensaje?: string }>({});
  const [enviado, setEnviado] = useState(false);
  const [bloqueado, setBloqueado] = useState(false);

  const validar = (e: React.FormEvent) => {
    e.preventDefault();
    if (bloqueado) return;

    const nuevos: { nombre?: string; correo?: string; mensaje?: string } = {};
    const nombreLimpio = nombre.trim().replace(/<[^>]*>?/gm, "");
    const correoLimpio = correo.trim();
    const mensajeLimpio = mensaje.trim().replace(/<[^>]*>?/gm, "");

    if (nombreLimpio.length < 2) nuevos.nombre = t.form.errNombre;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correoLimpio)) nuevos.correo = t.form.errCorreo;
    if (mensajeLimpio.length < 10) nuevos.mensaje = t.form.errMensaje;
    
    setErrores(nuevos);
    if (Object.keys(nuevos).length > 0) {
      setEnviado(false);
      return;
    }

    setBloqueado(true);
    setTimeout(() => setBloqueado(false), 5000);

    const asunto = encodeURIComponent(`Portfolio - ${nombreLimpio}`);
    const cuerpo = encodeURIComponent(`${mensajeLimpio}\n\n${nombreLimpio} <${correoLimpio}>`);
    window.location.href = `mailto:${CORREO}?subject=${asunto}&body=${cuerpo}`;
    setEnviado(true);
  };

  const campo =
    "w-full rounded-md border border-input bg-secondary px-3 py-2 text-sm outline-none transition focus:border-ojos wrap-anywhere";

  return (
    <section id="contact" className="relative scroll-mt-16 overflow-hidden border-t border-border py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8">
      <FondoPersonaje tema="itachi" lado="left" />
      <div className="mx-auto grid min-w-0 max-w-7xl gap-10 md:grid-cols-2">
        <div>
          <Titulo>{t.tituloContacto}</Titulo>
          <p className="mb-6 text-sm sm:text-base text-muted-foreground wrap-anywhere">{t.subContacto}</p>
        </div>
        <form onSubmit={validar} noValidate className="min-w-0 space-y-4 rounded-xl border border-border bg-card p-4 sm:p-6">
          <div>
            <label className="mb-1 block text-xs sm:text-sm font-medium">{t.form.nombre}</label>
            <input className={campo} value={nombre} onChange={(e) => setNombre(e.target.value)} maxLength={100} />
            {errores.nombre && <p className="mt-1 text-xs text-sharingan wrap-anywhere">{errores.nombre}</p>}
          </div>
          <div>
            <label className="mb-1 block text-xs sm:text-sm font-medium">{t.form.correo}</label>
            <input
              type="email"
              className={campo}
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
              maxLength={255}
            />
            {errores.correo && <p className="mt-1 text-xs text-sharingan wrap-anywhere">{errores.correo}</p>}
          </div>
          <div>
            <label className="mb-1 block text-xs sm:text-sm font-medium">{t.form.mensaje}</label>
            <textarea
              rows={5}
              className={campo}
              value={mensaje}
              onChange={(e) => setMensaje(e.target.value)}
              maxLength={2000}
            />
            {errores.mensaje && <p className="mt-1 text-xs text-sharingan wrap-anywhere">{errores.mensaje}</p>}
          </div>
          <button
            type="submit"
            disabled={bloqueado}
            className={`inline-flex w-full items-center justify-center gap-2 rounded-md px-5 py-2.5 text-xs sm:text-sm font-semibold text-foreground transition sm:w-auto ${
              bloqueado ? "bg-muted cursor-not-allowed opacity-50" : "bg-sharingan hover:brightness-125"
            }`}
          >
            <Send className="h-4 w-4 shrink-0" />
            <span className="wrap-anywhere">{bloqueado ? "Espera un momento..." : t.form.enviar}</span>
          </button>
          {enviado && <p className="text-xs sm:text-sm text-ojos wrap-anywhere">{t.form.exito}</p>}
        </form>
      </div>
    </section>
  );
}

function Pie() {
  const { t } = useIdioma();
  return (
    <footer className="border-t border-border py-6 sm:py-8 px-4 text-center font-mono text-xs text-muted-foreground wrap-anywhere">
      © 2026 Alvaro Jose Neyra Sáenz · {t.pie} ·{" "}
      <a href="/administrador" className="hover:text-ojos underline">
        Administrador
      </a>
    </footer>
  );
}