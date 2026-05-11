"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import AppLayout from "@/components/AppLayout";
import { Loader2, ShieldAlert } from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [authorized, setAuthorized] = useState<boolean | null>(null);
  const router = useRouter();

  useEffect(() => {
    async function checkAdmin() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push("/login");
        return;
      }

      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", session.user.id)
        .single();

      if (profile?.role === "admin") {
        setAuthorized(true);
      } else {
        setAuthorized(false);
      }
    }
    checkAdmin();
  }, [router]);

  if (authorized === null) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center h-[60vh]">
          <Loader2 className="w-10 h-10 animate-spin text-primary" />
        </div>
      </AppLayout>
    );
  }

  if (authorized === false) {
    return (
      <AppLayout>
        <div className="flex flex-col items-center justify-center h-[60vh] space-y-4 text-center">
          <div className="p-6 bg-destructive/10 rounded-full border border-destructive/20 text-destructive shadow-[0_0_50px_rgba(239,68,68,0.2)]">
            <ShieldAlert className="w-16 h-16" />
          </div>
          <h1 className="text-3xl font-black text-white uppercase italic">Acceso Denegado</h1>
          <p className="text-muted text-sm max-w-md uppercase font-mono tracking-widest">
            Tus credenciales no tienen autorización de nivel OVERSEER. El mando central ha sido notificado.
          </p>
          <button 
            onClick={() => router.push("/dashboard")}
            className="px-8 py-3 bg-white text-black font-black text-xs uppercase rounded-xl hover:bg-primary transition-all shadow-xl"
          >
            Volver al Cuartel
          </button>
        </div>
      </AppLayout>
    );
  }

  return <AppLayout>{children}</AppLayout>;
}
