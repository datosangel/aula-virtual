import { LandingButton } from "@/components/landing/landing-button";
import { Reveal } from "@/components/landing/reveal";

export function PlansSection() {
  return (
    <section id="planes" className="w-full px-6 py-12">
      <div className="grid grid-cols-1 gap-8 md:ml-auto md:max-w-4xl md:grid-cols-2">
        <Reveal
          delay={0.1}
          className="rounded-[40px] bg-[#051A24] px-10 pb-10 pt-3 shadow-[inset_0_2px_20px_rgba(255,255,255,0.06)] md:pr-16"
        >
          <p className="mt-8 text-[22px] font-medium text-[#F6FCFF]">
            Para instituciones
          </p>
          <p className="mt-3 text-sm leading-relaxed text-[#E0EBF0]">
            Tu aula virtual completa: cursos, docentes,
            <br />
            evaluaciones y reportes de avance.
          </p>

          <p className="mt-8 text-2xl text-[#F6FCFF]">Personalizado</p>
          <p className="text-sm text-[#E0EBF0]">Según cantidad de alumnos</p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <LandingButton href="/registro" variant="tertiary">
              Solicitar demo
            </LandingButton>
            <LandingButton href="#cursos" variant="tertiary">
              Cómo funciona
            </LandingButton>
          </div>
        </Reveal>

        <Reveal
          delay={0.2}
          className="rounded-[40px] bg-white px-10 pb-10 pt-3 shadow-[0_4px_16px_rgba(0,0,0,0.08)] md:pr-16"
        >
          <p className="mt-8 text-[22px] font-medium text-[#0D212C]">
            Para alumnos
          </p>
          <p className="mt-3 text-sm leading-relaxed text-[#051A24]/70">
            Acceso a todos los cursos en los que
            <br />
            estés matriculado, con tu certificado.
          </p>

          <p className="mt-8 text-2xl text-[#0D212C]">Sin costo</p>
          <p className="text-sm text-[#051A24]/70">Incluido en tu matrícula</p>

          <div className="mt-8">
            <LandingButton href="/registro" variant="primary">
              Crear mi cuenta
            </LandingButton>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
