"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, MapPin, Scan, Trophy, Users } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen overflow-hidden px-4">
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center z-10 max-w-4xl"
      >
        <div className="inline-block mb-4 px-4 py-1.5 rounded-full glass-panel border-primary/20 text-primary text-sm font-semibold tracking-wider uppercase">
          Acceso Restringido - Nivel 1
        </div>
        
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6">
          <span className="text-white">CILINDRAJE </span>
          <span className="text-primary neon-text">507</span>
        </h1>
        
        <p className="text-gray-400 text-lg md:text-xl mb-12 max-w-2xl mx-auto leading-relaxed">
          La red definitiva de moteros en Panamá. Escanea códigos QR ocultos en la ciudad, suma puntos para tu facción y domina los territorios.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
          <Link href="/login" className="w-full sm:w-auto">
            <button className="w-full group relative px-8 py-4 bg-primary text-primary-foreground font-bold rounded-xl overflow-hidden shadow-[0_0_40px_rgba(16,185,129,0.3)] hover:shadow-[0_0_60px_rgba(16,185,129,0.5)] transition-all duration-300 hover:-translate-y-1">
              <div className="absolute inset-0 bg-white/20 group-hover:translate-x-full -translate-x-full transition-transform duration-500 skew-x-12" />
              <span className="flex items-center justify-center gap-2">
                INICIAR SESIÓN
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </span>
            </button>
          </Link>
          
          <Link href="/registro-motero" className="w-full sm:w-auto">
            <button className="w-full px-8 py-4 glass-panel text-white font-bold rounded-xl hover:bg-white/5 transition-all duration-300 border-white/10 hover:border-primary/50">
              REGISTRARSE
            </button>
          </Link>
        </div>
      </motion.div>

      {/* Feature Grid */}
      <motion.div 
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.3 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 mt-24 z-10 w-full max-w-5xl"
      >
        {[
          { icon: <Scan className="w-8 h-8 text-primary" />, title: "Escanea QRs", desc: "Encuentra stickers secretos" },
          { icon: <MapPin className="w-8 h-8 text-accent" />, title: "Conquista", desc: "Domina territorios" },
          { icon: <Users className="w-8 h-8 text-blue-400" />, title: "Facciones", desc: "Únete a un equipo" },
          { icon: <Trophy className="w-8 h-8 text-yellow-400" />, title: "Ranking", desc: "Compite nacionalmente" }
        ].map((feature, idx) => (
          <div key={idx} className="glass-panel p-6 rounded-2xl flex flex-col items-center text-center group hover:border-primary/50 transition-colors">
            <div className="mb-4 p-3 rounded-full bg-white/5 group-hover:scale-110 transition-transform">
              {feature.icon}
            </div>
            <h3 className="text-white font-bold mb-2">{feature.title}</h3>
            <p className="text-sm text-gray-400">{feature.desc}</p>
          </div>
        ))}
      </motion.div>
    </div>
  );
}
