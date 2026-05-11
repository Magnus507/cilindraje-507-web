"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, Map as MapIcon, Crosshair, Navigation, AlertCircle } from "lucide-react";

export default function MapaPage() {
  const [activeZone, setActiveZone] = useState<number | null>(null);

  const mockZones = [
    { id: 1, name: "Sector Norte", status: "controlado", faction: "Fantasmas", points: 15400, top: "20%", left: "30%" },
    { id: 2, name: "Zona Cero", status: "disputa", faction: "Ninguna", points: 8200, top: "45%", left: "50%" },
    { id: 3, name: "Puerto Este", status: "controlado", faction: "Titanes", points: 21000, top: "60%", left: "75%" },
    { id: 4, name: "Valle Sur", status: "bloqueado", faction: "N/A", points: 0, top: "80%", left: "40%" },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#050508] relative overflow-hidden">
      
      {/* Tactical Map Background */}
      <div className="absolute inset-0 opacity-30 bg-[url('https://upload.wikimedia.org/wikipedia/commons/4/4b/Panama_location_map.svg')] bg-no-repeat bg-center bg-contain" style={{ filter: 'invert(1) sepia(1) saturate(5) hue-rotate(100deg)' }} />
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-20 mix-blend-overlay" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#050508] via-transparent to-[#050508]/80" />

      {/* Header Overlay */}
      <div className="absolute top-0 left-0 w-full p-6 z-20 flex justify-between items-start pointer-events-none">
        <Link href="/dashboard" className="p-3 rounded-full glass-panel text-white hover:text-primary transition-colors pointer-events-auto">
          <ArrowLeft className="w-6 h-6" />
        </Link>
        <div className="text-right">
          <h1 className="text-2xl font-bold text-white uppercase tracking-widest flex items-center justify-end gap-2">
            <MapIcon className="w-6 h-6 text-primary" /> MAPA TÁCTICO
          </h1>
          <p className="text-primary font-mono text-sm">ENLACE SATELITAL ACTIVO</p>
        </div>
      </div>

      {/* Map Nodes */}
      <div className="absolute inset-0 z-10">
        {mockZones.map((zone) => (
          <div key={zone.id} className="absolute" style={{ top: zone.top, left: zone.left }}>
            <button
              onClick={() => setActiveZone(zone.id)}
              className={`relative flex items-center justify-center w-12 h-12 -mt-6 -ml-6 group transition-transform ${activeZone === zone.id ? 'scale-125' : 'hover:scale-110'}`}
            >
              <div className={`absolute inset-0 rounded-full animate-ping opacity-20 ${zone.status === 'disputa' ? 'bg-yellow-500' : zone.status === 'controlado' ? 'bg-primary' : 'bg-red-500'}`} />
              <div className={`w-4 h-4 rounded-full ${zone.status === 'disputa' ? 'bg-yellow-500' : zone.status === 'controlado' ? 'bg-primary' : 'bg-red-500'}`} />
              <Crosshair className={`absolute w-12 h-12 ${zone.status === 'disputa' ? 'text-yellow-500' : zone.status === 'controlado' ? 'text-primary' : 'text-red-500'} opacity-50 group-hover:opacity-100 transition-opacity`} />
            </button>

            {/* Info Panel popup */}
            {activeZone === zone.id && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute top-8 left-8 w-48 glass-panel p-3 rounded-lg border-l-4"
                style={{ borderLeftColor: zone.status === 'disputa' ? '#eab308' : zone.status === 'controlado' ? '#10b981' : '#ef4444' }}
              >
                <h3 className="text-white font-bold text-sm mb-1">{zone.name}</h3>
                <div className="text-xs text-gray-400 space-y-1 font-mono">
                  <p>ESTADO: <span className="text-white">{zone.status.toUpperCase()}</span></p>
                  <p>FACCIÓN: <span className="text-white">{zone.faction}</span></p>
                  <p>PUNTOS: <span className="text-primary">{zone.points}</span></p>
                </div>
              </motion.div>
            )}
          </div>
        ))}
      </div>

      {/* Bottom Interface */}
      <div className="absolute bottom-0 left-0 w-full p-6 z-20">
        <div className="max-w-md mx-auto glass-panel p-4 rounded-2xl flex items-center gap-4">
          <div className="p-3 bg-primary/20 rounded-xl">
            <Navigation className="w-6 h-6 text-primary" />
          </div>
          <div className="flex-1">
            <h4 className="text-sm font-bold text-white">Buscando Nodos Cercanos</h4>
            <div className="w-full h-1.5 bg-white/10 rounded-full mt-2 overflow-hidden">
              <div className="h-full bg-primary w-2/3 animate-pulse" />
            </div>
          </div>
          <AlertCircle className="w-6 h-6 text-gray-500" />
        </div>
      </div>
    </div>
  );
}
