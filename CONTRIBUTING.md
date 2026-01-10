# 🤝 Guía de Contribución

¡Gracias por tu interés en contribuir a The Goals Project! Este documento te guiará a través del proceso.

## 🌟 Código de Conducta

- Sé respetuoso y constructivo
- Ayuda a crear un ambiente acogedor para todos
- Reporta comportamiento inapropiado

## 🚀 Cómo Empezar

### 1. Setup del Entorno

```bash
# Fork y clona el repositorio
git clone https://github.com/TU_USUARIO/theGoalsProject.git
cd theGoalsProject

# Instala dependencias
npm install

# Configura variables de entorno
cp .env.example .env.local
# Agrega tus credenciales de Supabase en .env.local

# Corre el proyecto
npm run dev
```

### 2. Configura Supabase

1. Crea un proyecto en [Supabase](https://supabase.com)
2. Ejecuta `supabase/schema.sql` en el SQL Editor
3. Ejecuta el fix de RLS (ver README.md)
4. Agrega tus credenciales a `.env.local`

## 📝 Tipos de Contribuciones

### 🐛 Reportar Bugs

Usa el [issue tracker](https://github.com/oskcarsv/theGoalsProject/issues) con:

- **Título claro**: Ej. "Error al subir evidencia en móvil"
- **Descripción**: Qué pasó y qué esperabas
- **Pasos para reproducir**: Paso a paso
- **Screenshots**: Si aplica
- **Entorno**: OS, navegador, versión

### ✨ Proponer Features

Abre un issue con:

- **Problema**: Qué problema resuelve
- **Solución propuesta**: Cómo funcionaría
- **Alternativas**: Otras opciones consideradas
- **Mockups**: Si es un cambio visual

### 💻 Pull Requests

#### Antes de Empezar

1. **Busca issues existentes**: Evita duplicados
2. **Comenta tu intención**: Avisa que trabajarás en algo
3. **Espera aprobación**: Para features grandes

#### Proceso

1. **Crea una rama**
   ```bash
   git checkout -b feature/nombre-descriptivo
   # o
   git checkout -b fix/bug-especifico
   ```

2. **Haz tus cambios**
   - Sigue las convenciones del proyecto
   - Escribe código limpio y comentado
   - Prueba tus cambios localmente

3. **Commit**
   ```bash
   git commit -m "feat: agregar sistema de notificaciones"
   # o
   git commit -m "fix: corregir error en ranking semanal"
   ```

4. **Push y PR**
   ```bash
   git push origin tu-rama
   ```
   - Abre un PR en GitHub
   - Describe tus cambios claramente
   - Referencia issues relacionados

## 📋 Estándares de Código

### TypeScript

```typescript
// ✅ Bueno - Tipos explícitos
interface UserProfile {
  id: string;
  name: string;
  email: string;
}

function getUser(id: string): Promise<UserProfile> {
  // ...
}

// ❌ Malo - Sin tipos
function getUser(id) {
  // ...
}
```

### Componentes React

```typescript
// ✅ Bueno - Componente tipado con props interface
interface ButtonProps {
  label: string;
  onClick: () => void;
  variant?: 'primary' | 'secondary';
}

export function Button({ label, onClick, variant = 'primary' }: ButtonProps) {
  return (
    <button onClick={onClick} className={cn('btn', `btn-${variant}`)}>
      {label}
    </button>
  );
}

// ❌ Malo - Props sin tipos
export function Button({ label, onClick, variant }) {
  // ...
}
```

### Naming Conventions

```typescript
// Componentes: PascalCase
export function UserProfile() {}

// Funciones/variables: camelCase
const getUserData = () => {}
const isActive = true

// Constantes: UPPER_SNAKE_CASE
const MAX_RETRIES = 3
const API_BASE_URL = 'https://api.example.com'

// Archivos de componentes: PascalCase.tsx
// UserProfile.tsx
// DashboardLayout.tsx

// Archivos de utilidades: camelCase.ts
// dateUtils.ts
// apiClient.ts
```

### Estructura de Componentes

```typescript
'use client'; // Si es necesario

// 1. Imports
import { useState } from 'react';
import { Button } from '@/components/ui/button';

// 2. Types/Interfaces
interface Props {
  // ...
}

// 3. Component
export function MyComponent({ prop1, prop2 }: Props) {
  // 3.1 Hooks
  const [state, setState] = useState();
  
  // 3.2 Functions
  const handleClick = () => {
    // ...
  };
  
  // 3.3 Render
  return (
    <div>
      {/* ... */}
    </div>
  );
}
```

### shadcn/ui

**Usa los componentes de shadcn/ui siempre que sea posible:**

```typescript
// ✅ Bueno - Usa componentes de shadcn/ui
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

<Card>
  <CardHeader>
    <CardTitle>Título</CardTitle>
  </CardHeader>
  <CardContent>
    <Button>Click me</Button>
  </CardContent>
</Card>

// ❌ Malo - Clases custom innecesarias
<div className="card">
  <div className="card-header">
    <h3>Título</h3>
  </div>
  <div className="card-content">
    <button className="btn-primary">Click me</button>
  </div>
</div>
```

### Tailwind CSS

```typescript
// ✅ Bueno - Clases de Tailwind ordenadas
<div className="flex items-center justify-between gap-4 rounded-lg bg-white p-4 shadow-sm">

// ✅ Mejor - Usa cn() para condiciones
import { cn } from '@/lib/utils';

<div className={cn(
  'rounded-lg p-4',
  isActive && 'bg-primary text-white',
  !isActive && 'bg-gray-100'
)}>

// ❌ Malo - Estilos inline
<div style={{ display: 'flex', padding: '16px' }}>
```

## 🧪 Testing (Futuro)

Cuando agreguemos tests:

```bash
npm test
npm run test:watch
```

## 📚 Recursos Útiles

- [Next.js Docs](https://nextjs.org/docs)
- [Supabase Docs](https://supabase.com/docs)
- [shadcn/ui Docs](https://ui.shadcn.com)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)

## 🎯 Áreas que Necesitan Ayuda

### 🟢 Buenas Para Empezar

- Mejorar documentación
- Agregar tests unitarios
- Corregir bugs pequeños
- Mejorar accesibilidad (a11y)

### 🟡 Intermedio

- Implementar nuevas features
- Optimizar performance
- Mejorar UX/UI
- Agregar validaciones

### 🔴 Avanzado

- Arquitectura de base de datos
- Sistemas de tiempo real
- Integraciones complejas
- Seguridad y RLS policies

## ✅ Checklist para PRs

Antes de enviar tu PR, asegúrate de:

- [ ] El código compila sin errores (`npm run build`)
- [ ] Seguiste las convenciones de código
- [ ] Agregaste/actualizaste comentarios donde sea necesario
- [ ] Probaste tus cambios localmente
- [ ] Tu PR tiene un título descriptivo
- [ ] Describiste qué cambios hiciste y por qué
- [ ] Referenciaste issues relacionados (#123)

## 💬 Contacto

- Issues: [GitHub Issues](https://github.com/oskcarsv/theGoalsProject/issues)
- Discussions: [GitHub Discussions](https://github.com/oskcarsv/theGoalsProject/discussions)

## 🙏 Gracias

¡Cada contribución, grande o pequeña, es valiosa! Gracias por ayudar a mejorar The Goals Project. 🎯
