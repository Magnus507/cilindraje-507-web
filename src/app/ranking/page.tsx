"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import AppLayout from "@/components/AppLayout";
import { Trophy, Flame, Shield, User, Loader2, ArrowUp, ArrowDown, Minus } from "lucide-react";

export default function RankingPage() {
  const [profiles, setProfiles] = useState<any[]>([]);
  const [factions, setFactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"riders" | "factions">("riders");

  useEffect(() => {
    fetchRankings();
  }, []);

  const fetchRankings = async () => {
    setLoading(true);
    // Fetch Riders
    const { data: p } = await supabase
      .from("profiles")
      .select("*, factions(name)")
      .order("total_points", { ascending: false })
      .limit(100);
    setProfiles(p || []);

    // Fetch Factions
    const { data: f } = await supabase
      .from("factions")
      .select("*")
      .order("total_points", { ascending: false })
      .limit(50);
    setFactions(f || []);
    setLoading(false);
  };

  if (loading) return <div className="flex items-center justify-center h-full"><Loader2 className="animate-spin text-primary" /></div>;

  return (
    <div className="max-w-5xl mx-auto space-y-8">
        <header className="flex items-end justify-between">
          <div>
            <h1 className="text-3xl font-black text-white tracking-tight uppercase italic">Hall de la Fama</h1>
            <p className="text-muted text-sm font-mono tracking-widest uppercase">Escalafón Nacional de Pilotos y Alianzas</p>
          </div>
          <div className="flex bg-surface-light border border-border p-1 rounded-xl">
            <button 
              onClick={() => setActiveTab("riders")}
              className={`px-6 py-2 text-[10px] font-black uppercase rounded-lg transition-all ${activeTab === "riders" ? "bg-primary text-black" : "text-muted hover:text-white"}`}
            >
              Riders
            </button>
            <button 
              onClick={() => setActiveTab("factions")}
              className={`px-6 py-2 text-[10px] font-black uppercase rounded-lg transition-all ${activeTab === "factions" ? "bg-primary text-black" : "text-muted hover:text-white"}`}
            >
              Facciones
            </button>
          </div>
        </header>

        {activeTab === "riders" ? (
          <div className="card overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-light/50 border-b border-border">
                  <th className="px-6 py-4 text-[10px] text-muted uppercase font-bold">Posición</th>
                  <th className="px-6 py-4 text-[10px] text-muted uppercase font-bold">Rider</th>
                  <th className="px-6 py-4 text-[10px] text-muted uppercase font-bold">Facción</th>
                  <th className="px-6 py-4 text-[10px] text-muted uppercase font-bold">Máquina</th>
                  <th className="px-6 py-4 text-[10px] text-muted uppercase font-bold text-right">Puntos Totales</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {profiles.map((p, i) => (
                  <tr key={p.id} className={`hover:bg-surface-light/30 transition-colors ${i === 0 ? "bg-primary/5" : ""}`}>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <span className={`w-6 h-6 rounded-md flex items-center justify-center text-[10px] font-black ${i === 0 ? "bg-primary text-black" : i === 1 ? "bg-gray-400 text-black" : i === 2 ? "bg-amber-800 text-white" : "bg-surface-light text-muted"}`}>
                          {i + 1}
                        </span>
                        {i === 0 ? <Trophy className="w-4 h-4 text-primary animate-pulse" /> : <Minus className="w-3 h-3 text-muted/30" />}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-surface-light flex items-center justify-center border border-border">
                          <User className="w-4 h-4 text-muted" />
                        </div>
                        <span className="text-sm font-bold text-white uppercase tracking-tight">{p.username}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs text-accent font-semibold uppercase">{p.factions?.name || "Lobo Solitario"}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs text-muted font-mono">{p.motorcycle_model || "---"}</span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className="text-sm font-black text-primary neon-text">{(p.total_points || 0).toLocaleString()}</span>
                    </td>
                  </tr>
                ))}
                {profiles.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-6 py-20 text-center text-muted italic">No se han detectado pilotos registrados en esta temporada.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="card overflow-hidden">
             <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-light/50 border-b border-border">
                  <th className="px-6 py-4 text-[10px] text-muted uppercase font-bold">Rango</th>
                  <th className="px-6 py-4 text-[10px] text-muted uppercase font-bold">Facción</th>
                  <th className="px-6 py-4 text-[10px] text-muted uppercase font-bold text-right">Puntos de Alianza</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {factions.map((f, i) => (
                  <tr key={f.id} className="hover:bg-surface-light/30 transition-colors">
                    <td className="px-6 py-4">
                       <span className={`w-6 h-6 rounded-md flex items-center justify-center text-[10px] font-black ${i === 0 ? "bg-accent text-white" : "bg-surface-light text-muted"}`}>
                          {i + 1}
                        </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <Shield className={`w-5 h-5 ${i === 0 ? "text-accent" : "text-muted"}`} />
                        <span className="text-sm font-bold text-white uppercase">{f.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className="text-sm font-black text-accent">{(f.total_points || 0).toLocaleString()}</span>
                    </td>
                  </tr>
                ))}
                {factions.length === 0 && (
                  <tr>
                    <td colSpan={3} className="px-6 py-20 text-center text-muted italic">No hay facciones registradas.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
