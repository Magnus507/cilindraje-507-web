"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { motion } from "framer-motion";
import Link from "next/link";
import { ShieldAlert, Users, QrCode, LogOut, ArrowLeft, PlusCircle } from "lucide-react";

export default function AdminPage() {
  const [profiles, setProfiles] = useState<any[]>([]);
  const [stickers, setStickers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Nuevo Sticker Form
  const [newSticker, setNewSticker] = useState({
    name: "",
    points_value: 50,
    rarity: "normal",
    availability_type: "public",
    latitude: 0,
    longitude: 0,
    qr_code_key: `QR-${Math.floor(Math.random() * 1000000)}`
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    
    // Fetch profiles
    const { data: profileData } = await supabase
      .from("profiles")
      .select("*, factions(name)");
      
    // Fetch stickers
    const { data: stickerData } = await supabase
      .from("stickers")
      .select("*");
      
    setProfiles(profileData || []);
    setStickers(stickerData || []);
    setLoading(false);
  };

  const handleCreateSticker = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.from("stickers").insert([newSticker]);
    if (!error) {
      setNewSticker({
        ...newSticker,
        name: "",
        qr_code_key: `QR-${Math.floor(Math.random() * 1000000)}`
      });
      fetchData();
    } else {
      alert("Error al crear el sticker: " + error.message);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-destructive border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col p-4 md:p-8 max-w-6xl mx-auto relative z-10">
      
      <header className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-4">
          <Link href="/dashboard" className="p-2 rounded-full glass-panel hover:bg-white/10 transition-colors">
            <ArrowLeft className="w-5 h-5 text-white" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-destructive flex items-center gap-2">
              <ShieldAlert className="w-8 h-8" /> PANEL DE CONTROL OVERSEER
            </h1>
            <p className="text-gray-400 font-mono text-sm">ACCESO CLASIFICADO - NIVEL OMEGA</p>
          </div>
        </div>
        <button className="p-2 rounded-full glass-panel border border-destructive/30 text-destructive hover:bg-destructive/20 transition-colors">
          <LogOut className="w-5 h-5" />
        </button>
      </header>

      <div className="grid lg:grid-cols-3 gap-8">
        
        {/* Formularios - Crear Sticker */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="lg:col-span-1">
          <div className="glass-panel p-6 rounded-2xl border-t border-destructive/50">
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <PlusCircle className="text-destructive w-5 h-5" /> Desplegar Nodo QR
            </h2>
            
            <form onSubmit={handleCreateSticker} className="space-y-4">
              <div>
                <label className="text-xs text-gray-400 ml-1">Nombre de Ubicación</label>
                <input required value={newSticker.name} onChange={e => setNewSticker({...newSticker, name: e.target.value})} className="w-full mt-1 px-4 py-2 bg-black/40 border border-white/10 rounded-lg text-white" placeholder="Ej: Mirador Cinta Costera" />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-gray-400 ml-1">Valor (Puntos)</label>
                  <input type="number" required value={newSticker.points_value} onChange={e => setNewSticker({...newSticker, points_value: Number(e.target.value)})} className="w-full mt-1 px-4 py-2 bg-black/40 border border-white/10 rounded-lg text-white" />
                </div>
                <div>
                  <label className="text-xs text-gray-400 ml-1">Rareza</label>
                  <select value={newSticker.rarity} onChange={e => setNewSticker({...newSticker, rarity: e.target.value})} className="w-full mt-1 px-4 py-2 bg-black/40 border border-white/10 rounded-lg text-white">
                    <option value="normal">Normal</option>
                    <option value="rare">Raro</option>
                    <option value="epic">Épico</option>
                    <option value="legendary">Legendario</option>
                  </select>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-gray-400 ml-1">Latitud GPS</label>
                  <input type="number" step="any" required value={newSticker.latitude} onChange={e => setNewSticker({...newSticker, latitude: Number(e.target.value)})} className="w-full mt-1 px-4 py-2 bg-black/40 border border-white/10 rounded-lg text-white font-mono text-xs" />
                </div>
                <div>
                  <label className="text-xs text-gray-400 ml-1">Longitud GPS</label>
                  <input type="number" step="any" required value={newSticker.longitude} onChange={e => setNewSticker({...newSticker, longitude: Number(e.target.value)})} className="w-full mt-1 px-4 py-2 bg-black/40 border border-white/10 rounded-lg text-white font-mono text-xs" />
                </div>
              </div>

              <div>
                <label className="text-xs text-gray-400 ml-1">Clave de Activación (ID del QR)</label>
                <input required value={newSticker.qr_code_key} onChange={e => setNewSticker({...newSticker, qr_code_key: e.target.value})} className="w-full mt-1 px-4 py-2 bg-destructive/10 border border-destructive/30 text-destructive font-mono text-center rounded-lg" />
              </div>

              <button type="submit" className="w-full mt-6 py-3 bg-destructive text-white font-bold rounded-xl hover:bg-destructive/80 transition-colors">
                GENERAR E IMPRIMIR
              </button>
            </form>
          </div>
        </motion.div>

        {/* Listas y Stats */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Base de Datos de Pilotos */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-panel p-6 rounded-2xl">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <Users className="text-primary w-5 h-5" /> Pilotos Activos ({profiles.length})
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-gray-400">
                <thead className="text-xs text-gray-500 uppercase bg-white/5">
                  <tr>
                    <th className="px-4 py-3 rounded-tl-lg">Alias</th>
                    <th className="px-4 py-3">Moto</th>
                    <th className="px-4 py-3">Facción</th>
                    <th className="px-4 py-3 text-right rounded-tr-lg">Puntos</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {profiles.map(p => (
                    <tr key={p.id} className="hover:bg-white/5 transition-colors">
                      <td className="px-4 py-3 font-medium text-white">{p.username}</td>
                      <td className="px-4 py-3">{p.motorcycle_model}</td>
                      <td className="px-4 py-3">{p.factions?.name || "N/A"}</td>
                      <td className="px-4 py-3 text-right text-primary font-mono">{p.total_points}</td>
                    </tr>
                  ))}
                  {profiles.length === 0 && (
                    <tr><td colSpan={4} className="px-4 py-8 text-center">No hay pilotos registrados.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </motion.div>

          {/* Base de Datos de QRs */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-panel p-6 rounded-2xl">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <QrCode className="text-accent w-5 h-5" /> Nodos Desplegados ({stickers.length})
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-gray-400">
                <thead className="text-xs text-gray-500 uppercase bg-white/5">
                  <tr>
                    <th className="px-4 py-3 rounded-tl-lg">Ubicación</th>
                    <th className="px-4 py-3">Rareza</th>
                    <th className="px-4 py-3">Código QR</th>
                    <th className="px-4 py-3 text-right rounded-tr-lg">Valor</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {stickers.map(s => (
                    <tr key={s.id} className="hover:bg-white/5 transition-colors">
                      <td className="px-4 py-3 font-medium text-white">{s.name}</td>
                      <td className="px-4 py-3 uppercase text-xs">{s.rarity}</td>
                      <td className="px-4 py-3 font-mono text-accent text-xs">{s.qr_code_key}</td>
                      <td className="px-4 py-3 text-right text-white font-mono">+{s.points_value}</td>
                    </tr>
                  ))}
                  {stickers.length === 0 && (
                    <tr><td colSpan={4} className="px-4 py-8 text-center">No hay nodos desplegados.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </motion.div>

        </div>
      </div>
    </div>
  );
}
