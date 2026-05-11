"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  User, Flame, MapPin, ScanLine, ShoppingBag, CalendarDays, Target,
  Trophy, Shield, Wrench, Medal, Clock, Zap, Star, ChevronRight
} from "lucide-react";

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
            <div className="relative w-full h-[300px] bg-surface-light rounded-xl overflow-hidden border border-border">
              {/* Panama SVG outline */}
              <svg viewBox="0 0 800 350" className="absolute inset-0 w-full h-full opacity-30" preserveAspectRatio="xMidYMid meet">
                <path d="M50,180 C80,160 120,140 160,145 C200,150 220,130 260,120 C300,110 340,100 380,105 C420,110 440,95 480,90 C520,85 540,80 580,85 C620,90 640,100 680,110 C700,115 720,130 740,140 L750,150 C740,170 720,185 700,195 C680,205 660,210 640,220 C620,230 590,240 570,245 C550,250 530,255 510,250 C490,245 470,235 450,230 C430,225 410,230 390,235 C370,240 350,250 330,255 C310,260 290,258 270,250 C250,242 230,235 210,240 C190,245 170,255 150,260 C130,265 110,260 90,250 C70,240 55,225 45,210 C40,200 42,190 50,180 Z" fill="none" stroke="#f59e0b" strokeWidth="2" />
                {/* Provinces labels */}
                <text x="120" y="200" fill="#71717a" fontSize="10" fontWeight="bold">Chiriquí</text>
                <text x="250" y="230" fill="#71717a" fontSize="10" fontWeight="bold">Veraguas</text>
                <text x="380" y="210" fill="#71717a" fontSize="10" fontWeight="bold">Coclé</text>
                <text x="500" y="200" fill="#71717a" fontSize="10" fontWeight="bold">Panamá</text>
                <text x="620" y="160" fill="#71717a" fontSize="10" fontWeight="bold">Darién</text>
                <text x="300" y="170" fill="#71717a" fontSize="9">Herrera</text>
                <text x="200" y="170" fill="#71717a" fontSize="9">Ngäbe-Buglé</text>
                <text x="440" y="140" fill="#71717a" fontSize="9">Colón</text>
                <text x="550" y="230" fill="#71717a" fontSize="9">Kuna Yala</text>
                <text x="430" y="230" fill="#71717a" fontSize="9">Panamá Oeste</text>
              </svg>
              {/* Real sticker dots from DB */}
              {stickers.map((st) => {
                const x = ((st.longitude + 83) / 6) * 100;
                const y = ((10 - st.latitude) / 3) * 100;
                const color = st.rarity === "legendary" ? "bg-primary" : st.rarity === "epic" ? "bg-accent" : st.rarity === "rare" ? "bg-blue-400" : "bg-white";
                return (
                  <div key={st.id} className="absolute group" style={{ left: `${Math.max(5, Math.min(95, x))}%`, top: `${Math.max(5, Math.min(95, y))}%` }}>
                    <div className={`w-3 h-3 ${color} rounded-full`} />
                    <div className={`absolute inset-0 w-3 h-3 ${color} rounded-full map-dot-ping`} />
                    <div className="absolute bottom-5 left-1/2 -translate-x-1/2 hidden group-hover:block glass-panel px-2 py-1 rounded text-[9px] text-white whitespace-nowrap z-10">{st.name} ({st.rarity})</div>
                  </div>
                );
              })}
              {stickers.length === 0 && (
                <div className="absolute inset-0 flex items-center justify-center text-muted text-sm">No hay stickers desplegados aún</div>
              )}
              {/* Legend */}
              <div className="absolute bottom-3 left-3 glass-panel p-2.5 rounded-lg text-[9px] space-y-1">
                {[
                  { c: "bg-white", l: "Normales" },
                  { c: "bg-blue-400", l: "Raros" },
                  { c: "bg-accent", l: "Épicos" },
                  { c: "bg-primary", l: "Legendarios" },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-2 text-muted"><div className={`w-2 h-2 ${item.c} rounded-full`} />{item.l}</div>
                ))}
              </div>
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
