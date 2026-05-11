-- COPIA Y PEGA ESTO EN EL SQL EDITOR DE SUPABASE PARA ACTIVAR EL SISTEMA DE JUEGO
-- URL: https://supabase.com/dashboard/project/clfduyuivbqizcveavwm/sql/new

-- 1. Actualizar tabla de stickers para soportar propuestas de usuarios
ALTER TABLE stickers ADD COLUMN IF NOT EXISTS creator_id UUID REFERENCES profiles(id);
ALTER TABLE stickers ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'active';
ALTER TABLE stickers ADD COLUMN IF NOT EXISTS description TEXT;

-- 2. Asegurar que los estados permitidos sean correctos (Opcional pero recomendado)
-- status puede ser: 'proposed', 'review', 'active', 'suspended'

-- 3. Crear política de seguridad para que los usuarios puedan insertar sus propuestas
ALTER TABLE stickers ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Usuarios pueden proponer puntos" ON stickers;
CREATE POLICY "Usuarios pueden proponer puntos" ON stickers
  FOR INSERT WITH CHECK (auth.uid() = creator_id);

DROP POLICY IF EXISTS "Todos pueden ver puntos activos" ON stickers;
CREATE POLICY "Todos pueden ver puntos activos" ON stickers
  FOR SELECT USING (is_active = true OR auth.uid() = creator_id);
