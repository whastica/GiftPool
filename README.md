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
