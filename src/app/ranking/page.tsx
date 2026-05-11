"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, Trophy, Crown, Medal, Swords } from "lucide-react";

export default function RankingPage() {
  const mockFactions = [
    { rank: 1, name: "Fantasmas del West", points: 145200, color: "text-purple-400", bg: "bg-purple-400/10" },
    { rank: 2, name: "Titanes del Interior", points: 132150, color: "text-blue-400", bg: "bg-blue-400/10" },
    { rank: 3, name: "Ángeles de la Capital", points: 98400, color: "text-primary", bg: "bg-primary/10" },
  ];

  const mockPlayers = [
    { rank: 1, name: "GhostRider507", faction: "Fantasmas del West", points: 12500 },
    { rank: 2, name: "TitanX", faction: "Titanes del Interior", points: 11200 },
    { rank: 3, name: "SpeedDemon", faction: "Ángeles de la Capital", points: 9800 },
    { rank: 4, name: "NightHawk", faction: "Fantasmas del West", points: 8400 },
    { rank: 5, name: "CruiserPTY", faction: "Independiente", points: 7200 },
  ];

  return (
    <div className="min-h-screen flex flex-col px-4 py-8 max-w-4xl mx-auto relative z-10">
      
      <header className="flex items-center gap-4 mb-10">
        <Link href="/dashboard" className="p-2 rounded-full glass-panel text-gray-400 hover:text-white transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <Trophy className="w-6 h-6 text-yellow-500" /> Clasificación Nacional
          </h1>
          <p className="text-gray-400 text-sm">Temporada 1: Dominio de Asfalto</p>
        </div>
      </header>

      <div className="grid md:grid-cols-2 gap-8">
        
        {/* Factions Leaderboard */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <Swords className="w-5 h-5 text-red-400" /> Top Facciones
          </h2>
          
          <div className="space-y-4">
            {mockFactions.map((faction, idx) => (
              <div key={idx} className={`glass-panel p-4 rounded-2xl flex items-center gap-4 ${idx === 0 ? 'border-yellow-500/50 scale-105' : 'border-white/5'}`}>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${idx === 0 ? 'bg-yellow-500 text-black' : 'bg-white/10 text-white'}`}>
                  {idx === 0 ? <Crown className="w-5 h-5" /> : faction.rank}
                </div>
                <div className="flex-1">
                  <h3 className={`font-bold ${faction.color}`}>{faction.name}</h3>
                  <p className="text-xs text-gray-400 uppercase tracking-wider">Control Territorial</p>
                </div>
                <div className="text-right">
                  <p className="font-black text-white">{faction.points.toLocaleString()}</p>
                  <p className="text-xs text-gray-500">PTS</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Players Leaderboard */}
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <Medal className="w-5 h-5 text-primary" /> Top Pilotos
          </h2>
          
          <div className="glass-panel rounded-2xl overflow-hidden border border-white/5">
            <div className="p-4 bg-black/40 border-b border-white/5 grid grid-cols-12 gap-2 text-xs font-medium text-gray-500 uppercase">
              <div className="col-span-2 text-center">Rnk</div>
              <div className="col-span-6">Piloto</div>
              <div className="col-span-4 text-right">Puntos</div>
            </div>
            
            <div className="divide-y divide-white/5">
              {mockPlayers.map((player, idx) => (
                <div key={idx} className="p-4 grid grid-cols-12 gap-2 items-center hover:bg-white/5 transition-colors">
                  <div className="col-span-2 flex justify-center">
                    <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${idx < 3 ? 'bg-primary/20 text-primary' : 'text-gray-400'}`}>
                      {player.rank}
                    </span>
                  </div>
                  <div className="col-span-6">
                    <p className="font-bold text-white truncate">{player.name}</p>
                    <p className="text-xs text-gray-500 truncate">{player.faction}</p>
                  </div>
                  <div className="col-span-4 text-right font-mono text-sm text-primary">
                    {player.points.toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

      </div>
    </div>
  );
}
