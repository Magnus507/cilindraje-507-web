"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import AppLayout from "@/components/AppLayout";
import { Settings, User, Save, Loader2, Mail, ShieldCheck } from "lucide-react";

export default function ConfiguracionPage() {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({ username: "", full_name: "" });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    setLoading(true);
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
      const { data } = await supabase.from("profiles").select("*").eq("id", session.user.id).single();
      setProfile(data);
      setFormData({ username: data?.username || "", full_name: data?.full_name || "" });
    }
    setLoading(false);
  };

  const updateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const { error } = await supabase.from("profiles").update(formData).eq("id", profile.id);
    if (!error) await fetchProfile();
    setSaving(false);
  };

  if (loading) return <AppLayout><div className="flex items-center justify-center h-full"><Loader2 className="animate-spin text-primary" /></div></AppLayout>;

  return (
    <AppLayout>
      <div className="max-w-3xl mx-auto space-y-8">
        <header>
          <h1 className="text-3xl font-black text-white tracking-tight uppercase italic">Configuración</h1>
          <p className="text-muted text-sm font-mono tracking-widest uppercase">Gestión de Perfil e Identidad Digital</p>
        </header>

        <div className="grid grid-cols-1 gap-8">
          <div className="card p-8">
            <form onSubmit={updateProfile} className="space-y-6">
              <div className="flex items-center gap-6 mb-8">
                <div className="w-20 h-20 rounded-full bg-surface-light border-2 border-border flex items-center justify-center overflow-hidden">
                   <User className="w-10 h-10 text-muted" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white uppercase">{profile?.username}</h3>
                  <p className="text-xs text-muted font-mono">{profile?.id}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="text-[10px] text-muted uppercase font-bold ml-1">Alias de Rider (Username)</label>
                  <input 
                    required
                    value={formData.username}
                    onChange={e => setFormData({...formData, username: e.target.value})}
                    className="w-full mt-1 bg-surface-light border border-border rounded-lg px-4 py-3 text-white text-sm focus:border-primary outline-none"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-muted uppercase font-bold ml-1">Nombre Completo</label>
                  <input 
                    value={formData.full_name}
                    onChange={e => setFormData({...formData, full_name: e.target.value})}
                    className="w-full mt-1 bg-surface-light border border-border rounded-lg px-4 py-3 text-white text-sm focus:border-primary outline-none"
                    placeholder="Tu nombre real (opcional)"
                  />
                </div>
              </div>

              <div className="pt-6 border-t border-border">
                <button 
                  type="submit"
                  disabled={saving}
                  className="px-8 py-3 bg-primary text-black font-black text-xs uppercase rounded-lg hover:bg-primary/80 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Save className="w-4 h-4" /> ACTUALIZAR PERFIL</>}
                </button>
              </div>
            </form>
          </div>

          <div className="card p-6 border-destructive/20 bg-destructive/5">
            <h3 className="text-sm font-bold text-white uppercase tracking-widest mb-2">Zona de Peligro</h3>
            <p className="text-xs text-muted mb-4">Las siguientes acciones son irreversibles y afectarán tu progreso en la temporada.</p>
            <button className="px-6 py-2 border border-destructive/50 text-destructive text-[10px] font-bold uppercase rounded-lg hover:bg-destructive/10 transition-colors">
              Desactivar Cuenta
            </button>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
