// Format currency
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
  }).format(amount);
}

// Format date
export const formatDate = (date: string | Date): string => {
  return new Date(date).toLocaleDateString('es-CO', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

// Format relative time (e.g., "hace 2 horas")
export const formatRelativeTime = (date: string | Date): string => {
  const now = new Date();
  const past = new Date(date);
  const diffInSeconds = Math.floor((now.getTime() - past.getTime()) / 1000);

  if (diffInSeconds < 60) return 'Hace un momento';
  if (diffInSeconds < 3600) return `Hace ${Math.floor(diffInSeconds / 60)} minutos`;
  if (diffInSeconds < 86400) return `Hace ${Math.floor(diffInSeconds / 3600)} horas`;
  if (diffInSeconds < 604800) return `Hace ${Math.floor(diffInSeconds / 86400)} días`;

  return formatDate(date);
}

// Generate slug from text
export const generateSlug = (text: string): string => {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove accents
    .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
    .trim();
};

// Calculate percentage
export const calculatePercentage = (current: number, target: number): number => {
  if (target === 0) return 0;
  return Math.min((current / target) * 100, 100);
};

// Validate Colombian phone number
export const validatePhone = (phone: string): boolean => {
  const phoneRegex = /^(\+57|57)?3[0-9]{9}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
};

// Validate email
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Copy to clipboard
export const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    console.error('Failed to copy:', err);
    return false;
  }
};

// Share via WhatsApp
export const shareOnWhatsApp = (text: string, url: string): void => {
  const message = encodeURIComponent(`${text} ${url}`);
  window.open(`https://wa.me/?text=${message}`, '_blank');
};

// Share via native share API
export const shareNative = async (title: string, text: string, url: string): Promise<boolean> => {
  if (navigator.share) {
    try {
      await navigator.share({ title, text, url });
      return true;
    } catch (err) {
      console.error('Error sharing:', err);
      return false;
    }
  }
  return false;
};

// Get status color
export const getStatusColor = (status: 'active' | 'completed' | 'expired' | 'cancelled'): string => {
  const colors: Record<string, string> = {
    active: 'green',
    completed: 'blue',
    expired: 'red',
    cancelled: 'gray',
  };
  return colors[status] || 'gray';
};

// Truncate text
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

// Parse MercadoLibre URL
export const parseMercadoLibreUrl = (url: string): { productId: string | null; valid: boolean } | null => {
  try {
    const urlObj = new URL(url);
    if (!urlObj.hostname.includes('mercadolibre.com')) {
      return null;
    }
    const productId = url.match(/ML[A-Z]\d+/)?.[0] || null;
    return { productId, valid: !!productId };
  } catch {
    return null;
  }
};

// Calculate commission
export const calculateCommission = (amount: number, rate = 0.05): number => {
  return amount * rate;
};

// Get days until date
export const getDaysUntil = (date: string | Date): number => {
  const now = new Date();
  const target = new Date(date);
  const diffTime = target.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

// Format file size
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
};