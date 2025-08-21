# Tiketera - Sistema de Venta de Tickets

Una aplicación moderna de venta de tickets para eventos construida con React, TypeScript, Supabase y Tailwind CSS.

## 🚀 Características

### Frontend
- **React 18** con TypeScript
- **Tailwind CSS** para estilos
- **React Query** para manejo de estado del servidor
- **React Router** para navegación
- **Supabase** como backend y base de datos
- **Tiempo real** con subscripciones de Supabase
- **Responsive design** optimizado para móviles

### Backend (Supabase)
- **PostgreSQL** como base de datos
- **Row Level Security (RLS)** para seguridad
- **Autenticación** integrada
- **Tiempo real** con subscripciones
- **Edge Functions** para lógica del servidor

### Funcionalidades
- 🎫 **Gestión de eventos** completa
- 🏟️ **Mapas de asientos** interactivos
- 🛒 **Carrito de compras** con reserva temporal
- 👤 **Autenticación** segura con Supabase Auth
- 📱 **Tiempo real** - actualizaciones instantáneas
- 🔐 **Panel de administración** con roles
- 📊 **Analytics** y reportes
- 🎯 **QR Scanner** para validación de tickets
- 💳 **Integración de pagos** (preparado para Stripe)

## 🛠️ Configuración

### Prerrequisitos
- Node.js 18+
- Cuenta de Supabase
- Netlify CLI (opcional, para desarrollo local)

### Instalación

1. **Clonar el repositorio**
```bash
git clone <repository-url>
cd tiketera
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Configurar variables de entorno**
```bash
cp .env.example .env
```

Edita `.env` con tus credenciales de Supabase:
```env
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=tu-clave-anonima
```

4. **Configurar Supabase**

Ejecuta las migraciones en tu proyecto de Supabase:
- Ve a tu dashboard de Supabase
- Navega a SQL Editor
- Ejecuta los archivos de migración en orden:
  1. `supabase/migrations/20250813180733_rough_shrine.sql`
  2. `supabase/migrations/20250813181002_autumn_star.sql`

5. **Iniciar desarrollo**
```bash
npm run dev
```

## 🏗️ Arquitectura

### Estructura del Proyecto
```
src/
├── components/          # Componentes reutilizables
│   ├── Auth/           # Componentes de autenticación
│   ├── Events/         # Componentes de eventos
│   ├── Layout/         # Layout y navegación
│   ├── Admin/          # Panel de administración
│   └── Providers/      # Providers de contexto
├── hooks/              # Custom hooks
├── lib/                # Configuración de librerías
├── pages/              # Páginas principales
├── services/           # Servicios y APIs
├── types/              # Definiciones de tipos
└── utils/              # Utilidades
```

### Base de Datos (Supabase)

#### Tablas Principales
- **users** - Perfiles de usuario
- **events** - Eventos y espectáculos
- **venues** - Lugares y recintos
- **sections** - Secciones de cada venue
- **seats** - Asientos individuales
- **orders** - Órdenes de compra
- **tickets** - Tickets individuales
- **admin_users** - Usuarios administradores

#### Seguridad
- **Row Level Security (RLS)** habilitado en todas las tablas
- **Políticas de seguridad** específicas por rol
- **Logs de auditoría** para acciones críticas

## 🔧 Desarrollo

### Scripts Disponibles
```bash
npm run dev          # Desarrollo local
npm run build        # Build para producción
npm run preview      # Preview del build
npm run lint         # Linting con ESLint
```

### Hooks Personalizados

#### `useSupabaseAuth`
Manejo completo de autenticación con Supabase:
```typescript
const { user, signIn, signUp, signOut, loading } = useSupabaseAuth();
```

#### `useEvents`
Gestión de eventos con React Query:
```typescript
const { data: events, isLoading, error } = useEvents(filters);
```

#### `useRealtimeEvents`
Subscripciones en tiempo real:
```typescript
const realtimeEvents = useRealtimeEvents();
```

### Componentes Principales

#### `RealtimeEventList`
Lista de eventos con actualizaciones en tiempo real:
```tsx
<RealtimeEventList 
  filters={{ category: 'música', limit: 10 }} 
  showRealTimeIndicator={true}
/>
```

#### `SupabaseAuth`
Componente de autenticación completo:
```tsx
<SupabaseAuth 
  mode="signin" 
  onSuccess={() => navigate('/dashboard')} 
/>
```

## 🚀 Despliegue

### Netlify (Recomendado)
1. Conecta tu repositorio a Netlify
2. Configura las variables de entorno
3. Deploy automático en cada push

### Variables de Entorno en Producción
```env
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=tu-clave-anonima
```

## 🔐 Seguridad

### Autenticación
- Supabase Auth con email/password
- Tokens JWT seguros
- Refresh tokens automáticos

### Autorización
- Row Level Security (RLS)
- Roles de usuario (user, admin, super_admin)
- Permisos granulares

### Validación
- Validación en frontend y backend
- Sanitización de datos
- Rate limiting (configurado en Supabase)

## 📊 Monitoreo

### Logs
- Logs de seguridad en tabla `security_logs`
- Tracking de acciones críticas
- Monitoreo de errores

### Analytics
- Dashboard de administración
- Métricas de ventas
- Reportes en tiempo real

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📝 Licencia

Este proyecto está bajo la Licencia MIT. Ver `LICENSE` para más detalles.

## 🆘 Soporte

Para soporte y preguntas:
- Crear un issue en GitHub
- Email: support@tiketera.com

## 🎯 Roadmap

- [ ] Integración completa con Stripe
- [ ] App móvil con React Native
- [ ] Sistema de notificaciones push
- [ ] Integración con redes sociales
- [ ] Sistema de recomendaciones con IA
- [ ] Marketplace para organizadores