/**
 * Cursos de muestra para las piezas visuales de la landing (marquee, destacados
 * y el rastro del cursor).
 *
 * Las fotos vienen de Unsplash, cuya licencia permite uso comercial gratuito
 * sin atribución obligatoria. Para producción conviene descargarlas y servirlas
 * desde el propio hosting en lugar de enlazar al CDN de Unsplash.
 */
export type CourseTile = {
  title: string;
  category: string;
  /** ID de la foto en Unsplash (parte «photo-...» de la URL). */
  photoId: string;
  alt: string;
};

/** Construye la URL de una foto de Unsplash con el recorte y peso indicados. */
export function unsplashUrl(photoId: string, width: number, height: number) {
  return `https://images.unsplash.com/${photoId}?w=${width}&h=${height}&q=70&auto=format&fit=crop`;
}

export const COURSE_TILES: CourseTile[] = [
  {
    title: "Marketing Digital",
    category: "Negocios",
    photoId: "photo-1517048676732-d65bc937f952",
    alt: "Equipo de trabajo reunido alrededor de una mesa",
  },
  {
    title: "Diseño Gráfico",
    category: "Creatividad",
    photoId: "photo-1611241893603-3c359704e0ee",
    alt: "Persona dibujando en una tableta gráfica",
  },
  {
    title: "Programación Web",
    category: "Tecnología",
    photoId: "photo-1515879218367-8466d910aaa4",
    alt: "Pantalla de computadora mostrando código",
  },
  {
    title: "Finanzas Personales",
    category: "Negocios",
    photoId: "photo-1554224155-6726b3ff858f",
    alt: "Persona revisando documentos con una calculadora",
  },
  {
    title: "Fotografía",
    category: "Creatividad",
    photoId: "photo-1542038784456-1ea8e935640e",
    alt: "Cámara fotográfica en las manos de una persona",
  },
  {
    title: "Inglés de Negocios",
    category: "Idiomas",
    photoId: "photo-1521737604893-d14cc237f11d",
    alt: "Personas conversando en una sala de reuniones",
  },
  {
    title: "Excel Avanzado",
    category: "Productividad",
    photoId: "photo-1460925895917-afdab827c52f",
    alt: "Laptop mostrando gráficos y hojas de cálculo",
  },
  {
    title: "Community Manager",
    category: "Negocios",
    photoId: "photo-1541746972996-4e0b0f43e02a",
    alt: "Grupo de personas trabajando en equipo",
  },
];
