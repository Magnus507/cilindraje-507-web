"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, Map, ScanLine, Target, Trophy,
  Shield, Wrench, Medal, ShoppingBag, CalendarDays,
  Settings, Users
} from "lucide-react";

const navItems = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/mapa", icon: Map, label: "Mapa Táctico" },
  { href: "/escanear", icon: ScanLine, label: "Escanear QR" },
  { href: "/misiones", icon: Target, label: "Misiones" },
  { href: "/ranking", icon: Trophy, label: "Rankings" },
  { href: "/faccion", icon: Shield, label: "Facción" },
  { href: "/garaje", icon: Wrench, label: "Garaje" },
  { href: "/logros", icon: Medal, label: "Logros" },
  { href: "/tienda", icon: ShoppingBag, label: "Tienda" },
  { href: "/eventos", icon: CalendarDays, label: "Eventos" },
  { href: "/configuracion", icon: Settings, label: "Configuración" },
  { href: "/misiones/proponer", icon: MapPin, label: "Expandir Radar", special: true },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 bottom-0 w-[220px] bg-surface border-r border-border flex flex-col z-40">
      {/* Logo */}
      <div className="p-5 pb-2">
        <h1 className="text-xl font-black tracking-tight">
          <span className="text-primary neon-text">CILINDRAJE</span>
          <span className="text-white">507</span>
        </h1>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto custom-scroll">
        {navItems.map((item) => {
          const active = pathname === item.href;
          return (
            <Link key={item.href} href={item.href}>
              <div className={`nav-item ${active ? "active" : ""} ${item.special ? "bg-primary/10 border border-primary/20 text-primary shadow-[0_0_15px_rgba(245,158,11,0.1)] mt-4 mb-2" : ""}`}>
                <item.icon className={`w-4 h-4 flex-shrink-0 ${item.special ? "animate-pulse" : ""}`} />
                <span className={item.special ? "font-black" : ""}>{item.label}</span>
              </div>
            </Link>
          );
        })}
      </nav>

      {/* Event Countdown at bottom */}
      <div className="p-4 border-t border-border">
        <div className="card-inner p-3">
          <p className="text-[10px] text-primary font-bold uppercase tracking-widest mb-1">La Rodada Nacional</p>
          <p className="text-[10px] text-muted mb-2 uppercase">Evento Final</p>
          <div className="flex gap-1.5 mb-3">
            {[
              { val: "80", label: "Días" },
              { val: "14", label: "Horas" },
              { val: "36", label: "Min" },
              { val: "22", label: "Seg" },
            ].map((d, i) => (
              <div key={i} className="text-center">
                <div className="countdown-digit text-sm">{d.val}</div>
                <p className="text-[8px] text-muted mt-0.5 uppercase">{d.label}</p>
              </div>
            ))}
          </div>
          <button className="w-full py-1.5 bg-primary/20 border border-primary/30 text-primary text-[10px] font-bold uppercase rounded-lg hover:bg-primary/30 transition-colors">
            Ver Evento
          </button>
        </div>
      </div>

      {/* Online Status */}
      <div className="p-4 pt-0">
        <div className="flex items-center gap-2 text-xs text-muted">
          <div className="relative">
            <Users className="w-4 h-4" />
            <div className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-success rounded-full" />
          </div>
          <span>Conectado</span>
          <span className="ml-auto text-white font-bold">132</span>
          <span className="text-[10px]">Riders Activos</span>
        </div>
      </div>
    </aside>
  );
}
