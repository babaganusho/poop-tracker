"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { usePunned } from "@/lib/use-punned";

export default function BottomNav() {
  const pathname = usePathname();
  const profileLabel = usePunned("profileLabel");
  const logLabel = usePunned("logLabel");
  const compareLabel = usePunned("compareLabel");

  const TABS = [
    { href: "/", label: profileLabel, emoji: "💩" },
    { href: "/log", label: logLabel, emoji: "➕" },
    { href: "/compare", label: compareLabel, emoji: "🏆" },
  ];

  return (
    <nav className="fixed inset-x-0 bottom-0 z-10 border-t border-stone-200 bg-white/95 backdrop-blur pb-[env(safe-area-inset-bottom)]">
      <div className="mx-auto flex max-w-md">
        {TABS.map((tab) => {
          const active = pathname === tab.href;
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`flex flex-1 flex-col items-center gap-0.5 py-2.5 text-xs font-medium ${
                active ? "text-amber-800" : "text-stone-400"
              }`}
            >
              <span className={`text-xl leading-none ${active ? "" : "opacity-60"}`}>{tab.emoji}</span>
              {tab.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
