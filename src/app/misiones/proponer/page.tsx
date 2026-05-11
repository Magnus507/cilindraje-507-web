"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import { MapPin, Camera, Save, Loader2, ChevronLeft, Shield, AlertTriangle } from "lucide-react";
import Link from "next/link";

const PROVINCIAS_FALLBACK = [
  "Panamá", "Panamá Oeste", "Chiriquí", "Coclé", "Colón", "Herrera", "Los Santos", "Veraguas", "Bocas del Toro", "Darién"
];

export default function ProponerPuntoPage() {
  const [loading, setLoading] = useState(false);
  const [locating, setLocating] = useState(false);
  const [coords, setCoords] = useState<{lat: number, lng: number} | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    rarity: "normal",
    availability_type: "public",
    territory_id: "" // This is the UUID
  });
  const [territories, setTerritories] = useState<any[]>([]);
  const router = useRouter();

  useEffect(() => {
    async function load() {
      const { data } = await supabase.from("territories").select("*");
      if (data && data.length > 0) {
        setTerritories(data);
        setFormData(prev => ({...prev, territory_id: data[0].id}));
      } else {
        // Handle empty territories from DB
        setTerritories([]);
      }
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
        alert("No se pudo obtener la ubicación GPS. Verifica los permisos de tu navegador.");
        setLocating(false);
      },
      { enableHighAccuracy: true }
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!coords) return alert("Debes capturar tu ubicación GPS actual.");
    
    setLoading(true);
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) return router.push("/login");

    // We use the territory_id if available, otherwise we might have an issue
    if (territories.length === 0) {
      alert("Error: No hay territorios configurados en el sistema. Contacta al admin.");
      setLoading(false);
      return;
    }

    const payload = {
      name: formData.name,
      description: formData.description,
      rarity: formData.rarity,
      availability_type: formData.availability_type,
      territory_id: formData.territory_id,
      latitude: coords.lat,
      longitude: coords.lng,
      creator_id: session.user.id,
      status: "review",
      qr_code_key: `PROPOSAL-${Date.now()}-${Math.random().toString(36).substring(7).toUpperCase()}`,
      points_value: formData.rarity === 'normal' ? 50 : formData.rarity === 'rare' ? 150 : 500,
      is_active: false
    };

    const { error } = await supabase.from("stickers").insert([payload]);

    if (!error) {
      alert("¡Propuesta enviada con éxito! El mando central la revisará pronto.");
      router.push("/misiones");
    } else {
      console.error(error);
      alert("Error al enviar la propuesta: Asegúrate de haber ejecutado el script SQL en Supabase (SUPABASE_UPDATE.sql)");
    }
    setLoading(false);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8 pb-20">
      <header className="flex items-center gap-4">
        <Link href="/misiones">
          <button className="p-2 hover:bg-surface-light rounded-full transition-colors border border-border">
            <ChevronLeft className="w-6 h-6 text-white" />
          </button>
        </Link>
        <div>
          <h1 className="text-3xl font-black text-white uppercase italic tracking-tighter leading-none">Proponer Nodo</h1>
          <p className="text-[10px] text-muted font-mono tracking-widest uppercase mt-1">Expansión del Radar Táctico v2.0</p>
        </div>
      </header>

      <div className="card p-8 bg-gradient-to-b from-surface to-surface-light shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-primary/30" />
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div className="col-span-2">
              <label className="text-[10px] text-muted uppercase font-black ml-1 tracking-widest">Designación del Punto</label>
              <input 
                required 
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
                className="w-full mt-1.5 bg-surface border border-border rounded-xl px-5 py-4 text-white text-sm font-bold focus:border-primary outline-none transition-all shadow-inner" 
                placeholder="Ej: Mirador del West"
              />
            </div>

            <div className="col-span-2">
              <label className="text-[10px] text-muted uppercase font-black ml-1 tracking-widest">Inteligencia / Descripción</label>
              <textarea 
                required 
                rows={4}
                value={formData.description}
                onChange={e => setFormData({...formData, description: e.target.value})}
                className="w-full mt-1.5 bg-surface border border-border rounded-xl px-5 py-4 text-white text-sm font-medium focus:border-primary outline-none resize-none shadow-inner" 
                placeholder="Describe el acceso, por qué es un buen punto y qué encontrarán otros riders..."
              />
            </div>

            <div>
              <label className="text-[10px] text-muted uppercase font-black ml-1 tracking-widest">Provincia de Operación</label>
              {territories.length > 0 ? (
                <select 
                  value={formData.territory_id}
                  onChange={e => setFormData({...formData, territory_id: e.target.value})}
                  className="w-full mt-1.5 bg-surface border border-border rounded-xl px-5 py-4 text-white text-sm font-bold focus:border-primary outline-none shadow-inner cursor-pointer"
                >
                  {territories.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                </select>
              ) : (
                <div className="mt-1.5 p-4 bg-destructive/10 border border-destructive/20 rounded-xl flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-destructive" />
                  <span className="text-[10px] text-destructive uppercase font-bold tracking-tight">Territorios No Encontrados</span>
                </div>
              )}
            </div>

            <div>
              <label className="text-[10px] text-muted uppercase font-black ml-1 tracking-widest">Potencial de Rareza</label>
              <select 
                value={formData.rarity}
                onChange={e => setFormData({...formData, rarity: e.target.value})}
                className="w-full mt-1.5 bg-surface border border-border rounded-xl px-5 py-4 text-white text-sm font-bold focus:border-primary outline-none shadow-inner cursor-pointer"
              >
                <option value="normal">Normal (Acceso Fácil)</option>
                <option value="rare">Raro (Ruta Moderada)</option>
                <option value="epic">Épico (Solo Expertos)</option>
                <option value="legendary">Legendario (Punto Mítico)</option>
              </select>
            </div>
          </div>

          <div className="p-6 bg-surface-light rounded-2xl border border-dashed border-border/50 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-black text-white uppercase italic tracking-tight">Sincronización GPS</p>
                <p className="text-[10px] text-muted uppercase font-mono mt-0.5">Validación de presencia requerida</p>
              </div>
              <button 
                type="button"
                onClick={getGPS}
                className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase transition-all flex items-center gap-2 ${coords ? 'bg-success/20 text-success border border-success/30 shadow-[0_0_15px_rgba(34,197,94,0.1)]' : 'bg-primary text-black shadow-lg shadow-primary/20'}`}
              >
                {locating ? <Loader2 className="w-4 h-4 animate-spin" /> : coords ? "Ubicación Asegurada" : <><MapPin className="w-4 h-4" /> Capturar Coordenadas</>}
              </button>
            </div>
            {coords && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-3 bg-black/40 rounded-lg text-center">
                <span className="text-[10px] font-mono text-primary font-bold tracking-widest">
                  LAT: {coords.lat.toFixed(6)} | LNG: {coords.lng.toFixed(6)}
                </span>
              </motion.div>
            )}
          </div>

          <button 
            type="submit"
            disabled={loading || !coords || territories.length === 0}
            className="w-full py-5 bg-white text-black font-black text-xs uppercase rounded-xl hover:bg-primary transition-all flex items-center justify-center gap-3 shadow-2xl active:scale-95 disabled:opacity-20"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Save className="w-5 h-5" /> Enviar Propuesta a Revisión</>}
          </button>

          <p className="text-[9px] text-muted text-center uppercase tracking-widest leading-relaxed font-bold">
            Nota: Al proponer un punto, aceptas que sea público para la red. <br/>
            Si se aprueba, recibirás un bonus de 100 XP y XP pasiva.
          </p>
        </form>
      </div>
    </div>
  );
}
