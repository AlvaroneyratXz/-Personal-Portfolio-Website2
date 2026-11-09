export type Idioma = "en" | "es";

export interface Textos {
  nav: { about: string; experience: string; skills: string; projects: string; services: string; contact: string };
  servicios: {
    titulo: string;
    intro: string;
    items: { titulo: string; descripcion: string }[];
    cta: string;
  };
  cv: string;
  heroSaludo: string;
  heroTitulo: string;
  heroSubtitulo: string;
  heroBio: string;
  verContacto: string;
  verExperiencia: string;
  tituloExperiencia: string;
  tituloHabilidades: string;
  tituloEducacion: string;
  tituloCertificaciones: string;
  tituloProyectos: string;
  tituloContacto: string;
  subContacto: string;
  titulo: string;
  proyectos: { nombre: string; descripcion: string; etiquetas: string[] }[];
  experiencia: { empresa: string; periodo: string; rol: string; detalle: string[] }[];
  habilidades: { titulo: string; items: string[] }[];
  educacion: { titulo: string; lugar: string };
  certificaciones: string[];
  form: {
    nombre: string;
    correo: string;
    mensaje: string;
    enviar: string;
    errNombre: string;
    errCorreo: string;
    errMensaje: string;
    exito: string;
  };
  pie: string;
  llamame: string;
  escribeme: string;
}

export const contenido: Record<Idioma, Textos> = {
  en: {
    nav: { about: "About", experience: "Experience", skills: "Skills", projects: "Projects", services: "Web Services", contact: "Contact" },
    servicios: {
      titulo: "Web Development for Clients",
      intro:
        "I build websites 100% tailored to the client: design and layout adapted exactly to your style, brand identity and visual preferences. And I don't stop at aesthetics — I support you through the whole process:",
      items: [
        {
          titulo: "Hosting, domain & business email",
          descripcion: "Hosting, domain and corporate email accounts set up from scratch.",
        },
        {
          titulo: "Google SEO & ranking",
          descripcion: "Optimization and positioning on Google so your customers can find you easily.",
        },
        {
          titulo: "Ethical hacking analysis",
          descripcion:
            "Unique added value: as a cybersecurity specialist, I include an ethical hacking analysis of the web system to find and close any security gap before going live.",
        },
      ],
      cta: "Request your website",
    },
    cv: "Download CV",
    heroSaludo: "Hello, I'm",
    heroTitulo: "Web Developer & Cybersecurity Specialist",
    heroSubtitulo: "Building custom, high-performance web apps with integrated ethical hacking audits",
    heroBio:
      "Systems Engineering Graduate with over 2 years of experience optimizing IT operations, securing corporate environments, and implementing cybersecurity audits. Specialist in agile incident resolution and critical infrastructure management, combining a methodical, analytical approach with strong communication and vendor coordination skills. Passionate about transforming complex requirements into secure, efficient, and results-driven technological solutions.",
    verContacto: "Get in touch",
    verExperiencia: "View experience",
    tituloExperiencia: "Professional Experience",
    tituloHabilidades: "Technical Skills & Tools",
    tituloEducacion: "Education",
    tituloCertificaciones: "Certifications",
    tituloProyectos: "Featured Projects",
    tituloContacto: "Contact",
    subContacto: "Have an incident, a project or an opportunity? Send me a message.",
    titulo: "Alvaro Jose Neyra Sáenz | IT Support & Cybersecurity Analyst",
    proyectos: [
      {
        nombre: "Ransomware Recovery",
        descripcion:
          "Restored critical services after a ransomware incident, automating recovery tasks with PowerShell and coordinating vendors.",
        etiquetas: ["PowerShell", "Incident Response", "Backup"],
      },
      {
        nombre: "SLA Improvement Program",
        descripcion:
          "Raised SLA compliance by 30% and cut ticket resolution time by 8 days across ServiceNow and Jira.",
        etiquetas: ["ServiceNow", "Jira", "ITIL"],
      },
      {
        nombre: "Security Controls Assessment",
        descripcion:
          "Evaluated controls aligned to ISO/IEC 27001, NIST CSF and COBIT and tracked internal audit findings.",
        etiquetas: ["ISO 27001", "NIST CSF", "COBIT"],
      },
    ],
    experiencia: [
      {
        empresa: "UMAYUQ",
        periodo: "April 2026",
        rol: "Cybersecurity Operations Support (Project-Based)",
        detalle: [
          "Restored critical enterprise operations and business continuity following a ransomware attack by executing precise recovery plans (Microsoft Project) and coordinating external vendors.",
          "Accelerated disaster recovery timelines by deploying automated PowerShell validation scripts to quickly trace indicators of compromise and verify system integrity.",
          "Ensured post-incident stability by monitoring restored servers and tightening security controls across corporate infrastructure.",
        ],
      },
      {
        empresa: "NOVU",
        periodo: "April 2025 – January 2026",
        rol: "IT Support Engineer",
        detalle: [
          "Resolved N1 technical support incidents, cutting average incident resolution time by 8 days using ServiceNow and Jira Service Management.",
          "Boosted SLA compliance by 30% through streamlining incident workflows and optimizing the knowledge base with recurring troubleshooting procedures.",
          "Optimized client endpoint stability by maintaining hardware inventories, software licenses, and access permissions across multiple enterprise environments using Kaseya and Datto.",
        ],
      },
      {
        empresa: "EMIT LATAM",
        periodo: "August 2024 – January 2025",
        rol: "IT Security Analyst",
        detalle: [
          "Spearheaded the systematic closure of security gaps across multiple internal audits per week, aligning technical controls with ISO/IEC 27001, NIST CSF, and COBIT frameworks.",
          "Streamlined compliance tracking by designing and implementing proactive security policies that reduced internal vulnerability metrics.",
          "Coordinated cross-functional security remediation efforts, ensuring rapid evidence collection and stakeholder alignment during audit cycles.",
        ],
      },
      {
        empresa: "AXUS ADVISORY GROUP",
        periodo: "July 2023 – July 2024",
        rol: "SOC Analyst Level 1",
        detalle: [
          "Contained active endpoint security threats before propagation using AlienVault SIEM monitoring, Microsoft Defender, and Cisco AMP.",
          "Analyzed real-time operating system logs and network anomalies to detect unauthorized access attempts and potential security breaches.",
          "Performed proactive vulnerability assessments and penetration testing simulations using Kali Linux, Nmap, and Metasploit to harden system defenses.",
        ],
      },
    ],
    habilidades: [
      {
        titulo: "Support & Operations",
        items: ["N1/N2 incidents", "ITIL", "SLA", "Knowledge base", "Equipment/license inventory", "Backup & restore"],
      },
      {
        titulo: "Support Tools",
        items: [
          "ServiceNow",
          "Jira Service Management",
          "Microsoft 365 (Exchange, Teams, SharePoint, OneDrive, Intune)",
          "TeamViewer",
          "AnyDesk",
          "Kaseya VSA",
          "Datto",
        ],
      },
      { titulo: "Networks & Systems", items: ["Windows Server", "Linux", "VPN", "TCP/IP", "LAN/WAN"] },
      {
        titulo: "Security & Automation",
        items: [
          "ISO/IEC 27001",
          "NIST CSF",
          "PowerShell",
          "Bash",
          "Python",
          "SQL",
          "Tenable",
          "AlienVault SIEM",
          "Microsoft Defender",
        ],
      },
    ],
    educacion: {
      titulo: "Bachelor's in Computer Systems Engineering",
      lugar: "Universidad Privada del Norte, 2022",
    },
    certificaciones: [],
    form: {
      nombre: "Name",
      correo: "Email",
      mensaje: "Message",
      enviar: "Send message",
      errNombre: "Please enter your name (at least 2 characters).",
      errCorreo: "Please enter a valid email address.",
      errMensaje: "Your message must be at least 10 characters.",
      exito: "Your email app is opening with your message ready to send.",
    },
    pie: "All rights reserved.",
    llamame: "Call me",
    escribeme: "Email me",
  },
  es: {
    nav: { about: "Sobre mí", experience: "Experiencia", skills: "Habilidades", projects: "Proyectos", services: "Servicios web", contact: "Contacto" },
    servicios: {
      titulo: "Desarrollo de Páginas Web para Clientes",
      intro:
        "Desarrollo páginas web diseñadas 100% a la disposición del cliente: adaptamos el diseño y la maquetación exactamente a tu estilo, identidad de marca y preferencias visuales, pero no nos quedamos solo en la estética, te acompañamos en todo el proceso integral:",
      items: [
        {
          titulo: "Alojamiento, dominio y correos corporativos",
          descripcion: "Alojamiento, dominio y correos corporativos configurados desde cero.",
        },
        {
          titulo: "Posicionamiento en Google",
          descripcion: "Optimización y posicionamiento en Google para que tus clientes te encuentren fácilmente.",
        },
        {
          titulo: "Análisis de ethical hacking",
          descripcion:
            "Valor agregado único: como especialista en ciberseguridad, incluyo un análisis de ethical hacking en el sistema web para buscar y cerrar cualquier brecha de seguridad antes de salir al aire.",
        },
      ],
      cta: "Solicita tu página web",
    },
    cv: "Descargar CV",
    heroSaludo: "Hola, soy",
    heroTitulo: "Desarrollador Web y Especialista en Ciberseguridad",
    heroSubtitulo:
      "Creo aplicaciones web personalizadas y de alto rendimiento con auditorías de hacking ético integradas",
    heroBio:
      "Egresado de Ingeniería de Sistemas con más de 2 años de experiencia optimizando operaciones de TI, asegurando entornos corporativos e implementando auditorías de ciberseguridad. Especialista en la resolución ágil de incidentes y la gestión de infraestructura crítica, combinando un enfoque metódico y analítico con sólidas habilidades de comunicación y coordinación con proveedores. Apasionado por convertir requerimientos complejos en soluciones tecnológicas seguras, eficientes y orientadas a resultados.",
    verContacto: "Contáctame",
    verExperiencia: "Ver experiencia",
    tituloExperiencia: "Experiencia Profesional",
    tituloHabilidades: "Habilidades Técnicas y Herramientas",
    tituloEducacion: "Educación",
    tituloCertificaciones: "Certificaciones",
    tituloProyectos: "Proyectos Destacados",
    tituloContacto: "Contacto",
    subContacto: "¿Tienes un incidente, un proyecto o una oportunidad? Envíame un mensaje.",
    titulo: "Alvaro Jose Neyra Sáenz | Analista de Soporte TI y Ciberseguridad",
    proyectos: [
      {
        nombre: "Recuperación tras Ransomware",
        descripcion:
          "Restablecí servicios críticos tras un incidente de ransomware, automatizando tareas con PowerShell y coordinando proveedores.",
        etiquetas: ["PowerShell", "Respuesta a incidentes", "Backup"],
      },
      {
        nombre: "Programa de Mejora de SLA",
        descripcion:
          "Incrementé 30% el cumplimiento de SLA y reduje 8 días la resolución de tickets en ServiceNow y Jira.",
        etiquetas: ["ServiceNow", "Jira", "ITIL"],
      },
      {
        nombre: "Evaluación de Controles de Seguridad",
        descripcion:
          "Evalué controles alineados a ISO/IEC 27001, NIST CSF y COBIT y di seguimiento a auditorías internas.",
        etiquetas: ["ISO 27001", "NIST CSF", "COBIT"],
      },
    ],
    experiencia: [
      {
        empresa: "UMAYUQ",
        periodo: "Abril 2026",
        rol: "Soporte en Operaciones de Ciberseguridad (por proyecto)",
        detalle: [
          "Restablecí operaciones empresariales críticas y la continuidad del negocio tras un ataque de ransomware, ejecutando planes de recuperación precisos (Microsoft Project) y coordinando a proveedores externos.",
          "Aceleré los tiempos de recuperación ante desastres con scripts de validación automatizados en PowerShell para rastrear rápidamente indicadores de compromiso y verificar la integridad de los sistemas.",
          "Aseguré la estabilidad posterior al incidente monitoreando los servidores restaurados y reforzando los controles de seguridad en la infraestructura corporativa.",
        ],
      },
      {
        empresa: "NOVU",
        periodo: "Abril 2025 – Enero 2026",
        rol: "Ingeniero de Soporte TI",
        detalle: [
          "Resolví incidentes de soporte técnico N1 y reduje en 8 días el tiempo promedio de resolución usando ServiceNow y Jira Service Management.",
          "Aumenté el cumplimiento de SLA en un 30% al agilizar los flujos de incidentes y optimizar la base de conocimiento con procedimientos de solución recurrentes.",
          "Optimicé la estabilidad de los equipos de los clientes manteniendo inventarios de hardware, licencias de software y permisos de acceso en múltiples entornos empresariales con Kaseya y Datto.",
        ],
      },
      {
        empresa: "EMIT LATAM",
        periodo: "Agosto 2024 – Enero 2025",
        rol: "Analista de Seguridad TI",
        detalle: [
          "Lideré el cierre sistemático de brechas de seguridad en varias auditorías internas por semana, alineando los controles técnicos con ISO/IEC 27001, NIST CSF y COBIT.",
          "Agilicé el seguimiento del cumplimiento diseñando e implementando políticas de seguridad proactivas que redujeron las métricas de vulnerabilidad interna.",
          "Coordiné esfuerzos de remediación de seguridad entre áreas, asegurando la recopilación rápida de evidencias y la alineación de las partes interesadas durante los ciclos de auditoría.",
        ],
      },
      {
        empresa: "AXUS ADVISORY GROUP",
        periodo: "Julio 2023 – Julio 2024",
        rol: "Analista SOC Nivel 1",
        detalle: [
          "Contuve amenazas activas en equipos antes de que se propagaran, usando monitoreo con AlienVault SIEM, Microsoft Defender y Cisco AMP.",
          "Analicé en tiempo real los registros de sistemas operativos y las anomalías de red para detectar intentos de acceso no autorizado y posibles brechas de seguridad.",
          "Realicé evaluaciones de vulnerabilidades y simulaciones de pruebas de penetración con Kali Linux, Nmap y Metasploit para reforzar las defensas de los sistemas.",
        ],
      },
    ],
    habilidades: [
      {
        titulo: "Soporte y Operaciones",
        items: [
          "Incidencias N1/N2",
          "ITIL",
          "SLA",
          "Base de conocimiento",
          "Inventario de equipos/licencias",
          "Backup y restauración",
        ],
      },
      {
        titulo: "Herramientas de Soporte",
        items: [
          "ServiceNow",
          "Jira Service Management",
          "Microsoft 365 (Exchange, Teams, SharePoint, OneDrive, Intune)",
          "TeamViewer",
          "AnyDesk",
          "Kaseya VSA",
          "Datto",
        ],
      },
      { titulo: "Redes y Sistemas", items: ["Windows Server", "Linux", "VPN", "TCP/IP", "LAN/WAN"] },
      {
        titulo: "Seguridad y Automatización",
        items: [
          "ISO/IEC 27001",
          "NIST CSF",
          "PowerShell",
          "Bash",
          "Python",
          "SQL",
          "Tenable",
          "AlienVault SIEM",
          "Microsoft Defender",
        ],
      },
    ],
    educacion: {
      titulo: "Bachiller en Ingeniería de Sistemas Computacionales",
      lugar: "Universidad Privada del Norte, 2022",
    },
    certificaciones: [],
    form: {
      nombre: "Nombre",
      correo: "Correo",
      mensaje: "Mensaje",
      enviar: "Enviar mensaje",
      errNombre: "Escribe tu nombre (mínimo 2 caracteres).",
      errCorreo: "Escribe un correo válido.",
      errMensaje: "Tu mensaje debe tener al menos 10 caracteres.",
      exito: "Se está abriendo tu app de correo con el mensaje listo para enviar.",
    },
    pie: "Todos los derechos reservados.",
    llamame: "Llámame",
    escribeme: "Escríbeme",
  },
};
