"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import Link from "next/link";
import dynamic from "next/dynamic";
import { User, Flame, MapPin, ScanLine, ShoppingBag, CalendarDays, Target,
  Trophy, Shield, Wrench, Medal, Clock, Zap, Star, ChevronRight, Activity, TrendingUp, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";

const TacticalMap = dynamic(() => import("@/components/TacticalMap"), { 
  ssr: false,
  loading: () => <div className="w-full h-full bg-surface-light animate-pulse rounded-xl" />
});

export default function DashboardPage() {
  const [profile, setProfile] = useState<any>(null);
  const [topRiders, setTopRiders] = useState<any[]>([]);
  const [scanCount, setScanCount] = useState(0);
  const [stickers, setStickers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function load() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { router.push("/login"); return; }

      const { data: p } = await supabase.from("profiles").select("*, factions(name, color_hex)").eq("id", session.user.id).single();
      setProfile(p);

      const { count } = await supabase.from("scans").select("*", { count: "exact", head: true }).eq("user_id", session.user.id);
      setScanCount(count || 0);

      const { data: riders } = await supabase.from("profiles").select("username, total_points, factions(name)").order("total_points", { ascending: false }).limit(5);
      setTopRiders(riders || []);

      const { data: st } = await supabase.from("stickers").select("*").eq("is_active", true);
      setStickers(st || []);

      setLoading(false);
    }
    load();
  }, [router]);

  if (loading) return <div className="flex items-center justify-center h-full"><div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" /></div>;

  const userLevel = Math.floor((profile?.total_points || 0) / 500) + 1;
  const xpInLevel = (profile?.total_points || 0) % 500;
  const xpNeeded = 500;

  return (
    <div className="space-y-6 pb-12">
      {/* ═══ Header Estilo Juego ═══ */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-black text-white italic tracking-tighter uppercase">Cuartel General</h1>
          <p className="text-xs text-muted font-mono tracking-[0.3em] uppercase mt-1">Sincronización de Red Táctica v2.4</p>
        </div>
        <div className="flex gap-4">
          <div className="card-inner px-6 py-2 flex flex-col items-end">
            <p className="text-[9px] text-muted uppercase font-bold">Temporada Actual</p>
            <p className="text-sm font-black text-primary">NIGHT RIDERS '24</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Left Column: Player Stats & Quick Actions */}
        <div className="col-span-4 space-y-6">
          {/* Player Card (NFS Style) */}
          <motion.div 
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="card p-6 bg-gradient-to-br from-surface to-surface-light border-primary/30 relative overflow-hidden group"
          >
            <div className="absolute -right-4 -bottom-4 w-32 h-32 bg-primary/10 rounded-full blur-3xl group-hover:bg-primary/20 transition-all" />
            
            <div className="flex items-center gap-6 mb-8">
              <div className="relative">
                 <div className="w-20 h-20 rounded-full bg-surface-light border-4 border-border flex items-center justify-center shadow-xl">
                  <User className="w-10 h-10 text-muted" />
                </div>
                <div className="absolute -bottom-2 -right-2 w-10 h-10 rounded-full bg-primary text-black text-sm font-black flex items-center justify-center border-4 border-surface shadow-lg">{userLevel}</div>
              </div>
              <div>
                <h2 className="text-2xl font-black text-white italic uppercase tracking-tight leading-none">{profile?.username}</h2>
                <p className="text-[10px] text-accent font-bold uppercase mt-2 flex items-center gap-1.5">
                   <Shield className="w-3 h-3" /> {profile?.factions?.name || "Sin Facción"}
                </p>
              </div>
            </div>

            <div className="space-y-4 relative z-10">
              <div>
                <div className="flex justify-between text-[10px] font-black uppercase mb-1.5">
                  <span className="text-muted">Progreso de Rango</span>
                  <span className="text-primary">{xpInLevel} / {xpNeeded} XP</span>
                </div>
                <div className="progress-bar h-2 shadow-inner">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${(xpInLevel / xpNeeded) * 100}%` }}
                    className="progress-bar-fill h-full shadow-[0_0_10px_rgba(245,158,11,0.5)]" 
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4">
                <div className="p-3 bg-surface rounded-xl border border-border">
                  <p className="text-[9px] text-muted uppercase font-bold">Reputación</p>
                  <p className="text-lg font-black text-white italic">{(profile?.total_points || 0).toLocaleString()}</p>
                </div>
                <div className="p-3 bg-surface rounded-xl border border-border">
                   <p className="text-[9px] text-muted uppercase font-bold">Escaneos</p>
                   <p className="text-lg font-black text-white italic">{scanCount}</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Quick Actions Grid */}
          <div className="grid grid-cols-2 gap-4">
            <Link href="/escanear" className="col-span-2">
              <button className="w-full py-6 bg-primary text-black font-black text-sm uppercase italic rounded-2xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 shadow-[0_10px_30px_rgba(245,158,11,0.2)]">
                <ScanLine className="w-6 h-6" /> Escanear Nodo
              </button>
            </Link>
            <Link href="/misiones/proponer">
              <button className="w-full py-4 bg-surface-light border border-border text-white text-[10px] font-black uppercase italic rounded-xl hover:border-primary/50 transition-all flex flex-col items-center gap-2">
                <MapPin className="w-5 h-5 text-primary" /> Sugerir Punto
              </button>
            </Link>
            <Link href="/ranking">
              <button className="w-full py-4 bg-surface-light border border-border text-white text-[10px] font-black uppercase italic rounded-xl hover:border-primary/50 transition-all flex flex-col items-center gap-2">
                <Trophy className="w-5 h-5 text-primary" /> Rankings
              </button>
            </Link>
          </div>

          {/* Activity Feed / Notifications */}
          <div className="card p-5 space-y-4">
            <h3 className="text-[10px] font-black text-white uppercase tracking-widest flex items-center gap-2">
              <Activity className="w-3.5 h-3.5 text-primary" /> Actividad Reciente
            </h3>
            <div className="space-y-3">
              <div className="flex gap-3 items-start border-l-2 border-primary pl-3 py-1">
                <div className="text-[10px] font-bold text-white uppercase">Misión Completada: <span className="text-primary italic">"Check-in Campana"</span></div>
                <span className="text-[9px] text-muted ml-auto">2h</span>
              </div>
              <div className="flex gap-3 items-start border-l-2 border-border pl-3 py-1 opacity-50">
                <div className="text-[10px] font-bold text-muted uppercase">Punto propuesto enviado a revisión</div>
                <span className="text-[9px] text-muted ml-auto">5h</span>
              </div>
            </div>
          </div>
        </div>

        {/* Center/Right Column: Tactical Map & Rankings */}
        <div className="col-span-8 space-y-6">
          {/* Main Map */}
          <div className="card p-2 relative group overflow-hidden border-primary/20">
            <div className="absolute top-4 left-4 z-10">
               <div className="glass-panel px-4 py-2 rounded-lg border border-white/10 flex items-center gap-2">
                <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                <span className="text-[9px] text-white font-black uppercase tracking-widest">Radar Panamá Activo</span>
              </div>
            </div>
            <div className="relative w-full h-[480px] bg-surface-light rounded-2xl overflow-hidden border border-border/50">
              <TacticalMap stickers={stickers} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            {/* Real-time Rankings */}
            <div className="card p-6">
               <div className="flex items-center justify-between mb-6">
                <h3 className="text-sm font-black text-white uppercase italic flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-primary" /> Top Elite Riders
                </h3>
                <Link href="/ranking" className="text-[9px] text-primary font-bold uppercase hover:underline">Ver Todos</Link>
              </div>
              <div className="space-y-4">
                {topRiders.map((r, i) => (
                  <div key={i} className="flex items-center gap-4 group">
                    <span className={`w-6 h-6 rounded bg-surface-light flex items-center justify-center text-[10px] font-black ${i === 0 ? 'text-primary' : 'text-muted'}`}>{i + 1}</span>
                    <div className="flex-1">
                       <p className="text-xs font-bold text-white uppercase group-hover:text-primary transition-colors">{r.username}</p>
                       <p className="text-[9px] text-muted uppercase font-mono">{r.factions?.name || "Lobo Solitario"}</p>
                    </div>
                    <p className="text-sm font-black text-white italic">{(r.total_points || 0).toLocaleString()}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Garage Status */}
            <div className="card p-6 flex flex-col justify-between relative overflow-hidden">
               <Wrench className="absolute -right-8 -bottom-8 w-32 h-32 text-white/5 -rotate-12" />
               <div>
                <h3 className="text-sm font-black text-white uppercase italic mb-6">Estado de la Máquina</h3>
                <div className="flex items-center gap-6">
                  <div className="p-5 bg-surface-light rounded-2xl border border-border shadow-inner">
                    <Wrench className="w-10 h-10 text-muted" />
                  </div>
                  <div>
                    <p className="text-xs font-black text-white uppercase italic tracking-tight">{profile?.motorcycle_model || "Sin Máquina"}</p>
                    <p className="text-[9px] text-primary font-bold uppercase mt-1">Configuración Operativa</p>
                  </div>
                </div>
              </div>
              <Link href="/garaje">
                <button className="w-full mt-8 py-3 bg-surface-light border border-border text-[10px] text-white font-black uppercase rounded-xl hover:bg-white hover:text-black transition-all">Administrar Garaje</button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
