import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { AvailableCourses } from "@/components/landing/available-courses";
import { BottomNav } from "@/components/landing/bottom-nav";
import { CourseMarquee } from "@/components/landing/course-marquee";
import { FeaturedCourses } from "@/components/landing/featured-courses";
import { LandingButton } from "@/components/landing/landing-button";
import { LandingFooter } from "@/components/landing/landing-footer";
import { LandingHeader } from "@/components/landing/landing-header";
import { PartnerSection } from "@/components/landing/partner-section";
import { PlansSection } from "@/components/landing/plans-section";
import { QuoteSection } from "@/components/landing/quote-section";
import { Reveal } from "@/components/landing/reveal";
import { TestimonialCarousel } from "@/components/landing/testimonial-carousel";

const ROLE_HOME: Record<string, string> = {
  ADMIN: "/admin",
  DOCENTE: "/docente",
  ALUMNO: "/alumno",
};

export default async function HomePage() {
  const session = await auth();
  if (session?.user?.role) {
    redirect(ROLE_HOME[session.user.role] ?? "/login");
  }

  return (
    <div className="w-full bg-white">
      <LandingHeader />

      {/* ---------- Hero ---------- */}
      <section className="mx-auto max-w-[480px] px-6 pt-14 text-center md:pt-20">
        <Reveal delay={0.1}>
          <span className="inline-flex items-center rounded-full bg-[#013C9A]/10 px-4 py-1.5 text-xs font-semibold text-[#013C9A] md:text-sm">
            Aula Virtual
          </span>
        </Reveal>

        <Reveal delay={0.2}>
          <h1 className="mt-5 text-[34px] font-bold leading-[1.15] tracking-tight text-[#0D212C] md:text-[44px] lg:text-[48px]">
            Aprende sin límites,
            <br />a tu propio ritmo.
          </h1>
        </Reveal>

        <Reveal delay={0.3}>
          <p className="mt-4 text-sm text-slate-500 md:text-base">
            La plataforma de formación en línea para instituciones, docentes
            y alumnos.
          </p>
        </Reveal>

        <Reveal delay={0.4}>
          <div className="mt-6 flex flex-col gap-4 text-left text-sm leading-relaxed text-slate-600 md:mt-8 md:text-base">
            <p>
              Cursos, clases en vivo y evaluaciones en un mismo lugar. Cada
              curso se organiza en módulos con videos, materiales y
              actividades: el avance de cada alumno se registra solo y los
              certificados se emiten al terminar.
            </p>
            <p className="font-semibold text-[#0D212C]">
              El acceso para alumnos matriculados no tiene costo.
            </p>
          </div>
        </Reveal>

        <Reveal delay={0.5}>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center md:mt-8 md:gap-4">
            <LandingButton href="/login">Iniciar sesión</LandingButton>
            <LandingButton href="/registro" variant="secondary">
              Crear cuenta
            </LandingButton>
          </div>
        </Reveal>
      </section>

      <AvailableCourses />
      <CourseMarquee />
      <QuoteSection />
      <PlansSection />
      <TestimonialCarousel />
      <FeaturedCourses />
      <PartnerSection />
      <LandingFooter />
      <BottomNav />
    </div>
  );
}
