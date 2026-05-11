"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Shield, Check, X, MapPin, Eye, Loader2, Award, Trophy, Users } from "lucide-react";

export default function AdminPage() {
  const [proposals, setProposals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ users: 0, points: 0, factions: 0 });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    // Fetch proposals (status != 'active')
    const { data } = await supabase.from("stickers").select("*, profiles(username)").neq("status", "active").order("created_at", { ascending: false });
    setProposals(data || []);

    // Stats
    const { count: u } = await supabase.from("profiles").select("*", { count: "exact", head: true });
    const { count: p } = await supabase.from("stickers").select("*", { count: "exact", head: true }).eq("status", "active");
    const { count: f } = await supabase.from("factions").select("*", { count: "exact", head: true });
    
    setStats({ users: u || 0, points: p || 0, factions: f || 0 });
    setLoading(false);
  };

  const approvePoint = async (point: any) => {
    const { error } = await supabase.from("stickers").update({ 
      status: "active", 
      is_active: true 
    }).eq("id", point.id);

    if (!error) {
      // Award XP to creator
      const { data: creator } = await supabase.from("profiles").select("total_points").eq("id", point.creator_id).single();
      if (creator) {
        await supabase.from("profiles").update({ 
          total_points: (creator.total_points || 0) + 100 
        }).eq("id", point.creator_id);
      }
      fetchData();
    }
  };

  const rejectPoint = async (id: string) => {
    await supabase.from("stickers").delete().eq("id", id);
    fetchData();
  };

  if (loading) return <div className="flex items-center justify-center h-full"><Loader2 className="animate-spin text-primary" /></div>;

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <header className="flex items-center gap-4">
        <div className="p-3 bg-destructive/10 rounded-xl text-destructive border border-destructive/20">
          <Shield className="w-8 h-8" />
        </div>
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight uppercase italic">Panel de Mando (Overseer)</h1>
          <p className="text-muted text-sm font-mono tracking-widest uppercase">Validación de Operaciones de Campo</p>
        </div>
      </header>

      {/* Global Stats */}
      <div className="grid grid-cols-3 gap-6">
        {[
          { label: "Riders Registrados", val: stats.users, icon: <Users className="w-5 h-5" /> },
          { label: "Nodos Activos", val: stats.points, icon: <MapPin className="w-5 h-5" /> },
          { label: "Facciones Activas", val: stats.factions, icon: <Trophy className="w-5 h-5" /> },
        ].map((s, i) => (
          <div key={i} className="card p-6 flex items-center justify-between">
            <div>
              <p className="text-[10px] text-muted uppercase font-bold mb-1">{s.label}</p>
              <p className="text-3xl font-black text-white">{s.val}</p>
            </div>
            <div className="text-primary/50">{s.icon}</div>
          </div>
        ))}
      </div>

      {/* Proposals List */}
      <div className="space-y-6">
        <h2 className="text-xl font-black text-white uppercase italic flex items-center gap-2">
          <Award className="w-6 h-6 text-primary" /> Propuestas Pendientes
        </h2>

        <div className="space-y-4">
          {proposals.map((p) => (
            <div key={p.id} className="card p-6 flex flex-wrap items-center gap-8 hover:border-primary/30 transition-all">
              <div className="w-16 h-16 bg-surface-light rounded-xl flex items-center justify-center border border-border">
                  <MapPin className="w-8 h-8 text-muted" />
              </div>
              <div className="flex-1 min-w-[200px]">
                <div className="flex items-center gap-3">
                  <h4 className="font-black text-white uppercase text-lg">{p.name}</h4>
                  <span className="px-2 py-0.5 bg-surface-light text-muted text-[8px] font-black rounded uppercase border border-border">{p.rarity}</span>
                </div>
                <p className="text-xs text-muted mt-1 italic">Propuesto por: <span className="text-white font-bold">{p.profiles?.username}</span></p>
                <p className="text-[10px] text-muted mt-2 uppercase">{p.description || "Sin descripción."}</p>
              </div>
              
              <div className="flex items-center gap-8">
                <div className="text-right">
                  <p className="text-[9px] text-muted uppercase font-bold">Coordenadas</p>
                  <p className="text-[10px] font-mono text-white">{p.latitude.toFixed(4)}, {p.longitude.toFixed(4)}</p>
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => approvePoint(p)}
                    className="p-3 bg-success/20 text-success rounded-xl hover:bg-success hover:text-black transition-all border border-success/30"
                  >
                    <Check className="w-5 h-5" />
                  </button>
                  <button 
                    onClick={() => rejectPoint(p.id)}
                    className="p-3 bg-destructive/20 text-destructive rounded-xl hover:bg-destructive hover:text-white transition-all border border-destructive/30"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
          {proposals.length === 0 && (
            <div className="card p-20 text-center border-dashed border-border opacity-50">
              <p className="text-sm text-muted uppercase font-bold italic tracking-widest">No hay propuestas pendientes en el radar.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
