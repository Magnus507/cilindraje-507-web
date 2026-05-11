"use client";

import { Trophy, ChevronRight } from "lucide-react";

export default function TopBar() {
  return (
    <header className="h-14 bg-surface border-b border-border flex items-center justify-between px-6 sticky top-0 z-30">
      {/* Season Progress */}
      <div className="flex items-center gap-4 flex-1">
        <div className="flex items-center gap-3 px-4 py-1.5 card-inner">
          <Trophy className="w-4 h-4 text-primary" />
          <div>
            <p className="text-[10px] font-bold text-primary uppercase tracking-wider">Temporada 1</p>
            <p className="text-[9px] text-muted uppercase">« La Guerra por las Provincias »</p>
          </div>
        </div>
        <div className="flex-1 max-w-md">
          <div className="progress-bar h-2">
            <div className="progress-bar-fill h-full" style={{ width: "65%" }} />
          </div>
        </div>
        <span className="text-xs text-muted font-mono">80 días restantes</span>
      </div>

      {/* User Quick Access */}
      <div className="flex items-center gap-4">
        <button className="relative p-2 text-muted hover:text-white transition-colors">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
          <span className="absolute top-1 right-1 w-2 h-2 bg-destructive rounded-full" />
        </button>
        <button className="p-2 text-muted hover:text-white transition-colors">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
        </button>
        <div className="flex items-center gap-3 pl-4 border-l border-border">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-amber-600 flex items-center justify-center text-black font-bold text-sm">
            RA
          </div>
          <div className="text-right">
            <p className="text-sm font-bold text-white">RIDER_ALPHA</p>
            <p className="text-[10px] text-muted">Nivel 32</p>
          </div>
          <ChevronRight className="w-4 h-4 text-muted" />
        </div>
      </div>
    </header>
  );
}
