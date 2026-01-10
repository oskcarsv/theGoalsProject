# Instrucciones para Arreglar el Registro y Login

## Problema
El registro de usuarios falla con error "Database error saving new user" porque las políticas RLS (Row Level Security) están bloqueando la inserción automática de perfiles cuando se crea un nuevo usuario.

## Solución

### Paso 1: Ir a Supabase Dashboard
1. Ve a https://supabase.com/dashboard
2. Selecciona tu proyecto
3. En el menú lateral, haz clic en "SQL Editor"

### Paso 2: Ejecutar este SQL

Copia y pega este código en el editor SQL y haz clic en "Run":

```sql
-- 1. Eliminar la política antigua que causa el problema
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;

-- 2. Crear nueva política que permite inserciones del sistema (trigger)
CREATE POLICY "System can insert profiles" 
ON profiles 
FOR INSERT 
WITH CHECK (true);

-- 3. Verificar que la política se creó correctamente
SELECT * FROM pg_policies WHERE tablename = 'profiles';
```

### Paso 3: Verificar el Trigger
Asegúrate de que el trigger existe ejecutando:

```sql
SELECT * FROM pg_trigger WHERE tgname = 'on_auth_user_created';
```

Si NO aparece, ejecuta esto:

```sql
-- Crear función del trigger
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'full_name',
    NEW.email
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Crear trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

## Resultado Esperado

Después de ejecutar estos comandos:
1. ✅ El registro de nuevos usuarios funcionará correctamente
2. ✅ Se creará automáticamente un perfil cuando alguien se registre
3. ✅ El login funcionará normalmente

## Verificación

Para probar que funciona:
1. Ve a http://localhost:3000/signup
2. Registra un nuevo usuario
3. Revisa tu correo para el enlace de confirmación
4. Confirma tu cuenta
5. Inicia sesión en http://localhost:3000/login

Si ves la página de dashboard después de iniciar sesión, ¡todo funciona! 🎉
