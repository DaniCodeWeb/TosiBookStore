import React, { useState } from 'react';
import { authService, type RegisterRequest } from '../../../lib/auth';

interface RegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToLogin: () => void;
}

export default function RegisterModal({ 
  isOpen, 
  onClose, 
  onSwitchToLogin 
}: RegisterModalProps) {
  const [formData, setFormData] = useState<RegisterRequest>({
    email: '',
    nombre: '',
    apellido: '',
    password: ''
  });
  const [confirmPassword, setConfirmPassword] = useState('');
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    if (name === 'confirmPassword') {
      setConfirmPassword(value);
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
    
    // Limpiar error cuando el usuario empiece a escribir
    if (error) setError(null);
  };

  const validateForm = (): string | null => {
    if (!formData.nombre.trim()) return 'El nombre es requerido';
    if (!formData.apellido.trim()) return 'El apellido es requerido';
    if (!formData.email.trim()) return 'El email es requerido';
    if (!formData.password) return 'La contraseña es requerida';
    if (formData.password.length < 6) return 'La contraseña debe tener al menos 6 caracteres';
    if (formData.password !== confirmPassword) return 'Las contraseñas no coinciden';
    if (!acceptTerms) return 'Debes aceptar los términos y condiciones';
    
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await authService.register(formData);
      setSuccess(true);
      
      // Mostrar mensaje de éxito y cambiar a login
      setTimeout(() => {
        onSwitchToLogin();
        setSuccess(false);
        resetForm();
      }, 2000);

    } catch (error) {
      setError(error instanceof Error ? error.message : 'Error al crear la cuenta');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleRegister = () => {
    // Aquí implementarías la lógica de Google OAuth
    console.log('Google register clicked');
  };

  const resetForm = () => {
    setFormData({
      email: '',
      nombre: '',
      apellido: '',
      password: ''
    });
    setConfirmPassword('');
    setAcceptTerms(false);
    setError(null);
    setSuccess(false);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-80" 
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-lg shadow-xl overflow-hidden w-full max-w-4xl mx-4 flex flex-col md:flex-row opacity-90 transform scale-100 opacity-100 transition-all duration-300">
        {/* Botón de cerrar */}
        <button 
          onClick={handleClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 z-10"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Lado izquierdo - Formulario */}
        <div className="w-full md:w-1/2 p-8 bg-gradient-to-b from-gray-400 via-blue-500 to-yellow-400">
          <div className="flex justify-center mb-6">
            <img src="/src/assets/img/Tosilogo1.png" alt="TOSI" className="h-12" />
          </div>

          <div className="text-center mb-6">
            <p className="text-gray-800 text-lg">
              ¡Únete a nuestra comunidad y disfruta de ofertas exclusivas para miembros!
            </p>
          </div>

          {success && (
            <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md">
              <p className="text-center">¡Cuenta creada exitosamente! Revisa tu email para verificar tu cuenta.</p>
            </div>
          )}

          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
              <p className="text-center">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <p className="text-center text-gray-700 mb-2">Completa tus datos para crear una cuenta</p>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <input
                  type="text"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleInputChange}
                  placeholder="Nombre"
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                  disabled={isLoading}
                />
              </div>
              <div>
                <input
                  type="text"
                  name="apellido"
                  value={formData.apellido}
                  onChange={handleInputChange}
                  placeholder="Apellido"
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            <div>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Correo electrónico"
                autoComplete="email"
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                disabled={isLoading}
              />
            </div>

            <div>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Contraseña"
                autoComplete="new-password"
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                disabled={isLoading}
              />
            </div>

            <div>
              <input
                type="password"
                name="confirmPassword"
                value={confirmPassword}
                onChange={handleInputChange}
                placeholder="Confirmar contraseña"
                autoComplete="new-password"
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                disabled={isLoading}
              />
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="terminos"
                checked={acceptTerms}
                onChange={(e) => setAcceptTerms(e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                required
                disabled={isLoading}
              />
              <label htmlFor="terminos" className="ml-2 block text-sm text-gray-600">
                Acepto los <a href="/terminos" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">términos y condiciones</a>
              </label>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-yellow-400 hover:bg-yellow-500 text-gray-800 font-medium rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Creando cuenta...' : 'Crear Cuenta'}
            </button>

            <div className="relative flex items-center justify-center">
              <div className="border-t border-gray-300 w-full"></div>
              <span className="bg-gray-200 px-3 text-sm text-gray-500">o</span>
              <div className="border-t border-gray-300 w-full"></div>
            </div>

            <button
              type="button"
              onClick={handleGoogleRegister}
              disabled={isLoading}
              className="w-full py-3 bg-white border border-gray-300 hover:bg-gray-50 text-gray-800 font-medium rounded-md transition-colors flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Registrate con Google
            </button>

            <div className="text-center text-sm text-gray-600">
              ¿Ya tienes una cuenta? 
              <button 
                type="button"
                onClick={onSwitchToLogin}
                className="text-blue-600 hover:underline ml-1"
                disabled={isLoading}
              >
                Inicia sesión aquí
              </button>
            </div>
          </form>
        </div>

        {/* Lado derecho - Imagen */}
        <div className="hidden md:block md:w-1/2 bg-black/90 p-8 text-white">
          <h2 className="text-2xl font-bold text-yellow-400 mb-8 text-center">ÚNETE A TOSIBOOKSTORE</h2>

          <div className="flex justify-center items-center h-full">
            <img
              src="/src/assets/img/login/pajarosfondo.png"
              alt="Ilustración de libro"
              className="max-w-full max-h-80 object-contain"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
