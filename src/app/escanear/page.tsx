"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, MapPin, Scan, Loader2, AlertTriangle, CheckCircle } from "lucide-react";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";

export default function EscanearPage() {
  const [loading, setLoading] = useState(false);
  const [gpsLoading, setGpsLoading] = useState(true);
  const [location, setLocation] = useState<{lat: number, lng: number} | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [scanSuccess, setScanSuccess] = useState<any>(null);
  const [qrCode, setQrCode] = useState("");
  const router = useRouter();

  useEffect(() => {
    // Solicitar GPS al entrar
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
          setGpsLoading(false);
        },
        (err) => {
          setError("Se requiere acceso al GPS para validar el escaneo de seguridad.");
          setGpsLoading(false);
        },
        { enableHighAccuracy: true }
      );
    } else {
      setError("GPS no soportado en este dispositivo.");
      setGpsLoading(false);
    }
  }, []);

  const handleScanSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!location) {
      setError("No se puede escanear sin señal GPS.");
      return;
    }
    
    setLoading(true);
    setError(null);

    // Mock API call to validate sticker
    // In a real app we'd fetch the sticker by qrCode, calculate distance, and insert scan
    setTimeout(() => {
      setScanSuccess({
        points: 50,
        rarity: "rare",
        name: "Sticker Fantasma Nocturno"
      });
      setLoading(false);
    }, 1500);
  };

  if (scanSuccess) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center glass-panel p-8 rounded-3xl border border-primary/50">
          <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-10 h-10 text-primary" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">¡Escaneo Exitoso!</h2>
          <p className="text-gray-400 mb-6">Has capturado: <span className="text-white font-semibold">{scanSuccess.name}</span></p>
          
          <div className="bg-black/50 p-4 rounded-xl mb-8 border border-white/5">
            <p className="text-sm text-gray-500 uppercase">Recompensa</p>
            <p className="text-4xl font-black text-primary neon-text">+{scanSuccess.points} PTS</p>
          </div>

          <Link href="/dashboard">
            <button className="w-full py-3 bg-white text-black font-bold rounded-xl hover:bg-gray-200 transition-colors">
              VOLVER AL PANEL
            </button>
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col p-4 relative overflow-hidden">
      <Link href="/dashboard" className="absolute top-6 left-6 z-20 p-2 rounded-full glass-panel text-white hover:text-primary transition-colors">
        <ArrowLeft className="w-6 h-6" />
      </Link>

      <div className="flex-1 flex flex-col items-center justify-center max-w-md mx-auto w-full mt-12 z-10">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white">Escáner Táctico</h1>
          <p className="text-gray-400 mt-2">Valida tu posición y registra el código QR</p>
        </div>

        {/* GPS Status Indicator */}
        <div className={`w-full p-4 rounded-2xl mb-8 flex items-center gap-4 ${location ? 'bg-primary/10 border-primary/30' : 'bg-destructive/10 border-destructive/30'} border glass-panel`}>
          <div className={`p-3 rounded-full ${location ? 'bg-primary/20 text-primary' : 'bg-destructive/20 text-destructive'}`}>
            <MapPin className="w-6 h-6" />
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-bold text-white">Estado del Enlace GPS</h3>
            <p className="text-xs text-gray-400">
              {gpsLoading ? "Buscando satélites..." : (location ? `Lat: ${location.lat.toFixed(4)}, Lng: ${location.lng.toFixed(4)}` : "Señal perdida. Revisa tus permisos.")}
            </p>
          </div>
        </div>

        {error && (
          <div className="w-full mb-6 p-4 rounded-xl bg-destructive/20 border border-destructive/50 text-destructive-foreground flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 flex-shrink-0" />
            <p className="text-sm">{error}</p>
          </div>
        )}

        {/* Mock Scanner Viewfinder */}
        <div className="relative w-full aspect-square max-w-[280px] mx-auto mb-8">
          <div className="absolute inset-0 border-2 border-dashed border-gray-600 rounded-3xl opacity-50" />
          <div className="absolute inset-4 bg-black/40 rounded-2xl flex items-center justify-center">
            <Scan className="w-16 h-16 text-gray-500 opacity-50" />
          </div>
          {/* Corner brackets */}
          <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-primary rounded-tl-3xl" />
          <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-primary rounded-tr-3xl" />
          <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-primary rounded-bl-3xl" />
          <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-primary rounded-br-3xl" />
          
          {loading && (
             <div className="absolute inset-0 bg-primary/20 rounded-3xl flex items-center justify-center backdrop-blur-sm">
                <Loader2 className="w-10 h-10 text-primary animate-spin" />
             </div>
          )}
        </div>

        <form onSubmit={handleScanSubmit} className="w-full space-y-4">
          <input
            type="text"
            required
            value={qrCode}
            onChange={(e) => setQrCode(e.target.value)}
            placeholder="Ingrese código manual (Demo)"
            className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl focus:border-primary text-center text-white font-mono tracking-widest outline-none uppercase"
          />
          <button
            type="submit"
            disabled={loading || !location || gpsLoading}
            className="w-full py-4 bg-primary text-primary-foreground font-bold rounded-xl hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed neon-border"
          >
            {loading ? "PROCESANDO..." : "VALIDAR CÓDIGO"}
          </button>
        </form>
      </div>
    </div>
  );
}
