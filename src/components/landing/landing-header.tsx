import Link from "next/link";

export function LandingHeader() {
  return (
    <header className="sticky top-0 z-40 flex items-center justify-between border-b border-slate-200 bg-white/95 px-4 py-3 backdrop-blur md:px-8">
      <div className="flex items-center gap-6">
        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#0D212C] text-sm font-bold text-white">
          AV
        </span>
        <Link
          href="/"
          className="border-b-2 border-[#0D212C] pb-3 -mb-3 text-sm font-medium text-[#0D212C]"
        >
          Página Principal
        </Link>
      </div>

      <Link
        href="/login"
        className="text-sm font-medium text-[#0D212C] underline-offset-4 hover:underline"
      >
        Acceder
      </Link>
    </header>
  );
}
