"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import AppLayout from "@/components/AppLayout";
import { Medal, Trophy, Star, Zap, Map, Loader2, Lock, CheckCircle2 } from "lucide-react";

export default function LogrosPage() {
  const [profile, setProfile] = useState<any>(null);
  const [scanCount, setScanCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;
      const { data: p } = await supabase.from("profiles").select("*").eq("id", session.user.id).single();
      setProfile(p);
      const { count } = await supabase.from("scans").select("*", { count: "exact", head: true }).eq("user_id", session.user.id);
      setScanCount(count || 0);
      setLoading(false);
    }
    load();
  }, []);

  const achievements = [
    { id: 1, title: "Primer Contacto", desc: "Escanea tu primer nodo QR", req: 1, current: scanCount, icon: <Zap className="w-5 h-5" /> },
    { id: 2, title: "Explorador", desc: "Escanea 10 nodos QR", req: 10, current: scanCount, icon: <Map className="w-5 h-5" /> },
    { id: 3, title: "Veterano", desc: "Escanea 50 nodos QR", req: 50, current: scanCount, icon: <Trophy className="w-5 h-5" /> },
    { id: 4, title: "Leyenda del Asfalto", desc: "Escanea 100 nodos QR", req: 100, current: scanCount, icon: <Star className="w-5 h-5" /> },
    { id: 5, title: "Cazador de Puntos", desc: "Llega a 5,000 puntos", req: 5000, current: profile?.total_points || 0, icon: <Medal className="w-5 h-5" /> },
    { id: 6, title: "Maestro del Cilindraje", desc: "Llega a 25,000 puntos", req: 25000, current: profile?.total_points || 0, icon: <ShieldCheck className="w-5 h-5" /> },
  ];

  if (loading) return <AppLayout><div className="flex items-center justify-center h-full"><Loader2 className="animate-spin text-primary" /></div></AppLayout>;

  return (
    <AppLayout>
      <div className="max-w-5xl mx-auto space-y-8">
        <header>
          <h1 className="text-3xl font-black text-white tracking-tight uppercase italic">Logros y Condecoraciones</h1>
          <p className="text-muted text-sm font-mono tracking-widest uppercase">Historial de Hazañas en la Carretera</p>
        </header>

        <div className="grid grid-cols-3 gap-6">
          {achievements.map((ach) => {
            const isUnlocked = ach.current >= ach.req;
            const progress = Math.min(100, (ach.current / ach.req) * 100);

            return (
              <div key={ach.id} className={`card p-6 relative overflow-hidden transition-all ${isUnlocked ? "border-primary/40 bg-primary/5" : "opacity-70"}`}>
                {isUnlocked && <div className="absolute top-2 right-2"><CheckCircle2 className="w-5 h-5 text-primary" /></div>}
                {!isUnlocked && <div className="absolute top-2 right-2"><Lock className="w-4 h-4 text-muted" /></div>}
                
                <div className={`w-12 h-12 rounded-xl mb-4 flex items-center justify-center ${isUnlocked ? "bg-primary text-black" : "bg-surface-light text-muted"}`}>
                  {ach.icon}
                </div>
                
                <h3 className={`font-black uppercase italic ${isUnlocked ? "text-white" : "text-muted"}`}>{ach.title}</h3>
                <p className="text-[10px] text-muted mt-1 uppercase tracking-wider">{ach.desc}</p>
                
                <div className="mt-6 space-y-2">
                  <div className="flex justify-between text-[10px] font-bold uppercase font-mono">
                    <span className="text-muted">Progreso</span>
                    <span className={isUnlocked ? "text-primary" : "text-muted"}>{ach.current} / {ach.req}</span>
                  </div>
                  <div className="progress-bar h-1.5">
                    <div className={`progress-bar-fill h-full transition-all duration-1000 ${!isUnlocked && "bg-muted/50"}`} style={{ width: `${progress}%`, background: isUnlocked ? undefined : "#3f3f46" }} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </AppLayout>
  );
}

import { ShieldCheck } from "lucide-react";
