"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";
import { ArrowLeft, User, Mail, Lock, Loader2, Bike } from "lucide-react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    username: "",
    fullName: "",
    motorcycleModel: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // 1. Sign up user
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: formData.email,
      password: formData.password,
    });

    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }

    if (authData.user) {
      // 2. Insert profile
      const { error: profileError } = await supabase.from("profiles").insert({
        id: authData.user.id,
        username: formData.username,
        full_name: formData.fullName,
        motorcycle_model: formData.motorcycleModel,
      });

      if (profileError) {
        setError(profileError.message);
      } else {
        setSuccess(true);
        setTimeout(() => {
          router.push("/dashboard");
        }, 2000);
      }
    }
    
    setLoading(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  if (success) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center">
          <div className="w-24 h-24 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <Bike className="w-12 h-12 text-primary" />
          </div>
          <h2 className="text-3xl font-bold text-white mb-2">¡Piloto Registrado!</h2>
          <p className="text-gray-400">Bienvenido a Cilindraje 507. Preparando tu panel...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 py-12 relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-20" />
      
      <Link href="/" className="absolute top-8 left-8 text-gray-400 hover:text-white flex items-center gap-2 z-20">
        <ArrowLeft className="w-5 h-5" />
        Volver
      </Link>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md z-10">
        <div className="glass-panel p-8 rounded-3xl border-t border-primary/30">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Nuevo Recluta</h1>
            <p className="text-gray-400 text-sm">Únete a la facción y empieza a ganar puntos</p>
          </div>

          {error && (
            <div className="mb-6 p-4 rounded-xl bg-destructive/20 border border-destructive/50 text-destructive-foreground text-sm text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-400 ml-1">Alias (Username)</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <User className="h-4 w-4 text-gray-500" />
                </div>
                <input required type="text" name="username" value={formData.username} onChange={handleChange} className="w-full pl-11 pr-4 py-2.5 bg-black/40 border border-white/10 rounded-xl focus:border-primary focus:ring-1 focus:ring-primary text-white outline-none" placeholder="MoteroPTY" />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-400 ml-1">Nombre Completo</label>
              <input required type="text" name="fullName" value={formData.fullName} onChange={handleChange} className="w-full px-4 py-2.5 bg-black/40 border border-white/10 rounded-xl focus:border-primary focus:ring-1 focus:ring-primary text-white outline-none" placeholder="Juan Pérez" />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-400 ml-1">Modelo de Moto</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Bike className="h-4 w-4 text-gray-500" />
                </div>
                <input required type="text" name="motorcycleModel" value={formData.motorcycleModel} onChange={handleChange} className="w-full pl-11 pr-4 py-2.5 bg-black/40 border border-white/10 rounded-xl focus:border-primary focus:ring-1 focus:ring-primary text-white outline-none" placeholder="Yamaha MT-07" />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-400 ml-1">Correo Electrónico</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="h-4 w-4 text-gray-500" />
                </div>
                <input required type="email" name="email" value={formData.email} onChange={handleChange} className="w-full pl-11 pr-4 py-2.5 bg-black/40 border border-white/10 rounded-xl focus:border-primary focus:ring-1 focus:ring-primary text-white outline-none" placeholder="ejemplo@correo.com" />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-400 ml-1">Contraseña</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-4 w-4 text-gray-500" />
                </div>
                <input required type="password" name="password" value={formData.password} onChange={handleChange} minLength={6} className="w-full pl-11 pr-4 py-2.5 bg-black/40 border border-white/10 rounded-xl focus:border-primary focus:ring-1 focus:ring-primary text-white outline-none" placeholder="••••••••" />
              </div>
            </div>

            <button type="submit" disabled={loading} className="w-full py-3.5 mt-4 bg-white text-black font-bold rounded-xl flex items-center justify-center hover:bg-gray-200 transition-colors disabled:opacity-70">
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "REGISTRARSE"}
            </button>
          </form>
          
          <div className="mt-6 text-center text-sm text-gray-400">
            ¿Ya eres miembro?{" "}
            <Link href="/login" className="text-white hover:text-primary font-medium transition-colors">
              Iniciar Sesión
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
