import Image from "next/image";
import Link from "next/link";

export function LandingHeader() {
  return (
    <header className="sticky top-0 z-40 flex items-center justify-between border-b border-slate-200 bg-white/95 px-4 py-2 backdrop-blur md:px-8">
      <div className="flex items-center gap-6">
        <Image
          src="/logo-academia-ruta360.jpg"
          alt="Academia Ruta 360"
          width={44}
          height={44}
          className="h-11 w-11 rounded-lg object-contain"
        />
        <Link
          href="/"
          className="border-b-2 border-[#013C9A] pb-3 -mb-3 text-sm font-medium text-[#013C9A]"
        >
          Página Principal
        </Link>
      </div>

      <Link
        href="/login"
        className="text-sm font-medium text-[#013C9A] underline-offset-4 hover:underline"
      >
        Acceder
      </Link>
    </header>
  );
}
