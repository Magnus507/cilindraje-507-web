"use client";

import { MapPin, Plus, Target, Info, CheckCircle2, Clock, AlertCircle } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function MisionesPage() {
  const [proposals, setProposals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        // We fetch the user's proposed stickers/points
        const { data } = await supabase.from("stickers").select("*").eq("creator_id", session.user.id);
        setProposals(data || []);
      }
      setLoading(false);
    }
    load();
  }, []);

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <header className="flex items-end justify-between">
        <div>
          <h1 className="text-4xl font-black text-white tracking-tighter uppercase italic">Operaciones de Campo</h1>
          <p className="text-muted text-sm font-mono tracking-widest uppercase">Expansión del Radar y Misiones Activas</p>
        </div>
        <Link href="/misiones/proponer">
          <button className="px-8 py-4 bg-primary text-black font-black text-xs uppercase rounded-xl hover:scale-105 active:scale-95 transition-all flex items-center gap-2 shadow-[0_0_20px_rgba(245,158,11,0.3)]">
            <Plus className="w-5 h-5" /> Proponer Nuevo Punto
          </button>
        </Link>
      </header>

      <div className="grid grid-cols-12 gap-8">
        {/* Active Missions */}
        <div className="col-span-8 space-y-6">
          <div className="card p-6 border-primary/20 bg-gradient-to-br from-surface to-primary/5">
             <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-primary/10 rounded-xl text-primary">
                <Target className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-xl font-black text-white uppercase italic">Misiones de Temporada</h3>
                <p className="text-xs text-muted font-mono">CONQUISTA TERRITORIAL - ACTIVA</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="card-inner p-4 flex items-center justify-between group cursor-pointer hover:border-primary/40 transition-all">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-surface-light rounded-lg flex items-center justify-center font-black text-primary">01</div>
                  <div>
                    <h4 className="text-sm font-bold text-white uppercase">El Despertar del Canal</h4>
                    <p className="text-[10px] text-muted">Escanea 3 puntos en la provincia de Panamá.</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-black text-primary">+500 XP</p>
                  <p className="text-[9px] text-muted uppercase">Recompensa</p>
                </div>
              </div>
            </div>
          </div>

          <div className="card p-6">
            <h3 className="text-sm font-bold text-white uppercase tracking-widest mb-6">Tus Propuestas de Puntos</h3>
            <div className="space-y-4">
              {proposals.map((p) => (
                <div key={p.id} className="card-inner p-4 flex items-center gap-6">
                  <div className="w-16 h-16 bg-surface-light rounded-xl flex items-center justify-center border border-border">
                    <MapPin className="w-8 h-8 text-muted" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-white uppercase">{p.name}</h4>
                    <p className="text-[10px] text-muted uppercase tracking-wider">{p.rarity} • {p.points_value} XP</p>
                  </div>
                  <div className="text-right">
                    {p.status === 'active' && <div className="flex items-center gap-1.5 text-success font-black text-[10px] uppercase"><CheckCircle2 className="w-4 h-4" /> Activo</div>}
                    {p.status === 'review' && <div className="flex items-center gap-1.5 text-amber-500 font-black text-[10px] uppercase"><Clock className="w-4 h-4" /> En Revisión</div>}
                    {p.status === 'proposed' && <div className="flex items-center gap-1.5 text-muted font-black text-[10px] uppercase"><AlertCircle className="w-4 h-4" /> Pendiente</div>}
                  </div>
                </div>
              ))}
              {proposals.length === 0 && (
                <div className="text-center py-12 opacity-50">
                  <p className="text-xs text-muted italic">No has propuesto ningún punto de interés todavía.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Info / Rules */}
        <div className="col-span-4 space-y-6">
           <div className="card p-6 space-y-6 bg-surface-light/30">
            <h3 className="text-sm font-bold text-white uppercase tracking-widest flex items-center gap-2">
              <Info className="w-4 h-4 text-primary" /> Reglas del Juego
            </h3>
            <div className="space-y-4">
              <div className="space-y-1">
                <p className="text-[11px] text-white font-bold uppercase">1. Sé el Pionero</p>
                <p className="text-[10px] text-muted leading-relaxed uppercase">Propón lugares épicos de Panamá. Si se aprueban, ganas XP pasiva por cada visita.</p>
              </div>
              <div className="space-y-1">
                <p className="text-[11px] text-white font-bold uppercase">2. Validación GPS</p>
                <p className="text-[10px] text-muted leading-relaxed uppercase">Todos los escaneos requieren validación de cercanía (50m). ¡Nada de trampas desde el sofá!</p>
              </div>
              <div className="space-y-1">
                <p className="text-[11px] text-white font-bold uppercase">3. Stickers Reales</p>
                <p className="text-[10px] text-muted leading-relaxed uppercase">Los mejores puntos recibirán un Sticker oficial con QR. Quien lo coloque gana un bonus masivo.</p>
              </div>
            </div>
          </div>

          <div className="card p-6 border-accent/20">
            <h3 className="text-[10px] font-black text-accent uppercase tracking-widest mb-2">Sistema de Recompensa</h3>
            <div className="space-y-2">
               <div className="flex justify-between items-center">
                 <span className="text-[10px] text-muted uppercase">Propuesta Aprobada</span>
                 <span className="text-xs font-black text-white">+100 XP</span>
               </div>
               <div className="flex justify-between items-center">
                 <span className="text-[10px] text-muted uppercase">Check-in Normal</span>
                 <span className="text-xs font-black text-white">+50 XP</span>
               </div>
               <div className="flex justify-between items-center">
                 <span className="text-[10px] text-muted uppercase">Pasivo (Creador)</span>
                 <span className="text-xs font-black text-white">+5 XP</span>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
