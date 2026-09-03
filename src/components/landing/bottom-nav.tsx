import { LandingButton } from "@/components/landing/landing-button";

export function BottomNav() {
  return (
    <nav className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2">
      <div className="shadow-btn-secondary flex items-center gap-4 rounded-full bg-white px-6 py-2">
        <span className="font-accent text-2xl font-semibold text-[#051A24]">
          AV
        </span>
        <LandingButton href="/login" className="px-6 py-2">
          Ingresar
        </LandingButton>
      </div>
    </nav>
  );
}
