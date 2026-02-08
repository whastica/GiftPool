/**
 * Productos mock para modo desarrollo
 * Base de datos de productos variados para simular scraping
 */

import type { Product } from '../types/wishlistTypes'

export interface MockProduct {
  name: string
  price: number
  image: string
  description: string
  category: 'electronics' | 'home' | 'sports' | 'fashion' | 'gaming' | 'books'
}

// ============================================
// BASE DE DATOS DE PRODUCTOS MOCK
// ============================================

export const MOCK_PRODUCTS: MockProduct[] = [
  // ELECTRONICS
  {
    name: 'Audífonos Bluetooth Sony WH-1000XM5',
    price: 1299900,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&h=500&fit=crop',
    description: 'Audífonos inalámbricos premium con cancelación de ruido inteligente',
    category: 'electronics',
  },
  {
    name: 'MacBook Air M2 13" 256GB',
    price: 5499000,
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500&h=500&fit=crop',
    description: 'Laptop ultradelgada con chip M2, pantalla Retina y batería de larga duración',
    category: 'electronics',
  },
  {
    name: 'iPhone 15 Pro Max 256GB',
    price: 6899000,
    image: 'https://images.unsplash.com/photo-1678652197831-2d180705cd2c?w=500&h=500&fit=crop',
    description: 'Smartphone con cámara profesional, chip A17 Pro y pantalla Super Retina',
    category: 'electronics',
  },
  {
    name: 'iPad Air 10.9" 64GB WiFi',
    price: 2899000,
    image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=500&h=500&fit=crop',
    description: 'Tablet versátil con chip M1, compatible con Apple Pencil',
    category: 'electronics',
  },
  {
    name: 'Samsung Galaxy S24 Ultra 512GB',
    price: 5699000,
    image: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=500&h=500&fit=crop',
    description: 'Smartphone insignia con S Pen, cámara de 200MP y pantalla Dynamic AMOLED',
    category: 'electronics',
  },
  {
    name: 'Apple Watch Series 9 GPS 45mm',
    price: 2199000,
    image: 'https://images.unsplash.com/photo-1434494878577-86c23bcb06b9?w=500&h=500&fit=crop',
    description: 'Reloj inteligente con pantalla Always-On, monitoreo de salud avanzado',
    category: 'electronics',
  },
  {
    name: 'Cámara Canon EOS R6 Mark II',
    price: 11499000,
    image: 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=500&h=500&fit=crop',
    description: 'Cámara mirrorless full-frame, 24.2MP, video 4K 60fps',
    category: 'electronics',
  },
  {
    name: 'DJI Mini 3 Pro Drone',
    price: 3899000,
    image: 'https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=500&h=500&fit=crop',
    description: 'Drone compacto con cámara 4K HDR, 34 min de vuelo',
    category: 'electronics',
  },
  {
    name: 'GoPro HERO12 Black',
    price: 2199000,
    image: 'https://images.unsplash.com/photo-1606041011872-596597976b25?w=500&h=500&fit=crop',
    description: 'Cámara de acción 5.3K, resistente al agua, estabilización HyperSmooth',
    category: 'electronics',
  },
  {
    name: 'Kindle Paperwhite 11va Gen 16GB',
    price: 749000,
    image: 'https://images.unsplash.com/photo-1592496431122-2349e0fbc666?w=500&h=500&fit=crop',
    description: 'E-reader con pantalla de 6.8", resistente al agua, batería semanas',
    category: 'electronics',
  },

  // GAMING
  {
    name: 'PlayStation 5 Standard 825GB',
    price: 2699000,
    image: 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=500&h=500&fit=crop',
    description: 'Consola de nueva generación con lector de discos, gráficos 4K',
    category: 'gaming',
  },
  {
    name: 'Xbox Series X 1TB',
    price: 2599000,
    image: 'https://images.unsplash.com/photo-1621259182978-fbf93132d53d?w=500&h=500&fit=crop',
    description: 'Consola más potente de Xbox, 12 teraflops, 4K nativo',
    category: 'gaming',
  },
  {
    name: 'Nintendo Switch OLED 64GB',
    price: 1799000,
    image: 'https://images.unsplash.com/photo-1578303512597-81e6cc155b3e?w=500&h=500&fit=crop',
    description: 'Consola híbrida con pantalla OLED de 7", portátil y de sobremesa',
    category: 'gaming',
  },
  {
    name: 'Silla Gamer Secretlab Titan Evo',
    price: 2299000,
    image: 'https://images.unsplash.com/photo-1598550476439-6847785fcea6?w=500&h=500&fit=crop',
    description: 'Silla ergonómica premium, respaldo magnético, soporte lumbar ajustable',
    category: 'gaming',
  },
  {
    name: 'Monitor Gamer ASUS ROG 27" 165Hz',
    price: 1899000,
    image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=500&h=500&fit=crop',
    description: 'Monitor gaming QHD, 1ms respuesta, G-SYNC compatible',
    category: 'gaming',
  },
  {
    name: 'Teclado Mecánico Logitech G Pro X',
    price: 699000,
    image: 'https://images.unsplash.com/photo-1595225476474-87563907a212?w=500&h=500&fit=crop',
    description: 'Teclado gaming compacto, switches intercambiables, RGB',
    category: 'gaming',
  },

  // HOME
  {
    name: 'Cafetera Nespresso Vertuo Pop',
    price: 549000,
    image: 'https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=500&h=500&fit=crop',
    description: 'Cafetera de cápsulas, 4 tamaños de taza, compacta',
    category: 'home',
  },
  {
    name: 'Licuadora Vitamix E310 Explorian',
    price: 1899000,
    image: 'https://images.unsplash.com/photo-1585515320310-259814833e62?w=500&h=500&fit=crop',
    description: 'Licuadora profesional, motor 2HP, jarra 1.4L',
    category: 'home',
  },
  {
    name: 'Air Fryer Philips XXL 7.3L',
    price: 1299000,
    image: 'https://images.unsplash.com/photo-1585515320310-259814833e62?w=500&h=500&fit=crop',
    description: 'Freidora de aire extra grande, tecnología Rapid Air',
    category: 'home',
  },
  {
    name: 'Robot Aspiradora Roomba j7+',
    price: 3499000,
    image: 'https://images.unsplash.com/photo-1558317374-067fb5f30001?w=500&h=500&fit=crop',
    description: 'Aspiradora robot con vaciado automático, navegación inteligente',
    category: 'home',
  },
  {
    name: 'Colchón Memory Foam Queen',
    price: 2199000,
    image: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=500&h=500&fit=crop',
    description: 'Colchón viscoelástico 30cm altura, firmeza media',
    category: 'home',
  },
  {
    name: 'Smart TV Samsung 65" QLED 4K',
    price: 4299000,
    image: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=500&h=500&fit=crop',
    description: 'Televisor Quantum Dot, 120Hz, Smart Hub, Alexa integrada',
    category: 'home',
  },

  // SPORTS
  {
    name: 'Bicicleta MTB Trek Marlin 7',
    price: 3899000,
    image: 'https://images.unsplash.com/photo-1576435728678-68d0fbf94e91?w=500&h=500&fit=crop',
    description: 'Bicicleta montaña rin 29, suspensión delantera, 21 velocidades',
    category: 'sports',
  },
  {
    name: 'Patineta Eléctrica Xiaomi Pro 2',
    price: 2199000,
    image: 'https://images.unsplash.com/photo-1588117305388-c2631a279f82?w=500&h=500&fit=crop',
    description: 'Scooter eléctrico 45km autonomía, velocidad 25km/h',
    category: 'sports',
  },
  {
    name: 'Caminadora Eléctrica NordicTrack',
    price: 4599000,
    image: 'https://images.unsplash.com/photo-1576678927484-cc907957088c?w=500&h=500&fit=crop',
    description: 'Banda de correr plegable, inclinación automática, pantalla táctil',
    category: 'sports',
  },
  {
    name: 'Set Mancuernas Ajustables 24kg',
    price: 899000,
    image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=500&h=500&fit=crop',
    description: 'Pesas ajustables 5-24kg, ahorra espacio, agarre ergonómico',
    category: 'sports',
  },
  {
    name: 'Tabla de Surf Wavestorm 8"',
    price: 1299000,
    image: 'https://images.unsplash.com/photo-1502680390469-be75c86b636f?w=500&h=500&fit=crop',
    description: 'Tabla de surf foam ideal principiantes, muy estable',
    category: 'sports',
  },

  // FASHION
  {
    name: 'Tenis Nike Air Max 90',
    price: 599000,
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&h=500&fit=crop',
    description: 'Zapatillas clásicas, suela Air visible, diseño icónico',
    category: 'fashion',
  },
  {
    name: 'Reloj Casio G-Shock Digital',
    price: 549000,
    image: 'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=500&h=500&fit=crop',
    description: 'Reloj resistente a golpes, resistente al agua 200m',
    category: 'fashion',
  },
  {
    name: 'Mochila North Face Borealis 28L',
    price: 459000,
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&h=500&fit=crop',
    description: 'Mochila urbana, compartimento laptop 15", organizadores',
    category: 'fashion',
  },
  {
    name: 'Gafas Ray-Ban Aviator Clásicas',
    price: 799000,
    image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=500&h=500&fit=crop',
    description: 'Gafas de sol icónicas, lentes polarizadas, protección UV',
    category: 'fashion',
  },
  {
    name: 'Chaqueta Columbia Impermeable',
    price: 699000,
    image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500&h=500&fit=crop',
    description: 'Jacket térmico, tecnología Omni-Tech, capucha ajustable',
    category: 'fashion',
  },

  // BOOKS & EDUCATION
  {
    name: 'Tablet Wacom Intuos Pro Medium',
    price: 1899000,
    image: 'https://images.unsplash.com/photo-1612198188060-c7c2a3b66eae?w=500&h=500&fit=crop',
    description: 'Tableta gráfica profesional, 8192 niveles presión, multitáctil',
    category: 'books',
  },
  {
    name: 'Microscopio Digital AmScope 1000x',
    price: 1299000,
    image: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=500&h=500&fit=crop',
    description: 'Microscopio binocular, LED dual, incluye cámara USB',
    category: 'books',
  },
]

// ============================================
// FUNCIONES HELPER
// ============================================

/**
 * Obtiene un producto aleatorio de la base de datos
 */
export const getRandomMockProduct = (): MockProduct => {
  const randomIndex = Math.floor(Math.random() * MOCK_PRODUCTS.length)
  return MOCK_PRODUCTS[randomIndex]
}

/**
 * Obtiene un producto por categoría
 */
export const getMockProductByCategory = (
  category: MockProduct['category']
): MockProduct => {
  const categoryProducts = MOCK_PRODUCTS.filter((p) => p.category === category)
  const randomIndex = Math.floor(Math.random() * categoryProducts.length)
  return categoryProducts[randomIndex] || getRandomMockProduct()
}

/**
 * Intenta detectar la categoría desde la URL
 */
export const detectCategoryFromUrl = (url: string): MockProduct['category'] => {
  const urlLower = url.toLowerCase()

  if (
    urlLower.includes('laptop') ||
    urlLower.includes('iphone') ||
    urlLower.includes('samsung') ||
    urlLower.includes('audifonos') ||
    urlLower.includes('headphone') ||
    urlLower.includes('tablet')
  ) {
    return 'electronics'
  }

  if (
    urlLower.includes('playstation') ||
    urlLower.includes('xbox') ||
    urlLower.includes('nintendo') ||
    urlLower.includes('gaming') ||
    urlLower.includes('gamer')
  ) {
    return 'gaming'
  }

  if (
    urlLower.includes('bicicleta') ||
    urlLower.includes('bike') ||
    urlLower.includes('deporte') ||
    urlLower.includes('gym')
  ) {
    return 'sports'
  }

  if (
    urlLower.includes('cafetera') ||
    urlLower.includes('licuadora') ||
    urlLower.includes('aspiradora') ||
    urlLower.includes('colchon') ||
    urlLower.includes('tv')
  ) {
    return 'home'
  }

  if (
    urlLower.includes('tenis') ||
    urlLower.includes('zapatos') ||
    urlLower.includes('reloj') ||
    urlLower.includes('gafas') ||
    urlLower.includes('mochila')
  ) {
    return 'fashion'
  }

  // Default: random
  return 'electronics'
}

/**
 * Convierte MockProduct a Product
 */
export const mockProductToProduct = (
  mockProduct: MockProduct,
  url: string
): Product => {
  return {
    name: mockProduct.name,
    price: mockProduct.price,
    image: mockProduct.image,
    url: url,
    available: true,
    marketplace: 'mercadolibre',
    description: mockProduct.description,
  }
}