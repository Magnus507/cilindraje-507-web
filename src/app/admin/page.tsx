"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { 
  Shield, Check, X, MapPin, Eye, Loader2, Award, Trophy, Users, 
  Settings, Calendar, Ban, Star, Zap, BarChart3, Bell, Package,
  ChevronRight, ArrowUpRight, Search, Filter
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<"overview" | "approvals" | "users" | "seasons" | "config">("overview");
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ users: 0, points: 0, factions: 0, scans: 0 });
  const [proposals, setProposals] = useState<any[]>([]);
  const [allUsers, setAllUsers] = useState<any[]>([]);
  const [seasons, setSeasons] = useState<any[]>([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    
    // 1. Stats
    const { count: u } = await supabase.from("profiles").select("*", { count: "exact", head: true });
    const { count: p } = await supabase.from("stickers").select("*", { count: "exact", head: true }).eq("status", "active");
    const { count: f } = await supabase.from("factions").select("*", { count: "exact", head: true });
    const { count: s } = await supabase.from("scans").select("*", { count: "exact", head: true });
    setStats({ users: u || 0, points: p || 0, factions: f || 0, scans: s || 0 });

    // 2. Proposals
    const { data: propData } = await supabase.from("stickers").select("*, profiles(username)").neq("status", "active").order("created_at", { ascending: false });
    setProposals(propData || []);

    // 3. All Users
    const { data: userData } = await supabase.from("profiles").select("*").order("total_points", { ascending: false });
    setAllUsers(userData || []);

    // 4. Seasons
    const { data: seasonData } = await supabase.from("seasons").select("*").order("start_date", { ascending: false });
    setSeasons(seasonData || []);

    setLoading(false);
  };

  const [isCreatingSeason, setIsCreatingSeason] = useState(false);
  const [newSeason, setNewSeason] = useState({ name: "", start_date: "", end_date: "" });

  const createSeason = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.from("seasons").insert([{ ...newSeason, is_active: false }]);
    if (!error) {
      setIsCreatingSeason(false);
      setNewSeason({ name: "", start_date: "", end_date: "" });
      fetchData();
    }
  };

  const toggleSeason = async (id: string, currentStatus: boolean) => {
    // Deactivate all first
    await supabase.from("seasons").update({ is_active: false }).neq("id", "00000000-0000-0000-0000-000000000000"); // hack to affect all
    // Activate this one
    await supabase.from("seasons").update({ is_active: !currentStatus }).eq("id", id);
    fetchData();
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

  const deleteSeason = async (id: string) => {
    await supabase.from("seasons").delete().eq("id", id);
    fetchData();
  };

  if (loading) return <div className="flex items-center justify-center h-[70vh]"><Loader2 className="animate-spin text-primary w-12 h-12" /></div>;

  return (
    <div className="max-w-7xl mx-auto space-y-10 pb-20">
      {/* Header Admin */}
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-6">
          <div className="w-16 h-16 bg-destructive/10 rounded-2xl flex items-center justify-center text-destructive border border-destructive/20 shadow-[0_0_40px_rgba(239,68,68,0.15)] relative overflow-hidden group">
            <div className="absolute inset-0 bg-destructive/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
            <Shield className="w-9 h-9 relative z-10" />
          </div>
          <div>
            <h1 className="text-4xl font-black text-white tracking-tighter uppercase italic flex items-center gap-3">
              TORRE DE CONTROL <span className="text-xs bg-destructive text-white px-2 py-0.5 rounded italic not-italic font-mono tracking-tighter">V4.0 - OVERSEER</span>
            </h1>
            <p className="text-muted text-sm font-mono tracking-widest uppercase mt-1 opacity-70">Sistema Centralizado de Comando y Control Territorial</p>
          </div>
        </div>

        <nav className="flex bg-surface-light border border-border p-1.5 rounded-2xl shadow-2xl backdrop-blur-md">
          {[
            { id: "overview", label: "Vista General", icon: BarChart3 },
            { id: "approvals", label: "Propuestas", icon: MapPin },
            { id: "users", label: "Personal", icon: Users },
            { id: "seasons", label: "Temporadas", icon: Calendar },
            { id: "config", label: "Ajustes", icon: Settings },
          ].map((t) => (
            <button 
              key={t.id}
              onClick={() => setActiveTab(t.id as any)}
              className={`px-6 py-2.5 rounded-xl flex items-center gap-2 text-[10px] font-black uppercase transition-all ${activeTab === t.id ? "bg-white text-black shadow-[0_10px_20px_rgba(255,255,255,0.1)]" : "text-muted hover:text-white"}`}
            >
              <t.icon className="w-4 h-4" /> {t.label}
            </button>
          ))}
        </nav>
      </header>

      <AnimatePresence mode="wait">
        {activeTab === "overview" && (
          <motion.div key="overview" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-8">
            {/* Stats Grid */}
            <div className="grid grid-cols-4 gap-6">
              {[
                { label: "Riders Activos", val: stats.users, trend: "+12%", icon: <Users className="w-6 h-6" />, color: "text-blue-400" },
                { label: "Check-ins Totales", val: stats.scans, trend: "+450", icon: <Zap className="w-6 h-6" />, color: "text-yellow-400" },
                { label: "Puntos Validados", val: stats.points, trend: "85%", icon: <MapPin className="w-6 h-6" />, color: "text-green-400" },
                { label: "Facciones Registradas", val: stats.factions, trend: "11", icon: <Trophy className="w-6 h-6" />, color: "text-purple-400" },
              ].map((s, i) => (
                <div key={i} className="card p-8 bg-gradient-to-br from-surface to-surface-light border-white/5 relative group overflow-hidden">
                  <div className={`absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity ${s.color}`}>
                    {s.icon}
                  </div>
                  <p className="text-[10px] text-muted uppercase font-black tracking-widest mb-2">{s.label}</p>
                  <div className="flex items-end gap-3">
                    <h3 className="text-5xl font-black text-white tracking-tighter italic">{s.val.toLocaleString()}</h3>
                    <span className="text-[10px] font-bold text-success mb-2">{s.trend}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-12 gap-8">
              {/* Recent Activity */}
              <div className="col-span-8 card p-8 border-primary/20 bg-primary/5 relative">
                <div className="absolute top-0 left-0 w-1 h-full bg-primary/30" />
                <h3 className="text-xl font-black text-white uppercase italic mb-8 flex items-center gap-3">
                  <Bell className="w-6 h-6 text-primary" /> Alertas de Campo
                </h3>
                <div className="space-y-4">
                  {proposals.slice(0, 3).map((p, i) => (
                    <div key={i} className="flex items-center justify-between p-4 bg-black/40 border border-white/5 rounded-xl hover:border-primary/40 transition-all cursor-pointer">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center text-primary border border-primary/20">
                          <MapPin className="w-6 h-6" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-white uppercase tracking-tight">Nueva Propuesta: {p.name}</p>
                          <p className="text-[10px] text-muted uppercase font-mono mt-0.5">De: {p.profiles?.username} • {new Date(p.created_at).toLocaleTimeString()}</p>
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-muted" />
                    </div>
                  ))}
                  {proposals.length === 0 && <p className="text-center py-10 text-xs text-muted uppercase italic">No hay alertas críticas en este momento.</p>}
                </div>
              </div>

              {/* Quick Actions */}
              <div className="col-span-4 space-y-6">
                <div className="card p-8 bg-surface-light border-white/10">
                   <h3 className="text-sm font-black text-white uppercase italic tracking-widest mb-6">Acciones de Mando</h3>
                   <div className="space-y-3">
                     {[
                       { label: "Crear Nueva Temporada", icon: Calendar, color: "bg-primary" },
                       { label: "Enviar Notificación Global", icon: Bell, color: "bg-white" },
                       { label: "Actualizar Mapa Táctico", icon: MapPin, color: "bg-blue-500" },
                       { label: "Exportar Reporte Mensual", icon: BarChart3, color: "bg-surface" },
                     ].map((a, i) => (
                       <button key={i} className="w-full flex items-center justify-between p-4 bg-black/40 rounded-xl hover:bg-black/60 transition-all border border-transparent hover:border-white/10 text-left group">
                         <div className="flex items-center gap-3">
                           <div className={`p-2 rounded-lg ${a.color} ${i === 1 || i === 3 ? 'text-black' : 'text-white'}`}>
                             <a.icon className="w-4 h-4" />
                           </div>
                           <span className="text-[10px] font-black text-white uppercase">{a.label}</span>
                         </div>
                         <ArrowUpRight className="w-4 h-4 text-muted group-hover:text-white transition-colors" />
                       </button>
                     ))}
                   </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === "approvals" && (
          <motion.div key="approvals" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-black text-white uppercase italic flex items-center gap-3">
                <Award className="w-8 h-8 text-primary" /> Validación de Nodos
              </h2>
              <div className="flex gap-4">
                <div className="relative">
                   <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
                   <input className="bg-surface-light border border-border rounded-xl pl-10 pr-4 py-2.5 text-xs text-white outline-none focus:border-primary w-64" placeholder="Buscar por nombre o rider..." />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {proposals.map((p) => (
                <div key={p.id} className="card p-8 flex items-center gap-10 hover:border-primary/40 transition-all bg-gradient-to-r from-surface to-surface-light/50">
                  <div className="w-24 h-24 bg-surface-light rounded-2xl flex items-center justify-center border border-white/5 shadow-2xl relative group overflow-hidden">
                      <MapPin className="w-10 h-10 text-muted group-hover:text-primary transition-all group-hover:scale-110" />
                      <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  
                  <div className="flex-1 space-y-3">
                    <div className="flex items-center gap-4">
                      <h4 className="text-2xl font-black text-white uppercase italic tracking-tighter">{p.name}</h4>
                      <span className="px-3 py-1 bg-surface-light text-primary text-[9px] font-black rounded-full border border-primary/20 uppercase">{p.rarity}</span>
                    </div>
                    <div className="flex gap-6 text-[10px] font-mono text-muted uppercase">
                      <span className="flex items-center gap-1.5"><Users className="w-3.5 h-3.5" /> Rider: <span className="text-white font-bold">{p.profiles?.username}</span></span>
                      <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" /> Coords: <span className="text-white font-bold">{p.latitude.toFixed(5)}, {p.longitude.toFixed(5)}</span></span>
                      <span className="flex items-center gap-1.5"><Zap className="w-3.5 h-3.5" /> Valor: <span className="text-white font-bold">{p.points_value} XP</span></span>
                    </div>
                    <p className="text-sm text-muted font-medium max-w-2xl bg-black/30 p-3 rounded-lg border border-white/5">{p.description || "Sin descripción proporcionada."}</p>
                  </div>
                  
                  <div className="flex flex-col gap-3">
                    <button 
                      onClick={() => approvePoint(p)}
                      className="px-8 py-3 bg-success text-black font-black text-[10px] uppercase rounded-xl hover:scale-105 transition-all shadow-xl shadow-success/10 flex items-center gap-2"
                    >
                      <Check className="w-4 h-4" /> Aprobar Nodo
                    </button>
                    <button 
                      className="px-8 py-3 bg-destructive/10 text-destructive border border-destructive/30 font-black text-[10px] uppercase rounded-xl hover:bg-destructive hover:text-white transition-all flex items-center gap-2"
                    >
                      <X className="w-4 h-4" /> Rechazar
                    </button>
                  </div>
                </div>
              ))}
              {proposals.length === 0 && (
                <div className="card p-32 text-center border-dashed border-border/50 opacity-50 flex flex-col items-center justify-center gap-4">
                  <Shield className="w-16 h-16 text-muted" />
                  <p className="text-sm text-muted uppercase font-black italic tracking-widest">Radar Despejado: No hay nodos pendientes de validación.</p>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {activeTab === "users" && (
          <motion.div key="users" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-black text-white uppercase italic flex items-center gap-3">
                <Users className="w-8 h-8 text-primary" /> Gestión de Personal
              </h2>
            </div>
            
            <div className="card overflow-hidden border-white/5">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-surface-light text-[10px] font-black text-muted uppercase tracking-widest border-b border-white/5">
                    <th className="p-6">Rider</th>
                    <th className="p-6">Rango / Rol</th>
                    <th className="p-6">Reputación</th>
                    <th className="p-6">Facción</th>
                    <th className="p-6">Estado</th>
                    <th className="p-6 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {allUsers.map((u) => (
                    <tr key={u.id} className="hover:bg-white/[0.02] transition-colors group">
                      <td className="p-6">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-surface-light rounded-xl flex items-center justify-center font-black text-xs text-muted group-hover:text-white border border-white/5 uppercase">
                            {u.username.substring(0, 2)}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-white uppercase">{u.username}</p>
                            <p className="text-[10px] text-muted font-mono">{u.id.substring(0, 8)}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-6">
                        <span className={`px-2.5 py-1 rounded-full text-[8px] font-black uppercase ${u.role === 'admin' ? 'bg-destructive/20 text-destructive border border-destructive/30' : 'bg-primary/20 text-primary border border-primary/30'}`}>
                          {u.role || 'Rider'}
                        </span>
                      </td>
                      <td className="p-6">
                        <p className="text-sm font-black text-white italic">{u.total_points.toLocaleString()} XP</p>
                      </td>
                      <td className="p-6 text-xs text-muted font-bold uppercase">{u.faction_id ? "En Escuadrón" : "Independiente"}</td>
                      <td className="p-6">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
                          <span className="text-[9px] font-black text-success uppercase">En Línea</span>
                        </div>
                      </td>
                      <td className="p-6 text-right">
                        <button className="p-2 hover:bg-white/10 rounded-lg transition-all text-muted hover:text-white">
                          <Settings className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        {activeTab === "seasons" && (
          <motion.div key="seasons" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-8">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-black text-white uppercase italic flex items-center gap-3">
                <Calendar className="w-8 h-8 text-primary" /> Ciclos de Temporada
              </h2>
              <button 
                onClick={() => setIsCreatingSeason(true)}
                className="px-6 py-3 bg-white text-black font-black text-[10px] uppercase rounded-xl hover:bg-primary transition-all flex items-center gap-2"
              >
                <Package className="w-4 h-4" /> Iniciar Nueva Temporada
              </button>
            </div>

            <AnimatePresence>
              {isCreatingSeason && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="card p-8 border-primary/30 bg-primary/5">
                  <form onSubmit={createSeason} className="grid grid-cols-4 gap-6 items-end">
                    <div className="col-span-2">
                      <label className="text-[10px] text-muted uppercase font-black ml-1 mb-2 block">Nombre de la Operación</label>
                      <input required value={newSeason.name} onChange={e => setNewSeason({...newSeason, name: e.target.value})} className="w-full bg-surface border border-border rounded-xl px-4 py-3 text-white text-xs outline-none focus:border-primary" placeholder="Ej: Operación Verano '25" />
                    </div>
                    <div>
                      <label className="text-[10px] text-muted uppercase font-black ml-1 mb-2 block">Fecha Inicio</label>
                      <input required type="date" value={newSeason.start_date} onChange={e => setNewSeason({...newSeason, start_date: e.target.value})} className="w-full bg-surface border border-border rounded-xl px-4 py-3 text-white text-xs outline-none focus:border-primary" />
                    </div>
                    <div>
                      <label className="text-[10px] text-muted uppercase font-black ml-1 mb-2 block">Fecha Fin</label>
                      <input required type="date" value={newSeason.end_date} onChange={e => setNewSeason({...newSeason, end_date: e.target.value})} className="w-full bg-surface border border-border rounded-xl px-4 py-3 text-white text-xs outline-none focus:border-primary" />
                    </div>
                    <div className="col-span-4 flex justify-end gap-4 mt-4">
                      <button type="button" onClick={() => setIsCreatingSeason(false)} className="text-[10px] font-black text-muted uppercase hover:text-white">Cancelar</button>
                      <button type="submit" className="px-10 py-3 bg-primary text-black font-black text-[10px] uppercase rounded-xl shadow-xl">Desplegar Temporada</button>
                    </div>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="grid grid-cols-3 gap-6">
              {seasons.map((s) => (
                <div key={s.id} className={`card p-8 border-white/5 relative overflow-hidden transition-all ${s.is_active ? 'bg-primary/5 border-primary/20 shadow-[0_0_50px_rgba(245,158,11,0.05)]' : 'opacity-60 grayscale hover:opacity-100 hover:grayscale-0'}`}>
                  {s.is_active && <div className="absolute top-0 right-0 p-3 bg-primary text-black text-[8px] font-black uppercase rounded-bl-xl italic">Activa Ahora</div>}
                  <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter mb-1">{s.name}</h3>
                  <p className="text-[10px] text-muted font-mono uppercase mb-8">Periodo: {s.start_date} / {s.end_date}</p>
                  
                  <div className="flex items-center justify-between pt-6 border-t border-white/10">
                    <button 
                      onClick={() => toggleSeason(s.id, s.is_active)}
                      className={`px-4 py-2 rounded-lg text-[9px] font-black uppercase border transition-all ${s.is_active ? 'border-destructive/30 text-destructive hover:bg-destructive hover:text-white' : 'border-success/30 text-success hover:bg-success hover:text-black'}`}
                    >
                      {s.is_active ? 'Finalizar' : 'Activar'}
                    </button>
                    {!s.is_active && (
                      <button 
                        onClick={() => deleteSeason(s.id)}
                        className="p-2 text-destructive hover:bg-destructive/10 rounded-lg transition-all"
                      >
                        <Ban className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
              <button className="card border-dashed border-border/50 hover:border-primary transition-all flex flex-col items-center justify-center gap-4 py-20 bg-transparent group">
                <div className="p-4 bg-surface-light rounded-2xl group-hover:bg-primary/20 transition-all">
                  <PlusIcon className="w-8 h-8 text-muted group-hover:text-primary" />
                </div>
                <p className="text-[10px] font-black text-muted uppercase group-hover:text-white transition-colors tracking-widest">Añadir Temporada Histórica</p>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function PlusIcon(props: any) {
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
      <path d="M5 12h14" />
      <path d="M12 5v14" />
    </svg>
  );
}
