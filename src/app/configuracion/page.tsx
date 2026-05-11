"use client";

import AppLayout from "@/components/AppLayout";
import { Settings } from "lucide-react";

export default function ConfiguracionPage() {
  return (
    <AppLayout>
      <div className="card p-8 flex flex-col items-center justify-center min-h-[60vh] text-center">
        <Settings className="w-16 h-16 text-muted mb-4" />
        <h1 className="text-3xl font-bold text-white mb-2">Configuración</h1>
        <p className="text-muted">Ajustes de cuenta y preferencias en desarrollo.</p>
      </div>
    </AppLayout>
  );
}
