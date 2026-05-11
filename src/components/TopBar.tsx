"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import { Trophy, ChevronRight, LogOut, Bell, Mail } from "lucide-react";

export default function TopBar() {
  const [profile, setProfile] = useState<any>(null);
  const [season, setSeason] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    async function load() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;
      const { data: p } = await supabase.from("profiles").select("username, total_points").eq("id", session.user.id).single();
      setProfile(p);
      const { data: s } = await supabase.from("seasons").select("*").eq("is_active", true).single();
      setSeason(s);
    }
    load();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  const userLevel = Math.floor((profile?.total_points || 0) / 500) + 1;
  const initials = (profile?.username || "??").substring(0, 2).toUpperCase();

  return (
    <header className="h-14 bg-surface border-b border-border flex items-center justify-between px-6 sticky top-0 z-30">
      <div className="flex items-center gap-4 flex-1">
        <div className="flex items-center gap-3 px-4 py-1.5 card-inner">
          <Trophy className="w-4 h-4 text-primary" />
          <div>
            <p className="text-[10px] font-bold text-primary uppercase tracking-wider">{season?.name || "Sin Temporada Activa"}</p>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <button className="relative p-2 text-muted hover:text-white transition-colors"><Bell className="w-5 h-5" /></button>
        <button className="p-2 text-muted hover:text-white transition-colors"><Mail className="w-5 h-5" /></button>
        <button onClick={handleLogout} className="p-2 text-muted hover:text-destructive transition-colors" title="Cerrar Sesión"><LogOut className="w-5 h-5" /></button>
        <div className="flex items-center gap-3 pl-4 border-l border-border">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-amber-600 flex items-center justify-center text-black font-bold text-sm">{initials}</div>
          <div className="text-right">
            <p className="text-sm font-bold text-white">{profile?.username || "..."}</p>
            <p className="text-[10px] text-muted">Nivel {userLevel}</p>
          </div>
        </div>
      </div>
    </header>
  );
}
