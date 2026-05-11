"use client";

import { User, Flame, MapPin, Eye, ScanLine, ShoppingBag, CalendarDays, Target, Trophy, Shield, Wrench, Medal, ChevronRight, Clock, Zap, Star, Activity } from "lucide-react";

/* ───────── mock data ───────── */
const topRiders = [
  { r: 1, name: "GHOST_RIDER", pts: 98750 },
  { r: 2, name: "DARK_KNIGHT", pts: 87230 },
  { r: 3, name: "SPEED_DEMON", pts: 75610 },
  { r: 4, name: "IRON_BIKER", pts: 67890 },
  { r: 5, name: "LADY_RACER", pts: 64320 },
];
const achievements = [
  { icon: "🗺️", name: "Explorador", desc: "Escanea 100 nodos", status: "COMPLETADO", done: true },
  { icon: "🏴", name: "Dominador", desc: "Domina 3 provincias", status: "2/3", done: false },
  { icon: "⭐", name: "Leyenda", desc: "Encuentra 5 nodos legendarios", status: "3/5", done: false },
  { icon: "🔥", name: "Racha Implacable", desc: "15 días seguidos escaneando", status: "12/15", done: false },
];
const activityFeed = [
  { user: "GHOST_RIDER", action: "escaneó", place: "Taller Moto507", time: "Hace 2 min" },
  { user: "LADY_RACER", action: "capturó", place: "Puente de Colón", time: "Hace 5 min" },
  { user: "RIDER_ALPHA", action: "completó", place: "Mirador de Boquete", time: "Hace 8 min" },
  { user: "IRON_BIKER", action: "encontró un", place: "Nodo Legendario", time: "Hace 12 min" },
];

/* ───────── Radar Chart SVG ───────── */
function RadarChart() {
  const stats = [85, 72, 78, 65, 90];
  const labels = ["Explorador", "Coleccionista", "Competidor", "Estratega", "Supervivencia"];
  const cx = 100, cy = 100, r = 70;
  const angleStep = (2 * Math.PI) / 5;

  const gridPoints = (radius: number) =>
    Array.from({ length: 5 }, (_, i) => {
      const a = angleStep * i - Math.PI / 2;
      return `${cx + radius * Math.cos(a)},${cy + radius * Math.sin(a)}`;
    }).join(" ");

  const dataPoints = stats.map((s, i) => {
    const a = angleStep * i - Math.PI / 2;
    const rr = (s / 100) * r;
    return `${cx + rr * Math.cos(a)},${cy + rr * Math.sin(a)}`;
  }).join(" ");

  const labelPositions = labels.map((l, i) => {
    const a = angleStep * i - Math.PI / 2;
    return { x: cx + (r + 18) * Math.cos(a), y: cy + (r + 18) * Math.sin(a), label: l, pct: stats[i] };
  });

  return (
    <svg viewBox="0 0 200 200" className="w-full max-w-[200px] mx-auto">
      {[0.25, 0.5, 0.75, 1].map((s, i) => (
        <polygon key={i} points={gridPoints(r * s)} fill="none" stroke="#1e1e2e" strokeWidth="1" />
      ))}
      {Array.from({ length: 5 }, (_, i) => {
        const a = angleStep * i - Math.PI / 2;
        return <line key={i} x1={cx} y1={cy} x2={cx + r * Math.cos(a)} y2={cy + r * Math.sin(a)} stroke="#1e1e2e" strokeWidth="1" />;
      })}
      <polygon points={dataPoints} fill="rgba(245,158,11,0.15)" stroke="#f59e0b" strokeWidth="2" />
      {labelPositions.map((lp, i) => (
        <text key={i} x={lp.x} y={lp.y} textAnchor="middle" dominantBaseline="central" className="radar-label">
          {lp.label} {lp.pct}%
        </text>
      ))}
    </svg>
  );
}

/* ───────── PAGE ───────── */
export default function DashboardPage() {
  return (
    <div className="space-y-6">

      {/* ═══ ROW 1: Player Card ═══ */}
      <div className="card p-5 flex items-center gap-6 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-primary via-amber-400 to-transparent" />
        {/* Avatar */}
        <div className="relative flex-shrink-0">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-surface-light to-surface border-2 border-border flex items-center justify-center">
            <User className="w-10 h-10 text-muted" />
          </div>
          <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-primary text-black text-xs font-black flex items-center justify-center border-2 border-surface">32</div>
        </div>
        {/* Info */}
        <div className="flex-1">
          <h2 className="text-xl font-black text-white tracking-tight">RIDER_ALPHA</h2>
          <div className="flex items-center gap-2 mt-0.5">
            <Shield className="w-3.5 h-3.5 text-accent" />
            <span className="text-xs text-accent font-semibold">Fantasmas del West</span>
          </div>
          <div className="progress-bar h-1.5 mt-2 max-w-[200px]">
            <div className="progress-bar-fill h-full" style={{ width: "70%" }} />
          </div>
          <p className="text-[9px] text-muted mt-1 font-mono">8,420 / 12,000 XP</p>
        </div>
        {/* Stats Row */}
        <div className="flex gap-6">
          {[
            { label: "Puntos Totales", value: "42,250", sub: "#48 Global" },
            { label: "Nodos Escaneados", value: "127", sub: "de 365 Totales" },
            { label: "Provincias", value: "5/10", sub: "Dominadas" },
            { label: "Racha Actual", value: "12", sub: "Días seguidos", icon: <Flame className="w-4 h-4 text-primary inline" /> },
          ].map((s, i) => (
            <div key={i} className="stat-box border-l border-border first:border-l-0 pl-6 first:pl-0">
              <p className="text-[9px] text-muted uppercase tracking-wider font-semibold">{s.label}</p>
              <p className="text-2xl font-black text-white flex items-center gap-1">{s.icon}{s.value}</p>
              <p className="text-[9px] text-muted">{s.sub}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ═══ ROW 2: Map + Right Column ═══ */}
      <div className="grid grid-cols-12 gap-6">

        {/* Map (8 cols) */}
        <div className="col-span-8 space-y-6">
          <div className="card p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">Mapa Táctico en Vivo</h3>
              <select className="text-[10px] bg-surface-light border border-border rounded-lg px-3 py-1.5 text-muted">
                <option>Todos los Nodos</option>
              </select>
            </div>
            {/* Map Placeholder */}
            <div className="relative w-full h-[280px] bg-surface-light rounded-xl overflow-hidden border border-border">
              <div className="absolute inset-0 opacity-30" style={{ background: "radial-gradient(circle at 40% 50%, rgba(245,158,11,0.15), transparent 60%), radial-gradient(circle at 70% 30%, rgba(139,92,246,0.1), transparent 50%)" }} />
              {/* Mock map dots */}
              {[
                { t: "25%", l: "30%", color: "bg-primary" },
                { t: "40%", l: "55%", color: "bg-accent" },
                { t: "60%", l: "70%", color: "bg-destructive" },
                { t: "35%", l: "45%", color: "bg-primary" },
                { t: "55%", l: "35%", color: "bg-success" },
              ].map((dot, i) => (
                <div key={i} className="absolute" style={{ top: dot.t, left: dot.l }}>
                  <div className={`w-3 h-3 ${dot.color} rounded-full`} />
                  <div className={`absolute inset-0 w-3 h-3 ${dot.color} rounded-full map-dot-ping`} />
                </div>
              ))}
              {/* Legend */}
              <div className="absolute bottom-3 left-3 glass-panel p-2.5 rounded-lg text-[9px] space-y-1">
                {[
                  { c: "bg-white", l: "Nodos Normales" },
                  { c: "bg-accent", l: "Nodos Premium" },
                  { c: "bg-primary", l: "Nodos Legendarios" },
                  { c: "bg-destructive", l: "Nodos Ocultos" },
                  { c: "bg-success", l: "Tu Posición" },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-2 text-muted">
                    <div className={`w-2 h-2 ${item.c} rounded-full`} /> {item.l}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Next Mission + Secret Node */}
          <div className="grid grid-cols-2 gap-6">
            <div className="card p-4">
              <p className="text-[9px] text-muted uppercase tracking-widest mb-2">Próxima Misión</p>
              <h4 className="text-lg font-bold text-white">EL MIRADOR</h4>
              <div className="flex items-center gap-1.5 mt-1">
                <span className="text-[9px] bg-primary/20 text-primary px-2 py-0.5 rounded-full font-bold uppercase">Legendario ⭐</span>
                <span className="text-xs text-success font-bold">+1,000 PTS</span>
              </div>
              <p className="text-[10px] text-muted mt-2">Escanea el nodo en el Mirador de Altos de Campana</p>
              <div className="flex items-center gap-1 mt-2 text-[10px] text-muted">
                <MapPin className="w-3 h-3" /> 12.4 KM
              </div>
              <button className="w-full mt-3 py-2 border border-primary/30 text-primary text-[10px] font-bold uppercase rounded-lg hover:bg-primary/10 transition-colors">
                Ver Ruta
              </button>
            </div>

            <div className="card p-4 border-accent/20">
              <p className="text-[9px] text-muted uppercase tracking-widest mb-2">Nodo Secreto</p>
              <p className="text-[10px] text-muted">Disponible en:</p>
              <p className="text-3xl font-black text-accent font-mono mt-1">02:14:36</p>
              <p className="text-[10px] text-muted mt-2 uppercase">Aparece en Colón</p>
            </div>
          </div>
        </div>

        {/* Right Column (4 cols) — Rankings + Faction */}
        <div className="col-span-4 space-y-6">
          {/* Rankings */}
          <div className="card p-4">
            <div className="flex gap-2 mb-4">
              <button className="flex-1 py-1.5 bg-primary/20 border border-primary/30 text-primary text-[10px] font-bold uppercase rounded-lg">Top Riders</button>
              <button className="flex-1 py-1.5 bg-surface-light border border-border text-muted text-[10px] font-bold uppercase rounded-lg hover:text-white transition-colors">Top Facciones</button>
            </div>
            <p className="text-[9px] text-muted uppercase tracking-wider mb-2 font-bold">Top 100 Riders <span className="float-right">Puntos</span></p>
            <div className="space-y-1.5">
              {topRiders.map((p) => (
                <div key={p.r} className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-surface-light transition-colors">
                  <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-black ${p.r <= 3 ? "bg-primary text-black" : "text-muted"}`}>{p.r}</span>
                  <Flame className={`w-3 h-3 ${p.r <= 3 ? "text-primary" : "text-muted/30"}`} />
                  <span className="text-xs font-semibold text-white flex-1 truncate">{p.name}</span>
                  <span className="text-xs font-bold text-primary font-mono">{p.pts.toLocaleString()}</span>
                </div>
              ))}
            </div>
            <div className="border-t border-border mt-3 pt-3 space-y-1.5">
              {[
                { r: 48, name: "RIDER_ALPHA", pts: 42250 },
                { r: 99, name: "ROAD_KING", pts: 12340 },
                { r: 100, name: "NITRO_507", pts: 11980 },
              ].map((p) => (
                <div key={p.r} className="flex items-center gap-2 p-1.5 rounded-lg bg-primary/5">
                  <span className="w-5 text-[9px] text-muted font-mono text-center">{p.r}</span>
                  <Flame className="w-3 h-3 text-muted/30" />
                  <span className={`text-xs font-semibold flex-1 truncate ${p.r === 48 ? "text-primary" : "text-white"}`}>{p.name}</span>
                  <span className="text-xs font-bold text-primary font-mono">{p.pts.toLocaleString()}</span>
                </div>
              ))}
            </div>
            <button className="w-full mt-3 py-2 bg-surface-light border border-border text-[10px] text-muted font-bold uppercase rounded-lg hover:text-white transition-colors">
              Ver Top 100
            </button>
          </div>

          {/* Faction Card */}
          <div className="card p-4">
            <p className="text-[9px] text-muted uppercase tracking-widest mb-3">Tu Facción</p>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 rounded-full bg-accent/20 border border-accent/30 flex items-center justify-center">
                <Shield className="w-6 h-6 text-accent" />
              </div>
              <div>
                <h4 className="font-bold text-white text-sm">FANTASMAS DEL WEST</h4>
                <div className="flex gap-4 mt-1 text-[9px]">
                  <span className="text-muted">Rango Global: <span className="text-white font-bold">#3</span></span>
                  <span className="text-muted">Puntos: <span className="text-primary font-bold">125,430</span></span>
                </div>
              </div>
            </div>
            <p className="text-[9px] text-muted uppercase">Próximo Objetivo: <span className="text-white font-bold">150,000 PTS</span></p>
            <button className="w-full mt-3 py-2 border border-accent/30 text-accent text-[10px] font-bold uppercase rounded-lg hover:bg-accent/10 transition-colors">
              Ver Facción
            </button>
          </div>
        </div>
      </div>

      {/* ═══ ROW 3: Stats + Garage + Logros ═══ */}
      <div className="grid grid-cols-12 gap-6">
        {/* Estadísticas Radar */}
        <div className="col-span-3 card p-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-2">Estadísticas</h3>
          <RadarChart />
        </div>

        {/* Mi Garaje */}
        <div className="col-span-4 card p-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-3">Mi Garaje</h3>
          <div className="card-inner p-4 flex flex-col items-center">
            <Wrench className="w-16 h-16 text-muted mb-2" />
            <p className="text-lg font-bold text-white">YAMAHA MT-09</p>
            <p className="text-[10px] text-muted">2023</p>
          </div>
          <div className="mt-3 space-y-2">
            {[
              { label: "Velocidad", pct: 80 },
              { label: "Manejo", pct: 65 },
              { label: "Resistencia", pct: 72 },
            ].map((s, i) => (
              <div key={i} className="flex items-center gap-3">
                <span className="text-[9px] text-muted w-20 uppercase">{s.label}</span>
                <div className="progress-bar h-1.5 flex-1"><div className="progress-bar-fill h-full" style={{ width: `${s.pct}%` }} /></div>
              </div>
            ))}
          </div>
          <button className="w-full mt-4 py-2 border border-border text-[10px] text-muted font-bold uppercase rounded-lg hover:text-white transition-colors">
            Ver Garaje
          </button>
        </div>

        {/* Logros Recientes */}
        <div className="col-span-5 card p-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-3">Logros Recientes</h3>
          <div className="space-y-2">
            {achievements.map((a, i) => (
              <div key={i} className={`card-inner p-3 flex items-center gap-3 ${a.done ? "border-success/20" : ""}`}>
                <span className="text-xl">{a.icon}</span>
                <div className="flex-1">
                  <p className="text-xs font-bold text-white">{a.name}</p>
                  <p className="text-[9px] text-muted">{a.desc}</p>
                </div>
                <span className={`text-[10px] font-bold ${a.done ? "text-success" : "text-muted"}`}>{a.status}</span>
              </div>
            ))}
          </div>
          <button className="w-full mt-3 py-2 border border-border text-[10px] text-muted font-bold uppercase rounded-lg hover:text-white transition-colors">
            Ver Todos los Logros
          </button>
        </div>
      </div>

      {/* ═══ ROW 4: Activity + Quick Access + Weekly ═══ */}
      <div className="grid grid-cols-12 gap-6">
        {/* Actividad Reciente */}
        <div className="col-span-4 card p-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-3">Actividad Reciente</h3>
          <div className="space-y-2.5">
            {activityFeed.map((a, i) => (
              <div key={i} className="flex items-start gap-2.5">
                <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Zap className="w-3 h-3 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="text-[10px] text-white"><span className="font-bold text-primary">{a.user}</span> {a.action}</p>
                  <p className="text-[9px] text-muted">» {a.place}</p>
                </div>
                <span className="text-[9px] text-muted flex-shrink-0">{a.time}</span>
              </div>
            ))}
          </div>
          <button className="w-full mt-3 py-2 border border-border text-[10px] text-muted font-bold uppercase rounded-lg hover:text-white transition-colors">
            Ver Toda la Actividad
          </button>
        </div>

        {/* Accesos Rápidos */}
        <div className="col-span-4 card p-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-3">Accesos Rápidos</h3>
          <div className="grid grid-cols-2 gap-3">
            {[
              { icon: <ScanLine className="w-5 h-5" />, label: "Escanear QR", sub: "Iniciar escaneo", href: "/escanear" },
              { icon: <Target className="w-5 h-5" />, label: "Misiones", sub: "Ver misiones", href: "/misiones" },
              { icon: <CalendarDays className="w-5 h-5" />, label: "Eventos", sub: "Próximos eventos", href: "/eventos" },
              { icon: <ShoppingBag className="w-5 h-5" />, label: "Tienda", sub: "Recompensas", href: "/tienda" },
            ].map((q, i) => (
              <div key={i} className="card-inner p-3 flex flex-col items-center text-center gap-1.5 hover:border-primary/30 transition-colors cursor-pointer group">
                <div className="text-muted group-hover:text-primary transition-colors">{q.icon}</div>
                <p className="text-[10px] font-bold text-white uppercase">{q.label}</p>
                <p className="text-[8px] text-muted">{q.sub}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Desafío Semanal */}
        <div className="col-span-4 card p-4 border-primary/20 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-bl-full" />
          <h3 className="text-sm font-bold text-primary uppercase tracking-wider mb-1 neon-text">Desafío Semanal</h3>
          <p className="text-white font-bold text-lg mt-1">Escanea 20 Nodos Premium</p>
          <div className="progress-bar h-2 mt-3"><div className="progress-bar-fill h-full" style={{ width: "75%" }} /></div>
          <p className="text-[10px] text-muted mt-1 font-mono">15/20</p>
          <div className="mt-4 flex items-center justify-between">
            <p className="text-[9px] text-muted uppercase font-bold">Recompensa</p>
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 text-primary" />
              <span className="text-xl font-black text-primary neon-text">2,500 PTS</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
