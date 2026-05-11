"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { 
  Settings, PenTool as Tool, Gauge, Fuel, Zap, MapPin, 
  History, Shield, Package, ChevronRight, Award, Trophy,
  Star, Info, Camera, Share2
} from "lucide-react";
import { motion } from "framer-motion";

export default function GarajePage() {
  const [profile, setProfile] = useState<any>(null);
  const [scans, setScans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        const { data: p } = await supabase.from("profiles").select("*, factions(*)").eq("id", session.user.id).single();
        setProfile(p);

        const { data: sc } = await supabase
          .from("scans")
          .select("*, stickers(*)")
          .eq("user_id", session.user.id)
          .order("created_at", { ascending: false })
          .limit(5);
        setScans(sc || []);
      }
      setLoading(false);
    }
    load();
  }, []);

  if (loading) return <div className="flex items-center justify-center h-full"><Loader2 className="animate-spin text-primary w-12 h-12" /></div>;

  return (
    <div className="max-w-6xl mx-auto space-y-10 pb-20">
      <header className="flex items-end justify-between">
        <div className="space-y-2">
          <h1 className="text-5xl font-black text-white tracking-tighter uppercase italic leading-none">Mi Garaje</h1>
          <p className="text-muted text-sm font-mono tracking-widest uppercase">Centro de Mantenimiento y Personalización</p>
        </div>
        <div className="flex gap-4">
           <button className="p-3 bg-surface-light border border-border rounded-xl text-white hover:text-primary transition-all">
             <Share2 className="w-5 h-5" />
           </button>
           <button className="px-8 py-3 bg-primary text-black font-black text-xs uppercase rounded-xl hover:bg-white transition-all shadow-xl shadow-primary/20">
             Configurar Moto
           </button>
        </div>
      </header>

      <div className="grid grid-cols-12 gap-8">
        {/* Main Vehicle Inspection */}
        <div className="col-span-8 space-y-8">
          <div className="card p-0 overflow-hidden border-white/5 bg-gradient-to-br from-surface to-surface-light relative group">
            <div className="absolute top-0 left-0 w-full h-full bg-[url('https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&q=80&w=1200')] bg-cover bg-center opacity-20 grayscale group-hover:grayscale-0 transition-all duration-1000" />
            <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/80 to-transparent" />
            
            <div className="relative p-12 flex flex-col justify-between h-[500px]">
              <div className="flex justify-between items-start">
                 <div>
                   <span className="px-3 py-1 bg-primary text-black text-[10px] font-black rounded-full uppercase italic mb-4 inline-block">Vehículo Principal</span>
                   <h2 className="text-6xl font-black text-white uppercase italic tracking-tighter leading-none">{profile?.motorcycle_model || "NAVI 110"}</h2>
                   <p className="text-primary font-bold text-sm mt-2 uppercase tracking-widest">Sincronizado con Cuartel General</p>
                 </div>
                 <div className="text-right">
                    <p className="text-[10px] text-muted uppercase font-black tracking-widest">Estado del Motor</p>
                    <p className="text-2xl font-black text-success italic uppercase">Óptimo</p>
                 </div>
              </div>

              <div className="grid grid-cols-4 gap-6">
                {[
                  { label: "Ocupación", val: "100%", icon: <Shield className="w-4 h-4" /> },
                  { label: "Tanque", val: "85%", icon: <Fuel className="w-4 h-4" /> },
                  { label: "Nivel", val: "32", icon: <Star className="w-4 h-4" /> },
                  { label: "Rango", val: profile?.role || "RIDER", icon: <Award className="w-4 h-4" /> },
                ].map((stat, i) => (
                  <div key={i} className="bg-black/60 backdrop-blur-md p-4 rounded-2xl border border-white/10 flex flex-col gap-1">
                    <div className="text-primary opacity-50">{stat.icon}</div>
                    <p className="text-[9px] text-muted uppercase font-black mt-2 tracking-widest">{stat.label}</p>
                    <p className="text-xl font-black text-white uppercase italic">{stat.val}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8">
             {/* Performance Parts */}
             <div className="card p-8 space-y-6">
                <h3 className="text-sm font-black text-white uppercase italic tracking-widest flex items-center gap-2">
                  <Tool className="w-5 h-5 text-primary" /> Mejoras Instaladas
                </h3>
                <div className="space-y-3">
                  {[
                    { name: "Sincronizador Satelital", desc: "GPS de alta precisión (+5m)", active: true },
                    { name: "Blindaje de Datos", desc: "Anti-hackers de nivel 1", active: true },
                    { name: "Turbo Inyector XP", desc: "Multiplicador 1.1x en eventos", active: false },
                  ].map((part, i) => (
                    <div key={i} className={`p-4 rounded-xl border flex items-center justify-between ${part.active ? 'bg-primary/5 border-primary/20' : 'bg-surface border-border opacity-40'}`}>
                      <div>
                        <p className="text-[11px] font-black text-white uppercase">{part.name}</p>
                        <p className="text-[9px] text-muted uppercase mt-0.5">{part.desc}</p>
                      </div>
                      {part.active ? <Zap className="w-4 h-4 text-primary fill-primary" /> : <Settings className="w-4 h-4 text-muted" />}
                    </div>
                  ))}
                </div>
                <button className="w-full py-4 bg-surface-light border border-border text-white text-[10px] font-black uppercase rounded-xl hover:bg-white hover:text-black transition-all">
                  Visitar la Tienda de Partes
                </button>
             </div>

             {/* Recent Logs */}
             <div className="card p-8 space-y-6">
                <h3 className="text-sm font-black text-white uppercase italic tracking-widest flex items-center gap-2">
                  <History className="w-5 h-5 text-primary" /> Historial de Rodada
                </h3>
                <div className="space-y-4">
                   {scans.map((s, i) => (
                     <div key={i} className="flex items-center gap-4 group cursor-pointer">
                        <div className="w-10 h-10 bg-surface-light rounded-xl flex items-center justify-center border border-border group-hover:border-primary transition-all">
                          <MapPin className="w-5 h-5 text-muted group-hover:text-primary" />
                        </div>
                        <div className="flex-1">
                          <p className="text-xs font-bold text-white uppercase tracking-tight group-hover:text-primary transition-all">{s.stickers?.name}</p>
                          <p className="text-[10px] text-muted uppercase font-mono">{new Date(s.created_at).toLocaleDateString()} • +{s.stickers?.points_value} XP</p>
                        </div>
                     </div>
                   ))}
                   {scans.length === 0 && <p className="text-xs text-muted italic text-center py-10">No hay registros de rodadas recientes.</p>}
                </div>
                <button className="w-full py-4 bg-surface-light border border-border text-white text-[10px] font-black uppercase rounded-xl hover:bg-white hover:text-black transition-all">
                  Ver Todo el Historial
                </button>
             </div>
          </div>
        </div>

        {/* Sidebar Stats */}
        <div className="col-span-4 space-y-8">
           <div className="card p-8 bg-gradient-to-b from-primary/10 to-surface border-primary/20 relative overflow-hidden shadow-2xl">
              <div className="absolute top-0 right-0 p-4">
                <Trophy className="w-24 h-24 text-primary/5 -rotate-12 absolute -top-4 -right-4" />
              </div>
              <p className="text-[10px] text-primary font-black uppercase tracking-[0.2em] mb-1 italic">Rango de Piloto</p>
              <h3 className="text-4xl font-black text-white uppercase italic tracking-tighter mb-6">{profile?.role === 'admin' ? 'CAPITÁN' : 'EXPLORADOR'}</h3>
              
              <div className="space-y-5">
                 <div className="space-y-2">
                    <div className="flex justify-between items-end">
                       <span className="text-[9px] text-muted uppercase font-black">Nivel 32 - Progreso</span>
                       <span className="text-xs font-black text-white">7,850 / 10,000 XP</span>
                    </div>
                    <div className="w-full h-2 bg-surface-light rounded-full overflow-hidden border border-white/5">
                       <div className="h-full bg-primary shadow-[0_0_15px_rgba(245,158,11,0.5)] w-[78.5%]" />
                    </div>
                 </div>

                 <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/5">
                    <div>
                       <p className="text-[9px] text-muted uppercase font-black mb-1">Reputación</p>
                       <p className="text-xl font-black text-white italic">{(profile?.total_points || 0).toLocaleString()} XP</p>
                    </div>
                    <div>
                       <p className="text-[9px] text-muted uppercase font-black mb-1">Facción</p>
                       <p className="text-xl font-black text-white italic">{profile?.factions?.name || "NINGUNA"}</p>
                    </div>
                 </div>
              </div>
           </div>

           <div className="card p-8 space-y-6">
              <h3 className="text-sm font-black text-white uppercase italic tracking-widest">Logros Destacados</h3>
              <div className="grid grid-cols-3 gap-3">
                 {[1, 2, 3, 4, 5, 6].map(i => (
                   <div key={i} className="aspect-square bg-surface-light rounded-xl border border-white/5 flex items-center justify-center grayscale hover:grayscale-0 hover:border-primary transition-all cursor-help relative group">
                      <Award className={`w-6 h-6 ${i <= 3 ? 'text-primary' : 'text-muted/30'}`} />
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 p-2 bg-black text-[8px] text-white uppercase font-black rounded border border-border opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50">
                        {i <= 3 ? "Logro Desbloqueado" : "Bloqueado"}
                      </div>
                   </div>
                 ))}
              </div>
           </div>

           <div className="card p-8 bg-surface-light border-white/10 space-y-4">
              <div className="flex items-center gap-3 text-primary">
                 <Info className="w-5 h-5" />
                 <h3 className="text-[10px] font-black uppercase tracking-widest">Información Táctica</h3>
              </div>
              <p className="text-[10px] text-muted uppercase leading-relaxed font-medium">
                Tu garaje es tu zona segura. Aquí puedes configurar tu vehículo principal para que sea reconocido por los radares de las facciones rivales. Mantén tu motor al 100% para ganar bonus de XP por distancia recorrida.
              </p>
           </div>
        </div>
      </div>
    </div>
  );
}

function Loader2(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
  );
}
