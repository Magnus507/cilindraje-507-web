"use client";

import AppLayout from "@/components/AppLayout";
import { Shield } from "lucide-react";

export default function FaccionPage() {
  return (
    <AppLayout>
      <div className="card p-8 flex flex-col items-center justify-center min-h-[60vh] text-center">
        <Shield className="w-16 h-16 text-accent mb-4" />
        <h1 className="text-3xl font-bold text-white mb-2">Tu Facción</h1>
        <p className="text-muted">Centro de mando de facción en construcción.</p>
      </div>
    </AppLayout>
  );
}
