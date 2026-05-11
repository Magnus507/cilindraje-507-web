"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";
import { ArrowLeft, Lock, Mail, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      router.push("/dashboard");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 relative overflow-hidden">
      
      {/* Decorative background grid */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-20" />
      
      <Link href="/" className="absolute top-8 left-8 text-gray-400 hover:text-white flex items-center gap-2 transition-colors z-20">
        <ArrowLeft className="w-5 h-5" />
        Volver
      </Link>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md z-10"
      >
        <div className="glass-panel p-8 rounded-3xl border-t border-primary/30 relative">
          
          {/* Top highlight line */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-[1px] bg-gradient-to-r from-transparent via-primary to-transparent" />

          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Acceso al Sistema</h1>
            <p className="text-gray-400 text-sm">Identifícate para entrar a Cilindraje 507</p>
          </div>

          {error && (
            <div className="mb-6 p-4 rounded-xl bg-destructive/20 border border-destructive/50 text-destructive-foreground text-sm text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300 ml-1">Correo Electrónico</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-500" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-black/40 border border-white/10 rounded-xl focus:border-primary focus:ring-1 focus:ring-primary text-white outline-none transition-all placeholder:text-gray-600"
                  placeholder="piloto@ejemplo.com"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300 ml-1">Contraseña</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-500" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-black/40 border border-white/10 rounded-xl focus:border-primary focus:ring-1 focus:ring-primary text-white outline-none transition-all placeholder:text-gray-600"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-primary text-primary-foreground font-bold rounded-xl flex items-center justify-center hover:bg-primary/90 transition-colors disabled:opacity-70 neon-border"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "INICIAR SESIÓN"}
            </button>
          </form>

          <div className="mt-8 text-center text-sm text-gray-400">
            ¿No tienes un perfil?{" "}
            <Link href="/registro-motero" className="text-primary hover:text-primary/80 font-medium transition-colors">
              Solicitar Acceso
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
