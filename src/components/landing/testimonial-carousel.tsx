"use client";

import { useEffect, useRef, useState } from "react";
import { Reveal } from "@/components/landing/reveal";

/**
 * TEXTO DE RELLENO: reemplaza estos testimonios por opiniones reales de tus
 * alumnos antes de publicar el sitio.
 */
const TESTIMONIALS = [
  {
    quote:
      "Poder ver mi avance por módulo me mantiene enganchada. Antes perdía el hilo entre clase y clase.",
    name: "Alumna de Marketing Digital",
    role: "Promoción 2026",
    initials: "MD",
  },
  {
    quote:
      "Subo el material una vez y queda ordenado por módulo. Revisar entregas dejó de ser un caos de correos.",
    name: "Docente de Diseño",
    role: "Área de Creatividad",
    initials: "DD",
  },
  {
    quote:
      "Las evaluaciones se califican solas y los alumnos ven su nota al instante. Nos ahorra horas por semana.",
    name: "Coordinación académica",
    role: "Instituto asociado",
    initials: "CA",
  },
  {
    quote:
      "Llevo el curso desde el celular en el bus. Retomo justo en la lección donde me quedé.",
    name: "Alumno de Programación",
    role: "Turno noche",
    initials: "AP",
  },
  {
    quote:
      "El panel de administración nos da en un vistazo cuántos alumnos activos y cursos en marcha tenemos.",
    name: "Dirección",
    role: "Academia de idiomas",
    initials: "DI",
  },
];

export function TestimonialCarousel() {
  // El índice avanza sobre una lista triplicada; al pasar del segundo bloque
  // retrocede un bloque sin transición, así el bucle no tiene costura visible.
  const [index, setIndex] = useState(TESTIMONIALS.length);
  const [animated, setAnimated] = useState(true);
  const [paused, setPaused] = useState(false);
  const total = TESTIMONIALS.length;
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (paused) return;
    timer.current = setInterval(() => setIndex((i) => i + 1), 3000);
    return () => {
      if (timer.current) clearInterval(timer.current);
    };
  }, [paused]);

  useEffect(() => {
    if (index >= total * 2 || index < total) {
      const id = setTimeout(() => {
        setAnimated(false);
        setIndex((i) => (i >= total * 2 ? i - total : i + total));
      }, 800);
      return () => clearTimeout(id);
    }
    if (!animated) {
      const id = requestAnimationFrame(() => setAnimated(true));
      return () => cancelAnimationFrame(id);
    }
  }, [index, total, animated]);

  const cards = [...TESTIMONIALS, ...TESTIMONIALS, ...TESTIMONIALS];

  return (
    <section className="w-full py-20">
      <div className="mb-10 px-6 md:ml-auto md:max-w-4xl">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <Reveal
            as="h2"
            delay={0.1}
            className="text-[32px] leading-[1.1] tracking-tight text-[#0D212C] md:text-[40px] lg:text-[44px]"
          >
            Lo que dicen <span className="font-accent">quienes enseñan</span>
          </Reveal>

          <Reveal delay={0.2} className="flex items-center gap-2">
            <div className="flex">
              {Array.from({ length: 5 }).map((_, i) => (
                <svg
                  key={i}
                  viewBox="0 0 24 24"
                  width="18"
                  height="18"
                  fill="black"
                  aria-hidden="true"
                >
                  <path d="m12 2 3.1 6.3 6.9 1-5 4.9 1.2 6.8L12 17.8 5.8 21l1.2-6.8-5-4.9 6.9-1z" />
                </svg>
              ))}
            </div>
            <span className="text-sm text-[#051A24]">Satisfacción 5/5</span>
          </Reveal>
        </div>
      </div>

      <div
        className="overflow-hidden px-6"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        <div
          className="flex gap-6"
          style={{
            transform: `translateX(calc(${-index} * (min(427.5px, 100vw - 48px) + 24px)))`,
            transition: animated
              ? "transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)"
              : "none",
          }}
        >
          {cards.map((t, i) => (
            <article
              key={i}
              className="w-[calc(100vw-48px)] shrink-0 rounded-[32px] bg-white px-6 py-8 shadow-[0_4px_16px_rgba(0,0,0,0.08)] md:w-[427.5px] md:rounded-[40px] md:pl-10 md:pr-16"
            >
              <svg
                viewBox="0 0 24 24"
                width="22"
                height="22"
                fill="none"
                stroke="#0D212C"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M10 11H6a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h3a1 1 0 0 1 1 1v7c0 2.2-1.8 4-4 4" />
                <path d="M19 11h-4a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h3a1 1 0 0 1 1 1v7c0 2.2-1.8 4-4 4" />
              </svg>

              <p className="mt-5 text-base leading-relaxed text-[#0D212C]">
                {t.quote}
              </p>

              <div className="mt-6 flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-violet-700 text-sm font-semibold text-white">
                  {t.initials}
                </div>
                <div>
                  <p className="text-sm font-semibold text-[#0D212C]">
                    {t.name}
                  </p>
                  <p className="text-sm text-[#051A24]/60">→ {t.role}</p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>

      <div className="mt-8 flex justify-center gap-3 px-6">
        <button
          type="button"
          aria-label="Testimonio anterior"
          onClick={() => setIndex((i) => i - 1)}
          className="flex h-12 w-12 items-center justify-center rounded-full border border-[#0D212C]/20 transition hover:bg-slate-50"
        >
          <svg
            viewBox="0 0 24 24"
            width="18"
            height="18"
            fill="none"
            stroke="#0D212C"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="m15 18-6-6 6-6" />
          </svg>
        </button>
        <button
          type="button"
          aria-label="Testimonio siguiente"
          onClick={() => setIndex((i) => i + 1)}
          className="flex h-12 w-12 items-center justify-center rounded-full border border-[#0D212C]/20 transition hover:bg-slate-50"
        >
          <svg
            viewBox="0 0 24 24"
            width="18"
            height="18"
            fill="none"
            stroke="#0D212C"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="m9 18 6-6-6-6" />
          </svg>
        </button>
      </div>
    </section>
  );
}
