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
      <section className="mx-auto max-w-[440px] px-6 pt-12 text-center md:pt-16">
        <Reveal delay={0.1}>
          <p className="font-accent mb-4 text-[32px] font-semibold tracking-tight text-[#051A24] md:text-[40px] lg:text-[44px]">
            Aula Virtual
          </p>
        </Reveal>

        <Reveal delay={0.2}>
          <p className="mb-2 font-mono text-xs text-[#051A24] md:text-sm">
            La plataforma de formación en línea
          </p>
        </Reveal>

        <Reveal delay={0.3}>
          <h1 className="text-[32px] leading-[1.1] tracking-tight text-[#0D212C] md:text-[40px] lg:text-[44px]">
            Aprende <span className="font-accent">sin límites,</span>
            <br />a tu <span className="font-accent">propio ritmo.</span>
          </h1>
        </Reveal>

        <Reveal delay={0.4}>
          <div className="mt-5 flex flex-col gap-6 text-left text-sm leading-relaxed text-[#051A24] md:mt-6 md:text-base">
            <p>
              Cursos, clases en vivo y evaluaciones en un mismo lugar. Pensado
              para que instituciones, docentes y alumnos trabajen sin fricción.
            </p>
            <p>
              Cada curso se organiza en módulos con videos, materiales y
              actividades. El avance de cada alumno se registra solo, y los
              certificados se emiten al terminar.
            </p>
            <p>El acceso para alumnos matriculados no tiene costo.</p>
          </div>
        </Reveal>

        <Reveal delay={0.5}>
          <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:justify-center md:mt-6 md:gap-4">
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
