"use client";

import AppLayout from "@/components/AppLayout";
import { CalendarDays } from "lucide-react";

export default function EventosPage() {
  return (
    <AppLayout>
      <div className="card p-8 flex flex-col items-center justify-center min-h-[60vh] text-center">
        <CalendarDays className="w-16 h-16 text-accent mb-4" />
        <h1 className="text-3xl font-bold text-white mb-2">Eventos Especiales</h1>
        <p className="text-muted">Prepárate para la Rodada Nacional.</p>
      </div>
    </AppLayout>
  );
}
