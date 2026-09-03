import Link from "next/link";
import { LandingButton } from "@/components/landing/landing-button";

const LINKS = [
  [
    { label: "Cursos", href: "#cursos" },
    { label: "Planes", href: "#planes" },
    { label: "Ingresar", href: "/login" },
  ],
  [
    { label: "Crear cuenta", href: "/registro" },
    { label: "Recuperar acceso", href: "/recuperar-password" },
  ],
];

export function LandingFooter() {
  return (
    <>
      <footer className="mx-auto w-full max-w-[1200px] px-6 py-12">
        <div className="flex flex-col gap-10 md:flex-row md:items-start md:justify-between">
          <LandingButton href="/registro">Crear mi cuenta</LandingButton>

          <div className="flex gap-8">
            <svg
              viewBox="0 0 24 24"
              width="20"
              height="20"
              fill="none"
              stroke="#051A24"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="mt-1 shrink-0"
              aria-hidden="true"
            >
              <path d="M7 17 17 7M7 7h10v10" />
            </svg>

            {LINKS.map((column, i) => (
              <ul key={i} className="flex flex-col gap-2">
                {column.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-base text-[#051A24] transition hover:opacity-70"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            ))}
          </div>
        </div>
      </footer>

      <div className="mx-auto w-full max-w-[1200px] px-6 py-4 pb-28">
        <div className="flex justify-between text-sm text-[#051A24]">
          <span>Aula Virtual</span>
          <span>Perú</span>
        </div>
      </div>
    </>
  );
}
