"use client";

import AppLayout from "@/components/AppLayout";
import { Wrench } from "lucide-react";

export default function GarajePage() {
  return (
    <AppLayout>
      <div className="card p-8 flex flex-col items-center justify-center min-h-[60vh] text-center">
        <Wrench className="w-16 h-16 text-muted mb-4" />
        <h1 className="text-3xl font-bold text-white mb-2">Garaje</h1>
        <p className="text-muted">Ajusta tu moto y mejora tus estadísticas próximamente.</p>
      </div>
    </AppLayout>
  );
}
