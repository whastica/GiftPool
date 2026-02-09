# 🎁 GiftPool

Aplicación GiftPool - Plataforma para organizar regalos grupales con transparencia y video-mensajes emocionales.

## 🚀 Tecnologías

- **React 18** - Biblioteca de UI
- **Vite** - Build tool y dev server
- **TailwindCSS** - Framework CSS utility-first
- **React Router v6** - Enrutamiento
- **Axios** - Cliente HTTP
- **Lucide React** - Iconos

## 📁 Estructura del Proyecto

```
frontend/
├── public/                 # Archivos estáticos
├── src/
│   ├── components/        # Componentes reutilizables
│   │   ├── common/       # Navbar, Footer, Button, Modal, etc.
│   │   └── wishlist/     # Componentes específicos de wishlist
│   ├── pages/            # Páginas principales
│   │   ├── Home.jsx      # Landing page
│   │   ├── CreateWishlist.jsx
│   │   ├── WishlistPage.jsx
│   │   ├── Dashboard.jsx
│   │   └── NotFound.jsx
│   ├── hooks/            # Custom hooks
│   ├── services/         # API services
│   ├── utils/            # Funciones helper
│   ├── assets/           # Imágenes, fonts, etc.
│   ├── App.jsx          # Componente raíz con rutas
│   ├── main.jsx         # Entry point
│   └── index.css        # Estilos globales
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
└── README.md
```

## 🎯 Features Implementadas

### Páginas
- ✅ **Home (/)** - Landing page con hero section, features, testimonios y CTA
- ✅ **Crear Wishlist (/crear-wishlist)** - Flujo de 3 pasos para crear wishlist
- ✅ **Wishlist Pública (/w/:slug)** - Vista pública con progreso y opción de aportar
- ✅ **Dashboard (/dashboard)** - Panel para gestionar todas las wishlists
- ✅ **404 (*)** - Página de error personalizada

### Componentes Reutilizables
- ✅ **Navbar** - Navegación con versión transparente para hero
- ✅ **Footer** - Footer con links y redes sociales
- ✅ **Button** - Botón con múltiples variantes (primary, secondary, outline, ghost)
- ✅ **Card** - Contenedor con sombras y hover effects
- ✅ **Modal** - Modal reutilizable con backdrop y animaciones
- ✅ **ProgressBar** - Barra de progreso para wishlists

### Utilidades
- ✅ **API Service** - Cliente Axios configurado con interceptores
- ✅ **Helpers** - Funciones para formateo, validación, etc.
- ✅ **Custom Hooks** - useForm, useDebounce, useLocalStorage, etc.

## 🛠️ Instalación

### Prerrequisitos
- Node.js 18+ 
- npm o yarn

### Pasos

1. **Clonar el repositorio**
```bash
git clone https://github.com/tuusuario/giftpool.git
cd giftpool/frontend
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Configurar variables de entorno**
```bash
cp .env.example .env
```

Edita el archivo `.env` con tus credenciales:
```env
VITE_API_URL=http://localhost:3000/api
VITE_WOMPI_PUBLIC_KEY=pub_test_xxxxx
```

4. **Iniciar servidor de desarrollo**
```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:5173`

## 📦 Scripts Disponibles

```bash
# Desarrollo
npm run dev          # Inicia servidor de desarrollo

# Producción
npm run build        # Construye para producción
npm run preview      # Preview del build de producción

# Utilidades
npm run lint         # Ejecuta ESLint
```

## 🎨 Diseño y Estilos

### Paleta de Colores
```css
/* Primary (Púrpura) */
primary-600: #7c3aed
primary-700: #6d28d9

/* Secondary (Rosa) */
secondary-600: #d946ef
secondary-700: #c026d3

/* Gradientes */
gradient-bg: linear-gradient(to right, #7c3aed, #d946ef)
```

### Tipografía
- **Principal**: Outfit (Google Fonts)
- **Handwritten**: Caveat (Google Fonts)

### Componentes de UI
Los componentes siguen principios de diseño consistentes:
- Bordes redondeados generosos (rounded-2xl, rounded-full)
- Sombras sutiles (shadow-lg)
- Animaciones suaves (transition-all duration-200)
- Estados hover interactivos
- Diseño responsive con mobile-first

## 🔌 Integración con Backend

El frontend está preparado para conectarse con el backend mediante:

```javascript
// src/services/api.js
import { wishlistAPI } from './services/api'

// Crear wishlist
const wishlist = await wishlistAPI.create({
  title: 'Cumpleaños de María',
  productUrl: 'https://...',
  eventDate: '2025-03-15',
  message: 'Mensaje personal'
})

// Obtener wishlist por slug
const wishlist = await wishlistAPI.getBySlug('maria-cumple-2025')

// Crear contribución
await contributionAPI.create(wishlistId, {
  contributorName: 'Juan Pérez',
  amount: 50000,
  videoMessage: File
})
```

## 🚢 Deploy

### Vercel (Recomendado)

1. **Conecta tu repositorio con Vercel**
```bash
npm install -g vercel
vercel login
vercel
```

2. **Configura variables de entorno en Vercel Dashboard**
- `VITE_API_URL`
- `VITE_WOMPI_PUBLIC_KEY`

3. **Deploy automático**
```bash
vercel --prod
```

### Netlify

1. **Conecta repositorio en Netlify Dashboard**
2. **Build settings:**
   - Build command: `npm run build`
   - Publish directory: `dist`
3. **Configura variables de entorno**

### Build manual

```bash
npm run build
```

Los archivos se generarán en la carpeta `dist/` lista para ser servida por cualquier servidor estático.

## 📱 Responsive Design

La aplicación está completamente optimizada para:
- 📱 Mobile (< 768px)
- 💻 Tablet (768px - 1024px)
- 🖥️ Desktop (> 1024px)

Breakpoints de Tailwind:
```javascript
sm: '640px'   // Teléfonos grandes
md: '768px'   // Tablets
lg: '1024px'  // Laptops
xl: '1280px'  // Desktops
2xl: '1536px' // Monitores grandes
```

## 🎯 Próximos Pasos

### Funcionalidades Pendientes
- [ ] Sistema de autenticación completo (login/register)
- [ ] Integración real con Wompi para pagos
- [ ] Grabación y procesamiento de videos
- [ ] Notificaciones en tiempo real
- [ ] Sistema de búsqueda de wishlists
- [ ] Perfil de usuario editable
- [ ] Analytics y métricas

### Mejoras Técnicas
- [ ] Testing con Vitest + React Testing Library
- [ ] State management con Zustand o Context API
- [ ] Error boundaries
- [ ] Skeleton loaders
- [ ] Infinite scroll en listas
- [ ] PWA (Progressive Web App)
- [ ] Internacionalización (i18n)

## 🐛 Debugging

### Problemas Comunes

**Error: Cannot find module**
```bash
rm -rf node_modules package-lock.json
npm install
```

**Puerto 5173 ocupado**
```bash
# Edita vite.config.js
server: {
  port: 3001
}
```

**Estilos de Tailwind no cargan**
```bash
# Verifica que index.css esté importado en main.jsx
import './index.css'
```

## 📚 Recursos

- [React Docs](https://react.dev/)
- [Vite Docs](https://vitejs.dev/)
- [TailwindCSS Docs](https://tailwindcss.com/)
- [React Router Docs](https://reactrouter.com/)
- [Lucide Icons](https://lucide.dev/)

## 🤝 Contribuir

1. Fork el proyecto
2. Crea tu feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push al branch (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la licencia MIT.

## 👤 Autor

**Tu Nombre**
- Email: tu@email.com
- GitHub: [@tuusuario](https://github.com/tuusuario)

---

**¿Listo para revolucionar los regalos grupales? 🚀**
# 🎁 GiftPool

<div align="center">

![GiftPool Banner](https://via.placeholder.com/1200x300/7c3aed/ffffff?text=GiftPool+-+La+forma+moderna+de+regalar+en+grupo)

**La plataforma moderna para crear y gestionar regalos grupales**

[![React](https://img.shields.io/badge/React-18.2.0-61dafb?logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178c6?logo=typescript)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-5.1.0-646cff?logo=vite)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind-3.4.1-38bdf8?logo=tailwindcss)](https://tailwindcss.com/)
[![React Query](https://img.shields.io/badge/React_Query-5.90-ff4154?logo=reactquery)](https://tanstack.com/query)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)

[Demo en Vivo](#) · [Reportar Bug](https://github.com/tuusuario/giftpool/issues) · [Solicitar Feature](https://github.com/tuusuario/giftpool/issues)

</div>

---

## 📋 Tabla de Contenidos

- [Sobre el Proyecto](#-sobre-el-proyecto)
- [Demo](#-demo)
- [Características](#-características)
- [Stack Tecnológico](#-stack-tecnológico)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [Comenzando](#-comenzando)
- [Scripts Disponibles](#-scripts-disponibles)
- [Uso](#-uso)
- [Roadmap](#-roadmap)
- [Contribuir](#-contribuir)
- [Licencia](#-licencia)
- [Contacto](#-contacto)

---

## 🎯 Sobre el Proyecto

GiftPool es una aplicación web moderna que **revoluciona la forma de hacer regalos grupales** (conocidos como "vacas" en Latinoamérica). Olvídate de los caóticos chats de WhatsApp, el efectivo y la falta de transparencia.

### 🤔 El Problema

- 📱 Coordinación caótica por WhatsApp
- 💸 Manejo manual de dinero en efectivo
- ❓ Falta de transparencia en las contribuciones
- 😰 Estrés al organizar regalos grupales
- 🎥 Sin forma de compartir videos de felicitación

### ✨ La Solución

GiftPool centraliza todo el proceso en una plataforma digital:

- ✅ Crea wishlists vinculadas a productos reales (MercadoLibre)
- ✅ Comparte con un simple link
- ✅ Tracking en tiempo real del progreso
- ✅ Pagos seguros integrados
- ✅ Videos de felicitación incluidos
- ✅ Interfaz moderna y fácil de usar

---

## 🎬 Demo

### 🖼️ Capturas de Pantalla

<div align="center">

| Dashboard | Crear Wishlist | Vista Pública |
|-----------|----------------|---------------|
| ![Dashboard](https://via.placeholder.com/300x200/7c3aed/ffffff?text=Dashboard) | ![Crear](https://via.placeholder.com/300x200/ec4899/ffffff?text=Wizard) | ![Pública](https://via.placeholder.com/300x200/3b82f6/ffffff?text=Vista+Publica) |

</div>

### 🎥 Video Demo

> 📹 [Ver demo en YouTube](#) *(Próximamente)*

### 🧪 Prueba la App

**Credenciales de prueba:**
```
Email: demo@giftpool.co
Password: demo123
```

👉 **[Probar GiftPool](#)** *(Deploy pendiente)*

---

## ⚡ Características

### 🎯 Core Features (Implementadas)

- ✅ **Autenticación Completa**
  - Login/Register con validación
  - Persistencia de sesión
  - Rutas protegidas

- ✅ **Creación de Wishlists**
  - Wizard intuitivo de 3 pasos
  - Integración con productos de MercadoLibre
  - Preview en tiempo real
  - Slug único auto-generado

- ✅ **Dashboard Personalizado**
  - Vista de todas tus wishlists
  - Filtros: Activas, Completadas, Expiradas
  - Estadísticas en tiempo real
  - Búsqueda instantánea

- ✅ **Página Pública Compartible**
  - URL única por wishlist (`/w/slug`)
  - Progress bar visual
  - Lista de contribuidores
  - Compartir en redes sociales

- ✅ **Flujo de Contribución**
  - Modal multi-step
  - Grabación de video de felicitación
  - Múltiples métodos de pago
  - Opción de contribución anónima

- ✅ **Sistema Robusto**
  - Gestión de estado con React Query
  - Caché inteligente
  - Reintentos automáticos
  - Manejo de errores centralizado
  - Loading states consistentes
  - Notificaciones toast

### 🎨 UX/UI

- 🌈 Diseño moderno con gradientes
- 📱 Completamente responsive
- ⚡ Animaciones fluidas
- 🎭 Loading skeletons
- 🎨 Sistema de diseño consistente
- 🌙 *Modo oscuro (próximamente)*

### 🔧 Developer Experience

- 🚀 Vite para desarrollo ultrarrápido
- 📘 TypeScript en todo el proyecto
- 🎣 Custom hooks reutilizables
- 🧩 Componentes modulares
- 📦 React Query para data fetching
- 🔍 ESLint configurado
- 📝 Código bien documentado

---

## 🛠️ Stack Tecnológico

### Frontend

| Tecnología | Versión | Propósito |
|------------|---------|-----------|
| [React](https://reactjs.org/) | 18.2.0 | UI Framework |
| [TypeScript](https://www.typescriptlang.org/) | 5.x | Type Safety |
| [Vite](https://vitejs.dev/) | 5.1.0 | Build Tool |
| [React Router](https://reactrouter.com/) | 6.22.0 | Routing |
| [TanStack Query](https://tanstack.com/query) | 5.90.20 | Data Fetching |
| [TailwindCSS](https://tailwindcss.com/) | 3.4.1 | Styling |
| [Axios](https://axios-http.com/) | 1.6.7 | HTTP Client |
| [Lucide React](https://lucide.dev/) | 0.344.0 | Iconos |
| [React Hot Toast](https://react-hot-toast.com/) | 2.6.0 | Notificaciones |

### Backend

> ⚠️ **En Desarrollo Activo**
> 
> El backend está actualmente en desarrollo. El frontend funciona con un sistema de mocks que simula todas las funcionalidades.
> 
> **Stack Backend Planeado:**
> - Node.js + Express
> - PostgreSQL
> - JWT Authentication
> - MercadoPago/PayPal Integration
> - AWS S3 (videos)
> - SendGrid (emails)
>
> 📅 **Timeline estimado:** 4-6 semanas

### DevOps (Planeado)

- **Hosting:** Vercel (Frontend) + Railway/Heroku (Backend)
- **Database:** PostgreSQL (Supabase/Railway)
- **Storage:** AWS S3 / Cloudinary
- **Monitoring:** Sentry
- **Analytics:** Google Analytics / Mixpanel

---

## 📁 Estructura del Proyecto

```
giftpool-frontend/
├── public/                     # Assets estáticos
├── src/
│   ├── components/             # Componentes React
│   │   ├── ui/                 # Componentes base (Button, Card, Modal)
│   │   ├── common/             # Componentes reutilizables
│   │   ├── dashboard/          # Dashboard del usuario
│   │   ├── wishlist/           # Creación y visualización
│   │   ├── contribute/         # Flujo de contribución
│   │   ├── error/              # Manejo de errores
│   │   └── auth/               # Autenticación
│   │
│   ├── pages/                  # Páginas principales
│   │   ├── Dashboard.tsx
│   │   ├── CreateWishlistPage.tsx
│   │   ├── PublicWishlistPage.tsx
│   │   ├── LoginPage.tsx
│   │   └── RegisterPage.tsx
│   │
│   ├── hooks/                  # Custom Hooks
│   │   ├── queries/            # React Query queries
│   │   ├── mutations/          # React Query mutations
│   │   ├── useAuth.ts
│   │   ├── useDashboard.ts
│   │   └── usePublicWishlist.ts
│   │
│   ├── services/               # Servicios y APIs
│   │   ├── authService.ts
│   │   ├── wishlistService.ts
│   │   ├── wishlistStorage.ts  # LocalStorage manager
│   │   ├── paymentService.ts
│   │   ├── videoService.ts
│   │   ├── mockProducts.ts     # 34 productos mock
│   │   └── errorHandler.ts
│   │
│   ├── lib/                    # Configuraciones
│   │   ├── queryClient.ts      # React Query config
│   │   ├── react-query.ts      # Query keys factory
│   │   └── toast.tsx           # Sistema de toasts
│   │
│   ├── utils/                  # Utilidades
│   │   ├── wishlistUtils.ts    # 20+ helper functions
│   │   ├── tokenUtils.ts
│   │   └── metaTagsUtils.ts
│   │
│   ├── types/                  # TypeScript types
│   │   ├── wishlistTypes.ts
│   │   ├── authTypes.ts
│   │   └── publicWishlistTypes.ts
│   │
│   ├── context/                # React Context
│   │   └── AuthContext.tsx
│   │
│   ├── providers/              # Providers
│   │   └── QueryProvider.tsx
│   │
│   ├── routes/                 # Configuración de rutas
│   │   └── RoutesIndex.tsx
│   │
│   ├── index.css               # Estilos globales
│   ├── main.tsx                # Entry point
│   └── App.tsx                 # Root component
│
├── tailwind.config.js
├── vite.config.ts
├── tsconfig.json
└── package.json
```

---

## 🚀 Comenzando

### Prerequisitos

- Node.js 18+ ([Descargar](https://nodejs.org/))
- npm o yarn o pnpm

### Instalación

1. **Clonar el repositorio**
   ```bash
   git clone https://github.com/tuusuario/giftpool.git
   cd giftpool
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   # o
   yarn install
   # o
   pnpm install
   ```

3. **Configurar variables de entorno**
   ```bash
   cp .env.example .env
   ```
   
   Edita `.env`:
   ```env
   VITE_API_URL=http://localhost:3000/api
   VITE_MOCK_MODE=true
   ```

4. **Iniciar servidor de desarrollo**
   ```bash
   npm run dev
   ```

5. **Abrir en el navegador**
   ```
   http://localhost:5173
   ```

---

## 📜 Scripts Disponibles

```bash
# Desarrollo
npm run dev          # Iniciar servidor de desarrollo (HMR)

# Build
npm run build        # Compilar para producción
npm run preview      # Preview del build de producción

# Code Quality
npm run lint         # Ejecutar ESLint
npm run lint:fix     # Arreglar errores de linting automáticamente

# TypeScript
npm run type-check   # Verificar tipos sin compilar
```

---

## 💡 Uso

### 🎯 Flujo Básico

1. **Registro/Login**
   - Crea una cuenta o usa las credenciales demo
   - Email: `demo@giftpool.co` | Password: `demo123`

2. **Crear Wishlist**
   - Click en "Nueva Wishlist"
   - Pega un link de MercadoLibre
   - Completa los detalles del evento
   - ¡Comparte el link generado!

3. **Recibir Contribuciones**
   - Los amigos abren el link
   - Aportan el monto que deseen
   - Graban video de felicitación (opcional)
   - Eligen método de pago

4. **Seguimiento**
   - Ve el progreso en tiempo real
   - Mira quién ha contribuido
   - Reproduce los videos de felicitación

### 🧪 Testing con Mocks

El proyecto incluye un sistema completo de mocks que simula:

- ✅ Autenticación (JWT simulado)
- ✅ CRUD de wishlists (localStorage)
- ✅ 34 productos diferentes (6 categorías)
- ✅ Procesamiento de pagos (MercadoPago, PayPal, Nequi)
- ✅ Upload de videos

**URLs de prueba para productos:**
```
https://www.mercadolibre.com.co/laptop-macbook
https://www.mercadolibre.com.co/playstation-5
https://www.mercadolibre.com.co/iphone-15-pro
https://www.mercadolibre.com.co/bicicleta-mtb
```

---

## 🗺️ Roadmap

### ✅ Fase 1: Frontend Core (Completada)

- [x] Setup del proyecto (Vite + React + TS)
- [x] Sistema de diseño y componentes UI
- [x] Autenticación completa
- [x] Creación de wishlists (wizard)
- [x] Dashboard con filtros y búsqueda
- [x] Página pública compartible
- [x] Flujo de contribución multi-step
- [x] React Query + Error handling
- [x] Sistema de notificaciones

### 🔄 Fase 2: Backend (En Desarrollo)

- [ ] API REST con Node.js + Express
- [ ] Base de datos PostgreSQL
- [ ] Autenticación real (JWT + refresh tokens)
- [ ] Integración con MercadoLibre API
- [ ] Pasarelas de pago (MercadoPago, PayPal)
- [ ] Upload de videos a S3/Cloudinary
- [ ] Sistema de notificaciones (SendGrid)
- [ ] WebSockets para updates en tiempo real

### 🔮 Fase 3: Features Avanzadas (Futuro)

- [ ] Tests E2E (Cypress/Playwright)
- [ ] Tests unitarios (Vitest)
- [ ] Performance optimizations
- [ ] Modo oscuro
- [ ] PWA (Progressive Web App)
- [ ] Internacionalización (i18n)
- [ ] Analytics dashboard
- [ ] Sistema de referidos
- [ ] Wishlist templates
- [ ] Integración con más e-commerce
- [ ] App móvil (React Native)

---

## 🤝 Contribuir

¡Las contribuciones son bienvenidas! Este proyecto está en desarrollo activo.

### Cómo Contribuir

1. **Fork el proyecto**
2. **Crea una rama para tu feature**
   ```bash
   git checkout -b feature/AmazingFeature
   ```
3. **Commit tus cambios**
   ```bash
   git commit -m 'feat: Add some AmazingFeature'
   ```
4. **Push a la rama**
   ```bash
   git push origin feature/AmazingFeature
   ```
5. **Abre un Pull Request**

### Convenciones de Commits

Usamos [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: Nueva característica
fix: Corrección de bug
docs: Cambios en documentación
style: Formato, punto y coma faltantes, etc
refactor: Refactorización de código
test: Agregar tests
chore: Mantenimiento
```

### Guías de Estilo

- **TypeScript:** Strict mode habilitado
- **React:** Functional components + hooks
- **CSS:** TailwindCSS utility-first
- **Naming:** camelCase para variables, PascalCase para componentes

---

## 🐛 Reportar Bugs

¿Encontraste un bug? [Abre un issue](https://github.com/tuusuario/giftpool/issues/new) con:

- 🐛 Descripción clara del problema
- 📋 Pasos para reproducir
- 🖼️ Screenshots si aplica
- 💻 Información del entorno (OS, navegador, versión)

---

## 📄 Licencia

Distribuido bajo la licencia MIT. Ver `LICENSE` para más información.

---

## 👥 Equipo

**Desarrollador Principal**
- Tu Nombre - [@tuusuario](https://twitter.com/tuusuario)

**Diseño**
- Diseñador - [@diseñador](#)

---

## 🙏 Agradecimientos

- [React](https://reactjs.org/)
- [TailwindCSS](https://tailwindcss.com/)
- [Lucide Icons](https://lucide.dev/)
- [React Query](https://tanstack.com/query)
- [Vite](https://vitejs.dev/)
- Comunidad de Open Source

---

## 📞 Contacto

**Sitio Web:** [giftpool.co](#) *(Próximamente)*

**Email:** contacto@giftpool.co

**GitHub:** [@tuusuario](https://github.com/tuusuario)

**Twitter:** [@giftpool_co](https://twitter.com/giftpool_co)

---

## 💼 Estado del Proyecto

```diff
+ Frontend: ✅ Completado (v1.0)
! Backend: 🚧 En Desarrollo
- Deploy: ⏳ Pendiente
```

### Siguiente Milestone

> 🎯 **Backend MVP** - Autenticación + CRUD + Pagos básicos
> 
> **ETA:** Febrero 2026

---

<div align="center">

**⭐ Si te gusta el proyecto, dale una estrella en GitHub ⭐**

Hecho con ❤️ y ☕ por el equipo de GiftPool

[⬆ Volver arriba](#-giftpool)

</div>