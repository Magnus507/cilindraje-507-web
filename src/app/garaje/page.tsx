"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Wrench, Bike, Save, Loader2, Gauge, Zap, Shield } from "lucide-react";

export default function GarajePage() {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [model, setModel] = useState("");

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    setLoading(true);
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
      const { data } = await supabase.from("profiles").select("*").eq("id", session.user.id).single();
      setProfile(data);
      setModel(data?.motorcycle_model || "");
    }
    setLoading(false);
  };

  const updateBike = async () => {
    setSaving(true);
    const { error } = await supabase.from("profiles").update({ motorcycle_model: model }).eq("id", profile.id);
    if (!error) await fetchProfile();
    setSaving(false);
  };

  if (loading) return <div className="flex items-center justify-center h-full"><Loader2 className="animate-spin text-primary" /></div>;

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <header>
        <h1 className="text-3xl font-black text-white tracking-tight uppercase italic">Mi Garaje</h1>
        <p className="text-muted text-sm font-mono tracking-widest">PERSONALIZACIÓN Y TELEMETRÍA DE MÁQUINA</p>
      </header>

      <div className="grid grid-cols-12 gap-8">
        {/* Bike Display */}
        <div className="col-span-7 space-y-6">
          <div className="card p-8 bg-gradient-to-br from-surface to-black border-primary/20 flex flex-col items-center text-center relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <Bike className="w-48 h-48 text-muted/20 absolute -z-0 opacity-50 rotate-12" />
            
            <div className="z-10 relative">
              <div className="p-4 bg-primary/10 rounded-full mb-6">
                <Wrench className="w-12 h-12 text-primary" />
              </div>
              <h2 className="text-3xl font-black text-white uppercase tracking-tighter italic">{profile?.motorcycle_model || "Sin Máquina"}</h2>
              <p className="text-muted font-mono text-[10px] mt-2 uppercase tracking-[0.3em]">Estado: Operativo</p>
            </div>

            <div className="grid grid-cols-3 gap-8 w-full mt-12 z-10">
              {[
                { label: "Potencia", val: "85%", icon: <Zap className="w-4 h-4" /> },
                { label: "Manejo", val: "72%", icon: <Gauge className="w-4 h-4" /> },
                { label: "Resistencia", val: "90%", icon: <Shield className="w-4 h-4" /> },
              ].map((stat, i) => (
                <div key={i} className="text-center">
                  <div className="text-primary mb-1 flex justify-center">{stat.icon}</div>
                  <p className="text-[10px] text-muted uppercase font-bold">{stat.label}</p>
                  <p className="text-xl font-black text-white">{stat.val}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="card p-6">
            <h3 className="text-xs font-bold text-white uppercase tracking-widest mb-4">Registro de Mantenimiento</h3>
            <div className="space-y-3 opacity-50">
              <div className="flex justify-between text-[10px] border-b border-border pb-2">
                <span className="text-muted">No hay registros de mantenimiento disponibles para este modelo.</span>
              </div>
            </div>
          </div>
        </div>

        {/* Edit Bike */}
        <div className="col-span-5">
          <div className="card p-6 space-y-6">
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-widest mb-1">Identificación de Máquina</h3>
              <p className="text-[10px] text-muted uppercase">Actualiza el modelo de tu motocicleta</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-[10px] text-muted uppercase font-bold ml-1">Modelo / Marca</label>
                <input 
                  value={model}
                  onChange={e => setModel(e.target.value)}
                  className="w-full mt-1 bg-surface-light border border-border rounded-lg px-4 py-3 text-white text-sm focus:border-primary outline-none"
                  placeholder="Ej: Yamaha MT-07 2023"
                />
              </div>
              
              <button 
                onClick={updateBike}
                disabled={saving || model === profile?.motorcycle_model}
                className="w-full py-4 bg-primary text-black font-black text-xs uppercase rounded-lg hover:bg-primary/80 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Save className="w-4 h-4" /> GUARDAR CAMBIOS</>}
              </button>
            </div>

            <div className="p-4 bg-surface-light/50 rounded-xl border border-border">
              <p className="text-[9px] text-muted leading-relaxed uppercase tracking-wider">
                Nota: El modelo de tu moto es visible para otros moteros en el ranking nacional. Asegúrate de que sea preciso.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
