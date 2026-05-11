"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Shield, Plus, Users, Trophy, CheckCircle2, Loader2, Settings, UserMinus, Palette, Edit3 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function FaccionPage() {
  const [userProfile, setUserProfile] = useState<any>(null);
  const [factions, setFactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [newFaccion, setNewFaccion] = useState({ name: "", description: "", color_hex: "#f59e0b" });
  const [activeTab, setActiveTab] = useState<"explorer" | "admin">("explorer");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
      const { data: profile } = await supabase.from("profiles").select("*, factions(*)").eq("id", session.user.id).single();
      setUserProfile(profile);
      if (profile?.factions) setActiveTab("admin");
    }

    const { data: allFactions } = await supabase.from("factions").select("*").order("total_points", { ascending: false });
    setFactions(allFactions || []);
    setLoading(false);
  };

  const joinFaction = async (factionId: string) => {
    if (!userProfile) return;
    const { error } = await supabase.from("profiles").update({ faction_id: factionId }).eq("id", userProfile.id);
    if (!error) fetchData();
  };

  const leaveFaction = async () => {
    if (!userProfile) return;
    const { error } = await supabase.from("profiles").update({ faction_id: null }).eq("id", userProfile.id);
    if (!error) {
      setActiveTab("explorer");
      fetchData();
    }
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

  if (loading) return <div className="flex items-center justify-center h-full"><Loader2 className="animate-spin text-primary" /></div>;

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <header className="flex items-end justify-between">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight uppercase italic">Centro de Facciones</h1>
          <p className="text-muted text-sm font-mono tracking-widest">DOMINIO DE TERRITORIO Y ALIANZAS</p>
        </div>
        <div className="flex bg-surface-light border border-border p-1 rounded-xl">
          <button 
            onClick={() => setActiveTab("explorer")}
            className={`px-6 py-2 text-[10px] font-black uppercase rounded-lg transition-all ${activeTab === "explorer" ? "bg-white text-black" : "text-muted hover:text-white"}`}
          >
            Explorador
          </button>
          {userProfile?.factions && (
            <button 
              onClick={() => setActiveTab("admin")}
              className={`px-6 py-2 text-[10px] font-black uppercase rounded-lg transition-all ${activeTab === "admin" ? "bg-accent text-white" : "text-muted hover:text-white"}`}
            >
              Administrar
            </button>
          )}
        </div>
      </header>

      <AnimatePresence mode="wait">
        {activeTab === "admin" && userProfile?.factions ? (
          <motion.div 
            key="admin"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            {/* My Faction Admin Panel */}
            <div className="grid grid-cols-12 gap-6">
              <div className="col-span-8 space-y-6">
                <div className="card p-8 border-accent/30 relative overflow-hidden bg-gradient-to-br from-surface to-accent/5">
                  <div className="flex items-center gap-8 relative z-10">
                    <div className="w-24 h-24 rounded-full bg-accent/20 border-2 border-accent/40 flex items-center justify-center shadow-[0_0_30px_rgba(139,92,246,0.2)]">
                      <Shield className="w-12 h-12 text-accent" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <h2 className="text-4xl font-black text-white uppercase italic tracking-tighter">{userProfile.factions.name}</h2>
                        <span className="px-3 py-1 bg-accent/20 text-accent text-[10px] font-black rounded-full border border-accent/30 uppercase">Rango Global: #1</span>
                      </div>
                      <p className="text-muted text-sm mt-2 max-w-xl">{userProfile.factions.description || "Sin descripción táctica de la alianza."}</p>
                      
                      <div className="flex gap-4 mt-6">
                        <div className="px-4 py-2 card-inner border-white/5">
                          <p className="text-[9px] text-muted uppercase font-bold">Puntos Totales</p>
                          <p className="text-xl font-black text-white">{(userProfile.factions.total_points || 0).toLocaleString()}</p>
                        </div>
                        <div className="px-4 py-2 card-inner border-white/5">
                          <p className="text-[9px] text-muted uppercase font-bold">Miembros Activos</p>
                          <p className="text-xl font-black text-white">1</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="card p-6 space-y-4">
                    <h3 className="text-xs font-bold text-white uppercase tracking-widest flex items-center gap-2">
                      <Palette className="w-4 h-4 text-accent" /> Identidad Visual
                    </h3>
                    <div className="space-y-3">
                      <p className="text-[10px] text-muted uppercase">Color de Alianza</p>
                      <div className="flex gap-2">
                        {["#f59e0b", "#8b5cf6", "#ef4444", "#10b981", "#3b82f6"].map(c => (
                          <div key={c} className={`w-8 h-8 rounded-full border-2 cursor-pointer transition-transform hover:scale-110 ${userProfile.factions.color_hex === c ? "border-white" : "border-transparent"}`} style={{ background: c }} />
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="card p-6 space-y-4">
                     <h3 className="text-xs font-bold text-white uppercase tracking-widest flex items-center gap-2">
                      <Edit3 className="w-4 h-4 text-accent" /> Comunicados
                    </h3>
                    <textarea 
                      className="w-full bg-surface-light border border-border rounded-lg p-3 text-xs text-white outline-none focus:border-accent resize-none"
                      rows={3}
                      placeholder="Escribe un mensaje para tu facción..."
                    />
                    <button className="w-full py-2 bg-accent text-white text-[10px] font-black uppercase rounded-lg hover:bg-accent/80 transition-colors">Enviar Aviso</button>
                  </div>
                </div>
              </div>

              <div className="col-span-4 space-y-6">
                <div className="card p-6 space-y-6">
                  <div>
                    <h3 className="text-sm font-bold text-white uppercase tracking-widest mb-1">Ajustes de Alianza</h3>
                    <p className="text-[10px] text-muted uppercase">Gestión administrativa</p>
                  </div>
                  
                  <div className="space-y-2">
                    <button className="w-full py-3 bg-surface-light border border-border text-white text-[10px] font-bold uppercase rounded-lg hover:bg-surface-light/80 transition-colors flex items-center justify-center gap-2">
                      <Settings className="w-4 h-4" /> Editar Perfil
                    </button>
                    <button 
                      onClick={leaveFaction}
                      className="w-full py-3 border border-destructive/30 text-destructive text-[10px] font-bold uppercase rounded-lg hover:bg-destructive/10 transition-colors flex items-center justify-center gap-2"
                    >
                      <UserMinus className="w-4 h-4" /> Abandonar Facción
                    </button>
                  </div>
                </div>

                <div className="card p-6">
                  <h3 className="text-xs font-bold text-white uppercase tracking-widest mb-4">Territorios Bajo Control</h3>
                  <div className="space-y-3">
                    <p className="text-[10px] text-muted text-center py-4 italic uppercase">Ningún territorio conquistado aún.</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div 
            key="explorer"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="grid grid-cols-12 gap-8"
          >
            {/* List Factions */}
            <div className="col-span-8 space-y-4">
              <h3 className="text-sm font-bold text-white uppercase tracking-widest flex items-center gap-2">
                <Users className="w-4 h-4 text-primary" /> Facciones Detectadas
              </h3>
              <div className="space-y-3">
                {factions.map((f) => (
                  <div key={f.id} className="card p-5 flex items-center gap-6 hover:border-primary/30 transition-all group">
                    <div className="w-14 h-14 rounded-full bg-surface-light flex items-center justify-center font-black text-xl text-primary border border-border group-hover:border-primary/40 transition-colors">
                      {f.name.substring(0, 2).toUpperCase()}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-black text-white uppercase text-lg italic tracking-tight">{f.name}</h4>
                      <p className="text-xs text-muted line-clamp-1 mt-1">{f.description || "Sin descripción estratégica."}</p>
                    </div>
                    <div className="text-right px-6 border-l border-border">
                      <p className="text-[9px] text-muted uppercase font-bold tracking-widest">Puntos</p>
                      <p className="text-xl font-black text-white">{(f.total_points || 0).toLocaleString()}</p>
                    </div>
                    <div className="min-w-[120px] flex justify-end">
                      {userProfile?.faction_id === f.id ? (
                        <div className="px-4 py-2 bg-success/10 text-success text-[10px] font-black rounded-lg flex items-center gap-1 border border-success/20">
                          <CheckCircle2 className="w-3 h-3" /> MIEMBRO
                        </div>
                      ) : (
                        <button 
                          onClick={() => joinFaction(f.id)}
                          className="px-6 py-2.5 bg-primary text-black text-[10px] font-black rounded-lg hover:scale-105 active:scale-95 transition-all uppercase"
                        >
                          Unirse
                        </button>
                      )}
                    </div>
                  </div>
                ))}
                {factions.length === 0 && (
                  <div className="card p-20 text-center border-dashed border-border">
                    <p className="text-muted text-sm italic uppercase tracking-widest">No hay facciones registradas en la red nacional.</p>
                  </div>
                )}
              </div>
            </div>

            {/* Create Faction */}
            <div className="col-span-4">
              <div className="card p-6 sticky top-24 border-primary/20 bg-gradient-to-b from-surface to-surface-light">
                <h3 className="text-sm font-bold text-white uppercase tracking-widest mb-6 flex items-center gap-2">
                  <Plus className="w-4 h-4 text-primary" /> Fundar Nueva Alianza
                </h3>
                <form onSubmit={createFaction} className="space-y-5">
                  <div>
                    <label className="text-[10px] text-muted uppercase font-black ml-1 tracking-widest">Nombre de la Facción</label>
                    <input 
                      required 
                      value={newFaccion.name} 
                      onChange={e => setNewFaccion({...newFaccion, name: e.target.value})}
                      className="w-full mt-1.5 bg-surface border border-border rounded-lg px-4 py-3 text-white text-sm focus:border-primary outline-none transition-colors" 
                      placeholder="Ej: Fantasmas del West"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-muted uppercase font-black ml-1 tracking-widest">Manifiesto / Descripción</label>
                    <textarea 
                      rows={4}
                      value={newFaccion.description} 
                      onChange={e => setNewFaccion({...newFaccion, description: e.target.value})}
                      className="w-full mt-1.5 bg-surface border border-border rounded-lg px-4 py-3 text-white text-sm focus:border-primary outline-none resize-none transition-colors" 
                      placeholder="Define la visión y reglas de tu alianza..."
                    />
                  </div>
                  <button 
                    type="submit" 
                    disabled={creating}
                    className="w-full py-4 bg-white text-black font-black text-xs uppercase rounded-lg hover:bg-primary transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(255,255,255,0.1)] active:scale-95"
                  >
                    {creating ? <Loader2 className="w-4 h-4 animate-spin" /> : "ESTABLECER ALIANZA"}
                  </button>
                </form>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
