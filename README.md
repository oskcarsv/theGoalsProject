# 🎯 The Goals Project

> Una aplicación para seguimiento de metas personales y rendición de cuentas entre usuarios. Haz lo que predicas.

[![Next.js](https://img.shields.io/badge/Next.js-16.1.1-black)](https://nextjs.org/)
[![Supabase](https://img.shields.io/badge/Supabase-Latest-green)](https://supabase.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue)](https://www.typescriptlang.org/)
[![shadcn/ui](https://img.shields.io/badge/shadcn%2Fui-Latest-black)](https://ui.shadcn.com/)
[![Open Source](https://img.shields.io/badge/Open%20Source-%E2%9D%A4-red)](https://github.com/oskcarsv/theGoalsProject)

## 🌟 Concepto

The Goals Project es una plataforma open source que conecta a personas con objetivos similares para que se apoyen mutuamente. Inspirada en sistemas de accountability grupal, la aplicación ayuda a los usuarios a establecer metas, hacer seguimiento de su progreso, y competir sanamente con otros que comparten sus mismos objetivos.

## ✨ Características Principales

### 📋 Sistema de Metas

- **Metas Macro (Anuales)**: Define tus objetivos principales para el año
- **Metas Micro (Semanales)**: Submetas derivadas de las metas anuales
- **Evidencias**: Sube fotos como prueba de tu progreso
- **Review Semanal**: Evalúa tu avance cada semana

### 🏆 Sistema de Ranking

- Ranking por categorías normalizadas (gimnasio, lectura, nutrición, etc.)
- Competencia sana con usuarios que tienen metas similares
- Sube o baja según cumplas tus compromisos
- Inspirado en el modelo de Duolingo

### 🤝 Sistema de Matching

- Conecta con usuarios que tienen metas similares
- Algoritmo de compatibilidad basado en áreas de enfoque e intereses
- Facilita la creación de grupos de accountability

### 👤 Onboarding Personalizado

- Información básica y biografía
- Selección de áreas de enfoque (salud física, emocional, profesional)
- Intereses personales para matching
- Enlaces a redes sociales (Instagram, LinkedIn)

### 👨‍💼 Panel de Administración

- Estadísticas globales de la plataforma
- Gestión de usuarios
- Métricas de engagement

## 🛠️ Stack Tecnológico

- **Frontend**: Next.js 16.1.1 con App Router
- **UI**: shadcn/ui + Tailwind CSS
- **Backend**: Supabase (PostgreSQL)
- **Autenticación**: Supabase Auth
- **Almacenamiento**: Supabase Storage
- **TypeScript**: Para type safety
- **Iconos**: Lucide React

## 🚀 Inicio Rápido

### Prerrequisitos

- Node.js 18+ 
- npm o pnpm
- Cuenta en Supabase

### Instalación

1. **Clona el repositorio**

```bash
git clone https://github.com/oskcarsv/theGoalsProject.git
cd theGoalsProject
```

2. **Instala dependencias**

```bash
npm install
```

3. **Configura variables de entorno**

Crea un archivo `.env.local` con:

```env
NEXT_PUBLIC_SUPABASE_URL=tu_url_de_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_clave_anon_de_supabase
```

4. **Configura la base de datos**

- Ve a tu proyecto en [Supabase Dashboard](https://supabase.com/dashboard)
- Abre el SQL Editor
- Ejecuta el script completo de `supabase/schema.sql`

5. **⚠️ IMPORTANTE: Arregla las políticas RLS para el registro de usuarios**

Ejecuta esto en SQL Editor después del schema:

```sql
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;

CREATE POLICY "System can insert profiles" 
ON profiles 
FOR INSERT 
WITH CHECK (true);
```

6. **Inicia el servidor de desarrollo**

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

## 📁 Estructura del Proyecto

```
theGoalsProject/
├── src/
│   ├── app/                    # App Router de Next.js
│   │   ├── (dashboard)/       # Rutas protegidas
│   │   │   ├── admin/         # Panel de administración
│   │   │   ├── dashboard/     # Dashboard principal
│   │   │   ├── goals/         # Gestión de metas
│   │   │   ├── match/         # Sistema de matching
│   │   │   ├── profile/       # Perfil de usuario
│   │   │   ├── ranking/       # Rankings por categoría
│   │   │   └── review/        # Review semanal
│   │   ├── login/             # Inicio de sesión
│   │   ├── signup/            # Registro
│   │   ├── onboarding/        # Proceso de onboarding
│   │   └── page.tsx           # Landing page
│   ├── components/            # Componentes reutilizables
│   │   ├── ui/                # shadcn/ui components
│   │   └── dashboard/         # Componentes del dashboard
│   ├── lib/                   # Utilidades y configuración
│   │   ├── supabase/          # Clientes de Supabase
│   │   └── utils.ts           # Funciones helper
│   └── types/                 # Definiciones de TypeScript
├── supabase/
│   └── schema.sql             # Schema de la base de datos
├── public/                    # Archivos estáticos
└── package.json
```

## 🗄️ Schema de Base de Datos

### Tablas Principales

- **profiles**: Perfiles de usuario extendidos
- **macro_goals**: Metas anuales
- **micro_goals**: Metas semanales
- **evidence**: Fotos de evidencia
- **weekly_reviews**: Reviews semanales
- **rankings**: Rankings por categoría
- **matches**: Conexiones entre usuarios

### Categorías Normalizadas

El sistema incluye 10 categorías predefinidas para ranking:

- 💪 Ir al gimnasio
- 📚 Leer más
- 🥗 Comer bien
- 😴 Dormir a la misma hora
- 🧘 Meditar
- 🎓 Aprender algo nuevo
- 🤝 Networking
- 💻 Proyecto personal
- 🏃 Ejercicio general
- 🎯 Otro

## 👥 Sistema de Roles

- **Usuario Normal**: Acceso completo a todas las funcionalidades
- **Administrador**: Acceso adicional al panel de admin con estadísticas globales

## 🤝 Contribuir

Este es un proyecto **open source** y las contribuciones son bienvenidas! 

### ¿Por qué contribuir?

- ✅ Gana experiencia en proyectos reales
- ✅ Agrega contribuciones a tu CV/portfolio
- ✅ Aprende Next.js, Supabase, y mejores prácticas
- ✅ Ayuda a la comunidad

### Cómo contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

### Guías de Contribución

- Usa TypeScript para todo el código nuevo
- Sigue las convenciones de código existentes
- Usa componentes de shadcn/ui para la UI
- Escribe commits descriptivos
- Actualiza la documentación si es necesario

## 🐛 Reportar Bugs

Si encuentras un bug, abre un [issue](https://github.com/oskcarsv/theGoalsProject/issues) con:

- Descripción del bug
- Pasos para reproducirlo
- Comportamiento esperado vs. actual
- Screenshots si es posible
- Tu entorno (OS, navegador, versión de Node)

## 📝 Roadmap

- [ ] Sistema de notificaciones
- [ ] Modo oscuro completo
- [ ] App móvil (React Native)
- [ ] Integración con wearables
- [ ] Gamificación avanzada
- [ ] Sistema de logros/badges
- [ ] Exportar progreso a PDF
- [ ] API pública para integraciones

## 📄 Licencia

Este proyecto está bajo la Licencia MIT.

## 👨‍💻 Autor

**Oscar Morales** - [@oskcarsv](https://github.com/oskcarsv)

## 🙏 Agradecimientos

- A toda la comunidad de desarrolladores que contribuyen
- Al equipo de Next.js y Vercel
- Al equipo de Supabase
- A shadcn por los increíbles componentes UI

## 📞 Contacto

- GitHub: [@oskcarsv](https://github.com/oskcarsv)
- Proyecto: [https://github.com/oskcarsv/theGoalsProject](https://github.com/oskcarsv/theGoalsProject)

---

⭐ Si este proyecto te ayuda, considera darle una estrella en GitHub!

**Haz lo que predicas. Alcanza tus metas.** 🎯
5. Abre un Pull Request

## Licencia

MIT License - ver [LICENSE](LICENSE) para más detalles.

---

Hecho con ❤️ por la comunidad
