"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Shield, Plus, Users, Trophy, CheckCircle2, Loader2, Settings, UserMinus, Palette, Edit3, UserPlus, Link as LinkIcon, Share2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function FaccionPage() {
  const [userProfile, setUserProfile] = useState<any>(null);
  const [factions, setFactions] = useState<any[]>([]);
  const [members, setMembers] = useState<any[]>([]);
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
      if (profile?.factions) {
        setActiveTab("admin");
        // Fetch members of this faction
        const { data: m } = await supabase.from("profiles").select("username, total_points").eq("faction_id", profile.faction_id).order("total_points", { ascending: false });
        setMembers(m || []);
      }
    }

    const { data: allFactions } = await supabase.from("factions").select("*").order("total_points", { ascending: false });
    setFactions(allFactions || []);
    setLoading(false);
  };

  const joinFaction = async (factionId: string) => {
    if (!userProfile) return;
    const { error } = await supabase.from("profiles").update({ faction_id: factionId }).eq("id", userProfile.id);
    if (!error) await fetchData();
  };

  const leaveFaction = async () => {
    if (!userProfile) return;
    const { error } = await supabase.from("profiles").update({ faction_id: null }).eq("id", userProfile.id);
    if (!error) {
      setActiveTab("explorer");
      await fetchData();
    }
  };

  const createFaction = async (e: React.FormEvent) => {
    e.preventDefault();
    if (userProfile?.faction_id) {
      alert("Ya perteneces a una alianza. Debes abandonarla para fundar una nueva.");
      return;
    }
    setCreating(true);
    const { data, error } = await supabase.from("factions").insert([newFaccion]).select();
    if (!error && data) {
      await joinFaction(data[0].id);
      setNewFaccion({ name: "", description: "", color_hex: "#f59e0b" });
    }
    setCreating(false);
  };

  const updateFactionColor = async (color: string) => {
    if (!userProfile?.faction_id) return;
    const { error } = await supabase.from("factions").update({ color_hex: color }).eq("id", userProfile.faction_id);
    if (!error) await fetchData();
  };

  const [orders, setOrders] = useState("");
  const publishOrders = async () => {
    if (!userProfile?.faction_id) return;
    const { error } = await supabase.from("factions").update({ orders: orders }).eq("id", userProfile.faction_id);
    if (!error) alert("Directivas de mando publicadas.");
  };

  const copyInvite = () => {
    const link = `${window.location.origin}/registro-motero?faction=${userProfile?.faction_id}`;
    navigator.clipboard.writeText(link);
    alert("Enlace de invitación copiado. ¡Compártelo con tu escuadrón!");
  };

  if (loading) return <div className="flex items-center justify-center h-full"><Loader2 className="animate-spin text-primary" /></div>;

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <header className="flex items-end justify-between">
        <div>
          <h1 className="text-4xl font-black text-white tracking-tighter uppercase italic">Red de Alianzas</h1>
          <p className="text-muted text-sm font-mono tracking-widest uppercase">Estructura de Comando y Control Territorial</p>
        </div>
        <div className="flex bg-surface-light border border-border p-1 rounded-xl shadow-lg">
          <button 
            onClick={() => setActiveTab("explorer")}
            className={`px-8 py-2.5 text-[10px] font-black uppercase rounded-lg transition-all ${activeTab === "explorer" ? "bg-white text-black shadow-xl" : "text-muted hover:text-white"}`}
          >
            Explorador
          </button>
          {userProfile?.factions && (
            <button 
              onClick={() => setActiveTab("admin")}
              className={`px-8 py-2.5 text-[10px] font-black uppercase rounded-lg transition-all ${activeTab === "admin" ? "bg-accent text-white shadow-xl shadow-accent/20" : "text-muted hover:text-white"}`}
            >
              Centro de Mando
            </button>
          )}
        </div>
      </header>

      <AnimatePresence mode="wait">
        {activeTab === "admin" && userProfile?.factions ? (
          <motion.div 
            key="admin"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            className="space-y-6"
          >
            <div className="grid grid-cols-12 gap-8">
              {/* Left Column: Stats & Identity */}
              <div className="col-span-8 space-y-8">
                <div className="card p-10 border-accent/40 relative overflow-hidden bg-gradient-to-br from-surface to-accent/10 shadow-2xl">
                  <div className="absolute top-0 right-0 p-4">
                     <Shield className="w-48 h-48 text-accent/5 -rotate-12 absolute -top-10 -right-10" />
                  </div>
                  
                  <div className="flex items-center gap-10 relative z-10">
                    <div className="w-28 h-28 rounded-full bg-accent/20 border-2 border-accent/40 flex items-center justify-center shadow-[0_0_50px_rgba(139,92,246,0.3)]">
                      <Shield className="w-14 h-14 text-accent" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-4">
                        <h2 className="text-5xl font-black text-white uppercase italic tracking-tighter">{userProfile.factions.name}</h2>
                        <span className="px-4 py-1.5 text-white text-[10px] font-black rounded-full uppercase shadow-lg" style={{ backgroundColor: userProfile.factions.color_hex }}>Alianza Activa</span>
                      </div>
                      <p className="text-muted text-sm mt-4 max-w-xl font-medium leading-relaxed">{userProfile.factions.description || "Esta facción aún no ha definido su manifiesto de guerra."}</p>
                      
                      <div className="flex gap-6 mt-8">
                        <div className="px-6 py-3 card-inner border-white/5 bg-black/20">
                          <p className="text-[9px] text-muted uppercase font-black tracking-widest mb-1">XP Colectivo</p>
                          <p className="text-2xl font-black text-white italic">{(userProfile.factions.total_points || 0).toLocaleString()}</p>
                        </div>
                        <div className="px-6 py-3 card-inner border-white/5 bg-black/20">
                          <p className="text-[9px] text-muted uppercase font-black tracking-widest mb-1">Efectivos</p>
                          <p className="text-2xl font-black text-white italic">{members.length}</p>
                        </div>
                        <button 
                          onClick={copyInvite}
                          className="px-6 py-3 bg-white text-black text-[10px] font-black uppercase rounded-xl hover:scale-105 transition-all flex items-center gap-2 shadow-xl"
                        >
                          <UserPlus className="w-4 h-4" /> Reclutar Riders
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Members List */}
                <div className="card p-6">
                  <h3 className="text-sm font-black text-white uppercase italic tracking-widest mb-6 flex items-center gap-2">
                    <Users className="w-5 h-5 text-accent" /> Registro de Operadores
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    {members.map((m, i) => (
                      <div key={i} className="flex items-center justify-between p-4 card-inner bg-surface/50 hover:border-accent/40 transition-colors group">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-surface-light flex items-center justify-center font-black text-[10px] text-muted group-hover:text-white">{m.username.substring(0, 2).toUpperCase()}</div>
                          <span className="text-xs font-bold text-white uppercase tracking-tight">{m.username}</span>
                        </div>
                        <span className="text-xs font-black text-accent italic">{m.total_points.toLocaleString()} XP</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Column: Settings & Identity */}
              <div className="col-span-4 space-y-6">
                <div className="card p-6 space-y-8">
                  <div>
                    <h3 className="text-sm font-black text-white uppercase italic tracking-widest mb-2">Personalización</h3>
                    <p className="text-[10px] text-muted uppercase font-mono">Identidad de Escuadrón</p>
                  </div>

                  <div className="space-y-4">
                    <p className="text-[10px] text-muted uppercase font-black">Color Distintivo</p>
                    <div className="flex gap-3">
                      {["#f59e0b", "#8b5cf6", "#ef4444", "#10b981", "#3b82f6"].map(c => (
                        <div 
                          key={c} 
                          onClick={() => updateFactionColor(c)}
                          className={`w-10 h-10 rounded-xl border-4 cursor-pointer transition-all hover:scale-110 shadow-lg ${userProfile.factions.color_hex === c ? "border-white" : "border-transparent"}`} 
                          style={{ background: c }} 
                        />
                      ))}
                    </div>
                  </div>

                  <div className="space-y-4">
                     <h3 className="text-[10px] font-black text-white uppercase tracking-widest flex items-center gap-2">
                      <Edit3 className="w-4 h-4 text-accent" /> Tablón de Órdenes
                    </h3>
                    <textarea 
                      className="w-full bg-surface border border-border rounded-xl p-4 text-xs text-white outline-none focus:border-accent resize-none transition-all placeholder:text-muted/30"
                      rows={4}
                      value={orders}
                      onChange={e => setOrders(e.target.value)}
                      placeholder="Escribe las directivas para tu facción..."
                    />
                    <button 
                      onClick={publishOrders}
                      className="w-full py-3 bg-accent text-white text-[10px] font-black uppercase rounded-xl hover:bg-accent/80 transition-all shadow-lg shadow-accent/20"
                    >
                      Publicar Orden
                    </button>
                  </div>

                  <div className="pt-6 border-t border-border space-y-3">
                     <button className="w-full py-3 bg-surface-light border border-border text-white text-[10px] font-black uppercase rounded-xl hover:bg-white hover:text-black transition-all flex items-center justify-center gap-2">
                      <Settings className="w-4 h-4" /> Ajustes Globales
                    </button>
                    <button 
                      onClick={leaveFaction}
                      className="w-full py-3 border border-destructive/30 text-destructive text-[10px] font-black uppercase rounded-xl hover:bg-destructive text-white transition-all flex items-center justify-center gap-2"
                    >
                      <UserMinus className="w-4 h-4" /> Desmantelar Alianza
                    </button>
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
            className="grid grid-cols-12 gap-10"
          >
            {/* List Factions */}
            <div className="col-span-8 space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-black text-white uppercase italic flex items-center gap-3">
                  <Users className="w-6 h-6 text-primary" /> Alianzas en el Radar
                </h3>
                <span className="text-[10px] text-muted font-mono uppercase">{factions.length} Detectadas</span>
              </div>
              
              <div className="space-y-4">
                {factions.map((f) => (
                  <div key={f.id} className="card p-6 flex items-center gap-8 hover:border-primary/40 hover:shadow-[0_0_30px_rgba(245,158,11,0.1)] transition-all group relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-1 h-full" style={{ background: f.color_hex || '#f59e0b' }} />
                    <div className="w-16 h-16 rounded-2xl bg-surface-light flex items-center justify-center font-black text-2xl text-primary border border-border group-hover:scale-105 transition-transform shadow-xl">
                      {f.name.substring(0, 2).toUpperCase()}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-black text-white uppercase text-xl italic tracking-tighter group-hover:text-primary transition-colors">{f.name}</h4>
                      <p className="text-xs text-muted line-clamp-1 mt-2 font-medium">{f.description || "Esta alianza opera bajo el radar sin manifiesto público."}</p>
                    </div>
                    <div className="text-right px-8 border-l border-border/50">
                      <p className="text-[9px] text-muted uppercase font-black tracking-widest mb-1">Reputación</p>
                      <p className="text-2xl font-black text-white italic">{(f.total_points || 0).toLocaleString()}</p>
                    </div>
                    <div className="min-w-[140px] flex justify-end">
                      {userProfile?.faction_id === f.id ? (
                        <div className="px-6 py-3 bg-success/10 text-success text-[10px] font-black rounded-xl flex items-center gap-2 border border-success/30 shadow-[0_0_20px_rgba(34,197,94,0.1)]">
                          <CheckCircle2 className="w-4 h-4" /> MIEMBRO ACTIVO
                        </div>
                      ) : (
                        <button 
                          onClick={() => {
                            if (userProfile?.faction_id) {
                              alert("Ya perteneces a una alianza. Sal de la actual para unirte a esta.");
                            } else {
                              joinFaction(f.id);
                            }
                          }}
                          className={`px-8 py-3.5 text-[10px] font-black rounded-xl transition-all uppercase shadow-lg active:scale-95 ${userProfile?.faction_id ? "bg-muted text-surface cursor-not-allowed opacity-50" : "bg-primary text-black hover:bg-white hover:shadow-2xl shadow-primary/20"}`}
                        >
                          Sincronizar
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Create Faction */}
            <div className="col-span-4">
              <div className="card p-8 sticky top-24 border-primary/20 bg-gradient-to-b from-surface to-surface-light shadow-2xl">
                <div className="flex flex-col items-center text-center mb-8">
                   <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4 border border-primary/20">
                    <Plus className="w-8 h-8 text-primary" />
                   </div>
                   <h3 className="text-lg font-black text-white uppercase italic tracking-widest">Fundar Alianza</h3>
                   <p className="text-[10px] text-muted uppercase mt-1 font-mono">Inicia tu propio escuadrón táctico</p>
                </div>

                <form onSubmit={createFaction} className="space-y-6">
                  <div>
                    <label className="text-[10px] text-muted uppercase font-black ml-1 tracking-[0.2em]">Designación de Alianza</label>
                    <input 
                      required 
                      value={newFaccion.name} 
                      onChange={e => setNewFaccion({...newFaccion, name: e.target.value})}
                      className="w-full mt-2 bg-surface border border-border rounded-xl px-5 py-4 text-white text-sm font-bold focus:border-primary outline-none transition-all shadow-inner" 
                      placeholder="Ej: FANTASMAS DEL WEST"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-muted uppercase font-black ml-1 tracking-[0.2em]">Manifiesto Táctico</label>
                    <textarea 
                      rows={5}
                      value={newFaccion.description} 
                      onChange={e => setNewFaccion({...newFaccion, description: e.target.value})}
                      className="w-full mt-2 bg-surface border border-border rounded-xl px-5 py-4 text-white text-sm font-medium focus:border-primary outline-none resize-none transition-all shadow-inner" 
                      placeholder="Define los objetivos y honor de tu alianza..."
                    />
                  </div>
                  <button 
                    type="submit" 
                    disabled={creating || userProfile?.faction_id}
                    className="w-full py-5 bg-white text-black font-black text-xs uppercase rounded-xl hover:bg-primary transition-all flex items-center justify-center gap-3 shadow-2xl active:scale-95 disabled:opacity-20"
                  >
                    {creating ? <Loader2 className="w-5 h-5 animate-spin" /> : userProfile?.faction_id ? "Ya tienes Alianza" : "ESTABLECER COMANDO"}
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
