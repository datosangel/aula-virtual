import Image from "next/image";
import { Reveal } from "@/components/landing/reveal";
import { unsplashUrl } from "@/components/landing/course-tiles";

const FEATURED = [
  {
    title: "Marketing Digital",
    description:
      "De cero a tu primera campaña: estrategia, contenidos y publicidad online.",
    photoId: "photo-1517048676732-d65bc937f952",
    alt: "Equipo de marketing trabajando en una reunión",
  },
  {
    title: "Programación Web",
    description:
      "Fundamentos de HTML, CSS y JavaScript con proyectos evaluados por tu docente.",
    photoId: "photo-1607799279861-4dd421887fb3",
    alt: "Pantalla de portátil mostrando código de colores",
  },
  {
    title: "Diseño Gráfico",
    description:
      "Composición, color y tipografía aplicados a piezas reales de portafolio.",
    photoId: "photo-1487338875411-8880f74114a2",
    alt: "Estación de trabajo de diseño con dos monitores",
  },
];

export function FeaturedCourses() {
  return (
    <section id="cursos" className="mx-auto max-w-[1200px] px-6 py-12">
      <div className="flex flex-col gap-16 md:gap-20">
        {FEATURED.map((course, i) => (
          <Reveal key={course.title} delay={0.1 * (i + 1)}>
            <div className="ml-20 md:ml-28">
              <h3 className="font-accent text-2xl font-semibold text-[#051A24] md:text-3xl">
                {course.title}
              </h3>
              <p className="mt-1 text-sm text-[#051A24]/70 md:text-base">
                {course.description}
              </p>
            </div>

            <div className="relative mt-6 h-56 w-full overflow-hidden rounded-2xl shadow-lg md:h-80">
              <Image
                src={unsplashUrl(course.photoId, 1400, 700)}
                alt={course.alt}
                fill
                sizes="(max-width: 768px) 100vw, 1200px"
                className="object-cover"
              />
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
