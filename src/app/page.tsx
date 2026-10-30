import Link from "next/link";
import {
  BudgetPiggy,
  ChatSection,
  ChecklistGame,
  CrewSection,
  DemoButton,
  FaqSection,
  FinalCta,
  Hero,
  InviteSection,
  LandingShell,
  PlanSection,
  PricingSection,
  StatsSection,
  Ticker,
} from "@/components/landing/sections";
import { Heart } from "@/components/landing/characters";
import { APP_NAME } from "@/lib/brand";

export default function LandingPage() {
  return (
    <LandingShell>
      <div className="overflow-x-clip bg-cream font-sans">
        <header className="fixed inset-x-3 top-3 z-40 mx-auto max-w-6xl">
          <div className="sticker-sm flex items-center justify-between rounded-full bg-white/95 py-2 pr-2 pl-4 backdrop-blur">
            <Link href="/" className="flex items-center gap-2 font-cute text-lg font-semibold text-plum sm:text-xl">
              <Heart className="w-6 animate-[wiggle_1.6s_ease-in-out_infinite]" />
              {APP_NAME}
            </Link>
            <nav className="hidden items-center gap-6 font-cute text-base font-medium text-plum md:flex">
              <a href="#cara-kerja" className="hover:text-primary">
                Cara kerja
              </a>
              <a href="#undangan" className="hover:text-primary">
                Undangan
              </a>
              <a href="#harga" className="hover:text-primary">
                Harga
              </a>
              <a href="#faq" className="hover:text-primary">
                FAQ
              </a>
            </nav>
            <div className="flex items-center gap-3">
              <DemoButton className="hidden font-cute text-base font-medium text-plum sm:block">Demo</DemoButton>
              <Link href="/onboarding" className="rounded-full border-[2.5px] border-plum bg-candy-pink px-4 py-1.5 font-cute text-base font-semibold text-plum transition hover:bg-candy-yellow">
                Mulai gratis
              </Link>
            </div>
          </div>
        </header>

        <Hero />
        <PlanSection />
        <Ticker />
        <ChatSection />
        <ChecklistGame />
        <BudgetPiggy />
        <InviteSection />
        <CrewSection />
        <StatsSection />
        <PricingSection />
        <FaqSection />
        <FinalCta />

        <footer className="border-t-[3px] border-plum bg-white py-6 text-center">
          <p className="font-cute text-lg font-semibold text-plum">{APP_NAME}</p>
          <p className="text-xs font-medium text-plum/60">Prototipe</p>
        </footer>
      </div>
    </LandingShell>
  );
}
