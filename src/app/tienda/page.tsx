"use client";

import AppLayout from "@/components/AppLayout";
import { ShoppingBag } from "lucide-react";

export default function TiendaPage() {
  return (
    <AppLayout>
      <div className="card p-8 flex flex-col items-center justify-center min-h-[60vh] text-center">
        <ShoppingBag className="w-16 h-16 text-success mb-4" />
        <h1 className="text-3xl font-bold text-white mb-2">Tienda de Recompensas</h1>
        <p className="text-muted">Intercambia tus puntos por mercancía oficial muy pronto.</p>
      </div>
    </AppLayout>
  );
}
