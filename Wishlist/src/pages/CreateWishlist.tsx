import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Link2,
  Calendar,
  MessageSquare,
  CheckCircle2,
  AlertCircle,
  Gift,
} from 'lucide-react';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';

type FormData = {
  productUrl: string;
  eventTitle: string;
  eventDate: string;
  message: string;
};

type ProductData = {
  name: string;
  price: number;
  image: string;
  available: boolean;
} | null;

const CreateWishlist = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);
  const [loading, setLoading] = useState(false);
  const [productData, setProductData] = useState<ProductData>(null);

  const [formData, setFormData] = useState<FormData>({
    productUrl: '',
    eventTitle: '',
    eventDate: '',
    message: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const loadProduct = async () => {
    if (!formData.productUrl) {
      alert('Por favor ingresa un link de MercadoLibre');
      return;
    }

    setLoading(true);

    // Simular llamada a API para scraping
    setTimeout(() => {
      setProductData({
        name: 'Audífonos Bluetooth Sony WH-1000XM4',
        price: 899900,
        image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop',
        available: true,
      });
      setLoading(false);
      setCurrentStep(2);
    }, 1500);
  };

  const handleSubmit = () => {
    setLoading(true);

    // Simular creación de wishlist
    setTimeout(() => {
      setLoading(false);
      setCurrentStep(3);
    }, 1000);
  };

  const copyLink = () => {
    navigator.clipboard.writeText('https://giftpool.co/w/maria-cumple-2025');
    alert('¡Link copiado al portapapeles!');
  };

  const shareWhatsApp = () => {
    const text = encodeURIComponent(
      '¡Ayúdame a reunir para este regalo! 🎁 https://giftpool.co/w/maria-cumple-2025'
    );
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Progress Steps */}
      <div className="bg-white border-b border-gray-200 py-6">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-center max-w-2xl mx-auto">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex items-center">
                <div
                  className={`
                  w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all
                  ${currentStep > step ? 'bg-green-500 text-white' : ''}
                  ${currentStep === step ? 'gradient-bg text-white scale-110' : ''}
                  ${currentStep < step ? 'bg-gray-200 text-gray-500' : ''}
                `}
                >
                  {currentStep > step ? <CheckCircle2 size={20} /> : step}
                </div>
                <span
                  className={`ml-2 font-medium ${currentStep >= step ? 'text-primary-600' : 'text-gray-400'}`}
                >
                  {step === 1 ? 'Producto' : step === 2 ? 'Detalles' : 'Compartir'}
                </span>
                {step < 3 && (
                  <div
                    className={`w-24 h-1 mx-2 ${currentStep > step ? 'bg-green-500' : 'bg-gray-200'}`}
                  ></div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Crea tu <span className="gradient-text">Wishlist</span>
            </h1>
            <p className="text-xl text-gray-600">
              En menos de 2 minutos tendrás tu página lista para compartir
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Form Column */}
            <div>
              <Card>
                {/* Step 1: Producto */}
                {currentStep === 1 && (
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        <Link2 className="inline w-4 h-4 mr-1" />
                        Link del producto (MercadoLibre)
                      </label>
                      <input
                        type="url"
                        name="productUrl"
                        value={formData.productUrl}
                        onChange={handleInputChange}
                        placeholder="https://articulo.mercadolibre.com.co/..."
                        className="input-field"
                        required
                      />
                      <p className="text-xs text-gray-500 mt-2">
                        Pega el link completo del producto que quieres
                      </p>
                    </div>

                    <Button fullWidth onClick={loadProduct} loading={loading}>
                      Cargar producto
                    </Button>

                    <div className="flex items-start space-x-2 text-sm text-gray-500 bg-blue-50 p-4 rounded-lg">
                      <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                      <span>Por ahora solo soportamos MercadoLibre Colombia</span>
                    </div>
                  </div>
                )}

                {/* Step 2: Detalles */}
                {currentStep === 2 && (
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        🎉 Nombre del evento
                      </label>
                      <input
                        type="text"
                        name="eventTitle"
                        value={formData.eventTitle}
                        onChange={handleInputChange}
                        placeholder="Ej: Cumpleaños de María"
                        className="input-field"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        <Calendar className="inline w-4 h-4 mr-1" />
                        Fecha del evento
                      </label>
                      <input
                        type="date"
                        name="eventDate"
                        value={formData.eventDate}
                        onChange={handleInputChange}
                        className="input-field"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        <MessageSquare className="inline w-4 h-4 mr-1" />
                        Mensaje personal (opcional)
                      </label>
                      <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        rows={4}
                        placeholder="Cuéntales por qué quieres este regalo..."
                        className="input-field resize-none"
                      />
                      <p className="text-xs text-gray-500 mt-2">
                        Esto aparecerá en tu wishlist pública
                      </p>
                    </div>

                    <div className="flex space-x-3">
                      <Button variant="secondary" fullWidth onClick={() => setCurrentStep(1)}>
                        Atrás
                      </Button>
                      <Button fullWidth onClick={handleSubmit} loading={loading}>
                        Continuar
                      </Button>
                    </div>
                  </div>
                )}

                {/* Step 3: Compartir */}
                {currentStep === 3 && (
                  <div className="space-y-6">
                    <div className="bg-green-50 border-2 border-green-200 rounded-lg p-6 text-center">
                      <div className="text-5xl mb-4">🎊</div>
                      <h3 className="text-xl font-bold text-green-900 mb-2">
                        ¡Tu wishlist está lista!
                      </h3>
                      <p className="text-green-700">
                        Ahora solo falta compartirla con tus amigos
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        🔗 Tu link único
                      </label>
                      <div className="flex space-x-2">
                        <input
                          type="text"
                          value="https://giftpool.co/w/maria-cumple-2025"
                          readOnly
                          className="flex-1 px-4 py-3 bg-gray-100 border-2 border-gray-200 rounded-lg"
                        />
                        <Button onClick={copyLink}>📋</Button>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                      <button
                        onClick={shareWhatsApp}
                        className="py-3 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600 transition"
                      >
                        <span className="block text-xl mb-1">📱</span>
                        <span className="text-sm">WhatsApp</span>
                      </button>
                      <button className="py-3 bg-pink-500 text-white font-semibold rounded-lg hover:bg-pink-600 transition">
                        <span className="block text-xl mb-1">📸</span>
                        <span className="text-sm">Instagram</span>
                      </button>
                      <button className="py-3 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition">
                        <span className="block text-xl mb-1">✉️</span>
                        <span className="text-sm">Email</span>
                      </button>
                    </div>

                    <Button fullWidth onClick={() => navigate('/dashboard')}>
                      Ver mi dashboard
                    </Button>
                  </div>
                )}
              </Card>
            </div>

            {/* Preview Column */}
            <div className="space-y-6">
              {/* Product Preview */}
              {productData ? (
                <Card className="animate-fade-in-up">
                  <img
                    src={productData.image}
                    alt={productData.name}
                    className="w-full h-64 object-cover rounded-lg mb-4"
                  />
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {productData.name}
                  </h3>
                  <p className="text-3xl font-bold text-primary-600 mb-4">
                    ${productData.price.toLocaleString()} COP
                  </p>
                  {productData.available && (
                    <div className="bg-green-100 text-green-800 px-4 py-2 rounded-lg text-sm font-medium inline-block">
                      ✓ Disponible
                    </div>
                  )}
                </Card>
              ) : (
                <Card className="text-center text-gray-400 py-12">
                  <Gift className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                  <p className="text-lg font-medium">Vista previa del producto</p>
                  <p className="text-sm">Pega un link para ver cómo se verá</p>
                </Card>
              )}

              {/* Tips Card */}
              <Card className="bg-blue-50 border-2 border-blue-200">
                <h3 className="font-bold text-blue-900 mb-3 flex items-center">
                  <span className="text-2xl mr-2">💡</span>
                  Tips para tu wishlist
                </h3>
                <ul className="space-y-2 text-sm text-blue-800">
                  <li className="flex items-start">
                    <span className="mr-2">✓</span>
                    <span>Elige productos populares y disponibles</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">✓</span>
                    <span>Escribe un mensaje personal y emotivo</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">✓</span>
                    <span>Comparte pronto para dar tiempo a aportar</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">✓</span>
                    <span>Recuerda que cobramos 5% de comisión</span>
                  </li>
                </ul>
              </Card>

              {/* Stats Card */}
              <Card className="gradient-bg text-white">
                <h3 className="font-bold text-lg mb-4">¿Sabías que...?</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span>Tasa de éxito promedio</span>
                    <span className="font-bold text-2xl">95%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Tiempo promedio</span>
                    <span className="font-bold text-2xl">3 días</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Colaboradores promedio</span>
                    <span className="font-bold text-2xl">12</span>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateWishlist;