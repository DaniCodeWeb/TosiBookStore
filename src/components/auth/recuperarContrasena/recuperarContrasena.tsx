
// src/components/RecoverModal.tsx
import React, { useState } from 'react';
import { authService, type RecoverPasswordRequest } from '../../../lib/auth';

interface RecoverModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToLogin: () => void;
}

export default function RecoverModal({ 
  isOpen, 
  onClose, 
  onSwitchToLogin 
}: RecoverModalProps) {
  const [formData, setFormData] = useState<RecoverPasswordRequest>({
    email: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Limpiar error cuando el usuario empiece a escribir
    if (error) setError(null);
  };

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.email.trim()) {
      setError('El correo electrónico es requerido');
      return;
    }

    if (!validateEmail(formData.email)) {
      setError('Por favor ingresa un correo electrónico válido');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await authService.recoverPassword(formData);
      console.log('Enviado');
      setSuccess(true);
      
      // Mostrar mensaje de éxito por 3 segundos
      setTimeout(() => {
        onSwitchToLogin();
        resetForm();
      }, 3000);

    } catch (error) {
      setError(error instanceof Error ? error.message : 'Error al enviar el correo de recuperación');
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({ email: '' });
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

          <div className="text-center mb-8">
            <h3 className="text-xl font-semibold mb-2 text-gray-800">¿Olvidaste tu contraseña?</h3>
            <p className="text-gray-700">
              No te preocupes, te enviaremos instrucciones para restablecerla.
            </p>
          </div>

          {success && (
            <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md">
              <p className="text-center">
                ¡Listo! Si tu correo está registrado, recibirás las instrucciones en breve.
              </p>
            </div>
          )}

          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
              <p className="text-center">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Correo electrónico
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Ingresa tu correo electrónico"
                autoComplete="email"
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                disabled={isLoading || success}
              />
            </div>

            <button
              type="submit"
              disabled={isLoading || success}
              className="w-full py-3 bg-yellow-400 hover:bg-yellow-500 text-gray-800 font-medium rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Enviando...' : success ? 'Enviado ✓' : 'Enviar instrucciones'}
            </button>

            <div className="text-center text-sm text-gray-700 pt-4">
              <button 
                type="button"
                onClick={onSwitchToLogin}
                className="text-blue-600 hover:underline"
                disabled={isLoading}
              >
                Volver al inicio de sesión
              </button>
            </div>
          </form>
        </div>

        {/* Lado derecho - Imagen */}
        <div className="hidden md:block md:w-1/2 bg-black/90 p-8 text-white">
          <h2 className="text-2xl font-bold text-yellow-400 mb-8 text-center">RECUPERA TU ACCESO</h2>

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
