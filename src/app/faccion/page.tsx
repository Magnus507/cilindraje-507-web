"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import AppLayout from "@/components/AppLayout";
import { Shield, Plus, Users, Trophy, CheckCircle2, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

export default function FaccionPage() {
  const [userProfile, setUserProfile] = useState<any>(null);
  const [factions, setFactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [newFaccion, setNewFaccion] = useState({ name: "", description: "", color_hex: "#f59e0b" });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
      const { data: profile } = await supabase.from("profiles").select("*, factions(*)").eq("id", session.user.id).single();
      setUserProfile(profile);
    }

    const { data: allFactions } = await supabase.from("factions").select("*, profiles(count)").order("total_points", { ascending: false });
    setFactions(allFactions || []);
    setLoading(false);
  };

  const joinFaction = async (factionId: string) => {
    if (!userProfile) return;
    const { error } = await supabase.from("profiles").update({ faction_id: factionId }).eq("id", userProfile.id);
    if (!error) fetchData();
  };

  const createFaction = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);
    const { data, error } = await supabase.from("factions").insert([newFaccion]).select();
    if (!error && data) {
      await joinFaction(data[0].id);
      setNewFaccion({ name: "", description: "", color_hex: "#f59e0b" });
    }
    setCreating(false);
  };

  if (loading) return <AppLayout><div className="flex items-center justify-center h-full"><Loader2 className="animate-spin text-primary" /></div></AppLayout>;

  return (
    <AppLayout>
      <div className="space-y-8 max-w-5xl mx-auto">
        <header>
          <h1 className="text-3xl font-black text-white tracking-tight uppercase italic">Centro de Facciones</h1>
          <p className="text-muted text-sm font-mono tracking-widest">DOMINIO DE TERRITORIO Y ALIANZAS</p>
        </header>

        {/* My Faction Status */}
        {userProfile?.factions ? (
          <div className="card p-6 border-accent/30 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 rounded-bl-full" />
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 rounded-full bg-accent/20 border border-accent/40 flex items-center justify-center">
                <Shield className="w-10 h-10 text-accent" />
              </div>
              <div className="flex-1">
                <p className="text-[10px] text-accent font-bold uppercase tracking-widest">Tu Facción Actual</p>
                <h2 className="text-3xl font-black text-white uppercase">{userProfile.factions.name}</h2>
                <p className="text-muted text-sm mt-1">{userProfile.factions.description || "Sin descripción táctica."}</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] text-muted uppercase">Puntos de Facción</p>
                <p className="text-3xl font-black text-accent neon-text">{(userProfile.factions.total_points || 0).toLocaleString()}</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="card p-8 text-center border-dashed border-border">
            <Shield className="w-12 h-12 text-muted mx-auto mb-4 opacity-50" />
            <h2 className="text-xl font-bold text-white uppercase">Sin Alianzas</h2>
            <p className="text-muted text-sm max-w-md mx-auto mt-2">No perteneces a ninguna facción. Únete a una existente o funda una nueva para empezar a dominar provincias.</p>
          </div>
        )}

        <div className="grid grid-cols-12 gap-8">
          {/* List Factions */}
          <div className="col-span-8 space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-widest flex items-center gap-2">
              <Users className="w-4 h-4 text-primary" /> Facciones en el Radar
            </h3>
            <div className="space-y-3">
              {factions.map((f) => (
                <div key={f.id} className="card p-4 flex items-center gap-4 hover:border-primary/30 transition-colors">
                  <div className="w-12 h-12 rounded-full bg-surface-light flex items-center justify-center font-bold text-primary border border-border">
                    {f.name.substring(0, 2).toUpperCase()}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-white uppercase">{f.name}</h4>
                    <p className="text-[10px] text-muted line-clamp-1">{f.description}</p>
                  </div>
                  <div className="text-right px-4">
                    <p className="text-[10px] text-muted uppercase">Puntos</p>
                    <p className="text-lg font-black text-white">{f.total_points.toLocaleString()}</p>
                  </div>
                  {userProfile?.faction_id === f.id ? (
                    <div className="px-4 py-2 bg-success/10 text-success text-[10px] font-bold rounded-lg flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> MIEMBRO
                    </div>
                  ) : (
                    <button 
                      onClick={() => joinFaction(f.id)}
                      className="px-6 py-2 bg-primary text-black text-[10px] font-bold rounded-lg hover:bg-primary/80 transition-colors uppercase"
                    >
                      Unirse
                    </button>
                  )}
                </div>
              ))}
              {factions.length === 0 && <p className="text-muted text-center py-10 italic">No hay facciones detectadas en la red.</p>}
            </div>
          </div>

          {/* Create Faction */}
          <div className="col-span-4">
            <div className="card p-6 sticky top-24">
              <h3 className="text-sm font-bold text-white uppercase tracking-widest mb-6 flex items-center gap-2">
                <Plus className="w-4 h-4 text-primary" /> Fundar Facción
              </h3>
              <form onSubmit={createFaction} className="space-y-4">
                <div>
                  <label className="text-[10px] text-muted uppercase font-bold ml-1">Nombre Táctico</label>
                  <input 
                    required 
                    value={newFaccion.name} 
                    onChange={e => setNewFaccion({...newFaccion, name: e.target.value})}
                    className="w-full mt-1 bg-surface-light border border-border rounded-lg px-4 py-2 text-white text-sm focus:border-primary outline-none" 
                    placeholder="Ej: Fantasmas del West"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-muted uppercase font-bold ml-1">Misión / Descripción</label>
                  <textarea 
                    rows={3}
                    value={newFaccion.description} 
                    onChange={e => setNewFaccion({...newFaccion, description: e.target.value})}
                    className="w-full mt-1 bg-surface-light border border-border rounded-lg px-4 py-2 text-white text-sm focus:border-primary outline-none resize-none" 
                    placeholder="Describe los objetivos de tu facción..."
                  />
                </div>
                <button 
                  type="submit" 
                  disabled={creating}
                  className="w-full py-3 bg-white text-black font-black text-xs uppercase rounded-lg hover:bg-primary transition-colors flex items-center justify-center gap-2"
                >
                  {creating ? <Loader2 className="w-4 h-4 animate-spin" /> : "REGISTRAR FACCIÓN"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
