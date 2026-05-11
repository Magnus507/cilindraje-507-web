"use client";

import AppLayout from "@/components/AppLayout";
import { Medal } from "lucide-react";

export default function LogrosPage() {
  return (
    <AppLayout>
      <div className="card p-8 flex flex-col items-center justify-center min-h-[60vh] text-center">
        <Medal className="w-16 h-16 text-primary mb-4" />
        <h1 className="text-3xl font-bold text-white mb-2">Logros</h1>
        <p className="text-muted">Desbloquea logros escaneando nodos en todo el país.</p>
      </div>
    </AppLayout>
  );
}
