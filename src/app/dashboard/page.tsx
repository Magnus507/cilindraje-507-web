"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import Link from "next/link";
import dynamic from "next/dynamic";
import { User, Flame, MapPin, ScanLine, ShoppingBag, CalendarDays, Target,
  Trophy, Shield, Wrench, Medal, Clock, Zap, Star, ChevronRight } from "lucide-react";

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

      // Profile
      const { data: p } = await supabase.from("profiles").select("*, factions(name, color_hex)").eq("id", session.user.id).single();
      setProfile(p);

      // Scan count for this user
      const { count } = await supabase.from("scans").select("*", { count: "exact", head: true }).eq("user_id", session.user.id);
      setScanCount(count || 0);

      // Top riders
      const { data: riders } = await supabase.from("profiles").select("username, total_points, factions(name)").order("total_points", { ascending: false }).limit(10);
      setTopRiders(riders || []);

      // Stickers for map
      const { data: st } = await supabase.from("stickers").select("*").eq("is_active", true);
      setStickers(st || []);

      setLoading(false);
    }
    load();
  }, [router]);

  if (loading) {
    return <div className="flex items-center justify-center h-full"><div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" /></div>;
  }

  const userLevel = Math.floor((profile?.total_points || 0) / 500) + 1;
  const xpInLevel = (profile?.total_points || 0) % 500;
  const xpNeeded = 500;

  return (
    <div className="space-y-6">

      {/* ═══ Player Card ═══ */}
      <div className="card p-5 flex flex-wrap items-center gap-6 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-primary via-amber-400 to-transparent" />
        <div className="relative flex-shrink-0">
          <div className="w-20 h-20 rounded-full bg-surface-light border-2 border-border flex items-center justify-center">
            <User className="w-10 h-10 text-muted" />
          </div>
          <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-primary text-black text-xs font-black flex items-center justify-center border-2 border-surface">{userLevel}</div>
        </div>
        <div className="flex-1 min-w-[160px]">
          <h2 className="text-xl font-black text-white tracking-tight">{profile?.username || "Sin Nombre"}</h2>
          <div className="flex items-center gap-2 mt-0.5">
            <Shield className="w-3.5 h-3.5 text-accent" />
            <span className="text-xs text-accent font-semibold">{profile?.factions?.name || "Sin Facción"}</span>
          </div>
          <div className="progress-bar h-1.5 mt-2 max-w-[200px]"><div className="progress-bar-fill h-full" style={{ width: `${(xpInLevel / xpNeeded) * 100}%` }} /></div>
          <p className="text-[9px] text-muted mt-1 font-mono">{xpInLevel} / {xpNeeded} XP</p>
        </div>
        <div className="flex flex-wrap gap-6">
          {[
            { label: "Puntos Totales", value: (profile?.total_points || 0).toLocaleString() },
            { label: "Nodos Escaneados", value: String(scanCount) },
            { label: "Moto", value: profile?.motorcycle_model || "N/A" },
          ].map((s, i) => (
            <div key={i} className="stat-box border-l border-border first:border-l-0 pl-6 first:pl-0">
              <p className="text-[9px] text-muted uppercase tracking-wider font-semibold">{s.label}</p>
              <p className="text-2xl font-black text-white">{s.value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ═══ Map + Rankings ═══ */}
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-8 space-y-6">
          {/* Map */}
          <div className="card p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">Mapa Táctico — Panamá</h3>
            </div>
            <div className="relative w-full h-[350px] bg-surface-light rounded-xl overflow-hidden border border-border">
              <TacticalMap stickers={stickers} />
            </div>
          </div>

          {/* Quick Access */}
          <div className="card p-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-3">Accesos Rápidos</h3>
            <div className="grid grid-cols-4 gap-3">
              {[
                { icon: <ScanLine className="w-5 h-5" />, label: "Escanear QR", href: "/escanear" },
                { icon: <Target className="w-5 h-5" />, label: "Misiones", href: "/misiones" },
                { icon: <CalendarDays className="w-5 h-5" />, label: "Eventos", href: "/eventos" },
                { icon: <ShoppingBag className="w-5 h-5" />, label: "Tienda", href: "/tienda" },
              ].map((q, i) => (
                <Link key={i} href={q.href}>
                  <div className="card-inner p-3 flex flex-col items-center text-center gap-1.5 hover:border-primary/30 transition-colors cursor-pointer group">
                    <div className="text-muted group-hover:text-primary transition-colors">{q.icon}</div>
                    <p className="text-[10px] font-bold text-white uppercase">{q.label}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Rankings + Faction (real data) */}
        <div className="col-span-4 space-y-6">
          <div className="card p-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-3 flex items-center gap-2"><Trophy className="w-4 h-4 text-primary" /> Top Riders</h3>
            <div className="space-y-1.5">
              {topRiders.map((p, idx) => (
                <div key={idx} className={`flex items-center gap-2 p-1.5 rounded-lg ${p.username === profile?.username ? "bg-primary/10 border border-primary/20" : "hover:bg-surface-light"} transition-colors`}>
                  <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-black ${idx < 3 ? "bg-primary text-black" : "text-muted"}`}>{idx + 1}</span>
                  <Flame className={`w-3 h-3 ${idx < 3 ? "text-primary" : "text-muted/30"}`} />
                  <span className={`text-xs font-semibold flex-1 truncate ${p.username === profile?.username ? "text-primary" : "text-white"}`}>{p.username}</span>
                  <span className="text-xs font-bold text-primary font-mono">{(p.total_points || 0).toLocaleString()}</span>
                </div>
              ))}
              {topRiders.length === 0 && <p className="text-xs text-muted text-center py-4">No hay riders registrados aún</p>}
            </div>
            <Link href="/ranking">
              <button className="w-full mt-3 py-2 bg-surface-light border border-border text-[10px] text-muted font-bold uppercase rounded-lg hover:text-white transition-colors">Ver Ranking Completo</button>
            </Link>
          </div>

          {/* Faction */}
          <div className="card p-4">
            <p className="text-[9px] text-muted uppercase tracking-widest mb-3">Tu Facción</p>
            {profile?.factions ? (
              <>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 rounded-full bg-accent/20 border border-accent/30 flex items-center justify-center">
                    <Shield className="w-6 h-6 text-accent" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-sm">{profile.factions.name}</h4>
                  </div>
                </div>
                <Link href="/faccion"><button className="w-full py-2 border border-accent/30 text-accent text-[10px] font-bold uppercase rounded-lg hover:bg-accent/10 transition-colors">Ver Facción</button></Link>
              </>
            ) : (
              <div className="text-center py-4">
                <p className="text-xs text-muted mb-3">No estás en ninguna facción</p>
                <Link href="/faccion"><button className="w-full py-2 bg-accent/20 border border-accent/30 text-accent text-[10px] font-bold uppercase rounded-lg">Unirse a una Facción</button></Link>
              </div>
            )}
          </div>

          {/* Garage Preview */}
          <div className="card p-4">
            <p className="text-[9px] text-muted uppercase tracking-widest mb-2">Mi Garaje</p>
            <div className="flex items-center gap-3">
              <Wrench className="w-8 h-8 text-muted" />
              <div>
                <p className="text-sm font-bold text-white">{profile?.motorcycle_model || "Sin moto registrada"}</p>
              </div>
            </div>
            <Link href="/garaje"><button className="w-full mt-3 py-2 border border-border text-[10px] text-muted font-bold uppercase rounded-lg hover:text-white transition-colors">Ver Garaje</button></Link>
          </div>
        </div>
      </div>
    </div>
  );
}
