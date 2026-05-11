"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import { MapPin, Camera, Save, Loader2, ChevronLeft, Shield } from "lucide-react";
import Link from "next/link";

export default function ProponerPuntoPage() {
  const [loading, setLoading] = useState(false);
  const [locating, setLocating] = useState(false);
  const [coords, setCoords] = useState<{lat: number, lng: number} | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    rarity: "normal",
    availability_type: "public",
    territory_id: ""
  });
  const [territories, setTerritories] = useState<any[]>([]);
  const router = useRouter();

  useEffect(() => {
    async function load() {
      const { data } = await supabase.from("territories").select("*");
      setTerritories(data || []);
      if (data && data.length > 0) setFormData(prev => ({...prev, territory_id: data[0].id}));
    }
    load();
  }, []);

  const getGPS = () => {
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setLocating(false);
      },
      () => {
        alert("No se pudo obtener la ubicación GPS.");
        setLocating(false);
      }
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!coords) return alert("Debes capturar tu ubicación GPS actual.");
    
    setLoading(true);
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) return router.push("/login");

    const payload = {
      ...formData,
      latitude: coords.lat,
      longitude: coords.lng,
      creator_id: session.user.id,
      status: "review",
      qr_code_key: `PROPOSAL-${Date.now()}-${Math.random().toString(36).substring(7)}`,
      points_value: formData.rarity === 'normal' ? 50 : formData.rarity === 'rare' ? 150 : 500,
      is_active: false
    };

    const { error } = await supabase.from("stickers").insert([payload]);

    if (!error) {
      router.push("/misiones");
    } else {
      console.error(error);
      alert("Error al enviar la propuesta.");
    }
    setLoading(false);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <header className="flex items-center gap-4">
        <Link href="/misiones">
          <button className="p-2 hover:bg-surface-light rounded-full transition-colors">
            <ChevronLeft className="w-6 h-6 text-white" />
          </button>
        </Link>
        <div>
          <h1 className="text-2xl font-black text-white uppercase italic">Proponer Nuevo Punto</h1>
          <p className="text-[10px] text-muted font-mono tracking-widest uppercase">Expansión del Radar Táctico</p>
        </div>
      </header>

      <div className="card p-8 bg-gradient-to-b from-surface to-surface-light">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div className="col-span-2">
              <label className="text-[10px] text-muted uppercase font-black ml-1 tracking-widest">Nombre del Punto de Interés</label>
              <input 
                required 
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
                className="w-full mt-1.5 bg-surface border border-border rounded-lg px-4 py-3 text-white text-sm focus:border-primary outline-none transition-colors" 
                placeholder="Ej: Mirador de Campana"
              />
            </div>

            <div className="col-span-2">
              <label className="text-[10px] text-muted uppercase font-black ml-1 tracking-widest">Descripción Táctica</label>
              <textarea 
                required 
                rows={3}
                value={formData.description}
                onChange={e => setFormData({...formData, description: e.target.value})}
                className="w-full mt-1.5 bg-surface border border-border rounded-lg px-4 py-3 text-white text-sm focus:border-primary outline-none resize-none" 
                placeholder="Describe el lugar, accesos y por qué debería ser un punto..."
              />
            </div>

            <div>
              <label className="text-[10px] text-muted uppercase font-black ml-1 tracking-widest">Provincia / Territorio</label>
              <select 
                value={formData.territory_id}
                onChange={e => setFormData({...formData, territory_id: e.target.value})}
                className="w-full mt-1.5 bg-surface border border-border rounded-lg px-4 py-3 text-white text-sm focus:border-primary outline-none"
              >
                {territories.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
              </select>
            </div>

            <div>
              <label className="text-[10px] text-muted uppercase font-black ml-1 tracking-widest">Rareza Estimada</label>
              <select 
                value={formData.rarity}
                onChange={e => setFormData({...formData, rarity: e.target.value})}
                className="w-full mt-1.5 bg-surface border border-border rounded-lg px-4 py-3 text-white text-sm focus:border-primary outline-none"
              >
                <option value="normal">Normal (Básico)</option>
                <option value="rare">Raro (Difícil)</option>
                <option value="epic">Épico (Legendario)</option>
              </select>
            </div>
          </div>

          <div className="p-6 bg-surface rounded-xl border border-dashed border-border space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-white uppercase">Validación GPS Requerida</p>
                <p className="text-[10px] text-muted">Debes estar en el lugar para proponerlo.</p>
              </div>
              <button 
                type="button"
                onClick={getGPS}
                className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase transition-all flex items-center gap-2 ${coords ? 'bg-success/20 text-success border border-success/30' : 'bg-primary text-black'}`}
              >
                {locating ? <Loader2 className="w-4 h-4 animate-spin" /> : coords ? "Ubicación Capturada" : <><MapPin className="w-4 h-4" /> Capturar GPS</>}
              </button>
            </div>
            {coords && (
              <div className="text-[9px] font-mono text-muted">
                LAT: {coords.lat.toFixed(6)} | LNG: {coords.lng.toFixed(6)}
              </div>
            )}
          </div>

          <div className="flex gap-4">
            <button 
              type="submit"
              disabled={loading || !coords}
              className="flex-1 py-4 bg-white text-black font-black text-xs uppercase rounded-lg hover:bg-primary transition-all flex items-center justify-center gap-2 shadow-xl disabled:opacity-50"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Save className="w-4 h-4" /> ENVIAR PROPUESTA</>}
            </button>
          </div>

          <p className="text-[9px] text-muted text-center uppercase tracking-widest leading-relaxed">
            Al enviar, tu propuesta será revisada por el mando central (Admin). <br/>
            Ganarás 100 XP si es aprobada.
          </p>
        </form>
      </div>
    </div>
  );
}
