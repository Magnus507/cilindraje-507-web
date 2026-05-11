"use client";

import AppLayout from "@/components/AppLayout";
import { Target } from "lucide-react";

export default function MisionesPage() {
  return (
    <AppLayout>
      <div className="card p-8 flex flex-col items-center justify-center min-h-[60vh] text-center">
        <Target className="w-16 h-16 text-primary mb-4" />
        <h1 className="text-3xl font-bold text-white mb-2">Misiones</h1>
        <p className="text-muted">Las nuevas misiones de temporada estarán disponibles pronto.</p>
      </div>
    </AppLayout>
  );
}
