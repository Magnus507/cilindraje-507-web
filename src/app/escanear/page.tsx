"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, MapPin, Scan, Loader2, AlertTriangle, CheckCircle, Shield, Award, Zap } from "lucide-react";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";

// Helper function for distance
function getDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371e3; // metres
  const φ1 = lat1 * Math.PI/180;
  const φ2 = lat2 * Math.PI/180;
  const Δφ = (lat2-lat1) * Math.PI/180;
  const Δλ = (lon2-lon1) * Math.PI/180;

  const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
          Math.cos(φ1) * Math.cos(φ2) *
          Math.sin(Δλ/2) * Math.sin(Δλ/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

  return R * c; // in metres
}

export default function EscanearPage() {
  const [loading, setLoading] = useState(false);
  const [gpsLoading, setGpsLoading] = useState(true);
  const [location, setLocation] = useState<{lat: number, lng: number} | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [scanSuccess, setScanSuccess] = useState<any>(null);
  const [qrCode, setQrCode] = useState("");
  const router = useRouter();

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({ lat: position.coords.latitude, lng: position.coords.longitude });
          setGpsLoading(false);
        },
        () => {
          setError("Se requiere acceso al GPS para validar tu posición táctica.");
          setGpsLoading(false);
        },
        { enableHighAccuracy: true }
      );
    } else {
      setError("GPS no soportado.");
      setGpsLoading(false);
    }
  }, []);

  const handleScanSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!location) return setError("Esperando señal GPS...");
    
    setLoading(true);
    setError(null);

    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return router.push("/login");

    // 1. Fetch Sticker
    const { data: sticker, error: sError } = await supabase
      .from("stickers")
      .select("*")
      .eq("qr_code_key", qrCode.trim().toUpperCase())
      .single();

    if (sError || !sticker) {
      setError("Código QR no reconocido o inactivo.");
      setLoading(false);
      return;
    }

    if (!sticker.is_active) {
      setError("Este nodo ha sido desactivado por el mando central.");
      setLoading(false);
      return;
    }

    // 2. Validate Distance (max 100m)
    const dist = getDistance(location.lat, location.lng, sticker.latitude, sticker.longitude);
    if (dist > 150) { // 150m for some tolerance
      setError(`Demasiado lejos del nodo. Distancia actual: ${Math.round(dist)}m. Debes estar a menos de 100m.`);
      setLoading(false);
      return;
    }

    // 3. Register Scan (one per day per user/sticker)
    const { error: iError } = await supabase.from("scans").insert([{
      user_id: session.user.id,
      sticker_id: sticker.id,
      scan_latitude: location.lat,
      scan_longitude: location.lng,
      is_gps_valid: true
    }]);

    if (iError) {
      if (iError.code === '23505') {
        setError("Ya has escaneado este nodo hoy. Vuelve mañana.");
      } else {
        setError("Error de red al registrar escaneo.");
      }
      setLoading(false);
      return;
    }

    // 4. Award XP (Visitor)
    const { data: profile } = await supabase.from("profiles").select("total_points, faction_id").eq("id", session.user.id).single();
    if (profile) {
      const xpGain = sticker.points_value || 50;
      await supabase.from("profiles").update({ total_points: (profile.total_points || 0) + xpGain }).eq("id", session.user.id);
      
      // Aportar a la facción
      if (profile.faction_id) {
        const { data: fac } = await supabase.from("factions").select("total_points").eq("id", profile.faction_id).single();
        if (fac) {
           await supabase.from("factions").update({ total_points: (fac.total_points || 0) + xpGain }).eq("id", profile.faction_id);
        }
      }

      // 5. Passive XP for Creator
      if (sticker.creator_id) {
        const { data: creator } = await supabase.from("profiles").select("total_points").eq("id", sticker.creator_id).single();
        if (creator) {
          await supabase.from("profiles").update({ total_points: (creator.total_points || 0) + 5 }).eq("id", sticker.creator_id);
        }
      }

      setScanSuccess({
        name: sticker.name,
        points: xpGain,
        rarity: sticker.rarity
      });
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col p-4 relative overflow-hidden bg-black">
      <Link href="/dashboard" className="absolute top-6 left-6 z-20 p-2 rounded-full bg-surface-light border border-border text-white hover:text-primary transition-colors">
        <ArrowLeft className="w-6 h-6" />
      </Link>

      <AnimatePresence mode="wait">
        {scanSuccess ? (
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }} 
            animate={{ scale: 1, opacity: 1 }}
            className="flex-1 flex flex-col items-center justify-center text-center max-w-md mx-auto"
          >
            <div className="w-24 h-24 bg-success/20 rounded-full flex items-center justify-center mb-6 border-2 border-success/50 shadow-[0_0_50px_rgba(34,197,94,0.3)]">
              <CheckCircle className="w-12 h-12 text-success" />
            </div>
            <h2 className="text-4xl font-black text-white italic uppercase tracking-tighter mb-2">¡Misión Cumplida!</h2>
            <p className="text-muted text-sm uppercase font-mono tracking-widest mb-8">NODO ASEGURADO: {scanSuccess.name}</p>
            
            <div className="w-full card p-8 border-primary/30 relative overflow-hidden mb-10">
              <div className="absolute top-0 left-0 w-full h-1 bg-primary" />
              <p className="text-[10px] text-muted uppercase font-black tracking-[0.4em] mb-2">Recompensa Obtenida</p>
              <div className="flex items-center justify-center gap-2">
                <Zap className="w-8 h-8 text-primary fill-primary" />
                <p className="text-6xl font-black text-white tracking-tighter">+{scanSuccess.points}</p>
                <p className="text-xl font-bold text-primary mt-4">XP</p>
              </div>
              <p className="text-[10px] text-accent font-black uppercase mt-4 tracking-widest">Rarity: {scanSuccess.rarity}</p>
            </div>

            <Link href="/dashboard" className="w-full">
              <button className="w-full py-5 bg-white text-black font-black text-xs uppercase rounded-xl hover:bg-primary transition-all active:scale-95 shadow-xl">
                Volver al Cuartel
              </button>
            </Link>
          </motion.div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center max-w-md mx-auto w-full z-10">
             <header className="text-center mb-10">
              <h1 className="text-3xl font-black text-white uppercase italic tracking-tight">Escáner Táctico</h1>
              <p className="text-muted text-xs font-mono tracking-widest mt-1 uppercase">Validación de Enlace Satelital</p>
            </header>

            {/* GPS HUD */}
            <div className={`w-full p-5 rounded-2xl mb-8 flex items-center gap-5 border transition-all ${location ? 'bg-primary/5 border-primary/20 shadow-[0_0_30px_rgba(245,158,11,0.05)]' : 'bg-destructive/5 border-destructive/20'}`}>
              <div className={`p-4 rounded-xl ${location ? 'bg-primary/20 text-primary shadow-[0_0_15px_rgba(245,158,11,0.2)]' : 'bg-destructive/20 text-destructive'}`}>
                <MapPin className={`w-7 h-7 ${!location && 'animate-pulse'}`} />
              </div>
              <div className="flex-1">
                <h3 className={`text-[10px] font-black uppercase tracking-widest ${location ? 'text-primary' : 'text-destructive'}`}>
                  {location ? "ENLACE GPS ESTABLE" : "BUSCANDO SEÑAL..."}
                </h3>
                <p className="text-xs text-white font-mono mt-1">
                  {location ? `${location.lat.toFixed(5)}° N, ${location.lng.toFixed(5)}° W` : "Esperando coordenadas..."}
                </p>
              </div>
            </div>

            {error && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="w-full mb-8 p-4 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive flex items-center gap-3">
                <AlertTriangle className="w-5 h-5 flex-shrink-0" />
                <p className="text-[10px] font-black uppercase leading-tight">{error}</p>
              </motion.div>
            )}

            {/* Viewfinder Overlay */}
            <div className="relative w-full aspect-square max-w-[300px] mx-auto mb-10">
              <div className="absolute inset-0 border-[1px] border-white/10 rounded-[40px]" />
              <div className="absolute inset-8 border border-primary/20 rounded-3xl flex items-center justify-center bg-primary/5 overflow-hidden">
                <Scan className="w-20 h-20 text-primary opacity-20" />
                {/* Scanning line animation */}
                <motion.div 
                  animate={{ top: ["0%", "100%", "0%"] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                  className="absolute left-0 right-0 h-[2px] bg-primary shadow-[0_0_15px_rgba(245,158,11,1)] z-10"
                />
              </div>
              
              {/* Corner brackets */}
              <div className="absolute top-0 left-0 w-12 h-12 border-t-4 border-l-4 border-primary rounded-tl-[40px]" />
              <div className="absolute top-0 right-0 w-12 h-12 border-t-4 border-r-4 border-primary rounded-tr-[40px]" />
              <div className="absolute bottom-0 left-0 w-12 h-12 border-b-4 border-l-4 border-primary rounded-bl-[40px]" />
              <div className="absolute bottom-0 right-0 w-12 h-12 border-b-4 border-r-4 border-primary rounded-br-[40px]" />
              
              {loading && (
                 <div className="absolute inset-0 bg-black/60 rounded-[40px] flex flex-col items-center justify-center backdrop-blur-md z-20">
                    <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
                    <p className="text-[10px] text-primary font-black uppercase tracking-widest">Validando Nodo...</p>
                 </div>
              )}
            </div>

            <form onSubmit={handleScanSubmit} className="w-full space-y-5">
              <div className="relative">
                <input
                  type="text"
                  required
                  value={qrCode}
                  onChange={(e) => setQrCode(e.target.value)}
                  placeholder="CÓDIGO DEL NODO"
                  className="w-full px-6 py-5 bg-surface-light border border-border rounded-xl focus:border-primary text-center text-white font-black text-xl tracking-[0.5em] outline-none uppercase placeholder:tracking-normal placeholder:font-bold placeholder:text-muted/50"
                />
                <Shield className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted opacity-30" />
              </div>
              
              <button
                type="submit"
                disabled={loading || !location || gpsLoading}
                className="w-full py-5 bg-primary text-black font-black text-xs uppercase rounded-xl hover:bg-white transition-all disabled:opacity-20 disabled:grayscale shadow-[0_0_30px_rgba(245,158,11,0.2)] active:scale-95"
              >
                {loading ? "SINCRONIZANDO..." : "AUTENTICAR UBICACIÓN"}
              </button>
            </form>

            <p className="mt-8 text-[9px] text-muted text-center uppercase tracking-widest font-bold leading-relaxed">
              MANTENIMIENTO DE PRIVACIDAD: <br/>
              TUS COORDENADAS SOLO SE USAN PARA ESTA VALIDACIÓN.
            </p>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
