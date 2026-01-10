# Instrucciones: Cómo Crear un Admin

## En la Base de Datos (Supabase)

Para convertir a un usuario en admin, necesitas actualizar su rol en la tabla `profiles`:

### Opción 1: Desde Supabase Dashboard (Visual)

1. Ve a https://supabase.com/dashboard
2. Selecciona tu proyecto
3. Abre **Database** → **profiles**
4. Encuentra el usuario que quieres hacer admin
5. Edita el campo `role` y cambia de `user` a `admin`
6. Listo! ✅

### Opción 2: Desde SQL Editor (Código)

1. Ve a **SQL Editor** en Supabase Dashboard
2. Ejecuta este comando:

```sql
-- Cambiar a un usuario específico a admin (usa el email del usuario)
UPDATE profiles
SET role = 'admin'
WHERE email = 'usuario@example.com';

-- Verificar que se cambió
SELECT email, role FROM profiles WHERE email = 'usuario@example.com';
```

## Después de Cambiar el Rol

1. El usuario debe **cerrar sesión y volver a iniciar sesión**
2. Al entrar al dashboard, verá un nuevo botón **"Panel Admin"** en la barra lateral
3. Podrá acceder a `/dashboard/admin` para ver el panel de administración

## Revertir un Admin a Usuario Normal

```sql
UPDATE profiles
SET role = 'user'
WHERE email = 'usuario@example.com';
```

## Ver todos los Admins

```sql
SELECT email, full_name, role 
FROM profiles 
WHERE role = 'admin';
```

---

**Nota:** El rol se valida en el Sidebar ([src/components/layout/Sidebar.tsx](../src/components/layout/Sidebar.tsx)) donde solo se muestra el link de admin si `profile.role === 'admin'`.
