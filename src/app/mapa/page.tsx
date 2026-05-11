"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import AppLayout from "@/components/AppLayout";
import dynamic from "next/dynamic";
import { Map as MapIcon, Loader2, Info } from "lucide-react";

const TacticalMap = dynamic(() => import("@/components/TacticalMap"), { 
  ssr: false,
  loading: () => <div className="w-full h-full bg-surface-light animate-pulse rounded-xl" />
});

export default function MapaPage() {
  const [stickers, setStickers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const { data } = await supabase.from("stickers").select("*").eq("is_active", true);
      setStickers(data || []);
      setLoading(false);
    }
    load();
  }, []);

  if (loading) return <AppLayout><div className="flex items-center justify-center h-full"><Loader2 className="animate-spin text-primary" /></div></AppLayout>;

  return (
    <AppLayout>
      <div className="h-full flex flex-col space-y-4">
        <header className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-black text-white tracking-tight uppercase italic flex items-center gap-3">
              <MapIcon className="w-8 h-8 text-primary" /> Pantalla de Despliegue Estratégico
            </h1>
            <p className="text-muted text-sm font-mono tracking-widest uppercase">Visualización Satelital de Nodos de Interés</p>
          </div>
          <div className="flex gap-4">
             <div className="card-inner px-4 py-2 flex items-center gap-2 border-primary/20">
              <div className="w-2 h-2 bg-primary rounded-full animate-ping" />
              <span className="text-[10px] text-primary font-bold uppercase tracking-widest">Feed en Tiempo Real</span>
            </div>
          </div>
        </header>

        <div className="flex-1 card overflow-hidden relative border-primary/10">
          <TacticalMap stickers={stickers} />
          
          {/* Overlay Info Panel */}
          <div className="absolute top-4 right-4 z-[1000] w-64 space-y-3 pointer-events-none">
            <div className="glass-panel p-4 rounded-xl border border-white/10 pointer-events-auto">
              <h4 className="text-[10px] font-black text-white uppercase tracking-widest mb-3 flex items-center gap-2">
                <Info className="w-3 h-3 text-primary" /> Leyenda Táctica
              </h4>
              <div className="space-y-2">
                {[
                  { c: "bg-white", l: "Nodo Común", p: "10-50 PTS" },
                  { c: "bg-blue-400", l: "Nodo Raro", p: "100-250 PTS" },
                  { c: "bg-accent", l: "Nodo Épico", p: "500-1000 PTS" },
                  { c: "bg-primary", l: "Nodo Legendario", p: "2500+ PTS" },
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 ${item.c} rounded-full`} />
                      <span className="text-[9px] text-muted font-bold uppercase">{item.l}</span>
                    </div>
                    <span className="text-[8px] text-white font-mono">{item.p}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="glass-panel p-4 rounded-xl border border-white/10 pointer-events-auto">
              <p className="text-[9px] text-muted uppercase font-bold mb-1">Total Nodos Activos</p>
              <p className="text-2xl font-black text-white font-mono">{stickers.length}</p>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
