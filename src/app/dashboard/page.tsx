"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import { LogOut, Map, ScanLine, Trophy, User, Shield } from "lucide-react";

export default function Dashboard() {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchProfile = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        router.push("/login");
        return;
      }

      const { data } = await supabase
        .from("profiles")
        .select(`*, factions(name, color_hex)`)
        .eq("id", session.user.id)
        .single();
        
      setProfile(data);
      setLoading(false);
    };

    fetchProfile();
  }, [router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col px-4 py-8 max-w-4xl mx-auto relative z-10">
      
      {/* Header */}
      <header className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Panel de Control</h1>
          <p className="text-primary neon-text font-mono text-sm">SISTEMA ONLINE</p>
        </div>
        <button onClick={handleLogout} className="p-2 rounded-full glass-panel hover:bg-destructive/20 text-gray-400 hover:text-destructive transition-colors">
          <LogOut className="w-5 h-5" />
        </button>
      </header>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
        
        {/* User Card */}
        <div className="glass-panel p-6 rounded-3xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-bl-full -z-10" />
          
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0 border border-white/20">
              <User className="w-8 h-8 text-white" />
            </div>
            
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-white">{profile?.username || "Piloto Desconocido"}</h2>
              <div className="flex items-center gap-2 text-sm mt-1">
                <Shield className="w-4 h-4 text-primary" />
                <span className="text-gray-300">{profile?.factions?.name || "Sin Facción"}</span>
              </div>
            </div>
            
            <div className="text-right">
              <p className="text-xs text-gray-400 uppercase tracking-wide">Puntos Totales</p>
              <p className="text-3xl font-black text-primary neon-text">{profile?.total_points || 0}</p>
            </div>
          </div>
        </div>

        {/* Quick Actions Grid */}
        <div className="grid grid-cols-2 gap-4">
          <Link href="/escanear">
            <div className="glass-panel p-6 rounded-3xl flex flex-col items-center justify-center gap-3 hover:bg-primary/10 transition-colors border border-transparent hover:border-primary/50 group cursor-pointer aspect-square">
              <ScanLine className="w-12 h-12 text-white group-hover:scale-110 transition-transform group-hover:text-primary" />
              <span className="font-semibold text-white">Escanear QR</span>
            </div>
          </Link>
          
          <Link href="/mapa">
            <div className="glass-panel p-6 rounded-3xl flex flex-col items-center justify-center gap-3 hover:bg-accent/10 transition-colors border border-transparent hover:border-accent/50 group cursor-pointer aspect-square">
              <Map className="w-12 h-12 text-white group-hover:scale-110 transition-transform group-hover:text-accent" />
              <span className="font-semibold text-white">Mapa Táctico</span>
            </div>
          </Link>

          <Link href="/ranking" className="col-span-2">
            <div className="glass-panel p-6 rounded-3xl flex items-center justify-between hover:bg-white/5 transition-colors cursor-pointer border border-white/5">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-full bg-yellow-500/20 text-yellow-500">
                  <Trophy className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-white">Ranking Nacional</h3>
                  <p className="text-sm text-gray-400">Compite contra otras facciones</p>
                </div>
              </div>
              <div className="text-gray-500 font-mono text-sm">
                VER LÍDERES
              </div>
            </div>
          </Link>
        </div>

      </motion.div>
    </div>
  );
}
