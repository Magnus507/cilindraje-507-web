"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Settings, User, Save, Loader2, MapPin, AlignLeft, Award } from "lucide-react";

const PROVINCIAS = [
  "Bocas del Toro", "Chiriquí", "Coclé", "Colón", "Darién", 
  "Herrera", "Los Santos", "Panamá", "Panamá Oeste", "Veraguas", "Guna Yala"
];

export default function ConfiguracionPage() {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({ 
    username: "", 
    full_name: "",
    province: "",
    bio: "",
    experience_level: "novice"
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    setLoading(true);
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
      const { data } = await supabase.from("profiles").select("*").eq("id", session.user.id).single();
      setProfile(data);
      setFormData({ 
        username: data?.username || "", 
        full_name: data?.full_name || "",
        province: data?.province || "",
        bio: data?.bio || "",
        experience_level: data?.experience_level || "novice"
      });
    }
    setLoading(false);
  };

  const updateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const { error } = await supabase.from("profiles").update(formData).eq("id", profile.id);
    if (!error) {
      await fetchProfile();
      alert("Perfil actualizado correctamente.");
    } else {
      console.error(error);
      alert("Error al actualizar: Asegúrate de haber ejecutado el script SQL en Supabase.");
    }
    setSaving(false);
  };

  if (loading) return <div className="flex items-center justify-center h-full"><Loader2 className="animate-spin text-primary" /></div>;

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <header>
        <h1 className="text-3xl font-black text-white tracking-tight uppercase italic">Configuración de Rider</h1>
        <p className="text-muted text-sm font-mono tracking-widest uppercase">Gestión de Perfil e Identidad Digital</p>
      </header>

      <div className="grid grid-cols-12 gap-8">
        <div className="col-span-8">
          <div className="card p-8">
            <form onSubmit={updateProfile} className="space-y-6">
              <div className="flex items-center gap-6 mb-8">
                <div className="w-20 h-20 rounded-full bg-surface-light border-2 border-border flex items-center justify-center overflow-hidden shadow-xl">
                   <User className="w-10 h-10 text-muted" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white uppercase italic">{profile?.username}</h3>
                  <p className="text-[10px] text-muted font-mono uppercase tracking-widest">ID: {profile?.id.substring(0, 8)}...</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="col-span-1">
                  <label className="text-[10px] text-muted uppercase font-black ml-1 tracking-widest">Alias de Rider</label>
                  <input 
                    required
                    value={formData.username}
                    onChange={e => setFormData({...formData, username: e.target.value})}
                    className="w-full mt-1.5 bg-surface-light border border-border rounded-lg px-4 py-3 text-white text-sm focus:border-primary outline-none transition-all"
                  />
                </div>
                <div className="col-span-1">
                  <label className="text-[10px] text-muted uppercase font-black ml-1 tracking-widest">Nombre Completo</label>
                  <input 
                    value={formData.full_name}
                    onChange={e => setFormData({...formData, full_name: e.target.value})}
                    className="w-full mt-1.5 bg-surface-light border border-border rounded-lg px-4 py-3 text-white text-sm focus:border-primary outline-none transition-all"
                    placeholder="Ej: Gean Carlos"
                  />
                </div>

                <div className="col-span-1">
                  <label className="text-[10px] text-muted uppercase font-black ml-1 tracking-widest flex items-center gap-2">
                    <MapPin className="w-3 h-3 text-primary" /> Provincia Base
                  </label>
                  <select 
                    value={formData.province}
                    onChange={e => setFormData({...formData, province: e.target.value})}
                    className="w-full mt-1.5 bg-surface-light border border-border rounded-lg px-4 py-3 text-white text-sm focus:border-primary outline-none transition-all"
                  >
                    <option value="">Seleccionar Provincia</option>
                    {PROVINCIAS.map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>

                <div className="col-span-1">
                  <label className="text-[10px] text-muted uppercase font-black ml-1 tracking-widest flex items-center gap-2">
                    <Award className="w-3 h-3 text-primary" /> Nivel de Experiencia
                  </label>
                  <select 
                    value={formData.experience_level}
                    onChange={e => setFormData({...formData, experience_level: e.target.value})}
                    className="w-full mt-1.5 bg-surface-light border border-border rounded-lg px-4 py-3 text-white text-sm focus:border-primary outline-none transition-all"
                  >
                    <option value="novice">Novato (Iniciando)</option>
                    <option value="intermediate">Intermedio (Rider)</option>
                    <option value="pro">Profesional (Elite)</option>
                    <option value="legend">Leyenda</option>
                  </select>
                </div>

                <div className="col-span-2">
                  <label className="text-[10px] text-muted uppercase font-black ml-1 tracking-widest flex items-center gap-2">
                    <AlignLeft className="w-3 h-3 text-primary" /> Biografía / Manifiesto
                  </label>
                  <textarea 
                    rows={4}
                    value={formData.bio}
                    onChange={e => setFormData({...formData, bio: e.target.value})}
                    className="w-full mt-1.5 bg-surface-light border border-border rounded-lg px-4 py-3 text-white text-sm focus:border-primary outline-none resize-none"
                    placeholder="Cuéntanos sobre tu pasión por las rutas..."
                  />
                </div>
              </div>

              <div className="pt-6 border-t border-border">
                <button 
                  type="submit"
                  disabled={saving}
                  className="px-10 py-4 bg-primary text-black font-black text-xs uppercase rounded-xl hover:bg-white transition-all flex items-center justify-center gap-2 shadow-xl shadow-primary/10 active:scale-95"
                >
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Save className="w-4 h-4" /> GUARDAR CAMBIOS TÁCTICOS</>}
                </button>
              </div>
            </form>
          </div>
        </div>

        <div className="col-span-4 space-y-6">
          <div className="card p-6 bg-primary/5 border-primary/20">
            <h3 className="text-xs font-black text-white uppercase italic mb-3">¿Por qué completar tu perfil?</h3>
            <p className="text-[10px] text-muted leading-relaxed uppercase font-medium">
              Tu provincia base permite que el sistema te recomiende **Stickers y Nodos cercanos**. Además, aumenta tu reputación en los rankings provinciales.
            </p>
          </div>

          <div className="card p-6 border-destructive/20 bg-destructive/5">
            <h3 className="text-sm font-black text-white uppercase italic tracking-widest mb-2">Zona de Peligro</h3>
            <p className="text-[10px] text-muted mb-4 uppercase">Las siguientes acciones son irreversibles y afectarán tu progreso en la temporada.</p>
            <button className="w-full py-3 border border-destructive/50 text-destructive text-[10px] font-black uppercase rounded-lg hover:bg-destructive hover:text-white transition-all">
              Desactivar Cuenta
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
